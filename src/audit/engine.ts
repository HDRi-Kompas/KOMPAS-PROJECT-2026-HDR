/**
 * KOMPAS - Metadata Quality Index (MQI) Audit Engine (v7)
 * Evaluates 32 Metadata Elements (E01–E32) dynamically configured from JSON,
 * computes Skor A (32 elemen), MQI Biner (32 elemen), MQI Diperluas (32 elemen),
 * Skor Inti (26 elemen), and Skor Ekstensi (E27–E32),
 * supports O / U / M assessment modes, and implements all 13 special cases from real metadata.
 */

import { AUDIT_RULE_REGISTRY } from './registry';
import { METHODOLOGY_METADATA, MQI_CATEGORIES } from './methodology';
import { auditConsistency } from './consistency';
import { evaluateIso19115_3Extensions } from './extensions';
import {
  getConfigElements,
  getOpenDecisions,
  getRuleVersion,
  CATEGORY_NAME_TO_KEY,
  ElementConfigItem,
} from './configLoader';
import { calculateV7Scores, V7ScoreResult } from './v7Scoring';
import { evaluateQualityFlags, QualityFlagResult } from './flags';
import {
  AuditReport,
  CategorySummary,
  DatasetProfileId,
  ISO19115ComplianceReport,
  ISO19115CoreElementCheck,
  MQICategory,
  MQIScoreReport,
  NormalizedMetadata,
  NormalizedSpatialData,
  ParameterAuditResult,
} from '../types/audit';

export function runDatasetAudit(
  profileId: DatasetProfileId,
  metadata?: NormalizedMetadata,
  spatial?: NormalizedSpatialData,
  datasetNameOverride?: string,
  manualOverrides?: Record<string, { value: number; notes: string; auditorName?: string; updatedAt: string }>,
  auditorNotes?: string,
  rawXmlOrJsonText = ''
): AuditReport {
  const timestamp = new Date().toISOString();
  const datasetName = datasetNameOverride || metadata?.title || spatial?.fileName || 'Dataset Kelautan Tanpa Judul';

  const rawFormat = metadata?.rawFormat || 'unknown';
  const isMdb = metadata?.xmlRootElement === 'mdb:MD_Metadata' || metadata?.isMdbFormat === true || rawFormat === 'xml_iso19115_3';
  const isIso19139 = rawFormat === 'xml_iso19139' || metadata?.xmlRootElement === 'gmd:MD_Metadata';
  const isEsri = rawFormat === 'xml_esri';
  const isJson = rawFormat === 'json_catalog';

  const statusSkema: 'gmd' | 'mdb' | 'ESRI' | 'CKAN' | 'unknown' = isMdb
    ? 'mdb'
    : isIso19139
    ? 'gmd'
    : isEsri
    ? 'ESRI'
    : isJson
    ? 'CKAN'
    : 'unknown';

  const elementsConfig = getConfigElements();
  const openDecisions = getOpenDecisions();
  const ruleVersion = getRuleVersion();

  // 1. Evaluate AUDIT_RULE_REGISTRY (for ISO 19115 compliance & legacy checks)
  const registryResults: ParameterAuditResult[] = [];
  const provisionalReasons: string[] = [];

  for (const rule of AUDIT_RULE_REGISTRY) {
    const isProfileApplicable = rule.applicableProfiles === 'all' || rule.applicableProfiles.includes(profileId);
    let outcome: ReturnType<typeof rule.evaluate>;

    if (!isProfileApplicable) {
      outcome = {
        status: 'tidak_berlaku',
        valueFound: null,
        findingMessage: `Parameter tidak berlaku untuk profil data "${profileId}".`,
      };
    } else if (!metadata) {
      outcome = {
        status: 'belum_diperiksa',
        valueFound: null,
        findingMessage: 'Berkas metadata pendukung tidak tersedia.',
      };
    } else {
      try {
        outcome = rule.evaluate(metadata, spatial);
      } catch (err: any) {
        outcome = {
          status: 'belum_diperiksa',
          valueFound: null,
          findingMessage: `Kesalahan saat mengevaluasi aturan: ${err?.message}`,
        };
      }
    }

    const isMandatory = rule.isMandatoryInProfile(profileId);
    if (isProfileApplicable && isMandatory && (outcome.status === 'tidak_terpenuhi' || outcome.status === 'tidak_valid')) {
      provisionalReasons.push(`Parameter wajib "${rule.name}" (${rule.id}) berstatus ${outcome.status}.`);
    }

    const scoreContribution = outcome.status === 'terpenuhi' ? 1 * rule.weight : 0;

    registryResults.push({
      ruleId: rule.id,
      elementId: rule.elementId,
      name: rule.name,
      category: rule.category,
      importance: rule.importance,
      weight: rule.weight,
      source: rule.source,
      status: outcome.status,
      scoreContribution,
      valueFound: outcome.valueFound,
      expectedFormat: rule.expectedFormat,
      iso19115Tag: rule.iso19115Tag,
      isIso19115Core: rule.isIso19115Core,
      sourcePath: outcome.sourcePath,
      evidenceSnippet: outcome.evidenceSnippet,
      findingMessage: outcome.findingMessage,
      recommendation: outcome.recommendation,
      technicalDetails: outcome.technicalDetails,
    });
  }

  // Calculate Registry Original MQI and Adapted MQI
  const originalRules = registryResults.filter(
    r => r.source === 'jurnal_hasara_2026' && r.status !== 'tidak_berlaku'
  );
  let origNumerator = 0;
  let origDenominator = 0;
  for (const r of originalRules) {
    if (r.status === 'terpenuhi') origNumerator += r.weight;
    origDenominator += r.weight;
  }
  const originalScore = origDenominator > 0 ? Math.round((origNumerator / origDenominator) * 1000) / 10 : null;

  const evaluatedRules = registryResults.filter(r => r.status !== 'tidak_berlaku');
  let adaptedNumerator = 0;
  let adaptedDenominator = 0;
  for (const r of evaluatedRules) {
    if (r.status === 'terpenuhi') adaptedNumerator += r.weight;
    adaptedDenominator += r.weight;
  }
  const adaptedScore = adaptedDenominator > 0 ? Math.round((adaptedNumerator / adaptedDenominator) * 1000) / 10 : null;

  // 2. Evaluate all 32 Elements E01–E32
  const elementValuesV7: Record<string, number> = {};
  const elementFindings: Record<
    string,
    {
      valueFound: any;
      message: string;
      evidence?: string;
      mode: 'O' | 'U' | 'M';
      status: 'otomatis' | 'usulan_mesin' | 'menunggu_verifikasi_manual' | 'diverifikasi_auditor' | 'tidak_terpenuhi';
    }
  > = {};

  for (const el of elementsConfig) {
    const elId = el.id;
    const mode = openDecisions.assessmentModes[elId] || (el.inti ? 'O' : 'O');
    let autoScore = 0;
    let message = 'Elemen tidak ditemukan atau kosong.';
    let evidence = '';
    let valFound: any = null;

    if (!metadata) {
      autoScore = 0;
      message = 'Berkas metadata tidak dimuat.';
    } else {
      switch (elId) {
        case 'E01': {
          // Bahasa metadata (ISO 639-2 valid 'ind')
          const lang = (metadata.language || metadata.metaMetadata?.metadataLanguage || '').toLowerCase().trim();
          valFound = lang || null;
          if (!lang) {
            autoScore = 0;
            message = 'Elemen bahasa tidak ditemukan.';
          } else if (lang === 'ind' || lang === 'id') {
            autoScore = 1;
            message = `Kode bahasa ISO 639-2 valid ("${lang}").`;
            evidence = `LanguageCode: ${lang}`;
          } else {
            autoScore = 0.5;
            message = `Bahasa teks bebas atau tidak sesuai isi ("${lang}").`;
            evidence = `Language: ${lang}`;
          }
          break;
        }

        case 'E02': {
          // Nama dan versi standar
          const std = metadata.metaMetadata?.standardName || '';
          const ver = metadata.metaMetadata?.standardVersion || '';
          valFound = `${std} ${ver}`.trim() || null;
          if (!std) {
            autoScore = 0;
            message = 'Standar metadata tidak dinyatakan dalam berkas.';
          } else if (
            /SNI\s*8843-1:2019|ISO\s*19115-1:2014|ISO\s*19115-3/i.test(std)
          ) {
            autoScore = 1;
            message = `Menyebutkan standar resmi mutakhir ("${valFound}").`;
            evidence = `Standard: ${valFound}`;
          } else {
            autoScore = 0.5;
            message = `Menyebutkan standar lama atau spesifikasi implementasi ("${valFound}").`;
            evidence = `Standard: ${valFound}`;
          }
          break;
        }

        case 'E03': {
          // Tautan akses data atau layanan (WFS, direct download, FeatureServer = 1; WMS/MapServer = 0.5)
          const allRes = metadata.allOnlineResources || [];
          const mainUrl = metadata.distribution?.onlineResourceUrl || allRes[0]?.url || '';
          valFound = mainUrl || null;

          if (!mainUrl || allRes.some(r => r.isLocalPath) || /^[a-zA-Z]:\\|^file:\/\//i.test(mainUrl)) {
            autoScore = 0;
            message = mainUrl ? 'Tautan berupa jalur berkas lokal (C:\\ / file://).' : 'Tautan akses data atau layanan tidak ditemukan.';
          } else if (allRes.some(r => r.isDirectDownload || /wfs|featureserver|shape-zip|export/i.test(`${r.url} ${r.protocol || ''}`))) {
            autoScore = 1;
            message = 'Tautan unduh langsung atau layanan fitur (WFS/FeatureServer) tersedia.';
            evidence = `Linkage: ${allRes.find(r => r.isDirectDownload || /wfs|featureserver/i.test(`${r.url} ${r.protocol || ''}`))?.url || mainUrl}`;
          } else if (allRes.some(r => r.isService || /wms|mapserver|wcs/i.test(`${r.url} ${r.protocol || ''}`))) {
            autoScore = 0.5;
            message = 'Hanya menyediakan layanan visual peta (WMS/MapServer).';
            evidence = `Linkage: ${mainUrl}`;
          } else {
            autoScore = 0.5;
            message = 'Tautan halaman informasi portal (bukan unduhan langsung).';
            evidence = `Linkage: ${mainUrl}`;
          }
          break;
        }

        case 'E04': {
          // Judul informatif (Deskriptif tema + lokasi)
          const t = metadata.title || '';
          valFound = t || null;
          if (!t) {
            autoScore = 0;
            message = 'Judul dataset tidak ditemukan.';
          } else if (
            t.length > 25 &&
            !t.includes('_') &&
            !/\b\d{3}\/\d{3}\b/.test(t) &&
            /kab|provinsi|indonesia|selat|laut|teluk|kepulauan|ntb|banten|riau|aceh/i.test(t)
          ) {
            autoScore = 1;
            message = 'Judul deskriptif memuat tema dan wilayah lokasi spesifik.';
            evidence = `Title: "${t}"`;
          } else {
            autoScore = 0.5;
            message = 'Judul berupa kode, nama berkas, atau tidak mencantumkan nama wilayah spesifik.';
            evidence = `Title: "${t}"`;
          }
          break;
        }

        case 'E05': {
          // Tanggal sitasi dan jenis tanggal
          const dt = metadata.temporalExtent?.publicationDate || metadata.temporalExtent?.creationDate || metadata.temporalExtent?.revisionDate;
          valFound = dt || null;
          if (!dt || /nilreason/i.test(dt)) {
            autoScore = 0;
            message = 'Tanggal sitasi tidak ditemukan atau nilReason=missing.';
          } else if (isEsri && !metadata.temporalExtent?.publicationDate) {
            autoScore = 0.5;
            message = 'Hanya tanggal sistem otomatis ArcGIS (CreaDate).';
            evidence = `Date: ${dt}`;
          } else {
            autoScore = 1;
            message = `Tanggal sitasi resmi tercatat ("${dt}").`;
            evidence = `CitationDate: ${dt}`;
          }
          break;
        }

        case 'E06': {
          // Identifier unik (UUID atau kode terstruktur)
          const id = metadata.datasetId || '';
          valFound = id || null;
          if (!id) {
            autoScore = 0;
            message = 'Identifier unik tidak tercantum.';
          } else if (/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i.test(id) || (!id.includes(' ') && id.length > 8)) {
            autoScore = 1;
            message = `Identifier unik terstruktur / UUID valid ("${id}").`;
            evidence = `ID: ${id}`;
          } else {
            autoScore = 0.5;
            message = `Identifier berupa teks bebas atau nama berkas pendek ("${id}").`;
            evidence = `ID: ${id}`;
          }
          break;
        }

        case 'E07': {
          // Abstrak
          const abs = metadata.abstract || '';
          valFound = abs || null;
          const t = metadata.title || '';
          if (!abs) {
            autoScore = 0;
            message = 'Abstrak tidak ditemukan.';
          } else if (abs.trim().toLowerCase() === t.trim().toLowerCase() || abs.length < 40) {
            autoScore = 0.5;
            message = 'Abstrak generik, mengulang judul, atau definisi umum.';
            evidence = `Abstract: "${abs.slice(0, 100)}..."`;
          } else {
            autoScore = 1;
            message = 'Abstrak informatif menjelaskan isi dan lingkup dataset.';
            evidence = `Abstract: "${abs.slice(0, 100)}..."`;
          }
          break;
        }

        case 'E08': {
          // Tujuan (purpose)
          const p = metadata.purpose || '';
          valFound = p || null;
          if (!p || /nilreason/i.test(p)) {
            autoScore = 0;
            message = 'Tujuan (purpose) kosong atau nilReason=missing.';
          } else if (/dataset spasial untuk kebutuhan gis|kebutuhan gis|diperuntukan hanya untuk/i.test(p)) {
            autoScore = 0.5;
            message = 'Tujuan templat generik atau hanya pembatasan peruntukan.';
            evidence = `Purpose: "${p}"`;
          } else {
            autoScore = 1;
            message = 'Tujuan dataset diuraikan spesifik.';
            evidence = `Purpose: "${p}"`;
          }
          break;
        }

        case 'E09': {
          // Kata kunci
          const kw = metadata.keywords || [];
          valFound = kw.length > 0 ? kw.join(', ') : null;
          if (kw.length === 0) {
            autoScore = 0;
            message = 'Kata kunci tidak ditemukan.';
          } else if (kw.length >= 2 && !kw.some(k => k.includes(',') && k.length > 30)) {
            autoScore = 1;
            message = `Ditemukan ${kw.length} kata kunci terstruktur.`;
            evidence = `Keywords: ${kw.slice(0, 5).join(', ')}`;
          } else {
            autoScore = 0.5;
            message = 'Hanya satu kata kunci, generik, atau digabung dalam satu elemen.';
            evidence = `Keywords: ${kw.join(', ')}`;
          }
          break;
        }

        case 'E10': {
          // Kategori topik ISO
          const tc = metadata.topicCategory || [];
          valFound = tc.length > 0 ? tc.join(', ') : null;
          if (tc.length === 0) {
            autoScore = 0;
            message = 'Kategori topik ISO tidak didefinisikan.';
          } else if (tc.some(t => /oceans|biota|boundaries|elevation|environment/i.test(t))) {
            autoScore = 1;
            message = `Kategori topik ISO sesuai isi ("${tc.join(', ')}").`;
            evidence = `Topic: ${tc.join(', ')}`;
          } else {
            autoScore = 0.5;
            message = `Kategori topik ada namun kurang sesuai ("${tc.join(', ')}").`;
            evidence = `Topic: ${tc.join(', ')}`;
          }
          break;
        }

        case 'E11': {
          // Lisensi atau batasan penggunaan
          const consts = `${metadata.distribution?.useConstraints || ''} ${metadata.distribution?.accessConstraints || ''}`.trim();
          valFound = consts || null;
          if (!consts || /not specified|none|\[\]/i.test(consts)) {
            autoScore = 0;
            message = 'Lisensi atau batasan penggunaan tidak ada atau "Not Specified".';
          } else if (/restrictions on the access and use|pembatasan akses dan penggunaan/i.test(consts)) {
            autoScore = 0.5;
            message = 'Teks definisi templat ISO tidak diubah.';
            evidence = `Constraints: ${consts}`;
          } else if (/public domain|copyright|terbuka|odbl|cc|bebas|tidak ada batasan/i.test(consts)) {
            autoScore = 1;
            message = 'Status penggunaan dinyatakan jelas (lisensi terbuka / ketentuan hak pakai).';
            evidence = `Constraints: ${consts}`;
          } else {
            autoScore = 0.5;
            message = 'Batasan teknis tercantum tanpa lisensi hukum yang eksplisit.';
            evidence = `Constraints: ${consts}`;
          }
          break;
        }

        case 'E12': {
          // Deskripsi atribut atau katalog fitur
          if (metadata.featureCatalogueFound && metadata.featureCatalogueCitationTitle && !/dalam proses pemutakhiran/i.test(metadata.featureCatalogueCitationTitle)) {
            autoScore = 1;
            valFound = metadata.featureCatalogueCitationTitle;
            message = 'Katalog fitur atau definisi atribut tersedia.';
            evidence = `Catalog: ${valFound}`;
          } else if (metadata.featureCatalogueFound) {
            autoScore = 0.5;
            valFound = metadata.featureCatalogueCitationTitle || 'Katalog fitur dalam pemutakhiran';
            message = 'Rujukan katalog fitur tercantum tetapi dalam proses pemutakhiran.';
            evidence = `Catalog: ${valFound}`;
          } else if (isEsri) {
            autoScore = 0.5;
            valFound = 'Daftar 13 atribut ArcGIS';
            message = 'Daftar atribut terdaftar tanpa definisi kamus data.';
          } else {
            autoScore = 0;
            message = 'Deskripsi atribut atau katalog fitur tidak ditemukan.';
          }
          break;
        }

        case 'E13': {
          // Special Case 2: Bounding box - empty strings are NOT 0
          const b = metadata.spatialExtent;
          if (!b || b.isBBoxValid === false) {
            autoScore = 0;
            valFound = b?.bboxError || '0, 0, 0, 0';
            message = b?.bboxError || 'Bounding box kosong, tidak lengkap, atau bernilai 0,0,0,0.';
          } else if (
            b.westBoundLongitude === undefined ||
            b.eastBoundLongitude === undefined
          ) {
            autoScore = 0;
            valFound = null;
            message = 'Bounding box spasial tidak ditemukan.';
          } else if (b.eastBoundLongitude - b.westBoundLongitude > 35) {
            autoScore = 0.5;
            valFound = `[${b.westBoundLongitude.toFixed(2)}, ${b.southBoundLatitude?.toFixed(2) ?? '0'}, ${b.eastBoundLongitude.toFixed(2)}, ${b.northBoundLatitude?.toFixed(2) ?? '0'}]`;
            message = 'Bounding box valid tetapi terlalu luas (mencakup skala nasional untuk data lokal).';
            evidence = `BBox: ${valFound}`;
          } else {
            autoScore = 1;
            valFound = `[${b.westBoundLongitude.toFixed(2)}, ${b.southBoundLatitude?.toFixed(2) ?? '0'}, ${b.eastBoundLongitude.toFixed(2)}, ${b.northBoundLatitude?.toFixed(2) ?? '0'}]`;
            message = 'Bounding box valid dan sesuai lingkup dataset.';
            evidence = `BBox: ${valFound}`;
          }
          break;
        }

        case 'E14': {
          // Cakupan temporal
          const dStart = metadata.temporalExtent?.startDate;
          const dEnd = metadata.temporalExtent?.endDate;
          valFound = dStart ? `${dStart} s.d ${dEnd || 'sekarang'}` : null;
          if (!dStart || /nilreason/i.test(dStart)) {
            autoScore = 0;
            message = 'Cakupan temporal (temporalElement) tidak ditemukan.';
          } else if (metadata.title && metadata.title.includes('2025') && dStart.includes('2009')) {
            autoScore = 0.5;
            message = 'Cakupan temporal tidak konsisten dengan tahun pada judul (nilai bawaan generator).';
            evidence = `Temporal: ${valFound}`;
          } else {
            autoScore = 1;
            message = 'Cakupan temporal terstruktur dan konsisten.';
            evidence = `Temporal: ${valFound}`;
          }
          break;
        }

        case 'E15': {
          // Special Case 1: CRS code 84 with codeSpace="CRS" recognized as OGC CRS84
          const crs = metadata.spatialExtent?.crsName || metadata.spatialExtent?.crsCode || '';
          valFound = crs || null;
          if (!crs) {
            autoScore = 0;
            message = 'Sistem referensi koordinat tidak tercantum.';
          } else if (/SRGI|SRGI2013/i.test(crs)) {
            autoScore = 1;
            message = 'Menggunakan Sistem Referensi Geospasial Indonesia (SRGI) secara eksplisit.';
            evidence = `CRS: ${crs}`;
          } else {
            autoScore = 0.5;
            message = 'Valid menggunakan WGS84 / EPSG:4326 / OGC CRS84, namun belum menyebut SRGI secara eksplisit.';
            evidence = `CRS: ${crs}`;
          }
          break;
        }

        case 'E16': {
          // Akurasi posisi
          const pos = metadata.accuracy?.positionalAccuracy || metadata.accuracy?.totalHorizontalUncertainty;
          valFound = pos || null;
          if (!pos) {
            autoScore = 0;
            message = 'Laporan akurasi posisi tidak dinyatakan.';
          } else if (typeof pos === 'number' || (typeof pos === 'string' && /\d/.test(pos) && /ce90|le90|rmse|meter|cm/i.test(pos))) {
            autoScore = 1;
            message = `Akurasi posisi terukur tercantum ("${pos}").`;
            evidence = `PositionalAccuracy: ${pos}`;
          } else {
            autoScore = 0.5;
            message = 'Pernyataan kualitatif akurasi posisi tanpa nilai angka terukur.';
            evidence = `PositionalAccuracy: ${pos}`;
          }
          break;
        }

        case 'E17': {
          // Special Case 5: Direct Conformance Result in mdq:report
          if (metadata.hasDirectConformanceReport) {
            autoScore = 0.5;
            valFound = 'DQ_ConformanceResult (Tautan QC Status)';
            message = 'Laporan konformitas ada namun tanpa elemen parameter kualitas terukur (struktur ISO 19157).';
            evidence = 'report: DQ_ConformanceResult';
          } else {
            const dq = metadata.rawEvidence?.dqReport || metadata.rawEvidence?.accuracyReport;
            if (!dq?.value) {
              autoScore = 0;
              message = 'Laporan kualitas data tidak ditemukan.';
            } else {
              autoScore = 0.5;
              valFound = 'Laporan kualitas data tercatat';
              message = 'Laporan kualitas data tercantum (ambang batas atau sebagian).';
            }
          }
          break;
        }

        case 'E18': {
          // Skala atau resolusi
          const scale = metadata.rawEvidence?.scaleDenominator?.value || metadata.rawEvidence?.spatialResolution?.value;
          valFound = scale ? `1:${scale}` : null;
          if (scale) {
            autoScore = 1;
            message = `Skala terstruktur tercantum (1:${scale}).`;
            evidence = `Scale: 1:${scale}`;
          } else if (metadata.title && /\b(\d+K|\d+:\d+)\b/i.test(metadata.title)) {
            autoScore = 0.5;
            valFound = metadata.title.match(/\b(\d+K|\d+:\d+)\b/i)![1];
            message = `Skala hanya tercantum dalam judul data ("${valFound}").`;
          } else {
            autoScore = 0;
            message = 'Skala atau resolusi spasial tidak ditemukan.';
          }
          break;
        }

        case 'E19': {
          // Special Case 3: Multiple Contact Blocks
          const org = metadata.contact?.organization || '';
          valFound = org || null;
          if (!org || /nilreason|admin admin/i.test(org)) {
            autoScore = 0;
            message = 'Organisasi penanggung jawab tidak tercantum atau nilReason=missing.';
          } else if (/jaringankalbar/i.test(org)) {
            autoScore = 0.5;
            message = 'Nama jaringan portal, bukan nama organisasi instansi resmi.';
            evidence = `Org: ${org}`;
          } else {
            autoScore = 1;
            message = `Organisasi resmi tercantum ("${org}").`;
            evidence = `Org: ${org}`;
          }
          break;
        }

        case 'E20': {
          // Special Case 4: Email containing URL
          const email = metadata.contact?.email || '';
          valFound = email || null;
          if (!email || /belum ada|^-$|nilreason/i.test(email) || metadata.contact?.hasUrlInEmail) {
            autoScore = 0;
            message = metadata.contact?.hasUrlInEmail
              ? 'Kolom email berisi URL web (bukan email valid).'
              : 'Sarana kontak email kosong atau placeholder ("Belum Ada" / "-").';
          } else if (metadata.contact?.isInstitutionalEmail) {
            autoScore = 1;
            message = `Email institusional valid ("${email}").`;
            evidence = `Email: ${email}`;
          } else {
            autoScore = 0.5;
            message = `Email non-institusi atau domain komersial ("${email}").`;
            evidence = `Email: ${email}`;
          }
          break;
        }

        case 'E21': {
          // Peran (role)
          const role = metadata.contact?.role || '';
          valFound = role || null;
          if (!role) {
            autoScore = 0;
            message = 'Peran (role) tidak tercantum.';
          } else if (/custodian|owner|originator|pointofcontact|author|distributor/i.test(role)) {
            autoScore = 1;
            message = `Peran codelist ISO resmi ("${role}").`;
            evidence = `Role: ${role}`;
          } else {
            autoScore = 0.5;
            message = `Peran berupa teks bebas lokal ("${role}").`;
            evidence = `Role: ${role}`;
          }
          break;
        }

        case 'E22': {
          // Tanggal metadata
          const dt = metadata.metaMetadata?.metadataDate || '';
          valFound = dt || null;
          if (!dt || /nilreason/i.test(dt)) {
            autoScore = 0;
            message = 'Tanggal metadata (dateStamp) tidak ditemukan.';
          } else {
            autoScore = 1;
            message = `Tanggal metadata tercatat ("${dt}").`;
            evidence = `DateStamp: ${dt}`;
          }
          break;
        }

        case 'E23': {
          // Frekuensi pembaruan
          const freq = metadata.rawEvidence?.maintenanceFrequency?.value || '';
          valFound = freq || null;
          if (!freq || /nilreason/i.test(freq)) {
            autoScore = 0;
            message = 'Frekuensi pembaruan tidak tercantum.';
          } else if (/unknown/i.test(freq) || /2 tahun/i.test(freq)) {
            autoScore = 0.5;
            message = `Frekuensi pembaruan "unknown" atau teks bebas ("${freq}").`;
            evidence = `Frequency: ${freq}`;
          } else {
            autoScore = 1;
            message = `Frekuensi pembaruan resmi tercatat ("${freq}").`;
            evidence = `Frequency: ${freq}`;
          }
          break;
        }

        case 'E24': {
          // Pernyataan lineage
          const lin = metadata.processing?.lineageStatement || '';
          valFound = lin || null;
          if (!lin || /nilreason/i.test(lin)) {
            autoScore = 0;
            message = 'Pernyataan lineage kosong atau nilReason=missing.';
          } else if (/general explanation of the data producer's knowledge|alur proses pengolahan data|definisi/i.test(lin) || lin.length < 50) {
            autoScore = 0.5;
            message = 'Pernyataan lineage generik, teks templat ISO, atau rujukan peraturan saja.';
            evidence = `Lineage: "${lin.slice(0, 80)}..."`;
          } else {
            autoScore = 1;
            message = 'Pernyataan lineage terperinci memuat silsilah data.';
            evidence = `Lineage: "${lin.slice(0, 80)}..."`;
          }
          break;
        }

        case 'E25': {
          // Sumber data
          const src = metadata.processing?.sourceDatasets || [];
          valFound = src.length > 0 ? src.join(', ') : null;
          if (src.length === 0) {
            autoScore = 0;
            message = 'Sumber data spesifik tidak tercantum.';
          } else if (src.length === 1 && /survei/i.test(src[0])) {
            autoScore = 0.5;
            message = 'Sumber data disebut generik ("survei").';
            evidence = `Source: ${src.join(', ')}`;
          } else {
            autoScore = 1;
            message = `Sumber data spesifik diuraikan ("${src.join(', ')}").`;
            evidence = `Source: ${src.join(', ')}`;
          }
          break;
        }

        case 'E26': {
          // Langkah atau metode pemrosesan
          const steps = metadata.processing?.processingSteps || [];
          valFound = steps.length > 0 ? steps.join('; ') : null;
          if (steps.length === 0) {
            autoScore = 0;
            message = 'Langkah atau metode pemrosesan tidak tercantum.';
          } else if (steps.some(s => /exportfeatures|rename/i.test(s))) {
            autoScore = 0.5;
            message = 'Hanya riwayat proses otomatis perangkat lunak (Export/Rename).';
            evidence = `Steps: ${steps.join('; ')}`;
          } else {
            autoScore = 1;
            message = `Tahapan pemrosesan diuraikan (${steps.length} langkah).`;
            evidence = `Steps: ${steps.join('; ')}`;
          }
          break;
        }

        case 'E27': {
          // Special Case 6 & 7: Spatial Representation (Topology, Geometry, Count)
          const spat = metadata.rawEvidence?.e27_spatialRepresentation?.value;
          const top = spat?.topologyLevel;
          const geom = spat?.geometricObjectType;
          const count = spat?.count;
          valFound = spat ? `top=${top || '-'}, geom=${geom || '-'}, cnt=${count ?? '-'}` : null;

          if (!top && !geom) {
            autoScore = 0;
            message = 'Representasi spasial tidak tercantum atau kosong.';
          } else if (top && geom && count !== undefined && count > 0) {
            autoScore = 1;
            message = `Topologi, geometri, dan jumlah objek valid (${count} objek).`;
            evidence = `SpatialRep: top=${top}, geom=${geom}, count=${count}`;
          } else {
            autoScore = 0.5;
            message = count === 0
              ? 'Jumlah objek bernilai 0 (tidak valid), namun tipe geometri/topologi tersedia.'
              : 'Hanya mencantumkan sebagian unsur topologi atau geometri.';
            evidence = `SpatialRep: top=${top || '-'}, geom=${geom || '-'}, count=${count ?? '-'}`;
          }
          break;
        }

        case 'E28': {
          // Special Case 8: Metadata Scope with ISO Scope words check
          const sCode = metadata.scopeCode || '';
          const sName = metadata.scopeName || '';
          valFound = sName ? `${sCode} (${sName})` : sCode || null;

          if (!sCode && !sName) {
            autoScore = 0;
            message = 'Lingkup metadata tidak ditemukan.';
          } else {
            const cleanName = sName.toLowerCase().replace(/[^a-z]/g, '');
            const isGenericScopeWord = openDecisions.scopeWords.includes(cleanName) || cleanName === sCode.toLowerCase();

            if (sCode && sName && !isGenericScopeWord) {
              autoScore = 1;
              message = `Lingkup metadata dengan kode dan nama spesifik ("${sName}").`;
              evidence = `Scope: ${sCode} / ${sName}`;
            } else {
              autoScore = 0.5;
              message = isGenericScopeWord
                ? 'Kode lingkup ada namun nama hanya mengulang kata lingkup generik ISO ("dataset").'
                : 'Hanya mencantumkan kode lingkup tanpa nama spesifik.';
              evidence = `Scope: ${sCode || '-'}`;
            }
          }
          break;
        }

        case 'E29': {
          // Katalog simbol
          const port = metadata.rawEvidence?.e29_portrayalCatalogue?.value;
          valFound = port?.citation || null;
          if (!port?.citation) {
            autoScore = 0;
            message = 'Katalog simbol / penyajian tidak ditemukan.';
          } else if (port.isSpecificDocument) {
            autoScore = 1;
            message = 'Menyitasi dokumen aturan simbol / SNI penyajian peta resmi.';
            evidence = `Portrayal: "${port.citation.slice(0, 80)}..."`;
          } else {
            autoScore = 0.5;
            message = 'Tercantum teks penyajian (tabel warna / judul), bukan sitasi dokumen aturan.';
            evidence = `Portrayal: "${port.citation.slice(0, 80)}..."`;
          }
          break;
        }

        case 'E30': {
          // Skema aplikasi
          const appSch = metadata.rawEvidence?.e30_applicationSchema?.value;
          valFound = appSch?.schemaName ? `${appSch.schemaName} (${appSch.docLink || 'tanpa tautan'})` : null;
          if (!appSch?.schemaName) {
            autoScore = 0;
            message = 'Skema aplikasi (applicationSchemaInfo) tidak ditemukan.';
          } else if (appSch.schemaName && appSch.docLink) {
            autoScore = 1;
            message = `Nama skema aplikasi dan dokumen / XSD tersedia ("${appSch.schemaName}").`;
            evidence = `Schema: ${appSch.schemaName} -> ${appSch.docLink}`;
          } else {
            autoScore = 0.5;
            message = `Hanya mencantumkan nama skema aplikasi tanpa dokumen atau berkas skema.`;
            evidence = `Schema: ${appSch.schemaName}`;
          }
          break;
        }

        case 'E31': {
          // Special Case 9: KUGI compliance
          valFound = metadata.kugiCitationFound
            ? `KUGI: compliance=${metadata.kugiComplianceCode ?? '-'}`
            : null;
          if (!metadata.kugiCitationFound) {
            autoScore = 0;
            message = 'Tidak menyitasi Katalog Unsur Geografi Indonesia (KUGI).';
          } else if (metadata.kugiComplianceCode === true) {
            autoScore = 1;
            message = 'Kepatuhan KUGI terpenuhi (complianceCode=true dan menyitasi KUGI).';
            evidence = 'KUGI complianceCode=true';
          } else {
            autoScore = 0.5;
            message = 'Menyitasi KUGI namun complianceCode tidak bernilai true.';
            evidence = 'KUGI cited without complianceCode=true';
          }
          break;
        }

        case 'E32': {
          // Special Case 10: Service link & description
          const svcResources = (metadata.allOnlineResources || []).filter(r => r.isService);
          if (svcResources.length === 0) {
            autoScore = 0;
            message = 'Tidak ada tautan layanan (WMS, WFS, CSW, atau ArcGIS Server).';
          } else {
            const firstSvc = svcResources[0];
            const desc = (firstSvc.description || firstSvc.name || '').toLowerCase().trim();
            valFound = `${firstSvc.url} (${desc || 'tanpa deskripsi'})`;

            const isTechnicalLabelOnly = openDecisions.serviceLabelKeywords.some(kw => desc === kw || desc.includes(kw));
            const isTitleRepetition = metadata.title && desc === metadata.title.toLowerCase().trim();

            if (desc && !isTechnicalLabelOnly && !isTitleRepetition && desc.length > 15) {
              autoScore = 1;
              message = `Tautan layanan tersedia dengan deskripsi operasional layer yang jelas.`;
              evidence = `Service: ${firstSvc.url} - ${desc}`;
            } else {
              autoScore = 0.5;
              message = isTechnicalLabelOnly || isTitleRepetition
                ? `Tautan layanan tersedia, namun deskripsi hanya berupa label teknis / nama portal / judul dataset.`
                : 'Tautan layanan tersedia tanpa deskripsi layer.';
              evidence = `Service: ${firstSvc.url}`;
            }
          }
          break;
        }

        default:
          autoScore = 0;
      }
    }

    // Determine status & apply override
    let finalScore = autoScore;
    let evalStatus: 'otomatis' | 'usulan_mesin' | 'menunggu_verifikasi_manual' | 'diverifikasi_auditor' | 'tidak_terpenuhi' = 'otomatis';

    if (manualOverrides?.[elId] !== undefined) {
      finalScore = manualOverrides[elId].value;
      evalStatus = 'diverifikasi_auditor';
    } else {
      if (mode === 'M') {
        if (autoScore > 0) {
          finalScore = openDecisions.initialManualValue; // Default proposal 0.5
          evalStatus = 'menunggu_verifikasi_manual';
        } else {
          finalScore = 0;
          evalStatus = 'tidak_terpenuhi';
        }
      } else if (mode === 'U') {
        finalScore = autoScore;
        evalStatus = 'usulan_mesin';
      } else {
        finalScore = autoScore;
        evalStatus = 'otomatis';
      }
    }

    elementValuesV7[elId] = finalScore;
    elementFindings[elId] = {
      valueFound: valFound,
      message,
      evidence,
      mode,
      status: evalStatus,
    };
  }

  // 3. Compute Quantitative V7 Scoring (32 elements main, 26 elements core, 6 elements extension)
  const v7Scoring: V7ScoreResult = calculateV7Scores(elementValuesV7);

  // 4. Evaluate ISO 19115-3 Extensions (E27–E32)
  const iso19115_3Readiness = evaluateIso19115_3Extensions(metadata);

  // 5. Evaluate Quality Flags F01–F14
  const qualityFlags: QualityFlagResult[] = evaluateQualityFlags(metadata, rawXmlOrJsonText);

  // Construct coreElementsResults (E01–E26)
  const coreElementsResults: ParameterAuditResult[] = elementsConfig
    .filter(e => e.inti)
    .map(el => {
      const scoreVal = elementValuesV7[el.id];
      const finding = elementFindings[el.id];
      const isOverridden = manualOverrides?.[el.id] !== undefined;

      const status: ParameterAuditResult['status'] =
        scoreVal === 1 ? 'terpenuhi' : scoreVal === 0.5 ? 'perlu_ditinjau' : 'tidak_terpenuhi';

      return {
        ruleId: el.id,
        elementId: el.id,
        name: el.nama,
        category: (CATEGORY_NAME_TO_KEY[el.kategori] as MQICategory) || 'CAT_GENERAL',
        importance: el.bobot === 3 ? 'critical' : el.bobot === 2 ? 'important' : 'supplementary',
        weight: el.bobot,
        source: 'adaptasi_kompas',
        status,
        scoreContribution: scoreVal * el.bobot,
        valueFound: finding?.valueFound ?? null,
        expectedFormat: el.kriteria1 || 'Sesuai spesifikasi checklist',
        iso19115Tag: el.id,
        isIso19115Core: true,
        evidenceSnippet: finding?.evidence,
        findingMessage: isOverridden
          ? `[Manual Override]: Auditor menetapkan skor ${scoreVal}. Catatan: ${manualOverrides![el.id].notes || '-'}`
          : finding?.message,
        recommendation: scoreVal === 1 ? undefined : el.kriteria1,
        technicalDetails: el.definisi || el.nama,
      };
    });

  // Calculate 8 Category Summaries
  const categorySummaries: CategorySummary[] = (
    Object.keys(MQI_CATEGORIES) as MQICategory[]
  ).map(catKey => {
    const catName = MQI_CATEGORIES[catKey].name;
    const catRules = elementsConfig.filter(r => r.kategori === catName);
    const fulfilledCatRules = catRules.filter(r => elementValuesV7[r.id] === 1);
    const scoreEarned = catRules.reduce((acc, r) => acc + (elementValuesV7[r.id] * r.bobot), 0);
    const scoreMaxPossible = catRules.reduce((acc, r) => acc + r.bobot, 0);
    const percentage = v7Scoring.categoryScores[catName] || 0;

    return {
      category: catKey,
      categoryName: catName,
      totalParameters: catRules.length,
      applicableParameters: catRules.length,
      fulfilledParameters: fulfilledCatRules.length,
      scoreEarned: Math.round(scoreEarned * 10) / 10,
      scoreMaxPossible,
      percentage: Math.round(percentage * 10) / 10,
    };
  });

  const scoreReport: MQIScoreReport = {
    originalScore,
    adaptedScore: v7Scoring.skorA,
    isProvisional: provisionalReasons.length > 0 || v7Scoring.emptyElements.length > 0,
    provisionalReasons,
    numerator: v7Scoring.mqiDiperluas,
    denominator: 100,
    totalRulesAssessed: 32,
    statusCounts: {
      terpenuhi: v7Scoring.countScore1,
      tidak_terpenuhi: v7Scoring.countScore0,
      tidak_valid: 0,
      tidak_berlaku: 0,
      belum_diperiksa: 0,
      perlu_ditinjau: v7Scoring.countScore05,
    },
    categorySummaries,
    complianceTier: v7Scoring.kategoriDiperluas || 'Unrated',
    methodologyVersion: 'v7-2026-10-31',
    rulesetVersion: ruleVersion,
  };

  const iso19115Compliance: ISO19115ComplianceReport = {
    isCompliant: v7Scoring.skorAInti >= 75,
    coreScore: v7Scoring.skorAInti,
    passedCount: v7Scoring.countScore1,
    totalCoreCount: 26,
    statusLabel: v7Scoring.skorAInti >= 75 ? 'Kelengkapan Elemen Inti Tinggi (≥ 75%)' : 'Kelengkapan Elemen Inti Belum Optimal (< 75%)',
    summaryNotes: 'Catatan Metodologis: Skor kuantitatif mengukur tingkat kelengkapan elemen dan tidak membuktikan kepatuhan formal atau yuridis terhadap standar ISO 19115.',
    elements: [],
    standardReference: 'SNI ISO 19115:2012 / ISO 19115-1:2014',
  };

  return {
    id: `AUD-${Date.now().toString().slice(-6)}`,
    timestamp,
    datasetName,
    profileId,
    metadataFile: metadata ? { name: metadata.fileName, size: metadata.fileSizeBytes, format: metadata.rawFormat } : undefined,
    spatialFile: spatial ? { name: spatial.fileName, size: spatial.fileSizeBytes, format: spatial.format } : undefined,
    normalizedMetadata: metadata,
    normalizedSpatialData: spatial,
    scoreReport,
    iso19115Compliance,
    parameterResults: registryResults,
    coreElementsResults,
    coreScoreMqi: v7Scoring.mqiDiperluasInti,
    extensionScorePercentage: v7Scoring.skorEkstensi,
    iso19115_3Readiness,
    consistencyResult: metadata && spatial ? auditConsistency(metadata, spatial) : undefined,
    v7Scoring,
    ruleVersion,
    qualityFlags,
    manualOverrides,
    auditorNotes,
    statusSkema,
    elementValuesV7,
  };
}

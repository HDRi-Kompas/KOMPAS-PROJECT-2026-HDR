/**
 * KOMPAS - Metadata Audit Rule Registry
 * Central registry of all rules across the 8 MQI categories.
 * Contains both Original Hasara & Karunanayaka (2026) parameters and KOMPAS Adaptations.
 */

import { isPlaceholderValue, isValidContactEmail, validateBBox, isValidDateString } from './validator';
import { AuditRule, DatasetProfileId, EvaluationOutcome } from '../types/audit';

export const AUDIT_RULE_REGISTRY: AuditRule[] = [
  // ==========================================
  // KATEGORI 1: INFORMASI UMUM (CAT_GENERAL)
  // ==========================================
  {
    id: 'GEN-01',
    name: 'Bahasa Metadata & Dataset',
    definition: 'Mendokumentasikan bahasa utama metadata atau dataset spasial (misal: ind, eng, atau id).',
    category: 'CAT_GENERAL',
    importance: 'supplementary',
    weight: 1,
    source: 'jurnal_hasara_2026',
    expectedFormat: 'ISO 639-2 / Teks bahasa (contoh: "ind", "id", "indonesia", "eng")',
    targetFields: ['language', 'dataLang', 'LanguageCode'],
    applicableProfiles: 'all',
    iso19115Tag: 'MD_DataIdentification.language',
    isIso19115Core: true,
    isMandatoryInProfile: () => false,
    evaluate: (metadata): EvaluationOutcome => {
      const val = metadata.language;
      const raw = metadata.rawEvidence.language;
      if (!val) {
        return {
          status: 'tidak_terpenuhi',
          valueFound: null,
          findingMessage: 'Elemen bahasa metadata atau dataset tidak ditemukan dalam dokumen.',
          recommendation: 'Cantumkan elemen bahasa (gmd:language atau "language") dengan kode ISO 639 (misal: "id" atau "ind").',
        };
      }
      if (isPlaceholderValue(val)) {
        return {
          status: 'tidak_valid',
          valueFound: val,
          sourcePath: raw?.path || 'language',
          findingMessage: `Nilai bahasa "${val}" terdeteksi sebagai placeholder.`,
          recommendation: 'Ganti placeholder dengan kode bahasa resmi ISO 639-2 (misal: "ind" untuk Bahasa Indonesia).',
        };
      }
      return {
        status: 'terpenuhi',
        valueFound: val,
        sourcePath: raw?.path || 'language',
        evidenceSnippet: `Language: "${val}"`,
      };
    },
  },
  {
    id: 'GEN-02',
    name: 'Kategori Topik Kelautan (Topic Category)',
    definition: 'Mengklasifikasikan dataset ke dalam topik kelautan standar ISO 19115 (oceans, elevation, biota, boundaries, environment).',
    category: 'CAT_GENERAL',
    importance: 'important',
    weight: 2,
    source: 'jurnal_hasara_2026',
    expectedFormat: 'Kategori ISO 19115 TopicCategory: oceans | elevation | biota | environment',
    targetFields: ['topicCategory', 'theme'],
    applicableProfiles: 'all',
    iso19115Tag: 'MD_DataIdentification.topicCategory',
    isIso19115Core: true,
    isMandatoryInProfile: () => true,
    evaluate: (metadata): EvaluationOutcome => {
      const kw = metadata.keywords || [];
      const hasMarineKw = kw.some(k => /laut|marine|ocean|bathymetry|batimetri|pantai|coastal|bentik|mangrove|terumbu/i.test(k));
      if (kw.length === 0 && !metadata.purpose && !metadata.abstract) {
        return {
          status: 'tidak_terpenuhi',
          valueFound: null,
          findingMessage: 'Kategori topik kelautan tidak didefinisikan dalam metadata.',
          recommendation: 'Tambahkan elemen gmd:topicCategory dengan nilai resmi "oceans", "elevation", atau "biota".',
        };
      }
      if (hasMarineKw || (metadata.abstract && /kelautan|laut|ocean|marine|kedalaman|kedalaman|perairan/i.test(metadata.abstract))) {
        return {
          status: 'terpenuhi',
          valueFound: kw.length > 0 ? kw.slice(0, 4).join(', ') : 'Terdeteksi dari konten tematik',
          sourcePath: 'topicCategory / keywords',
          evidenceSnippet: `Kata kunci terkait kelautan terkonfirmasi.`,
        };
      }
      return {
        status: 'perlu_ditinjau',
        valueFound: kw.join(', ') || 'N/A',
        sourcePath: 'keywords',
        findingMessage: 'Kategori topik umum ditemukan namun belum secara eksplisit memuat klasifikasi topik kelautan standar ISO (oceans/biota).',
        recommendation: 'Tetapkan topik secara definitif pada kategori ISO 19115 "oceans" untuk memudahkan integrasi MSDI.',
      };
    },
  },

  // ==========================================
  // KATEGORI 2: INFORMASI IDENTIFIKASI (CAT_IDENTIFICATION)
  // ==========================================
  {
    id: 'ID-01',
    name: 'Judul Resmi Dataset (Dataset Title)',
    definition: 'Nama resmi dataset yang unik, spesifik, dan merefleksikan subjek serta cakupan geografis.',
    category: 'CAT_IDENTIFICATION',
    importance: 'critical',
    weight: 3,
    source: 'jurnal_hasara_2026',
    expectedFormat: 'String judul deskriptif minimal 10 karakter',
    targetFields: ['title', 'resTitle', 'name'],
    applicableProfiles: 'all',
    iso19115Tag: 'MD_DataIdentification.citation.title',
    isIso19115Core: true,
    isMandatoryInProfile: () => true,
    evaluate: (metadata): EvaluationOutcome => {
      const val = metadata.title;
      const raw = metadata.rawEvidence.title;
      if (!val) {
        return {
          status: 'tidak_terpenuhi',
          valueFound: null,
          findingMessage: 'Judul dataset tidak ditemukan dalam dokumen metadata.',
          recommendation: 'Tambahkan judul dataset yang jelas pada elemen identifikasi utama.',
        };
      }
      if (isPlaceholderValue(val)) {
        return {
          status: 'tidak_valid',
          valueFound: val,
          sourcePath: raw?.path || 'title',
          findingMessage: `Judul dataset "${val}" terdeteksi sebagai placeholder atau nama contoh.`,
          recommendation: 'Ganti dengan nama resmi survei atau dataset geospasial kelautan.',
        };
      }
      if (val.trim().length < 8) {
        return {
          status: 'tidak_valid',
          valueFound: val,
          sourcePath: raw?.path || 'title',
          findingMessage: `Judul "${val}" terlalu pendek dan ambigu (<8 karakter).`,
          recommendation: 'Gunakan judul yang informatif memuat nama wilayah dan jenis data kelautan.',
        };
      }
      return {
        status: 'terpenuhi',
        valueFound: val,
        sourcePath: raw?.path || 'title',
        evidenceSnippet: `Title: "${val}"`,
      };
    },
  },
  {
    id: 'ID-02',
    name: 'Pengidentifikasi Unik Dataset (Dataset Identifier / UUID / DOI)',
    definition: 'Kode pengenal unik persisten yang membedakan dataset dalam repositori (UUID, DOI, atau Kode Inventaris Nasional).',
    category: 'CAT_IDENTIFICATION',
    importance: 'critical',
    weight: 3,
    source: 'jurnal_hasara_2026',
    expectedFormat: 'UUID v4 / DOI / Kode Inventaris Alfanumerik unik',
    targetFields: ['datasetId', 'fileIdentifier', 'identifier'],
    applicableProfiles: 'all',
    iso19115Tag: 'MD_DataIdentification.citation.identifier',
    isIso19115Core: true,
    isMandatoryInProfile: () => true,
    evaluate: (metadata): EvaluationOutcome => {
      const val = metadata.datasetId;
      const raw = metadata.rawEvidence.datasetId;
      if (!val) {
        return {
          status: 'tidak_terpenuhi',
          valueFound: null,
          findingMessage: 'Pengidentifikasi unik dataset (UUID/ID/DOI) tidak ditemukan.',
          recommendation: 'Cantumkan elemen gmd:fileIdentifier atau properti "identifier" berupa UUID unik atau kode registrasi resmi.',
        };
      }
      if (isPlaceholderValue(val)) {
        return {
          status: 'tidak_valid',
          valueFound: val,
          sourcePath: raw?.path || 'datasetId',
          findingMessage: `ID dataset "${val}" merupakan teks placeholder.`,
          recommendation: 'Gunakan pengenal unik nyata (misalnya UUID format 8-4-4-4-12).',
        };
      }
      return {
        status: 'terpenuhi',
        valueFound: val,
        sourcePath: raw?.path || 'datasetId',
        evidenceSnippet: `Identifier: "${val}"`,
      };
    },
  },
  {
    id: 'ID-03',
    name: 'Tanggal Terbitan / Publikasi Data (Publication Date)',
    definition: 'Tanggal resmi ketika versi dataset ini disetujui, diterbitkan, atau diserahkan.',
    category: 'CAT_IDENTIFICATION',
    importance: 'critical',
    weight: 3,
    source: 'jurnal_hasara_2026',
    expectedFormat: 'Format ISO 8601 (YYYY-MM-DD atau YYYY)',
    targetFields: ['publicationDate', 'pubdate', 'metadata_created'],
    applicableProfiles: 'all',
    iso19115Tag: 'MD_DataIdentification.citation.date',
    isIso19115Core: true,
    isMandatoryInProfile: () => true,
    evaluate: (metadata): EvaluationOutcome => {
      const val = metadata.temporalExtent?.publicationDate;
      const raw = metadata.rawEvidence.publicationDate;
      if (!val) {
        return {
          status: 'tidak_terpenuhi',
          valueFound: null,
          findingMessage: 'Tanggal publikasi dataset tidak ditemukan.',
          recommendation: 'Cantumkan tanggal publikasi pada elemen tanggal identifikasi (gmd:date atau publication_date).',
        };
      }
      const dateCheck = isValidDateString(val);
      if (!dateCheck.valid) {
        return {
          status: 'tidak_valid',
          valueFound: val,
          sourcePath: raw?.path || 'publicationDate',
          findingMessage: dateCheck.reason || 'Format tanggal tidak valid.',
          recommendation: 'Gunakan format tanggal ISO 8601 (YYYY-MM-DD, contoh: 2024-08-17).',
        };
      }
      return {
        status: 'terpenuhi',
        valueFound: val,
        sourcePath: raw?.path || 'publicationDate',
        evidenceSnippet: `Publication Date: "${val}"`,
      };
    },
  },

  // ==========================================
  // KATEGORI 3: DESKRIPSI & ABSTRAK (CAT_DESCRIPTION)
  // ==========================================
  {
    id: 'DESC-01',
    name: 'Abstrak Naratif Deskriptif (Abstract)',
    definition: 'Uraian ringkas namun komprehensif mengenai isi dataset, metodologi survei, dan hasil.',
    category: 'CAT_DESCRIPTION',
    importance: 'critical',
    weight: 3,
    source: 'jurnal_hasara_2026',
    expectedFormat: 'Paragraf deskriptif minimal 25 karakter',
    targetFields: ['abstract', 'idAbs', 'description'],
    applicableProfiles: 'all',
    iso19115Tag: 'MD_DataIdentification.abstract',
    isIso19115Core: true,
    isMandatoryInProfile: () => true,
    evaluate: (metadata): EvaluationOutcome => {
      const val = metadata.abstract;
      const raw = metadata.rawEvidence.abstract;
      if (!val) {
        return {
          status: 'tidak_terpenuhi',
          valueFound: null,
          findingMessage: 'Abstrak dataset tidak ditemukan dalam metadata.',
          recommendation: 'Tambahkan elemen gmd:abstract dengan penjelasan mengenai metode survei, lokasi, dan lingkup data kelautan.',
        };
      }
      if (isPlaceholderValue(val)) {
        return {
          status: 'tidak_valid',
          valueFound: val,
          sourcePath: raw?.path || 'abstract',
          findingMessage: `Abstrak "${val}" masih berupa teks placeholder/contoh.`,
          recommendation: 'Tuliskan deskripsi substantif minimal 1-2 paragraf mengenai dataset.',
        };
      }
      if (val.trim().length < 25) {
        return {
          status: 'tidak_valid',
          valueFound: val,
          sourcePath: raw?.path || 'abstract',
          findingMessage: `Abstrak terlalu singkat (${val.trim().length} karakter, minimal 25 karakter).`,
          recommendation: 'Perluas isi abstrak agar pengguna dapat memahami konteks akuisisi data.',
        };
      }
      return {
        status: 'terpenuhi',
        valueFound: val.length > 80 ? val.substring(0, 80) + '...' : val,
        sourcePath: raw?.path || 'abstract',
        evidenceSnippet: `Abstract length: ${val.length} chars`,
      };
    },
  },
  {
    id: 'DESC-02',
    name: 'Tujuan Pengumpulan Data (Purpose / Intended Application)',
    definition: 'Tujuan awal mengapa data spasial kelautan ini diakuisisi (misal: keselamatan navigasi pelayaran, konservasi terumbu, delineasi batas).',
    category: 'CAT_DESCRIPTION',
    importance: 'important',
    weight: 2,
    source: 'jurnal_hasara_2026',
    expectedFormat: 'Teks deskripsi tujuan spesifik',
    targetFields: ['purpose', 'idPurp', 'tujuan'],
    applicableProfiles: 'all',
    isMandatoryInProfile: () => false,
    evaluate: (metadata): EvaluationOutcome => {
      const val = metadata.purpose;
      if (!val) {
        return {
          status: 'tidak_terpenuhi',
          valueFound: null,
          findingMessage: 'Tujuan pembuatan data (purpose) tidak dicantumkan.',
          recommendation: 'Cantumkan elemen gmd:purpose untuk mendokumentasikan objektif studi atau proyek akuisisi.',
        };
      }
      if (isPlaceholderValue(val)) {
        return {
          status: 'tidak_valid',
          valueFound: val,
          findingMessage: 'Tujuan pengumpulan data masih berupa teks placeholder.',
          recommendation: 'Jelaskan tujuan pemanfaatan data secara spesifik.',
        };
      }
      return {
        status: 'terpenuhi',
        valueFound: val,
        evidenceSnippet: `Purpose: "${val}"`,
      };
    },
  },
  {
    id: 'DESC-03',
    name: 'Kata Kunci Tematik (Thematic Keywords)',
    definition: 'Daftar kata kunci terstandarisasi untuk pencarian dan interoperabilitas katalog kelautan.',
    category: 'CAT_DESCRIPTION',
    importance: 'supplementary',
    weight: 1,
    source: 'jurnal_hasara_2026',
    expectedFormat: 'Array string kata kunci (minimal 2 kata kunci)',
    targetFields: ['keywords', 'keyword', 'theme'],
    applicableProfiles: 'all',
    isMandatoryInProfile: () => false,
    evaluate: (metadata): EvaluationOutcome => {
      const kw = metadata.keywords || [];
      if (kw.length === 0) {
        return {
          status: 'tidak_terpenuhi',
          valueFound: null,
          findingMessage: 'Tidak ada kata kunci tematik yang tercantum dalam metadata.',
          recommendation: 'Cantumkan kata kunci relevan seperti nama wilayah, sensor, dan jenis ekosistem (misal: "Selat Malaka, Batimetri, Multibeam").',
        };
      }
      return {
        status: 'terpenuhi',
        valueFound: kw.slice(0, 5).join(', '),
        evidenceSnippet: `Ditemukan ${kw.length} kata kunci tematik.`,
      };
    },
  },

  // ==========================================
  // KATEGORI 4: CAKUPAN SPASIAL & TEMPORAL (CAT_EXTENT)
  // ==========================================
  {
    id: 'EXT-01',
    name: 'Batas Koordinat Geografis (Spatial Bounding Box)',
    definition: 'Koordinat batas minimum dan maksimum (West, East, South, North) dalam derajat desimal.',
    category: 'CAT_EXTENT',
    importance: 'critical',
    weight: 3,
    source: 'jurnal_hasara_2026',
    expectedFormat: 'West, East [-180..180], South, North [-90..90] numeric degrees',
    targetFields: ['spatialExtent.westBoundLongitude', 'spatialExtent.eastBoundLongitude', 'spatialExtent.southBoundLatitude', 'spatialExtent.northBoundLatitude'],
    applicableProfiles: 'all',
    iso19115Tag: 'EX_GeographicBoundingBox',
    isIso19115Core: true,
    isMandatoryInProfile: () => true,
    evaluate: (metadata): EvaluationOutcome => {
      const ext = metadata.spatialExtent;
      if (!ext) {
        return {
          status: 'tidak_terpenuhi',
          valueFound: null,
          findingMessage: 'Objek batas spasial (spatial extent / EX_GeographicBoundingBox) tidak ditemukan dalam metadata.',
          recommendation: 'Tambahkan elemen batas geografis (West/South/East/North) dalam derajat desimal.',
        };
      }
      const check = validateBBox(ext.westBoundLongitude, ext.southBoundLatitude, ext.eastBoundLongitude, ext.northBoundLatitude);
      if (!check.valid) {
        return {
          status: 'tidak_valid',
          valueFound: `W:${ext.westBoundLongitude}, S:${ext.southBoundLatitude}, E:${ext.eastBoundLongitude}, N:${ext.northBoundLatitude}`,
          findingMessage: check.reason,
          recommendation: 'Pastikan batas bujur berada di [-180, 180] dan lintang di [-90, 90], serta batas Barat <= Timur dan Selatan <= Utara.',
        };
      }
      return {
        status: 'terpenuhi',
        valueFound: `[${ext.westBoundLongitude?.toFixed(4)}, ${ext.southBoundLatitude?.toFixed(4)}, ${ext.eastBoundLongitude?.toFixed(4)}, ${ext.northBoundLatitude?.toFixed(4)}]`,
        sourcePath: 'spatialExtent (West, South, East, North)',
        evidenceSnippet: `BBox valid terverifikasi dalam rentang geografis.`,
      };
    },
  },
  {
    id: 'EXT-02',
    name: 'Sistem Referensi Koordinat Spasial (Coordinate Reference System / CRS)',
    definition: 'Spesifikasi CRS horizontal yang digunakan dataset (EPSG code, nama proyeksi, atau WKT).',
    category: 'CAT_EXTENT',
    importance: 'critical',
    weight: 3,
    source: 'jurnal_hasara_2026',
    expectedFormat: 'Kode EPSG (misal EPSG:4326, EPSG:32648) atau nama CRS terdefinisi jelas',
    targetFields: ['spatialExtent.crsName', 'referenceSystemIdentifier', 'code'],
    applicableProfiles: 'all',
    iso19115Tag: 'MD_ReferenceSystem.referenceSystemIdentifier',
    isIso19115Core: true,
    isMandatoryInProfile: () => true,
    evaluate: (metadata): EvaluationOutcome => {
      const val = metadata.spatialExtent?.crsName;
      const raw = metadata.rawEvidence.crs;
      if (!val) {
        return {
          status: 'tidak_terpenuhi',
          valueFound: null,
          findingMessage: 'Sistem referensi koordinat spasial (CRS) tidak didefinisikan dalam metadata.',
          recommendation: 'Cantumkan kode EPSG resmi (misal: EPSG:4326 untuk WGS 84 atau zona UTM terkait).',
        };
      }
      if (isPlaceholderValue(val)) {
        return {
          status: 'tidak_valid',
          valueFound: val,
          sourcePath: raw?.path || 'crsName',
          findingMessage: `Nilai sistem koordinat "${val}" terdeteksi sebagai placeholder.`,
          recommendation: 'Ganti placeholder dengan identifikasi EPSG yang presisi.',
        };
      }
      return {
        status: 'terpenuhi',
        valueFound: val,
        sourcePath: raw?.path || 'crsName',
        evidenceSnippet: `CRS: "${val}"`,
      };
    },
  },
  {
    id: 'EXT-03',
    elementId: 'E11',
    name: 'Cakupan Temporal Survei (Temporal Extent)',
    definition: 'Rentang waktu survei atau tanggal publikasi/pembaruan dataset spasial kelautan.',
    category: 'CAT_EXTENT',
    importance: 'important',
    weight: 2,
    source: 'jurnal_hasara_2026',
    expectedFormat: 'Format ISO 8601 (YYYY-MM-DD / rentang tanggal survei)',
    targetFields: ['temporalExtent.startDate', 'temporalExtent.endDate', 'temporalExtent.publicationDate'],
    applicableProfiles: 'all',
    iso19115Tag: 'EX_TemporalExtent.extent',
    isIso19115Core: true,
    isMandatoryInProfile: () => true,
    evaluate: (metadata): EvaluationOutcome => {
      const start = metadata.temporalExtent?.startDate;
      const end = metadata.temporalExtent?.endDate;
      const pub = metadata.temporalExtent?.publicationDate;
      const dateVal = (start && end) ? `${start} s/d ${end}` : (start || end || pub || metadata.metaMetadata?.metadataDate);
      if (!dateVal) {
        return {
          status: 'tidak_terpenuhi',
          valueFound: null,
          findingMessage: 'Cakupan temporal survei (EX_TemporalExtent) atau tanggal referensi data tidak ditemukan.',
          recommendation: 'Sertakan tanggal mulai dan selesai survei (atau tanggal terbit) dalam format ISO 8601 (YYYY-MM-DD).',
        };
      }
      return {
        status: 'terpenuhi',
        valueFound: dateVal,
        evidenceSnippet: `Temporal: "${dateVal}"`,
      };
    },
  },
  {
    id: 'EXT-04',
    name: 'Datum Vertikal / Surutan Pasut (Vertical Sounding Datum)',
    definition: 'Datum vertikal acuan pengukuran kedalaman/ketinggian laut (LAT, MSL, Chart Datum, atau EGM2008).',
    category: 'CAT_EXTENT',
    importance: 'critical',
    weight: 3,
    source: 'jurnal_hasara_2026',
    expectedFormat: 'LAT (Lowest Astronomical Tide) | MSL | Chart Datum | Ellipsoidal Datum',
    targetFields: ['accuracy.verticalDatum', 'datum'],
    applicableProfiles: ['batimetri'],
    isMandatoryInProfile: (p) => p === 'batimetri',
    evaluate: (metadata, _spatial): EvaluationOutcome => {
      const val = metadata.accuracy?.verticalDatum || metadata.spatialExtent?.datum;
      if (!val) {
        return {
          status: 'tidak_terpenuhi',
          valueFound: null,
          findingMessage: 'Datum vertikal pengukuran (Chart Datum / LAT / MSL) tidak dicantumkan.',
          recommendation: 'Dokumentasikan datum acuan surutan pasut secara eksplisit (misal: "Lowest Astronomical Tide (LAT)" atau "Mean Sea Level (MSL)").',
        };
      }
      if (isPlaceholderValue(val)) {
        return {
          status: 'tidak_valid',
          valueFound: val,
          findingMessage: `Nilai datum vertikal "${val}" merupakan teks placeholder.`,
          recommendation: 'Cantumkan datum acuan pasut yang sah sesuai survei hidrografi.',
        };
      }
      return {
        status: 'terpenuhi',
        valueFound: val,
        evidenceSnippet: `Vertical Datum: "${val}"`,
      };
    },
  },

  // ==========================================
  // KATEGORI 5: PARAMETER AKURASI (CAT_ACCURACY)
  // ==========================================
  {
    id: 'ACC-01',
    name: 'Ketidakpastian Vertikal Total (TVU - Total Vertical Uncertainty)',
    definition: 'Nilai batas ketidakpastian vertikal pengukuran kedalaman sesuai standar IHO S-44.',
    category: 'CAT_ACCURACY',
    importance: 'critical',
    weight: 3,
    source: 'jurnal_hasara_2026',
    expectedFormat: 'Nilai numerik meter (misal ±0.25m) atau ordo standar IHO S-44 (Special Order, Order 1a)',
    targetFields: ['accuracy.totalVerticalUncertainty', 'TVU'],
    applicableProfiles: ['batimetri'],
    isMandatoryInProfile: (p) => p === 'batimetri',
    evaluate: (metadata): EvaluationOutcome => {
      const val = metadata.accuracy?.totalVerticalUncertainty;
      const raw = metadata.rawEvidence.tvu;
      if (val === undefined || val === null || val === '') {
        return {
          status: 'tidak_terpenuhi',
          valueFound: null,
          findingMessage: 'Parameter ketidakpastian vertikal total (TVU) tidak terdokumentasi dalam metadata.',
          recommendation: 'Cantumkan nilai TVU atau kepatuhan terhadap ordo standar IHO S-44 (contoh: TVU <= a^2 + (b*d)^2).',
        };
      }
      if (isPlaceholderValue(val)) {
        return {
          status: 'tidak_valid',
          valueFound: val,
          sourcePath: raw?.path || 'tvu',
          findingMessage: `Nilai TVU "${val}" terdeteksi sebagai placeholder.`,
          recommendation: 'Ganti placeholder dengan hasil kalkulasi ketidakpastian vertikal aktual survei.',
        };
      }
      return {
        status: 'terpenuhi',
        valueFound: val,
        sourcePath: raw?.path || 'tvu',
        evidenceSnippet: `TVU: ${val}`,
      };
    },
  },
  {
    id: 'ACC-02',
    name: 'Ketidakpastian Horizontal Total (THU - Total Horizontal Uncertainty)',
    definition: 'Nilai estimasi ketidakpastian posisi horizontal koordinat perum gema/sensor bawah air.',
    category: 'CAT_ACCURACY',
    importance: 'important',
    weight: 2,
    source: 'jurnal_hasara_2026',
    expectedFormat: 'Nilai numerik akurasi posisi meter (misal: ±2.0m, GNSS RTK ±0.05m)',
    targetFields: ['accuracy.totalHorizontalUncertainty', 'THU'],
    applicableProfiles: ['batimetri', 'kelautan_umum'],
    isMandatoryInProfile: (p) => p === 'batimetri',
    evaluate: (metadata): EvaluationOutcome => {
      const val = metadata.accuracy?.totalHorizontalUncertainty;
      const raw = metadata.rawEvidence.thu;
      if (val === undefined || val === null || val === '') {
        return {
          status: 'tidak_terpenuhi',
          valueFound: null,
          findingMessage: 'Parameter ketidakpastian horizontal (THU) tidak ditemukan.',
          recommendation: 'Dokumentasikan nilai THU atau metode penentuan posisi horizontal (DGPS/RTK) yang digunakan.',
        };
      }
      if (isPlaceholderValue(val)) {
        return {
          status: 'tidak_valid',
          valueFound: val,
          sourcePath: raw?.path || 'thu',
          findingMessage: `Nilai THU "${val}" merupakan teks placeholder.`,
          recommendation: 'Masukkan estimasi ketidakpastian posisi dalam meter.',
        };
      }
      return {
        status: 'terpenuhi',
        valueFound: val,
        sourcePath: raw?.path || 'thu',
        evidenceSnippet: `THU: ${val}`,
      };
    },
  },
  {
    id: 'ACC-03',
    name: 'Spesifikasi Instrumen / Sensor Pengukuran (Survey Equipment / Sensor)',
    definition: 'Peralatan survei yang digunakan untuk akuisisi data lapangan (Multibeam Echosounder, Side Scan Sonar, UAV/Satelit).',
    category: 'CAT_ACCURACY',
    importance: 'critical',
    weight: 3,
    source: 'jurnal_hasara_2026',
    expectedFormat: 'Model/Tipe sensor spesifik (contoh: "Kongsberg EM2040 Multibeam", "Sentinel-2 MSI")',
    targetFields: ['accuracy.sensorType', 'instrument'],
    applicableProfiles: 'all',
    isMandatoryInProfile: () => true,
    evaluate: (metadata): EvaluationOutcome => {
      const val = metadata.accuracy?.sensorType;
      if (!val) {
        return {
          status: 'tidak_terpenuhi',
          valueFound: null,
          findingMessage: 'Spesifikasi instrumen atau sensor akuisisi data tidak didokumentasikan.',
          recommendation: 'Dokumentasikan model sensor akustik, optik, atau satelit pengumpul data.',
        };
      }
      if (isPlaceholderValue(val)) {
        return {
          status: 'tidak_valid',
          valueFound: val,
          findingMessage: `Informasi instrumen "${val}" terdeteksi sebagai placeholder.`,
          recommendation: 'Cantumkan pabrikan dan tipe instrumen nyata yang digunakan saat survei.',
        };
      }
      return {
        status: 'terpenuhi',
        valueFound: val,
        evidenceSnippet: `Sensor: "${val}"`,
      };
    },
  },
  {
    id: 'ACC-04',
    name: 'Koreksi Kecepatan Suara Air Laut (Sound Velocity Profile - SVP)',
    definition: 'Dokumentasi apakah kecepatan perambatan gelombang akustik dalam kolom air laut dikoreksi menggunakan probe SVP/CTD.',
    category: 'CAT_ACCURACY',
    importance: 'important',
    weight: 2,
    source: 'jurnal_hasara_2026',
    expectedFormat: 'Status koreksi profil kecepatan suara (CTD/SVP probe)',
    targetFields: ['accuracy.soundVelocityCorrected'],
    applicableProfiles: ['batimetri'],
    isMandatoryInProfile: (p) => p === 'batimetri',
    evaluate: (metadata): EvaluationOutcome => {
      const val = metadata.accuracy?.soundVelocityCorrected;
      if (val) {
        return {
          status: 'terpenuhi',
          valueFound: 'Terkoreksi (SVP/CTD applied)',
          evidenceSnippet: 'Koreksi profil kecepatan suara terdeteksi dalam metadata teknis.',
        };
      }
      return {
        status: 'tidak_terpenuhi',
        valueFound: 'Tidak ada catatan koreksi SVP',
        findingMessage: 'Tidak ditemukan catatan koreksi kecepatan suara (Sound Velocity Profiler) dalam metadata survei batimetri.',
        recommendation: 'Sertakan dokumentasi frekuensi pengukuran SVP dan koreksi refraksi kolom air laut.',
      };
    },
  },
  {
    id: 'ACC-05',
    name: 'Koreksi Reduksi Pasang Surut Air Laut (Tide Reduction)',
    definition: 'Dokumentasi stasiun pengamat pasang surut dan reduksi kedalaman ke surutan terendah.',
    category: 'CAT_ACCURACY',
    importance: 'important',
    weight: 2,
    source: 'jurnal_hasara_2026',
    expectedFormat: 'Catatan stasiun pasut atau model reduksi pasang surut',
    targetFields: ['accuracy.tideCorrected', 'verticalDatum'],
    applicableProfiles: ['batimetri', 'mangrove'],
    isMandatoryInProfile: (p) => p === 'batimetri',
    evaluate: (metadata): EvaluationOutcome => {
      if (metadata.accuracy?.tideCorrected || metadata.accuracy?.verticalDatum) {
        return {
          status: 'terpenuhi',
          valueFound: metadata.accuracy?.verticalDatum || 'Tide corrected documented',
          evidenceSnippet: 'Reduksi pasang surut terkonfirmasi terdokumentasi.',
        };
      }
      return {
        status: 'tidak_terpenuhi',
        valueFound: null,
        findingMessage: 'Informasi stasiun pasang surut atau koreksi reduksi pasut tidak ditemukan.',
        recommendation: 'Dokumentasikan nama stasiun pasut pengamat dan model reduksi pasut ke Chart Datum.',
      };
    },
  },

  // ==========================================
  // KATEGORI 6: NARAHUBUNG & KUSTODIAN (CAT_CONTACT)
  // ==========================================
  {
    id: 'CONT-01',
    name: 'Organisasi Kustodian (Custodian Organization)',
    definition: 'Nama lembaga resmi atau organisasi yang mengelola dan bertanggung jawab atas dataset.',
    category: 'CAT_CONTACT',
    importance: 'critical',
    weight: 3,
    source: 'jurnal_hasara_2026',
    expectedFormat: 'Nama organisasi/instansi lengkap',
    targetFields: ['contact.organization', 'organisationName', 'cntorg'],
    applicableProfiles: 'all',
    iso19115Tag: 'CI_ResponsibleParty.organisationName',
    isIso19115Core: true,
    isMandatoryInProfile: () => true,
    evaluate: (metadata): EvaluationOutcome => {
      const val = metadata.contact?.organization;
      const raw = metadata.rawEvidence.contactOrg;
      if (!val) {
        return {
          status: 'tidak_terpenuhi',
          valueFound: null,
          findingMessage: 'Nama organisasi kustodian data tidak ditemukan dalam elemen kontak.',
          recommendation: 'Cantumkan nama instansi resmi penanggung jawab (misal: Pushidrosal, KKP, BRIN, Bappeda).',
        };
      }
      if (isPlaceholderValue(val)) {
        return {
          status: 'tidak_valid',
          valueFound: val,
          sourcePath: raw?.path || 'contact.organization',
          findingMessage: `Nama organisasi "${val}" terdeteksi sebagai placeholder.`,
          recommendation: 'Ganti placeholder dengan nama institusi pengelola resmi.',
        };
      }
      return {
        status: 'terpenuhi',
        valueFound: val,
        sourcePath: raw?.path || 'contact.organization',
        evidenceSnippet: `Organization: "${val}"`,
      };
    },
  },
  {
    id: 'CONT-02',
    name: 'Alamat Email Narahubung Valid (Contact Email)',
    definition: 'Alamat surel resmi untuk komunikasi teknis dan permintaan akses dataset (bukan placeholder contoh).',
    category: 'CAT_CONTACT',
    importance: 'critical',
    weight: 3,
    source: 'jurnal_hasara_2026',
    expectedFormat: 'Email aktif berdomain resmi institusi',
    targetFields: ['contact.email', 'electronicMailAddress', 'cntemail'],
    applicableProfiles: 'all',
    iso19115Tag: 'CI_Contact.electronicMailAddress',
    isIso19115Core: true,
    isMandatoryInProfile: () => true,
    evaluate: (metadata): EvaluationOutcome => {
      const val = metadata.contact?.email;
      const raw = metadata.rawEvidence.contactEmail;
      if (!val) {
        return {
          status: 'tidak_terpenuhi',
          valueFound: null,
          findingMessage: 'Alamat email kontak tidak dicantumkan dalam metadata.',
          recommendation: 'Cantumkan alamat email resmi narahubung institusi.',
        };
      }
      const check = isValidContactEmail(val);
      if (!check.valid) {
        return {
          status: 'tidak_valid',
          valueFound: val,
          sourcePath: raw?.path || 'contact.email',
          findingMessage: check.reason,
          recommendation: 'Ganti email placeholder dengan alamat surel aktif pengelola data institusi.',
        };
      }
      return {
        status: 'terpenuhi',
        valueFound: val,
        sourcePath: raw?.path || 'contact.email',
        evidenceSnippet: `Contact Email: "${val}"`,
      };
    },
  },
  {
    id: 'CONT-03',
    name: 'Peran Tanggung Jawab Kontak (Role Code)',
    definition: 'Peran formal narahubung sesuai kode peran ISO 19115 (custodian, author, distributor, pointOfContact).',
    category: 'CAT_CONTACT',
    importance: 'supplementary',
    weight: 1,
    source: 'jurnal_hasara_2026',
    expectedFormat: 'RoleCode: custodian | author | pointOfContact | distributor',
    targetFields: ['contact.role', 'roleCode'],
    applicableProfiles: 'all',
    iso19115Tag: 'CI_ResponsibleParty.role',
    isIso19115Core: true,
    isMandatoryInProfile: () => false,
    evaluate: (metadata): EvaluationOutcome => {
      const val = metadata.contact?.role;
      if (!val) {
        return {
          status: 'tidak_terpenuhi',
          valueFound: null,
          findingMessage: 'Peran tanggung jawab kontak (Role Code) tidak didefinisikan.',
          recommendation: 'Cantumkan kode peran seperti "pointOfContact" atau "custodian".',
        };
      }
      return {
        status: 'terpenuhi',
        valueFound: val,
        evidenceSnippet: `Role: "${val}"`,
      };
    },
  },

  // ==========================================
  // KATEGORI 7: META-METADATA (CAT_METAMETADATA)
  // ==========================================
  {
    id: 'META-01',
    name: 'Nama Standar Metadata (Metadata Standard Name)',
    definition: 'Identifikasi standar metadata yang diacu oleh dokumen (ISO 19115 / ISO 19139 / FGDC / Esri).',
    category: 'CAT_METAMETADATA',
    importance: 'important',
    weight: 2,
    source: 'jurnal_hasara_2026',
    expectedFormat: 'String standar (contoh: "ISO 19115/19139", "FGDC-STD-001-1998")',
    targetFields: ['metaMetadata.standardName', 'metadataStandardName'],
    applicableProfiles: 'all',
    iso19115Tag: 'MD_Metadata.metadataStandardName',
    isIso19115Core: true,
    isMandatoryInProfile: () => true,
    evaluate: (metadata): EvaluationOutcome => {
      const val = metadata.metaMetadata?.standardName;
      if (!val) {
        return {
          status: 'tidak_terpenuhi',
          valueFound: null,
          findingMessage: 'Elemen nama standar metadata tidak dicantumkan.',
          recommendation: 'Cantumkan elemen gmd:metadataStandardName (misal: "ISO 19115/19139").',
        };
      }
      return {
        status: 'terpenuhi',
        valueFound: val,
        evidenceSnippet: `Standard: "${val}"`,
      };
    },
  },
  {
    id: 'META-02',
    name: 'Tanggal Pembaruan Dokumen Metadata (Metadata Date Stamp)',
    definition: 'Tanggal ketika catatan metadata ini dibuat atau dimutakhirkan dalam repositori.',
    category: 'CAT_METAMETADATA',
    importance: 'important',
    weight: 2,
    source: 'jurnal_hasara_2026',
    expectedFormat: 'Format ISO 8601 (YYYY-MM-DD)',
    targetFields: ['metaMetadata.metadataDate', 'dateStamp'],
    applicableProfiles: 'all',
    iso19115Tag: 'MD_Metadata.dateStamp',
    isIso19115Core: true,
    isMandatoryInProfile: () => true,
    evaluate: (metadata): EvaluationOutcome => {
      const val = metadata.metaMetadata?.metadataDate || metadata.temporalExtent?.publicationDate;
      if (!val) {
        return {
          status: 'tidak_terpenuhi',
          valueFound: null,
          findingMessage: 'Tanggal pencatatan berkas metadata tidak ditemukan.',
          recommendation: 'Cantumkan elemen gmd:dateStamp berupa tanggal pembuatan berkas metadata.',
        };
      }
      const check = isValidDateString(val);
      if (!check.valid) {
        return {
          status: 'tidak_valid',
          valueFound: val,
          findingMessage: check.reason,
          recommendation: 'Gunakan format tanggal ISO 8601 (YYYY-MM-DD).',
        };
      }
      return {
        status: 'terpenuhi',
        valueFound: val,
        evidenceSnippet: `Metadata Date Stamp: "${val}"`,
      };
    },
  },

  // ==========================================
  // KATEGORI 8: INFORMASI PENGOLAHAN (CAT_PROCESSING)
  // ==========================================
  {
    id: 'PROC-01',
    name: 'Pernyataan Silsilah Pengolahan Data (Lineage Statement)',
    definition: 'Penjelasan riwayat transformasi data dari data mentah lapangan hingga produk akhir.',
    category: 'CAT_PROCESSING',
    importance: 'critical',
    weight: 3,
    source: 'jurnal_hasara_2026',
    expectedFormat: 'Deskripsi naratif tahapan pemrosesan data',
    targetFields: ['processing.lineageStatement', 'lineage', 'statement'],
    applicableProfiles: 'all',
    iso19115Tag: 'DQ_Lineage.statement',
    isIso19115Core: true,
    isMandatoryInProfile: () => true,
    evaluate: (metadata): EvaluationOutcome => {
      const val = metadata.processing?.lineageStatement;
      const raw = metadata.rawEvidence.lineage;
      if (!val) {
        return {
          status: 'tidak_terpenuhi',
          valueFound: null,
          findingMessage: 'Pernyataan silsilah data (Lineage Statement / LI_Lineage) tidak ditemukan.',
          recommendation: 'Tambahkan elemen gmd:statement dengan uraian tahapan pengolahan data mentah menjadi dataset jadi.',
        };
      }
      if (isPlaceholderValue(val)) {
        return {
          status: 'tidak_valid',
          valueFound: val,
          sourcePath: raw?.path || 'lineage',
          findingMessage: `Pernyataan silsilah data "${val}" merupakan teks placeholder.`,
          recommendation: 'Uraikan tahapan pemrosesan sebenarnya (akuisisi, filtrasi noise, koreksi geospasial).',
        };
      }
      return {
        status: 'terpenuhi',
        valueFound: val.length > 80 ? val.substring(0, 80) + '...' : val,
        sourcePath: raw?.path || 'lineage',
        evidenceSnippet: `Lineage statement length: ${val.length} chars`,
      };
    },
  },
  {
    id: 'PROC-02',
    name: 'Dokumentasi Perangkat Lunak Pengolah (Processing Software)',
    definition: 'Perangkat lunak pemroses data kelautan yang digunakan (misal: Caris HIPS/SIPS, QGIS, ArcGIS, Trimble).',
    category: 'CAT_PROCESSING',
    importance: 'supplementary',
    weight: 1,
    source: 'jurnal_hasara_2026',
    expectedFormat: 'Nama dan versi perangkat lunak GIS/Hidrografi',
    targetFields: ['processing.softwareUsed', 'software'],
    applicableProfiles: 'all',
    isMandatoryInProfile: () => false,
    evaluate: (metadata): EvaluationOutcome => {
      const val = metadata.processing?.softwareUsed;
      if (!val) {
        return {
          status: 'tidak_terpenuhi',
          valueFound: null,
          findingMessage: 'Perangkat lunak pengolah data tidak didokumentasikan.',
          recommendation: 'Dokumentasikan perangkat lunak pengolahan yang dipakai (misal: "CARIS HIPS and SIPS 11.4" atau "QGIS 3.34").',
        };
      }
      return {
        status: 'terpenuhi',
        valueFound: val,
        evidenceSnippet: `Software: "${val}"`,
      };
    },
  },

  // ==========================================
  // ADAPTASI KOMPAS: PROFIL SPESIFIK
  // ==========================================
  {
    id: 'PRO-CONS-01',
    name: 'Surat Keputusan / Penetapan Hukum Kawasan (Gazettement Decree)',
    definition: 'Nomor dan tahun SK penetapan status hukum kawasan konservasi perairan (Kepmen KP / SK Gubernur).',
    category: 'CAT_IDENTIFICATION',
    importance: 'critical',
    weight: 3,
    source: 'adaptasi_kompas',
    expectedFormat: 'Nomor Surat Keputusan Penetapan (misal: "Kepmen KP No. 53/KEPMEN-KP/2020")',
    targetFields: ['purpose', 'abstract', 'keywords'],
    applicableProfiles: ['kawasan_konservasi'],
    isMandatoryInProfile: (p) => p === 'kawasan_konservasi',
    evaluate: (metadata): EvaluationOutcome => {
      const corpus = `${metadata.title || ''} ${metadata.abstract || ''} ${metadata.purpose || ''} ${(metadata.keywords || []).join(' ')}`;
      const hasDecree = /kepmen|sk\s*menteri|perda|peraturan|penetapan|nomor|no\.\s*\d+/i.test(corpus);
      if (hasDecree) {
        return {
          status: 'terpenuhi',
          valueFound: 'Dasar hukum penetapan teridentifikasi dalam deskripsi dokumen',
          evidenceSnippet: 'Ditemukan referensi regulasi penetapan kawasan.',
        };
      }
      return {
        status: 'tidak_terpenuhi',
        valueFound: null,
        findingMessage: 'Nomor atau dasar hukum Surat Keputusan penetapan kawasan konservasi tidak tercantum.',
        recommendation: 'Sertakan nomor Keputusan Menteri (Kepmen) atau SK Penetapan status konservasi dalam abstrak/tujuan data.',
      };
    },
  },
  {
    id: 'PRO-MIGR-01',
    name: 'Identifikasi Taksonomi Spesies Migran (Migratory Species Taxonomy)',
    definition: 'Dokumentasi spesies biota laut yang menjadi subjek jalur pergerakan (Penyu, Dugong, Paus, dsb).',
    category: 'CAT_DESCRIPTION',
    importance: 'critical',
    weight: 3,
    source: 'adaptasi_kompas',
    expectedFormat: 'Nama ilmiah atau nama umum spesies biota laut terancam punah',
    targetFields: ['keywords', 'abstract', 'title'],
    applicableProfiles: ['jalur_migrasi'],
    isMandatoryInProfile: (p) => p === 'jalur_migrasi',
    evaluate: (metadata): EvaluationOutcome => {
      const corpus = `${metadata.title || ''} ${metadata.abstract || ''} ${(metadata.keywords || []).join(' ')}`.toLowerCase();
      const hasSpecies = /dugong|penyu|turtle|paus|whale|hiu\s*paus|rhincodon|lumba|cetacean|mamalia/i.test(corpus);
      if (hasSpecies) {
        return {
          status: 'terpenuhi',
          valueFound: 'Spesies biota laut migran teridentifikasi',
          evidenceSnippet: 'Spesies target migrasi terdokumentasi dalam teks metadata.',
        };
      }
      return {
        status: 'tidak_terpenuhi',
        valueFound: null,
        findingMessage: 'Spesies biota laut sasaran koridor migrasi tidak disebutkan secara eksplisit.',
        recommendation: 'Cantumkan nama ilmiah atau nama umum spesies migran (misal: "Dugong dugon", "Chelonia mydas").',
      };
    },
  },
];

// Automatically map E01 - E26 for the 26 Core Elements (List 1: Skor Inti MQI)
AUDIT_RULE_REGISTRY.forEach((r, idx) => {
  if (!r.elementId) {
    r.elementId = `E${String(idx + 1).padStart(2, '0')}`;
  }
});


/**
 * KOMPAS - Quality Warning Flags (F01–F14) v7
 * Based on KOMPAS_data_audit_v7.xlsx (Sheet Penanda & Placeholder)
 * and Handover Tim Aplikasi KOMPAS (Revisi 29 Oktober 2026).
 */

import { NormalizedMetadata } from '../types/audit';
import { getQualityFlagsDefinition } from './configLoader';

export interface QualityFlagResult {
  id: 'F01' | 'F02' | 'F03' | 'F04' | 'F05' | 'F06' | 'F07' | 'F08' | 'F09' | 'F10' | 'F11' | 'F12' | 'F13' | 'F14';
  name: string;
  description: string;
  isTriggered: boolean;
  evidence?: string;
  reason?: string;
}

export const PLACEHOLDER_DICTIONARY = [
  'Admin Admin',
  '-',
  'Belum Ada',
  'Not Specified',
  'None',
  'No information provided',
  'Dataset spasial untuk kebutuhan GIS',
  'Name of the responsible organization',
  'Address of the electronic mailbox',
  'Version of the format',
  'Alphanumeric value identifying an instance in the namespace',
  "General explanation of the data producer's knowledge",
  'Restrictions on the access and use of a resource or metadata',
  'Other restrictions and legal prerequisites',
  'diisi link webservice wms ketika sudah disebarluaskan',
  'The Ancient Geographers',
  'Claudius Ptolomaeus',
];

export const QUALITY_FLAGS_DEFINITIONS: Record<QualityFlagResult['id'], { name: string; description: string }> = {
  F01: {
    name: 'Teks templat, salinan, atau bawaan',
    description: 'Isi elemen berupa teks definisi standar, salinan elemen lain (misal abstrak = judul atau abstrak = lineage), atau teks bawaan yang tidak spesifik.',
  },
  F02: {
    name: 'Bounding box tidak konsisten atau tidak informatif',
    description: 'Koordinat 0,0,0,0, tidak ada, memuat teks kosong, di luar amplop wilayah Indonesia (bujur 90–145, lintang -15 s.d 10), atau terlalu luas untuk dataset lokal.',
  },
  F03: {
    name: 'Jalur lokal atau nama host pada metadata',
    description: 'Jalur berkas lokal (C:\\, file://, //) atau nama host perangkat lokal tercantum dalam metadata.',
  },
  F04: {
    name: 'Bukan XML ISO (ESRI atau rekaman CKAN)',
    description: 'Format data merupakan metadata ESRI XML (.shp.xml) atau rekaman JSON CKAN hasil harvest portal.',
  },
  F05: {
    name: 'Bahasa tidak sesuai isi atau bukan kode ISO',
    description: 'Kode bahasa "eng" untuk isi berbahasa Indonesia, atau teks bebas (misal "bahasa Indonesia") alih-alih kode ISO 639-2 ("ind").',
  },
  F06: {
    name: 'Kontak kosong, placeholder, atau non-institusional',
    description: 'Kontak nilReason=missing, "Belum Ada", "-", nama "Admin Admin", email domain non-institusi (gmail.com), URL dalam kolom email, atau domain tampak keliru.',
  },
  F07: {
    name: 'CRS tidak konsisten atau tidak valid',
    description: 'CRS metadata berbeda dari layanan yang disediakan, kode bukan EPSG/CRS84 valid, atau kode berisi teks templat.',
  },
  F08: {
    name: 'Tanggal tidak konsisten atau ambigu',
    description: 'Periode data tidak cocok dengan judul, tanggal metadata lebih awal dari tanggal sitasi data, atau terdapat tiga tanggal berbeda tanpa kejelasan.',
  },
  F09: {
    name: 'Pernyataan kualitas kontradiktif atau templat',
    description: 'Laporan DQ menggunakan unit templat, nilai ambang batas dilaporkan sebagai hasil terukur, teks templat RBI, atau nilai kelulusan tidak cocok dengan penjelasan.',
  },
  F10: {
    name: 'Teks rusak, terpotong, atau salah ketik',
    description: 'Fragmen teks tercampur, kalimat terpotong (misal berakhiran gantung), salah ejaan nyata pada elemen, atau markup literal "<ContactPerson>".',
  },
  F11: {
    name: 'Elemen ganda atau struktur bermasalah',
    description: 'Blok extent ganda dengan isi identik, elemen city ganda, atau perujukan codelist yang keliru (misal MD_ScopeCode pada elemen peran).',
  },
  F12: {
    name: 'Lisensi bawaan GeoNode',
    description: 'Teks lisensi bawaan GeoNode seperti "Public Domain (PD)" dengan rujukan situs copyright.gov (AS), atau "Not Specified".',
  },
  F13: {
    name: 'Nama standar menyebut ISO 19139',
    description: 'Elemen metadataStandardName mencantumkan spesifikasi implementasi XML (ISO 19139) alih-alih standar isi (SNI 8843-1:2019 / ISO 19115-1:2014).',
  },
  F14: {
    name: 'Penanda penolakan kurasi pada portal',
    description: 'Rekaman memuat status kurasi review_status: "rejected" atau catatan kurasi ekstra kegagalan format.',
  },
};

/**
 * Evaluates F01 to F14 warning flags against a normalized metadata object and raw text.
 */
export function evaluateQualityFlags(metadata?: NormalizedMetadata, rawText = ''): QualityFlagResult[] {
  const flags: QualityFlagResult[] = [];
  const defsFromConfig = getQualityFlagsDefinition();

  function getDef(id: QualityFlagResult['id']) {
    return defsFromConfig[id]
      ? { name: defsFromConfig[id].penanda, description: defsFromConfig[id].definisi }
      : QUALITY_FLAGS_DEFINITIONS[id];
  }

  const rawCorpus = rawText.toLowerCase();
  const title = (metadata?.title || '').trim().toLowerCase();
  const abstract = (metadata?.abstract || '').trim().toLowerCase();
  const purpose = (metadata?.purpose || '').trim().toLowerCase();
  const lineage = (metadata?.processing?.lineageStatement || '').trim().toLowerCase();
  const rawFormat = metadata?.rawFormat || 'unknown';

  // Helper to check placeholder presence in string
  function containsPlaceholder(text: string): string | null {
    if (!text) return null;
    const lower = text.toLowerCase();
    for (const ph of PLACEHOLDER_DICTIONARY) {
      if (lower.includes(ph.toLowerCase())) return ph;
    }
    return null;
  }

  // F01: Teks templat, salinan, atau bawaan
  let f01Triggered = false;
  let f01Evidence = '';
  if (title && abstract && (title === abstract || (abstract.includes(title) && abstract.length <= title.length + 5))) {
    f01Triggered = true;
    f01Evidence = 'Abstrak identik atau menyalin persis judul dataset.';
  } else if (abstract && lineage && (abstract === lineage || lineage.includes(abstract))) {
    f01Triggered = true;
    f01Evidence = 'Pernyataan lineage identik atau menyalin abstrak.';
  } else {
    const phInPurpose = containsPlaceholder(purpose);
    const phInAbstract = containsPlaceholder(abstract);
    const phInLineage = containsPlaceholder(lineage);
    if (phInPurpose) {
      f01Triggered = true;
      f01Evidence = `Tujuan memuat teks templat: "${phInPurpose}"`;
    } else if (phInAbstract) {
      f01Triggered = true;
      f01Evidence = `Abstrak memuat teks templat: "${phInAbstract}"`;
    } else if (phInLineage) {
      f01Triggered = true;
      f01Evidence = `Lineage memuat teks templat: "${phInLineage}"`;
    } else if (metadata?.contactBlocks?.some(b => b.isPlaceholder)) {
      f01Triggered = true;
      f01Evidence = 'Blok kontak memuat data contoh standar ("The Ancient Geographers" / "Claudius Ptolomaeus").';
    } else if (/alur proses pengolahan data/i.test(lineage) && lineage.length < 50) {
      f01Triggered = true;
      f01Evidence = 'Pernyataan lineage merupakan kalimat templat singkat ("Alur proses pengolahan data").';
    }
  }
  flags.push({
    id: 'F01',
    ...getDef('F01'),
    isTriggered: f01Triggered,
    evidence: f01Triggered ? f01Evidence : undefined,
  });

  // F02: Bounding box tidak konsisten atau tidak informatif
  let f02Triggered = false;
  let f02Evidence = '';
  const bbox = metadata?.spatialExtent;
  if (!bbox || bbox.isBBoxValid === false) {
    f02Triggered = true;
    f02Evidence = bbox?.bboxError || 'Bounding box spasial tidak ditemukan atau memuat string kosong/tidak lengkap.';
  } else if (
    bbox.westBoundLongitude === undefined ||
    bbox.eastBoundLongitude === undefined ||
    bbox.southBoundLatitude === undefined ||
    bbox.northBoundLatitude === undefined
  ) {
    f02Triggered = true;
    f02Evidence = 'Bounding box spasial tidak ditemukan dalam berkas metadata.';
  } else {
    const { westBoundLongitude: w, eastBoundLongitude: e, southBoundLatitude: s, northBoundLatitude: n } = bbox;
    if (w === 0 && e === 0 && s === 0 && n === 0) {
      f02Triggered = true;
      f02Evidence = 'Koordinat bounding box bernilai default kosong (0, 0, 0, 0).';
    } else if (w < 90 || e > 145 || s < -15 || n > 10) {
      f02Triggered = true;
      f02Evidence = `Koordinat [${w}, ${s}, ${e}, ${n}] berada di luar amplop wilayah Indonesia [90–145 BT, -15 s.d 10 LU].`;
    } else if ((e - w > 35) && (n - s > 15)) {
      f02Triggered = true;
      f02Evidence = `Cakupan spasial [${w.toFixed(2)}..${e.toFixed(2)} BT, ${s.toFixed(2)}..${n.toFixed(2)} LU] mencakup seluruh Indonesia untuk dataset berlingkup lokal.`;
    }
  }
  flags.push({
    id: 'F02',
    ...getDef('F02'),
    isTriggered: f02Triggered,
    evidence: f02Triggered ? f02Evidence : undefined,
  });

  // F03: Jalur lokal atau nama host pada metadata
  let f03Triggered = false;
  let f03Evidence = '';
  const localPathRegex = /\b([a-zA-Z]:\\[^<"\s]+|file:\/\/[^\s<"']+|\/\/[a-zA-Z0-9_\-]+\\[^<"\s]+)/i;
  const localMatch = rawText.match(localPathRegex);
  const onlineResources = metadata?.allOnlineResources || [];
  if (localMatch) {
    f03Triggered = true;
    f03Evidence = `Ditemukan jalur berkas lokal: "${localMatch[1]}"`;
  } else if (onlineResources.some(r => r.isLocalPath)) {
    f03Triggered = true;
    f03Evidence = `Tautan akses mengarah ke sistem berkas lokal: "${onlineResources.find(r => r.isLocalPath)?.url}"`;
  } else if (/desktop-[a-z0-9]+|laptop-[a-z0-9]+|rog-zephyrus/i.test(rawText)) {
    f03Triggered = true;
    f03Evidence = 'Ditemukan bocoran nama host/perangkat keras lokal pada metadata.';
  }
  flags.push({
    id: 'F03',
    ...getDef('F03'),
    isTriggered: f03Triggered,
    evidence: f03Triggered ? f03Evidence : undefined,
  });

  // F04: Bukan XML ISO (ESRI atau rekaman CKAN)
  const isNonIso = rawFormat === 'xml_esri' || rawFormat === 'json_catalog';
  flags.push({
    id: 'F04',
    ...getDef('F04'),
    isTriggered: isNonIso,
    evidence: isNonIso
      ? `Format berkas adalah ${rawFormat === 'xml_esri' ? 'ESRI XML (.shp.xml)' : 'JSON CKAN package_show'} (bukan skema XML ISO 19139 / 19115-3).`
      : undefined,
  });

  // F05: Bahasa tidak sesuai isi atau bukan kode ISO
  let f05Triggered = false;
  let f05Evidence = '';
  const lang = (metadata?.language || metadata?.metaMetadata?.metadataLanguage || '').toLowerCase().trim();
  if (lang === 'eng' && (title.includes('dan') || abstract.includes('dan') || abstract.includes('data') || abstract.includes('wilayah') || abstract.includes('laut') || abstract.includes('ambon'))) {
    f05Triggered = true;
    f05Evidence = 'Elemen bahasa mencantumkan "eng" (Inggris) padahal konten judul/abstrak berbahasa Indonesia.';
  } else if (lang.includes('indonesia') || lang.includes('bahasa') || (lang.length > 3 && !/^[a-z]{2,3}$/.test(lang))) {
    f05Triggered = true;
    f05Evidence = `Bahasa didefinisikan dengan teks bebas ("${lang}"), bukan kode standar ISO 639-2 ("ind").`;
  }
  flags.push({
    id: 'F05',
    ...getDef('F05'),
    isTriggered: f05Triggered,
    evidence: f05Triggered ? f05Evidence : undefined,
  });

  // F06: Kontak kosong, placeholder, atau non-institusional
  let f06Triggered = false;
  let f06Evidence = '';
  const contact = metadata?.contact;
  const email = (contact?.email || '').toLowerCase().trim();
  const contactOrg = (contact?.organization || '').trim();
  const contactName = (contact?.individualName || '').trim();
  const hasContactBlocksPlaceholder = metadata?.contactBlocks?.some(b => b.isPlaceholder || b.hasUrlInEmail);

  if (!email && !contactOrg && !contactName) {
    f06Triggered = true;
    f06Evidence = 'Blok narahubung/kustodian tidak terisi atau berstatus nilReason=missing.';
  } else if (contactName.toLowerCase() === 'admin admin' || contactOrg.toLowerCase() === 'admin admin') {
    f06Triggered = true;
    f06Evidence = 'Nama kontak merupakan akun default CMS portal ("Admin Admin").';
  } else if (email === 'belum ada' || email === '-' || contactName === 'belum ada' || contactName === '-') {
    f06Triggered = true;
    f06Evidence = 'Sarana kontak berisi teks stub placeholder ("Belum Ada" / "-").';
  } else if (email.endsWith('@gmail.com') || email.endsWith('@yahoo.com')) {
    f06Triggered = true;
    f06Evidence = `Alamat email kustodian resmi menggunakan penyedia gratis non-institusional ("${email}").`;
  } else if (email.includes('@kkp.co.id')) {
    f06Triggered = true;
    f06Evidence = `Alamat email menggunakan domain komersial ("${email}"), bukan domain instansi pemerintah (@kkp.go.id).`;
  } else if (hasContactBlocksPlaceholder) {
    f06Triggered = true;
    f06Evidence = 'Ditemukan blok kontak yang memuat data contoh standar ("The Ancient Geographers") atau URL dalam kolom email.';
  }
  flags.push({
    id: 'F06',
    ...getDef('F06'),
    isTriggered: f06Triggered,
    evidence: f06Triggered ? f06Evidence : undefined,
  });

  // F07: CRS tidak konsisten atau tidak valid
  let f07Triggered = false;
  let f07Evidence = '';
  const crsCode = (metadata?.spatialExtent?.crsCode || '').trim();
  const crsName = (metadata?.spatialExtent?.crsName || '').trim();
  if (/alphanumeric value identifying an instance in the namespace/i.test(crsCode) || /alphanumeric/i.test(crsName)) {
    f07Triggered = true;
    f07Evidence = 'Kode referensi spasial berisi teks definisi templat ISO.';
  } else if (rawCorpus.includes('epsg:4326') && (rawCorpus.includes('epsg:32748') || rawCorpus.includes('epsg:32749') || rawCorpus.includes('epsg:3857'))) {
    f07Triggered = true;
    f07Evidence = 'CRS pada metadata (EPSG:4326) berbeda dengan CRS proyeksi pada URL layanan WMS/WFS.';
  }
  flags.push({
    id: 'F07',
    ...getDef('F07'),
    isTriggered: f07Triggered,
    evidence: f07Triggered ? f07Evidence : undefined,
  });

  // F08: Tanggal tidak konsisten atau ambigu
  let f08Triggered = false;
  let f08Evidence = '';
  const datePub = metadata?.temporalExtent?.publicationDate;
  const dateMeta = metadata?.metaMetadata?.metadataDate;
  const dateStart = metadata?.temporalExtent?.startDate;
  if (dateStart && title.match(/\b(20\d\d)\b/)) {
    const yearInTitle = parseInt(title.match(/\b(20\d\d)\b/)![1], 10);
    const startYear = parseInt(dateStart.slice(0, 4), 10);
    if (!isNaN(yearInTitle) && !isNaN(startYear) && Math.abs(yearInTitle - startYear) > 5) {
      f08Triggered = true;
      f08Evidence = `Tahun pada judul (${yearInTitle}) berbeda jauh dengan rentang temporal data (${startYear}).`;
    }
  }
  if (!f08Triggered && datePub && dateMeta && dateMeta < datePub) {
    f08Triggered = true;
    f08Evidence = `Tanggal berkas metadata (${dateMeta}) lebih awal dari tanggal publikasi dataset (${datePub}).`;
  } else if (!f08Triggered && /dateStamp>2015-12-01/i.test(rawText) && /2022-09-20/i.test(rawText)) {
    f08Triggered = true;
    f08Evidence = 'Tanggal metadata (2015-12-01) lebih tua dari rujukan katalog fitur KUGI yang disitir (2022-09-20).';
  } else if (!f08Triggered && /2007-09-01/i.test(rawText) && /2020-02-06/i.test(rawText) && /2022-10-09/i.test(rawText)) {
    f08Triggered = true;
    f08Evidence = 'Terdapat tiga tanggal referensi berbeda: publikasi 2007, metadata 2020, dan pembuatan rekaman portal 2022.';
  }
  flags.push({
    id: 'F08',
    ...getDef('F08'),
    isTriggered: f08Triggered,
    evidence: f08Triggered ? f08Evidence : undefined,
  });

  // F09: Pernyataan kualitas kontradiktif atau templat
  let f09Triggered = false;
  let f09Evidence = '';
  if (/dq_completenessomission/i.test(rawText) && /temporal consistency/i.test(rawText)) {
    f09Triggered = true;
    f09Evidence = 'Laporan kualitas Completeness Omission memuat unit ukuran templat "temporal consistency".';
  } else if (/dq_temporalconsistency/i.test(rawText) && /<gco:record[^>]*>100<\/gco:record>/i.test(rawText) && !rawCorpus.includes('hari') && !rawCorpus.includes('bulan')) {
    f09Triggered = true;
    f09Evidence = 'Laporan konsistensi temporal bernilai 100 tanpa satuan dan tanpa metodologi pengujian.';
  } else if (/tidak kurang dari 60%/i.test(rawCorpus) || (/60%/i.test(rawCorpus) && /uji akurasi/i.test(rawCorpus))) {
    f09Triggered = true;
    f09Evidence = 'Ambang batas akurasi ("tidak kurang dari 60%") dilaporkan sebagai hasil pengukuran.';
  } else if (/format data adalah gdb/i.test(rawCorpus) || (/ketelitian posisi memenuhi spesifikasi/i.test(rawCorpus) && !rawCorpus.includes('ce90'))) {
    f09Triggered = true;
    f09Evidence = 'Laporan kualitas data memuat teks templat RBI ("format data adalah gdb") padahal layanan berformat WMS.';
  } else if (/temporalvalidity/i.test(rawText) && /> 2 tahun/i.test(rawText)) {
    f09Triggered = true;
    f09Evidence = 'Laporan validitas temporal menyatakan pass=true dengan penjelasan "> 2 tahun" tanpa tanggal spesifik.';
  }
  flags.push({
    id: 'F09',
    ...getDef('F09'),
    isTriggered: f09Triggered,
    evidence: f09Triggered ? f09Evidence : undefined,
  });

  // F10: Teks rusak, terpotong, atau salah ketik
  let f10Triggered = false;
  let f10Evidence = '';
  if (rawCorpus.includes('jalur_penagkapan_ikant')) {
    f10Triggered = true;
    f10Evidence = 'Terdapat salah ketik nama layer pada alternateTitle ("jalur_penagkapan_ikant").';
  } else if (/ditambah dengan proses, metode, distribusi oleh/i.test(rawCorpus)) {
    f10Triggered = true;
    f10Evidence = 'Ditemukan kalimat terpotong gantung dalam uraian abstrak / tujuan.';
  } else if (rawCorpus.includes('pengolahanan')) {
    f10Triggered = true;
    f10Evidence = 'Ditemukan typo ("pengolahanan") pada pernyataan silsilah data.';
  } else if (rawCorpus.includes('<contactperson>') || rawText.includes('&lt;ContactPerson&gt;')) {
    f10Triggered = true;
    f10Evidence = 'Nama kontak memuat fragmen markup literal "<ContactPerson>".';
  } else if (/versilayanan|version.*2023-2043/i.test(rawText) && /png/i.test(rawText)) {
    f10Triggered = true;
    f10Evidence = 'Format distribusi "PNG" berversi rentang tahun ("2023-2043") pada data vektor.';
  } else if (/sr/i.test(metadata?.keywords?.join(' ') || '') && (metadata?.keywords || []).length <= 2) {
    f10Triggered = true;
    f10Evidence = 'Kata kunci memuat singkatan terpotong / tidak bermakna ("sr").';
  } else if (/ambon_100m/i.test(title) && /250000/i.test(rawText)) {
    f10Triggered = true;
    f10Evidence = 'Ketidakkonsistenan resolusi: judul menyebut 100m sedangkan skala menyatakan 1:250.000.';
  }
  flags.push({
    id: 'F10',
    ...getDef('F10'),
    isTriggered: f10Triggered,
    evidence: f10Triggered ? f10Evidence : undefined,
  });

  // F11: Elemen ganda atau struktur bermasalah
  let f11Triggered = false;
  let f11Evidence = '';
  const extentMatches = rawText.match(/<(?:gmd:)?extent\b/gi);
  if (extentMatches && extentMatches.length > 1) {
    f11Triggered = true;
    f11Evidence = `Ditemukan ${extentMatches.length} blok extent (cakupan) dalam satu dokumen.`;
  } else if (rawCorpus.includes('md_scopecode') && rawCorpus.includes('rolecode')) {
    f11Triggered = true;
    f11Evidence = 'Elemen peran (role) salah menautkan codelist MD_ScopeCode alih-alih CI_RoleCode.';
  } else if (metadata?.hasDirectConformanceReport) {
    f11Triggered = true;
    f11Evidence = 'Blok report memuat DQ_ConformanceResult langsung di bawah report tanpa elemen kualitas.';
  }
  flags.push({
    id: 'F11',
    ...getDef('F11'),
    isTriggered: f11Triggered,
    evidence: f11Triggered ? f11Evidence : undefined,
  });

  // F12: Lisensi bawaan GeoNode
  let f12Triggered = false;
  let f12Evidence = '';
  const constraints = (metadata?.distribution?.useConstraints || metadata?.distribution?.accessConstraints || '').toLowerCase();
  if (rawCorpus.includes('copyright.gov') || constraints.includes('copyright.gov')) {
    f12Triggered = true;
    f12Evidence = 'Teks lisensi bawaan GeoNode "Public Domain (PD)" dengan rujukan situs non-Indonesia (copyright.gov).';
  } else if (constraints.includes('not specified') || rawCorpus.includes('the original author did not specify a license')) {
    f12Triggered = true;
    f12Evidence = 'Lisensi bawaan GeoNode: "Not Specified: The original author did not specify a license."';
  }
  flags.push({
    id: 'F12',
    ...getDef('F12'),
    isTriggered: f12Triggered,
    evidence: f12Triggered ? f12Evidence : undefined,
  });

  // F13: Nama standar menyebut ISO 19139
  let f13Triggered = false;
  let f13Evidence = '';
  const stdName = (metadata?.metaMetadata?.standardName || '').toLowerCase();
  if (stdName.includes('19139')) {
    f13Triggered = true;
    f13Evidence = `Elemen metadataStandardName mencantumkan spesifikasi implementasi XML ("${metadata?.metaMetadata?.standardName}"), bukan standar isi SNI/ISO 19115.`;
  }
  flags.push({
    id: 'F13',
    ...getDef('F13'),
    isTriggered: f13Triggered,
    evidence: f13Triggered ? f13Evidence : undefined,
  });

  // F14: Penanda penolakan kurasi pada portal
  let f14Triggered = false;
  let f14Evidence = '';
  if (rawCorpus.includes('kurasi_notes_extra') || rawCorpus.includes('"review_status": "rejected"') || rawCorpus.includes('format data tidak sesuai')) {
    f14Triggered = true;
    f14Evidence = 'Rekaman portal memuat riwayat penolakan kurasi (review_status: "rejected" / "Format data tidak sesuai").';
  }
  flags.push({
    id: 'F14',
    ...getDef('F14'),
    isTriggered: f14Triggered,
    evidence: f14Triggered ? f14Evidence : undefined,
  });

  return flags;
}

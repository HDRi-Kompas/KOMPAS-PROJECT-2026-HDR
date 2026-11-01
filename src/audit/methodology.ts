/**
 * KOMPAS - Metadata Quality Index (MQI)
 * Methodology Foundations and Dataset Profiles
 * 
 * Based on:
 * Hasara, K. M. D., & Karunanayaka, K. A. N. C. (2026).
 * Development of a Metadata Quality Index (MQI) for Bathymetric Data Assessment
 * in Marine Spatial Data Infrastructure.
 * International Journal of Research and Scientific Innovation (IJRSI).
 */

import { DatasetProfile, DatasetProfileId, MQICategory } from '../types/audit';

export const METHODOLOGY_METADATA = {
  originalPaper: {
    title: 'Development of a Metadata Quality Index (MQI) for Bathymetric Data Assessment in Marine Spatial Data Infrastructure',
    authors: 'K. M. D. Hasara & K. A. N. C. Karunanayaka',
    institution: 'Department of Surveying and Geodesy, Sabaragamuwa University of Sri Lanka',
    year: 2026,
    domain: 'Marine Spatial Data Infrastructure (MSDI) & Hydrographic Information',
    journal: 'International Journal of Research and Scientific Innovation (IJRSI)',
    volume: 'Volume XIII Issue II',
    issn: '2321-2705',
    doi: '10.51244/IJRSI.2026.13020067',
    pdfPath: '/assets/aistudio/Development_of_a_Metadata_Quality_Index__MQI__for_Bathymetric_474728e7.pdf',
  },
  weights: {
    critical: { label: 'Critical', weight: 3, description: 'Parameter esensial untuk penemuan data (discovery) dan penilaian kelayakan minimal; ketiadaannya membuat dataset tidak dapat dievaluasi.' },
    important: { label: 'Important', weight: 2, description: 'Diperlukan untuk evaluasi akurasi teknis mendalam dan penentuan kesesuaian tujuan pemanfaatan (fitness-for-purpose).' },
    supplementary: { label: 'Supplementary', weight: 1, description: 'Menyediakan konteks tambahan, dokumentasi pengaya, dan keterlacakan sekunder yang mempermudah pemanfaatan ulang.' },
  },
  formula: {
    equation: 'MQI = (Σ (p_i × w_i) / Σ w_i) × 100',
    description: 'Di mana p_i bernilai 1 jika parameter terdokumentasi dan valid, 0 jika tidak terpenuhi. w_i adalah bobot parameter (1, 2, atau 3).',
  },
  tiers: [
    { min: 90, max: 100, label: 'Excellent', description: 'Complete metadata with all critical and most important parameters documented (Full reuse capability; suitable for all applications).' },
    { min: 75, max: 89.99, label: 'Good', description: 'Most critical and important parameters documented; minor gaps (Suitable for most applications with some limitations).' },
    { min: 50, max: 74.99, label: 'Fair', description: 'Critical parameters documented; important parameters partially documented (Suitable for discovery and basic evaluation; reuse requires caution).' },
    { min: 25, max: 49.99, label: 'Poor', description: 'Critical parameters partially documented; important parameters largely missing (Discovery only; significant limitations for evaluation/reuse).' },
    { min: 0, max: 24.99, label: 'Very Poor', description: 'Minimal documentation; most parameters missing (Limited discovery value; requires retrospective documentation).' },
  ],
  msdiIntegrationLevels: [
    { level: 1, name: 'Level 1: Discovery', minMqi: 25, requiredCriticalParameters: ['Dataset ID', 'Spatial Extent', 'Survey Date', 'Device Type'], description: 'Dataset discoverable through catalogue; basic identification only.', exampleApplications: 'Data inventory, metadata harvesting, catalogue population' },
    { level: 2, name: 'Level 2: Evaluation', minMqi: 50, requiredCriticalParameters: ['Level 1 parameters', 'Device Model', 'Positioning System', 'Vertical Datum', 'Tidal Correction'], description: 'Dataset discoverable and basic accuracy assessment possible.', exampleApplications: 'Preliminary project planning, feasibility studies, research screening' },
    { level: 3, name: 'Level 3: Reuse', minMqi: 75, requiredCriticalParameters: ['Level 2 parameters', 'TVU/THU/TPU', 'Calibration Status', 'SVP Information', 'Processing Lineage'], description: 'Dataset fully documented for confident reuse in applications.', exampleApplications: 'Navigation safety, engineering design, legal boundary determination, time-series analysis' },
  ],
  criticalParametersList: [
    'Dataset ID', 'Spatial Extent', 'Survey Date', 'Device Type', 'Device Model',
    'Positioning System', 'Positioning Accuracy', 'TVU/THU/TPU Values', 'Calibration Status',
    'Calibration Date', 'Processing Software', 'Processing Lineage', 'Tidal Correction',
    'SVP Information', 'Vertical Datum'
  ],
  version: '2.5.0 (IJRSI 2026 Aligned)',
  rulesetVersion: 'Hasara-Karunanayaka-2026-IJRSI',
};

export const MQI_CATEGORIES: Record<MQICategory, { name: string; nameEn: string; description: string }> = {
  CAT_GENERAL: {
    name: '1. Informasi Umum',
    nameEn: 'General Information',
    description: 'Informasi dasar identitas metadata, bahasa, tipe representasi spasial, dan cakupan tematik.',
  },
  CAT_IDENTIFICATION: {
    name: '2. Informasi Identifikasi',
    nameEn: 'Identification Information',
    description: 'Judul resmi dataset, pengidentifikasi unik (UUID/DOI/ID), tanggal penerbitan, dan ringkasan cakupan.',
  },
  CAT_DESCRIPTION: {
    name: '3. Deskripsi & Abstrak',
    nameEn: 'Description & Abstract',
    description: 'Abstrak naratif, tujuan pengumpulan data, kata kunci tematik kelautan, dan batasan penggunaan.',
  },
  CAT_EXTENT: {
    name: '4. Cakupan Spasial & Temporal',
    nameEn: 'Spatial & Temporal Extent',
    description: 'Batas koordinat geografis (bounding box), sistem referensi koordinat (CRS/Datum), dan periode waktu survei.',
  },
  CAT_ACCURACY: {
    name: '5. Parameter Akurasi & Ketidakpastian',
    nameEn: 'Accuracy & Uncertainty Parameters',
    description: 'Ketidakpastian vertikal (TVU), horizontal (THU), datum vertikal pasut, kalibrasi sensor akustik/satelit.',
  },
  CAT_CONTACT: {
    name: '6. Narahubung & Tanggung Jawab',
    nameEn: 'Point of Contact',
    description: 'Organisasi kustodian, nama kustodian, peran/role, serta alamat email dan verifikasi bukan placeholder.',
  },
  CAT_METAMETADATA: {
    name: '7. Meta-Metadata',
    nameEn: 'Meta-Metadata',
    description: 'Standar metadata yang digunakan (ISO 19115/19139, Esri, FGDC), versi skema, dan tanggal pemutakhiran berkas metadata.',
  },
  CAT_PROCESSING: {
    name: '8. Informasi Pengolahan & Silsilah Data',
    nameEn: 'Processing & Lineage Information',
    description: 'Riwayat pemrosesan (lineage), langkah reduksi pasut/kecepatan suara, perangkat lunak pengolah data, dan sumber input.',
  },
};

export const DATASET_PROFILES: Record<DatasetProfileId, DatasetProfile> = {
  batimetri: {
    id: 'batimetri',
    name: 'Batimetri & Topografi Dasar Laut',
    description: 'Profil acuan utama dari jurnal Hasara & Karunanayaka (2026), mengaudit parameter multibeam/singlebeam, TVU/THU, datum pasang surut, dan koreksi SVP.',
    isJournalOriginal: true,
    requiredCategories: [
      'CAT_GENERAL', 'CAT_IDENTIFICATION', 'CAT_DESCRIPTION', 'CAT_EXTENT',
      'CAT_ACCURACY', 'CAT_CONTACT', 'CAT_METAMETADATA', 'CAT_PROCESSING'
    ],
  },
  terumbu_karang: {
    id: 'terumbu_karang',
    name: 'Ekosistem Terumbu Karang',
    description: 'Audit metadata tutupan terumbu karang, bentuk pertumbuhan (lifeform), metode transect foto/line-intercept, dan kondisi pemutihan.',
    isJournalOriginal: false,
    requiredCategories: [
      'CAT_GENERAL', 'CAT_IDENTIFICATION', 'CAT_DESCRIPTION', 'CAT_EXTENT',
      'CAT_ACCURACY', 'CAT_CONTACT', 'CAT_METAMETADATA', 'CAT_PROCESSING'
    ],
  },
  mangrove: {
    id: 'mangrove',
    name: 'Ekosistem Pesisir & Mangrove',
    description: 'Audit pemetaan tutupan tajuk mangrove, spesies dominan, zonasi pasang surut, dan akurasi klasifikasi penginderaan jauh.',
    isJournalOriginal: false,
    requiredCategories: [
      'CAT_GENERAL', 'CAT_IDENTIFICATION', 'CAT_DESCRIPTION', 'CAT_EXTENT',
      'CAT_ACCURACY', 'CAT_CONTACT', 'CAT_METAMETADATA', 'CAT_PROCESSING'
    ],
  },
  habitat_bentik: {
    id: 'habitat_bentik',
    name: 'Habitat Bentik & Lamun (Seagrass)',
    description: 'Audit substrat dasar laut, tutupan padang lamun, skema klasifikasi bentik terstandarisasi, dan resolusi spasial citra.',
    isJournalOriginal: false,
    requiredCategories: [
      'CAT_GENERAL', 'CAT_IDENTIFICATION', 'CAT_DESCRIPTION', 'CAT_EXTENT',
      'CAT_ACCURACY', 'CAT_CONTACT', 'CAT_METAMETADATA', 'CAT_PROCESSING'
    ],
  },
  arkeologi_maritim: {
    id: 'arkeologi_maritim',
    name: 'Arkeologi & Warisan Budaya Maritim',
    description: 'Audit situs kapal karam (shipwreck), sebaran artefak bawah air, sensor magnetometer/side-scan sonar, dan protokol kerahasiaan lokasi.',
    isJournalOriginal: false,
    requiredCategories: [
      'CAT_GENERAL', 'CAT_IDENTIFICATION', 'CAT_DESCRIPTION', 'CAT_EXTENT',
      'CAT_ACCURACY', 'CAT_CONTACT', 'CAT_METAMETADATA', 'CAT_PROCESSING'
    ],
  },
  kawasan_konservasi: {
    id: 'kawasan_konservasi',
    name: 'Kawasan Konservasi Perairan (KKPN / MPA)',
    description: 'Audit batas zonasi perlindungan, surat keputusan penetapan (SK Menteri/Gubernur), badan pengelola, dan hak akses nelayan tradisional.',
    isJournalOriginal: false,
    requiredCategories: [
      'CAT_GENERAL', 'CAT_IDENTIFICATION', 'CAT_DESCRIPTION', 'CAT_EXTENT',
      'CAT_ACCURACY', 'CAT_CONTACT', 'CAT_METAMETADATA', 'CAT_PROCESSING'
    ],
  },
  jalur_migrasi: {
    id: 'jalur_migrasi',
    name: 'Alur Migrasi Biota Laut Terancam',
    description: 'Audit koridor pergerakan mamalia laut, penyu, hiu paus, temporalitas musim migrasi, dan resolusi jalur navigasi.',
    isJournalOriginal: false,
    requiredCategories: [
      'CAT_GENERAL', 'CAT_IDENTIFICATION', 'CAT_DESCRIPTION', 'CAT_EXTENT',
      'CAT_ACCURACY', 'CAT_CONTACT', 'CAT_METAMETADATA', 'CAT_PROCESSING'
    ],
  },
  kelautan_umum: {
    id: 'kelautan_umum',
    name: 'Dataset Kelautan Umum',
    description: 'Audit komprehensif fleksibel untuk data geospasial kelautan umum (oseanografi fisik, batas maritim, perikanan tangkap, dsb).',
    isJournalOriginal: false,
    requiredCategories: [
      'CAT_GENERAL', 'CAT_IDENTIFICATION', 'CAT_DESCRIPTION', 'CAT_EXTENT',
      'CAT_ACCURACY', 'CAT_CONTACT', 'CAT_METAMETADATA', 'CAT_PROCESSING'
    ],
  },
};

export const INDONESIAN_STANDARDS_SNI = [
  {
    code: 'SNI ISO 19115:2012 / SNI ISO 19115-1:2016',
    title: 'Informasi Geografis – Metadata (Bagian 1: Fundamental)',
    scope: 'Standar nasional elemen identifikasi, cakupan geografis, batasan akses, dan kontak kustodian data geospasial kelautan.',
    authority: 'BSN & Badan Informasi Geospasial (BIG)',
  },
  {
    code: 'SNI ISO/TS 19139:2016',
    title: 'Informasi Geografis – Metadata – Penerapan Skema XML',
    scope: 'Standar format pertukaran skema XML (namespace gmd, gco, gml) yang diparsing dan divalidasi oleh engine KOMPAS.',
    authority: 'BSN & BIG',
  },
  {
    code: 'SNI ISO 19157:2017',
    title: 'Informasi Geografis – Kualitas Data',
    scope: 'Tolok ukur pengujian kelengkapan (completeness), konsistensi logis (logical consistency), akurasi posisi, dan silsilah pengolahan data (lineage).',
    authority: 'BSN & BIG',
  },
  {
    code: 'SNI 7987:2014',
    title: 'Spesifikasi Penyajian Peta Batimetri',
    scope: 'Acuan nasional survei batimetri, kerapatan sounding dasar laut, dan datum vertikal surutan pasut (Chart Datum / LAT).',
    authority: 'BSN & Pushidrosal / BIG',
  },
  {
    code: 'SNI 7644:2010',
    title: 'Tata Cara Survei dan Pemetaan Ekosistem Mangrove',
    scope: 'Standar nasional survei lapangan, tutupan kanopi tajuk, zonasi pasut pantai, dan metadata penginderaan jauh mangrove.',
    authority: 'BSN & Kementerian Kelautan dan Perikanan (KKP)',
  },
  {
    code: 'SNI 7743:2011 & SNI 7744:2011',
    title: 'Survei dan Pemetaan Padang Lamun & Terumbu Karang',
    scope: 'Pedoman standar metadata tutupan bentik perairan laut dangkal, substrat, dan tutupan karang hidup di perairan Indonesia.',
    authority: 'BSN & Pusat Riset Oseanografi BRIN',
  },
  {
    code: 'IHO S-44 & IHO S-102 (Standar Hidrografi Nasional)',
    title: 'IHO Standards for Hydrographic Surveys & Bathymetric Surface',
    scope: 'Standar akurasi ketidakpastian vertikal (TVU) dan horizontal (THU), ordo survei hidrografi (Order 1a/1b/Special Order) yang diterapkan oleh Pushidrosal.',
    authority: 'International Hydrographic Organization & Pushidrosal TNI AL',
  },
];

export const ISO19115_CORE_ELEMENTS = [
  {
    code: 'ISO-TITLE',
    name: 'Dataset Title',
    nameId: 'Judul Resmi Dataset',
    isoTag: 'MD_DataIdentification.citation.title',
    xmlPath: 'gmd:identificationInfo//gmd:citation//gmd:title',
    isMandatory: true,
    category: 'CAT_IDENTIFICATION',
    ruleId: 'ID-01',
    description: 'Nama formal atau judul resmi dataset geospasial kelautan.',
  },
  {
    code: 'ISO-DATE',
    name: 'Dataset Reference Date',
    nameId: 'Tanggal Referensi Dataset',
    isoTag: 'MD_DataIdentification.citation.date',
    xmlPath: 'gmd:identificationInfo//gmd:citation//gmd:date',
    isMandatory: true,
    category: 'CAT_IDENTIFICATION',
    ruleId: 'ID-03',
    description: 'Tanggal pembuatan, publikasi, atau revisi dataset.',
  },
  {
    code: 'ISO-LANG',
    name: 'Dataset Language',
    nameId: 'Bahasa Dataset',
    isoTag: 'MD_DataIdentification.language',
    xmlPath: 'gmd:identificationInfo//gmd:language',
    isMandatory: true,
    category: 'CAT_GENERAL',
    ruleId: 'GEN-01',
    description: 'Bahasa pengantar metadata dan atribut (contoh: ind, eng).',
  },
  {
    code: 'ISO-TOPIC',
    name: 'Dataset Topic Category',
    nameId: 'Kategori Topik Geospasial',
    isoTag: 'MD_DataIdentification.topicCategory',
    xmlPath: 'gmd:identificationInfo//gmd:topicCategory',
    isMandatory: true,
    category: 'CAT_GENERAL',
    ruleId: 'GEN-02',
    description: 'Klasifikasi domain tematik ISO 19115 (oceans, elevation, biota, boundaries).',
  },
  {
    code: 'ISO-ABSTRACT',
    name: 'Dataset Abstract',
    nameId: 'Abstrak / Ringkasan Deskriptif',
    isoTag: 'MD_DataIdentification.abstract',
    xmlPath: 'gmd:identificationInfo//gmd:abstract',
    isMandatory: true,
    category: 'CAT_DESCRIPTION',
    ruleId: 'DESC-01',
    description: 'Uraian ringkas naratif mengenai isi dan karakteristik dataset.',
  },
  {
    code: 'ISO-CONTACT-ORG',
    name: 'Dataset Point of Contact',
    nameId: 'Organisasi Kustodian / Narahubung',
    isoTag: 'CI_ResponsibleParty.organisationName',
    xmlPath: 'gmd:identificationInfo//gmd:pointOfContact//gmd:organisationName',
    isMandatory: true,
    category: 'CAT_CONTACT',
    ruleId: 'CONT-01',
    description: 'Identitas instansi kustodian atau institusi penanggung jawab data.',
  },
  {
    code: 'ISO-CONTACT-EMAIL',
    name: 'Contact Electronic Mail',
    nameId: 'Email Narahubung Resmi',
    isoTag: 'CI_Contact.electronicMailAddress',
    xmlPath: 'gmd:identificationInfo//gmd:pointOfContact//gmd:electronicMailAddress',
    isMandatory: true,
    category: 'CAT_CONTACT',
    ruleId: 'CONT-02',
    description: 'Alamat surel kontak resmi yang valid dan bukan placeholder.',
  },
  {
    code: 'ISO-CONTACT-ROLE',
    name: 'Contact Role',
    nameId: 'Peran Tanggung Jawab Kontak',
    isoTag: 'CI_ResponsibleParty.role',
    xmlPath: 'gmd:identificationInfo//gmd:pointOfContact//gmd:role',
    isMandatory: false,
    category: 'CAT_CONTACT',
    ruleId: 'CONT-03',
    description: 'Peran formal narahubung sesuai kode peran ISO 19115.',
  },
  {
    code: 'ISO-BBOX',
    name: 'Geographic Bounding Box',
    nameId: 'Batas Koordinat Geografis',
    isoTag: 'EX_GeographicBoundingBox',
    xmlPath: 'gmd:identificationInfo//gmd:extent//gmd:EX_GeographicBoundingBox',
    isMandatory: true,
    category: 'CAT_EXTENT',
    ruleId: 'EXT-01',
    description: 'Empat batas koordinat bujur/lintang (West, East, South, North).',
  },
  {
    code: 'ISO-CRS',
    name: 'Spatial Reference System',
    nameId: 'Sistem Referensi Spasial (CRS/Datum)',
    isoTag: 'MD_ReferenceSystem',
    xmlPath: 'gmd:referenceSystemInfo//gmd:referenceSystemIdentifier',
    isMandatory: true,
    category: 'CAT_EXTENT',
    ruleId: 'EXT-02',
    description: 'Sistem proyeksi koordinat dan datum geodetik (misal: EPSG:4326 WGS 84).',
  },
  {
    code: 'ISO-LINEAGE',
    name: 'Lineage Statement',
    nameId: 'Silsilah Pengolahan Data (Lineage)',
    isoTag: 'DQ_Lineage.statement',
    xmlPath: 'gmd:dataQualityInfo//gmd:lineage//gmd:statement',
    isMandatory: false,
    category: 'CAT_PROCESSING',
    ruleId: 'PROC-01',
    description: 'Dokumentasi riwayat proses, software pengolah, dan transformasi data.',
  },
  {
    code: 'ISO-METASTD',
    name: 'Metadata Standard Name',
    nameId: 'Nama Standar Metadata',
    isoTag: 'MD_Metadata.metadataStandardName',
    xmlPath: 'gmd:metadataStandardName',
    isMandatory: true,
    category: 'CAT_METAMETADATA',
    ruleId: 'META-01',
    description: 'Identifikasi standar metadata (ISO 19115 / SNI ISO 19115 / Esri).',
  },
  {
    code: 'ISO-METADATE',
    name: 'Metadata Date Stamp',
    nameId: 'Tanggal Pemutakhiran Metadata',
    isoTag: 'MD_Metadata.dateStamp',
    xmlPath: 'gmd:dateStamp',
    isMandatory: true,
    category: 'CAT_METAMETADATA',
    ruleId: 'META-02',
    description: 'Tanggal berkas metadata dibuat atau terakhir kali diverifikasi.',
  },
];

export const ISO19115_PACKAGE_MAPPING = [
  {
    package: 'MD_DataIdentification',
    name: 'Identifikasi Data',
    iso19115Part: 'ISO 19115-1 Pasal 6.5.2',
    mqiCategories: ['CAT_IDENTIFICATION', 'CAT_GENERAL', 'CAT_DESCRIPTION'],
    parametersCount: 28,
    description: 'Menyimpan judul, pengidentifikasi unik, bahasa, topik kelautan, ringkasan abstrak, serta batasan akses legal.',
  },
  {
    package: 'EX_Extent',
    name: 'Cakupan Spasial, Temporal & Vertikal',
    iso19115Part: 'ISO 19115-1 Pasal 6.6.1',
    mqiCategories: ['CAT_EXTENT'],
    parametersCount: 12,
    description: 'Mendefinisikan batas koordinat geografis bujur-lintang, elevasi/kedalaman batimetri, dan rentang tanggal survei.',
  },
  {
    package: 'DQ_DataQuality (ISO 19157)',
    name: 'Kualitas & Ketidakpastian Data',
    iso19115Part: 'ISO 19115-1 / ISO 19157',
    mqiCategories: ['CAT_ACCURACY'],
    parametersCount: 21,
    description: 'Tolok ukur akurasi posisi, ketidakpastian vertikal (TVU), horizontal (THU), kalibrasi patch-test, dan CATZOC.',
  },
  {
    package: 'CI_ResponsibleParty',
    name: 'Pihak yang Bertanggung Jawab',
    iso19115Part: 'ISO 19115-1 Pasal 6.5.3',
    mqiCategories: ['CAT_CONTACT'],
    parametersCount: 6,
    description: 'Organisasi kustodian, nama surveyor/operator, peran (custodian/owner/author), dan email narahubung resmi.',
  },
  {
    package: 'MD_Metadata',
    name: 'Meta-Metadata',
    iso19115Part: 'ISO 19115-1 Pasal 6.2',
    mqiCategories: ['CAT_METAMETADATA'],
    parametersCount: 5,
    description: 'Informasi pengelola rekaman metadata, versi standar skema (ISO 19115-1:2014), dan tanggal pemutakhiran berkas.',
  },
  {
    package: 'DQ_Lineage & MD_ProcessStep',
    name: 'Silsilah Pengolahan Data',
    iso19115Part: 'ISO 19115-1 Pasal 6.5.5',
    mqiCategories: ['CAT_PROCESSING'],
    parametersCount: 6,
    description: 'Silsilah pengolahan data, reduksi pasut, filtering data titik sounding, dan perangkat lunak akuisisi/post-processing.',
  },
];

/**
 * KOMPAS - ISO 19115-3 (mdb) Extension Audit Engine (E27–E32)
 * 
 * Mengevaluasi 6 Elemen Ekstensi spesifik format ISO 19115-3 (<mdb:MD_Metadata>):
 * E27 (Informasi Umum): Representasi Spasial (Topologi & Geometri)
 * E28 (Identifikasi): Lingkup Metadata (metadataScope / MD_Scope)
 * E29 (Identifikasi): Katalog Simbol / Penyajian (portrayalCatalogueInfo)
 * E30 (Identifikasi): Skema Aplikasi (applicationSchemaInfo)
 * E31 (Deskripsi): Kepatuhan KUGI (Katalog Unsur Geografi Indonesia)
 * E32 (Distribusi): Metadata Layanan (distributionInfo / WMS, WFS, CSW)
 * 
 * ATURAN DETEKSI ROOT ELEMENT:
 * - Jika parser membaca <gmd:MD_Metadata>, elemen E27-E32 diisi N/A (tidak berlaku).
 * - Jika parser membaca <mdb:MD_Metadata>, seluruh elemen E27-E32 dievaluasi aktif.
 */

import { ExtensionElementResult, Iso19115_3ReadinessReport, NormalizedMetadata } from '../types/audit';

export function evaluateIso19115_3Extensions(metadata?: NormalizedMetadata): Iso19115_3ReadinessReport {
  // 1. Deteksi Root Element
  const isMdb = metadata?.xmlRootElement === 'mdb:MD_Metadata' || metadata?.isMdbFormat === true || metadata?.rawFormat === 'xml_iso19115_3';
  const rootElementDetected = isMdb ? 'mdb:MD_Metadata' : metadata?.xmlRootElement === 'gmd:MD_Metadata' ? 'gmd:MD_Metadata' : 'other';

  // Jika BUKAN mdb (misal format gmd:MD_Metadata lama), seluruh List 2 berstatus N/A
  if (!isMdb || !metadata) {
    const naElements: ExtensionElementResult[] = [
      {
        elementId: 'E27',
        name: 'Representasi Spasial (Topologi & Geometri)',
        category: 'CAT_GENERAL',
        categoryName: '1. Informasi Umum',
        mdbPath: 'mdb:spatialRepresentationInfo',
        description: 'Bentuk geometri data (titik, garis, poligon) dan tingkat topologinya (geometryOnly atau fullPlanarGraph).',
        scoreValue: 0,
        maxScore: 1,
        status: 'tidak_berlaku',
        isApplicable: false,
        ruleConditionSummary: '1.0: topologyLevel + geometricObjectType + count | 0.5: salah satu/dua | 0: kosong',
        valueFoundText: 'N/A (Bukan format mdb)',
        findingMessage: 'Dokumen menggunakan format <gmd:MD_Metadata> (ISO 19139 lama). Elemen E27 hanya berlaku untuk skema ISO 19115-3 (<mdb:MD_Metadata>).',
        recommendation: 'Lakukan migrasi ke skema ISO 19115-3:2021 (<mdb:MD_Metadata>) untuk mengaktifkan elemen representasi spasial terperinci.',
      },
      {
        elementId: 'E28',
        name: 'Lingkup Metadata (metadataScope)',
        category: 'CAT_IDENTIFICATION',
        categoryName: '2. Informasi Identifikasi',
        mdbPath: 'mdb:metadataScope/mcc:MD_Scope',
        description: 'Menjelaskan level data (dataset, featureType, service) beserta nama spesifiknya (misal: "RBI").',
        scoreValue: 0,
        maxScore: 1,
        status: 'tidak_berlaku',
        isApplicable: false,
        ruleConditionSummary: '1.0: MD_ScopeCode + name | 0.5: hanya kode scope | 0: kosong',
        valueFoundText: 'N/A (Bukan format mdb)',
        findingMessage: 'Dokumen menggunakan format <gmd:MD_Metadata> (ISO 19139 lama). Elemen E28 hanya berlaku untuk skema ISO 19115-3 (<mdb:MD_Metadata>).',
        recommendation: 'Terapkan blok <mdb:metadataScope> dengan kode hierarki dan nama spesifik lingkup dataset.',
      },
      {
        elementId: 'E29',
        name: 'Katalog Simbol / Penyajian (portrayalCatalogueInfo)',
        category: 'CAT_IDENTIFICATION',
        categoryName: '2. Informasi Identifikasi',
        mdbPath: 'mdb:portrayalCatalogueInfo',
        description: 'Aturan visualisasi/simbologi (warna, pola) yang digunakan pada peta.',
        scoreValue: 0,
        maxScore: 1,
        status: 'tidak_berlaku',
        isApplicable: false,
        ruleConditionSummary: '1.0: sitasi ke dokumen aturan simbol resmi | 0.5: teks deskriptif umum | 0: kosong',
        valueFoundText: 'N/A (Bukan format mdb)',
        findingMessage: 'Dokumen menggunakan format <gmd:MD_Metadata> (ISO 19139 lama). Elemen E29 hanya berlaku untuk skema ISO 19115-3 (<mdb:MD_Metadata>).',
        recommendation: 'Sertakan sitasi aturan simbol peta (misal SNI Penyajian Peta / Katalog Simbol BIG) pada elemen mdb:portrayalCatalogueInfo.',
      },
      {
        elementId: 'E30',
        name: 'Skema Aplikasi (applicationSchemaInfo)',
        category: 'CAT_IDENTIFICATION',
        categoryName: '2. Informasi Identifikasi',
        mdbPath: 'mdb:applicationSchemaInfo',
        description: 'Model data (UML) atau kamus data yang mendefinisikan struktur data spasial tersebut.',
        scoreValue: 0,
        maxScore: 1,
        status: 'tidak_berlaku',
        isApplicable: false,
        ruleConditionSummary: '1.0: nama skema UML + tautan/dokumen | 0.5: hanya nama skema | 0: kosong',
        valueFoundText: 'N/A (Bukan format mdb)',
        findingMessage: 'Dokumen menggunakan format <gmd:MD_Metadata> (ISO 19139 lama). Elemen E30 hanya berlaku untuk skema ISO 19115-3 (<mdb:MD_Metadata>).',
        recommendation: 'Dokumentasikan nama model data UML dan tautan berkas skema pada mdb:applicationSchemaInfo.',
      },
      {
        elementId: 'E31',
        name: 'Kepatuhan KUGI (Katalog Unsur Geografi Indonesia)',
        category: 'CAT_DESCRIPTION',
        categoryName: '3. Deskripsi & Abstrak',
        mdbPath: 'mdb:contentInfo/mrc:MD_FeatureCatalogueDescription',
        description: 'Menilai apakah data sudah sesuai dengan Katalog Unsur Geografi Indonesia (KUGI).',
        scoreValue: 0,
        maxScore: 1,
        status: 'tidak_berlaku',
        isApplicable: false,
        ruleConditionSummary: '1.0: complianceCode true + sitasi KUGI | 0.5: sitasi KUGI tanpa complianceCode | 0: tidak ada',
        valueFoundText: 'N/A (Bukan format mdb)',
        findingMessage: 'Dokumen menggunakan format <gmd:MD_Metadata> (ISO 19139 lama). Elemen E31 hanya berlaku untuk skema ISO 19115-3 (<mdb:MD_Metadata>).',
        recommendation: 'Tambahkan blok feature catalogue description dengan complianceCode true dan sitasi Katalog Unsur Geografi Indonesia.',
      },
      {
        elementId: 'E32',
        name: 'Metadata Layanan (distributionInfo)',
        category: 'CAT_PROCESSING',
        categoryName: '8. Informasi Pengolahan & Distribusi',
        mdbPath: 'mdb:distributionInfo',
        description: 'Menilai apakah metadata mencantumkan tautan layanan (Service) WMS, WFS, atau CSW beserta deskripsi operasinya.',
        scoreValue: 0,
        maxScore: 1,
        status: 'tidak_berlaku',
        isApplicable: false,
        ruleConditionSummary: '1.0: tautan layanan (WMS/WFS/CSW) + deskripsi operasi | 0.5: tautan tanpa deskripsi | 0: kosong',
        valueFoundText: 'N/A (Bukan format mdb)',
        findingMessage: 'Dokumen menggunakan format <gmd:MD_Metadata> (ISO 19139 lama). Elemen E32 hanya berlaku untuk skema ISO 19115-3 (<mdb:MD_Metadata>).',
        recommendation: 'Cantumkan tautan endpoint Web Map Service (WMS) atau WFS beserta deskripsi layanannya.',
      },
    ];

    return {
      isApplicable: false,
      rootElementDetected,
      scorePercentage: null,
      totalPointsEarned: null,
      maxPoints: 6,
      statusLabel: 'N/A (Format <gmd:MD_Metadata>)',
      elements: naElements,
    };
  }

  // 2. Evaluasi Aktif untuk format ISO 19115-3 (<mdb:MD_Metadata>)
  const evidence = metadata.rawEvidence || {};

  // E27: Representasi Spasial (Topologi & Geometri)
  const e27Raw = evidence.e27_spatialRepresentation?.value || {};
  const hasTopology = !!e27Raw.topologyLevel;
  const hasGeomType = !!e27Raw.geometricObjectType;
  const hasCount = typeof e27Raw.count === 'number' && e27Raw.count > 0;
  const e27PresenceCount = (hasTopology ? 1 : 0) + (hasGeomType ? 1 : 0) + (hasCount ? 1 : 0);

  let e27Score = 0;
  let e27Status: ExtensionElementResult['status'] = 'tidak_terpenuhi';
  let e27ValText = 'Tidak ditemukan';
  if (e27PresenceCount === 3) {
    e27Score = 1.0;
    e27Status = 'terpenuhi';
    e27ValText = `Topologi: ${e27Raw.topologyLevel}, Geometri: ${e27Raw.geometricObjectType}, Jumlah: ${e27Raw.count}`;
  } else if (e27PresenceCount > 0) {
    e27Score = 0.5;
    e27Status = 'sebagian';
    const foundParts: string[] = [];
    if (hasTopology) foundParts.push(`Topologi: ${e27Raw.topologyLevel}`);
    if (hasGeomType) foundParts.push(`Geometri: ${e27Raw.geometricObjectType}`);
    if (hasCount) foundParts.push(`Jumlah: ${e27Raw.count}`);
    e27ValText = `Hanya sebagian (${foundParts.join(', ')})`;
  }

  // E28: Lingkup Metadata (metadataScope)
  const e28Raw = evidence.e28_metadataScope?.value || {};
  const hasScopeCode = !!e28Raw.scopeCode;
  const hasScopeName = !!e28Raw.name;

  let e28Score = 0;
  let e28Status: ExtensionElementResult['status'] = 'tidak_terpenuhi';
  let e28ValText = 'Tidak ditemukan';
  if (hasScopeCode && hasScopeName) {
    e28Score = 1.0;
    e28Status = 'terpenuhi';
    e28ValText = `Scope: ${e28Raw.scopeCode}, Nama: "${e28Raw.name}"`;
  } else if (hasScopeCode) {
    e28Score = 0.5;
    e28Status = 'sebagian';
    e28ValText = `Scope: ${e28Raw.scopeCode} (Tanpa nama spesifik)`;
  }

  // E29: Katalog Simbol / Penyajian (portrayalCatalogueInfo)
  const e29Raw = evidence.e29_portrayalCatalogue?.value || {};
  let e29Score = 0;
  let e29Status: ExtensionElementResult['status'] = 'tidak_terpenuhi';
  let e29ValText = 'Tidak ditemukan';
  if (e29Raw.citation) {
    if (e29Raw.isSpecificDocument) {
      e29Score = 1.0;
      e29Status = 'terpenuhi';
      e29ValText = 'Sitasi dokumen aturan simbol spesifik teridentifikasi';
    } else {
      e29Score = 0.5;
      e29Status = 'sebagian';
      e29ValText = 'Informasi penyajian ada namun tidak spesifik standar';
    }
  }

  // E30: Skema Aplikasi (applicationSchemaInfo)
  const e30Raw = evidence.e30_applicationSchema?.value || {};
  let e30Score = 0;
  let e30Status: ExtensionElementResult['status'] = 'tidak_terpenuhi';
  let e30ValText = 'Tidak ditemukan';
  if (e30Raw.schemaName && e30Raw.docLink) {
    e30Score = 1.0;
    e30Status = 'terpenuhi';
    e30ValText = `Skema: "${e30Raw.schemaName}", Dokumen: ${e30Raw.docLink}`;
  } else if (e30Raw.schemaName) {
    e30Score = 0.5;
    e30Status = 'sebagian';
    e30ValText = `Skema: "${e30Raw.schemaName}" (Tanpa tautan dokumen)`;
  }

  // E31: Kepatuhan KUGI
  const e31Raw = evidence.e31_kugiCompliance?.value || {};
  let e31Score = 0;
  let e31Status: ExtensionElementResult['status'] = 'tidak_terpenuhi';
  let e31ValText = 'Tidak terdeteksi';
  if (e31Raw.citesKugi && e31Raw.complianceCode === true) {
    e31Score = 1.0;
    e31Status = 'terpenuhi';
    e31ValText = 'KUGI disitasi dengan complianceCode: true';
  } else if (e31Raw.citesKugi) {
    e31Score = 0.5;
    e31Status = 'sebagian';
    e31ValText = 'Menyitasi KUGI tetapi complianceCode belum bernilai true';
  }

  // E32: Metadata Layanan (distributionInfo)
  const e32Raw = evidence.e32_distributionService?.value || {};
  let e32Score = 0;
  let e32Status: ExtensionElementResult['status'] = 'tidak_terpenuhi';
  let e32ValText = 'Tidak ditemukan';
  if (e32Raw.serviceUrl && e32Raw.operationDescription) {
    e32Score = 1.0;
    e32Status = 'terpenuhi';
    e32ValText = `Layanan: ${e32Raw.serviceUrl} - ${e32Raw.operationDescription}`;
  } else if (e32Raw.serviceUrl) {
    e32Score = 0.5;
    e32Status = 'sebagian';
    e32ValText = `Layanan: ${e32Raw.serviceUrl} (Tanpa deskripsi operasi)`;
  }

  const elements: ExtensionElementResult[] = [
    {
      elementId: 'E27',
      name: 'Representasi Spasial (Topologi & Geometri)',
      category: 'CAT_GENERAL',
      categoryName: '1. Informasi Umum',
      mdbPath: 'mdb:spatialRepresentationInfo',
      description: 'Menjelaskan bentuk geometri data (titik, garis, poligon) dan tingkat topologinya (misal: geometryOnly atau fullPlanarGraph).',
      scoreValue: e27Score,
      maxScore: 1,
      status: e27Status,
      isApplicable: true,
      ruleConditionSummary: '1.0: topologyLevel + geometricObjectType + count | 0.5: salah satu/dua | 0: kosong',
      valueFoundText: e27ValText,
      findingMessage: e27Score === 1 ? undefined : e27Score === 0.5 ? 'Elemen representasi spasial hanya memuat sebagian komponen topologi/geometri.' : 'Elemen mdb:spatialRepresentationInfo belum didokumentasikan.',
      recommendation: 'Lengkapi elemen topologyLevel, geometricObjectType, dan geometricObjectCount.',
    },
    {
      elementId: 'E28',
      name: 'Lingkup Metadata (metadataScope)',
      category: 'CAT_IDENTIFICATION',
      categoryName: '2. Informasi Identifikasi',
      mdbPath: 'mdb:metadataScope/mcc:MD_Scope',
      description: 'Menjelaskan level data (dataset, featureType, service) serta nama spesifiknya (misal: "RBI").',
      scoreValue: e28Score,
      maxScore: 1,
      status: e28Status,
      isApplicable: true,
      ruleConditionSummary: '1.0: MD_ScopeCode + name | 0.5: hanya kode scope | 0: kosong',
      valueFoundText: e28ValText,
      findingMessage: e28Score === 1 ? undefined : e28Score === 0.5 ? 'Hanya mencantumkan MD_ScopeCode tanpa nama spesifik lingkup.' : 'Blok mdb:metadataScope/mcc:MD_Scope belum didefinisikan.',
      recommendation: 'Sertakan MD_ScopeCode (dataset) dan nama dataset pada elemen mcc:name.',
    },
    {
      elementId: 'E29',
      name: 'Katalog Simbol / Penyajian (portrayalCatalogueInfo)',
      category: 'CAT_IDENTIFICATION',
      categoryName: '2. Informasi Identifikasi',
      mdbPath: 'mdb:portrayalCatalogueInfo',
      description: 'Informasi tentang aturan visualisasi/simbologi (warna, pola) yang digunakan pada peta.',
      scoreValue: e29Score,
      maxScore: 1,
      status: e29Status,
      isApplicable: true,
      ruleConditionSummary: '1.0: sitasi ke dokumen aturan simbol resmi | 0.5: teks deskriptif umum | 0: kosong',
      valueFoundText: e29ValText,
      findingMessage: e29Score === 1 ? undefined : e29Score === 0.5 ? 'Teks penyajian ada namun belum menyitasi dokumen standar resmi (SNI/Katalog Simbol).' : 'Elemen mdb:portrayalCatalogueInfo belum dicantumkan.',
      recommendation: 'Tambahkan referensi spesifik dokumen standar simbol peta (contoh: SNI Penyajian Peta atau Katalog Simbol BIG).',
    },
    {
      elementId: 'E30',
      name: 'Skema Aplikasi (applicationSchemaInfo)',
      category: 'CAT_IDENTIFICATION',
      categoryName: '2. Informasi Identifikasi',
      mdbPath: 'mdb:applicationSchemaInfo',
      description: 'Informasi tentang model data (UML) atau kamus data yang mendefinisikan struktur data spasial tersebut.',
      scoreValue: e30Score,
      maxScore: 1,
      status: e30Status,
      isApplicable: true,
      ruleConditionSummary: '1.0: nama skema UML + tautan/dokumen | 0.5: hanya nama skema | 0: kosong',
      valueFoundText: e30ValText,
      findingMessage: e30Score === 1 ? undefined : e30Score === 0.5 ? 'Nama skema terdaftar namun tautan dokumen skema belum ada.' : 'Informasi skema aplikasi (mdb:applicationSchemaInfo) kosong.',
      recommendation: 'Sertakan nama model data konseptual dan tautan dokumen skema XML/UML pada elemen applicationSchemaInfo.',
    },
    {
      elementId: 'E31',
      name: 'Kepatuhan KUGI',
      category: 'CAT_DESCRIPTION',
      categoryName: '3. Deskripsi & Abstrak',
      mdbPath: 'mdb:contentInfo/mrc:MD_FeatureCatalogueDescription',
      description: 'Menilai apakah data sudah sesuai dengan Katalog Unsur Geografi Indonesia (KUGI).',
      scoreValue: e31Score,
      maxScore: 1,
      status: e31Status,
      isApplicable: true,
      ruleConditionSummary: '1.0: complianceCode true + sitasi KUGI | 0.5: sitasi KUGI tanpa complianceCode | 0: tidak ada',
      valueFoundText: e31ValText,
      findingMessage: e31Score === 1 ? undefined : e31Score === 0.5 ? 'Terdapat referensi KUGI tetapi complianceCode belum bernilai true.' : 'Tidak ada pernyataan kepatuhan terhadap Katalog Unsur Geografi Indonesia (KUGI).',
      recommendation: 'Tambahkan kepatuhan KUGI dengan elemen complianceCode bernilai true dan sitasi resmi Katalog Unsur Geografi Indonesia.',
    },
    {
      elementId: 'E32',
      name: 'Metadata Layanan (distributionInfo)',
      category: 'CAT_PROCESSING',
      categoryName: '8. Informasi Pengolahan & Distribusi',
      mdbPath: 'mdb:distributionInfo',
      description: 'Menilai apakah metadata mencantumkan tautan layanan (Service) seperti WMS, WFS, atau CSW beserta deskripsinya.',
      scoreValue: e32Score,
      maxScore: 1,
      status: e32Status,
      isApplicable: true,
      ruleConditionSummary: '1.0: tautan layanan (WMS/WFS/CSW) + deskripsi operasi | 0.5: tautan tanpa deskripsi | 0: kosong',
      valueFoundText: e32ValText,
      findingMessage: e32Score === 1 ? undefined : e32Score === 0.5 ? 'Tautan layanan ditemukan namun belum disertai uraian operasi layanan.' : 'Tautan layanan Web Service (WMS/WFS/CSW) belum tercantum dalam distributionInfo.',
      recommendation: 'Cantumkan URL layanan geospatial web service (WMS/WFS) beserta deskripsi operasinya pada mdb:distributionInfo.',
    },
  ];

  const totalPointsEarned = elements.reduce((acc, el) => acc + el.scoreValue, 0);
  const scorePercentage = Math.round((totalPointsEarned / 6) * 1000) / 10;

  const statusLabel =
    scorePercentage >= 85
      ? 'Sangat Siap (Fully Compliant)'
      : scorePercentage >= 50
      ? 'Sebagian Siap (Partially Compliant)'
      : 'Perlu Pemenuhan (Needs Enhancement)';

  return {
    isApplicable: true,
    rootElementDetected: 'mdb:MD_Metadata',
    scorePercentage,
    totalPointsEarned,
    maxPoints: 6,
    statusLabel,
    elements,
  };
}

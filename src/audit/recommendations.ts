/**
 * KOMPAS - Actionable Recommendations Engine
 * Menghasilkan rencana perbaikan mutu terstruktur, template snippet XML/JSON siap salin,
 * simulasi proyeksi kenaikan skor MQI, dan panduan mitigasi anomali/quality flags.
 */

import { AuditReport, ParameterAuditResult } from '../types/audit';
import { ElementConfigItem } from './configLoader';
import { QualityFlagResult } from './flags';
import { V7ScoreResult } from './v7Scoring';

export interface ActionableRecommendation {
  id: string;
  elementId?: string;
  title: string;
  category: string;
  priority: 'kritis' | 'tinggi' | 'sedang' | 'ekstensi' | 'flag';
  currentScore: number;
  maxScore: number;
  weight: number;
  scorePotentialPoints: number; // Kenaikan poin langsung pada Skor A
  issueDescription: string;
  actionGuide: string;
  isoStandardRef: string;
  xmlSnippet: string;
  jsonSnippet?: string;
  impactExplanation: string;
}

export interface ScoreProjection {
  currentSkorA: number;
  currentMqiBiner: number;
  currentMqiDiperluas: number;
  currentTier: string;

  // Proyeksi jika hanya prioritas kritis (bobot 3) dipenuhi
  projectedCriticalSkorA: number;
  projectedCriticalTier: string;

  // Proyeksi jika semua rekomendasi kosong dipenuhi (100%)
  projectedFullSkorA: number;
  projectedFullTier: string;

  totalEmptyElementsCount: number;
  criticalEmptyCount: number;
  importantEmptyCount: number;
}

const ELEMENT_ACTION_TEMPLATES: Record<string, {
  guide: string;
  xml: string;
  json?: string;
  ref: string;
}> = {
  E01: {
    guide: 'Cantumkan kode bahasa resmi sesuai ISO 639-2 (misal: "ind" untuk Bahasa Indonesia atau "eng" untuk Bahasa Inggris).',
    xml: `<gmd:language>\n  <gco:CharacterString>ind</gco:CharacterString>\n</gmd:language>`,
    json: `"language": "ind"`,
    ref: 'ISO 19115:2003 MD_DataIdentification.language',
  },
  E02: {
    guide: 'Deklarasikan nama standar metadata yang diacu secara jujur tanpa rekaan nilai (misal: "ISO 19115:2003/19139" atau "SNI ISO 19115:2012").',
    xml: `<gmd:metadataStandardName>\n  <gco:CharacterString>ISO 19115:2003/19139</gco:CharacterString>\n</gmd:metadataStandardName>`,
    json: `"metadata_standard_name": "ISO 19115:2003/19139"`,
    ref: 'ISO 19115:2003 MD_Metadata.metadataStandardName',
  },
  E03: {
    guide: 'Sertakan URL unduhan langsung atau endpoint layanan geospasial (WFS/WMS/FeatureServer) pada transferOptions.',
    xml: `<gmd:onLine>\n  <gmd:CI_OnlineResource>\n    <gmd:linkage>\n      <gmd:URL>https://geoportal.instansi.go.id/download/dataset_maritim.zip</gmd:URL>\n    </gmd:linkage>\n    <gmd:protocol>\n      <gco:CharacterString>WWW:DOWNLOAD-1.0-http--download</gco:CharacterString>\n    </gmd:protocol>\n    <gmd:name>\n      <gco:CharacterString>Unduh Arsip Shapefile</gco:CharacterString>\n    </gmd:name>\n  </gmd:CI_OnlineResource>\n</gmd:onLine>`,
    json: `"resources": [\n  {\n    "name": "Unduh Data",\n    "format": "ZIP",\n    "url": "https://geoportal.instansi.go.id/download/dataset_maritim.zip"\n  }\n]`,
    ref: 'ISO 19115:2003 MD_DigitalTransferOptions.onLine',
  },
  E04: {
    guide: 'Berikan judul resmi data spasial yang representatif dan memuat lokasi serta parameter kelautan.',
    xml: `<gmd:citation>\n  <gmd:CI_Citation>\n    <gmd:title>\n      <gco:CharacterString>Peta Batimetri dan Kontur Kedalaman Perairan [Nama Wilayah]</gco:CharacterString>\n    </gmd:title>\n  </gmd:CI_Citation>\n</gmd:citation>`,
    json: `"title": "Peta Batimetri dan Kontur Kedalaman Perairan [Nama Wilayah]"`,
    ref: 'ISO 19115:2003 CI_Citation.title (Inti Wajib)',
  },
  E05: {
    guide: 'Catat tanggal publikasi, pembuatan, atau revisi resmi dataset pada simpul CI_Date (terpisah dari dateStamp metadata).',
    xml: `<gmd:date>\n  <gmd:CI_Date>\n    <gmd:date>\n      <gco:Date>2024-06-15</gco:Date>\n    </gmd:date>\n    <gmd:dateType>\n      <gmd:CI_DateTypeCode codeListValue="publication"/>\n    </gmd:dateType>\n  </gmd:CI_Date>\n</gmd:date>`,
    json: `"metadata_created": "2024-06-15T00:00:00Z"`,
    ref: 'ISO 19115:2003 CI_Citation.date (Inti Wajib)',
  },
  E06: {
    guide: 'Sertakan identifier unik permanen (UUID, DOI, atau URN resmi instansi) untuk mencegah kerancuan katalog.',
    xml: `<gmd:fileIdentifier>\n  <gco:CharacterString>urn:marine:id:pushidrosal:bathy:2024:001</gco:CharacterString>\n</gmd:fileIdentifier>`,
    json: `"id": "urn:marine:id:pushidrosal:bathy:2024:001"`,
    ref: 'ISO 19115:2003 MD_Metadata.fileIdentifier',
  },
  E07: {
    guide: 'Tuliskan abstrak deskriptif lengkap yang merangkum metodologi akuisisi, cakupan wilayah, dan tujuan pemanfaatan data.',
    xml: `<gmd:abstract>\n  <gco:CharacterString>Data batimetri perairan hasil survei multibeam echosounder resolusi tinggi dengan koreksi pasang surut riil dan SVP untuk keselamatan navigasi pelayaran.</gco:CharacterString>\n</gmd:abstract>`,
    json: `"notes": "Data batimetri perairan hasil survei multibeam echosounder resolusi tinggi dengan koreksi pasang surut riil dan SVP..."`,
    ref: 'ISO 19115:2003 MD_DataIdentification.abstract (Inti Wajib)',
  },
  E08: {
    guide: 'Dokumentasikan maksud dan tujuan penyusunan dataset geospasial kelautan ini.',
    xml: `<gmd:purpose>\n  <gco:CharacterString>Mendukung pemutakhiran peta laut navigasi elektronik (ENC) dan penataan ruang laut nasional.</gco:CharacterString>\n</gmd:purpose>`,
    ref: 'ISO 19115:2003 MD_DataIdentification.purpose',
  },
  E09: {
    guide: 'Tambahkan kata kunci tematik yang mempermudah temu kembali dataset di geoportal kelautan.',
    xml: `<gmd:descriptiveKeywords>\n  <gmd:MD_Keywords>\n    <gmd:keyword><gco:CharacterString>batimetri</gco:CharacterString></gmd:keyword>\n    <gmd:keyword><gco:CharacterString>kedalaman laut</gco:CharacterString></gmd:keyword>\n    <gmd:keyword><gco:CharacterString>hidrografi</gco:CharacterString></gmd:keyword>\n  </gmd:MD_Keywords>\n</gmd:descriptiveKeywords>`,
    ref: 'ISO 19115:2003 MD_Keywords.keyword',
  },
  E10: {
    guide: 'Pilih kategori topik ISO 19115 yang sesuai (misal: "oceans", "elevation", "biota", atau "environment").',
    xml: `<gmd:topicCategory>\n  <gmd:MD_TopicCategoryCode>oceans</gmd:MD_TopicCategoryCode>\n</gmd:topicCategory>`,
    ref: 'ISO 19115:2003 MD_TopicCategoryCode (Inti Wajib)',
  },
  E11: {
    guide: 'Cantumkan klausul batasan akses, lisensi keterbukaan data, atau hak cipta secara jelas.',
    xml: `<gmd:resourceConstraints>\n  <gmd:MD_LegalConstraints>\n    <gmd:useLimitation>\n      <gco:CharacterString>Lisensi Terbuka: Creative Commons Attribution 4.0 International (CC-BY 4.0)</gco:CharacterString>\n    </gmd:useLimitation>\n  </gmd:MD_LegalConstraints>\n</gmd:resourceConstraints>`,
    ref: 'ISO 19115:2003 MD_LegalConstraints.useLimitation',
  },
  E12: {
    guide: 'Dokumentasikan kamus atribut fitur data atau rujuk Katalog Unsur Geografi Indonesia (KUGI).',
    xml: `<gmd:contentInfo>\n  <gmd:MD_FeatureCatalogueDescription>\n    <gmd:complianceCode><gco:Boolean>true</gco:Boolean></gmd:complianceCode>\n    <gmd:featureCatalogueCitation>\n      <gmd:CI_Citation>\n        <gmd:title><gco:CharacterString>Katalog Unsur Geografi Indonesia (KUGI) BIG</gco:CharacterString></gmd:title>\n      </gmd:CI_Citation>\n    </gmd:featureCatalogueCitation>\n  </gmd:MD_FeatureCatalogueDescription>\n</gmd:contentInfo>`,
    ref: 'ISO 19115:2003 MD_FeatureCatalogueDescription',
  },
  E13: {
    guide: 'Lengkapi koordinat bounding box numerik (West, South, East, North) dalam derajat desimal tanpa nilai 0,0,0,0.',
    xml: `<gmd:geographicElement>\n  <gmd:EX_GeographicBoundingBox>\n    <gmd:westBoundLongitude><gco:Decimal>106.50</gco:Decimal></gmd:westBoundLongitude>\n    <gmd:eastBoundLongitude><gco:Decimal>107.25</gco:Decimal></gmd:eastBoundLongitude>\n    <gmd:southBoundLatitude><gco:Decimal>-6.20</gco:Decimal></gmd:southBoundLatitude>\n    <gmd:northBoundLatitude><gco:Decimal>-5.80</gco:Decimal></gmd:northBoundLatitude>\n  </gmd:EX_GeographicBoundingBox>\n</gmd:geographicElement>`,
    json: `"extras": [\n  {\n    "key": "spatial",\n    "value": "{\\"type\\":\\"Polygon\\",\\"coordinates\\":[[[106.5,-6.2],[107.25,-6.2],[107.25,-5.8],[106.5,-5.8],[106.5,-6.2]]]}"\n  }\n]`,
    ref: 'ISO 19115:2003 EX_GeographicBoundingBox (Inti Wajib)',
  },
  E14: {
    guide: 'Cantumkan rentang waktu pengumpulan data dengan beginPosition dan endPosition.',
    xml: `<gmd:temporalElement>\n  <gmd:EX_TemporalExtent>\n    <gmd:extent>\n      <gml:TimePeriod>\n        <gml:beginPosition>2023-05-01</gml:beginPosition>\n        <gml:endPosition>2023-05-28</gml:endPosition>\n      </gml:TimePeriod>\n    </gmd:extent>\n  </gmd:EX_TemporalExtent>\n</gmd:temporalElement>`,
    ref: 'ISO 19115:2003 EX_TemporalExtent',
  },
  E15: {
    guide: 'Deklarasikan kode sistem referensi koordinat standar EPSG (misal: EPSG:4326 atau EPSG:32748).',
    xml: `<gmd:referenceSystemInfo>\n  <gmd:MD_ReferenceSystem>\n    <gmd:referenceSystemIdentifier>\n      <gmd:RS_Identifier>\n        <gmd:code><gco:CharacterString>EPSG:4326</gco:CharacterString></gmd:code>\n      </gmd:RS_Identifier>\n    </gmd:referenceSystemIdentifier>\n  </gmd:MD_ReferenceSystem>\n</gmd:referenceSystemInfo>`,
    ref: 'ISO 19115:2003 MD_ReferenceSystem (Inti Wajib)',
  },
  E16: {
    guide: 'Dokumentasikan nilai ketelitian posisi absolut (horizontal dan vertikal) berdasarkan hasil uji kontrol kualitas.',
    xml: `<gmd:report>\n  <gmd:DQ_AbsoluteExternalPositionalAccuracy>\n    <gmd:result>\n      <gmd:DQ_QuantitativeResult>\n        <gmd:value><gco:Record>Ketelitian horizontal: &lt; 1.0 m (95% CI)</gco:Record></gmd:value>\n      </gmd:DQ_QuantitativeResult>\n    </gmd:result>\n  </gmd:DQ_AbsoluteExternalPositionalAccuracy>\n</gmd:report>`,
    ref: 'ISO 19115:2003 DQ_AbsoluteExternalPositionalAccuracy',
  },
  E17: {
    guide: 'Deklarasikan datum vertikal reduksi kedalaman laut (misal: LAT / Lowest Astronomical Tide atau MSL).',
    xml: `<gmd:referenceSystemInfo>\n  <gmd:MD_ReferenceSystem>\n    <gmd:referenceSystemIdentifier>\n      <gmd:RS_Identifier>\n        <gmd:code><gco:CharacterString>Lowest Astronomical Tide (LAT)</gco:CharacterString></gmd:code>\n      </gmd:RS_Identifier>\n    </gmd:referenceSystemIdentifier>\n  </gmd:MD_ReferenceSystem>\n</gmd:referenceSystemInfo>`,
    ref: 'ISO 19115:2003 Vertical Datum Information',
  },
  E18: {
    guide: 'Cantumkan spesifikasi instrumen survei akustik (tipe sonar, frekuensi, motion sensor, DGPS).',
    xml: `<gmd:lineage>\n  <gmd:LI_Lineage>\n    <gmd:statement>\n      <gco:CharacterString>Instrumen: Multibeam Echosounder Kongsberg EM 2040C, Motion Sensor POS MV, Valeport Sound Velocity Profiler.</gco:CharacterString>\n    </gmd:statement>\n  </gmd:LI_Lineage>\n</gmd:lineage>`,
    ref: 'HASARA & KARUNANAYAKA (2026) Parameter E18',
  },
  E19: {
    guide: 'Cantumkan nama organisasi atau instansi penanggung jawab secara lengkap dan resmi.',
    xml: `<gmd:pointOfContact>\n  <gmd:CI_ResponsibleParty>\n    <gmd:organisationName>\n      <gco:CharacterString>Pusat Hidro-Oseanografi TNI AL (Pushidrosal)</gco:CharacterString>\n    </gmd:organisationName>\n  </gmd:CI_ResponsibleParty>\n</gmd:pointOfContact>`,
    json: `"author": "Pusat Hidro-Oseanografi TNI AL (Pushidrosal)"`,
    ref: 'ISO 19115:2003 CI_ResponsibleParty.organisationName (Inti Wajib)',
  },
  E20: {
    guide: 'Gunakan alamat surel institusi resmi (.go.id, .ac.id, .mil.id, dll) dan hindari surel personal atau format URL.',
    xml: `<gmd:contactInfo>\n  <gmd:CI_Contact>\n    <gmd:address>\n      <gmd:CI_Address>\n        <gmd:electronicMailAddress>\n          <gco:CharacterString>info@pushidrosal.id</gco:CharacterString>\n        </gmd:electronicMailAddress>\n      </gmd:CI_Address>\n    </gmd:address>\n  </gmd:CI_Contact>\n</gmd:contactInfo>`,
    json: `"author_email": "info@pushidrosal.id"`,
    ref: 'ISO 19115:2003 CI_Address.electronicMailAddress (Inti Wajib)',
  },
  E21: {
    guide: 'Sertakan kode peran penanggung jawab CI_RoleCode yang sah (misal: "pointOfContact", "custodian", "originator").',
    xml: `<gmd:role>\n  <gmd:CI_RoleCode codeListValue="pointOfContact"/>\n</gmd:role>`,
    ref: 'ISO 19115:2003 CI_RoleCode (Inti Wajib)',
  },
  E22: {
    guide: 'Cantumkan edisi atau versi standar metadata yang digunakan (misal: "2003/Cor.1:2006").',
    xml: `<gmd:metadataStandardVersion>\n  <gco:CharacterString>2003/Cor.1:2006</gco:CharacterString>\n</gmd:metadataStandardVersion>`,
    ref: 'ISO 19115:2003 MD_Metadata.metadataStandardVersion',
  },
  E23: {
    guide: 'Cantumkan tanggal pencatatan lembar metadata ini pada elemen dateStamp.',
    xml: `<gmd:dateStamp>\n  <gco:Date>2024-10-31</gco:Date>\n</gmd:dateStamp>`,
    ref: 'ISO 19115:2003 MD_Metadata.dateStamp (Inti Wajib)',
  },
  E24: {
    guide: 'Cantumkan bahasa yang digunakan pada lembar metadata.',
    xml: `<gmd:language>\n  <gco:CharacterString>ind</gco:CharacterString>\n</gmd:language>`,
    ref: 'ISO 19115:2003 MD_Metadata.language',
  },
  E25: {
    guide: 'Cantumkan unit atau petugas yang memelihara lembar metadata ini pada MD_Metadata/contact.',
    xml: `<gmd:contact>\n  <gmd:CI_ResponsibleParty>\n    <gmd:organisationName>\n      <gco:CharacterString>Unit Data Spasial Kelautan</gco:CharacterString>\n    </gmd:organisationName>\n    <gmd:role>\n      <gmd:CI_RoleCode codeListValue="pointOfContact"/>\n    </gmd:role>\n  </gmd:CI_ResponsibleParty>\n</gmd:contact>`,
    ref: 'ISO 19115:2003 MD_Metadata.contact (Inti Wajib)',
  },
  E26: {
    guide: 'Tuliskan riwayat pemrosesan data (tahapan reduksi pasut, kalibrasi SVP, kontrol kualitas) pada lineage.',
    xml: `<gmd:lineage>\n  <gmd:LI_Lineage>\n    <gmd:statement>\n      <gco:CharacterString>Data kedalaman sounding direduksi terhadap muka surutan pasut stasiun pengamat, dikoreksi profil kecepatan suara air laut, dan difilter dari spike akustik.</gco:CharacterString>\n    </gmd:statement>\n  </gmd:LI_Lineage>\n</gmd:lineage>`,
    ref: 'ISO 19115:2003 LI_Lineage.statement (Inti Wajib)',
  },
  E27: {
    guide: 'Dokumentasikan jumlah objek geometris atau resolusi spasial pada spatialRepresentationInfo ISO 19115-3.',
    xml: `<mdb:spatialRepresentationInfo>\n  <msr:MD_VectorSpatialRepresentation>\n    <msr:geometricObjects>\n      <msr:MD_GeometricObjects>\n        <msr:geometricObjectCount>\n          <gco:Integer>1250</gco:Integer>\n        </msr:geometricObjectCount>\n      </msr:MD_GeometricObjects>\n    </msr:geometricObjects>\n  </msr:MD_VectorSpatialRepresentation>\n</mdb:spatialRepresentationInfo>`,
    ref: 'ISO 19115-3:2016 spatialRepresentationInfo',
  },
  E28: {
    guide: 'Cantumkan lingkup sumber daya (resourceScope) pada metadataScope ISO 19115-3.',
    xml: `<mdb:metadataScope>\n  <mdb:MD_MetadataScope>\n    <mdb:resourceScope>\n      <mcc:MD_ScopeCode codeListValue="dataset"/>\n    </mdb:resourceScope>\n  </mdb:MD_MetadataScope>\n</mdb:metadataScope>`,
    ref: 'ISO 19115-3:2016 metadataScope',
  },
  E29: {
    guide: 'Sertakan spesifikasi format distribusi data pada distributionInfo ISO 19115-3.',
    xml: `<mrd:distributionFormat>\n  <mrd:MD_Format>\n    <mrd:formatSpecificationCitation>\n      <cit:CI_Citation>\n        <cit:title><gco:CharacterString>GeoTIFF / GeoJSON</gco:CharacterString></cit:title>\n      </cit:CI_Citation>\n    </mrd:formatSpecificationCitation>\n  </mrd:MD_Format>\n</mrd:distributionFormat>`,
    ref: 'ISO 19115-3:2016 distributionFormat',
  },
  E30: {
    guide: 'Sertakan dokumentasi skema aplikasi spasial pada applicationSchemaInfo ISO 19115-3.',
    xml: `<mdb:applicationSchemaInfo>\n  <mas:MD_ApplicationSchemaInformation>\n    <mas:name>\n      <cit:CI_Citation>\n        <cit:title><gco:CharacterString>Skema Data Kelautan Nasional v2</gco:CharacterString></cit:title>\n      </cit:CI_Citation>\n    </mas:name>\n  </mas:MD_ApplicationSchemaInformation>\n</mdb:applicationSchemaInfo>`,
    ref: 'ISO 19115-3:2016 applicationSchemaInfo',
  },
  E31: {
    guide: 'Cantumkan kepatuhan terhadap Katalog Unsur Geografi Indonesia (KUGI) pada featureCatalogueCitation.',
    xml: `<mri:defaultLocale>\n  <cit:CI_Citation>\n    <cit:title><gco:CharacterString>Katalog Unsur Geografi Indonesia (KUGI)</gco:CharacterString></cit:title>\n  </cit:CI_Citation>\n</mri:defaultLocale>`,
    ref: 'SNI ISO 19115:2012 / KUGI BIG',
  },
  E32: {
    guide: 'Dokumentasikan endpoint layanan web geospasial OGC (WFS / WMS) pada onlineResource.',
    xml: `<mrd:onLine>\n  <cit:CI_OnlineResource>\n    <cit:linkage><gco:CharacterString>https://geoportal.instansi.go.id/geoserver/wfs</gco:CharacterString></cit:linkage>\n    <cit:protocol><gco:CharacterString>OGC:WFS</gco:CharacterString></cit:protocol>\n  </cit:CI_OnlineResource>\n</mrd:onLine>`,
    ref: 'ISO 19115-3:2016 Online Geospatial Service',
  },
};

export function generateActionableRecommendations(
  report: AuditReport,
  elements: ElementConfigItem[],
  elementScores: Record<string, number>,
  qualityFlags: QualityFlagResult[]
): ActionableRecommendation[] {
  const recommendations: ActionableRecommendation[] = [];

  // 1. Elemen Kosong (Nilai 0) atau Nilai Parsial (0.5)
  for (const el of elements) {
    const currentScore = elementScores[el.id] ?? 0;
    if (currentScore < 1) {
      const isCritical = el.bobot === 3;
      const isImportant = el.bobot === 2;
      const isExtension = ['E27', 'E28', 'E29', 'E30', 'E31', 'E32'].includes(el.id);

      const priority: ActionableRecommendation['priority'] = isCritical
        ? 'kritis'
        : isImportant
        ? 'tinggi'
        : isExtension
        ? 'ekstensi'
        : 'sedang';

      const template = ELEMENT_ACTION_TEMPLATES[el.id] || {
        guide: `Lengkapi elemen ${el.nama} sesuai spesifikasi standar ISO 19115.`,
        xml: `<!-- Tambahkan elemen ${el.nama} (${el.id}) -->`,
        ref: 'ISO 19115 / SNI ISO 19115',
      };

      const pointsGain = (1 - currentScore) * el.bobot;

      recommendations.push({
        id: `REC-${el.id}`,
        elementId: el.id,
        title: `${el.id}: ${el.nama}`,
        category: el.kategori,
        priority,
        currentScore,
        maxScore: 1,
        weight: el.bobot,
        scorePotentialPoints: Math.round(pointsGain * 10) / 10,
        issueDescription: currentScore === 0
          ? `Elemen tidak ditemukan atau bernilai kosong (Skor 0).`
          : `Elemen terisi sebagian namun belum memenuhi standar penuh (Skor 0.5).`,
        actionGuide: template.guide,
        isoStandardRef: template.ref,
        xmlSnippet: template.xml,
        jsonSnippet: template.json,
        impactExplanation: `Memberikan tambahan +${pointsGain} poin langsung pada Skor A Utama.`,
      });
    }
  }

  // Urutkan rekomendasi: Prioritas kritis lebih dulu, lalu bobot tertinggi
  recommendations.sort((a, b) => {
    const pWeight = { kritis: 4, tinggi: 3, sedang: 2, ekstensi: 1, flag: 0 };
    if (pWeight[b.priority] !== pWeight[a.priority]) {
      return pWeight[b.priority] - pWeight[a.priority];
    }
    return b.weight - a.weight;
  });

  return recommendations;
}

export function calculateScoreProjection(
  activeV7: V7ScoreResult,
  elements: ElementConfigItem[],
  elementScores: Record<string, number>
): ScoreProjection {
  let criticalPointsGain = 0;
  let fullPointsGain = 0;
  let criticalCount = 0;
  let importantCount = 0;

  for (const el of elements) {
    const cur = elementScores[el.id] ?? 0;
    if (cur < 1) {
      const gain = (1 - cur) * el.bobot;
      fullPointsGain += gain;
      if (el.bobot === 3) {
        criticalPointsGain += gain;
        criticalCount++;
      } else if (el.bobot === 2) {
        importantCount++;
      }
    }
  }

  const projectedCriticalSkorA = Math.min(100, activeV7.skorA + criticalPointsGain);
  const projectedFullSkorA = Math.min(100, activeV7.skorA + fullPointsGain);

  const getTier = (s: number) => {
    if (s >= 80) return 'Excellent (Sangat Baik)';
    if (s >= 60) return 'Good (Baik)';
    if (s >= 40) return 'Fair (Cukup)';
    if (s >= 20) return 'Poor (Kurang)';
    return 'Very Poor (Sangat Kurang)';
  };

  return {
    currentSkorA: Number(activeV7.skorA.toFixed(1)),
    currentMqiBiner: Number(activeV7.mqiBiner.toFixed(1)),
    currentMqiDiperluas: Number(activeV7.mqiDiperluas.toFixed(1)),
    currentTier: activeV7.kategoriDiperluas || getTier(activeV7.skorA),
    projectedCriticalSkorA: Number(projectedCriticalSkorA.toFixed(1)),
    projectedCriticalTier: getTier(projectedCriticalSkorA),
    projectedFullSkorA: Number(projectedFullSkorA.toFixed(1)),
    projectedFullTier: getTier(projectedFullSkorA),
    totalEmptyElementsCount: activeV7.emptyElements.length,
    criticalEmptyCount: criticalCount,
    importantEmptyCount: importantCount,
  };
}

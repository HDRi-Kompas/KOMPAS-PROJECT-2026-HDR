/**
 * KOMPAS - Format Detector & Metadata Specification Engine
 * Mendeteksi secara instan format berkas saat pertama kali diunggah:
 * - XML MDB (ISO 19115-3:2021 / mdb:MD_Metadata)
 * - XML GMD (ISO 19139:2007 / gmd:MD_Metadata)
 * - XML Esri / ArcGIS Metadata
 * - GeoJSON Spasial (IETF RFC 7946)
 * - JSON Katalog Metadata (CKAN / DCAT)
 * - Shapefile ZIP Data Spasial (.zip)
 */

export type MetadataFormatCategory =
  | 'xml_mdb'
  | 'xml_gmd'
  | 'xml_esri'
  | 'geojson'
  | 'json_catalog'
  | 'shapefile_zip'
  | 'unknown';

export interface MetadataFormatInfo {
  category: MetadataFormatCategory;
  label: string;
  badgeText: string;
  standard: string;
  rootElement: string;
  namespaceUri?: string;
  description: string;
  engineSupport: string;
  colorTheme: 'purple' | 'cyan' | 'emerald' | 'amber' | 'slate';
  isIsoMdb: boolean;
  isIsoGmd: boolean;
  isGeoJson: boolean;
  isJsonCatalog: boolean;
}

export function detectDetailedFormat(fileName: string, content?: string): MetadataFormatInfo {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  // 1. Berkas Arsip Shapefile ZIP
  if (ext === 'zip') {
    return {
      category: 'shapefile_zip',
      label: 'Shapefile ZIP Data Spasial',
      badgeText: 'Shapefile · ESRI ZIP',
      standard: 'ESRI Shapefile Technical Description (.shp, .shx, .dbf, .prj)',
      rootElement: 'ZIP Archive',
      description: 'Arsip biner data vektor spasial kelautan memuat geometri fitur, tabel atribut dBASE (.dbf), dan sistem proyeksi (.prj).',
      engineSupport: 'Validasi integritas spasial, sistem referensi koordinat (CRS), hitungan fitur, dan verifikasi konsistensi pasangan metadata.',
      colorTheme: 'slate',
      isIsoMdb: false,
      isIsoGmd: false,
      isGeoJson: false,
      isJsonCatalog: false,
    };
  }

  // 2. Berkas GeoJSON (Ekstensi eksplisit .geojson)
  if (ext === 'geojson') {
    let rootElem = 'FeatureCollection';
    if (content) {
      try {
        const parsed = JSON.parse(content);
        if (parsed.type) rootElem = parsed.type;
      } catch {
        // ignore parse error here
      }
    }
    return {
      category: 'geojson',
      label: 'GeoJSON Spasial (RFC 7946)',
      badgeText: 'GeoJSON · RFC 7946',
      standard: 'IETF RFC 7946 (The GeoJSON Format Specification)',
      rootElement: rootElem,
      namespaceUri: 'urn:ogc:def:crs:OGC:1.3:CRS84 (WGS 84)',
      description: 'Format data spasial vektor terbuka berbasis JSON yang memuat geometri koordinat geografis (Point, LineString, Polygon) beserta atribut kelautan.',
      engineSupport: 'Audit koordinat Bounding Box, validasi penutupan cincin poligon, kalkulasi batas spasial riil, dan konsistensi metadata.',
      colorTheme: 'emerald',
      isIsoMdb: false,
      isIsoGmd: false,
      isGeoJson: true,
      isJsonCatalog: false,
    };
  }

  // 3. Berkas JSON (.json) -> Periksa apakah GeoJSON atau JSON Katalog (CKAN/DCAT)
  if (ext === 'json') {
    let isGeo = false;
    let rootElem = 'JSON Object';
    if (content) {
      try {
        const parsed = JSON.parse(content);
        if (parsed && typeof parsed === 'object') {
          if (parsed.type === 'FeatureCollection' || parsed.type === 'Feature' || Array.isArray(parsed.features)) {
            isGeo = true;
            rootElem = parsed.type || 'FeatureCollection';
          } else if (parsed.result && typeof parsed.result === 'object') {
            rootElem = 'CKAN package_show (result wrapper)';
          } else if (Array.isArray(parsed)) {
            rootElem = `JSON Array (${parsed.length} item)`;
          } else {
            rootElem = 'JSON Catalog Document';
          }
        }
      } catch {
        // if parse fails, check raw text heuristically
        if (content.includes('"FeatureCollection"') || content.includes('"features"')) {
          isGeo = true;
          rootElem = 'FeatureCollection';
        }
      }
    }

    if (isGeo) {
      return {
        category: 'geojson',
        label: 'GeoJSON Spasial (RFC 7946)',
        badgeText: 'GeoJSON · RFC 7946',
        standard: 'IETF RFC 7946 (The GeoJSON Format Specification)',
        rootElement: rootElem,
        namespaceUri: 'urn:ogc:def:crs:OGC:1.3:CRS84 (WGS 84)',
        description: 'Berkas data spasial vektor berbasis JSON yang memuat fitur koordinat geografis dan tabel atribut spasial.',
        engineSupport: 'Validasi koordinat Bounding Box, hitungan fitur, integritas topologi, dan pencocokan silang spasial.',
        colorTheme: 'emerald',
        isIsoMdb: false,
        isIsoGmd: false,
        isGeoJson: true,
        isJsonCatalog: false,
      };
    }

    return {
      category: 'json_catalog',
      label: 'JSON Katalog Metadata (CKAN / DCAT)',
      badgeText: 'JSON · CKAN / DCAT',
      standard: 'CKAN Data Package API (package_show) / W3C DCAT-AP',
      rootElement: rootElem,
      namespaceUri: 'https://ckan.org / https://www.w3.org/TR/vocab-dcat/',
      description: 'Format katalog portal satu data terbuka (Open Data) dengan pemetaan atribut metadata dataset, organisasi, lisensi, dan sumber daya unduhan.',
      engineSupport: '26 Elemen Inti MQI diekstrak dari kamus atribut katalog (extras, tags, resources).',
      colorTheme: 'amber',
      isIsoMdb: false,
      isIsoGmd: false,
      isGeoJson: false,
      isJsonCatalog: true,
    };
  }

  // 4. Berkas XML (.xml) -> Pembedaan Ketat antara MDB, GMD, dan Esri
  if (ext === 'xml') {
    const raw = content || '';
    const hasMdbUri =
      /xmlns(?::\w+)?=["']http:\/\/standards\.iso\.org\/iso\/19115\/-3\/mdb\/(?:1\.0|2\.0)["']/i.test(raw) ||
      /xmlns(?::\w+)?=["']http:\/\/standards\.iso\.org\/iso\/19115\/-3\//i.test(raw) ||
      /<(\w+:)?MD_Metadata\b[^>]*xmlns:\w+=["']http:\/\/standards\.iso\.org\/iso\/19115\/-3/i.test(raw) ||
      /<mdb:MD_Metadata\b/i.test(raw) ||
      /xmlns:mdb=["']/i.test(raw);

    const hasGmdUri =
      /xmlns(?::\w+)?=["']http:\/\/www\.isotc211\.org\/2005\/gmd["']/i.test(raw) ||
      /<gmd:MD_Metadata\b/i.test(raw) ||
      /xmlns:gmd=["']/i.test(raw);

    const hasEsriStructure =
      /<idinfo\b/i.test(raw) ||
      /<Esri\b/i.test(raw) ||
      /<dataIdInfo\b/i.test(raw);

    if (hasMdbUri) {
      return {
        category: 'xml_mdb',
        label: 'XML Metadata ISO 19115-3:2021 (mdb)',
        badgeText: 'XML MDB · ISO 19115-3:2021',
        standard: 'ISO 19115-3:2021 (Geographic Information - Metadata XML Implementation)',
        rootElement: '<mdb:MD_Metadata>',
        namespaceUri: 'http://standards.iso.org/iso/19115/-3/mdb/2.0',
        description: 'Standar internasional generasi terbaru untuk skema XML metadata geospasial menggunakan modul mdb, mri, cit, gex, dan lan.',
        engineSupport: 'Mendukung penuh 26 Elemen Inti MQI (E01–E26) DAN 6 Elemen Ekstensi ISO 19115-3 (E27–E32 aktif dihitung).',
        colorTheme: 'purple',
        isIsoMdb: true,
        isIsoGmd: false,
        isGeoJson: false,
        isJsonCatalog: false,
      };
    }

    if (hasGmdUri || (/<(\w+:)?MD_Metadata\b/i.test(raw) && !hasEsriStructure)) {
      return {
        category: 'xml_gmd',
        label: 'XML Metadata ISO 19139:2007 (gmd)',
        badgeText: 'XML GMD · ISO 19139:2007',
        standard: 'ISO/TS 19139:2007 & SNI 19-19115:2002 / Peraturan BIG No. 3 Tahun 2023',
        rootElement: '<gmd:MD_Metadata>',
        namespaceUri: 'http://www.isotc211.org/2005/gmd',
        description: 'Standar nasional/internasional klasik metadata geospasial berbasis skema gmd, gco, gml yang banyak diterapkan di Ina-Geoportal dan simpul JIGN.',
        engineSupport: 'Evaluasi lengkap 26 Elemen Inti MQI (E01–E26). 6 Elemen Ekstensi ISO 19115-3 (E27–E32) diberi status N/A sesuai metodologi v7.',
        colorTheme: 'cyan',
        isIsoMdb: false,
        isIsoGmd: true,
        isGeoJson: false,
        isJsonCatalog: false,
      };
    }

    if (hasEsriStructure) {
      return {
        category: 'xml_esri',
        label: 'XML Esri / ArcGIS Metadata',
        badgeText: 'XML Esri · ArcGIS',
        standard: 'Esri ArcGIS Metadata Standard Format',
        rootElement: '<metadata> (<idinfo> / <Esri>)',
        namespaceUri: 'http://www.esri.com/metadata/',
        description: 'Format metadata proprietari ArcGIS Desktop/Pro yang diekspor untuk katalog spasial.',
        engineSupport: 'Diurai secara otomatis ke dalam skema normalisasi KOMPAS 26 Elemen Inti MQI.',
        colorTheme: 'slate',
        isIsoMdb: false,
        isIsoGmd: false,
        isGeoJson: false,
        isJsonCatalog: false,
      };
    }

    return {
      category: 'xml_gmd',
      label: 'XML Metadata (Skema Terkait ISO/SNI)',
      badgeText: 'XML · Geospasial',
      standard: 'Standar XML Geospasial',
      rootElement: '<MD_Metadata> / <metadata>',
      description: 'Dokumen XML metadata geospasial dievaluasi sesuai hierarki elemen standar SNI ISO 19115.',
      engineSupport: '26 Elemen Inti MQI (E01–E26).',
      colorTheme: 'cyan',
      isIsoMdb: false,
      isIsoGmd: true,
      isGeoJson: false,
      isJsonCatalog: false,
    };
  }

  // 5. Berkas Tidak Dikenali
  return {
    category: 'unknown',
    label: `Berkas Tidak Dikenali (.${ext || 'tanpa ekstensi'})`,
    badgeText: 'Format Tidak Dikenal',
    standard: 'Format Tidak Terdefinisi',
    rootElement: 'Unknown',
    description: 'Format berkas tidak sesuai spesifikasi XML metadata (ISO 19115-3 mdb, ISO 19139 gmd), JSON Katalog, maupun GeoJSON spasial.',
    engineSupport: 'Tidak dapat diproses oleh mesin audit.',
    colorTheme: 'slate',
    isIsoMdb: false,
    isIsoGmd: false,
    isGeoJson: false,
    isJsonCatalog: false,
  };
}

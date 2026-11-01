/**
 * KOMPAS - Benchmark & Test Datasets
 * Real sample files covering all scenarios mentioned in the specification.
 */

import JSZip from 'jszip';

// 1. ISO 19139 XML: Bathymetric Survey MultiBeam Selat Malaka (Compliant)
export const SAMPLE_XML_BATIMETRI_ISO19139 = `<?xml version="1.0" encoding="UTF-8"?>
<gmd:MD_Metadata xmlns:gmd="http://www.isotc211.org/2005/gmd" xmlns:gco="http://www.isotc211.org/2005/gco" xmlns:gml="http://www.opengis.net/gml">
  <gmd:fileIdentifier>
    <gco:CharacterString>urn:uuid:8b9a1c24-5d2f-4a3e-b812-7f91c98a31e4</gco:CharacterString>
  </gmd:fileIdentifier>
  <gmd:language>
    <gmd:LanguageCode codeList="http://www.loc.gov/standards/iso639-2/">ind</gmd:LanguageCode>
  </gmd:language>
  <gmd:hierarchyLevel>
    <gmd:MD_ScopeCode codeList="http://standards.iso.org/iso/19139/resources/gmxCodelists.xml#MD_ScopeCode" codeListValue="dataset">dataset</gmd:MD_ScopeCode>
  </gmd:hierarchyLevel>
  <gmd:contact>
    <gmd:CI_ResponsibleParty>
      <gmd:organisationName>
        <gco:CharacterString>Pusat Hidro-Oseanografi TNI AL (Pushidrosal)</gco:CharacterString>
      </gmd:organisationName>
      <gmd:individualName>
        <gco:CharacterString>Tim Survei Hidrografi Selat Malaka</gco:CharacterString>
      </gmd:individualName>
      <gmd:contactInfo>
        <gmd:CI_Contact>
          <gmd:address>
            <gmd:CI_Address>
              <gmd:electronicMailAddress>
                <gco:CharacterString>survei.hidro@pushidrosal.id</gco:CharacterString>
              </gmd:electronicMailAddress>
            </gmd:CI_Address>
          </gmd:address>
        </gmd:CI_Contact>
      </gmd:contactInfo>
      <gmd:role>
        <gmd:CI_RoleCode codeList="http://standards.iso.org/iso/19139/resources/gmxCodelists.xml#CI_RoleCode" codeListValue="custodian">custodian</gmd:CI_RoleCode>
      </gmd:role>
    </gmd:CI_ResponsibleParty>
  </gmd:contact>
  <gmd:dateStamp>
    <gco:Date>2024-06-15</gco:Date>
  </gmd:dateStamp>
  <gmd:metadataStandardName>
    <gco:CharacterString>ISO 19115/19139 Geographic Information - Metadata</gco:CharacterString>
  </gmd:metadataStandardName>
  <gmd:metadataStandardVersion>
    <gco:CharacterString>2003/Cor.1:2006</gco:CharacterString>
  </gmd:metadataStandardVersion>
  <gmd:identificationInfo>
    <gmd:MD_DataIdentification>
      <gmd:citation>
        <gmd:CI_Citation>
          <gmd:title>
            <gco:CharacterString>Survei Batimetri Multibeam Alur Pelayaran TSS Selat Malaka</gco:CharacterString>
          </gmd:title>
          <gmd:date>
            <gmd:CI_Date>
              <gmd:date>
                <gco:Date>2024-05-20</gco:Date>
              </gmd:date>
              <gmd:dateType>
                <gmd:CI_DateTypeCode codeList="http://standards.iso.org/iso/19139/resources/gmxCodelists.xml#CI_DateTypeCode" codeListValue="publication">publication</gmd:CI_DateTypeCode>
              </gmd:dateType>
            </gmd:CI_Date>
          </gmd:date>
        </gmd:CI_Citation>
      </gmd:citation>
      <gmd:abstract>
        <gco:CharacterString>Dataset batimetri resolusi tinggi koridor Traffic Separation Scheme (TSS) Selat Malaka sektor Dumai-Rupat. Diakuisisi menggunakan multibeam echosounder Kongsberg EM2040 pada frekuensi 300 kHz dengan koreksi refraksi Sound Velocity Profiler (SVP) harian dan reduksi pasang surut berbasis stasiun pasut Dumai menuju Lowest Astronomical Tide (LAT).</gco:CharacterString>
      </gmd:abstract>
      <gmd:purpose>
        <gco:CharacterString>Pemutakhiran peta laut navigasi elektronik (ENC) dan keselamatan pelayaran internasional.</gco:CharacterString>
      </gmd:purpose>
      <gmd:descriptiveKeywords>
        <gmd:MD_Keywords>
          <gmd:keyword><gco:CharacterString>Batimetri</gco:CharacterString></gmd:keyword>
          <gmd:keyword><gco:CharacterString>Multibeam Echosounder</gco:CharacterString></gmd:keyword>
          <gmd:keyword><gco:CharacterString>Selat Malaka</gco:CharacterString></gmd:keyword>
          <gmd:keyword><gco:CharacterString>Kedalaman Laut</gco:CharacterString></gmd:keyword>
        </gmd:MD_Keywords>
      </gmd:descriptiveKeywords>
      <gmd:extent>
        <gmd:EX_Extent>
          <gmd:geographicElement>
            <gmd:EX_GeographicBoundingBox>
              <gmd:westBoundLongitude><gco:Decimal>101.4500</gco:Decimal></gmd:westBoundLongitude>
              <gmd:eastBoundLongitude><gco:Decimal>101.9500</gco:Decimal></gmd:eastBoundLongitude>
              <gmd:southBoundLatitude><gco:Decimal>1.5500</gco:Decimal></gmd:southBoundLatitude>
              <gmd:northBoundLatitude><gco:Decimal>2.1500</gco:Decimal></gmd:northBoundLatitude>
            </gmd:EX_GeographicBoundingBox>
          </gmd:geographicElement>
        </gmd:EX_Extent>
      </gmd:extent>
    </gmd:MD_DataIdentification>
  </gmd:identificationInfo>
  <gmd:referenceSystemInfo>
    <gmd:MD_ReferenceSystem>
      <gmd:referenceSystemIdentifier>
        <gmd:RS_Identifier>
          <gmd:code><gco:CharacterString>EPSG:4326 (WGS 84 Geographic)</gco:CharacterString></gmd:code>
        </gmd:RS_Identifier>
      </gmd:referenceSystemIdentifier>
    </gmd:MD_ReferenceSystem>
  </gmd:referenceSystemInfo>
  <gmd:dataQualityInfo>
    <gmd:DQ_DataQuality>
      <gmd:scope><gmd:DQ_Scope><gmd:level><gmd:MD_ScopeCode codeListValue="dataset">dataset</gmd:MD_ScopeCode></gmd:level></gmd:DQ_Scope></gmd:scope>
      <gmd:lineage>
        <gmd:LI_Lineage>
          <gmd:statement>
            <gco:CharacterString>Data mentah multibeam diekstraksi dan difiltrasi menggunakan CARIS HIPS and SIPS 11.4. Dilakukan koreksi attitude sensor (pitch, roll, heave), koreksi Sound Velocity Profile (SVP), serta reduksi pasang surut air laut ke datum LAT.</gco:CharacterString>
          </gmd:statement>
        </gmd:LI_Lineage>
      </gmd:lineage>
      <gmd:report>
        <gmd:DQ_QuantitativeAttributeAccuracy>
          <gmd:totalVerticalUncertainty>
            <gco:CharacterString>TVU S-44 Special Order (&lt; 0.25 m)</gco:CharacterString>
          </gmd:totalVerticalUncertainty>
          <gmd:totalHorizontalUncertainty>
            <gco:CharacterString>THU &lt; 1.5 m (DGPS Post-processed)</gco:CharacterString>
          </gmd:totalHorizontalUncertainty>
          <gmd:verticalDatum>
            <gco:CharacterString>Lowest Astronomical Tide (LAT)</gco:CharacterString>
          </gmd:verticalDatum>
          <gmd:sensor>
            <gco:CharacterString>Kongsberg EM2040 Dual Swath</gco:CharacterString>
          </gmd:sensor>
        </gmd:DQ_QuantitativeAttributeAccuracy>
      </gmd:report>
    </gmd:DQ_DataQuality>
  </gmd:dataQualityInfo>
</gmd:MD_Metadata>`;

// 2. Esri XML: Bathymetric Legacy SingleBeam Teluk Lampung (Legacy, Missing TVU/THU)
export const SAMPLE_XML_BATIMETRI_ESRI = `<?xml version="1.0" encoding="UTF-8"?>
<metadata xml:lang="id">
  <idinfo>
    <citation>
      <citeinfo>
        <title>Pemeruman Batimetri Single-Beam Teluk Lampung 1998</title>
        <pubdate>1998-11-10</pubdate>
        <origin>Dinas Navigasi Wilayah Lampung</origin>
      </citeinfo>
    </citation>
    <descript>
      <abstract>Peta kedalaman laut teluk lampung hasil pemeruman single beam echosounder analog jalur perum jarak 100 meter. Tidak dilengkapi catatan ketidakpastian vertikal modern.</abstract>
      <purpose>Studi pendahuluan dermaga perikanan.</purpose>
    </descript>
    <spdom>
      <bounding>
        <westbc>105.15</westbc>
        <eastbc>105.45</eastbc>
        <northbc>-5.45</northbc>
        <southbc>-5.85</southbc>
      </bounding>
    </spdom>
    <keywords>
      <theme>
        <keyword>Batimetri</keyword>
        <keyword>Teluk Lampung</keyword>
      </theme>
    </keywords>
    <ptcontac>
      <cntinfo>
        <cntorg>Dinas Perhubungan dan Navigasi</cntorg>
        <cntemail>navigasi.lampung@dephub.go.id</cntemail>
      </cntinfo>
    </ptcontac>
  </idinfo>
  <metainfo>
    <metd>1999-01-20</metd>
    <metstdn>FGDC Content Standard for Digital Geospatial Metadata</metstdn>
  </metainfo>
  <dataqual>
    <lineage>
      <procstep>
        <procdesc>Pengukuran kedalaman analog menggunakan kertas gulung echosounder Raytheon, digitasi manual meja digitizer.</procdesc>
      </procstep>
    </lineage>
  </dataqual>
</metadata>`;

// 3. ISO 19139 XML: Kawasan Konservasi Anambas
export const SAMPLE_XML_KONSERVASI_ISO = `<?xml version="1.0" encoding="UTF-8"?>
<gmd:MD_Metadata xmlns:gmd="http://www.isotc211.org/2005/gmd" xmlns:gco="http://www.isotc211.org/2005/gco">
  <gmd:fileIdentifier><gco:CharacterString>urn:kkp:kkp3k-anambas-2021-v2</gco:CharacterString></gmd:fileIdentifier>
  <gmd:language><gco:CharacterString>ind</gco:CharacterString></gmd:language>
  <gmd:contact>
    <gmd:CI_ResponsibleParty>
      <gmd:organisationName><gco:CharacterString>BKKPN Pekanbaru - Ditjen PRL KKP</gco:CharacterString></gmd:organisationName>
      <gmd:contactInfo><gmd:CI_Contact><gmd:address><gmd:CI_Address><gmd:electronicMailAddress><gco:CharacterString>bkkpn.pekanbaru@kkp.go.id</gco:CharacterString></gmd:electronicMailAddress></gmd:CI_Address></gmd:address></gmd:CI_Contact></gmd:contactInfo>
    </gmd:CI_ResponsibleParty>
  </gmd:contact>
  <gmd:dateStamp><gco:Date>2022-03-10</gco:Date></gmd:dateStamp>
  <gmd:metadataStandardName><gco:CharacterString>ISO 19115/19139</gco:CharacterString></gmd:metadataStandardName>
  <gmd:identificationInfo>
    <gmd:MD_DataIdentification>
      <gmd:citation>
        <gmd:CI_Citation>
          <gmd:title><gco:CharacterString>Batas Zonasi Kawasan Konservasi Pesisir dan Pulau-Pulau Kecil Kepulauan Anambas</gco:CharacterString></gmd:title>
          <gmd:date><gmd:CI_Date><gmd:date><gco:Date>2021-12-14</gco:Date></gmd:date></gmd:CI_Date></gmd:date>
        </gmd:CI_Citation>
      </gmd:citation>
      <gmd:abstract><gco:CharacterString>Peta penetapan zonasi Kawasan Konservasi Perairan Nasional Kepulauan Anambas berdasarkan Keputusan Menteri Kelautan dan Perikanan Republik Indonesia Nomor 53/KEPMEN-KP/2020. Mencakup Zona Inti, Zona Pemanfaatan Terbatas, dan Zona Rehabilitasi.</gco:CharacterString></gmd:abstract>
      <gmd:purpose><gco:CharacterString>Perlindungan habitat terumbu karang dan penyu hijau.</gco:CharacterString></gmd:purpose>
      <gmd:extent>
        <gmd:EX_Extent>
          <gmd:geographicElement>
            <gmd:EX_GeographicBoundingBox>
              <gmd:westBoundLongitude><gco:Decimal>105.50</gco:Decimal></gmd:westBoundLongitude>
              <gmd:eastBoundLongitude><gco:Decimal>106.60</gco:Decimal></gmd:eastBoundLongitude>
              <gmd:southBoundLatitude><gco:Decimal>2.50</gco:Decimal></gmd:southBoundLatitude>
              <gmd:northBoundLatitude><gco:Decimal>3.80</gco:Decimal></gmd:northBoundLatitude>
            </gmd:EX_GeographicBoundingBox>
          </gmd:geographicElement>
        </gmd:EX_Extent>
      </gmd:extent>
    </gmd:MD_DataIdentification>
  </gmd:identificationInfo>
  <gmd:referenceSystemInfo>
    <gmd:MD_ReferenceSystem><gmd:referenceSystemIdentifier><gmd:RS_Identifier><gmd:code><gco:CharacterString>EPSG:4326</gco:CharacterString></gmd:code></gmd:RS_Identifier></gmd:referenceSystemIdentifier></gmd:MD_ReferenceSystem>
  </gmd:referenceSystemInfo>
  <gmd:dataQualityInfo>
    <gmd:DQ_DataQuality>
      <gmd:lineage><gmd:LI_Lineage><gmd:statement><gco:CharacterString>Delineasi batas zonasi dari citra satelit resolusi tinggi SPOT-7 dan verifikasi lapang koordinat patok batas pilar apung.</gco:CharacterString></gmd:statement></gmd:LI_Lineage></gmd:lineage>
    </gmd:DQ_DataQuality>
  </gmd:dataQualityInfo>
</gmd:MD_Metadata>`;

// 4. XML: Coral Reef Survey with Placeholders ("Belum Ada", "TBD", invalid email)
export const SAMPLE_XML_TERUMBU_PLACEHOLDER = `<?xml version="1.0" encoding="UTF-8"?>
<gmd:MD_Metadata xmlns:gmd="http://www.isotc211.org/2005/gmd" xmlns:gco="http://www.isotc211.org/2005/gco">
  <gmd:fileIdentifier><gco:CharacterString>Belum Ada</gco:CharacterString></gmd:fileIdentifier>
  <gmd:language><gco:CharacterString>TBD</gco:CharacterString></gmd:language>
  <gmd:contact>
    <gmd:CI_ResponsibleParty>
      <gmd:organisationName><gco:CharacterString>Template Dinas Kelautan</gco:CharacterString></gmd:organisationName>
      <gmd:contactInfo><gmd:CI_Contact><gmd:address><gmd:CI_Address><gmd:electronicMailAddress><gco:CharacterString>test@example.com</gco:CharacterString></gmd:electronicMailAddress></gmd:CI_Address></gmd:address></gmd:CI_Contact></gmd:contactInfo>
    </gmd:CI_ResponsibleParty>
  </gmd:contact>
  <gmd:dateStamp><gco:Date>0000-00-00</gco:Date></gmd:dateStamp>
  <gmd:identificationInfo>
    <gmd:MD_DataIdentification>
      <gmd:citation>
        <gmd:CI_Citation>
          <gmd:title><gco:CharacterString>Draft Peta</gco:CharacterString></gmd:title>
        </gmd:CI_Citation>
      </gmd:citation>
      <gmd:abstract><gco:CharacterString>Lorem ipsum dolor sit amet sample survey.</gco:CharacterString></gmd:abstract>
      <gmd:extent>
        <gmd:EX_Extent>
          <gmd:geographicElement>
            <gmd:EX_GeographicBoundingBox>
              <gmd:westBoundLongitude><gco:Decimal>0.00</gco:Decimal></gmd:westBoundLongitude>
              <gmd:eastBoundLongitude><gco:Decimal>0.00</gco:Decimal></gmd:eastBoundLongitude>
              <gmd:southBoundLatitude><gco:Decimal>0.00</gco:Decimal></gmd:southBoundLatitude>
              <gmd:northBoundLatitude><gco:Decimal>0.00</gco:Decimal></gmd:northBoundLatitude>
            </gmd:EX_GeographicBoundingBox>
          </gmd:geographicElement>
        </gmd:EX_Extent>
      </gmd:extent>
    </gmd:MD_DataIdentification>
  </gmd:identificationInfo>
</gmd:MD_Metadata>`;

// 5. Corrupted Malformed XML (For parser resilience check)
export const SAMPLE_XML_CORRUPTED = `<?xml version="1.0" encoding="UTF-8"?>
<gmd:MD_Metadata xmlns:gmd="http://www.isotc211.org/2005/gmd">
  <gmd:fileIdentifier>
    <gco:CharacterString>corrupted-file-test
  <!-- Missing closing tags -->
  <gmd:title>Dokumen Rusak
</gmd:MD_Metadata>`;

// 6. GeoJSON dataset Bengkalis / Kepulauan Meranti, Riau
export const SAMPLE_GEOJSON_BENGKALIS = JSON.stringify({
  type: 'FeatureCollection',
  name: 'mangrove_pesisir_bengkalis_meranti',
  crs: {
    type: 'name',
    properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
  },
  features: [
    {
      type: 'Feature',
      id: 'BKL-MG-01',
      properties: {
        kabupaten: 'Bengkalis',
        kecamatan: 'Bantan',
        ekosistem: 'Hutan Mangrove Primer',
        spesies_dominan: 'Rhizophora apiculata',
        kerapatan: 'Sangat Lebat',
        luas_ha: 1420.5,
        sumber_data: 'Analisis Citra Sentinel-2 MSI 2024',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [102.152, 1.450],
            [102.210, 1.485],
            [102.280, 1.460],
            [102.250, 1.410],
            [102.180, 1.405],
            [102.152, 1.450], // Closed linear ring
          ],
        ],
      },
    },
    {
      type: 'Feature',
      id: 'MRT-MG-02',
      properties: {
        kabupaten: 'Kepulauan Meranti',
        kecamatan: 'Tebing Tinggi Barat',
        ekosistem: 'Mangrove Pesisir & Sempadan Pasut',
        spesies_dominan: 'Avicennia marina & Bruguiera gymnorhiza',
        kerapatan: 'Sedang',
        luas_ha: 890.3,
        sumber_data: 'Analisis Citra Sentinel-2 MSI 2024',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [102.620, 0.980],
            [102.690, 1.020],
            [102.730, 0.995],
            [102.680, 0.940],
            [102.630, 0.950],
            [102.620, 0.980], // Closed linear ring
          ],
        ],
      },
    },
    {
      type: 'Feature',
      id: 'BKL-MG-03',
      properties: {
        kabupaten: 'Bengkalis',
        kecamatan: 'Bukit Batu',
        ekosistem: 'Rehabilitasi Mangrove & Sabuk Hijau',
        spesies_dominan: 'Rhizophora mucronata',
        kerapatan: 'Lebat',
        luas_ha: 620.0,
        sumber_data: 'Survei GPS Geodetik Bappeda',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [101.880, 1.320],
            [101.940, 1.350],
            [101.980, 1.330],
            [101.950, 1.290],
            [101.890, 1.300],
            [101.880, 1.320],
          ],
        ],
      },
    },
  ],
}, null, 2);

// 7. JSON Metadata Katalog Kawasan Konservasi Kalbar (KKP3K Kalimantan Barat)
export const SAMPLE_JSON_KALBAR = JSON.stringify({
  dataset_id: 'kkp3k-kalbar-2023-resmi',
  title: 'Katalog Metadata Kawasan Konservasi Pesisir dan Pulau-Pulau Kecil (KKP3K) Kalimantan Barat',
  alternate_title: 'MPA Zoning Boundaries of West Kalimantan Province',
  abstract: 'Basis data spasial batas penetapan dan zonasi Kawasan Konservasi Pesisir dan Pulau-Pulau Kecil di Provinsi Kalimantan Barat (Kubu Raya, Kayong Utara, dan Ketapang) sesuai Keputusan Menteri Kelautan dan Perikanan RI Nomor 93/KEPMEN-KP/2020. Meliputi zona inti perlindungan terumbu karang dan dugong, zona pemanfaatan terbatas untuk perikanan berkelanjutan, serta zona rehabilitasi.',
  purpose: 'Rujukan tata ruang laut daerah (RZWP-3-K) dan pengawasan pemanfaatan ruang laut berkelanjutan di Kalimantan Barat.',
  keywords: [
    'Kawasan Konservasi Perairan',
    'KKP3K',
    'Kalimantan Barat',
    'Zonasi Konservasi',
    'Kubu Raya',
    'Kayong Utara',
    'Dugong',
    'Terumbu Karang'
  ],
  publication_date: '2023-08-15',
  revision_date: '2024-02-10',
  language: 'ind',
  topic_category: ['oceans', 'boundaries', 'biota', 'environment'],
  organization: 'Dinas Kelautan dan Perikanan Provinsi Kalimantan Barat',
  contact_name: 'Ir. Hendra Wardhana, M.Si (Kepala Bidang Kelautan dan Konservasi)',
  contact_email: 'dkp.konservasi@kalbarprov.go.id',
  contact_role: 'custodian',
  spatial_extent: {
    crsName: 'EPSG:4326 (WGS 84 Geographic 2D)',
    west: 108.450,
    south: -3.150,
    east: 110.600,
    north: 0.150
  },
  accuracy: {
    positionalAccuracy: '± 2.5 meter (Berdasarkan Titik Kontrol Geodetik BPN)',
    sensor: 'Citra Satelit Resolusi Sangat Tinggi Pleiades 1A/1B & Delineasi DGPS',
    totalHorizontalUncertainty: '2.5m'
  },
  processing: {
    lineageStatement: 'Delineasi koordinat titik batas dari Lampiran Kepmen KP No. 93/2020, overlay dengan garis pantai rupa bumi Indonesia (BIG), integrasi dengan peta tutupan terumbu karang COREMAP-CTI, dan validasi lapangan bersama Pokmaswas.',
    software: 'ArcGIS Pro 3.1 & QGIS 3.28 LTR'
  },
  legal_decree: 'Keputusan Menteri Kelautan dan Perikanan Republik Indonesia Nomor 93/KEPMEN-KP/2020'
}, null, 2);

// 8. Shapefile ZIP Generator: Alur Migrasi Biota Laut Kotawaringin Timur
export async function createKotawaringinShapefileZip(): Promise<Blob> {
  const zip = new JSZip();

  // Coordinates: Cetacean/Dugong migration route in Teluk Sampit / Tanjung Puting off Kotawaringin Timur
  // Center ~ 112.9 E, -3.1 S
  const xMin = 112.75;
  const yMin = -3.45;
  const xMax = 113.25;
  const yMax = -2.95;

  // 1. .PRJ file (WGS 84 Geographic)
  const prjContent = 'GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]';
  zip.file('alur_migrasi_kotawaringin.prj', prjContent);

  // 2. .CPG file (UTF-8 encoding)
  zip.file('alur_migrasi_kotawaringin.cpg', 'UTF-8');

  // 3. Binary .SHP File (PolyLine, Shape Type 3)
  // Header is 100 bytes. Record: 8 bytes record header + 44 bytes PolyLine content = 52 bytes. Total length = 152 bytes = 76 16-bit words.
  const shpBuffer = new ArrayBuffer(100 + 8 + 44);
  const shpView = new DataView(shpBuffer);

  // Header Big Endian
  shpView.setInt32(0, 9994, false); // File Code
  shpView.setInt32(24, 76, false);   // File Length in 16-bit words (152 / 2 = 76)

  // Header Little Endian
  shpView.setInt32(28, 1000, true); // Version
  shpView.setInt32(32, 3, true);    // Shape Type: 3 = PolyLine
  shpView.setFloat64(36, xMin, true);
  shpView.setFloat64(44, yMin, true);
  shpView.setFloat64(52, xMax, true);
  shpView.setFloat64(60, yMax, true);
  shpView.setFloat64(68, 0.0, true); // Zmin
  shpView.setFloat64(76, 0.0, true); // Zmax
  shpView.setFloat64(84, 0.0, true); // Mmin
  shpView.setFloat64(92, 0.0, true); // Mmax

  // Record 1 Header (at offset 100)
  shpView.setInt32(100, 1, false);  // Record Number (1)
  shpView.setInt32(104, 22, false); // Content Length (44 bytes / 2 = 22 words)

  // Record 1 Content (PolyLine)
  shpView.setInt32(108, 3, true);   // Shape type 3
  shpView.setFloat64(112, xMin, true);
  shpView.setFloat64(120, yMin, true);
  shpView.setFloat64(128, xMax, true);
  shpView.setFloat64(136, yMax, true);
  // (simplified polyline structure for test parsing)

  zip.file('alur_migrasi_kotawaringin.shp', shpBuffer);

  // 4. Binary .SHX File (Index)
  // Header 100 bytes + 8 bytes index = 108 bytes = 54 words
  const shxBuffer = new ArrayBuffer(100 + 8);
  const shxView = new DataView(shxBuffer);
  shxView.setInt32(0, 9994, false);
  shxView.setInt32(24, 54, false);
  shxView.setInt32(28, 1000, true);
  shxView.setInt32(32, 3, true);
  shxView.setFloat64(36, xMin, true);
  shxView.setFloat64(44, yMin, true);
  shxView.setFloat64(52, xMax, true);
  shxView.setFloat64(60, yMax, true);
  shxView.setInt32(100, 50, false); // offset in 16-bit words (100 / 2 = 50)
  shxView.setInt32(104, 22, false); // length in 16-bit words (22)
  zip.file('alur_migrasi_kotawaringin.shx', shxBuffer);

  // 5. Binary .DBF File (dBASE III)
  // Header 32 bytes + 2 field descriptors (64 bytes) + terminator 1 byte = 97 bytes -> padded to 128 bytes
  const dbfBuffer = new ArrayBuffer(128 + 32);
  const dbfView = new DataView(dbfBuffer);
  dbfView.setUint8(0, 0x03); // dBASE III without memo
  dbfView.setUint8(1, 24);   // Year (2024 - 1900 = 124 % 100 = 24)
  dbfView.setUint8(2, 6);    // Month
  dbfView.setUint8(3, 10);   // Day
  dbfView.setUint32(4, 1, true); // Record Count = 1
  dbfView.setUint16(8, 97, true); // Header Length
  dbfView.setUint16(10, 32, true); // Record Length

  // Field 1: KORIDOR (Character, 20 bytes)
  const f1Name = 'KORIDOR';
  for (let i = 0; i < f1Name.length; i++) dbfView.setUint8(32 + i, f1Name.charCodeAt(i));
  dbfView.setUint8(32 + 11, 'C'.charCodeAt(0));
  dbfView.setUint8(32 + 16, 20); // Length

  // Field 2: SPESIES (Character, 20 bytes)
  const f2Name = 'SPESIES';
  for (let i = 0; i < f2Name.length; i++) dbfView.setUint8(64 + i, f2Name.charCodeAt(i));
  dbfView.setUint8(64 + 11, 'C'.charCodeAt(0));
  dbfView.setUint8(64 + 16, 20); // Length

  dbfView.setUint8(96, 0x0D); // Terminator

  zip.file('alur_migrasi_kotawaringin.dbf', dbfBuffer);

  return await zip.generateAsync({ type: 'blob' });
}

/**
 * KOMPAS - Comprehensive Parser Test Suite
 * Pengujian mendalam untuk seluruh parser metadata dan data spasial:
 * 1. XML Parser (ISO 19139 gmd, ISO 19115-3 mdb, Esri XML, CSW unwrapping, Corrupt XML)
 * 2. JSON Parser (CKAN package_show, DCAT, Extras dictionary, Direct download detection)
 * 3. GeoJSON Parser (RFC 7946 FeatureCollection, Geometri, Bounding Box, Topologi)
 * 4. Shapefile ZIP Parser (Zip-slip mitigation, validasi komponen .shp, .shx, .dbf)
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { parseXmlMetadata } from './xmlParser';
import { parseJsonMetadata } from './jsonParser';
import { parseGeoJson } from './geoJsonParser';
import { parseShapefileZip } from './shapefileZipParser';
import JSZip from 'jszip';

// ---------------------------------------------------------
// 1. PENGUJIAN XML PARSER
// ---------------------------------------------------------
test('XML Parser: Berhasil mengurai ISO 19139 (gmd) dengan pemetaan hierarkis pohon XML', () => {
  const gmdSample = `<?xml version="1.0" encoding="UTF-8"?>
<gmd:MD_Metadata xmlns:gmd="http://www.isotc211.org/2005/gmd" xmlns:gco="http://www.isotc211.org/2005/gco">
  <gmd:fileIdentifier><gco:CharacterString>ID-BENGKALIS-2023</gco:CharacterString></gmd:fileIdentifier>
  <gmd:language><gco:CharacterString>ind</gco:CharacterString></gmd:language>
  <gmd:identificationInfo>
    <gmd:MD_DataIdentification>
      <gmd:citation>
        <gmd:CI_Citation>
          <gmd:title><gco:CharacterString>Peta Batimetri Perairan Bengkalis</gco:CharacterString></gmd:title>
          <gmd:date>
            <gmd:CI_Date>
              <gmd:date><gco:Date>2023-08-15</gco:Date></gmd:date>
              <gmd:dateType><gmd:CI_DateTypeCode codeListValue="publication"/></gmd:dateType>
            </gmd:CI_Date>
          </gmd:date>
        </gmd:CI_Citation>
      </gmd:citation>
      <gmd:abstract><gco:CharacterString>Data kedalaman laut hasil survei multibeam echosounder perairan Pulau Bengkalis.</gco:CharacterString></gmd:abstract>
      <gmd:pointOfContact>
        <gmd:CI_ResponsibleParty>
          <gmd:organisationName><gco:CharacterString>Pusat Hidro-Oseanografi TNI AL</gco:CharacterString></gmd:organisationName>
          <gmd:contactInfo>
            <gmd:CI_Contact>
              <gmd:address>
                <gmd:CI_Address>
                  <gmd:electronicMailAddress><gco:CharacterString>info@pushidrosal.id</gco:CharacterString></gmd:electronicMailAddress>
                </gmd:CI_Address>
              </gmd:address>
            </gmd:CI_Contact>
          </gmd:contactInfo>
          <gmd:role><gmd:CI_RoleCode codeListValue="pointOfContact"/></gmd:role>
        </gmd:CI_ResponsibleParty>
      </gmd:pointOfContact>
      <gmd:extent>
        <gmd:EX_Extent>
          <gmd:geographicElement>
            <gmd:EX_GeographicBoundingBox>
              <gmd:westBoundLongitude><gco:Decimal>101.90</gco:Decimal></gmd:westBoundLongitude>
              <gmd:eastBoundLongitude><gco:Decimal>102.50</gco:Decimal></gmd:eastBoundLongitude>
              <gmd:southBoundLatitude><gco:Decimal>1.20</gco:Decimal></gmd:southBoundLatitude>
              <gmd:northBoundLatitude><gco:Decimal>1.80</gco:Decimal></gmd:northBoundLatitude>
            </gmd:EX_GeographicBoundingBox>
          </gmd:geographicElement>
        </gmd:EX_Extent>
      </gmd:extent>
    </gmd:MD_DataIdentification>
  </gmd:identificationInfo>
  <gmd:metadataStandardName><gco:CharacterString>ISO 19115:2003/19139</gco:CharacterString></gmd:metadataStandardName>
</gmd:MD_Metadata>`;

  const result = parseXmlMetadata(gmdSample, 'bengkalis_gmd.xml');
  assert.equal(result.rawFormat, 'xml_iso19139');
  assert.equal(result.title, 'Peta Batimetri Perairan Bengkalis');
  assert.ok(result.abstract?.includes('kedalaman laut'));
  assert.equal(result.contact?.organization, 'Pusat Hidro-Oseanografi TNI AL');
  assert.equal(result.contact?.email, 'info@pushidrosal.id');
  assert.equal(result.contact?.role, 'pointOfContact');
  assert.equal(result.spatialExtent?.westBoundLongitude, 101.90);
  assert.equal(result.spatialExtent?.eastBoundLongitude, 102.50);
  assert.equal(result.spatialExtent?.southBoundLatitude, 1.20);
  assert.equal(result.spatialExtent?.northBoundLatitude, 1.80);
  assert.equal(result.metaMetadata?.standardName, 'ISO 19115:2003/19139');
  assert.equal(result.parseErrors.length, 0);
});

test('XML Parser: Berhasil mengurai ISO 19115-3 (mdb) dan mengekstrak CRS kode hierarkis', () => {
  const mdbSample = `<?xml version="1.0" encoding="UTF-8"?>
<mdb:MD_Metadata xmlns:mdb="http://standards.iso.org/iso/19115/-3/mdb/2.0"
                 xmlns:cit="http://standards.iso.org/iso/19115/-3/cit/2.0"
                 xmlns:mri="http://standards.iso.org/iso/19115/-3/mri/2.0"
                 xmlns:mrs="http://standards.iso.org/iso/19115/-3/mrs/2.0"
                 xmlns:mcc="http://standards.iso.org/iso/19115/-3/mcc/1.0"
                 xmlns:gco="http://standards.iso.org/iso/19115/-3/gco/1.0">
  <mdb:metadataIdentifier>
    <mcc:MD_Identifier>
      <mcc:code><gco:CharacterString>urn:marine:bathymetry:2024</gco:CharacterString></mcc:code>
    </mcc:MD_Identifier>
  </mdb:metadataIdentifier>
  <mdb:identificationInfo>
    <mri:MD_DataIdentification>
      <mri:citation>
        <cit:CI_Citation>
          <cit:title><gco:CharacterString>Model Batimetri Selat Makassar</gco:CharacterString></cit:title>
        </cit:CI_Citation>
      </mri:citation>
      <mri:abstract><gco:CharacterString>Data grid batimetri resolusi tinggi Selat Makassar.</gco:CharacterString></mri:abstract>
    </mri:MD_DataIdentification>
  </mdb:identificationInfo>
  <mdb:referenceSystemInfo>
    <mrs:MD_ReferenceSystem>
      <mrs:referenceSystemIdentifier>
        <mcc:MD_Identifier>
          <mcc:codeSpace><gco:CharacterString>EPSG</gco:CharacterString></mcc:codeSpace>
          <mcc:code><gco:CharacterString>4326</gco:CharacterString></mcc:code>
        </mcc:MD_Identifier>
      </mrs:referenceSystemIdentifier>
    </mrs:MD_ReferenceSystem>
  </mdb:referenceSystemInfo>
</mdb:MD_Metadata>`;

  const result = parseXmlMetadata(mdbSample, 'makassar_mdb.xml');
  assert.equal(result.rawFormat, 'xml_iso19115_3');
  assert.equal(result.title, 'Model Batimetri Selat Makassar');
  assert.equal(result.spatialExtent?.crsCode, '4326');
  assert.equal(result.spatialExtent?.crsName, 'EPSG:4326');
  assert.equal(result.datasetId, 'urn:marine:bathymetry:2024');
});

test('XML Parser: Berhasil mengurai struktur XML Esri / FGDC dengan elemen <idinfo>', () => {
  const esriSample = `<?xml version="1.0" encoding="UTF-8"?>
<metadata>
  <idinfo>
    <citation>
      <citeinfo>
        <title>Mangrove Pesisir Utara Jawa</title>
        <pubdate>20220101</pubdate>
      </citeinfo>
    </citation>
    <descript>
      <abstract>Sebaran tutupan vegetasi mangrove kawasan pesisir pantai utara Jawa Tengah.</abstract>
    </descript>
    <spdom>
      <bounding>
        <westbc>109.5</westbc>
        <eastbc>111.2</eastbc>
        <southbc>-7.2</southbc>
        <northbc>-6.5</northbc>
      </bounding>
    </spdom>
    <ptcontac>
      <cntinfo>
        <cntorg>Dinas Lingkungan Hidup</cntorg>
        <cntemail>kontak@dlh.jateng.go.id</cntemail>
      </cntinfo>
    </ptcontac>
  </idinfo>
</metadata>`;

  const result = parseXmlMetadata(esriSample, 'esri_sample.xml');
  assert.equal(result.rawFormat, 'xml_esri');
  assert.equal(result.title, 'Mangrove Pesisir Utara Jawa');
  assert.equal(result.contact?.organization, 'Dinas Lingkungan Hidup');
  assert.equal(result.contact?.email, 'kontak@dlh.jateng.go.id');
  assert.equal(result.spatialExtent?.westBoundLongitude, 109.5);
  assert.equal(result.spatialExtent?.southBoundLatitude, -7.2);
  assert.equal(result.spatialExtent?.eastBoundLongitude, 111.2);
  assert.equal(result.spatialExtent?.northBoundLatitude, -6.5);
});

test('XML Parser: Berhasil membuka pembungkus CSW GetRecordByIdResponse secara otentik', () => {
  const cswSample = `<?xml version="1.0" encoding="UTF-8"?>
<csw:GetRecordByIdResponse xmlns:csw="http://www.opengis.net/cat/csw/2.0.2">
  <gmd:MD_Metadata xmlns:gmd="http://www.isotc211.org/2005/gmd" xmlns:gco="http://www.isotc211.org/2005/gco">
    <gmd:identificationInfo>
      <gmd:MD_DataIdentification>
        <gmd:citation>
          <gmd:CI_Citation>
            <gmd:title><gco:CharacterString>Dataset dari Geoportal CSW</gco:CharacterString></gmd:title>
          </gmd:CI_Citation>
        </gmd:citation>
      </gmd:MD_DataIdentification>
    </gmd:identificationInfo>
  </gmd:MD_Metadata>
</csw:GetRecordByIdResponse>`;

  const result = parseXmlMetadata(cswSample, 'csw_wrapped.xml');
  assert.equal(result.title, 'Dataset dari Geoportal CSW');
  assert.equal(result.rawFormat, 'xml_iso19139');
});

test('XML Parser: Berkas korup/tidak valid ditangani secara aman tanpa crash', () => {
  const corruptXml = '<<<<<< INI BUKAN XML VALID >>>>>>';
  const result = parseXmlMetadata(corruptXml, 'corrupt.xml');
  assert.ok(result.parseErrors.length > 0);
  assert.equal(result.title, undefined);
});

// ---------------------------------------------------------
// 2. PENGUJIAN JSON PARSER
// ---------------------------------------------------------
test('JSON Parser: Berhasil mengurai katalog CKAN lengkap dengan pembungkus { success, result }', () => {
  const ckanJson = JSON.stringify({
    help: 'https://ckan.org/api/3/action/package_show',
    success: true,
    result: {
      id: 'ckan-marine-coral-2023',
      title: 'Katalog Sebaran Terumbu Karang Wakatobi',
      notes: 'Pemantauan terumbu karang ekosistem laut Taman Nasional Wakatobi.',
      license_title: 'Creative Commons Attribution 4.0',
      author: 'Balai Taman Nasional Wakatobi',
      author_email: 'info@btnwakatobi.id',
      maintainer: 'Seksi Pengelolaan Wilayah II',
      maintainer_email: 'spw2@btnwakatobi.id',
      metadata_created: '2023-01-15T08:00:00Z',
      metadata_modified: '2023-06-20T10:30:00Z',
      extras: [
        { key: 'spatial', value: '{"type":"Polygon","coordinates":[[[123.5,-5.8],[124.2,-5.8],[124.2,-5.2],[123.5,-5.2],[123.5,-5.8]]]}' },
        { key: 'lineage', value: 'Survei transek foto bawah air (Underwater Photo Transect).' },
      ],
      resources: [
        {
          id: 'res-01',
          name: 'WFS Karang Wakatobi',
          format: 'WFS',
          url: 'https://geoportal.wakatobi.id/geoserver/wfs?service=WFS&request=GetCapabilities',
        },
        {
          id: 'res-02',
          name: 'Shapefile Terumbu Karang',
          format: 'SHP',
          url: 'https://data.wakatobi.id/download/karang_wakatobi.zip',
        },
      ],
    },
  });

  const result = parseJsonMetadata(ckanJson, 'wakatobi.json');
  assert.equal(result.rawFormat, 'json_catalog');
  assert.equal(result.title, 'Katalog Sebaran Terumbu Karang Wakatobi');
  assert.ok(result.abstract?.includes('Taman Nasional Wakatobi'));
  assert.equal(result.contact?.organization, 'Balai Taman Nasional Wakatobi');
  assert.equal(result.contact?.email, 'info@btnwakatobi.id');
  assert.ok(result.allOnlineResources && result.allOnlineResources.length === 2);
  assert.ok(result.allOnlineResources.some(r => r.isDirectDownload));
  assert.ok(result.processing?.lineageStatement?.includes('Survei transek'));
  assert.equal(result.spatialExtent?.westBoundLongitude, 123.5);
  assert.equal(result.spatialExtent?.southBoundLatitude, -5.8);
  assert.equal(result.spatialExtent?.eastBoundLongitude, 124.2);
  assert.equal(result.spatialExtent?.northBoundLatitude, -5.2);
});

test('JSON Parser: Menangani JSON array, format kosong, dan JSON korup secara defensif', () => {
  const jsonArray = JSON.stringify([
    { title: 'Item Pertama', notes: 'Deskripsi katalog pertama' },
    { title: 'Item Kedua', notes: 'Deskripsi katalog kedua' },
  ]);

  const result = parseJsonMetadata(jsonArray, 'array.json');
  assert.equal(result.title, 'Item Pertama');
  assert.ok(result.parseWarnings.length > 0);

  const corruptJson = '{ "title": "Bengkalis", invalidJson... ';
  const corruptResult = parseJsonMetadata(corruptJson, 'corrupt.json');
  assert.ok(corruptResult.parseErrors.length > 0);
});

// ---------------------------------------------------------
// 3. PENGUJIAN GEOJSON PARSER
// ---------------------------------------------------------
test('GeoJSON Parser: Menghitung bounding box, validasi geometri, CRS, dan atribut fitur', () => {
  const sampleGeoJson = JSON.stringify({
    type: 'FeatureCollection',
    name: 'kawasan_konservasi_laut',
    crs: {
      type: 'name',
      properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
    },
    features: [
      {
        type: 'Feature',
        id: 'KKP-01',
        properties: {
          nama: 'Zona Inti Konservasi',
          luas_ha: 1540.5,
          kategori: 'Perlindungan Mutlak',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [105.1, -5.2],
              [105.5, -5.2],
              [105.5, -4.8],
              [105.1, -4.8],
              [105.1, -5.2],
            ],
          ],
        },
      },
      {
        type: 'Feature',
        id: 'KKP-02',
        properties: {
          nama: 'Zona Pemanfaatan Terbatas',
          luas_ha: 2300.0,
          kategori: 'Budidaya Ramah Lingkungan',
        },
        geometry: {
          type: 'Point',
          coordinates: [105.3, -5.0],
        },
      },
    ],
  });

  const result = parseGeoJson(sampleGeoJson, 'kkp.geojson');
  assert.equal(result.format, 'geojson');
  assert.equal(result.featureCount, 2);
  assert.deepEqual(result.bounds, [105.1, -5.2, 105.5, -4.8]);
  assert.equal(result.crs?.isGeographicWgs84, true);
  assert.ok(result.geometryTypes.includes('Polygon'));
  assert.ok(result.geometryTypes.includes('Point'));
  assert.equal(result.emptyGeometryCount, 0);
  assert.equal(result.ringClosureErrorsCount, 0);
  const namaAttr = result.attributes.find(a => a.name === 'nama');
  assert.ok(namaAttr);
  assert.equal(namaAttr.nullCount, 0);
});

test('GeoJSON Parser: Mendeteksi anomali topologi, koordinat tidak valid, dan ring closure error', () => {
  const anomalousGeoJson = JSON.stringify({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: null, // Geometri kosong
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          // Poligon tidak tertutup (titik akhir != titik awal)
          coordinates: [
            [
              [100.0, -1.0],
              [101.0, -1.0],
              [101.0, 0.0],
              [100.0, 0.0],
              // Hilang titik penutup [100.0, -1.0]
            ],
          ],
        },
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [999999, 999999], // Koordinat di luar batas lintang-bujur
        },
      },
    ],
  });

  const result = parseGeoJson(anomalousGeoJson, 'anomaly.geojson');
  assert.equal(result.featureCount, 3);
  assert.equal(result.emptyGeometryCount, 1);
  assert.equal(result.ringClosureErrorsCount, 1);
  assert.ok(result.invalidCoordinateCount > 0);
});

// ---------------------------------------------------------
// 4. PENGUJIAN SHAPEFILE ZIP PARSER
// ---------------------------------------------------------
test('Shapefile ZIP Parser: Memeriksa struktur arsip, komponen berkas, dan mitigasi Zip-Slip', async () => {
  // Buat berkas ZIP sintetis dengan JSZip
  const zip = new JSZip();
  // Header dummy 100 byte untuk berkas .shp
  const shpHeader = new Uint8Array(100);
  const view = new DataView(shpHeader.buffer);
  view.setInt32(0, 9994, false); // File Code big-endian
  view.setInt32(28, 1000, true);  // Version little-endian
  view.setInt32(32, 5, true);     // ShapeType Polygon
  view.setFloat64(36, 106.0, true); // Xmin
  view.setFloat64(44, -6.5, true);  // Ymin
  view.setFloat64(52, 107.0, true); // Xmax
  view.setFloat64(60, -5.5, true);  // Ymax

  zip.file('terumbu_karang.shp', shpHeader);
  zip.file('terumbu_karang.shx', new Uint8Array(100));
  // DBF dummy header
  const dbfHeader = new Uint8Array(64);
  dbfHeader[0] = 0x03; // dBASE III
  const dbfView = new DataView(dbfHeader.buffer);
  dbfView.setInt32(4, 10, true); // 10 records
  dbfView.setInt16(8, 32, true); // Header length
  dbfView.setInt16(10, 20, true); // Record length
  zip.file('terumbu_karang.dbf', dbfHeader);
  zip.file('terumbu_karang.prj', 'GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]');

  const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' });
  const result = await parseShapefileZip(zipBuffer, 'terumbu_karang.zip');

  assert.equal(result.format, 'shapefile_zip');
  assert.equal(result.geometryTypes[0], 'Polygon');
  assert.deepEqual(result.bounds, [106.0, -6.5, 107.0, -5.5]);
  assert.equal(result.crs?.isGeographicWgs84, true);
  assert.equal(result.featureCount, 10);
  assert.equal(result.errors.length, 0);

  // Uji perlindungan Zip Slip
  const zipSlip = new JSZip();
  zipSlip.file('../../etc/passwd', 'malicious-content');
  const badZipBuffer = await zipSlip.generateAsync({ type: 'arraybuffer' });
  const badResult = await parseShapefileZip(badZipBuffer, 'bad.zip');
  assert.ok(badResult.errors.some(e => e.includes('Zip Slip')));
});

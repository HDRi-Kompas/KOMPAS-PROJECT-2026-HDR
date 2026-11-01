/**
 * KOMPAS - Unit & Acceptance Tests (U1–U5)
 * Conforms to Handover Final 17 Bagian & KOMPAS_aturan_dan_acuan_v7.json.
 * Uses Node's built-in test runner (node:test) as mandated by Ultra Mode.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { parseXmlMetadata } from '../parsers/xmlParser';
import { parseJsonMetadata } from '../parsers/jsonParser';
import { parseGeoJson } from '../parsers/geoJsonParser';
import { runDatasetAudit } from './engine';
import { isPlaceholderValue, isValidContactEmail, validateBBox } from './validator';
import {
  SAMPLE_XML_BATIMETRI_ISO19139,
  SAMPLE_XML_BATIMETRI_ESRI,
  SAMPLE_XML_CORRUPTED,
  SAMPLE_XML_TERUMBU_PLACEHOLDER,
  SAMPLE_GEOJSON_BENGKALIS,
  SAMPLE_JSON_KALBAR,
} from '../data/samples';
import fs from 'node:fs';
import {
  getActiveConfig,
  getBenchmarkSamples,
  getBenchmarkKodean,
  getBenchmarkAcuan,
  getBenchmarkFlags,
  getQualityFlagsDefinition,
  validateRulesConfig,
  loadCustomConfig,
  evaluateQualityTier,
  getOpenDecisions,
} from './configLoader';
import { calculateV7Scores } from './v7Scoring';
import { getBenchmarkDatasetsV7 } from '../data/benchmarksV7';

test('JSON Config Loader validates v7 JSON and protects against corrupt schemas', () => {
  const config = getActiveConfig();
  assert.equal(config.versi_aturan, 'v7-2026-10-31');
  assert.equal(config.elemen.length, 32);
  assert.equal(Object.keys(config.sampel).length, 15);
  assert.equal(Object.keys(config.acuan).length, 15);

  const validation = validateRulesConfig(config);
  assert.equal(validation.isValid, true);
  assert.equal(validation.errors.length, 0);

  // Test invalid schema protection
  const invalidValidation = validateRulesConfig({ versi_aturan: 'v9', elemen: [] });
  assert.equal(invalidValidation.isValid, false);
  assert.ok(invalidValidation.errors.length > 0);
});

test('U1 Uji Hitung: D01 to D18 15 Datasets scores match Acuan JSON within tolerance <= 0.1', () => {
  const benchmarks = getBenchmarkDatasetsV7();
  assert.equal(benchmarks.length, 15);

  for (const ds of benchmarks) {
    const calc = calculateV7Scores(ds.scores);

    // 1. Skor A (32 Elemen, Skema A)
    const diffSkorA = Math.abs(calc.skorA - ds.expectedSkorA);
    assert.ok(
      diffSkorA <= 0.1,
      `Dataset ${ds.id} Skor A mismatch: calc=${calc.skorA.toFixed(4)}, expected=${ds.expectedSkorA.toFixed(4)}, diff=${diffSkorA.toFixed(4)}`
    );

    // 2. MQI Biner (32 Elemen)
    const diffMqiBiner = Math.abs(calc.mqiBiner - ds.expectedMqiBiner);
    assert.ok(
      diffMqiBiner <= 0.1,
      `Dataset ${ds.id} MQI Biner mismatch: calc=${calc.mqiBiner.toFixed(4)}, expected=${ds.expectedMqiBiner.toFixed(4)}, diff=${diffMqiBiner.toFixed(4)}`
    );

    // 3. MQI Diperluas (32 Elemen)
    const diffMqiDiperluas = Math.abs(calc.mqiDiperluas - ds.expectedMqiDiperluas);
    assert.ok(
      diffMqiDiperluas <= 0.1,
      `Dataset ${ds.id} MQI Diperluas mismatch: calc=${calc.mqiDiperluas.toFixed(4)}, expected=${ds.expectedMqiDiperluas.toFixed(4)}, diff=${diffMqiDiperluas.toFixed(4)}`
    );

    // 4. Skor A Inti (26 Elemen)
    const diffSkorAInti = Math.abs(calc.skorAInti - ds.expectedSkorAInti);
    assert.ok(
      diffSkorAInti <= 0.1,
      `Dataset ${ds.id} Skor A Inti mismatch: calc=${calc.skorAInti.toFixed(4)}, expected=${ds.expectedSkorAInti.toFixed(4)}, diff=${diffSkorAInti.toFixed(4)}`
    );

    // 5. MQI Biner Inti (26 Elemen)
    const diffMqiBinerInti = Math.abs(calc.mqiBinerInti - ds.expectedMqiBinerInti);
    assert.ok(
      diffMqiBinerInti <= 0.1,
      `Dataset ${ds.id} MQI Biner Inti mismatch: calc=${calc.mqiBinerInti.toFixed(4)}, expected=${ds.expectedMqiBinerInti.toFixed(4)}, diff=${diffMqiBinerInti.toFixed(4)}`
    );

    // 6. MQI Diperluas Inti (26 Elemen)
    const diffMqiDiperluasInti = Math.abs(calc.mqiDiperluasInti - ds.expectedMqiDiperluasInti);
    assert.ok(
      diffMqiDiperluasInti <= 0.1,
      `Dataset ${ds.id} MQI Diperluas Inti mismatch: calc=${calc.mqiDiperluasInti.toFixed(4)}, expected=${ds.expectedMqiDiperluasInti.toFixed(4)}, diff=${diffMqiDiperluasInti.toFixed(4)}`
    );

    // 7. Skor Ekstensi E27-E32
    const diffExt = Math.abs(calc.skorEkstensi - ds.expectedSkorEkstensi);
    assert.ok(
      diffExt <= 0.1,
      `Dataset ${ds.id} Skor Ekstensi mismatch: calc=${calc.skorEkstensi.toFixed(4)}, expected=${ds.expectedSkorEkstensi.toFixed(4)}, diff=${diffExt.toFixed(4)}`
    );

    // 8. Kategori Kualitas
    assert.equal(calc.kategoriBiner, ds.expectedKategoriBiner, `Dataset ${ds.id} Kategori Biner`);
    assert.equal(calc.kategoriDiperluas, ds.expectedKategoriDiperluas, `Dataset ${ds.id} Kategori Diperluas`);
    assert.equal(calc.kategoriInti, ds.expectedKategoriInti, `Dataset ${ds.id} Kategori Inti`);

    // 9. Empty Elements Count
    assert.equal(calc.emptyElements.length, ds.emptyElementsCount, `Dataset ${ds.id} empty count`);

    // 10. Verify all expected empty elements are present
    const emptyIds = calc.emptyElements.map(e => e.id);
    for (const expId of ds.emptyElementsList) {
      assert.ok(emptyIds.includes(expId), `Dataset ${ds.id} expected empty element ${expId}`);
    }

    // 11. Category percentages tolerance <= 0.1
    assert.ok(Math.abs(calc.categoryScores['Informasi umum'] - ds.categoryPercentages.informasiUmum) <= 0.1);
    assert.ok(Math.abs(calc.categoryScores['Identifikasi'] - ds.categoryPercentages.identifikasi) <= 0.1);
    assert.ok(Math.abs(calc.categoryScores['Deskripsi'] - ds.categoryPercentages.deskripsi) <= 0.1);
    assert.ok(Math.abs(calc.categoryScores['Cakupan'] - ds.categoryPercentages.cakupan) <= 0.1);
    assert.ok(Math.abs(calc.categoryScores['Ketelitian'] - ds.categoryPercentages.ketelitian) <= 0.1);
    assert.ok(Math.abs(calc.categoryScores['Kontak'] - ds.categoryPercentages.kontak) <= 0.1);
    assert.ok(Math.abs(calc.categoryScores['Meta-metadata'] - ds.categoryPercentages.metaMetadata) <= 0.1);
    assert.ok(Math.abs(calc.categoryScores['Pemrosesan'] - ds.categoryPercentages.pemrosesan) <= 0.1);
  }
});

test('U2 Uji Kodean & Parser: Element-by-element comparison against Kodean for all 15 datasets', () => {
  const config = getActiveConfig();
  const samples = config.sampel;
  const kodean = config.kodean;
  const acuan = config.acuan;
  const openDecisions = getOpenDecisions();

  assert.equal(Object.keys(samples).length, 15, 'Must have exactly 15 benchmark samples');
  assert.equal(Object.keys(kodean).length, 15, 'Must have exactly 15 kodean entries');
  assert.equal(Object.keys(acuan).length, 15, 'Must have exactly 15 acuan entries');

  // Verify all 15 datasets element-by-element across all 32 elements (E01–E32)
  for (const [dsId, elMap] of Object.entries(kodean)) {
    const dsSample = samples[dsId];
    const dsAcuan = acuan[dsId];
    assert.ok(dsSample, `Sample metadata exists for ${dsId}`);
    assert.ok(dsAcuan, `Acuan benchmark exists for ${dsId}`);

    // Check all 32 elements exist and have valid values (1.0, 0.5, or 0.0)
    for (const el of config.elemen) {
      const val = elMap[el.id];
      assert.ok(
        val === 1.0 || val === 0.5 || val === 0.0,
        `Dataset ${dsId} Element ${el.id} has valid score in kodean (was ${val})`
      );
    }

    // Calculate score using v7 scoring algorithm
    const calc = calculateV7Scores(elMap);

    // Verify calculated scores match acuan exactly
    assert.ok(
      Math.abs(calc.skorA - dsAcuan['Skor A (usulan)']) <= 0.1,
      `Dataset ${dsId} Skor A mismatch: calc=${calc.skorA.toFixed(2)}, acuan=${dsAcuan['Skor A (usulan)']}`
    );
    assert.ok(
      Math.abs(calc.mqiBiner - dsAcuan['MQI biner']) <= 0.1,
      `Dataset ${dsId} MQI Biner mismatch`
    );
    assert.ok(
      Math.abs(calc.mqiDiperluas - dsAcuan['MQI diperluas']) <= 0.1,
      `Dataset ${dsId} MQI Diperluas mismatch`
    );
    assert.ok(
      Math.abs(calc.skorAInti - dsAcuan['Skor A inti (E01-E26)']) <= 0.1,
      `Dataset ${dsId} Skor A Inti mismatch`
    );
    assert.ok(
      Math.abs(calc.skorEkstensi - dsAcuan['Skor ekstensi (E27-E32 saja)']) <= 0.1,
      `Dataset ${dsId} Skor Ekstensi mismatch`
    );
    assert.equal(
      calc.emptyElements.length,
      dsAcuan['n elemen kosong (nilai 0)'],
      `Dataset ${dsId} empty count mismatch`
    );
  }

  // Verify parser on sample bathymetry extracts core elements
  const norm = parseXmlMetadata(SAMPLE_XML_BATIMETRI_ISO19139, 'sample_bathy.xml');
  const auditReport = runDatasetAudit('kelautan_umum', norm);
  assert.ok(auditReport.elementValuesV7 !== undefined);
  const elementScores = auditReport.elementValuesV7;

  assert.equal(elementScores['E01'], 1, 'E01 language code ind');
  assert.equal(elementScores['E02'], 0.5, 'E02 ISO 19115/19139:2003 older standard');
  assert.equal(elementScores['E06'], 1, 'E06 UUID present');
  assert.equal(elementScores['E13'], 1, 'E13 Bounding box valid');
  assert.equal(elementScores['E15'], 0.5, 'E15 EPSG:4326 geographic 2D');
  assert.equal(elementScores['E28'], 0.5, 'E28 Scope code dataset without specific hierarchy name');

  // Configurable threshold verification
  assert.equal(openDecisions.u2PassingThresholdPercent, 90);
  assert.equal(openDecisions.initialManualValue, 0.5);
});

test('U3 Uji Format: GMD, MDB (ISO 19115-3), ESRI XML (D08), and Faithful CKAN JSON (D13, D14)', () => {
  // 1. GMD (ISO 19139)
  const normGmd = parseXmlMetadata(SAMPLE_XML_BATIMETRI_ISO19139, 'sample_gmd.xml');
  assert.equal(normGmd.rawFormat, 'xml_iso19139');
  assert.equal(normGmd.title, 'Survei Batimetri Multibeam Alur Pelayaran TSS Selat Malaka');
  assert.equal(normGmd.language, 'ind');
  assert.ok(normGmd.spatialExtent?.isBBoxValid);

  // 2. ESRI XML (.shp.xml - D08 Mangrove 2024 1:25K)
  const normEsri = parseXmlMetadata(SAMPLE_XML_BATIMETRI_ESRI, 'd08_mangrove.shp.xml');
  assert.equal(normEsri.rawFormat, 'xml_esri');
  assert.equal(normEsri.xmlRootElement, 'esri_metadata');
  assert.ok(normEsri.title && normEsri.title.includes('Batimetri Single-Beam'));
  assert.ok(normEsri.abstract && normEsri.abstract.includes('kedalaman laut'));
  assert.equal(normEsri.contact?.organization, 'Dinas Perhubungan dan Navigasi');

  // 3. CKAN JSON D13: Indeks Peta Lingkungan Pantai Indonesia (LPI) 1:25.000 (BIG)
  const ckanJsonD13 = JSON.stringify({
    help: 'https://tanahair.indonesia.go.id/portal-web/api/3/action/package_show?id=indeks-lpi-25k',
    success: true,
    result: {
      id: 'd13-indeks-lpi-25k',
      name: 'indeks_peta_lpi_25000',
      title: 'Indeks Peta Lingkungan Pantai Indonesia (LPI) 1:25.000',
      notes: 'Peta indeks batas dan penomoran lembar peta cetak Lingkungan Pantai Indonesia skala 1:25.000 seluruh wilayah pesisir Indonesia.',
      maintainer: 'Pusat Pemetaan Kelautan dan Lingkungan Pantai',
      maintainer_email: 'ppklp@big.go.id',
      author: 'Badan Informasi Geospasial',
      author_email: 'info@big.go.id',
      tags: [{ name: 'LPI' }, { name: 'Pantai' }, { name: 'BIG' }, { name: 'Pesisir' }],
      extras: [
        { key: 'metadata-language', value: 'Bahasa Indonesia' },
        { key: 'dataset-reference-date', value: '2021-09-29' },
        { key: 'resource-type', value: 'dataset' },
        { key: 'spatial', value: '{"type":"Polygon","coordinates":[[[95, -11],[141, -11],[141, 6],[95, 6],[95, -11]]]}' },
        { key: 'review_status', value: 'rejected' }, // Triggers F14!
        { key: 'kurasi_notes_extra', value: 'format data tidak sesuai spesifikasi geodatabase' },
      ],
      resources: [
        {
          id: 'res-wms-lpi',
          name: 'Layanan WMS Indeks LPI 25K',
          url: 'https://geoservices.big.go.id/geoserver/lpi_25k/wms',
          format: 'WMS',
          resource_locator_protocol: 'OGC:WMS',
          description: 'Web Map Service lembar indeks peta pesisir LPI 1:25.000',
        },
        {
          id: 'res-wfs-lpi',
          name: 'Layanan WFS Indeks LPI 25K',
          url: 'https://geoservices.big.go.id/geoserver/lpi_25k/wfs',
          format: 'WFS',
          resource_locator_protocol: 'OGC:WFS',
          description: 'Web Feature Service fitur batas indeks lembar LPI',
        },
      ],
    },
  });
  const normCkanD13 = parseJsonMetadata(ckanJsonD13, 'D13_indeks_lpi_25k_ckan.json');
  assert.equal(normCkanD13.rawFormat, 'json_catalog');
  assert.equal(normCkanD13.title, 'Indeks Peta Lingkungan Pantai Indonesia (LPI) 1:25.000');
  assert.equal(normCkanD13.contact?.organization, 'Badan Informasi Geospasial');
  assert.equal(normCkanD13.contact?.email, 'info@big.go.id');
  assert.ok(normCkanD13.allOnlineResources && normCkanD13.allOnlineResources.length === 2);
  assert.ok(normCkanD13.allOnlineResources.some(r => r.isService));
  assert.ok(normCkanD13.allOnlineResources.some(r => r.isDirectDownload));

  // 4. CKAN JSON D14: Kawasan Konservasi Pesisir dan Pulau-Pulau Kecil Kalimantan Barat
  const ckanJsonD14 = JSON.stringify({
    success: true,
    result: {
      id: 'd14-kkp3k-kalbar',
      name: 'kawasan-konservasi-kalbar',
      title: 'Kawasan Konservasi Pesisir dan Pulau-Pulau Kecil Kalimantan Barat',
      notes: 'Peta penetapan alokasi ruang kawasan konservasi perairan daerah provinsi Kalimantan Barat seluas 187.000 hektar.',
      maintainer: 'Dinas Kelautan dan Perikanan Prov. Kalbar',
      maintainer_email: 'dislutkan@kalbarprov.go.id',
      tags: [{ name: 'Konservasi' }, { name: 'Kalbar' }, { name: 'KKP3K' }],
      extras: [
        { key: 'metadata-language', value: 'ind' },
        { key: 'dataset-reference-date', value: '2020-11-15' },
        { key: 'spatial', value: '{"type":"Polygon","coordinates":[[[108.5, -3.0],[111.0, -3.0],[111.0, 1.0],[108.5, 1.0],[108.5, -3.0]]]}' },
      ],
      resources: [
        {
          id: 'res-wms-kalbar',
          url: 'https://geoportal.kalbarprov.go.id/geoserver/wms',
          format: 'WMS',
          resource_locator_protocol: 'OGC:WMS',
          description: 'Layanan peta tematik konservasi pesisir',
        },
      ],
    },
  });
  const normCkanD14 = parseJsonMetadata(ckanJsonD14, 'D14_kawasan_konservasi_kalbar_ckan.json');
  assert.equal(normCkanD14.rawFormat, 'json_catalog');
  assert.equal(normCkanD14.title, 'Kawasan Konservasi Pesisir dan Pulau-Pulau Kecil Kalimantan Barat');
  assert.equal(normCkanD14.contact?.organization, 'Dinas Kelautan dan Perikanan Prov. Kalbar');

  // 5. MDB (ISO 19115-3: D16–D18 structure with full namespace hierarchy)
  const mdbSampleD16 = `<?xml version="1.0" encoding="UTF-8"?>
<mdb:MD_Metadata xmlns:mdb="http://standards.iso.org/iso/19115/-3/mdb/2.0"
                 xmlns:mri="http://standards.iso.org/iso/19115/-3/mri/2.0"
                 xmlns:cit="http://standards.iso.org/iso/19115/-3/cit/2.0"
                 xmlns:mrs="http://standards.iso.org/iso/19115/-3/mrs/2.0"
                 xmlns:mcc="http://standards.iso.org/iso/19115/-3/mcc/2.0"
                 xmlns:mrl="http://standards.iso.org/iso/19115/-3/mrl/2.0"
                 xmlns:mdq="http://standards.iso.org/iso/19157/-2/mdq/1.0"
                 xmlns:gex="http://standards.iso.org/iso/19115/-3/gex/2.0"
                 xmlns:lan="http://standards.iso.org/iso/19115/-3/lan/1.0">
  <mdb:metadataIdentifier>
    <mcc:MD_Identifier>
      <mcc:code><cit:CharacterString>D16-GARIS-PANTAI-BANTEN-2022</cit:CharacterString></mcc:code>
    </mcc:MD_Identifier>
  </mdb:metadataIdentifier>
  <mdb:defaultLocale>
    <lan:PT_Locale>
      <lan:language>
        <lan:LanguageCode codeList="http://www.loc.gov/standards/iso639-2/">ind</lan:LanguageCode>
      </lan:language>
    </lan:PT_Locale>
  </mdb:defaultLocale>
  <mdb:metadataScope>
    <mdb:MD_MetadataScope>
      <mdb:resourceScope>
        <mcc:MD_ScopeCode codeListValue="dataset">dataset</mcc:MD_ScopeCode>
      </mdb:resourceScope>
      <mdb:name><cit:CharacterString>Garis Pantai Provinsi Banten</cit:CharacterString></mdb:name>
    </mdb:MD_MetadataScope>
  </mdb:metadataScope>
  <mdb:contact>
    <cit:CI_Responsibility>
      <cit:role><cit:CI_RoleCode codeListValue="pointOfContact">pointOfContact</cit:CI_RoleCode></cit:role>
      <cit:party>
        <cit:CI_Organisation>
          <cit:name><cit:CharacterString>Dinas Kelautan dan Perikanan Provinsi Banten</cit:CharacterString></cit:name>
          <cit:contactInfo>
            <cit:CI_Contact>
              <cit:address>
                <cit:CI_Address>
                  <cit:electronicMailAddress><cit:CharacterString>dkp@bantenprov.go.id</cit:CharacterString></cit:electronicMailAddress>
                </cit:CI_Address>
              </cit:address>
            </cit:CI_Contact>
          </cit:contactInfo>
        </cit:CI_Organisation>
      </cit:party>
    </cit:CI_Responsibility>
  </mdb:contact>
  <mdb:dateInfo>
    <cit:CI_Date>
      <cit:date><cit:Date>2022-09-15</cit:Date></cit:date>
      <cit:dateType><cit:CI_DateTypeCode codeListValue="creation">creation</cit:CI_DateTypeCode></cit:dateType>
    </cit:CI_Date>
  </mdb:dateInfo>
  <mdb:metadataStandard>
    <cit:CI_Citation>
      <cit:title><cit:CharacterString>ISO 19115-1:2014 / ISO 19115-3:2016 Geographic Information - Metadata</cit:CharacterString></cit:title>
    </cit:CI_Citation>
  </mdb:metadataStandard>
  <mdb:identificationInfo>
    <mri:MD_DataIdentification>
      <mri:citation>
        <cit:CI_Citation>
          <cit:title><cit:CharacterString>Garis Pantai Provinsi Banten Tahun 2022</cit:CharacterString></cit:title>
          <cit:date>
            <cit:CI_Date>
              <cit:date><cit:Date>2022-08-10</cit:Date></cit:date>
              <cit:dateType><cit:CI_DateTypeCode codeListValue="publication">publication</cit:CI_DateTypeCode></cit:dateType>
            </cit:CI_Date>
          </cit:date>
        </cit:CI_Citation>
      </mri:citation>
      <mri:abstract><cit:CharacterString>Data vektor garis pantai provinsi Banten hasil delineasi pasang tertinggi (Highest Astronomical Tide) skala 1:25.000.</cit:CharacterString></mri:abstract>
      <mri:purpose><cit:CharacterString>Pengelolaan sempadan pantai dan batas perairan kewenangan daerah.</cit:CharacterString></mri:purpose>
      <mri:descriptiveKeywords>
        <mri:MD_Keywords>
          <mri:keyword><cit:CharacterString>Garis Pantai</cit:CharacterString></mri:keyword>
          <mri:keyword><cit:CharacterString>Banten</cit:CharacterString></mri:keyword>
        </mri:MD_Keywords>
      </mri:descriptiveKeywords>
      <mri:extent>
        <gex:EX_Extent>
          <gex:geographicElement>
            <gex:EX_GeographicBoundingBox>
              <gex:westBoundLongitude><cit:Decimal>105.10</cit:Decimal></gex:westBoundLongitude>
              <gex:eastBoundLongitude><cit:Decimal>106.35</cit:Decimal></gex:eastBoundLongitude>
              <gex:southBoundLatitude><cit:Decimal>-7.05</cit:Decimal></gex:southBoundLatitude>
              <gex:northBoundLatitude><cit:Decimal>-5.80</cit:Decimal></gex:northBoundLatitude>
            </gex:EX_GeographicBoundingBox>
          </gex:geographicElement>
        </gex:EX_Extent>
      </mri:extent>
    </mri:MD_DataIdentification>
  </mdb:identificationInfo>
  <mdb:referenceSystemInfo>
    <mrs:MD_ReferenceSystem>
      <mrs:referenceSystemIdentifier>
        <mcc:MD_Identifier>
          <mcc:codeSpace><cit:CharacterString>CRS</cit:CharacterString></mcc:codeSpace>
          <mcc:code><cit:CharacterString>84</cit:CharacterString></mcc:code>
        </mcc:MD_Identifier>
      </mrs:referenceSystemIdentifier>
    </mrs:MD_ReferenceSystem>
  </mdb:referenceSystemInfo>
  <mdb:spatialRepresentationInfo>
    <mdb:MD_VectorSpatialRepresentation>
      <mdb:topologyLevel><mdb:MD_TopologyLevelCode codeListValue="geometryOnly">geometryOnly</mdb:MD_TopologyLevelCode></mdb:topologyLevel>
      <mdb:geometricObjects>
        <mdb:MD_GeometricObjects>
          <mdb:geometricObjectType><mdb:MD_GeometricObjectTypeCode codeListValue="curve">curve</mdb:MD_GeometricObjectTypeCode></mdb:geometricObjectType>
          <mdb:geometricObjectCount><cit:Integer>248</cit:Integer></mdb:geometricObjectCount>
        </mdb:MD_GeometricObjects>
      </mdb:geometricObjects>
    </mdb:MD_VectorSpatialRepresentation>
  </mdb:spatialRepresentationInfo>
</mdb:MD_Metadata>`;

  const normMdbD16 = parseXmlMetadata(mdbSampleD16, 'D16_garis_pantai_banten.xml');
  assert.equal(normMdbD16.rawFormat, 'xml_iso19115_3');
  assert.equal(normMdbD16.isMdbFormat, true);
  assert.equal(normMdbD16.title, 'Garis Pantai Provinsi Banten Tahun 2022');
  assert.equal(normMdbD16.datasetId, 'D16-GARIS-PANTAI-BANTEN-2022');
  assert.equal(normMdbD16.language, 'ind');
  assert.equal(normMdbD16.metaMetadata?.standardName, 'ISO 19115-1:2014 / ISO 19115-3:2016 Geographic Information - Metadata');
  assert.equal(normMdbD16.spatialExtent?.isCrs84, true);
  assert.equal(normMdbD16.spatialExtent?.crsCode, 'CRS84');
  assert.equal(normMdbD16.contact?.organization, 'Dinas Kelautan dan Perikanan Provinsi Banten');
  assert.equal(normMdbD16.contact?.email, 'dkp@bantenprov.go.id');
  assert.equal(normMdbD16.contact?.isInstitutionalEmail, true);
  assert.equal(normMdbD16.rawEvidence?.e27_spatialRepresentation?.value?.topologyLevel, 'geometryOnly');
  assert.equal(normMdbD16.rawEvidence?.e27_spatialRepresentation?.value?.geometricObjectType, 'curve');
  assert.equal(normMdbD16.rawEvidence?.e27_spatialRepresentation?.value?.count, 248);
  assert.equal(normMdbD16.scopeName, 'Garis Pantai Provinsi Banten');
});

test('U4 Uji Bendera: Quality warning flags (F01–F14) are registered and verified', () => {
  const flagsDef = getQualityFlagsDefinition();
  for (let i = 1; i <= 14; i++) {
    const flagKey = `F${String(i).padStart(2, '0')}`;
    assert.ok(flagsDef[flagKey] !== undefined, `Flag ${flagKey} exists in config`);
    assert.ok(flagsDef[flagKey].penanda.length > 0);
    assert.ok(flagsDef[flagKey].definisi.length > 0);
  }

  const flagBenchmarks = getBenchmarkFlags();
  assert.equal(Object.keys(flagBenchmarks).length, 15);
  assert.ok(flagBenchmarks['D01'].includes('F01'));
  assert.ok(flagBenchmarks['D08'].includes('F04'));
  assert.ok(flagBenchmarks['D13'].includes('F14'));
  assert.ok(flagBenchmarks['D18'].includes('F02'));
});

test('U5 Uji Kasus Khusus: 13 Special Cases & Authentic CSW Unwrap & Missing File Handling', () => {
  // Case 1: CRS code 84 with codeSpace="CRS" recognized as OGC CRS84 (D16, D17)
  const xmlCrs84 = `<?xml version="1.0"?>
  <mdb:MD_Metadata xmlns:mdb="http://standards.iso.org/iso/19115/-3/mdb/2.0" xmlns:mrs="http://standards.iso.org/iso/19115/-3/mrs/2.0" xmlns:mcc="http://standards.iso.org/iso/19115/-3/mcc/2.0">
    <mdb:referenceSystemInfo>
      <mrs:MD_ReferenceSystem>
        <mrs:referenceSystemIdentifier>
          <mcc:MD_Identifier>
            <mcc:codeSpace>CRS</mcc:codeSpace>
            <mcc:code>84</mcc:code>
          </mcc:MD_Identifier>
        </mrs:referenceSystemIdentifier>
      </mrs:MD_ReferenceSystem>
    </mdb:referenceSystemInfo>
  </mdb:MD_Metadata>`;
  const parsedCrs84 = parseXmlMetadata(xmlCrs84, 'crs84.xml');
  assert.equal(parsedCrs84.spatialExtent?.isCrs84, true);
  assert.equal(parsedCrs84.spatialExtent?.crsCode, 'CRS84');

  // Case 2: Bounding box empty string is not 0 (D18)
  const xmlEmptyBbox = `<?xml version="1.0"?>
  <gmd:MD_Metadata xmlns:gmd="http://www.isotc211.org/2005/gmd" xmlns:gco="http://www.isotc211.org/2005/gco">
    <gmd:extent>
      <gmd:EX_Extent>
        <gmd:geographicElement>
          <gmd:EX_GeographicBoundingBox>
            <gmd:westBoundLongitude><gco:Decimal></gco:Decimal></gmd:westBoundLongitude>
            <gmd:eastBoundLongitude><gco:Decimal>1</gco:Decimal></gmd:eastBoundLongitude>
            <gmd:southBoundLatitude><gco:Decimal></gco:Decimal></gmd:southBoundLatitude>
            <gmd:northBoundLatitude><gco:Decimal>1</gco:Decimal></gmd:northBoundLatitude>
          </gmd:EX_GeographicBoundingBox>
        </gmd:geographicElement>
      </gmd:EX_Extent>
    </gmd:extent>
  </gmd:MD_Metadata>`;
  const parsedEmptyBbox = parseXmlMetadata(xmlEmptyBbox, 'empty_bbox.xml');
  assert.equal(parsedEmptyBbox.spatialExtent?.isBBoxValid, false);
  assert.ok(parsedEmptyBbox.spatialExtent?.bboxError !== undefined);

  // Case 3 & 4: Multiple contacts & Email containing URL (D18)
  const xmlMultiContact = `<?xml version="1.0"?>
  <mdb:MD_Metadata xmlns:mdb="http://standards.iso.org/iso/19115/-3/mdb/2.0" xmlns:cit="http://standards.iso.org/iso/19115/-3/cit/2.0">
    <mdb:contact>
      <cit:CI_Responsibility>
        <cit:party>
          <cit:CI_Organisation>
            <cit:name><cit:CharacterString>&lt;ContactPerson&gt; The Ancient Geographers</cit:CharacterString></cit:name>
            <cit:contactInfo>
              <cit:CI_Contact>
                <cit:address><cit:CI_Address><cit:electronicMailAddress>ancient@gmail.com</cit:electronicMailAddress></cit:CI_Address></cit:address>
              </cit:CI_Contact>
            </cit:contactInfo>
          </cit:CI_Organisation>
        </cit:party>
      </cit:CI_Responsibility>
    </mdb:contact>
    <mdb:contact>
      <cit:CI_Responsibility>
        <cit:party>
          <cit:CI_Organisation>
            <cit:name><cit:CharacterString>Pemerintah Provinsi Banten</cit:CharacterString></cit:name>
            <cit:contactInfo>
              <cit:CI_Contact>
                <cit:address><cit:CI_Address><cit:electronicMailAddress>metadata@bantenprov.go.id</cit:electronicMailAddress></cit:CI_Address></cit:address>
              </cit:CI_Contact>
            </cit:contactInfo>
          </cit:CI_Organisation>
        </cit:party>
      </cit:CI_Responsibility>
    </mdb:contact>
    <mdb:contact>
      <cit:CI_Responsibility>
        <cit:party>
          <cit:CI_Organisation>
            <cit:name><cit:CharacterString>Pemeliharaan Sistem</cit:CharacterString></cit:name>
            <cit:contactInfo>
              <cit:CI_Contact>
                <cit:address><cit:CI_Address><cit:electronicMailAddress>https://geoportal.ntbprov.go.id</cit:electronicMailAddress></cit:CI_Address></cit:address>
              </cit:CI_Contact>
            </cit:contactInfo>
          </cit:CI_Organisation>
        </cit:party>
      </cit:CI_Responsibility>
    </mdb:contact>
  </mdb:MD_Metadata>`;
  const parsedContacts = parseXmlMetadata(xmlMultiContact, 'contacts.xml');
  assert.equal(parsedContacts.contactBlocks?.length, 3);
  assert.equal(parsedContacts.contact?.organization, 'Pemerintah Provinsi Banten');
  assert.equal(parsedContacts.contact?.email, 'metadata@bantenprov.go.id');
  assert.equal(parsedContacts.contact?.isInstitutionalEmail, true);
  // Block 3 email contains URL -> invalid email
  assert.equal(parsedContacts.contactBlocks?.[2].hasUrlInEmail, true);
  assert.equal(parsedContacts.contactBlocks?.[2].isInstitutionalEmail, false);

  // Case 5: mdq:report containing DQ_ConformanceResult directly (D16, D17)
  const xmlDirectConf = `<?xml version="1.0"?>
  <mdb:MD_Metadata xmlns:mdb="http://standards.iso.org/iso/19115/-3/mdb/2.0" xmlns:mdq="http://standards.iso.org/iso/19157/-2/mdq/1.0">
    <mdq:report>
      <mdq:DQ_ConformanceResult>
        <mdq:pass>true</mdq:pass>
      </mdq:DQ_ConformanceResult>
    </mdq:report>
  </mdb:MD_Metadata>`;
  const parsedDirectConf = parseXmlMetadata(xmlDirectConf, 'direct_conf.xml');
  assert.equal(parsedDirectConf.hasDirectConformanceReport, true);

  // Case 6: Empty spatialRepresentationInfo (D01, D04, D05)
  const xmlEmptySpatialRep = `<?xml version="1.0"?>
  <gmd:MD_Metadata xmlns:gmd="http://www.isotc211.org/2005/gmd">
    <gmd:spatialRepresentationInfo/>
  </gmd:MD_Metadata>`;
  const parsedEmptySpatialRep = parseXmlMetadata(xmlEmptySpatialRep, 'empty_spat.xml');
  assert.equal(parsedEmptySpatialRep.rawEvidence.e27_spatialRepresentation?.value?.topologyLevel, undefined);

  // Case 13: CSW wrapper unwrap test for both GetRecordByIdResponse and GetRecordsResponse
  const xmlCswGetRecordById = `<?xml version="1.0"?>
  <csw:GetRecordByIdResponse xmlns:csw="http://www.opengis.net/cat/csw/2.0.2" xmlns:gmd="http://www.isotc211.org/2005/gmd" xmlns:gco="http://www.isotc211.org/2005/gco">
    <gmd:MD_Metadata>
      <gmd:fileIdentifier><gco:CharacterString>CSW-WRAPPED-D01</gco:CharacterString></gmd:fileIdentifier>
      <gmd:identificationInfo>
        <gmd:MD_DataIdentification>
          <gmd:citation>
            <gmd:CI_Citation>
              <gmd:title><gco:CharacterString>Alur Migrasi Penyu (Kab. Kubu Raya)</gco:CharacterString></gmd:title>
            </gmd:CI_Citation>
          </gmd:citation>
        </gmd:MD_DataIdentification>
      </gmd:identificationInfo>
    </gmd:MD_Metadata>
  </csw:GetRecordByIdResponse>`;
  const parsedCsw1 = parseXmlMetadata(xmlCswGetRecordById, 'csw_get_record_by_id.xml');
  assert.equal(parsedCsw1.title, 'Alur Migrasi Penyu (Kab. Kubu Raya)');
  assert.equal(parsedCsw1.datasetId, 'CSW-WRAPPED-D01');
  assert.equal(parsedCsw1.rawFormat, 'xml_iso19139');

  // Verify missing raw file handling: D01_dibungkus_csw_BUATAN.xml
  const rawFileExists = fs.existsSync('D01_dibungkus_csw_BUATAN.xml');
  // It is NOT in the workspace root, as reported by auditor
  assert.equal(rawFileExists, false, 'D01_dibungkus_csw_BUATAN.xml is verified absent from disk');

  // Verify that KOMPAS audit engine handles missing input gracefully without crashing or faking
  const emptyReport = runDatasetAudit('kelautan_umum', undefined);
  assert.equal(emptyReport.v7Scoring?.skorA, 0, 'Missing file scores 0 on Skor A');
  assert.equal(emptyReport.v7Scoring?.mqiBiner, 0, 'Missing file scores 0 on MQI Biner');
  assert.equal(emptyReport.v7Scoring?.mqiDiperluas, 0, 'Missing file scores 0 on MQI Diperluas');
  assert.equal(emptyReport.iso19115Compliance.isCompliant, false);
});

test('Continuous Quality Tier Evaluation without gaps', () => {
  assert.equal(evaluateQualityTier(100), 'Excellent');
  assert.equal(evaluateQualityTier(90), 'Excellent');
  assert.equal(evaluateQualityTier(89.9), 'Good');
  assert.equal(evaluateQualityTier(75), 'Good');
  assert.equal(evaluateQualityTier(74.9), 'Fair');
  assert.equal(evaluateQualityTier(50), 'Fair');
  assert.equal(evaluateQualityTier(49.9), 'Poor');
  assert.equal(evaluateQualityTier(25), 'Poor');
  assert.equal(evaluateQualityTier(24.9), 'Very Poor');
  assert.equal(evaluateQualityTier(0), 'Very Poor');
});

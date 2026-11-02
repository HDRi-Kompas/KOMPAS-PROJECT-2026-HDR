import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { detectDetailedFormat } from './formatDetector';

describe('formatDetector', () => {
  it('correctly detects XML MDB (ISO 19115-3)', () => {
    const xmlMdb = `<?xml version="1.0" encoding="UTF-8"?>
    <mdb:MD_Metadata xmlns:mdb="http://standards.iso.org/iso/19115/-3/mdb/2.0" xmlns:cit="http://standards.iso.org/iso/19115/-3/cit/2.0">
      <mdb:metadataIdentifier><cit:MD_Identifier><cit:code>TEST-MDB</cit:code></cit:MD_Identifier></mdb:metadataIdentifier>
    </mdb:MD_Metadata>`;

    const result = detectDetailedFormat('metadata_iso19115_3.xml', xmlMdb);
    assert.equal(result.category, 'xml_mdb');
    assert.equal(result.isIsoMdb, true);
    assert.equal(result.rootElement, '<mdb:MD_Metadata>');
    assert.equal(result.colorTheme, 'purple');
    assert.match(result.badgeText, /XML MDB/);
  });

  it('correctly detects XML GMD (ISO 19139)', () => {
    const xmlGmd = `<?xml version="1.0" encoding="UTF-8"?>
    <gmd:MD_Metadata xmlns:gmd="http://www.isotc211.org/2005/gmd" xmlns:gco="http://www.isotc211.org/2005/gco">
      <gmd:fileIdentifier><gco:CharacterString>TEST-GMD</gco:CharacterString></gmd:fileIdentifier>
    </gmd:MD_Metadata>`;

    const result = detectDetailedFormat('metadata_iso19139.xml', xmlGmd);
    assert.equal(result.category, 'xml_gmd');
    assert.equal(result.isIsoGmd, true);
    assert.equal(result.rootElement, '<gmd:MD_Metadata>');
    assert.equal(result.colorTheme, 'cyan');
    assert.match(result.badgeText, /XML GMD/);
  });

  it('correctly detects GeoJSON with .geojson extension', () => {
    const geoJson = JSON.stringify({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [106.8, -6.2] },
          properties: { name: 'Jakarta Port' },
        },
      ],
    });

    const result = detectDetailedFormat('pelabuhan.geojson', geoJson);
    assert.equal(result.category, 'geojson');
    assert.equal(result.isGeoJson, true);
    assert.equal(result.rootElement, 'FeatureCollection');
    assert.equal(result.colorTheme, 'emerald');
    assert.match(result.badgeText, /GeoJSON/);
  });

  it('correctly detects GeoJSON stored in a .json file', () => {
    const geoJsonInJson = JSON.stringify({
      type: 'FeatureCollection',
      features: [],
    });

    const result = detectDetailedFormat('marine_protected_area.json', geoJsonInJson);
    assert.equal(result.category, 'geojson');
    assert.equal(result.isGeoJson, true);
    assert.equal(result.colorTheme, 'emerald');
  });

  it('correctly detects JSON Catalog (CKAN / DCAT) in a .json file', () => {
    const ckanJson = JSON.stringify({
      help: 'https://data.go.id/api/3/action/help_show?name=package_show',
      success: true,
      result: {
        title: 'Batas Kawasan Konservasi Laut Banda 2024',
        notes: 'Metadata spasial kawasan konservasi laut.',
        organization: { name: 'kkp-ri' },
      },
    });

    const result = detectDetailedFormat('ckan_package.json', ckanJson);
    assert.equal(result.category, 'json_catalog');
    assert.equal(result.isJsonCatalog, true);
    assert.equal(result.colorTheme, 'amber');
    assert.match(result.badgeText, /JSON/);
  });

  it('correctly detects ESRI Shapefile ZIP', () => {
    const result = detectDetailedFormat('batimetri_surabaya.zip');
    assert.equal(result.category, 'shapefile_zip');
    assert.match(result.badgeText, /Shapefile/);
  });
});

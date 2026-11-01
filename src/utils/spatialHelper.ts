/**
 * KOMPAS - Spatial Data Resolution Utility
 * Menentukan validitas koordinat geografis dari AuditReport atau MetadataRecord.
 * Menjamin tidak membuat lokasi peta palsu jika informasi spasial tidak memadai.
 */

import { AuditReport } from '../types/audit';
import { MetadataRecord } from '../types/inventory';
import { SpatialExtentData } from '../components/OpenStreetMapViewer';

export function resolveSpatialFromReport(report: AuditReport): SpatialExtentData {
  // 1. Cek dari data spasial vektor (GeoJSON atau Shapefile ZIP)
  if (report.normalizedSpatialData && Array.isArray(report.normalizedSpatialData.bounds)) {
    const [minLon, minLat, maxLon, maxLat] = report.normalizedSpatialData.bounds;
    if (isValidBbox(minLon, minLat, maxLon, maxLat)) {
      return {
        hasAdequateSpatial: true,
        bounds: [minLon, minLat, maxLon, maxLat],
        sourceType: 'spatial_vector',
        crsName: report.normalizedSpatialData.crs?.name || 'WGS 84 (EPSG:4326)',
        geoJsonData: report.normalizedSpatialData.sampleFeatures?.length
          ? {
              type: 'FeatureCollection',
              features: report.normalizedSpatialData.sampleFeatures,
            }
          : null,
      };
    }
  }

  // 2. Cek dari dokumen metadata (XML ISO 19139 / Esri XML / JSON Katalog)
  const extent = report.normalizedMetadata?.spatialExtent;
  if (extent) {
    const { westBoundLongitude, southBoundLatitude, eastBoundLongitude, northBoundLatitude } = extent;
    if (
      westBoundLongitude !== undefined &&
      southBoundLatitude !== undefined &&
      eastBoundLongitude !== undefined &&
      northBoundLatitude !== undefined &&
      isValidBbox(westBoundLongitude, southBoundLatitude, eastBoundLongitude, northBoundLatitude)
    ) {
      return {
        hasAdequateSpatial: true,
        bounds: [westBoundLongitude, southBoundLatitude, eastBoundLongitude, northBoundLatitude],
        sourceType: 'metadata_bbox',
        crsName: extent.crsName || 'Geografis WGS 84 / EX_GeographicBoundingBox ISO 19115',
        geoJsonData: null,
      };
    }
  }

  // 3. Informasi spasial tidak memadai
  return {
    hasAdequateSpatial: false,
    bounds: null,
    sourceType: 'none',
    reasonIfNotAdequate:
      'Dokumen metadata tidak memuat elemen batas koordinat geografis (<gmd:EX_GeographicBoundingBox> / <bounding>) atau koordinat bernilai nol/tidak valid.',
  };
}

export function resolveSpatialFromRecord(record: MetadataRecord): SpatialExtentData {
  if (record.spatialBounds && Array.isArray(record.spatialBounds) && record.spatialBounds.length === 4) {
    const [w, s, e, n] = record.spatialBounds;
    if (isValidBbox(w, s, e, n)) {
      return {
        hasAdequateSpatial: true,
        bounds: [w, s, e, n],
        sourceType: record.hasSpatialData ? 'spatial_vector' : 'metadata_bbox',
        crsName: 'Geografis WGS 84 / SNI ISO 19115',
      };
    }
  }

  return {
    hasAdequateSpatial: false,
    bounds: null,
    sourceType: 'none',
    reasonIfNotAdequate:
      'Entri inventaris ini belum memiliki informasi koordinat cakupan spasial yang memadai.',
  };
}

function isValidBbox(w: number, s: number, e: number, n: number): boolean {
  if (isNaN(w) || isNaN(s) || isNaN(e) || isNaN(n)) return false;
  // Jangan terima jika semua koordinat tepat 0 (seringkali default placeholder)
  if (w === 0 && s === 0 && e === 0 && n === 0) return false;
  // Validitas rentang koordinat bumi
  if (w < -180 || e > 180 || s < -90 || n > 90) return false;
  if (w > e || s > n) return false;
  return true;
}

/**
 * KOMPAS - GeoJSON Spatial Data Parser & Structural Auditor
 */

import { NormalizedSpatialData } from '../types/audit';

export function parseGeoJson(geoJsonString: string, fileName = 'dataset.geojson'): NormalizedSpatialData {
  const warnings: string[] = [];
  const errors: string[] = [];
  let featureCount = 0;
  const geometryTypesSet = new Set<string>();
  let emptyGeometryCount = 0;
  let invalidCoordinateCount = 0;
  let ringClosureErrorsCount = 0;
  let duplicateIdCount = 0;
  const seenIds = new Set<string | number>();

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  const attributeStats: Record<string, { type: string; nullCount: number; distinct: Set<any>; samples: any[] }> = {};
  const sampleFeatures: any[] = [];

  let data: any = null;
  try {
    data = JSON.parse(geoJsonString);
  } catch (err: any) {
    errors.push(`Format GeoJSON tidak valid (JSON Parse Error): ${err?.message}`);
    return createEmptySpatial(fileName, new Blob([geoJsonString]).size, 'geojson', errors);
  }

  if (!data || typeof data !== 'object') {
    errors.push('GeoJSON harus berupa objek berstruktur standar RFC 7946.');
    return createEmptySpatial(fileName, new Blob([geoJsonString]).size, 'geojson', errors);
  }

  let features: any[] = [];
  if (data.type === 'FeatureCollection') {
    if (!Array.isArray(data.features)) {
      errors.push('FeatureCollection tidak memiliki array "features" yang valid.');
      return createEmptySpatial(fileName, new Blob([geoJsonString]).size, 'geojson', errors);
    }
    features = data.features;
  } else if (data.type === 'Feature') {
    features = [data];
  } else if (['Point', 'MultiPoint', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon', 'GeometryCollection'].includes(data.type)) {
    features = [{ type: 'Feature', geometry: data, properties: {} }];
    warnings.push(`File berisi geometri tunggal (${data.type}) tanpa pembungkus FeatureCollection.`);
  } else {
    errors.push(`Tipe objek GeoJSON tidak dikenali: "${data.type}". Diharapkan FeatureCollection atau Feature.`);
    return createEmptySpatial(fileName, new Blob([geoJsonString]).size, 'geojson', errors);
  }

  featureCount = features.length;
  if (featureCount === 0) {
    warnings.push('FeatureCollection tidak memiliki fitur spasial (0 fitur).');
  }

  // Detect CRS
  let crsName = 'WGS 84 (EPSG:4326)';
  let isWgs84 = true;
  if (data.crs) {
    if (data.crs.properties?.name) {
      crsName = data.crs.properties.name;
      if (!crsName.toLowerCase().includes('4326') && !crsName.toLowerCase().includes('crs84')) {
        isWgs84 = false;
        warnings.push(`CRS eksplisit dinyatakan sebagai "${crsName}". GeoJSON standar RFC 7946 merekomendasikan WGS 84.`);
      }
    }
  }

  // Inspect each feature
  features.forEach((feat, idx) => {
    if (idx < 5) sampleFeatures.push(feat);

    // ID check
    if (feat.id !== undefined && feat.id !== null) {
      if (seenIds.has(feat.id)) {
        duplicateIdCount++;
      } else {
        seenIds.add(feat.id);
      }
    }

    // Geometry check
    const geom = feat.geometry;
    if (!geom || !geom.coordinates || (Array.isArray(geom.coordinates) && geom.coordinates.length === 0)) {
      emptyGeometryCount++;
      return;
    }

    geometryTypesSet.add(geom.type || 'Unknown');

    // Coordinate verification helper
    function scanCoords(coords: any, isPolygonRing = false) {
      if (!Array.isArray(coords)) return;
      if (coords.length === 0) return;

      // Leaf position check [x, y, (z)]
      if (typeof coords[0] === 'number') {
        const x = coords[0];
        const y = coords[1];

        if (isNaN(x) || isNaN(y) || !isFinite(x) || !isFinite(y)) {
          invalidCoordinateCount++;
          return;
        }

        // Longitude / Latitude range check
        if (x < -180 || x > 180 || y < -90 || y > 90) {
          invalidCoordinateCount++;
        }

        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      } else {
        // Linear ring closure check for Polygons
        if (isPolygonRing && Array.isArray(coords[0]) && typeof coords[0][0] === 'number') {
          const first = coords[0];
          const last = coords[coords.length - 1];
          if (first[0] !== last[0] || first[1] !== last[1]) {
            ringClosureErrorsCount++;
          }
        }

        for (const child of coords) {
          scanCoords(child, geom.type === 'Polygon' || geom.type === 'MultiPolygon');
        }
      }
    }

    if (geom.type === 'Polygon') {
      if (Array.isArray(geom.coordinates)) {
        for (const ring of geom.coordinates) {
          scanCoords(ring, true);
        }
      }
    } else {
      scanCoords(geom.coordinates);
    }

    // Attribute structure check
    const props = feat.properties;
    if (props && typeof props === 'object') {
      for (const [k, v] of Object.entries(props)) {
        if (!attributeStats[k]) {
          attributeStats[k] = {
            type: typeof v,
            nullCount: 0,
            distinct: new Set(),
            samples: [],
          };
        }
        if (v === null || v === undefined || v === '') {
          attributeStats[k].nullCount++;
        } else {
          attributeStats[k].distinct.add(v);
          if (attributeStats[k].samples.length < 3) {
            attributeStats[k].samples.push(v);
          }
        }
      }
    }
  });

  const attributes = Object.entries(attributeStats).map(([name, stat]) => ({
    name,
    type: stat.type,
    nullCount: stat.nullCount,
    distinctCount: stat.distinct.size,
    sampleValues: stat.samples,
  }));

  const bounds: [number, number, number, number] = isFinite(minX) && isFinite(minY) && isFinite(maxX) && isFinite(maxY)
    ? [minX, minY, maxX, maxY]
    : [0, 0, 0, 0];

  return {
    fileName,
    format: 'geojson',
    fileSizeBytes: new Blob([geoJsonString]).size,
    featureCount,
    geometryTypes: Array.from(geometryTypesSet),
    emptyGeometryCount,
    invalidCoordinateCount,
    duplicateIdCount,
    ringClosureErrorsCount,
    bounds,
    crs: {
      name: crsName,
      isGeographicWgs84: isWgs84,
    },
    attributes,
    sampleFeatures,
    warnings,
    errors,
  };
}

function createEmptySpatial(
  fileName: string,
  size: number,
  format: 'geojson' | 'shapefile_zip',
  errors: string[]
): NormalizedSpatialData {
  return {
    fileName,
    format,
    fileSizeBytes: size,
    featureCount: 0,
    geometryTypes: [],
    emptyGeometryCount: 0,
    invalidCoordinateCount: 0,
    duplicateIdCount: 0,
    ringClosureErrorsCount: 0,
    bounds: [0, 0, 0, 0],
    crs: { name: 'Unknown', isGeographicWgs84: false },
    attributes: [],
    sampleFeatures: [],
    warnings: [],
    errors,
  };
}

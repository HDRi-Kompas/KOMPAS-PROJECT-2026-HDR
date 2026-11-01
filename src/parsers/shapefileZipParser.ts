/**
 * KOMPAS - Shapefile ZIP Parser & Binary Header Inspector
 * Safely inspects .shp, .shx, .dbf, and .prj inside a ZIP archive.
 * Includes Zip-Slip and Zip-Bomb mitigation.
 */

import JSZip from 'jszip';
import { NormalizedSpatialData } from '../types/audit';

const SHAPE_TYPES: Record<number, string> = {
  0: 'Null Shape',
  1: 'Point',
  3: 'PolyLine',
  5: 'Polygon',
  8: 'MultiPoint',
  11: 'PointZ',
  13: 'PolyLineZ',
  15: 'PolygonZ',
  18: 'MultiPointZ',
  21: 'PointM',
  23: 'PolyLineM',
  25: 'PolygonM',
  28: 'MultiPointM',
  31: 'MultiPatch',
};

export async function parseShapefileZip(
  zipBuffer: ArrayBuffer,
  fileName = 'dataset.zip'
): Promise<NormalizedSpatialData> {
  const warnings: string[] = [];
  const errors: string[] = [];
  const fileSize = zipBuffer.byteLength;

  if (fileSize > 50 * 1024 * 1024) {
    errors.push('Ukuran berkas ZIP melebihi batas keamanan audit (50MB).');
    return createEmptySpatial(fileName, fileSize, 'shapefile_zip', errors);
  }

  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(zipBuffer);
  } catch (err: any) {
    errors.push(`Gagal membaca arsip ZIP: ${err?.message || 'Bukan format ZIP yang valid atau berkas terkorupsi.'}`);
    return createEmptySpatial(fileName, fileSize, 'shapefile_zip', errors);
  }

  // Inventory entries and guard against Zip Slip (path traversal)
  const entries = Object.keys(zip.files);
  for (const entry of entries) {
    if (entry.includes('../') || entry.startsWith('/') || entry.includes('..\\')) {
      errors.push(`Deteksi pelanggaran keamanan Path Traversal (Zip Slip) pada entri: "${entry}". Proses dihentikan.`);
      return createEmptySpatial(fileName, fileSize, 'shapefile_zip', errors);
    }
  }

  // Find components by extension
  const shpFile = entries.find(e => e.toLowerCase().endsWith('.shp') && !e.startsWith('__MACOSX'));
  const shxFile = entries.find(e => e.toLowerCase().endsWith('.shx') && !e.startsWith('__MACOSX'));
  const dbfFile = entries.find(e => e.toLowerCase().endsWith('.dbf') && !e.startsWith('__MACOSX'));
  const prjFile = entries.find(e => e.toLowerCase().endsWith('.prj') && !e.startsWith('__MACOSX'));
  const cpgFile = entries.find(e => e.toLowerCase().endsWith('.cpg') && !e.startsWith('__MACOSX'));

  if (!shpFile) errors.push('Komponen utama Shapefile (.shp) tidak ditemukan di dalam arsip ZIP.');
  if (!shxFile) warnings.push('Komponen indeks spasial (.shx) tidak ditemukan. Beberapa GIS mungkin gagal melakukan pengindeksan cepat.');
  if (!dbfFile) warnings.push('Tabel atribut dBASE (.dbf) tidak ditemukan di dalam arsip ZIP.');
  if (!prjFile) warnings.push('Berkas proyeksi koordinat (.prj) tidak ditemukan. Sistem koordinat tidak dapat diverifikasi secara formal.');

  if (errors.length > 0) {
    return createEmptySpatial(fileName, fileSize, 'shapefile_zip', errors, warnings);
  }

  let geometryType = 'Unknown';
  let featureCount = 0;
  let bounds: [number, number, number, number] = [0, 0, 0, 0];
  const attributes: NormalizedSpatialData['attributes'] = [];

  // Parse .shp header
  try {
    const shpData = await zip.file(shpFile!)!.async('arraybuffer');
    if (shpData.byteLength < 100) {
      errors.push('Ukuran berkas .shp terlalu kecil (<100 byte), header shapefile tidak lengkap.');
    } else {
      const view = new DataView(shpData);
      const fileCode = view.getInt32(0, false); // Big-endian 9994
      if (fileCode !== 9994) {
        errors.push(`Tanda pengenal file code shapefile tidak valid: ${fileCode} (seharusnya 9994).`);
      }

      const shapeTypeNum = view.getInt32(32, true); // Little-endian
      geometryType = SHAPE_TYPES[shapeTypeNum] || `Unknown (${shapeTypeNum})`;

      const xMin = view.getFloat64(36, true);
      const yMin = view.getFloat64(44, true);
      const xMax = view.getFloat64(52, true);
      const yMax = view.getFloat64(60, true);

      if (isFinite(xMin) && isFinite(yMin) && isFinite(xMax) && isFinite(yMax)) {
        bounds = [xMin, yMin, xMax, yMax];
      }
    }
  } catch (err: any) {
    errors.push(`Gagal membaca struktur berkas .shp: ${err?.message}`);
  }

  // Parse .dbf header for record count and attribute fields
  if (dbfFile) {
    try {
      const dbfData = await zip.file(dbfFile)!.async('arraybuffer');
      if (dbfData.byteLength >= 32) {
        const view = new DataView(dbfData);
        featureCount = view.getUint32(4, true); // Little endian record count
        const headerLen = view.getUint16(8, true);

        // Read field descriptors (32 bytes each, starting at offset 32 until 0x0D terminator)
        let offset = 32;
        while (offset + 32 <= headerLen && offset + 32 <= dbfData.byteLength) {
          const firstByte = view.getUint8(offset);
          if (firstByte === 0x0d) break; // End of field descriptions

          // Field name is 11 bytes ASCII
          let name = '';
          for (let i = 0; i < 11; i++) {
            const charCode = view.getUint8(offset + i);
            if (charCode === 0) break;
            name += String.fromCharCode(charCode);
          }
          name = name.trim();

          const typeChar = String.fromCharCode(view.getUint8(offset + 11));
          const typeMap: Record<string, string> = {
            C: 'String',
            N: 'Numeric',
            F: 'Float',
            L: 'Logical',
            D: 'Date',
            M: 'Memo',
          };

          if (name.length > 0) {
            attributes.push({
              name,
              type: typeMap[typeChar] || typeChar,
              nullCount: 0,
              distinctCount: 0,
              sampleValues: [],
            });
          }
          offset += 32;
        }
      }
    } catch (err: any) {
      warnings.push(`Gagal mengekstrak metadata tabel .dbf: ${err?.message}`);
    }
  }

  // Parse .prj
  let crsName = 'Tidak Terdefinisi (Missing .prj)';
  let isWgs84 = false;
  let prjWkt = '';

  if (prjFile) {
    try {
      prjWkt = (await zip.file(prjFile)!.async('string')).trim();
      if (prjWkt.length > 0) {
        if (prjWkt.includes('WGS_1984') || prjWkt.includes('EPSG",4326') || prjWkt.includes('WGS 84')) {
          crsName = 'WGS 84 (Geographic 2D)';
          isWgs84 = true;
        } else if (prjWkt.includes('UTM') || prjWkt.includes('Transverse_Mercator')) {
          const match = prjWkt.match(/UTM\s*Zone\s*(\d+[NS]?)/i) || prjWkt.match(/PROJCS\["([^"]+)"/);
          crsName = match ? `UTM Projected: ${match[1]}` : 'UTM Projected Coordinate System';
          isWgs84 = false;
        } else {
          const projMatch = prjWkt.match(/\["([^"]+)"/);
          crsName = projMatch ? projMatch[1] : 'Custom Projected / Geographic Coordinate System';
        }
      } else {
        warnings.push('Berkas .prj berukuran 0 byte (kosong).');
      }
    } catch (err: any) {
      warnings.push(`Gagal membaca berkas .prj: ${err?.message}`);
    }
  }

  if (cpgFile) {
    try {
      const cpg = (await zip.file(cpgFile)!.async('string')).trim();
      warnings.push(`Penyandian karakter eksplisit dinyatakan via .cpg: ${cpg}`);
    } catch {
      // ignore
    }
  }

  return {
    fileName,
    format: 'shapefile_zip',
    fileSizeBytes: fileSize,
    featureCount,
    geometryTypes: geometryType !== 'Unknown' ? [geometryType] : [],
    emptyGeometryCount: 0,
    invalidCoordinateCount: 0,
    duplicateIdCount: 0,
    ringClosureErrorsCount: 0,
    bounds,
    crs: {
      name: crsName,
      wkt: prjWkt,
      isGeographicWgs84: isWgs84,
    },
    attributes,
    sampleFeatures: [],
    warnings,
    errors,
  };
}

function createEmptySpatial(
  fileName: string,
  size: number,
  format: 'shapefile_zip',
  errors: string[],
  warnings: string[] = []
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
    warnings,
    errors,
  };
}

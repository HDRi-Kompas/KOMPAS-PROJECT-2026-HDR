/**
 * KOMPAS - Cross-File Consistency Auditor
 * Compares metadata documentation against actual spatial dataset characteristics.
 */

import { ConsistencyAuditResult, NormalizedMetadata, NormalizedSpatialData } from '../types/audit';

export function auditConsistency(
  metadata: NormalizedMetadata,
  spatial: NormalizedSpatialData
): ConsistencyAuditResult {
  const discrepancies: string[] = [];
  const recommendations: string[] = [];
  let pointsEarned = 0;
  let maxPoints = 0;

  // 1. Title / Subject match
  let titleStatus: ConsistencyAuditResult['titleMatch']['status'] = 'unverified';
  let titleDetails = 'Tidak dapat diverifikasi secara otomatis.';
  maxPoints += 20;

  if (metadata.title && spatial.fileName) {
    const metaTitleWords = metadata.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const spatialNameWords = spatial.fileName.toLowerCase().replace(/[-_.]/g, ' ').split(/\s+/).filter(w => w.length > 3);

    const common = metaTitleWords.filter(w => spatialNameWords.some(sw => sw.includes(w) || w.includes(sw)));
    if (common.length >= 2 || metadata.title.toLowerCase().includes(spatial.fileName.toLowerCase().replace(/\.[^/.]+$/, ''))) {
      titleStatus = 'match';
      titleDetails = `Kesesuaian tinggi antara judul metadata ("${metadata.title}") dan berkas spasial ("${spatial.fileName}").`;
      pointsEarned += 20;
    } else if (common.length === 1) {
      titleStatus = 'partial';
      titleDetails = `Ditemukan kesamaan kata parsial (${common.join(', ')}).`;
      pointsEarned += 10;
      recommendations.push('Verifikasi apakah berkas metadata dan data spasial ini benar-benar merupakan pasangan dari survei yang sama.');
    } else {
      titleStatus = 'mismatch';
      titleDetails = `Judul metadata ("${metadata.title}") tidak memiliki kemiripan leksikal dengan nama berkas spasial ("${spatial.fileName}").`;
      discrepancies.push('Kemungkinan ketidaksesuaian pasangan: Judul metadata dan nama berkas data spasial tampak berbeda.');
      recommendations.push('Pastikan kedua berkas merujuk pada objek studi geospasial yang identik.');
    }
  }

  // 2. CRS Consistency
  let crsStatus: ConsistencyAuditResult['crsMatch']['status'] = 'unverified';
  let crsDetails = 'CRS tidak cukup terdokumentasi untuk diverifikasi.';
  maxPoints += 25;

  const metaCrs = (metadata.spatialExtent?.crsName || '').toLowerCase();
  const spatialCrs = (spatial.crs?.name || '').toLowerCase();

  if (metaCrs && spatialCrs && spatialCrs !== 'unknown') {
    const metaIsWgs84 = metaCrs.includes('4326') || metaCrs.includes('wgs') || metaCrs.includes('geographic');
    const spatialIsWgs84 = spatial.crs.isGeographicWgs84 || spatialCrs.includes('4326') || spatialCrs.includes('wgs');

    if (metaIsWgs84 && spatialIsWgs84) {
      crsStatus = 'match';
      crsDetails = `Keduanya konsisten menggunakan sistem koordinat WGS 84 (EPSG:4326).`;
      pointsEarned += 25;
    } else if (metaCrs.includes('utm') && spatialCrs.includes('utm')) {
      crsStatus = 'match';
      crsDetails = `Keduanya konsisten menggunakan sistem proyeksi UTM: Metadata ("${metadata.spatialExtent?.crsName}"), Spasial ("${spatial.crs.name}").`;
      pointsEarned += 25;
    } else if (metaIsWgs84 !== spatialIsWgs84) {
      crsStatus = 'mismatch';
      crsDetails = `Ketidaksinkronan CRS: Metadata menyatakan "${metadata.spatialExtent?.crsName || 'N/A'}", tetapi data spasial terdeteksi "${spatial.crs.name}".`;
      discrepancies.push(`Inkonsistensi CRS antara metadata (${metadata.spatialExtent?.crsName}) dan data spasial aktual (${spatial.crs.name}).`);
      recommendations.push('Perbarui metadata agar mencantumkan sistem proyeksi koordinat yang sesuai dengan berkas spasial (.prj / GeoJSON).');
    } else {
      crsStatus = 'partial';
      crsDetails = `Perlu peninjauan manual: Metadata="${metadata.spatialExtent?.crsName}", Spasial="${spatial.crs.name}".`;
      pointsEarned += 12;
    }
  }

  // 3. Bounding Box & Spatial Coverage
  let bboxStatus: ConsistencyAuditResult['bboxMatch']['status'] = 'unverified';
  let bboxDetails = 'Batas koordinat spasial tidak dapat dibandingkan.';
  let iou: number | undefined;
  maxPoints += 30;

  const mExt = metadata.spatialExtent;
  const sBbox = spatial.bounds; // [minX, minY, maxX, maxY]

  if (
    mExt &&
    mExt.westBoundLongitude !== undefined &&
    mExt.southBoundLatitude !== undefined &&
    mExt.eastBoundLongitude !== undefined &&
    mExt.northBoundLatitude !== undefined &&
    sBbox &&
    (sBbox[0] !== 0 || sBbox[2] !== 0)
  ) {
    const mW = mExt.westBoundLongitude;
    const mS = mExt.southBoundLatitude;
    const mE = mExt.eastBoundLongitude;
    const mN = mExt.northBoundLatitude;

    const sW = sBbox[0];
    const sS = sBbox[1];
    const sE = sBbox[2];
    const sN = sBbox[3];

    // Compute Intersection
    const interW = Math.max(mW, sW);
    const interS = Math.max(mS, sS);
    const interE = Math.min(mE, sE);
    const interN = Math.min(mN, sN);

    if (interW < interE && interS < interN) {
      const interArea = (interE - interW) * (interN - interS);
      const metaArea = (mE - mW) * (mN - mS);
      const spatialArea = (sE - sW) * (sN - sS);
      const unionArea = metaArea + spatialArea - interArea;
      iou = unionArea > 0 ? interArea / unionArea : 0;

      if (iou > 0.4 || (sW >= mW - 0.5 && sE <= mE + 0.5 && sS >= mS - 0.5 && sN <= mN + 0.5)) {
        bboxStatus = 'match';
        bboxDetails = `Batas geografis data spasial tercakup di dalam cakupan metadata (IoU: ${(iou * 100).toFixed(1)}%).`;
        pointsEarned += 30;
      } else {
        bboxStatus = 'partial';
        bboxDetails = `Cakupan beririsan sebagian (IoU: ${(iou * 100).toFixed(1)}%), namun terdapat deviasi batas yang cukup besar.`;
        pointsEarned += 15;
        discrepancies.push(`Batas spasial bergeser dari cakupan yang dicatat dalam metadata.`);
        recommendations.push('Hitung ulang bounding box aktual dari fitur spasial dan mutakhirkan elemen EX_GeographicBoundingBox di metadata.');
      }
    } else {
      bboxStatus = 'mismatch';
      bboxDetails = `Tidak ada irisan koordinat (Disjoint). Metadata: [${mW}, ${mS}, ${mE}, ${mN}], Data: [${sW.toFixed(2)}, ${sS.toFixed(2)}, ${sE.toFixed(2)}, ${sN.toFixed(2)}].`;
      discrepancies.push('Batas wilayah spasial pada metadata dan data spasial sama sekali tidak beririsan.');
      recommendations.push('Periksa apakah data spasial menggunakan sistem koordinat terproyeksi (meter) sementara metadata mencantumkan derajat desimal.');
    }
  }

  // 4. Geometry Type consistency
  let geomStatus: ConsistencyAuditResult['geometryTypeMatch']['status'] = 'unverified';
  let geomDetails = 'Tipe geometri tidak disebutkan dalam metadata.';
  maxPoints += 15;

  if (spatial.geometryTypes.length > 0) {
    const metaText = `${metadata.abstract || ''} ${metadata.title || ''} ${(metadata.keywords || []).join(' ')}`.toLowerCase();
    const spatialGeomStr = spatial.geometryTypes.join(', ').toLowerCase();

    const isPolygonData = spatialGeomStr.includes('polygon');
    const isLineData = spatialGeomStr.includes('line');
    const isPointData = spatialGeomStr.includes('point');

    const metaMentionsPolygon = /polygon|poligon|area|luasan|zonasi|kawasan/i.test(metaText);
    const metaMentionsLine = /garis|alur|jalur|koridor|rute|line|transect/i.test(metaText);
    const metaMentionsPoint = /titik|stasiun|point|sounding|posisi/i.test(metaText);

    if (
      (isPolygonData && metaMentionsPolygon) ||
      (isLineData && metaMentionsLine) ||
      (isPointData && metaMentionsPoint)
    ) {
      geomStatus = 'match';
      geomDetails = `Tipe geometri data (${spatial.geometryTypes.join(', ')}) selaras dengan deskripsi tematik metadata.`;
      pointsEarned += 15;
    } else {
      geomStatus = 'match';
      geomDetails = `Data spasial memuat tipe geometri: ${spatial.geometryTypes.join(', ')}.`;
      pointsEarned += 10;
    }
  }

  // 5. Feature count
  let featStatus: ConsistencyAuditResult['featureCountMatch']['status'] = 'unverified';
  let featDetails = `Data spasial memiliki ${spatial.featureCount} fitur. Metadata tidak menyebutkan jumlah fitur spesifik.`;
  maxPoints += 10;
  pointsEarned += 10; // Neutral credit when not stated

  const overallConsistencyScore = maxPoints > 0 ? Math.round((pointsEarned / maxPoints) * 100) : 0;

  return {
    isPaired: true,
    overallConsistencyScore,
    titleMatch: { status: titleStatus, details: titleDetails },
    crsMatch: { status: crsStatus, details: crsDetails },
    bboxMatch: { status: bboxStatus, details: bboxDetails, iou },
    featureCountMatch: { status: featStatus, details: featDetails },
    geometryTypeMatch: { status: geomStatus, details: geomDetails },
    dateMatch: { status: 'unverified', details: 'Tanggal fitur spasial tidak secara eksplisit diuji terhadap metadata.' },
    discrepancies,
    recommendations,
  };
}

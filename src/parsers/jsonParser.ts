/**
 * KOMPAS - JSON Metadata Parser (v7)
 * Comprehensive parser for CKAN JSON (package_show), DCAT, and open data catalog schemas.
 * Distinguishes missing vs null vs empty string vs empty array vs placeholder vs unparsed JSON string.
 */

import { isPlaceholderValue } from '../audit/validator';
import { NormalizedMetadata } from '../types/audit';

export function parseJsonMetadata(jsonString: string, fileName = 'metadata.json'): NormalizedMetadata {
  const warnings: string[] = [];
  const errors: string[] = [];
  const rawEvidence: NormalizedMetadata['rawEvidence'] = {};

  let data: any = null;
  try {
    data = JSON.parse(jsonString);
  } catch (err: any) {
    errors.push(`Format JSON tidak valid atau korup: ${err?.message}`);
    return {
      rawFormat: 'json_catalog',
      fileName,
      fileSizeBytes: new Blob([jsonString]).size,
      parsedAt: new Date().toISOString(),
      rawEvidence: {},
      parseWarnings: warnings,
      parseErrors: errors,
    };
  }

  // Handle standard CKAN wrapper: { help: ..., success: true, result: { ... } }
  if (data && typeof data === 'object' && data.result && typeof data.result === 'object') {
    data = data.result;
  }

  // If top-level is an array, take the first element if it's a catalog list
  if (Array.isArray(data)) {
    if (data.length === 0) {
      errors.push('Berkas JSON berisi array kosong ([]) tanpa objek metadata.');
      return {
        rawFormat: 'json_catalog',
        fileName,
        fileSizeBytes: new Blob([jsonString]).size,
        parsedAt: new Date().toISOString(),
        rawEvidence: {},
        parseWarnings: warnings,
        parseErrors: errors,
      };
    }
    warnings.push(`Berkas JSON berisi array berisi ${data.length} item katalog, memproses item pertama.`);
    data = data[0];
  }

  if (typeof data !== 'object' || data === null) {
    errors.push('Akar dokumen JSON harus berupa objek ({}), bukan nilai primitif.');
    return {
      rawFormat: 'json_catalog',
      fileName,
      fileSizeBytes: new Blob([jsonString]).size,
      parsedAt: new Date().toISOString(),
      rawEvidence: {},
      parseWarnings: warnings,
      parseErrors: errors,
    };
  }

  // Extract CKAN extras into a dictionary
  const extrasMap: Record<string, string> = {};
  if (Array.isArray(data.extras)) {
    for (const item of data.extras) {
      if (item && typeof item === 'object' && item.key) {
        extrasMap[item.key.toLowerCase()] = item.value !== undefined && item.value !== null ? String(item.value).trim() : '';
      }
    }
  } else if (data.extras && typeof data.extras === 'object') {
    for (const [k, v] of Object.entries(data.extras)) {
      extrasMap[k.toLowerCase()] = v !== undefined && v !== null ? String(v).trim() : '';
    }
  }

  // Deep search with state distinction
  function getProp(obj: any, candidates: string[]): { value: any; path: string; state: 'found' | 'null' | 'empty_str' | 'empty_arr' | 'empty_obj' | 'placeholder' | 'unparsed_json' } | null {
    if (!obj || typeof obj !== 'object') return null;

    for (const key of candidates) {
      if (key in obj) {
        const val = obj[key];
        const path = key;

        if (val === null) return { value: null, path, state: 'null' };
        if (typeof val === 'string') {
          const trimmed = val.trim();
          if (trimmed.length === 0) return { value: '', path, state: 'empty_str' };
          if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
            try {
              const unparsed = JSON.parse(trimmed);
              return { value: unparsed, path, state: 'unparsed_json' };
            } catch {
              // regular string
            }
          }
          if (isPlaceholderValue(trimmed)) return { value: val, path, state: 'placeholder' };
          return { value: val, path, state: 'found' };
        }
        if (Array.isArray(val)) {
          if (val.length === 0) return { value: val, path, state: 'empty_arr' };
          return { value: val, path, state: 'found' };
        }
        if (typeof val === 'object') {
          if (Object.keys(val).length === 0) return { value: val, path, state: 'empty_obj' };
          return { value: val, path, state: 'found' };
        }
        return { value: val, path, state: 'found' };
      }
    }

    // Recurse into nested objects
    for (const k of Object.keys(obj)) {
      if (typeof obj[k] === 'object' && obj[k] !== null && k !== 'extras' && k !== 'resources') {
        const nested = getProp(obj[k], candidates);
        if (nested) {
          return { ...nested, path: `${k}.${nested.path}` };
        }
      }
    }
    return null;
  }

  // 1. Title (E04)
  const titleProp = getProp(data, ['title', 'name', 'dataset_title', 'nama_dataset', 'judul']);
  let title: string | undefined;
  if (titleProp) {
    if (titleProp.state === 'placeholder' || titleProp.state === 'empty_str' || titleProp.state === 'null') {
      warnings.push(`Judul dataset terdeteksi berstatus ${titleProp.state} pada lintasan "${titleProp.path}".`);
    } else {
      title = String(titleProp.value);
    }
    rawEvidence.title = { value: titleProp.value, path: titleProp.path, isPlaceholder: titleProp.state === 'placeholder' };
  }

  // 2. Identifier (E06)
  const idProp = getProp(data, ['id', 'uuid', 'identifier', 'dataset_id', 'kode']);
  let datasetId: string | undefined = extrasMap['guid'] || (idProp && idProp.state === 'found' ? String(idProp.value) : undefined);
  if (datasetId) {
    rawEvidence.datasetId = { value: datasetId, path: idProp?.path || 'extras.guid', isPlaceholder: false };
  }

  // 3. Abstract (E07)
  const absProp = getProp(data, ['notes', 'description', 'abstract', 'ringkasan', 'deskripsi']);
  let abstract: string | undefined;
  if (absProp) {
    abstract = typeof absProp.value === 'string' ? absProp.value : undefined;
    rawEvidence.abstract = { value: absProp.value, path: absProp.path, isPlaceholder: absProp.state === 'placeholder' };
  }

  // 4. Purpose (E08) - CKAN typically doesn't have a distinct purpose field
  const purposeProp = getProp(data, ['purpose', 'tujuan', 'objective']);
  const purpose = typeof purposeProp?.value === 'string' ? purposeProp.value : undefined;

  // 5. Language (E01) - extras: metadata-language
  const metaLangExtra = extrasMap['metadata-language'] || extrasMap['language'] || extrasMap['data-language'];
  let language = metaLangExtra || (typeof data.language === 'string' ? data.language : undefined);
  if (language) {
    rawEvidence.language = { value: language, path: 'extras: metadata-language', isPlaceholder: isPlaceholderValue(language) };
  }

  // 6. Keywords (E09) - tags
  const keywords: string[] = [];
  if (Array.isArray(data.tags)) {
    for (const tag of data.tags) {
      if (typeof tag === 'string') keywords.push(tag);
      else if (tag && typeof tag === 'object' && tag.name) keywords.push(tag.name);
    }
  } else if (typeof data.tags === 'string') {
    keywords.push(...data.tags.split(',').map((s: string) => s.trim()).filter(Boolean));
  }

  // 7. Bounding box (E13) - extras: spatial or bbox
  let west: number | undefined;
  let east: number | undefined;
  let south: number | undefined;
  let north: number | undefined;
  let isBBoxValid = true;
  let bboxError: string | undefined;

  const rawSpatial = extrasMap['spatial'] || extrasMap['bbox'];
  if (rawSpatial) {
    try {
      const parsedGeo = JSON.parse(rawSpatial);
      if (parsedGeo.type === 'Polygon' && Array.isArray(parsedGeo.coordinates?.[0])) {
        const ring = parsedGeo.coordinates[0];
        const lons = ring.map((pt: any) => pt[0]);
        const lats = ring.map((pt: any) => pt[1]);
        west = Math.min(...lons);
        east = Math.max(...lons);
        south = Math.min(...lats);
        north = Math.max(...lats);
      } else if (Array.isArray(parsedGeo) && parsedGeo.length === 4) {
        west = parsedGeo[0];
        south = parsedGeo[1];
        east = parsedGeo[2];
        north = parsedGeo[3];
      }
    } catch {
      // not JSON polygon
    }
  }

  if (west === undefined && extrasMap['bbox-west-long']) {
    west = parseFloat(extrasMap['bbox-west-long']);
    east = parseFloat(extrasMap['bbox-east-long']);
    south = parseFloat(extrasMap['bbox-south-lat']);
    north = parseFloat(extrasMap['bbox-north-lat']);
  }

  if (west === undefined || east === undefined || south === undefined || north === undefined) {
    const bboxProp = getProp(data, ['bbox', 'spatial_extent', 'batas_wilayah', 'bounding_box']);
    if (bboxProp?.value) {
      const b = bboxProp.value;
      if (Array.isArray(b) && b.length === 4) {
        west = Number(b[0]);
        south = Number(b[1]);
        east = Number(b[2]);
        north = Number(b[3]);
      }
    }
  }

  if (west === undefined || east === undefined || south === undefined || north === undefined) {
    isBBoxValid = false;
    bboxError = 'Bounding box tidak ditemukan pada atribut spasial CKAN.';
  } else if (isNaN(west) || isNaN(east) || isNaN(south) || isNaN(north)) {
    isBBoxValid = false;
    bboxError = 'Koordinat bounding box bukan angka numerik valid.';
  } else if (west >= east || south >= north) {
    isBBoxValid = false;
    bboxError = 'Koordinat bounding box terbalik.';
  }

  // 8. CRS (E15) - extras: spatial-reference-system
  const crsExtra = extrasMap['spatial-reference-system'] || extrasMap['srs'] || extrasMap['crs'];
  const crsName = crsExtra || (typeof data.spatial_reference === 'string' ? data.spatial_reference : undefined);
  if (crsName) {
    rawEvidence.crs = { value: crsName, path: 'extras: spatial-reference-system', isPlaceholder: isPlaceholderValue(crsName) };
  }

  // 9. Contact (E19, E20) - extras: responsible-party, contact-email
  const respParty = extrasMap['responsible-party'] || data.organization?.title || data.organization?.name || data.author || data.maintainer;
  const contactEmail = extrasMap['contact-email'] || data.author_email || data.maintainer_email;
  const isEmailPh = isPlaceholderValue(contactEmail) || contactEmail === 'Belum Ada' || contactEmail === '-';

  const contactBlocks: {
    organization?: string;
    individualName?: string;
    role?: string;
    email?: string;
    phone?: string;
    address?: string;
    isPlaceholder?: boolean;
    hasUrlInEmail?: boolean;
    isInstitutionalEmail?: boolean;
  }[] = [];

  const isInstEmail = !!(contactEmail && !isEmailPh && !/@(gmail|yahoo|hotmail)\.com/i.test(contactEmail) && /\.(go\.id|ac\.id|mil\.id|gov)/i.test(contactEmail));

  contactBlocks.push({
    organization: respParty,
    individualName: data.author_name || data.maintainer,
    role: extrasMap['responsible-party.roles'] || 'publisher',
    email: isEmailPh ? undefined : contactEmail,
    isPlaceholder: isPlaceholderValue(respParty) || isEmailPh,
    hasUrlInEmail: !!(contactEmail && /https?:\/\//i.test(contactEmail)),
    isInstitutionalEmail: isInstEmail,
  });

  // 10. Dates (E05, E22)
  const refDate = extrasMap['dataset-reference-date'] || data.metadata_created;
  const metaDate = extrasMap['metadata-date'] || data.metadata_modified || data.metadata_created;

  // 11. Lineage (E24)
  const lineage = extrasMap['lineage'] || (typeof data.lineage === 'string' ? data.lineage : undefined);

  // 12. Resources (E03, E32) & Kurasi status (F14)
  const allOnlineResources: {
    url: string;
    protocol?: string;
    name?: string;
    description?: string;
    isService?: boolean;
    isDirectDownload?: boolean;
    isLocalPath?: boolean;
  }[] = [];

  let hasCurationRejection = false;
  if (Array.isArray(data.resources)) {
    for (const r of data.resources) {
      if (r && typeof r === 'object' && r.url) {
        const proto = r.resource_locator_protocol || r.protocol || r.format;
        const isSvc = /wms|wfs|csw|mapserver|featureserver/i.test(`${r.url} ${proto || ''}`);
        const isDl = /download|export|shape-zip|\.zip$|\.geojson$|\.json$|\.shp$|\.kml$|\.tif$/i.test(`${r.url} ${proto || ''}`) || /wfs|featureserver/i.test(`${r.url} ${proto || ''}`);

        allOnlineResources.push({
          url: r.url,
          protocol: proto,
          name: r.name,
          description: r.description,
          isService: isSvc,
          isDirectDownload: isDl,
          isLocalPath: false,
        });

        if (r.review_status === 'rejected' || /format data tidak sesuai|rejected/i.test(r.kurasi_notes_extra || '')) {
          hasCurationRejection = true;
        }
      }
    }
  }

  // 13. Scope (E28) - extras: resource-type
  const scopeCode = extrasMap['resource-type'] || 'dataset';

  return {
    rawFormat: 'json_catalog',
    fileName,
    fileSizeBytes: new Blob([jsonString]).size,
    parsedAt: new Date().toISOString(),
    title,
    datasetId,
    abstract,
    purpose,
    keywords,
    language,
    spatialExtent: {
      westBoundLongitude: isNaN(west as number) ? undefined : west,
      eastBoundLongitude: isNaN(east as number) ? undefined : east,
      southBoundLatitude: isNaN(south as number) ? undefined : south,
      northBoundLatitude: isNaN(north as number) ? undefined : north,
      crsName,
      isBBoxValid,
      bboxError,
    },
    temporalExtent: {
      publicationDate: refDate,
      revisionDate: metaDate,
    },
    contact: {
      organization: respParty,
      email: isEmailPh ? undefined : contactEmail,
      isPlaceholder: isPlaceholderValue(respParty) || isEmailPh,
      isInstitutionalEmail: isInstEmail,
    },
    contactBlocks,
    allOnlineResources,
    scopeCode,
    processing: {
      lineageStatement: lineage,
    },
    metaMetadata: {
      standardName: undefined, // CKAN records do not specify ISO metadata standard name
      metadataDate: metaDate,
    },
    rawEvidence,
    parseWarnings: warnings,
    parseErrors: errors,
  };
}

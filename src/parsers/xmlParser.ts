/**
 * KOMPAS - Metadata XML Parser (v7)
 * Strict, hierarchical path-based parser for ISO 19139 (gmd), ISO 19115-3 (mdb), Esri XML,
 * and CSW-wrapped responses (csw:GetRecordByIdResponse).
 *
 * Implements strict XML XPath/chain matching instead of loose first-match-anywhere,
 * verifies URI namespaces (not just prefixes), eliminates fabricated default values,
 * and handles the 13 special cases from real marine metadata.
 */

import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { isPlaceholderValue } from '../audit/validator';
import { NormalizedMetadata } from '../types/audit';
import { getOpenDecisions } from '../audit/configLoader';

// Helper to extract leaf scalar string/number/boolean from ISO wrapper structures
function extractLeafValue(node: any): any {
  if (node === null || node === undefined) return undefined;
  if (typeof node !== 'object') return typeof node === 'string' ? node.trim() : node;

  // Handle ISO 19139 / 19115-3 leaf wrappers
  if ('CharacterString' in node) return extractLeafValue(node.CharacterString);
  if ('LanguageCode' in node) {
    const lc = node.LanguageCode;
    return typeof lc === 'object' ? (lc['#text'] || lc['@_codeListValue'] || lc) : lc;
  }
  if ('CI_RoleCode' in node) {
    const rc = node.CI_RoleCode;
    return typeof rc === 'object' ? (rc['#text'] || rc['@_codeListValue'] || rc) : rc;
  }
  if ('MD_ScopeCode' in node) {
    const sc = node.MD_ScopeCode;
    return typeof sc === 'object' ? (sc['#text'] || sc['@_codeListValue'] || sc) : sc;
  }
  if ('MD_TopicCategoryCode' in node) {
    const tc = node.MD_TopicCategoryCode;
    return typeof tc === 'object' ? (tc['#text'] || tc['@_codeListValue'] || tc) : tc;
  }
  if ('MD_TopologyLevelCode' in node) {
    const tlc = node.MD_TopologyLevelCode;
    return typeof tlc === 'object' ? (tlc['#text'] || tlc['@_codeListValue'] || tlc) : tlc;
  }
  if ('MD_GeometricObjectTypeCode' in node) {
    const got = node.MD_GeometricObjectTypeCode;
    return typeof got === 'object' ? (got['#text'] || got['@_codeListValue'] || got) : got;
  }
  if ('CI_DateTypeCode' in node) {
    const dtc = node.CI_DateTypeCode;
    return typeof dtc === 'object' ? (dtc['#text'] || dtc['@_codeListValue'] || dtc) : dtc;
  }
  if (typeof node === 'object' && Object.keys(node).length === 0) {
    return '';
  }
  if ('URL' in node) return extractLeafValue(node.URL);
  if ('Date' in node) return extractLeafValue(node.Date);
  if ('DateTime' in node) return extractLeafValue(node.DateTime);
  if ('Decimal' in node) return extractLeafValue(node.Decimal);
  if ('Integer' in node) return extractLeafValue(node.Integer);
  if ('Boolean' in node) return extractLeafValue(node.Boolean);
  if ('#text' in node) return typeof node['#text'] === 'string' ? node['#text'].trim() : node['#text'];

  return typeof node === 'object' ? '' : node;
}

// Hierarchical path query: navigates down a strict list of parent-child tag steps
function getByPath(root: any, pathSteps: (string | string[])[]): any[] {
  if (!root) return [];
  let currentList: any[] = [root];

  for (const step of pathSteps) {
    const nextList: any[] = [];
    const stepNames = Array.isArray(step) ? step : [step];

    for (const item of currentList) {
      if (!item || typeof item !== 'object') continue;
      for (const name of stepNames) {
        if (name in item && item[name] !== undefined && item[name] !== null) {
          const val = item[name];
          if (Array.isArray(val)) {
            nextList.push(...val);
          } else {
            nextList.push(val);
          }
        }
      }
    }
    currentList = nextList;
    if (currentList.length === 0) break;
  }
  return currentList;
}

function getFirstByPath(root: any, pathSteps: (string | string[])[]): any | undefined {
  const matches = getByPath(root, pathSteps);
  return matches.length > 0 ? extractLeafValue(matches[0]) : undefined;
}

export function parseXmlMetadata(xmlString: string, fileName = 'metadata.xml'): NormalizedMetadata {
  const warnings: string[] = [];
  const errors: string[] = [];
  const rawEvidence: NormalizedMetadata['rawEvidence'] = {};
  const openDecisions = getOpenDecisions();

  // XXE Defense: Check for dangerous DOCTYPE / ENTITY declarations
  if (/<!DOCTYPE\b[^>]*<!ENTITY/i.test(xmlString) || /SYSTEM\s+["'][^"']+["']/i.test(xmlString)) {
    errors.push('Ditemukan deklarasi DTD/ENTITY eksternal yang berpotensi membahayakan (XXE protection). Penguraian entitas eksternal dinonaktifkan.');
  }

  // Validate XML syntax
  const validation = XMLValidator.validate(xmlString);
  if (validation !== true) {
    errors.push(`Gagal mengurai dokumen XML: ${validation.err?.msg || 'Sintaks XML tidak valid atau struktur tag rusak.'}`);
    return {
      rawFormat: 'unknown',
      fileName,
      fileSizeBytes: new Blob([xmlString]).size,
      parsedAt: new Date().toISOString(),
      rawEvidence: {},
      parseWarnings: warnings,
      parseErrors: errors,
    };
  }

  // Configure fast-xml-parser: strip namespace prefixes from tag names
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    removeNSPrefix: true,
    parseTagValue: true,
    trimValues: true,
  });

  let parsed: any = null;
  try {
    parsed = parser.parse(xmlString);
  } catch (err: any) {
    errors.push(`Gagal mengurai dokumen XML: ${err?.message || 'Sintaks XML tidak valid atau struktur tag rusak.'}`);
    return {
      rawFormat: 'unknown',
      fileName,
      fileSizeBytes: new Blob([xmlString]).size,
      parsedAt: new Date().toISOString(),
      rawEvidence: {},
      parseWarnings: warnings,
      parseErrors: errors,
    };
  }

  // Special Case 13: CSW wrapper unwrap (csw:GetRecordByIdResponse / csw:Record)
  let isCswWrapped = false;
  if (parsed?.GetRecordByIdResponse || parsed?.['csw:GetRecordByIdResponse']) {
    isCswWrapped = true;
    const cswWrapper = parsed.GetRecordByIdResponse || parsed['csw:GetRecordByIdResponse'];
    if (cswWrapper.MD_Metadata || cswWrapper['gmd:MD_Metadata'] || cswWrapper['mdb:MD_Metadata']) {
      parsed = cswWrapper.MD_Metadata || cswWrapper['gmd:MD_Metadata'] || cswWrapper['mdb:MD_Metadata'];
      warnings.push('Berkas XML terbungkus respons CSW (csw:GetRecordByIdResponse), berhasil diekstrak.');
    } else if (cswWrapper.Record) {
      parsed = cswWrapper.Record;
      warnings.push('Berkas XML terbungkus rekaman CSW (csw:Record), berhasil diekstrak.');
    }
  }

  // Namespace URI-based format detection (following Point 1 of feedback)
  const hasMdbUri = /xmlns(?::\w+)?=["']http:\/\/standards\.iso\.org\/iso\/19115\/-3\/mdb\/(?:1\.0|2\.0)["']/i.test(xmlString) ||
    /xmlns(?::\w+)?=["']http:\/\/standards\.iso\.org\/iso\/19115\/-3\//i.test(xmlString);
  const hasGmdUri = /xmlns(?::\w+)?=["']http:\/\/www\.isotc211\.org\/2005\/gmd["']/i.test(xmlString);
  const hasEsriStructure = !!(parsed?.metadata?.idinfo || parsed?.idinfo || /<idinfo\b/i.test(xmlString) || /<Esri\b/i.test(xmlString));

  const isMdb = hasMdbUri || (/<(\w+:)?MD_Metadata\b[^>]*xmlns:\w+=["']http:\/\/standards\.iso\.org\/iso\/19115\/-3/i.test(xmlString));
  const isIso19139 = hasGmdUri || (!isMdb && (/<(\w+:)?MD_Metadata\b/i.test(xmlString) || !!(parsed?.MD_Metadata || parsed?.['gmd:MD_Metadata'])));
  const isEsri = hasEsriStructure && !isMdb && !isIso19139;

  const rawFormat = isMdb ? 'xml_iso19115_3' : isIso19139 ? 'xml_iso19139' : isEsri ? 'xml_esri' : 'unknown';
  const xmlRootElement = isMdb ? 'mdb:MD_Metadata' : isIso19139 ? 'gmd:MD_Metadata' : isEsri ? 'esri_metadata' : 'other';

  if (rawFormat === 'unknown') {
    warnings.push('Format XML tidak secara langsung teridentifikasi sebagai ISO 19115-3 (mdb), ISO 19139 (gmd), maupun Esri Metadata standar.');
  }

  // Locate the actual document root node
  const root = parsed?.MD_Metadata || parsed?.metadata || parsed || {};

  // 1. Language (E01)
  // GMD: MD_Metadata > language > LanguageCode / CharacterString
  // MDB: MD_Metadata > defaultLocale > PT_Locale > language > LanguageCode
  // ESRI: metadata > mdLang > languageCode
  let language = getFirstByPath(root, ['defaultLocale', 'PT_Locale', 'language', 'LanguageCode']) ||
    getFirstByPath(root, ['defaultLocale', 'PT_Locale', 'language']) ||
    getFirstByPath(root, ['language', 'LanguageCode']) ||
    getFirstByPath(root, ['language']) ||
    getFirstByPath(root, ['mdLang', 'languageCode']);

  if (!language && isEsri) {
    language = getFirstByPath(root, ['metadata', 'mdLang', 'languageCode']);
  }
  if (language && typeof language === 'object') {
    language = language['#text'] || language['@_codeListValue'] || JSON.stringify(language);
  }
  rawEvidence.language = { value: language, path: 'language', isPlaceholder: false };

  // 2. Metadata Standard Name & Version (E02)
  // GMD: MD_Metadata > metadataStandardName, metadataStandardVersion
  // MDB: MD_Metadata > metadataStandard > CI_Citation > title, edition
  // NO fabricated defaults! (Point 2 of feedback)
  let standardName = getFirstByPath(root, ['metadataStandard', 'CI_Citation', 'title']) ||
    getFirstByPath(root, ['metadataStandardName']);
  let standardVersion = getFirstByPath(root, ['metadataStandard', 'CI_Citation', 'edition']) ||
    getFirstByPath(root, ['metadataStandardVersion']);

  // If not in XML, remains undefined (scores 0, no synthetic fill-in)
  rawEvidence.metadataStandardName = { value: standardName, path: 'metadataStandardName', isPlaceholder: isPlaceholderValue(standardName) };
  rawEvidence.metadataStandardVersion = { value: standardVersion, path: 'metadataStandardVersion', isPlaceholder: false };

  // 3. Online Resource Links (E03, E32)
  // GMD/MDB: MD_Metadata > distributionInfo > MD_Distribution > transferOptions > MD_DigitalTransferOptions > onLine > CI_OnlineResource
  // ESRI: Esri > DataProperties > itemProps > itemLocation
  const allOnlineResources: NormalizedMetadata['allOnlineResources'] = [];
  const onlineResourceNodes = getByPath(root, [
    ['distributionInfo', 'distInfo'],
    ['MD_Distribution', 'distributor'],
    ['transferOptions', 'distorTran'],
    ['MD_DigitalTransferOptions', 'onLineSrc'],
    ['onLine', 'onLineSrc'],
    ['CI_OnlineResource']
  ]);

  // Also check direct distributionInfo > onLine fallback if present
  if (onlineResourceNodes.length === 0) {
    const directOnline = getByPath(root, ['distributionInfo', 'transferOptions', 'MD_DigitalTransferOptions', 'onLine', 'CI_OnlineResource']);
    onlineResourceNodes.push(...directOnline);
  }

  for (const node of onlineResourceNodes) {
    const linkUrl = extractLeafValue(node.linkage) || extractLeafValue(node.URL);
    if (!linkUrl) continue;
    const proto = extractLeafValue(node.protocol) || '';
    const desc = extractLeafValue(node.description) || '';
    const name = extractLeafValue(node.name) || '';
    const appProfile = extractLeafValue(node.applicationProfile) || '';

    const isLocal = /^[a-zA-Z]:\\|^file:\/\//i.test(linkUrl);
    const isWfs = /wfs|featureserver/i.test(`${linkUrl} ${proto}`);
    const isWms = /wms|mapserver/i.test(`${linkUrl} ${proto}`);
    const isDirect = /download|getdata|\.zip$|\.geojson$|\.json$|\.tif$|\.kml$/i.test(linkUrl) || isWfs;
    const isSvc = isWfs || isWms || /wcs|csw|geoserver|arcgis\/rest\/services/i.test(`${linkUrl} ${proto}`);

    allOnlineResources.push({
      url: linkUrl,
      protocol: proto,
      description: desc,
      name,
      isDirectDownload: isDirect,
      isService: isSvc,
      isLocalPath: isLocal,
    });
  }

  // Fallback for ESRI XML online resource
  if (allOnlineResources.length === 0 && isEsri) {
    const esriLoc = getFirstByPath(root, ['Esri', 'DataProperties', 'itemProps', 'itemLocation']) ||
      getFirstByPath(root, ['metadata', 'Esri', 'DataProperties', 'itemProps', 'itemLocation']);
    if (esriLoc) {
      allOnlineResources.push({
        url: String(esriLoc),
        isDirectDownload: false,
        isService: false,
        isLocalPath: /^[a-zA-Z]:\\|^file:\/\//i.test(String(esriLoc)),
      });
    }
  }

  const primaryOnline = allOnlineResources[0];
  rawEvidence.onlineResource = { value: primaryOnline?.url, path: 'distributionInfo/.../onLine', isPlaceholder: false };

  // 4. Title (E04)
  // GMD: MD_Metadata > identificationInfo > MD_DataIdentification > citation > CI_Citation > title
  // MDB: MD_Metadata > identificationInfo > MD_DataIdentification > citation > CI_Citation > title
  // ESRI: metadata > idinfo > citation > citeinfo > title OR dataIdInfo > idCitation > resTitle
  let title = getFirstByPath(root, [
    'identificationInfo',
    ['MD_DataIdentification', 'SV_ServiceIdentification'],
    'citation',
    'CI_Citation',
    'title'
  ]);
  if (!title && isEsri) {
    title = getFirstByPath(root, ['idinfo', 'citation', 'citeinfo', 'title']) ||
      getFirstByPath(root, ['metadata', 'idinfo', 'citation', 'citeinfo', 'title']) ||
      getFirstByPath(root, ['dataIdInfo', 'idCitation', 'resTitle']) ||
      getFirstByPath(root, ['metadata', 'dataIdInfo', 'idCitation', 'resTitle']);
  }
  rawEvidence.title = { value: title, path: 'identificationInfo/.../title', isPlaceholder: isPlaceholderValue(title) };

  // 5. Citation Dates (E05)
  // Strictly navigate CI_Citation > date > CI_Date (NEVER fall back to dateStamp / metadata date!)
  const ciDateNodes = getByPath(root, [
    'identificationInfo',
    ['MD_DataIdentification', 'SV_ServiceIdentification'],
    'citation',
    'CI_Citation',
    'date',
    'CI_Date'
  ]);

  let pubDate: string | undefined;
  let createDate: string | undefined;
  let revDate: string | undefined;

  for (const dateNode of ciDateNodes) {
    const dVal = extractLeafValue(dateNode.date);
    const dType = (extractLeafValue(dateNode.dateType) || '').toLowerCase();
    if (!dVal) continue;
    const dateStr = String(dVal);
    if (dType.includes('publi')) pubDate = dateStr;
    else if (dType.includes('creat')) createDate = dateStr;
    else if (dType.includes('revis')) revDate = dateStr;
    else if (!pubDate) pubDate = dateStr;
  }

  // ESRI Dates
  if (!pubDate && !createDate && isEsri) {
    pubDate = getFirstByPath(root, ['idinfo', 'citation', 'citeinfo', 'pubdate']) ||
      getFirstByPath(root, ['metadata', 'idinfo', 'citation', 'citeinfo', 'pubdate']);
    createDate = getFirstByPath(root, ['Esri', 'CreaDate']) ||
      getFirstByPath(root, ['metadata', 'Esri', 'CreaDate']);
  }

  rawEvidence.publicationDate = { value: pubDate, path: 'citation/date[publication]', isPlaceholder: false };
  rawEvidence.creationDate = { value: createDate, path: 'citation/date[creation]', isPlaceholder: false };
  rawEvidence.revisionDate = { value: revDate, path: 'citation/date[revision]', isPlaceholder: false };

  // 6. Dataset Identifier (E06)
  // Strictly fileIdentifier, metadataIdentifier, or CI_Citation > identifier (NEVER CRS code!)
  let datasetId = getFirstByPath(root, ['fileIdentifier']) ||
    getFirstByPath(root, ['metadataIdentifier', 'MD_Identifier', 'code']) ||
    getFirstByPath(root, [
      'identificationInfo',
      ['MD_DataIdentification', 'SV_ServiceIdentification'],
      'citation',
      'CI_Citation',
      'identifier',
      'MD_Identifier',
      'code'
    ]);
  rawEvidence.fileIdentifier = { value: datasetId, path: 'fileIdentifier', isPlaceholder: false };

  // 7. Abstract (E07)
  let abstract = getFirstByPath(root, ['identificationInfo', ['MD_DataIdentification', 'SV_ServiceIdentification'], 'abstract']);
  if (!abstract && isEsri) {
    abstract = getFirstByPath(root, ['idinfo', 'descript', 'abstract']) ||
      getFirstByPath(root, ['metadata', 'idinfo', 'descript', 'abstract']) ||
      getFirstByPath(root, ['dataIdInfo', 'idAbs']) ||
      getFirstByPath(root, ['metadata', 'dataIdInfo', 'idAbs']);
  }
  rawEvidence.abstract = { value: abstract, path: 'identificationInfo/.../abstract', isPlaceholder: isPlaceholderValue(abstract) };

  // 8. Purpose (E08)
  let purpose = getFirstByPath(root, ['identificationInfo', ['MD_DataIdentification', 'SV_ServiceIdentification'], 'purpose']);
  if (!purpose && isEsri) {
    purpose = getFirstByPath(root, ['idinfo', 'descript', 'purpose']) ||
      getFirstByPath(root, ['metadata', 'idinfo', 'descript', 'purpose']) ||
      getFirstByPath(root, ['dataIdInfo', 'idPurp']) ||
      getFirstByPath(root, ['metadata', 'dataIdInfo', 'idPurp']);
  }
  rawEvidence.purpose = { value: purpose, path: 'identificationInfo/.../purpose', isPlaceholder: isPlaceholderValue(purpose) };

  // 9. Keywords (E09)
  const keywordsList: string[] = [];
  const keywordNodes = getByPath(root, [
    'identificationInfo',
    ['MD_DataIdentification', 'SV_ServiceIdentification'],
    'descriptiveKeywords',
    'MD_Keywords',
    'keyword'
  ]);
  for (const kwNode of keywordNodes) {
    const val = extractLeafValue(kwNode);
    if (typeof val === 'string' && val.trim()) {
      keywordsList.push(val.trim());
    }
  }
  if (keywordsList.length === 0 && isEsri) {
    const esriThemeKeys = getByPath(root, ['idinfo', 'keywords', 'theme', 'themekey']) ||
      getByPath(root, ['metadata', 'idinfo', 'keywords', 'theme', 'themekey']) ||
      getByPath(root, ['dataIdInfo', 'searchKeys', 'keyword']) ||
      getByPath(root, ['metadata', 'dataIdInfo', 'searchKeys', 'keyword']);
    for (const tk of esriThemeKeys) {
      const val = extractLeafValue(tk);
      if (typeof val === 'string' && val.trim()) keywordsList.push(val.trim());
    }
  }
  rawEvidence.keywords = { value: keywordsList, path: 'descriptiveKeywords', isPlaceholder: false };

  // 10. Topic Category (E10)
  const topicCategories: string[] = [];
  const topicNodes = getByPath(root, [
    'identificationInfo',
    ['MD_DataIdentification', 'SV_ServiceIdentification'],
    'topicCategory'
  ]);
  for (const tn of topicNodes) {
    const val = extractLeafValue(tn);
    if (typeof val === 'string' && val.trim()) topicCategories.push(val.trim().toLowerCase());
  }
  if (topicCategories.length === 0 && isEsri) {
    const esriTp = getFirstByPath(root, ['dataIdInfo', 'tpCat', 'TopicCatCd']) ||
      getFirstByPath(root, ['metadata', 'dataIdInfo', 'tpCat', 'TopicCatCd']);
    if (esriTp) topicCategories.push(String(esriTp).toLowerCase());
  }
  rawEvidence.topicCategory = { value: topicCategories, path: 'topicCategory', isPlaceholder: false };

  // 11. Resource Constraints / Licensing (E11)
  const constraintNodes = getByPath(root, [
    'identificationInfo',
    ['MD_DataIdentification', 'SV_ServiceIdentification'],
    'resourceConstraints'
  ]);
  const limitations: string[] = [];
  for (const cn of constraintNodes) {
    // Check useLimitation, accessConstraints, otherConstraints
    const useLim = getFirstByPath(cn, [['MD_Constraints', 'MD_LegalConstraints', 'MD_SecurityConstraints'], 'useLimitation']) ||
      getFirstByPath(cn, ['useLimitation']);
    if (useLim) limitations.push(String(useLim));
    const other = getFirstByPath(cn, [['MD_LegalConstraints', 'MD_Constraints'], 'otherConstraints']) ||
      getFirstByPath(cn, ['otherConstraints']);
    if (other) limitations.push(String(other));
  }
  if (limitations.length === 0 && isEsri) {
    const resConst = getFirstByPath(root, ['dataIdInfo', 'resConst', 'Consts', 'useLimit']) ||
      getFirstByPath(root, ['metadata', 'dataIdInfo', 'resConst', 'Consts', 'useLimit']) ||
      getFirstByPath(root, ['idinfo', 'useconst']) ||
      getFirstByPath(root, ['metadata', 'idinfo', 'useconst']);
    if (resConst) limitations.push(String(resConst));
  }
  rawEvidence.useConstraints = { value: limitations.join('; '), path: 'resourceConstraints', isPlaceholder: isPlaceholderValue(limitations.join(' ')) };

  // 12. Feature Catalogue / Attributes (E12, E31)
  const featCatDesc = getFirstByPath(root, ['contentInfo', 'MD_FeatureCatalogueDescription']);
  let featureCatFound = !!featCatDesc;
  let featureCatTitle: string | undefined;
  let e31ComplianceCode: boolean | undefined;
  let e31CitesKugi = false;

  if (featCatDesc) {
    const compCodeVal = extractLeafValue(featCatDesc.complianceCode);
    if (compCodeVal !== undefined) {
      e31ComplianceCode = compCodeVal === true || String(compCodeVal).toLowerCase() === 'true';
    }
    const catCitTitle = getFirstByPath(featCatDesc, ['featureCatalogueCitation', 'CI_Citation', 'title']);
    if (catCitTitle) {
      featureCatTitle = String(catCitTitle);
      // Special Case 9: KUGI check
      if (/katalog\s+unsur\s+geografi\s+indonesia|\bkugi\b/i.test(featureCatTitle)) {
        e31CitesKugi = true;
      }
    }
  }

  // 13. Bounding Box (E13) - Special Case 2: empty string is not 0
  let bboxNodes = getByPath(root, [
    'identificationInfo',
    ['MD_DataIdentification', 'SV_ServiceIdentification'],
    'extent',
    'EX_Extent',
    'geographicElement',
    'EX_GeographicBoundingBox'
  ]);
  if (bboxNodes.length === 0) {
    bboxNodes = getByPath(root, [
      'extent',
      'EX_Extent',
      'geographicElement',
      'EX_GeographicBoundingBox'
    ]);
  }

  let west: number | undefined;
  let east: number | undefined;
  let south: number | undefined;
  let north: number | undefined;
  let isBBoxValid = false;
  let bboxError: string | undefined;

  if (bboxNodes.length > 0) {
    const bboxNode = bboxNodes[0];
    const rawWest = extractLeafValue(bboxNode.westBoundLongitude);
    const rawEast = extractLeafValue(bboxNode.eastBoundLongitude);
    const rawSouth = extractLeafValue(bboxNode.southBoundLatitude);
    const rawNorth = extractLeafValue(bboxNode.northBoundLatitude);

    const strWest = rawWest !== undefined && rawWest !== null ? String(rawWest).trim() : '';
    const strEast = rawEast !== undefined && rawEast !== null ? String(rawEast).trim() : '';
    const strSouth = rawSouth !== undefined && rawSouth !== null ? String(rawSouth).trim() : '';
    const strNorth = rawNorth !== undefined && rawNorth !== null ? String(rawNorth).trim() : '';

    if (!strWest || !strEast || !strSouth || !strNorth) {
      isBBoxValid = false;
      bboxError = 'Koordinat bounding box tidak lengkap atau memuat string kosong (D18).';
    } else {
      west = parseFloat(strWest);
      east = parseFloat(strEast);
      south = parseFloat(strSouth);
      north = parseFloat(strNorth);

      if (isNaN(west) || isNaN(east) || isNaN(south) || isNaN(north)) {
        isBBoxValid = false;
        bboxError = 'Koordinat bounding box bukan angka numerik valid.';
      } else if (west === 0 && east === 0 && south === 0 && north === 0) {
        isBBoxValid = false;
        bboxError = 'Bounding box 0,0,0,0 (tidak informatif).';
      } else if (west >= east || south >= north) {
        isBBoxValid = false;
        bboxError = 'Koordinat bounding box terbalik (west >= east atau south >= north).';
      } else {
        isBBoxValid = true;
      }
    }
  } else if (isEsri) {
    const esriBounding = getFirstByPath(root, ['idinfo', 'spdom', 'bounding']) ||
      getFirstByPath(root, ['metadata', 'idinfo', 'spdom', 'bounding']) ||
      getFirstByPath(root, ['dataIdInfo', 'dataExt', 'geoEle', 'GeoBndBox']) ||
      getFirstByPath(root, ['metadata', 'dataIdInfo', 'dataExt', 'geoEle', 'GeoBndBox']);
    if (esriBounding) {
      const w = parseFloat(extractLeafValue(esriBounding.westbc || esriBounding.westBL) || '');
      const e = parseFloat(extractLeafValue(esriBounding.eastbc || esriBounding.eastBL) || '');
      const s = parseFloat(extractLeafValue(esriBounding.southbc || esriBounding.southBL) || '');
      const n = parseFloat(extractLeafValue(esriBounding.northbc || esriBounding.northBL) || '');
      if (!isNaN(w) && !isNaN(e) && !isNaN(s) && !isNaN(n) && w < e && s < n) {
        west = w; east = e; south = s; north = n;
        isBBoxValid = true;
      } else {
        isBBoxValid = false;
        bboxError = 'Koordinat bounding box ESRI tidak valid.';
      }
    } else {
      isBBoxValid = false;
      bboxError = 'Bounding box spasial tidak ditemukan dalam berkas metadata.';
    }
  } else {
    isBBoxValid = false;
    bboxError = 'Bounding box spasial tidak ditemukan dalam berkas metadata.';
  }

  rawEvidence.westBoundLongitude = { value: west, path: 'extent/EX_GeographicBoundingBox/westBoundLongitude', isPlaceholder: false };
  rawEvidence.eastBoundLongitude = { value: east, path: 'extent/EX_GeographicBoundingBox/eastBoundLongitude', isPlaceholder: false };
  rawEvidence.southBoundLatitude = { value: south, path: 'extent/EX_GeographicBoundingBox/southBoundLatitude', isPlaceholder: false };
  rawEvidence.northBoundLatitude = { value: north, path: 'extent/EX_GeographicBoundingBox/northBoundLatitude', isPlaceholder: false };

  // 14. Temporal Extent (E14)
  const tempExtentNode = getFirstByPath(root, [
    'identificationInfo',
    ['MD_DataIdentification', 'SV_ServiceIdentification'],
    'extent',
    'EX_Extent',
    'temporalElement',
    'EX_TemporalExtent',
    'extent'
  ]);
  const tempStart = getFirstByPath(tempExtentNode, [['TimePeriod', 'timePeriod'], 'beginPosition']) ||
    getFirstByPath(tempExtentNode, [['TimePeriod', 'timePeriod'], 'begin', 'TimeInstant', 'timePosition']);
  const tempEnd = getFirstByPath(tempExtentNode, [['TimePeriod', 'timePeriod'], 'endPosition']) ||
    getFirstByPath(tempExtentNode, [['TimePeriod', 'timePeriod'], 'end', 'TimeInstant', 'timePosition']);

  rawEvidence.temporalExtent = {
    value: tempStart ? `${tempStart} s.d ${tempEnd || 'sekarang'}` : undefined,
    path: 'temporalElement/EX_TemporalExtent',
    isPlaceholder: false,
  };

  // 15. Coordinate Reference System (E15) - Special Case 1: CRS 84 with codeSpace="CRS"
  const crsCodeVal = getFirstByPath(root, [
    'referenceSystemInfo',
    'MD_ReferenceSystem',
    'referenceSystemIdentifier',
    ['MD_Identifier', 'RS_Identifier'],
    'code'
  ]);
  const crsSpaceVal = getFirstByPath(root, [
    'referenceSystemInfo',
    'MD_ReferenceSystem',
    'referenceSystemIdentifier',
    ['MD_Identifier', 'RS_Identifier'],
    'codeSpace'
  ]);

  const isCrs84ByTree =
    String(crsSpaceVal || '').trim().toUpperCase() === 'CRS' &&
    String(crsCodeVal || '').trim() === '84';

  const isCrs84 =
    isCrs84ByTree ||
    /codeSpace=["']CRS["'][^>]*>84<|84<\/[^>]*>[\s\S]*?codeSpace=["']CRS["']/i.test(xmlString) ||
    /<(?:mcc:)?codeSpace>(?:<[^>]+>)*\s*CRS\s*(?:<\/[^>]+>)*<\/(?:mcc:)?codeSpace>[\s\S]*?<(?:mcc:)?code>(?:<[^>]+>)*\s*84\s*(?:<\/[^>]+>)*<\/(?:mcc:)?code>/i.test(xmlString) ||
    /<(?:mcc:)?code>(?:<[^>]+>)*\s*84\s*(?:<\/[^>]+>)*<\/(?:mcc:)?code>[\s\S]*?<(?:mcc:)?codeSpace>(?:<[^>]+>)*\s*CRS\s*(?:<\/[^>]+>)*<\/(?:mcc:)?codeSpace>/i.test(xmlString) ||
    /\bOGC:CRS84\b|\bCRS84\b/i.test(xmlString) ||
    /\bCRS84\b/i.test(String(crsCodeVal || ''));

  let crsVal: string | undefined;
  let crsCode: string | undefined;

  if (isCrs84) {
    crsVal = 'OGC:CRS84 (WGS 84)';
    crsCode = 'CRS84';
  } else if (crsCodeVal) {
    crsCode = String(crsCodeVal);
    crsVal = crsSpaceVal ? `${crsSpaceVal}:${crsCode}` : crsCode;
  } else {
    const epsgMatch = xmlString.match(/EPSG[:/]?\s*(\d{4,5})/i);
    if (epsgMatch) {
      crsCode = `EPSG:${epsgMatch[1]}`;
      crsVal = crsCode;
    }
  }

  rawEvidence.crs = { value: crsVal, path: 'referenceSystemInfo/.../code', isPlaceholder: false };

  // 16. Contacts (E19, E20, E21) - Multiple blocks evaluated with open decision strategy
  const contactBlocks: NonNullable<NormalizedMetadata['contactBlocks']> = [];
  const contactPartyNodes = [
    ...getByPath(root, ['contact', 'CI_ResponsibleParty']),
    ...getByPath(root, ['contact', 'CI_Responsibility']),
    ...getByPath(root, ['identificationInfo', ['MD_DataIdentification', 'SV_ServiceIdentification'], 'pointOfContact', 'CI_ResponsibleParty']),
    ...getByPath(root, ['identificationInfo', ['MD_DataIdentification', 'SV_ServiceIdentification'], 'pointOfContact', 'CI_Responsibility']),
  ];

  for (const cp of contactPartyNodes) {
    const org = getFirstByPath(cp, ['party', 'CI_Organisation', 'name']) ||
      getFirstByPath(cp, ['organisationName']) ||
      getFirstByPath(cp, ['party', 'name']);
    const ind = getFirstByPath(cp, ['party', 'CI_Individual', 'name']) ||
      getFirstByPath(cp, ['individualName']);
    const roleVal = getFirstByPath(cp, ['role', 'CI_RoleCode']) ||
      getFirstByPath(cp, ['role']);
    const email = getFirstByPath(cp, ['party', ['CI_Organisation', 'CI_Individual'], 'contactInfo', 'CI_Contact', 'address', 'CI_Address', 'electronicMailAddress']) ||
      getFirstByPath(cp, ['contactInfo', 'CI_Contact', 'address', 'CI_Address', 'electronicMailAddress']);

    const sOrg = typeof org === 'string' ? org.trim() : undefined;
    const sInd = typeof ind === 'string' ? ind.trim() : undefined;
    const sRole = typeof roleVal === 'string' ? roleVal.trim() : undefined;
    const sEmail = typeof email === 'string' ? email.trim() : undefined;

    // Special Case 4: Email containing URL
    const hasUrlEmail = !!(sEmail && /https?:\/\//i.test(sEmail));
    const isInst = !!(sEmail && !hasUrlEmail && !/@(gmail|yahoo|hotmail|outlook)\.com/i.test(sEmail) && /\.(go\.id|ac\.id|mil\.id|org\.id|gov)/i.test(sEmail));

    contactBlocks.push({
      organization: sOrg,
      individualName: sInd,
      role: sRole,
      email: sEmail,
      isPlaceholder: isPlaceholderValue(sOrg) || isPlaceholderValue(sEmail),
      hasUrlInEmail: hasUrlEmail,
      isInstitutionalEmail: isInst,
    });
  }

  // ESRI Contact fallback
  if (contactBlocks.length === 0 && isEsri) {
    const esriOrg = getFirstByPath(root, ['idinfo', 'ptcontac', 'cntinfo', 'cntorg']) ||
      getFirstByPath(root, ['idinfo', 'ptcontac', 'cntinfo', 'cntorgp', 'cntorg']) ||
      getFirstByPath(root, ['metadata', 'idinfo', 'ptcontac', 'cntinfo', 'cntorg']) ||
      getFirstByPath(root, ['metadata', 'idinfo', 'ptcontac', 'cntinfo', 'cntorgp', 'cntorg']) ||
      getFirstByPath(root, ['dataIdInfo', 'idPoC', 'rpOrgName']) ||
      getFirstByPath(root, ['metadata', 'dataIdInfo', 'idPoC', 'rpOrgName']);
    const esriEmail = getFirstByPath(root, ['idinfo', 'ptcontac', 'cntinfo', 'cntemail']) ||
      getFirstByPath(root, ['metadata', 'idinfo', 'ptcontac', 'cntinfo', 'cntemail']) ||
      getFirstByPath(root, ['dataIdInfo', 'idPoC', 'rpCntInfo', 'cntAddress', 'eMailAdd']) ||
      getFirstByPath(root, ['metadata', 'dataIdInfo', 'idPoC', 'rpCntInfo', 'cntAddress', 'eMailAdd']);
    const sEmail = typeof esriEmail === 'string' ? esriEmail.trim() : undefined;
    const isInst = !!(sEmail && !/https?:\/\//i.test(sEmail) && /\.(go\.id|ac\.id|mil\.id|org\.id|gov)/i.test(sEmail));
    contactBlocks.push({
      organization: typeof esriOrg === 'string' ? esriOrg.trim() : undefined,
      email: sEmail,
      isPlaceholder: isPlaceholderValue(esriOrg) || isPlaceholderValue(sEmail),
      hasUrlInEmail: !!(sEmail && /https?:\/\//i.test(sEmail)),
      isInstitutionalEmail: isInst,
    });
  }

  // Choose representative contact based on open decision strategy (Special Case 3)
  let primaryContact = contactBlocks[0] || {};
  if (openDecisions.contactBlockStrategy === 'best_block') {
    const bestBlock = contactBlocks.find(b => b.isInstitutionalEmail && b.organization && !b.isPlaceholder) ||
      contactBlocks.find(b => b.isInstitutionalEmail && !b.isPlaceholder) ||
      contactBlocks.find(b => b.organization && !b.isPlaceholder) ||
      contactBlocks[0];
    if (bestBlock) primaryContact = bestBlock;
  }

  rawEvidence.contactOrganization = { value: primaryContact.organization, path: 'contact/organisationName', isPlaceholder: isPlaceholderValue(primaryContact.organization) };
  rawEvidence.contactEmail = { value: primaryContact.email, path: 'contact/electronicMailAddress', isPlaceholder: isPlaceholderValue(primaryContact.email) };
  rawEvidence.contactRole = { value: primaryContact.role, path: 'contact/role', isPlaceholder: false };

  // 17. Metadata Timestamp (E22)
  // GMD: MD_Metadata > dateStamp
  // MDB: MD_Metadata > dateInfo > CI_Date > date
  // ESRI: metadata > mdDateSt
  let metaDate = getFirstByPath(root, ['dateInfo', 'CI_Date', 'date']) ||
    getFirstByPath(root, ['dateStamp']) ||
    getFirstByPath(root, ['mdDateSt']) ||
    getFirstByPath(root, ['metadata', 'mdDateSt']);
  rawEvidence.metadataDate = { value: metaDate, path: 'dateStamp', isPlaceholder: false };

  // 18. Lineage & Quality (E16, E17, E24, E25, E26)
  const lineage = getFirstByPath(root, ['resourceLineage', 'LI_Lineage', 'statement']) ||
    getFirstByPath(root, ['dataQualityInfo', 'DQ_DataQuality', 'lineage', 'LI_Lineage', 'statement']);
  const lineageSource = getFirstByPath(root, ['resourceLineage', 'LI_Lineage', 'source', 'LI_Source', 'description']) ||
    getFirstByPath(root, ['dataQualityInfo', 'DQ_DataQuality', 'lineage', 'LI_Lineage', 'source', 'LI_Source', 'description']);
  const lineageStep = getFirstByPath(root, ['resourceLineage', 'LI_Lineage', 'processStep', 'LI_ProcessStep', 'description']) ||
    getFirstByPath(root, ['dataQualityInfo', 'DQ_DataQuality', 'lineage', 'LI_Lineage', 'processStep', 'LI_ProcessStep', 'description']);

  rawEvidence.lineage = { value: lineage, path: 'resourceLineage/statement', isPlaceholder: isPlaceholderValue(lineage) };
  rawEvidence.source = { value: lineageSource, path: 'resourceLineage/source', isPlaceholder: isPlaceholderValue(lineageSource) };
  rawEvidence.processStep = { value: lineageStep, path: 'resourceLineage/processStep', isPlaceholder: isPlaceholderValue(lineageStep) };

  // Special Case 5: DQ_ConformanceResult directly under report
  const hasDirectConformance = /<mdq:report>[\s\S]*?<mdq:DQ_ConformanceResult>[\s\S]*?<\/mdq:report>/i.test(xmlString) ||
    getByPath(root, ['dataQualityInfo', 'DQ_DataQuality', 'report', 'DQ_ConformanceResult']).length > 0;

  // 19. Extension Elements E27–E32
  // E27: Spatial Representation
  let e27TopologyLevel: string | undefined;
  let e27GeometricObjectType: string | undefined;
  let e27GeometricObjectCount: number | undefined;

  const spatRepNodes = getByPath(root, ['spatialRepresentationInfo', 'MD_VectorSpatialRepresentation']);
  if (spatRepNodes.length > 0) {
    const sr = spatRepNodes[0];
    e27TopologyLevel = extractLeafValue(sr.topologyLevel);
    e27GeometricObjectType = getFirstByPath(sr, ['geometricObjects', 'MD_GeometricObjects', 'geometricObjectType']);
    const rawCnt = getFirstByPath(sr, ['geometricObjects', 'MD_GeometricObjects', 'geometricObjectCount']);
    if (rawCnt !== undefined && rawCnt !== null && rawCnt !== '') {
      e27GeometricObjectCount = parseInt(String(rawCnt), 10);
    }
  } else if (isEsri) {
    const esriSpatRep = getFirstByPath(root, ['spatRepInfo', 'VectSpatRep']) ||
      getFirstByPath(root, ['metadata', 'spatRepInfo', 'VectSpatRep']);
    if (esriSpatRep) {
      e27TopologyLevel = getFirstByPath(esriSpatRep, ['topLvl', 'TopoLevCd']);
      e27GeometricObjectType = getFirstByPath(esriSpatRep, ['geometObjs', 'geoObjTyp', 'GeoObjTypCd']);
      const cnt = getFirstByPath(esriSpatRep, ['geometObjs', 'geoObjCnt']);
      if (cnt !== undefined && cnt !== null) e27GeometricObjectCount = parseInt(String(cnt), 10);
    }
  }

  rawEvidence.e27_spatialRepresentation = {
    value: {
      topologyLevel: e27TopologyLevel,
      geometricObjectType: e27GeometricObjectType,
      geometricObjectCount: e27GeometricObjectCount,
      count: e27GeometricObjectCount,
    },
    path: 'spatialRepresentationInfo/MD_VectorSpatialRepresentation',
    isPlaceholder: false,
  };

  // E28: Metadata Scope
  let e28ScopeCode = getFirstByPath(root, ['metadataScope', 'MD_MetadataScope', 'resourceScope']) ||
    getFirstByPath(root, ['hierarchyLevel']);
  let e28ScopeName = getFirstByPath(root, ['metadataScope', 'MD_MetadataScope', 'name']) ||
    getFirstByPath(root, ['hierarchyLevelName']);

  if (!e28ScopeCode && isEsri) {
    e28ScopeCode = getFirstByPath(root, ['mdHrLv', 'ScopeCd']) ||
      getFirstByPath(root, ['metadata', 'mdHrLv', 'ScopeCd']);
    e28ScopeName = getFirstByPath(root, ['mdHrLvName']) ||
      getFirstByPath(root, ['metadata', 'mdHrLvName']);
  }

  rawEvidence.e28_metadataScope = {
    value: {
      scopeCode: e28ScopeCode,
      scopeName: e28ScopeName,
    },
    path: 'metadataScope/MD_MetadataScope',
    isPlaceholder: false,
  };

  // E29: Portrayal Catalogue
  const e29Title = getFirstByPath(root, [
    'portrayalCatalogueInfo',
    'MD_PortrayalCatalogueReference',
    'portrayalCatalogueCitation',
    'CI_Citation',
    'title'
  ]);
  const e29IsSpecificDoc = !!(e29Title && /sni|rsni|perka|peraturan|spesifikasi|iho\s*s-52/i.test(String(e29Title)));

  rawEvidence.e29_portrayalCatalogue = {
    value: { citation: e29Title, isSpecificDocument: e29IsSpecificDoc },
    path: 'portrayalCatalogueInfo/.../title',
    isPlaceholder: false,
  };

  // E30: Application Schema
  const e30SchemaName = getFirstByPath(root, ['applicationSchemaInfo', 'MD_ApplicationSchemaInformation', 'name']);
  const e30SchemaAscii = getFirstByPath(root, ['applicationSchemaInfo', 'MD_ApplicationSchemaInformation', 'schemaAscii']);

  rawEvidence.e30_applicationSchema = {
    value: { schemaName: e30SchemaName, documentationLink: e30SchemaAscii },
    path: 'applicationSchemaInfo/MD_ApplicationSchemaInformation',
    isPlaceholder: false,
  };

  // E31: KUGI
  rawEvidence.e31_kugiCompliance = {
    value: { complianceCode: e31ComplianceCode, citesKugi: e31CitesKugi },
    path: 'contentInfo/MD_FeatureCatalogueDescription',
    isPlaceholder: false,
  };

  // E32: Service Metadata
  rawEvidence.e32_serviceMetadata = {
    value: {
      hasServiceResource: allOnlineResources.some(r => r.isService),
      serviceUrl: allOnlineResources.find(r => r.isService)?.url,
      serviceDescription: allOnlineResources.find(r => r.isService)?.description,
    },
    path: 'distributionInfo/.../onLine',
    isPlaceholder: false,
  };

  return {
    rawFormat,
    fileName,
    fileSizeBytes: new Blob([xmlString]).size,
    parsedAt: new Date().toISOString(),
    isMdbFormat: isMdb,
    xmlRootElement,
    datasetId,
    title,
    abstract,
    purpose,
    keywords: keywordsList,
    topicCategory: topicCategories,
    language,
    spatialExtent: {
      westBoundLongitude: west,
      eastBoundLongitude: east,
      southBoundLatitude: south,
      northBoundLatitude: north,
      crsName: crsVal,
      crsCode,
      isBBoxValid,
      bboxError,
      isCrs84,
    },
    temporalExtent: {
      startDate: tempStart ? String(tempStart) : undefined,
      endDate: tempEnd ? String(tempEnd) : undefined,
      publicationDate: pubDate,
      creationDate: createDate,
      revisionDate: revDate,
    },
    distribution: {
      onlineResourceUrl: primaryOnline?.url,
    },
    contact: {
      organization: primaryContact.organization,
      individualName: primaryContact.individualName,
      role: primaryContact.role,
      email: primaryContact.email,
      hasUrlInEmail: primaryContact.hasUrlInEmail,
      isInstitutionalEmail: primaryContact.isInstitutionalEmail,
    },
    contactBlocks,
    allOnlineResources,
    scopeCode: e28ScopeCode,
    scopeName: e28ScopeName,
    hasDirectConformanceReport: hasDirectConformance,
    kugiCitationFound: e31CitesKugi,
    kugiComplianceCode: e31ComplianceCode,
    featureCatalogueFound: featureCatFound,
    featureCatalogueCitationTitle: featureCatTitle,
    accuracy: {},
    processing: {
      lineageStatement: lineage,
    },
    metaMetadata: {
      standardName,
      standardVersion,
      metadataDate: metaDate,
    },
    rawEvidence,
    parseWarnings: warnings,
    parseErrors: errors,
  };
}

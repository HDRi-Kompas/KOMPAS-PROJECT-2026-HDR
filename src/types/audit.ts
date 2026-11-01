/**
 * KOMPAS - Marine Geospatial Metadata Quality Index (MQI)
 * Core Type Definitions
 */

export type MQICategory =
  | 'CAT_GENERAL'         // 1. General information
  | 'CAT_IDENTIFICATION'  // 2. Identification information
  | 'CAT_DESCRIPTION'     // 3. Description
  | 'CAT_EXTENT'          // 4. Extent
  | 'CAT_ACCURACY'        // 5. Accuracy parameters
  | 'CAT_CONTACT'         // 6. Point of contact
  | 'CAT_METAMETADATA'    // 7. Meta-metadata
  | 'CAT_PROCESSING';     // 8. Processing information

export type AuditImportance = 'critical' | 'important' | 'supplementary';

export type AuditStatus =
  | 'terpenuhi'        // Satisfied / passed rule
  | 'tidak_terpenuhi'  // Missing required information
  | 'tidak_valid'      // Malformed / invalid value / placeholder
  | 'tidak_berlaku'    // Not applicable for dataset profile (excluded from denominator)
  | 'belum_diperiksa'  // Insufficient rule / unassessed
  | 'perlu_ditinjau';  // Needs human review / semantic ambiguity

export type DatasetProfileId =
  | 'batimetri'
  | 'terumbu_karang'
  | 'mangrove'
  | 'habitat_bentik'
  | 'arkeologi_maritim'
  | 'kawasan_konservasi'
  | 'jalur_migrasi'
  | 'kelautan_umum';

export interface DatasetProfile {
  id: DatasetProfileId;
  name: string;
  description: string;
  isJournalOriginal: boolean;
  requiredCategories: MQICategory[];
}

export type RuleSource = 'jurnal_hasara_2026' | 'adaptasi_kompas';

export interface ISO19115CoreElementCheck {
  code: string;
  name: string;
  nameId: string;
  isoTag: string;
  xmlPath: string;
  isMandatory: boolean;
  status: AuditStatus;
  valueFound?: any;
  details: string;
  ruleId?: string;
}

export interface ISO19115ComplianceReport {
  isCompliant: boolean;
  coreScore: number; // 0 - 100 percentage
  passedCount: number;
  totalCoreCount: number;
  statusLabel: string;
  summaryNotes: string;
  elements: ISO19115CoreElementCheck[];
  standardReference: string;
}

export interface AuditRule {
  id: string;
  elementId?: string; // E01 to E26
  name: string;
  definition: string;
  category: MQICategory;
  importance: AuditImportance;
  weight: number; // Critical = 3, Important = 2, Supplementary = 1
  source: RuleSource;
  expectedFormat: string;
  targetFields: string[];
  applicableProfiles: DatasetProfileId[] | 'all';
  iso19115Tag?: string;
  isIso19115Core?: boolean;
  isMandatoryInProfile: (profile: DatasetProfileId) => boolean;
  evaluate: (metadata: NormalizedMetadata, spatial?: NormalizedSpatialData) => EvaluationOutcome;
}

export interface EvaluationOutcome {
  status: AuditStatus;
  valueFound: any;
  sourcePath?: string;
  evidenceSnippet?: string;
  findingMessage?: string;
  recommendation?: string;
  technicalDetails?: string;
}

export interface ParameterAuditResult {
  ruleId: string;
  elementId?: string; // E01 to E26
  name: string;
  category: MQICategory;
  importance: AuditImportance;
  weight: number;
  source: RuleSource;
  status: AuditStatus;
  scoreContribution: number; // 1 * weight if satisfied, else 0
  valueFound: any;
  expectedFormat: string;
  iso19115Tag?: string;
  isIso19115Core?: boolean;
  sourcePath?: string;
  evidenceSnippet?: string;
  findingMessage?: string;
  recommendation?: string;
  technicalDetails?: string;
}

export interface CategorySummary {
  category: MQICategory;
  categoryName: string;
  totalParameters: number;
  applicableParameters: number;
  fulfilledParameters: number;
  scoreEarned: number;
  scoreMaxPossible: number;
  percentage: number;
}

export interface MQIScoreReport {
  originalScore: number | null; // Strict journal formula
  adaptedScore: number | null;  // KOMPAS adapted formula
  isProvisional: boolean;
  provisionalReasons: string[];
  numerator: number;
  denominator: number;
  totalRulesAssessed: number;
  statusCounts: Record<AuditStatus, number>;
  categorySummaries: CategorySummary[];
  complianceTier: 'Very Poor' | 'Poor' | 'Fair' | 'Good' | 'Excellent' | 'Unrated';
  methodologyVersion: string;
  rulesetVersion: string;
}

export interface ConsistencyAuditResult {
  isPaired: boolean;
  overallConsistencyScore: number; // 0 - 100
  titleMatch: { status: 'match' | 'partial' | 'mismatch' | 'unverified'; details: string };
  crsMatch: { status: 'match' | 'partial' | 'mismatch' | 'unverified'; details: string };
  bboxMatch: { status: 'match' | 'partial' | 'mismatch' | 'unverified'; details: string; iou?: number };
  featureCountMatch: { status: 'match' | 'mismatch' | 'unverified'; details: string };
  geometryTypeMatch: { status: 'match' | 'mismatch' | 'unverified'; details: string };
  dateMatch: { status: 'match' | 'mismatch' | 'unverified'; details: string };
  discrepancies: string[];
  recommendations: string[];
}

export interface ExtensionElementResult {
  elementId: 'E27' | 'E28' | 'E29' | 'E30' | 'E31' | 'E32';
  name: string;
  category: MQICategory;
  categoryName: string;
  mdbPath: string;
  description: string;
  scoreValue: number; // 0, 0.5, or 1
  maxScore: number;   // 1
  status: 'terpenuhi' | 'sebagian' | 'tidak_terpenuhi' | 'tidak_berlaku';
  isApplicable: boolean; // false if gmd:MD_Metadata, true if mdb:MD_Metadata
  ruleConditionSummary: string;
  valueFoundText: string;
  evidenceSnippet?: string;
  findingMessage?: string;
  recommendation?: string;
}

export interface Iso19115_3ReadinessReport {
  isApplicable: boolean; // true if mdb:MD_Metadata, false if gmd:MD_Metadata
  rootElementDetected: 'mdb:MD_Metadata' | 'gmd:MD_Metadata' | 'other';
  scorePercentage: number | null; // e.g. 83.3 or null if N/A
  totalPointsEarned: number | null; // sum of 0, 0.5, 1 across 6 elements
  maxPoints: number; // 6
  statusLabel: string; // 'Sangat Siap' | 'Sebagian Siap' | 'Perlu Pemenuhan' | 'N/A (Format gmd)'
  elements: ExtensionElementResult[]; // List 2 (E27–E32)
}

export interface NormalizedMetadata {
  rawFormat: 'xml_iso19139' | 'xml_iso19115_3' | 'xml_esri' | 'json_catalog' | 'unknown';
  xmlRootElement?: 'mdb:MD_Metadata' | 'gmd:MD_Metadata' | 'esri_metadata' | 'other';
  isMdbFormat?: boolean;
  fileName: string;
  fileSizeBytes: number;
  parsedAt: string;

  // General & Identification
  title?: string;
  alternateTitle?: string;
  datasetId?: string;
  abstract?: string;
  purpose?: string;
  keywords?: string[];
  language?: string;
  topicCategory?: string[];

  // Extent
  spatialExtent?: {
    westBoundLongitude?: number;
    eastBoundLongitude?: number;
    southBoundLatitude?: number;
    northBoundLatitude?: number;
    crsName?: string;
    crsCode?: string;
    datum?: string;
    projection?: string;
    isBBoxValid?: boolean;
    bboxError?: string;
    isCrs84?: boolean;
    rawBboxValues?: { west?: any; east?: any; south?: any; north?: any };
  };
  temporalExtent?: {
    startDate?: string;
    endDate?: string;
    publicationDate?: string;
    creationDate?: string;
    revisionDate?: string;
  };

  // Point of Contact
  contact?: {
    organization?: string;
    individualName?: string;
    role?: string;
    email?: string;
    phone?: string;
    address?: string;
    isPlaceholder?: boolean;
    hasUrlInEmail?: boolean;
    isInstitutionalEmail?: boolean;
  };

  contactBlocks?: {
    organization?: string;
    individualName?: string;
    role?: string;
    email?: string;
    phone?: string;
    address?: string;
    isPlaceholder?: boolean;
    hasUrlInEmail?: boolean;
    isInstitutionalEmail?: boolean;
  }[];

  allOnlineResources?: {
    url: string;
    protocol?: string;
    name?: string;
    description?: string;
    isService?: boolean;
    isDirectDownload?: boolean;
    isLocalPath?: boolean;
  }[];

  scopeCode?: string;
  scopeName?: string;
  hasDirectConformanceReport?: boolean;
  kugiCitationFound?: boolean;
  kugiComplianceCode?: boolean;
  featureCatalogueFound?: boolean;
  featureCatalogueCitationTitle?: string;

  // Accuracy (Bathymetric & Marine)
  accuracy?: {
    totalVerticalUncertainty?: string | number;
    totalHorizontalUncertainty?: string | number;
    totalPropagatedUncertainty?: string | number;
    positionalAccuracy?: string | number;
    verticalDatum?: string;
    depthRange?: { min?: number; max?: number };
    soundVelocityCorrected?: boolean;
    tideCorrected?: boolean;
    sensorType?: string;
    calibrationDate?: string;
    surveyEquipment?: string;
  };

  // Processing & Lineage
  processing?: {
    lineageStatement?: string;
    processingSteps?: string[];
    softwareUsed?: string;
    sourceDatasets?: string[];
  };

  // Distribution
  distribution?: {
    format?: string;
    accessConstraints?: string;
    useConstraints?: string;
    onlineResourceUrl?: string;
    distributorContact?: string;
  };

  // Meta-Metadata
  metaMetadata?: {
    standardName?: string;
    standardVersion?: string;
    metadataDate?: string;
    metadataContact?: string;
    metadataLanguage?: string;
  };

  // Raw provenance map for evidence tracking
  rawEvidence: Record<string, { value: any; path: string; isPlaceholder: boolean }>;
  parseWarnings: string[];
  parseErrors: string[];
}

export interface NormalizedSpatialData {
  fileName: string;
  format: 'geojson' | 'shapefile_zip';
  fileSizeBytes: number;
  featureCount: number;
  geometryTypes: string[];
  emptyGeometryCount: number;
  invalidCoordinateCount: number;
  duplicateIdCount: number;
  ringClosureErrorsCount: number;
  bounds: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
  crs: {
    name: string;
    code?: string;
    wkt?: string;
    isGeographicWgs84: boolean;
  };
  attributes: {
    name: string;
    type: string;
    nullCount: number;
    distinctCount: number;
    sampleValues: any[];
  }[];
  sampleFeatures: any[];
  warnings: string[];
  errors: string[];
}

export interface AuditReport {
  id: string;
  timestamp: string;
  datasetName: string;
  profileId: DatasetProfileId;
  metadataFile?: { name: string; size: number; format: string };
  spatialFile?: { name: string; size: number; format: string };
  normalizedMetadata?: NormalizedMetadata;
  normalizedSpatialData?: NormalizedSpatialData;
  scoreReport: MQIScoreReport;
  iso19115Compliance: ISO19115ComplianceReport;
  parameterResults: ParameterAuditResult[];
  coreElementsResults?: ParameterAuditResult[]; // List 1: Skor Inti MQI (E01-E26)
  coreScoreMqi?: number; // Skor Inti MQI dari 26 elemen
  extensionElementsResults?: ExtensionElementResult[]; // List 2: Skor Ekstensi ISO 19115-3 (E27-E32)
  extensionScorePercentage?: number | null; // Persentase skor ekstensi (0-100) atau null jika N/A
  iso19115_3Readiness?: Iso19115_3ReadinessReport; // Laporan Kesiapan ISO 19115-3
  consistencyResult?: ConsistencyAuditResult;
  bigNo3Compliance?: import('./inventory').BIGNo3ComplianceReport;
  spatialFindings?: {
    severity: 'critical' | 'warning' | 'info';
    title: string;
    description: string;
    remediation: string;
  }[];
  // V7 Data Audit specifications
  v7Scoring?: import('../audit/v7Scoring').V7ScoreResult;
  ruleVersion?: string;
  qualityFlags?: import('../audit/flags').QualityFlagResult[];
  manualOverrides?: Record<string, { value: number; notes: string; auditorName?: string; updatedAt: string }>;
  auditorNotes?: string;
  statusSkema?: 'gmd' | 'mdb' | 'ESRI' | 'CKAN' | 'unknown';
  elementValuesV7?: Record<string, number>;
}

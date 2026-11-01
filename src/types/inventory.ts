/**
 * KOMPAS - Inventory & Audit History Data Models
 * Aligned with Peraturan BIG No. 3 Tahun 2023 and ISO 19115
 */

import {
  AuditReport,
  AuditStatus,
  DatasetProfileId,
  ISO19115ComplianceReport,
} from './audit';

export type FileProcessingStatus = 'pending' | 'valid' | 'invalid' | 'error' | 'audited';

export interface BIGNo3ComplianceReport {
  isCompliant: boolean;
  standardCategory: 'SNI 8843-1:2019' | 'SNI ISO 19115-3:2021' | 'SNI ISO 19115:2012 (Transisi)' | 'Non-Standar';
  statusLabel: string;
  transitionDeadline: string; // '26 Mei 2025'
  isWithinTransitionPeriod: boolean;
  legalBasis: string; // 'Peraturan Badan Informasi Geospasial Nomor 3 Tahun 2023'
  mandatoryRulesChecked: {
    code: string;
    title: string;
    legalBasis: string;
    status: AuditStatus;
    details: string;
  }[];
  notes: string;
}

export interface MetadataRecord {
  id: string; // Unique ID (UUID)
  inventoryNumber: string; // Sequential identifier, e.g., 'INV-2024-001'
  title: string;
  sourceFileName: string;
  fileFormat: string; // 'XML (ISO 19139)', 'XML (Esri)', 'JSON Katalog', 'GeoJSON', 'Shapefile ZIP'
  fileSizeBytes: number;
  fileChecksum: string; // SHA-256 hash
  datasetCategory: DatasetProfileId;
  metadataDate: string | null;
  uploadDate: string; // ISO 8601 string
  lastAuditedAt: string | null;
  latestAuditStatus: 'Lolos Penuh' | 'Lolos Bersyarat' | 'Perlu Perbaikan' | 'Belum Diaudit' | 'Gagal';
  latestMqiScore: number | null;
  latestIsoCoreScore: number | null;
  latestBigCompliance: 'Sesuai' | 'Perlu Penyesuaian (Transisi)' | 'Tidak Sesuai' | 'Belum Diaudit';
  latestStatusCounts: Record<AuditStatus, number> | null;
  latestAuditRunId: string | null;
  hasSpatialData: boolean;
  spatialBounds: [number, number, number, number] | null; // [west, south, east, north]
  totalRunsCount: number;
  rawContentSnippet?: string;
  notes?: string;
}

export interface MetadataVersion {
  id: string;
  metadataRecordId: string;
  versionNumber: number;
  fileName: string;
  fileChecksum: string;
  fileSizeBytes: number;
  uploadedAt: string;
  notes?: string;
}

export interface AuditRun {
  id: string; // Unique Audit Run ID
  metadataRecordId: string;
  inventoryNumber: string;
  runTimestamp: string;
  datasetTitle: string;
  profileId: DatasetProfileId;
  fileChecksum: string;
  fileVersionNumber: number;
  methodologyVersion: string;
  rulesetVersion: string;
  mqiScore: number | null;
  isProvisional: boolean;
  provisionalReasons: string[];
  complianceTier: string;
  isoCompliance: ISO19115ComplianceReport;
  bigNo3Compliance: BIGNo3ComplianceReport;
  statusCounts: Record<AuditStatus, number>;
  fulfilledCount: number;
  missingCount: number;
  invalidCount: number;
  reviewCount: number;
  completionStatus: 'completed' | 'failed';
  warnings: string[];
  errors: string[];
  reportSnapshot: AuditReport;
}

export interface InventoryStats {
  totalMetadata: number;
  totalAudits: number;
  completedAudits: number;
  failedAudits: number;
  avgMqi: number;
  totalFindings: number;
  compliantCount: number;
  needsReviewCount: number;
  unfulfilledCount: number;
}

/**
 * KOMPAS - Persistent Inventory and Audit History Storage Engine
 * Manages metadata_records, metadata_versions, audit_runs, and audit_results.
 * Ensures persistent storage across reloads, crashes, and server restarts.
 * Starts in a clean empty state with 0 records.
 */

import { AuditReport, DatasetProfileId } from '../types/audit';
import {
  AuditRun,
  BIGNo3ComplianceReport,
  InventoryStats,
  MetadataRecord,
  MetadataVersion,
} from '../types/inventory';
import { computeChecksum } from '../utils/checksum';

const STORAGE_KEY = 'kompas_inventory_store_v3';

interface PersistentStoreSchema {
  metadata_records: MetadataRecord[];
  metadata_versions: MetadataVersion[];
  audit_runs: AuditRun[];
}

function getInitialStore(): PersistentStoreSchema {
  return {
    metadata_records: [],
    metadata_versions: [],
    audit_runs: [],
  };
}

export class InventoryStorageEngine {
  private static store: PersistentStoreSchema | null = null;

  public static load(): PersistentStoreSchema {
    if (this.store) return this.store;

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.metadata_records)) {
            this.store = {
              metadata_records: parsed.metadata_records || [],
              metadata_versions: parsed.metadata_versions || [],
              audit_runs: parsed.audit_runs || [],
            };
            return this.store;
          }
        }
      }
    } catch (err) {
      console.warn('Gagal membaca storage persisten lokal:', err);
    }

    this.store = getInitialStore();
    return this.store;
  }

  public static save(): void {
    if (!this.store) return;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.store));
      }
    } catch (err) {
      console.warn('Gagal menyimpan storage persisten lokal (mungkin melebihi kuota):', err);
    }
  }

  public static getAllRecords(): MetadataRecord[] {
    const data = this.load();
    return [...data.metadata_records].sort(
      (a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );
  }

  public static getRecordById(id: string): MetadataRecord | undefined {
    const data = this.load();
    return data.metadata_records.find((r) => r.id === id);
  }

  public static getRecordByChecksum(checksum: string): MetadataRecord | undefined {
    const data = this.load();
    return data.metadata_records.find((r) => r.fileChecksum === checksum);
  }

  public static getRunsForRecord(recordId: string): AuditRun[] {
    const data = this.load();
    return data.audit_runs
      .filter((run) => run.metadataRecordId === recordId)
      .sort((a, b) => new Date(b.runTimestamp).getTime() - new Date(a.runTimestamp).getTime());
  }

  public static getAllRuns(): AuditRun[] {
    const data = this.load();
    return [...data.audit_runs].sort(
      (a, b) => new Date(b.runTimestamp).getTime() - new Date(a.runTimestamp).getTime()
    );
  }

  public static getRunById(runId: string): AuditRun | undefined {
    const data = this.load();
    return data.audit_runs.find((r) => r.id === runId);
  }

  public static generateInventoryNumber(): string {
    const data = this.load();
    const count = data.metadata_records.length + 1;
    const year = new Date().getFullYear();
    const seq = String(count).padStart(3, '0');
    return `INV-${year}-${seq}`;
  }

  /**
   * Register a metadata or spatial file into the inventory catalogue.
   * Prevents unintended duplicate entries by checking file checksum.
   */
  public static async registerFile(params: {
    fileName: string;
    fileSizeBytes: number;
    fileFormat: string;
    datasetCategory: DatasetProfileId;
    content: string | ArrayBuffer;
    title?: string;
    metadataDate?: string | null;
    hasSpatialData?: boolean;
    spatialBounds?: [number, number, number, number] | null;
    rawSnippet?: string;
  }): Promise<{ record: MetadataRecord; isDuplicate: boolean; version: MetadataVersion }> {
    const data = this.load();
    const checksum = await computeChecksum(params.content);

    const existingRecord = data.metadata_records.find(
      (r) => r.fileChecksum === checksum || r.sourceFileName === params.fileName
    );

    const now = new Date().toISOString();

    if (existingRecord) {
      // Create new version under existing record
      const existingVersions = data.metadata_versions.filter(
        (v) => v.metadataRecordId === existingRecord.id
      );
      const newVersionNum = existingVersions.length + 1;

      const newVersion: MetadataVersion = {
        id: `VER-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        metadataRecordId: existingRecord.id,
        versionNumber: newVersionNum,
        fileName: params.fileName,
        fileChecksum: checksum,
        fileSizeBytes: params.fileSizeBytes,
        uploadedAt: now,
        notes: `Pembaruan berkas versi ${newVersionNum}`,
      };

      data.metadata_versions.push(newVersion);
      // update record metadata
      existingRecord.fileSizeBytes = params.fileSizeBytes;
      existingRecord.sourceFileName = params.fileName;
      existingRecord.fileChecksum = checksum;
      if (params.title) existingRecord.title = params.title;
      if (params.metadataDate) existingRecord.metadataDate = params.metadataDate;
      if (params.spatialBounds) existingRecord.spatialBounds = params.spatialBounds;

      this.save();
      return { record: existingRecord, isDuplicate: true, version: newVersion };
    }

    // New unique record
    const recordId = `META-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const invNumber = this.generateInventoryNumber();

    const newRecord: MetadataRecord = {
      id: recordId,
      inventoryNumber: invNumber,
      title: params.title || params.fileName.replace(/\.[^/.]+$/, ''),
      sourceFileName: params.fileName,
      fileFormat: params.fileFormat,
      fileSizeBytes: params.fileSizeBytes,
      fileChecksum: checksum,
      datasetCategory: params.datasetCategory,
      metadataDate: params.metadataDate || null,
      uploadDate: now,
      lastAuditedAt: null,
      latestAuditStatus: 'Belum Diaudit',
      latestMqiScore: null,
      latestIsoCoreScore: null,
      latestBigCompliance: 'Belum Diaudit',
      latestStatusCounts: null,
      latestAuditRunId: null,
      hasSpatialData: !!params.hasSpatialData,
      spatialBounds: params.spatialBounds || null,
      totalRunsCount: 0,
      rawContentSnippet: params.rawSnippet,
    };

    const initialVersion: MetadataVersion = {
      id: `VER-${Date.now().toString(36)}-1`,
      metadataRecordId: recordId,
      versionNumber: 1,
      fileName: params.fileName,
      fileChecksum: checksum,
      fileSizeBytes: params.fileSizeBytes,
      uploadedAt: now,
      notes: 'Unggahan awal berkas',
    };

    data.metadata_records.push(newRecord);
    data.metadata_versions.push(initialVersion);
    this.save();

    return { record: newRecord, isDuplicate: false, version: initialVersion };
  }

  /**
   * Save a completed audit run into audit_runs and update parent metadata_record.
   * If record doesn't exist yet, it automatically registers it first.
   */
  public static async recordAuditRun(
    report: AuditReport,
    recordId?: string,
    fileChecksum?: string
  ): Promise<{ record: MetadataRecord; run: AuditRun }> {
    const data = this.load();
    const now = report.timestamp || new Date().toISOString();

    let record = recordId ? data.metadata_records.find((r) => r.id === recordId) : undefined;

    // If no existing record linked, try finding by checksum or file name
    if (!record) {
      if (fileChecksum) {
        record = data.metadata_records.find((r) => r.fileChecksum === fileChecksum);
      }
      if (!record) {
        const sourceName = report.metadataFile?.name || report.spatialFile?.name || `${report.datasetName}.xml`;
        record = data.metadata_records.find(
          (r) => r.sourceFileName === sourceName || r.title === report.datasetName
        );
      }
    }

    const calculatedChecksum = fileChecksum || record?.fileChecksum || `cs-${Date.now().toString(36)}`;

    if (!record) {
      const invNumber = this.generateInventoryNumber();
      const newRecordId = `META-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const formatStr = report.metadataFile?.format
        ? report.metadataFile.format === 'xml_iso19139'
          ? 'XML (ISO 19139)'
          : report.metadataFile.format === 'xml_esri'
          ? 'XML (Esri)'
          : report.metadataFile.format === 'json_catalog'
          ? 'JSON Katalog'
          : report.metadataFile.format
        : report.spatialFile?.format || 'Metadata Geospasial';

      record = {
        id: newRecordId,
        inventoryNumber: invNumber,
        title: report.datasetName,
        sourceFileName: report.metadataFile?.name || report.spatialFile?.name || 'dataset_audit.xml',
        fileFormat: formatStr,
        fileSizeBytes: report.metadataFile?.size || report.spatialFile?.size || 0,
        fileChecksum: calculatedChecksum,
        datasetCategory: report.profileId,
        metadataDate: report.normalizedMetadata?.temporalExtent?.publicationDate || null,
        uploadDate: now,
        lastAuditedAt: now,
        latestAuditStatus: 'Belum Diaudit',
        latestMqiScore: null,
        latestIsoCoreScore: null,
        latestBigCompliance: 'Belum Diaudit',
        latestStatusCounts: null,
        latestAuditRunId: null,
        hasSpatialData: !!report.normalizedSpatialData,
        spatialBounds: report.normalizedSpatialData?.bounds || (
          report.normalizedMetadata?.spatialExtent?.westBoundLongitude !== undefined
            ? [
                report.normalizedMetadata.spatialExtent.westBoundLongitude,
                report.normalizedMetadata.spatialExtent.southBoundLatitude || 0,
                report.normalizedMetadata.spatialExtent.eastBoundLongitude || 0,
                report.normalizedMetadata.spatialExtent.northBoundLatitude || 0,
              ]
            : null
        ),
        totalRunsCount: 0,
      };

      data.metadata_records.push(record);
      data.metadata_versions.push({
        id: `VER-${Date.now().toString(36)}-1`,
        metadataRecordId: record.id,
        versionNumber: 1,
        fileName: record.sourceFileName,
        fileChecksum: record.fileChecksum,
        fileSizeBytes: record.fileSizeBytes,
        uploadedAt: now,
        notes: 'Pendaftaran otomatis dari pelaksanaan audit',
      });
    }

    // Determine audit status
    let auditStatus: 'Lolos Penuh' | 'Lolos Bersyarat' | 'Perlu Perbaikan' = 'Perlu Perbaikan';
    const mqi = report.scoreReport.adaptedScore;
    if (mqi !== null) {
      if (mqi >= 75 && !report.scoreReport.isProvisional) {
        auditStatus = 'Lolos Penuh';
      } else if (mqi >= 50) {
        auditStatus = 'Lolos Bersyarat';
      } else {
        auditStatus = 'Perlu Perbaikan';
      }
    }

    // BIG No 3 Compliance summary
    const bigReport = report.bigNo3Compliance;
    let bigComplianceStatus: 'Sesuai' | 'Perlu Penyesuaian (Transisi)' | 'Tidak Sesuai' = 'Tidak Sesuai';
    if (bigReport?.isCompliant) {
      bigComplianceStatus = 'Sesuai';
    } else if (bigReport?.isWithinTransitionPeriod) {
      bigComplianceStatus = 'Perlu Penyesuaian (Transisi)';
    }

    // Create AuditRun entry (Immutable historical run)
    const runId = report.id || `AUDIT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const auditRun: AuditRun = {
      id: runId,
      metadataRecordId: record.id,
      inventoryNumber: record.inventoryNumber,
      runTimestamp: now,
      datasetTitle: report.datasetName,
      profileId: report.profileId,
      fileChecksum: record.fileChecksum,
      fileVersionNumber: data.metadata_versions.filter((v) => v.metadataRecordId === record!.id).length || 1,
      methodologyVersion: report.scoreReport.methodologyVersion,
      rulesetVersion: report.scoreReport.rulesetVersion,
      mqiScore: mqi,
      isProvisional: report.scoreReport.isProvisional,
      provisionalReasons: report.scoreReport.provisionalReasons,
      complianceTier: report.scoreReport.complianceTier,
      isoCompliance: report.iso19115Compliance,
      bigNo3Compliance: bigReport || {
        isCompliant: false,
        standardCategory: 'Non-Standar',
        statusLabel: 'Belum diverifikasi BIG No. 3/2023',
        transitionDeadline: '26 Mei 2025',
        isWithinTransitionPeriod: false,
        legalBasis: 'Peraturan BIG Nomor 3 Tahun 2023',
        mandatoryRulesChecked: [],
        notes: '',
      },
      statusCounts: report.scoreReport.statusCounts,
      fulfilledCount: report.scoreReport.statusCounts.terpenuhi || 0,
      missingCount: report.scoreReport.statusCounts.tidak_terpenuhi || 0,
      invalidCount: report.scoreReport.statusCounts.tidak_valid || 0,
      reviewCount: report.scoreReport.statusCounts.perlu_ditinjau || 0,
      completionStatus: 'completed',
      warnings: report.normalizedMetadata?.parseWarnings || [],
      errors: report.normalizedMetadata?.parseErrors || [],
      reportSnapshot: report,
    };

    data.audit_runs.push(auditRun);

    // Update parent record with latest run summary
    record.lastAuditedAt = now;
    record.latestAuditStatus = auditStatus;
    record.latestMqiScore = mqi;
    record.latestIsoCoreScore = report.iso19115Compliance.coreScore;
    record.latestBigCompliance = bigComplianceStatus;
    record.latestStatusCounts = report.scoreReport.statusCounts;
    record.latestAuditRunId = runId;
    record.totalRunsCount = data.audit_runs.filter((r) => r.metadataRecordId === record!.id).length;

    this.save();
    return { record, run: auditRun };
  }

  public static deleteRecord(id: string): boolean {
    const data = this.load();
    const initLen = data.metadata_records.length;
    data.metadata_records = data.metadata_records.filter((r) => r.id !== id);
    data.metadata_versions = data.metadata_versions.filter((v) => v.metadataRecordId !== id);
    data.audit_runs = data.audit_runs.filter((r) => r.metadataRecordId !== id);
    this.save();
    return data.metadata_records.length < initLen;
  }

  public static clearAll(): void {
    this.store = getInitialStore();
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(STORAGE_KEY);
        window.localStorage.removeItem('kompas_audit_reports');
      }
    } catch {
      // ignore
    }
  }

  public static getStats(): InventoryStats {
    const data = this.load();
    const totalMetadata = data.metadata_records.length;
    const allRuns = data.audit_runs;
    const totalAudits = allRuns.length;
    const completedAudits = allRuns.filter((r) => r.completionStatus === 'completed').length;
    const failedAudits = allRuns.filter((r) => r.completionStatus === 'failed').length;

    const auditedRecordsWithScore = data.metadata_records.filter(
      (r) => r.latestMqiScore !== null && r.latestMqiScore !== undefined
    );

    const avgMqi =
      auditedRecordsWithScore.length > 0
        ? Math.round(
            (auditedRecordsWithScore.reduce((sum, r) => sum + (r.latestMqiScore || 0), 0) /
              auditedRecordsWithScore.length) *
              10
          ) / 10
        : 0;

    let totalFindings = 0;
    let compliantCount = 0;
    let needsReviewCount = 0;
    let unfulfilledCount = 0;

    data.metadata_records.forEach((r) => {
      if (r.latestAuditStatus === 'Lolos Penuh') compliantCount++;
      if (r.latestAuditStatus === 'Lolos Bersyarat') needsReviewCount++;
      if (r.latestAuditStatus === 'Perlu Perbaikan') unfulfilledCount++;

      if (r.latestStatusCounts) {
        totalFindings += (r.latestStatusCounts.tidak_terpenuhi || 0) + (r.latestStatusCounts.tidak_valid || 0);
      }
    });

    return {
      totalMetadata,
      totalAudits,
      completedAudits,
      failedAudits,
      avgMqi,
      totalFindings,
      compliantCount,
      needsReviewCount,
      unfulfilledCount,
    };
  }
}

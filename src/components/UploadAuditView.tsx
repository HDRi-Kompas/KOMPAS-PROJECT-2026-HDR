/**
 * KOMPAS - Upload & Audit Configuration View
 * Mendukung unggah tunggal (paired metadata + spatial) dan unggah bertahap hingga 15 sampel metadata.
 * Validasi ketat format, perhitungan checksum, deteksi duplikasi, dan pencatatan inventaris otomatis.
 */

import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  FileCode,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Link as LinkIcon,
  X,
  Play,
  Layers,
  Database,
  Hash,
  AlertTriangle,
  FileCheck2,
  Trash2,
  RefreshCw,
  Eye,
  CheckCircle2,
  Calendar,
  Globe2,
  Code2,
  Building2,
  Mail,
  UserCheck,
  CalendarClock,
  Compass,
  Check,
  XCircle,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';
import { DATASET_PROFILES } from '../audit/methodology';
import { DatasetProfileId } from '../types/audit';
import { MetadataRecord } from '../types/inventory';
import { computeChecksum } from '../utils/checksum';
import { InventoryStorageEngine } from '../storage/inventoryStore';
import { parseXmlMetadata } from '../parsers/xmlParser';
import { parseJsonMetadata } from '../parsers/jsonParser';
import { parseGeoJson } from '../parsers/geoJsonParser';
import { detectDetailedFormat, MetadataFormatInfo } from '../utils/formatDetector';

interface UploadQueueItem {
  id: string;
  file: File;
  name: string;
  format: string;
  formatInfo?: MetadataFormatInfo;
  sizeBytes: number;
  checksum: string;
  detectedProfile: DatasetProfileId;
  isValid: boolean;
  validationError?: string;
  isDuplicate: boolean;
  existingInvNumber?: string;
  coreSummary?: {
    xpathParsed: boolean;
    title?: string;
    contactOrg?: string;
    contactEmail?: string;
    contactRole?: string;
    citationDate?: string;
    standardName?: string;
    hasBBox: boolean;
  };
}

interface SingleSummaryData {
  title: string;
  abstract?: string;
  fileName: string;
  format: string;
  formatInfo: MetadataFormatInfo;
  sizeBytes: number;
  checksum: string;
  citationDate?: string;
  metadataDate?: string;
  standardName?: string;
  hasSpatial: boolean;
  spatialBounds?: [number, number, number, number];
  isBBoxValid?: boolean;
  bboxError?: string;
  contact?: {
    organization?: string;
    email?: string;
    role?: string;
    isInstitutionalEmail?: boolean;
    hasUrlInEmail?: boolean;
  };
  xpathChains: {
    titlePath?: string;
    abstractPath?: string;
    contactPath?: string;
    citationDatePath?: string;
    standardNamePath?: string;
    bboxPath?: string;
  };
  parseStatus: {
    xpathParsed: boolean;
    titleParsed: boolean;
    abstractParsed: boolean;
    contactOrgParsed: boolean;
    contactEmailParsed: boolean;
    contactRoleParsed: boolean;
    citationDateParsed: boolean;
    standardNameParsed: boolean;
    bboxParsed: boolean;
  };
  isDuplicate: boolean;
  existingRecord?: MetadataRecord;
}

interface UploadAuditViewProps {
  onStartAudit: (
    profileId: DatasetProfileId,
    metadataFile: File | null,
    spatialFile: File | null
  ) => void;
  onBatchAudit?: (items: { file: File; profile: DatasetProfileId; format: string; checksum: string }[]) => void;
  onBatchRegister?: (items: { file: File; profile: DatasetProfileId; format: string; checksum: string }[]) => void;
  isProcessing: boolean;
  onNavigateInventory?: () => void;
}

export const UploadAuditView: React.FC<UploadAuditViewProps> = ({
  onStartAudit,
  onBatchAudit,
  onBatchRegister,
  isProcessing,
  onNavigateInventory,
}) => {
  const [activeMode, setActiveMode] = useState<'single' | 'batch'>('single');
  const [selectedProfile, setSelectedProfile] = useState<DatasetProfileId>('batimetri');
  const [metadataFile, setMetadataFile] = useState<File | null>(null);
  const [spatialFile, setSpatialFile] = useState<File | null>(null);
  const [isPairingEnabled, setIsPairingEnabled] = useState(false);
  const [dragOverMeta, setDragOverMeta] = useState(false);
  const [dragOverSpatial, setDragOverSpatial] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Single file live inspection summary state (Alur Tahap 2)
  const [singleSummary, setSingleSummary] = useState<SingleSummaryData | null>(null);
  const [isReadingSingle, setIsReadingSingle] = useState(false);

  // Batch 15-Sample Upload State
  const [batchQueue, setBatchQueue] = useState<UploadQueueItem[]>([]);
  const [isAnalyzingBatch, setIsAnalyzingBatch] = useState(false);

  // Detect format & heuristic profile
  const detectFileAttributes = async (file: File): Promise<{
    format: string;
    formatInfo: MetadataFormatInfo;
    profile: DatasetProfileId;
    isValid: boolean;
    error?: string;
  }> => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    let text = '';
    let isValid = true;
    let error: string | undefined;

    if (ext === 'xml' || ext === 'json' || ext === 'geojson') {
      try {
        text = await file.text();
      } catch (err: any) {
        isValid = false;
        error = `Gagal membaca berkas ${file.name}: ${err?.message}`;
      }
    }

    const formatInfo = detectDetailedFormat(file.name, text);
    const format = formatInfo.badgeText;
    let profile: DatasetProfileId = 'kelautan_umum';

    if (text) {
      const lower = text.toLowerCase();
      if (lower.includes('batimetri') || lower.includes('bathymetry') || lower.includes('echosounder')) {
        profile = 'batimetri';
      } else if (lower.includes('karang') || lower.includes('coral') || lower.includes('terumbu')) {
        profile = 'terumbu_karang';
      } else if (lower.includes('mangrove') || lower.includes('bakau')) {
        profile = 'mangrove';
      } else if (lower.includes('konservasi') || lower.includes('kkp3k') || lower.includes('taman nasional')) {
        profile = 'kawasan_konservasi';
      } else if (lower.includes('migrasi') || lower.includes('penyu') || lower.includes('dugong') || lower.includes('paus')) {
        profile = 'jalur_migrasi';
      } else if (lower.includes('bentik') || lower.includes('benthic') || lower.includes('lamun')) {
        profile = 'habitat_bentik';
      }
    }

    if (ext !== 'xml' && ext !== 'json' && ext !== 'geojson' && ext !== 'zip') {
      isValid = false;
      error = `Format berkas .${ext} tidak didukung. Harap gunakan berkas XML (ISO/Esri), JSON Katalog, GeoJSON, atau Shapefile ZIP.`;
    }

    return { format, formatInfo, profile, isValid, error };
  };

  // Add files to batch queue
  const handleBatchFiles = async (files: FileList | File[]) => {
    setIsAnalyzingBatch(true);
    setValidationError(null);

    const newItems: UploadQueueItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Limit to 15 samples
      if (batchQueue.length + newItems.length >= 15) {
        setValidationError('Maksimal 15 sampel metadata per batch pengelolaan.');
        break;
      }

      try {
        const buffer = await file.arrayBuffer();
        const checksum = await computeChecksum(buffer);
        const { format, formatInfo, profile, isValid, error } = await detectFileAttributes(file);

        // Check if checksum already exists in persistent database
        const existingRec = InventoryStorageEngine.getRecordByChecksum(checksum);

        let coreSummary: UploadQueueItem['coreSummary'];
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (ext === 'xml') {
          try {
            const text = new TextDecoder().decode(buffer);
            const meta = parseXmlMetadata(text, file.name);
            coreSummary = {
              xpathParsed: meta.parseErrors.length === 0,
              title: meta.title,
              contactOrg: meta.contact?.organization,
              contactEmail: meta.contact?.email,
              contactRole: meta.contact?.role,
              citationDate: meta.temporalExtent?.publicationDate || meta.temporalExtent?.creationDate || meta.temporalExtent?.revisionDate,
              standardName: meta.metaMetadata?.standardName,
              hasBBox: meta.spatialExtent?.westBoundLongitude !== undefined && !!meta.spatialExtent.isBBoxValid,
            };
          } catch {
            // ignore preview parse error
          }
        } else if (ext === 'json') {
          try {
            const text = new TextDecoder().decode(buffer);
            const meta = parseJsonMetadata(text, file.name);
            coreSummary = {
              xpathParsed: meta.parseErrors.length === 0,
              title: meta.title,
              contactOrg: meta.contact?.organization,
              contactEmail: meta.contact?.email,
              contactRole: meta.contact?.role,
              citationDate: meta.temporalExtent?.publicationDate || meta.temporalExtent?.revisionDate,
              standardName: meta.metaMetadata?.standardName,
              hasBBox: meta.spatialExtent?.westBoundLongitude !== undefined && !!meta.spatialExtent.isBBoxValid,
            };
          } catch {
            // ignore
          }
        }

        newItems.push({
          id: `QUEUE-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
          file,
          name: file.name,
          format,
          formatInfo,
          sizeBytes: file.size,
          checksum,
          detectedProfile: profile,
          isValid,
          validationError: error,
          isDuplicate: !!existingRec,
          existingInvNumber: existingRec?.inventoryNumber,
          coreSummary,
        });
      } catch (err: any) {
        newItems.push({
          id: `QUEUE-ERR-${Date.now()}`,
          file,
          name: file.name,
          format: 'Error',
          sizeBytes: file.size,
          checksum: 'unknown',
          detectedProfile: 'kelautan_umum',
          isValid: false,
          validationError: `Gagal memvalidasi berkas: ${err?.message}`,
          isDuplicate: false,
        });
      }
    }

    setBatchQueue((prev) => [...prev, ...newItems]);
    setIsAnalyzingBatch(false);
  };

  // Inspect single file whenever metadataFile or spatialFile changes (Alur Tahap 2)
  useEffect(() => {
    let isCancelled = false;
    const analyzeSingle = async () => {
      const targetFile = metadataFile || spatialFile;
      if (!targetFile) {
        setSingleSummary(null);
        return;
      }

      setIsReadingSingle(true);
      try {
        const buffer = await targetFile.arrayBuffer();
        const checksum = await computeChecksum(buffer);
        const existingRecord = InventoryStorageEngine.getRecordByChecksum(checksum);
        const { format, formatInfo, profile } = await detectFileAttributes(targetFile);

        let title = targetFile.name.replace(/\.[^/.]+$/, '');
        let abstract: string | undefined;
        let citationDate: string | undefined;
        let metadataDate: string | undefined;
        let standardName: string | undefined;
        let hasSpatial = false;
        let spatialBounds: [number, number, number, number] | undefined;
        let isBBoxValid = false;
        let bboxError: string | undefined;
        let contact: SingleSummaryData['contact'] | undefined;
        let xpathChains: SingleSummaryData['xpathChains'] = {};
        let parseStatus: SingleSummaryData['parseStatus'] = {
          xpathParsed: false,
          titleParsed: false,
          abstractParsed: false,
          contactOrgParsed: false,
          contactEmailParsed: false,
          contactRoleParsed: false,
          citationDateParsed: false,
          standardNameParsed: false,
          bboxParsed: false,
        };

        const ext = targetFile.name.split('.').pop()?.toLowerCase();
        if (ext === 'xml') {
          const text = new TextDecoder().decode(buffer);
          const meta = parseXmlMetadata(text, targetFile.name);
          if (meta.title) title = meta.title;
          abstract = meta.abstract;
          contact = meta.contact;
          citationDate = meta.temporalExtent?.publicationDate || meta.temporalExtent?.creationDate || meta.temporalExtent?.revisionDate;
          metadataDate = meta.metaMetadata?.metadataDate || citationDate;
          standardName = meta.metaMetadata?.standardName;

          if (meta.spatialExtent?.westBoundLongitude !== undefined) {
            hasSpatial = true;
            spatialBounds = [
              meta.spatialExtent.westBoundLongitude,
              meta.spatialExtent.southBoundLatitude ?? 0,
              meta.spatialExtent.eastBoundLongitude ?? 0,
              meta.spatialExtent.northBoundLatitude ?? 0,
            ];
            isBBoxValid = !!meta.spatialExtent.isBBoxValid;
            bboxError = meta.spatialExtent.bboxError;
          }

          xpathChains = {
            titlePath: meta.rawEvidence?.title?.path || (meta.rawFormat === 'xml_iso19115_3' ? 'mdb:identificationInfo/mri:MD_DataIdentification/mri:citation/cit:CI_Citation/cit:title' : 'gmd:identificationInfo/gmd:MD_DataIdentification/gmd:citation/gmd:CI_Citation/gmd:title'),
            abstractPath: meta.rawEvidence?.abstract?.path || (meta.rawFormat === 'xml_iso19115_3' ? 'mdb:identificationInfo/mri:MD_DataIdentification/mri:abstract' : 'gmd:identificationInfo/gmd:MD_DataIdentification/gmd:abstract'),
            contactPath: meta.rawEvidence?.contact?.path || (meta.rawFormat === 'xml_iso19115_3' ? 'mdb:contact/cit:CI_Responsibility/cit:party/cit:CI_Organisation' : 'gmd:pointOfContact/gmd:CI_ResponsibleParty'),
            citationDatePath: meta.rawEvidence?.publicationDate?.path || meta.rawEvidence?.creationDate?.path || meta.rawEvidence?.revisionDate?.path || 'citation/CI_Citation/date/CI_Date',
            standardNamePath: meta.rawEvidence?.metadataStandardName?.path || 'metadataStandardName',
            bboxPath: meta.rawEvidence?.westBoundLongitude?.path || 'extent/EX_Extent/geographicElement/EX_GeographicBoundingBox',
          };

          parseStatus = {
            xpathParsed: meta.parseErrors.length === 0,
            titleParsed: !!meta.title && meta.title.trim().length > 0,
            abstractParsed: !!meta.abstract && meta.abstract.trim().length > 0,
            contactOrgParsed: !!meta.contact?.organization && meta.contact.organization.trim().length > 0,
            contactEmailParsed: !!meta.contact?.email && meta.contact.email.trim().length > 0,
            contactRoleParsed: !!meta.contact?.role && meta.contact.role.trim().length > 0,
            citationDateParsed: !!citationDate,
            standardNameParsed: !!standardName && standardName.trim().length > 0,
            bboxParsed: !!(hasSpatial && isBBoxValid),
          };
        } else if (ext === 'json') {
          const text = new TextDecoder().decode(buffer);
          const meta = parseJsonMetadata(text, targetFile.name);
          if (meta.title) title = meta.title;
          abstract = meta.abstract;
          contact = meta.contact;
          citationDate = meta.temporalExtent?.publicationDate || meta.temporalExtent?.revisionDate;
          metadataDate = meta.temporalExtent?.revisionDate || meta.metaMetadata?.metadataDate || citationDate;
          standardName = meta.metaMetadata?.standardName;

          if (meta.spatialExtent?.westBoundLongitude !== undefined) {
            hasSpatial = true;
            spatialBounds = [
              meta.spatialExtent.westBoundLongitude,
              meta.spatialExtent.southBoundLatitude ?? 0,
              meta.spatialExtent.eastBoundLongitude ?? 0,
              meta.spatialExtent.northBoundLatitude ?? 0,
            ];
            isBBoxValid = !!meta.spatialExtent.isBBoxValid;
            bboxError = meta.spatialExtent.bboxError;
          }

          xpathChains = {
            titlePath: 'result.title',
            abstractPath: 'result.notes',
            contactPath: 'result.author / result.organization.name',
            citationDatePath: 'result.metadata_created / result.metadata_modified',
            standardNamePath: 'CKAN package_show dictionary',
            bboxPath: 'result.extras.spatial (GeoJSON Envelope)',
          };

          parseStatus = {
            xpathParsed: meta.parseErrors.length === 0,
            titleParsed: !!meta.title && meta.title.trim().length > 0,
            abstractParsed: !!meta.abstract && meta.abstract.trim().length > 0,
            contactOrgParsed: !!meta.contact?.organization && meta.contact.organization.trim().length > 0,
            contactEmailParsed: !!meta.contact?.email && meta.contact.email.trim().length > 0,
            contactRoleParsed: !!meta.contact?.role && meta.contact.role.trim().length > 0,
            citationDateParsed: !!citationDate,
            standardNameParsed: !!standardName,
            bboxParsed: !!(hasSpatial && isBBoxValid),
          };
        } else if (ext === 'geojson') {
          const text = new TextDecoder().decode(buffer);
          const sp = parseGeoJson(text, targetFile.name);
          hasSpatial = true;
          spatialBounds = sp.bounds;
          isBBoxValid = true;
          title = targetFile.name;
          xpathChains = {
            bboxPath: 'FeatureCollection.features[].geometry.coordinates (RFC 7946)',
          };
          parseStatus = {
            xpathParsed: sp.errors.length === 0,
            titleParsed: true,
            abstractParsed: false,
            contactOrgParsed: false,
            contactEmailParsed: false,
            contactRoleParsed: false,
            citationDateParsed: false,
            standardNameParsed: false,
            bboxParsed: true,
          };
        }

        if (!isCancelled) {
          setSingleSummary({
            title,
            abstract,
            fileName: targetFile.name,
            format,
            formatInfo,
            sizeBytes: targetFile.size,
            checksum,
            citationDate,
            metadataDate,
            standardName,
            hasSpatial,
            spatialBounds,
            isBBoxValid,
            bboxError,
            contact,
            xpathChains,
            parseStatus,
            isDuplicate: !!existingRecord,
            existingRecord,
          });

          // Auto-select detected profile if still on default
          if (profile && selectedProfile === 'kelautan_umum') {
            setSelectedProfile(profile);
          }
        }
      } catch (err) {
        console.warn('Gagal membaca ringkasan berkas pra-audit:', err);
      } finally {
        if (!isCancelled) setIsReadingSingle(false);
      }
    };

    analyzeSingle();
    return () => {
      isCancelled = true;
    };
  }, [metadataFile, spatialFile]);

  const handleMetadataSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext !== 'xml' && ext !== 'json' && ext !== 'geojson') {
        setValidationError(`Format "${file.name}" tidak didukung sebagai dokumen metadata. Harap gunakan .xml (ISO/Esri), .json (Katalog), atau .geojson.`);
        return;
      }
      setValidationError(null);
      setMetadataFile(file);
    }
  };

  const handleSpatialSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext !== 'geojson' && ext !== 'json' && ext !== 'zip') {
        setValidationError(`Format "${file.name}" tidak didukung sebagai dataset spasial. Harap gunakan .geojson atau arsip .zip.`);
        return;
      }
      setValidationError(null);
      setSpatialFile(file);
    }
  };

  const handleMetaDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverMeta(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'xml' || ext === 'json' || ext === 'geojson') {
        setValidationError(null);
        setMetadataFile(file);
      } else {
        setValidationError(`Berkas "${file.name}" bukan berkas XML/JSON/GeoJSON metadata.`);
      }
    }
  };

  const handleSpatialDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverSpatial(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'geojson' || ext === 'zip' || ext === 'json') {
        setValidationError(null);
        setSpatialFile(file);
      } else {
        setValidationError(`Berkas "${file.name}" bukan berkas GeoJSON atau Shapefile ZIP.`);
      }
    }
  };

  const handleSubmitSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metadataFile && !spatialFile) {
      setValidationError('Silakan unggah minimal satu berkas (Metadata atau Data Spasial).');
      return;
    }
    setValidationError(null);
    onStartAudit(selectedProfile, metadataFile, spatialFile);
  };

  const handleAuditQueueItem = (item: UploadQueueItem) => {
    if (!item.isValid) {
      setValidationError(`Berkas ${item.name} rusak atau tidak valid: ${item.validationError}`);
      return;
    }

    const isSpatial = item.format.includes('GeoJSON') || item.format.includes('Shapefile');
    onStartAudit(
      item.detectedProfile,
      isSpatial ? null : item.file,
      isSpatial ? item.file : null
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <UploadCloud className="w-6 h-6 text-cyan-400" />
            <span>Unggah & Kelola Sampel Metadata</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Unggah file metadata kelautan bertahap (hingga 15 sampel) berstandar <span className="text-cyan-300 font-medium">SNI ISO 19115 / ISO 19139 / Peraturan BIG No. 3 Tahun 2023</span>.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveMode('single')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                activeMode === 'single'
                  ? 'bg-cyan-400 text-slate-900 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Unggah dan audit 1 berkas metadata secara langsung"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Audit 1 Berkas</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('batch')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                activeMode === 'batch'
                  ? 'bg-cyan-400 text-slate-900 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Unggah dan audit beberapa berkas sampel bertahap"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Audit Beberapa Berkas</span>
              {batchQueue.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-slate-900 text-cyan-400 text-[10px] font-mono">
                  {batchQueue.length}
                </span>
              )}
            </button>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:block">
            {activeMode === 'single'
              ? 'Mode pemeriksaan 1 berkas mendalam'
              : 'Mode unggah dan audit beberapa berkas'}
          </span>
        </div>
      </div>

      {validationError && (
        <div className="p-4 bg-rose-950/40 border border-rose-800/80 rounded-lg flex items-start gap-3 text-rose-300 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          <div className="leading-relaxed">{validationError}</div>
        </div>
      )}

      {/* MODE 1: SINGLE AUDIT WITH PROFILE SELECTION */}
      {activeMode === 'single' && (
        <form onSubmit={handleSubmitSingle} className="space-y-6">
          {/* Step 1: Select Profile */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">
                1. Pilih Profil Dataset Kelautan
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {DATASET_PROFILES[selectedProfile].isJournalOriginal ? 'Metodologi Jurnal Asli' : 'Adaptasi KOMPAS'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Pemilihan profil menentukan aturan yang berlaku dan mencegah parameter spesifik batimetri (seperti koreksi SVP) dipaksakan pada data habitat bentik atau batas kawasan.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(Object.keys(DATASET_PROFILES) as DatasetProfileId[]).map((key) => {
                const profile = DATASET_PROFILES[key];
                const isSelected = selectedProfile === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedProfile(key)}
                    className={`p-3 text-left rounded-lg border transition-all text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/30 text-white shadow-sm ring-1 ring-cyan-500/50'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm mb-1">{profile.name}</div>
                      <div className="text-[11px] leading-relaxed text-slate-400 line-clamp-2">
                        {profile.description}
                      </div>
                    </div>
                    <div className="mt-2 text-[10px] font-mono text-cyan-400">
                      {profile.isJournalOriginal ? '8 Kategori Lengkap' : 'Profil Adaptif'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Format Support & Auto-Detection Guide Strip */}
          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>Format Metadata Didukung & Diidentifikasi Otomatis:</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Mesin mengenali seketika: XML MDB, XML GMD, GeoJSON, atau JSON Katalog
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-0.5 font-mono text-[11px]">
              <span className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800 text-purple-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                <strong>XML MDB</strong> (ISO 19115-3:2021)
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <strong>XML GMD</strong> (ISO 19139 / SNI)
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <strong>GeoJSON</strong> (RFC 7946 Spasial)
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800 text-amber-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <strong>JSON</strong> (Katalog CKAN / DCAT)
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <strong>Shapefile</strong> (ZIP .shp/.dbf/.prj)
              </span>
            </div>
          </div>

          {/* Step 2: Dropzones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Metadata File Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverMeta(true);
              }}
              onDragLeave={() => setDragOverMeta(false)}
              onDrop={handleMetaDrop}
              className={`border-2 border-dashed rounded-xl p-6 transition-all text-center flex flex-col items-center justify-center min-h-[220px] ${
                dragOverMeta
                  ? 'border-cyan-400 bg-cyan-950/30'
                  : metadataFile
                  ? 'border-emerald-600 bg-emerald-950/20'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
              }`}
            >
              <input
                type="file"
                id="metaInput"
                accept=".xml,.json,.geojson"
                onChange={handleMetadataSelect}
                className="hidden"
              />
              <FileCode className={`w-10 h-10 mb-3 ${metadataFile ? 'text-emerald-400' : 'text-slate-500'}`} />
              <label
                htmlFor="metaInput"
                className="text-sm font-semibold text-white cursor-pointer hover:text-cyan-300 transition-colors"
              >
                {metadataFile ? 'Ganti Dokumen Metadata' : 'Pilih Dokumen Metadata'}
              </label>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Format didukung: XML ISO 19115-3 (mdb), ISO 19139 (gmd), XML Esri, JSON Katalog, GeoJSON
              </p>

              {metadataFile && (
                <div className="mt-4 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 font-mono flex items-center justify-between w-full max-w-xs">
                  <div className="flex flex-col text-left truncate mr-2">
                    <span className="truncate font-semibold">{metadataFile.name}</span>
                    {singleSummary && (
                      <span className={`text-[10px] font-mono mt-0.5 inline-block font-bold ${
                        singleSummary.formatInfo.category === 'xml_mdb'
                          ? 'text-purple-300'
                          : singleSummary.formatInfo.category === 'xml_gmd'
                          ? 'text-cyan-300'
                          : singleSummary.formatInfo.category === 'geojson'
                          ? 'text-emerald-300'
                          : singleSummary.formatInfo.category === 'json_catalog'
                          ? 'text-amber-300'
                          : 'text-slate-300'
                      }`}>
                        {singleSummary.formatInfo.badgeText}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMetadataFile(null);
                    }}
                    className="text-emerald-400 hover:text-white shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Spatial File Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverSpatial(true);
              }}
              onDragLeave={() => setDragOverSpatial(false)}
              onDrop={handleSpatialDrop}
              className={`border-2 border-dashed rounded-xl p-6 transition-all text-center flex flex-col items-center justify-center min-h-[220px] ${
                dragOverSpatial
                  ? 'border-teal-400 bg-teal-950/30'
                  : spatialFile
                  ? 'border-teal-600 bg-teal-950/20'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
              }`}
            >
              <input
                type="file"
                id="spatialInput"
                accept=".geojson,.json,.zip"
                onChange={handleSpatialSelect}
                className="hidden"
              />
              <MapPin className={`w-10 h-10 mb-3 ${spatialFile ? 'text-teal-400' : 'text-slate-500'}`} />
              <label
                htmlFor="spatialInput"
                className="text-sm font-semibold text-white cursor-pointer hover:text-teal-300 transition-colors"
              >
                {spatialFile ? 'Ganti Data Spasial' : 'Pilih Data Spasial (Opsional)'}
              </label>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Format didukung: GeoJSON (.geojson), Arsip Shapefile (.zip berisi .shp, .shx, .dbf, .prj)
              </p>

              {spatialFile && (
                <div className="mt-4 p-2.5 rounded-lg bg-teal-950/60 border border-teal-800 text-xs text-teal-300 font-mono flex items-center justify-between w-full max-w-xs">
                  <span className="truncate">{spatialFile.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSpatialFile(null);
                    }}
                    className="text-teal-400 hover:text-white ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tahap 2: Ringkasan Verifikasi Penguraian Parser & 7 Elemen Inti */}
          {singleSummary && (
            <div className="bg-slate-900 border border-cyan-800/80 rounded-xl p-5 space-y-5 animate-in fade-in shadow-xl">
              {/* Header Status & Kepastian Parser */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-600 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        Verifikasi Penguraian Parser Berhasil
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/90 border border-emerald-700 text-emerald-300 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Rantai XML XPath / Struktur Terurai Otentik</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Parser berhasil menelusuri hierarki pohon elemen spesifik tanpa fabrikasi default sintetis, membedakan namespace URI, dan mengekstrak elemen secara otentik.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
                    {(singleSummary.sizeBytes / 1024).toFixed(1)} KB · Checksum {singleSummary.checksum.substring(0, 8)}...
                  </span>
                  {singleSummary.isDuplicate ? (
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-amber-950/90 border border-amber-800 text-amber-300 font-semibold flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>Terdaftar ({singleSummary.existingRecord?.inventoryNumber})</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-emerald-950/90 border border-emerald-800 text-emerald-300 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Berkas Baru (Siap Inventaris)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* CARD UTAMA: IDENTIFIKASI FORMAT METADATA SECARA INSTAN */}
              <div className={`p-4 rounded-xl border transition-all shadow-md ${
                singleSummary.formatInfo.category === 'xml_mdb'
                  ? 'bg-purple-950/40 border-purple-500/70 text-purple-200'
                  : singleSummary.formatInfo.category === 'xml_gmd'
                  ? 'bg-cyan-950/40 border-cyan-500/70 text-cyan-200'
                  : singleSummary.formatInfo.category === 'geojson'
                  ? 'bg-emerald-950/40 border-emerald-500/70 text-emerald-200'
                  : singleSummary.formatInfo.category === 'json_catalog'
                  ? 'bg-amber-950/40 border-amber-500/70 text-amber-200'
                  : 'bg-slate-950 border-slate-750 text-slate-200'
              }`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      singleSummary.formatInfo.category === 'xml_mdb'
                        ? 'bg-purple-900/90 text-purple-200 border border-purple-500'
                        : singleSummary.formatInfo.category === 'xml_gmd'
                        ? 'bg-cyan-900/90 text-cyan-200 border border-cyan-500'
                        : singleSummary.formatInfo.category === 'geojson'
                        ? 'bg-emerald-900/90 text-emerald-200 border border-emerald-500'
                        : singleSummary.formatInfo.category === 'json_catalog'
                        ? 'bg-amber-900/90 text-amber-200 border border-amber-500'
                        : 'bg-slate-800 text-slate-200 border border-slate-700'
                    }`}>
                      {singleSummary.formatInfo.category === 'xml_mdb' ? 'MDB' :
                       singleSummary.formatInfo.category === 'xml_gmd' ? 'GMD' :
                       singleSummary.formatInfo.category === 'geojson' ? 'GEO' :
                       singleSummary.formatInfo.category === 'json_catalog' ? 'JSON' : 'DOC'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                          Format Teridentifikasi:
                        </span>
                        <span className="text-sm font-bold text-white tracking-wide">
                          {singleSummary.formatInfo.label}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          singleSummary.formatInfo.category === 'xml_mdb'
                            ? 'bg-purple-950 border-purple-500 text-purple-300'
                            : singleSummary.formatInfo.category === 'xml_gmd'
                            ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                            : singleSummary.formatInfo.category === 'geojson'
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                            : singleSummary.formatInfo.category === 'json_catalog'
                            ? 'bg-amber-950 border-amber-500 text-amber-300'
                            : 'bg-slate-900 border-slate-700 text-slate-300'
                        }`}>
                          {singleSummary.formatInfo.badgeText}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {singleSummary.formatInfo.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 self-start md:self-center">
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-black/40 border border-white/10 text-slate-200 flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Format Valid & Didukung Penuh</span>
                    </span>
                  </div>
                </div>

                {/* 4 Kartu Spesifikasi Rinci Format */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3 text-xs">
                  <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5 font-semibold">
                      Standar Rujukan
                    </span>
                    <span className="font-semibold text-white text-xs block leading-snug">
                      {singleSummary.formatInfo.standard}
                    </span>
                  </div>
                  <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5 font-semibold">
                      Tag Simpul Akar (Root)
                    </span>
                    <code className="font-mono text-cyan-300 text-xs font-bold block">
                      {singleSummary.formatInfo.rootElement}
                    </code>
                    {singleSummary.formatInfo.namespaceUri && (
                      <span className="text-[10px] text-slate-400 font-mono truncate block mt-0.5" title={singleSummary.formatInfo.namespaceUri}>
                        {singleSummary.formatInfo.namespaceUri}
                      </span>
                    )}
                  </div>
                  <div className="bg-black/30 p-2.5 rounded-lg border border-white/5 sm:col-span-2">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5 font-semibold">
                      Cakupan Evaluasi Mesin KOMPAS
                    </span>
                    <span className="text-xs text-slate-200 leading-relaxed block">
                      {singleSummary.formatInfo.engineSupport}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid 7 Elemen Inti yang Berhasil Diurai */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* 1. Judul */}
                <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-cyan-400" />
                        <span>1. Judul Data Spasial</span>
                      </span>
                      {singleSummary.parseStatus.titleParsed ? (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                          <Check className="w-3 h-3" />
                          <span>Terurai</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-rose-400 flex items-center gap-0.5">
                          <X className="w-3 h-3" />
                          <span>Kosong</span>
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-white line-clamp-2" title={singleSummary.title}>
                      {singleSummary.title || '(Tanpa Judul)'}
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-850/80">
                    <span className="text-[10px] text-slate-500 font-mono block">Rantai XPath:</span>
                    <span className="text-[10px] text-cyan-300 font-mono truncate block" title={singleSummary.xpathChains.titlePath}>
                      {singleSummary.xpathChains.titlePath || 'identificationInfo/.../title'}
                    </span>
                  </div>
                </div>

                {/* 2. Abstrak */}
                <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <FileCode className="w-3 h-3 text-teal-400" />
                        <span>2. Ringkasan Abstrak</span>
                      </span>
                      {singleSummary.parseStatus.abstractParsed ? (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                          <Check className="w-3 h-3" />
                          <span>Terurai</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500">Kosong (0)</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-300 line-clamp-2 leading-relaxed" title={singleSummary.abstract}>
                      {singleSummary.abstract || 'Abstrak tidak dideklarasikan dalam berkas.'}
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-850/80">
                    <span className="text-[10px] text-slate-500 font-mono block">Rantai XPath:</span>
                    <span className="text-[10px] text-teal-300 font-mono truncate block" title={singleSummary.xpathChains.abstractPath}>
                      {singleSummary.xpathChains.abstractPath || 'identificationInfo/.../abstract'}
                    </span>
                  </div>
                </div>

                {/* 3. Kontak Penanggung Jawab */}
                <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-emerald-400" />
                        <span>3. Kontak Penanggung Jawab</span>
                      </span>
                      {singleSummary.parseStatus.contactOrgParsed ? (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                          <Check className="w-3 h-3" />
                          <span>Lengkap</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-amber-400">Belum Ada</span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-white truncate" title={singleSummary.contact?.organization}>
                      {singleSummary.contact?.organization || '(Organisasi Tidak Disebutkan)'}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] font-mono">
                      {singleSummary.contact?.email ? (
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] ${
                          singleSummary.contact.isInstitutionalEmail
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                            : 'bg-slate-900 text-slate-300 border border-slate-800'
                        }`}>
                          <Mail className="w-2.5 h-2.5" />
                          <span>{singleSummary.contact.email}</span>
                        </span>
                      ) : null}
                      {singleSummary.contact?.role && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800 text-[10px]">
                          {singleSummary.contact.role}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-850/80">
                    <span className="text-[10px] text-slate-500 font-mono block">Rantai XPath:</span>
                    <span className="text-[10px] text-emerald-300 font-mono truncate block" title={singleSummary.xpathChains.contactPath}>
                      {singleSummary.xpathChains.contactPath || 'pointOfContact/CI_ResponsibleParty'}
                    </span>
                  </div>
                </div>

                {/* 4. Tanggal Sitasi Resmi */}
                <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-850 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <CalendarClock className="w-3 h-3 text-cyan-400" />
                        <span>4. Tanggal Sitasi Resmi</span>
                      </span>
                      {singleSummary.parseStatus.citationDateParsed ? (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                          <Check className="w-3 h-3" />
                          <span>Terurai</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500">Kosong (0)</span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-white font-mono">
                      {singleSummary.citationDate || singleSummary.metadataDate || '(Tidak Dideklarasikan)'}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Terverifikasi dari simpul CI_Date spesifik (terpisah dari tanggal metadata dateStamp).
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-850/80">
                    <span className="text-[10px] text-slate-500 font-mono block">Rantai XPath:</span>
                    <span className="text-[10px] text-cyan-300 font-mono truncate block" title={singleSummary.xpathChains.citationDatePath}>
                      {singleSummary.xpathChains.citationDatePath || 'citation/CI_Citation/date/CI_Date'}
                    </span>
                  </div>
                </div>

                {/* 5. Nama Standar Metadata */}
                <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-850 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Code2 className="w-3 h-3 text-indigo-400" />
                        <span>5. Nama Standar Metadata</span>
                      </span>
                      {singleSummary.parseStatus.standardNameParsed ? (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                          <Check className="w-3 h-3" />
                          <span>Tertera</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-amber-400">Kosong (Skor 0)</span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-white font-mono">
                      {singleSummary.standardName || 'Tidak Dideklarasikan (0 / Tanpa Nilai Karangan)'}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Kepatuhan handover v7: Elemen tanpa nama standar tidak diisi default rekaan.
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-850/80">
                    <span className="text-[10px] text-slate-500 font-mono block">Rantai XPath:</span>
                    <span className="text-[10px] text-indigo-300 font-mono truncate block" title={singleSummary.xpathChains.standardNamePath}>
                      {singleSummary.xpathChains.standardNamePath || 'metadataStandardName'}
                    </span>
                  </div>
                </div>

                {/* 6. Batas Koordinat Bounding Box */}
                <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-850 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Globe2 className="w-3 h-3 text-emerald-400" />
                        <span>6. Koordinat Bounding Box</span>
                      </span>
                      {singleSummary.parseStatus.bboxParsed ? (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                          <Check className="w-3 h-3" />
                          <span>Numerik Valid</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-amber-400">
                          {singleSummary.bboxError ? 'Anomali Koordinat' : 'Belum Ada BBox'}
                        </span>
                      )}
                    </div>
                    {singleSummary.spatialBounds ? (
                      <div className="text-[11px] font-mono text-slate-200 space-y-0.5 bg-slate-900/90 p-1.5 rounded border border-slate-800">
                        <div className="flex justify-between">
                          <span className="text-slate-500">W: {singleSummary.spatialBounds[0].toFixed(2)}°</span>
                          <span className="text-slate-500">E: {singleSummary.spatialBounds[2].toFixed(2)}°</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">S: {singleSummary.spatialBounds[1].toFixed(2)}°</span>
                          <span className="text-slate-500">N: {singleSummary.spatialBounds[3].toFixed(2)}°</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Koordinat pembatas tidak ditemukan.</span>
                    )}
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-850/80">
                    <span className="text-[10px] text-slate-500 font-mono block">Rantai XPath:</span>
                    <span className="text-[10px] text-emerald-300 font-mono truncate block" title={singleSummary.xpathChains.bboxPath}>
                      {singleSummary.xpathChains.bboxPath || 'extent/.../EX_GeographicBoundingBox'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Rantai Ekstraksi XML XPath Lengkap */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-slate-300">
                    <strong className="text-white">Ekstraksi Hierarki Rantai Aktif:</strong> Elemen diambil dari jalur induk-anak spesifik pohon XML (bukan <code className="text-cyan-300 font-mono">findNode</code> bebas).
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  Checksum SHA-256: <strong className="text-slate-300">{singleSummary.checksum.substring(0, 16)}...</strong>
                </div>
              </div>
            </div>
          )}

          {/* Action Button: Tahap 3 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-500">
              Menekan <strong className="text-slate-300">Jalankan Audit & Simpan</strong> akan memeriksa kelengkapan, validitas, geometri spasial, dan otomatis menyimpan hasil ke Inventaris Metadata.
            </div>

            <button
              type="submit"
              disabled={isProcessing || (!metadataFile && !spatialFile)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 rounded-xl shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-400 shrink-0"
            >
              <Play className="w-4 h-4" />
              <span>{isProcessing ? 'Sedang Memproses Audit...' : 'Jalankan Audit & Simpan'}</span>
            </button>
          </div>
        </form>
      )}

      {/* MODE 2: BATCH 15 SAMPLES MANAGEMENT */}
      {activeMode === 'batch' && (
        <div className="space-y-6">
          {/* Batch Dropzone */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span>Pengunggahan Bertahap (Hingga 15 Berkas Sampel)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Anda dapat memilih satu atau banyak berkas sekaligus. Sistem menghitung checksum SHA-256 untuk memastikan tidak ada duplikasi dan mendeteksi profil data kelautan secara cerdas.
                </p>
              </div>
              <div className="text-xs font-mono px-3 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-400">
                {batchQueue.length} / 15 Sampel
              </div>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files) {
                  handleBatchFiles(e.dataTransfer.files);
                }
              }}
              className="border-2 border-dashed border-slate-800 hover:border-cyan-500 rounded-xl p-8 text-center bg-slate-950/40 transition-colors"
            >
              <input
                type="file"
                id="batchInput"
                multiple
                accept=".xml,.json,.geojson,.zip"
                onChange={(e) => {
                  if (e.target.files) handleBatchFiles(e.target.files);
                }}
                className="hidden"
              />
              <UploadCloud className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <label
                htmlFor="batchInput"
                className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer block"
              >
                Klik di sini untuk memilih berkas sampel, atau seret & jatuhkan berkas ke area ini
              </label>
              <p className="text-xs text-slate-500 mt-1">
                Mendukung .xml (ISO 19115-3 mdb, ISO 19139 gmd & Esri), .json (Katalog), .geojson, dan Shapefile .zip
              </p>
            </div>
          </div>

          {/* Batch Queue Table */}
          {batchQueue.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/70">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <span>Daftar Berkas Sampel Siap Diproses ({batchQueue.length})</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                      {batchQueue.filter((it) => it.isValid).length} Berkas Valid
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Anda dapat mendaftarkan berkas langsung ke inventaris atau menjalankan audit otomatis secara serentak.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {onBatchRegister && (
                    <button
                      type="button"
                      disabled={isProcessing || batchQueue.filter((it) => it.isValid).length === 0}
                      onClick={() => {
                        const validItems = batchQueue
                          .filter((it) => it.isValid)
                          .map((it) => ({
                            file: it.file,
                            profile: it.detectedProfile,
                            format: it.format,
                            checksum: it.checksum,
                          }));
                        onBatchRegister(validItems);
                      }}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 active:bg-slate-750 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Simpan berkas ke katalog Inventaris dengan status Belum Diaudit"
                    >
                      <Database className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Daftarkan ke Inventaris</span>
                    </button>
                  )}

                  {onBatchAudit && (
                    <button
                      type="button"
                      disabled={isProcessing || batchQueue.filter((it) => it.isValid).length === 0}
                      onClick={() => {
                        const validItems = batchQueue
                          .filter((it) => it.isValid)
                          .map((it) => ({
                            file: it.file,
                            profile: it.detectedProfile,
                            format: it.format,
                            checksum: it.checksum,
                          }));
                        onBatchAudit(validItems);
                      }}
                      className="px-3.5 py-2 text-xs font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                      title="Jalankan audit parameter dan spasial untuk seluruh berkas valid"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Audit Semua ({batchQueue.filter((it) => it.isValid).length})</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setBatchQueue([])}
                    className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors ml-1"
                    title="Kosongkan antrean"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-slate-800">
                {batchQueue.map((item, idx) => (
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-850/40 transition-colors">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="mt-1">
                        {item.isValid ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white text-xs truncate max-w-sm">
                            {item.name}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                            item.formatInfo?.category === 'xml_mdb'
                              ? 'bg-purple-950/80 border-purple-800 text-purple-300'
                              : item.formatInfo?.category === 'xml_gmd'
                              ? 'bg-cyan-950/80 border-cyan-800 text-cyan-300'
                              : item.formatInfo?.category === 'geojson'
                              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                              : item.formatInfo?.category === 'json_catalog'
                              ? 'bg-amber-950/80 border-amber-800 text-amber-300'
                              : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}>
                            {item.format}
                          </span>
                          {item.formatInfo?.rootElement && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 hidden md:inline-block">
                              {item.formatInfo.rootElement}
                            </span>
                          )}
                          {item.isDuplicate && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-800 text-amber-300">
                              Terdaftar ({item.existingInvNumber})
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-mono mt-1">
                          <span>Ukuran: {(item.sizeBytes / 1024).toFixed(1)} KB</span>
                          <span>SHA-256: {item.checksum.substring(0, 12)}...</span>
                          {item.validationError && (
                            <span className="text-rose-400">{item.validationError}</span>
                          )}
                        </div>

                        {item.coreSummary && (
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 flex items-center gap-1">
                              <Code2 className="w-2.5 h-2.5" />
                              <span>XPath Valid</span>
                            </span>
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border flex items-center gap-1 ${
                              item.coreSummary.title ? 'bg-slate-900 border-slate-750 text-slate-300' : 'bg-rose-950/40 border-rose-900 text-rose-400'
                            }`}>
                              <span>Judul: {item.coreSummary.title ? '✓' : '✗'}</span>
                            </span>
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border flex items-center gap-1 ${
                              item.coreSummary.contactOrg ? 'bg-slate-900 border-slate-750 text-slate-300' : 'bg-amber-950/40 border-amber-900 text-amber-400'
                            }`}>
                              <span>Kontak: {item.coreSummary.contactOrg ? '✓' : '✗'}</span>
                            </span>
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border flex items-center gap-1 ${
                              item.coreSummary.citationDate ? 'bg-slate-900 border-slate-750 text-slate-300' : 'bg-slate-950 border-slate-800 text-slate-500'
                            }`}>
                              <span>Sitasi: {item.coreSummary.citationDate ? '✓' : '✗'}</span>
                            </span>
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border flex items-center gap-1 ${
                              item.coreSummary.standardName ? 'bg-slate-900 border-slate-750 text-slate-300' : 'bg-slate-950 border-slate-800 text-slate-500'
                            }`}>
                              <span>Standar: {item.coreSummary.standardName ? '✓' : '0'}</span>
                            </span>
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border flex items-center gap-1 ${
                              item.coreSummary.hasBBox ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'
                            }`}>
                              <Globe2 className="w-2.5 h-2.5" />
                              <span>BBox: {item.coreSummary.hasBBox ? '✓' : '✗'}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Profile selector per item & action */}
                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={item.detectedProfile}
                        onChange={(e) => {
                          const val = e.target.value as DatasetProfileId;
                          setBatchQueue((prev) =>
                            prev.map((it) => (it.id === item.id ? { ...it, detectedProfile: val } : it))
                          );
                        }}
                        className="bg-slate-950 border border-slate-800 text-[11px] text-slate-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      >
                        {(Object.keys(DATASET_PROFILES) as DatasetProfileId[]).map((pKey) => (
                          <option key={pKey} value={pKey}>
                            {DATASET_PROFILES[pKey].name}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => handleAuditQueueItem(item)}
                        disabled={!item.isValid || isProcessing}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 rounded transition-colors inline-flex items-center gap-1"
                      >
                        <Play className="w-3 h-3" />
                        <span>Audit File Ini</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBatchQueue((prev) => prev.filter((it) => it.id !== item.id))}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

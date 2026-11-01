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
} from 'lucide-react';
import { DATASET_PROFILES } from '../audit/methodology';
import { DatasetProfileId } from '../types/audit';
import { MetadataRecord } from '../types/inventory';
import { computeChecksum } from '../utils/checksum';
import { InventoryStorageEngine } from '../storage/inventoryStore';
import { parseXmlMetadata } from '../parsers/xmlParser';
import { parseJsonMetadata } from '../parsers/jsonParser';
import { parseGeoJson } from '../parsers/geoJsonParser';

interface UploadQueueItem {
  id: string;
  file: File;
  name: string;
  format: string;
  sizeBytes: number;
  checksum: string;
  detectedProfile: DatasetProfileId;
  isValid: boolean;
  validationError?: string;
  isDuplicate: boolean;
  existingInvNumber?: string;
}

interface SingleSummaryData {
  title: string;
  fileName: string;
  format: string;
  sizeBytes: number;
  checksum: string;
  metadataDate?: string;
  hasSpatial: boolean;
  spatialBounds?: [number, number, number, number];
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
    profile: DatasetProfileId;
    isValid: boolean;
    error?: string;
  }> => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    let format = 'Unknown';
    let profile: DatasetProfileId = 'kelautan_umum';
    let isValid = true;
    let error: string | undefined;

    if (ext === 'xml') {
      try {
        const text = await file.text();
        if (text.includes('mdb:MD_Metadata') || text.includes('xmlns:mdb')) {
          format = 'XML (ISO 19115-3:2021 / mdb)';
        } else if (text.includes('gmd:MD_Metadata') || text.includes('MD_Metadata')) {
          format = 'XML (ISO 19139 / gmd)';
        } else if (text.includes('<idinfo>') || text.includes('<metadata')) {
          format = 'XML (Esri/ArcGIS)';
        } else {
          format = 'XML Metadata';
        }

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
      } catch (err: any) {
        isValid = false;
        error = `Gagal membaca berkas XML: ${err?.message}`;
      }
    } else if (ext === 'json') {
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        if (parsed.type === 'FeatureCollection' || parsed.type === 'Feature') {
          format = 'GeoJSON Spasial';
          profile = 'kelautan_umum';
        } else {
          format = 'JSON Katalog Metadata';
          const lower = text.toLowerCase();
          if (lower.includes('konservasi') || lower.includes('kkp3k')) profile = 'kawasan_konservasi';
          else if (lower.includes('batimetri')) profile = 'batimetri';
        }
      } catch (err: any) {
        isValid = false;
        error = `Sintaks JSON tidak valid: ${err?.message}`;
      }
    } else if (ext === 'geojson') {
      format = 'GeoJSON Spasial';
      profile = 'kelautan_umum';
    } else if (ext === 'zip') {
      format = 'Shapefile ZIP';
      profile = 'kelautan_umum';
    } else {
      isValid = false;
      error = `Format berkas .${ext} tidak didukung. Harap gunakan berkas XML (ISO/Esri), JSON Katalog, GeoJSON, atau Shapefile ZIP.`;
    }

    return { format, profile, isValid, error };
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
        const { format, profile, isValid, error } = await detectFileAttributes(file);

        // Check if checksum already exists in persistent database
        const existingRec = InventoryStorageEngine.getRecordByChecksum(checksum);

        newItems.push({
          id: `QUEUE-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
          file,
          name: file.name,
          format,
          sizeBytes: file.size,
          checksum,
          detectedProfile: profile,
          isValid,
          validationError: error,
          isDuplicate: !!existingRec,
          existingInvNumber: existingRec?.inventoryNumber,
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
        const { format, profile } = await detectFileAttributes(targetFile);

        let title = targetFile.name.replace(/\.[^/.]+$/, '');
        let metadataDate: string | undefined;
        let hasSpatial = false;
        let spatialBounds: [number, number, number, number] | undefined;

        const ext = targetFile.name.split('.').pop()?.toLowerCase();
        if (ext === 'xml') {
          const text = new TextDecoder().decode(buffer);
          const meta = parseXmlMetadata(text, targetFile.name);
          if (meta.title) title = meta.title;
          if (meta.temporalExtent?.publicationDate) metadataDate = meta.temporalExtent.publicationDate;
          if (meta.spatialExtent?.westBoundLongitude !== undefined) {
            hasSpatial = true;
            spatialBounds = [
              meta.spatialExtent.westBoundLongitude,
              meta.spatialExtent.southBoundLatitude || 0,
              meta.spatialExtent.eastBoundLongitude || 0,
              meta.spatialExtent.northBoundLatitude || 0,
            ];
          }
        } else if (ext === 'json') {
          const text = new TextDecoder().decode(buffer);
          const meta = parseJsonMetadata(text, targetFile.name);
          if (meta.title) title = meta.title;
          if (meta.temporalExtent?.publicationDate) metadataDate = meta.temporalExtent.publicationDate;
        } else if (ext === 'geojson') {
          const text = new TextDecoder().decode(buffer);
          const sp = parseGeoJson(text, targetFile.name);
          hasSpatial = true;
          spatialBounds = sp.bounds;
        }

        if (!isCancelled) {
          setSingleSummary({
            title,
            fileName: targetFile.name,
            format,
            sizeBytes: targetFile.size,
            checksum,
            metadataDate,
            hasSpatial,
            spatialBounds,
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
      if (ext !== 'xml' && ext !== 'json') {
        setValidationError(`Format "${file.name}" tidak didukung sebagai dokumen metadata. Harap gunakan .xml atau .json.`);
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
      if (ext === 'xml' || ext === 'json') {
        setValidationError(null);
        setMetadataFile(file);
      } else {
        setValidationError(`Berkas "${file.name}" bukan berkas XML/JSON metadata.`);
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
                accept=".xml,.json"
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
                Format didukung: XML ISO 19115-3 (mdb), ISO 19139 (gmd), XML Esri, JSON Katalog
              </p>

              {metadataFile && (
                <div className="mt-4 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 font-mono flex items-center justify-between w-full max-w-xs">
                  <span className="truncate">{metadataFile.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMetadataFile(null);
                    }}
                    className="text-emerald-400 hover:text-white ml-2"
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

          {/* Tahap 2: Ringkasan Metadata Terbaca Pra-Audit */}
          {singleSummary && (
            <div className="bg-slate-900 border border-cyan-800/80 rounded-xl p-5 space-y-4 animate-in fade-in shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-700 flex items-center justify-center text-cyan-400 shrink-0">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <span>Tahap 2: Ringkasan Metadata Terbaca</span>
                      {isReadingSingle && <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" />}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Sistem membaca elemen awal berkas sebelum tombol Jalankan Audit ditekan.
                    </p>
                  </div>
                </div>

                <div>
                  {singleSummary.isDuplicate ? (
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-amber-950/90 border border-amber-800 text-amber-300 font-semibold flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>Terdaftar ({singleSummary.existingRecord?.inventoryNumber}) - Akan dibuat sesi histori baru</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-emerald-950/90 border border-emerald-800 text-emerald-300 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Berkas Baru (Siap Didaftarkan ke Inventaris)</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-850">
                  <span className="text-slate-500 text-[10px] uppercase font-mono block">Judul Teridentifikasi</span>
                  <span className="font-semibold text-white truncate block mt-0.5" title={singleSummary.title}>
                    {singleSummary.title}
                  </span>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-850">
                  <span className="text-slate-500 text-[10px] uppercase font-mono block">Format & Ukuran</span>
                  <span className="font-mono text-cyan-400 block mt-0.5">
                    {singleSummary.format} · {(singleSummary.sizeBytes / 1024).toFixed(1)} KB
                  </span>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-850">
                  <span className="text-slate-500 text-[10px] uppercase font-mono block">Checksum SHA-256</span>
                  <span className="font-mono text-slate-300 text-[11px] truncate block mt-0.5" title={singleSummary.checksum}>
                    {singleSummary.checksum.substring(0, 16)}...
                  </span>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-850">
                  <span className="text-slate-500 text-[10px] uppercase font-mono block">Cakupan Geospasial</span>
                  <span className="font-mono text-emerald-400 text-[11px] block mt-0.5 flex items-center gap-1">
                    <Globe2 className="w-3.5 h-3.5" />
                    <span>{singleSummary.hasSpatial ? 'Koordinat Terdeteksi' : 'Belum Ada Geometri'}</span>
                  </span>
                </div>
              </div>

              {singleSummary.metadataDate && (
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 pt-1 border-t border-slate-850">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Tanggal Dokumen Metadata: <strong className="text-slate-200">{singleSummary.metadataDate}</strong></span>
                </div>
              )}
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
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                            {item.format}
                          </span>
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

/**
 * KOMPAS - Audit Results & Diagnostic Dashboard (v7 Aligned)
 * Displays Skor Utama (32 Elemen), MQI Biner, MQI Diperluas, MQI Ketat,
 * Skor Inti (26 Elemen), Skor Ekstensi (E27–E32), 32 Elements Table with O/U/M modes,
 * Manual Review Panel, Empty Elements sorted by weight descending, Quality Flags F01-F14,
 * Benchmark Explorer D01–D18, JSON Config Manager, and 17-column CSV & JSON exports.
 */

import React, { useState } from 'react';
import {
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileSpreadsheet,
  Download,
  Printer,
  Search,
  Filter,
  Eye,
  Layers,
  MapPin,
  FileText,
  Info,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
  Compass,
  Globe2,
  ArrowRight,
  Sparkles,
  BarChart3,
  Edit3,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  FolderOpen,
  Settings,
  UploadCloud,
} from 'lucide-react';
import { AuditReport, MQICategory, ParameterAuditResult } from '../types/audit';
import {
  getConfigElements,
  getOpenDecisions,
  updateOpenDecisions,
  getRuleVersion,
  loadCustomConfig,
  resetToDefaultConfig,
  ElementConfigItem,
} from '../audit/configLoader';
import { calculateV7Scores, V7ScoreResult } from '../audit/v7Scoring';
import { QUALITY_FLAGS_DEFINITIONS, QualityFlagResult } from '../audit/flags';
import { getBenchmarkDatasetsV7, BenchmarkDatasetV7 } from '../data/benchmarksV7';
import { EvidenceModal } from './EvidenceModal';
import { OpenStreetMapViewer } from './OpenStreetMapViewer';
import { AuditComparisonBarChart } from './AuditComparisonBarChart';
import { ManualReviewPanel } from './ManualReviewPanel';
import { BenchmarkExplorerModal } from './BenchmarkExplorerModal';
import { RecommendationsPanel } from './RecommendationsPanel';
import { generateActionableRecommendations, calculateScoreProjection } from '../audit/recommendations';
import { resolveSpatialFromReport } from '../utils/spatialHelper';

interface AuditResultsViewProps {
  report: AuditReport;
  onBackToDashboard: () => void;
}

export const AuditResultsView: React.FC<AuditResultsViewProps> = ({
  report,
  onBackToDashboard,
}) => {
  const elements = getConfigElements();
  const openDecisions = getOpenDecisions();

  const [selectedResult, setSelectedResult] = useState<ParameterAuditResult | null>(null);
  const [activeTab, setActiveTab] = useState<
    'v7elements' | 'recommendations' | 'manualReview' | 'emptyElements' | 'warnings' | 'benchmarks' | 'categories' | 'config' | 'map'
  >('v7elements');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedModeFilter, setSelectedModeFilter] = useState<string>('all');
  const [isBenchmarkModalOpen, setIsBenchmarkModalOpen] = useState<boolean>(false);

  // Manual Overrides State & Auditor Notes
  const [manualOverrides, setManualOverrides] = useState<
    Record<string, { value: number; notes: string; auditorName?: string; updatedAt: string }>
  >(report.manualOverrides || {});
  const [auditorNotes, setAuditorNotes] = useState<string>(report.auditorNotes || '');
  const [activeDatasetTitle, setActiveDatasetTitle] = useState<string>(report.datasetName);
  const [activeFormat, setActiveFormat] = useState<string>(report.statusSkema || report.normalizedMetadata?.rawFormat || 'gmd');
  const [configUploadError, setConfigUploadError] = useState<string | null>(null);
  const [configUploadSuccess, setConfigUploadSuccess] = useState<string | null>(null);

  // Starting element scores across all 32 elements
  const [elementScores, setElementScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const el of elements) {
      if (report.elementValuesV7 && report.elementValuesV7[el.id] !== undefined) {
        initial[el.id] = report.elementValuesV7[el.id];
      } else {
        const matched = report.coreElementsResults?.find(r => r.elementId === el.id || r.ruleId === el.id);
        initial[el.id] = matched?.status === 'terpenuhi' ? 1 : matched?.status === 'perlu_ditinjau' ? 0.5 : 0;
      }
    }
    // Apply initial manual overrides if present
    if (report.manualOverrides) {
      for (const [k, v] of Object.entries(report.manualOverrides)) {
        initial[k] = v.value;
      }
    }
    return initial;
  });

  // Calculate live V7 scores reactive to manual overrides
  const activeV7 = calculateV7Scores(elementScores);
  const spatialData = resolveSpatialFromReport(report);

  // Handle manual override change
  const handleOverrideChange = (elementId: string, value: number, notes: string) => {
    const updatedOverrides = {
      ...manualOverrides,
      [elementId]: {
        value,
        notes,
        auditorName: 'Auditor KOMPAS',
        updatedAt: new Date().toISOString(),
      },
    };
    setManualOverrides(updatedOverrides);
    setElementScores(prev => ({ ...prev, [elementId]: value }));
  };

  // Reset override back to auto score
  const handleResetOverride = (elementId: string) => {
    const updatedOverrides = { ...manualOverrides };
    delete updatedOverrides[elementId];
    setManualOverrides(updatedOverrides);

    // Revert to original auto score
    const autoScore = report.elementValuesV7?.[elementId] ?? 0;
    setElementScores(prev => ({ ...prev, [elementId]: autoScore }));
  };

  // Load a reference dataset from Excel v7
  const handleLoadBenchmarkDataset = (benchmark: BenchmarkDatasetV7) => {
    setActiveDatasetTitle(benchmark.title);
    setActiveFormat(benchmark.format);
    setElementScores({ ...benchmark.scores });
  };

  // Handle custom JSON config upload (e.g. v8)
  const handleConfigUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const res = loadCustomConfig(content);
      if (res.success) {
        setConfigUploadSuccess(`Konfigurasi aturan berhasil diperbarui: Versi ${res.version}`);
        setConfigUploadError(null);
      } else {
        setConfigUploadError(res.errors?.join('; ') || 'Gagal memvalidasi JSON konfigurasi.');
        setConfigUploadSuccess(null);
      }
    };
    reader.readAsText(file);
  };

  // Helper to determine true source group name per Section 14 (not internal profileId)
  const resolveSourceGroup = (title: string, rep: AuditReport): string => {
    const benchmarks = getBenchmarkDatasetsV7();
    const matchedBenchmark = benchmarks.find(
      b => b.title.toLowerCase().trim() === title.toLowerCase().trim() || b.id === rep.id
    );
    if (matchedBenchmark?.sourceGroup) {
      return matchedBenchmark.sourceGroup;
    }
    const profileMap: Record<string, string> = {
      batimetri: 'BIG / Hidrografi',
      kelautan_umum: 'Portal daerah',
      kawasan_konservasi: 'Portal KKP',
      terumbu_karang: 'Portal KKP',
      mangrove: 'Portal KKP',
      habitat_bentik: 'Portal KKP',
      arkeologi_maritim: 'Portal KKP',
      jalur_migrasi: 'Portal daerah',
    };
    return profileMap[rep.profileId] || 'Portal daerah';
  };

  // Format machine vs override record per Section 14
  const formatMachineVsOverride = () => {
    const entries = Object.entries(manualOverrides);
    if (entries.length === 0) return '-';
    return entries
      .map(([elId, ov]) => {
        const machineVal = report.elementValuesV7?.[elId] ?? 0.5;
        return `${elId}[mesin=${machineVal},override=${ov.value}${ov.notes ? `,catatan=${ov.notes.replace(/[;,\n]/g, ' ')}` : ''}]`;
      })
      .join('; ');
  };

  // 17-Column Single-Dataset Export CSV (Section 14 Compliant)
  const handleExportCsv = () => {
    const catScores = [
      activeV7.categoryScores['Informasi umum']?.toFixed(1) || '0.0',
      activeV7.categoryScores['Identifikasi']?.toFixed(1) || '0.0',
      activeV7.categoryScores['Deskripsi']?.toFixed(1) || '0.0',
      activeV7.categoryScores['Cakupan']?.toFixed(1) || '0.0',
      activeV7.categoryScores['Ketelitian']?.toFixed(1) || '0.0',
      activeV7.categoryScores['Kontak']?.toFixed(1) || '0.0',
      activeV7.categoryScores['Meta-metadata']?.toFixed(1) || '0.0',
      activeV7.categoryScores['Pemrosesan']?.toFixed(1) || '0.0',
    ];

    const all32Values = elements.map(e => elementScores[e.id] ?? 0);
    const emptyListStr = activeV7.emptyElements.map(e => e.id).join(', ') || '-';
    const triggeredFlagsStr = (report.qualityFlags || []).filter(f => f.isTriggered).map(f => f.id).join(', ') || '-';
    const sourceGroup = resolveSourceGroup(activeDatasetTitle, report);
    const machineVsOverrideStr = formatMachineVsOverride();

    const headers = [
      'Dataset_ID',
      'Judul_Dataset',
      'Kelompok_Sumber',
      'Status_Format',
      'Skor_Utama_Skema_A',
      'Skor_MQI_Biner',
      'Skor_MQI_Diperluas',
      'Kategori_MQI_Diperluas',
      'Kategori_MQI_Biner',
      'Skor_Inti_26_SkorA',
      'Skor_Inti_26_MQIBiner',
      'Skor_Inti_26_MQIDiperluas',
      'Skor_Ekstensi_6',
      'Skor_Kat_InfoUmum',
      'Skor_Kat_Identifikasi',
      'Skor_Kat_Deskripsi',
      'Skor_Kat_Cakupan',
      'Skor_Kat_Ketelitian',
      'Skor_Kat_Kontak',
      'Skor_Kat_MetaMetadata',
      'Skor_Kat_Pemrosesan',
      ...elements.map(e => `Nilai_${e.id}`),
      'Elemen_Kosong',
      'Penanda_Kualitas',
      'Nilai_Mesin_vs_Override',
      'Catatan_Auditor',
      'Versi_Aturan',
    ];

    const row = [
      `"${report.id}"`,
      `"${(activeDatasetTitle || '').replace(/"/g, '""')}"`,
      `"${sourceGroup}"`,
      `"${activeFormat}"`,
      activeV7.skorA.toFixed(2),
      activeV7.mqiBiner.toFixed(2),
      activeV7.mqiDiperluas.toFixed(2),
      `"${activeV7.kategoriDiperluas}"`,
      `"${activeV7.kategoriBiner}"`,
      activeV7.skorAInti.toFixed(2),
      activeV7.mqiBinerInti.toFixed(2),
      activeV7.mqiDiperluasInti.toFixed(2),
      activeV7.skorEkstensi.toFixed(2),
      ...catScores,
      ...all32Values,
      `"${emptyListStr}"`,
      `"${triggeredFlagsStr}"`,
      `"${machineVsOverrideStr.replace(/"/g, '""')}"`,
      `"${(auditorNotes || '-').replace(/"/g, '""')}"`,
      `"${activeV7.versiAturan}"`,
    ];

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + headers.join(',') + '\n' + row.join(',');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KOMPAS_Audit_${report.id}_${activeV7.versiAturan}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Batch Export 15 Datasets for Chapter 4 Heat Map & Evaluation Matrix (Section 14)
  const handleExportBatch15Csv = () => {
    const benchmarks = getBenchmarkDatasetsV7();
    const headers = [
      'Dataset_ID',
      'Judul_Dataset',
      'Kelompok_Sumber',
      'Status_Format',
      'Skor_Utama_Skema_A',
      'Skor_MQI_Biner',
      'Skor_MQI_Diperluas',
      'Kategori_MQI_Diperluas',
      'Kategori_MQI_Biner',
      'Skor_Inti_26_SkorA',
      'Skor_Inti_26_MQIBiner',
      'Skor_Inti_26_MQIDiperluas',
      'Skor_Ekstensi_6',
      'Skor_Kat_InfoUmum',
      'Skor_Kat_Identifikasi',
      'Skor_Kat_Deskripsi',
      'Skor_Kat_Cakupan',
      'Skor_Kat_Ketelitian',
      'Skor_Kat_Kontak',
      'Skor_Kat_MetaMetadata',
      'Skor_Kat_Pemrosesan',
      ...elements.map(e => `Nilai_${e.id}`),
      'Elemen_Kosong',
      'Penanda_Kualitas',
      'Nilai_Mesin_vs_Override',
      'Versi_Aturan',
    ];

    const rows = benchmarks.map(b => {
      const eScores = elements.map(el => b.scores[el.id] ?? 0);
      const cat = b.categoryPercentages;
      return [
        `"${b.id}"`,
        `"${b.title.replace(/"/g, '""')}"`,
        `"${b.sourceGroup}"`,
        `"${b.format}"`,
        b.expectedSkorA.toFixed(2),
        b.expectedMqiBiner.toFixed(2),
        b.expectedMqiDiperluas.toFixed(2),
        `"${b.expectedKategoriDiperluas}"`,
        `"${b.expectedKategoriBiner}"`,
        b.expectedSkorAInti.toFixed(2),
        b.expectedMqiBinerInti.toFixed(2),
        b.expectedMqiDiperluasInti.toFixed(2),
        b.expectedSkorEkstensi.toFixed(2),
        cat.informasiUmum.toFixed(1),
        cat.identifikasi.toFixed(1),
        cat.deskripsi.toFixed(1),
        cat.cakupan.toFixed(1),
        cat.ketelitian.toFixed(1),
        cat.kontak.toFixed(1),
        cat.metaMetadata.toFixed(1),
        cat.pemrosesan.toFixed(1),
        ...eScores,
        `"${b.emptyElementsList.join(', ') || '-'}"`,
        `"${b.expectedFlags.join(', ') || '-'}"`,
        `"-"`,
        `"${activeV7.versiAturan}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + headers.join(',') + '\n' + rows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KOMPAS_Bab4_Matriks_15_Dataset_${activeV7.versiAturan}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 17-Column Export JSON implementation
  const handleExportJson = () => {
    const sourceGroup = resolveSourceGroup(activeDatasetTitle, report);
    const exportData = {
      ID_Dataset: report.id,
      Judul_Dataset: activeDatasetTitle,
      Kelompok_Sumber: sourceGroup,
      Status_Format: activeFormat,
      Skor_Utama_Skema_A: Number(activeV7.skorA.toFixed(4)),
      Skor_MQI_Biner: Number(activeV7.mqiBiner.toFixed(4)),
      Skor_MQI_Diperluas: Number(activeV7.mqiDiperluas.toFixed(4)),
      MQI_Ketat: Number(activeV7.mqiKetat.toFixed(4)),
      Kategori_MQI_Diperluas: activeV7.kategoriDiperluas,
      Kategori_MQI_Biner: activeV7.kategoriBiner,
      Skor_Inti_26_SkorA: Number(activeV7.skorAInti.toFixed(4)),
      Skor_Inti_26_MQIBiner: Number(activeV7.mqiBinerInti.toFixed(4)),
      Skor_Inti_26_MQIDiperluas: Number(activeV7.mqiDiperluasInti.toFixed(4)),
      Kategori_Inti_Diperluas: activeV7.kategoriInti,
      Skor_Ekstensi_6: Number(activeV7.skorEkstensi.toFixed(4)),
      Skor_8_Kategori: activeV7.categoryScores,
      Nilai_E01_sd_E32: Object.fromEntries(
        elements.map(e => [e.id, elementScores[e.id] ?? 0])
      ),
      Daftar_Elemen_Kosong: activeV7.emptyElements,
      Daftar_Elemen_Belum_Dinilai: elements
        .filter(e => openDecisions.assessmentModes[e.id] === 'M' && manualOverrides[e.id] === undefined)
        .map(e => e.id),
      Penanda_Kualitas: (report.qualityFlags || []).filter(f => f.isTriggered).map(f => ({
        id: f.id,
        name: f.name,
        evidence: f.evidence,
      })),
      Nilai_Mesin_vs_Override: Object.entries(manualOverrides).map(([elId, ov]) => ({
        elementId: elId,
        machineValue: report.elementValuesV7?.[elId] ?? 0.5,
        auditorOverrideValue: ov.value,
        notes: ov.notes,
        updatedAt: ov.updatedAt,
      })),
      Catatan_Auditor: auditorNotes,
      Versi_Aturan: activeV7.versiAturan,
      Waktu_Audit: report.timestamp,
    };

    const jsonContent = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonContent);
    link.setAttribute('download', `KOMPAS_Audit_${report.id}_${activeV7.versiAturan}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Batch Export 15 Datasets as JSON
  const handleExportBatch15Json = () => {
    const benchmarks = getBenchmarkDatasetsV7();
    const batchData = {
      judul: 'Matriks Evaluasi Kualitas Metadata Geospasial Maritim (15 Dataset Sampel Bab 4)',
      versi_aturan: activeV7.versiAturan,
      total_dataset: benchmarks.length,
      datasets: benchmarks.map(b => ({
        Dataset_ID: b.id,
        Judul_Dataset: b.title,
        Kelompok_Sumber: b.sourceGroup,
        Status_Format: b.format,
        Skor_Utama_Skema_A: b.expectedSkorA,
        Skor_MQI_Biner: b.expectedMqiBiner,
        Skor_MQI_Diperluas: b.expectedMqiDiperluas,
        Kategori_MQI_Diperluas: b.expectedKategoriDiperluas,
        Kategori_MQI_Biner: b.expectedKategoriBiner,
        Skor_Inti_26_SkorA: b.expectedSkorAInti,
        Skor_Inti_26_MQIBiner: b.expectedMqiBinerInti,
        Skor_Inti_26_MQIDiperluas: b.expectedMqiDiperluasInti,
        Skor_Ekstensi_6: b.expectedSkorEkstensi,
        Skor_8_Kategori: b.categoryPercentages,
        Nilai_E01_sd_E32: b.scores,
        Elemen_Kosong: b.emptyElementsList,
        Penanda_Kualitas: b.expectedFlags,
      })),
    };

    const jsonContent = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(batchData, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonContent);
    link.setAttribute('download', `KOMPAS_Bab4_Matriks_15_Dataset_${activeV7.versiAturan}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggeredFlags = (report.qualityFlags || []).filter(f => f.isTriggered);
  const recommendations = generateActionableRecommendations(report, elements, elementScores, triggeredFlags);
  const scoreProjection = calculateScoreProjection(activeV7, elements, elementScores);

  // Filter elements for the 32 elements table
  const filteredElements = elements.filter(el => {
    const elMode = openDecisions.assessmentModes[el.id] || 'O';
    const score = elementScores[el.id] ?? 0;

    const matchesSearch =
      el.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.kategori.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'all' || el.kategori === selectedCategory;
    const matchesMode = selectedModeFilter === 'all' || elMode === selectedModeFilter;

    return matchesSearch && matchesCat && matchesMode;
  });

  return (
    <div className="space-y-8">
      {/* Benchmark Explorer Modal */}
      <BenchmarkExplorerModal
        isOpen={isBenchmarkModalOpen}
        onClose={() => setIsBenchmarkModalOpen(false)}
        onSelectDataset={handleLoadBenchmarkDataset}
      />

      {/* Detail Evidence Modal */}
      {selectedResult && (
        <EvidenceModal
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
        />
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1 flex-wrap">
            <span>ID: {report.id}</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{report.profileId.replace('_', ' ')}</span>
            <span aria-hidden="true">·</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold uppercase">
              Format: {activeFormat}
            </span>
            <span aria-hidden="true">·</span>
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold">
              Versi Aturan: {activeV7.versiAturan}
            </span>
            <span aria-hidden="true">·</span>
            <span>{new Date(report.timestamp).toLocaleString('id-ID')}</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {activeDatasetTitle}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsBenchmarkModalOpen(true)}
            className="px-3 py-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/80 border border-cyan-800/80 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Matriks Acuan Uji (D01–D18)</span>
          </button>
          <button
            onClick={handleExportCsv}
            title="Ekspor laporan dataset ini dalam 17 kolom standar"
            className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV (Dataset Aktif)</span>
          </button>
          <button
            onClick={handleExportBatch15Csv}
            title="Ekspor 15 baris dataset sekaligus untuk peta panas & matriks evaluasi Bab 4"
            className="px-3 py-2 text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-950/70 border border-amber-800/80 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor 15 Dataset Bab 4 (CSV Matriks)</span>
          </button>
          <button
            onClick={handleExportJson}
            className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor JSON</span>
          </button>
          <button
            onClick={handleExportBatch15Json}
            className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Batch 15 (JSON)</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak</span>
          </button>
        </div>
      </div>

      {/* 4 Headline Score Cards + Core Score + Extension Score */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Skor A (Bobot Kategori 32 Elemen) */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-cyan-950/40 border border-cyan-800/60 rounded-2xl p-4 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-cyan-400 mb-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Skor A (32 Elemen)</span>
            <Award className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black font-mono text-white tabular-nums">
            {activeV7.skorA.toFixed(1)}
            <span className="text-sm font-normal text-slate-400 ml-1">/ 100</span>
          </div>
          <div className="text-[11px] text-cyan-300 font-medium mt-1">
            Skema A (Bobot Kategori)
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Skor Utama KOMPAS v7</div>
        </div>

        {/* MQI Biner (32 Elemen) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">MQI Biner (32)</span>
            <Compass className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black font-mono text-cyan-300 tabular-nums">
            {activeV7.mqiBiner.toFixed(1)}
            <span className="text-sm font-normal text-slate-400 ml-1">%</span>
          </div>
          <div className="text-[11px] text-slate-300 font-medium mt-1">
            Kategori: <strong className="text-white">{activeV7.kategoriBiner}</strong>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Hasara (2026) Formula</div>
        </div>

        {/* MQI Diperluas (32 Elemen) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">MQI Diperluas (32)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black font-mono text-emerald-400 tabular-nums">
            {activeV7.mqiDiperluas.toFixed(1)}
            <span className="text-sm font-normal text-slate-400 ml-1">%</span>
          </div>
          <div className="text-[11px] text-slate-300 font-medium mt-1">
            Kategori: <strong className="text-white">{activeV7.kategoriDiperluas}</strong>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">3 Tingkat (1, 0.5, 0)</div>
        </div>

        {/* MQI Ketat (32 Elemen) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">MQI Ketat (32)</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black font-mono text-purple-300 tabular-nums">
            {activeV7.mqiKetat.toFixed(1)}
            <span className="text-sm font-normal text-slate-400 ml-1">%</span>
          </div>
          <div className="text-[11px] text-slate-300 font-medium mt-1">
            Hanya Nilai 1
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Sensitivitas Ketat</div>
        </div>

        {/* Skor Inti (26 Elemen) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Skor Inti (26)</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black font-mono text-amber-300 tabular-nums">
            {activeV7.skorAInti.toFixed(1)}
            <span className="text-sm font-normal text-slate-400 ml-1">%</span>
          </div>
          <div className="text-[11px] text-slate-300 font-medium mt-1">
            MQI Inti: {activeV7.mqiDiperluasInti.toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Pembanding Paper Asli</div>
        </div>

        {/* Skor Ekstensi (E27–E32) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Ekstensi (E27–E32)</span>
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black font-mono text-cyan-300 tabular-nums">
            {activeV7.skorEkstensi.toFixed(1)}
            <span className="text-sm font-normal text-slate-400 ml-1">%</span>
          </div>
          <div className="text-[11px] text-slate-300 font-medium mt-1">
            Bobot: 11 poin
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">ISO 19115-3 / MDB</div>
        </div>
      </div>

      {/* Diagnostics Strip: Item Counts & Status */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Nilai 1.0: <strong>{activeV7.countScore1}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <AlertCircle className="w-4 h-4" />
            <span>Nilai 0.5: <strong>{activeV7.countScore05}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-400">
            <XCircle className="w-4 h-4" />
            <span>Nilai 0.0 (Kosong): <strong>{activeV7.countScore0}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Edit3 className="w-4 h-4" />
            <span>Manual Override: <strong>{Object.keys(manualOverrides).length}</strong></span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('recommendations')}
            className="flex items-center gap-1.5 text-cyan-300 hover:text-cyan-200 transition-colors bg-cyan-950/60 hover:bg-cyan-900/60 px-2.5 py-1 rounded-lg border border-cyan-800"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Rekomendasi: <strong>{recommendations.length} Panduan</strong></span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {triggeredFlags.length > 0 ? (
            <span className="px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-800 text-amber-300 flex items-center gap-1.5 font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{triggeredFlags.length} Penanda Peringatan Terdeteksi</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>0 Penanda Peringatan</span>
            </span>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('v7elements')}
          className={`py-3 px-4 text-xs font-bold transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'v7elements'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>32 Elemen Metadata (E01–E32)</span>
        </button>

        <button
          onClick={() => setActiveTab('recommendations')}
          className={`py-3 px-4 text-xs font-bold transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'recommendations'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Rekomendasi Perbaikan ({recommendations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('manualReview')}
          className={`py-3 px-4 text-xs font-bold transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'manualReview'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Edit3 className="w-4 h-4 text-amber-400" />
          <span>Penilaian Manual Auditor</span>
          {Object.keys(manualOverrides).length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 text-[10px]">
              {Object.keys(manualOverrides).length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('emptyElements')}
          className={`py-3 px-4 text-xs font-bold transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'emptyElements'
              ? 'border-rose-400 text-rose-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <XCircle className="w-4 h-4 text-rose-400" />
          <span>Elemen Perlu Diperbaiki ({activeV7.emptyElements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('warnings')}
          className={`py-3 px-4 text-xs font-bold transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'warnings'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Penanda Mutu ({triggeredFlags.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`py-3 px-4 text-xs font-bold transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'categories'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Skor 8 Kategori &amp; Diagram</span>
        </button>

        <button
          onClick={() => setActiveTab('benchmarks')}
          className={`py-3 px-4 text-xs font-bold transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'benchmarks'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Matriks Acuan Uji (D01–D18)</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`py-3 px-4 text-xs font-bold transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'config'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Konfigurasi Aturan JSON</span>
        </button>

        {spatialData.hasAdequateSpatial && (
          <button
            onClick={() => setActiveTab('map')}
            className={`py-3 px-4 text-xs font-bold transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'map'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Peta Spasial</span>
          </button>
        )}
      </div>

      {/* Tab 1: 32 Elements Table */}
      {activeTab === 'v7elements' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Cari elemen berdasarkan ID (misal: E04), nama, atau kategori..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-400"
              >
                <option value="all">Semua Kategori (8)</option>
                <option value="Informasi umum">Informasi umum</option>
                <option value="Identifikasi">Identifikasi</option>
                <option value="Deskripsi">Deskripsi</option>
                <option value="Cakupan">Cakupan</option>
                <option value="Ketelitian">Ketelitian</option>
                <option value="Kontak">Kontak</option>
                <option value="Meta-metadata">Meta-metadata</option>
                <option value="Pemrosesan">Pemrosesan</option>
              </select>

              <select
                value={selectedModeFilter}
                onChange={e => setSelectedModeFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-400"
              >
                <option value="all">Semua Mode (O / U / M)</option>
                <option value="M">Mode M (Wajib Manual)</option>
                <option value="U">Mode U (Usulan Mesin)</option>
                <option value="O">Mode O (Otomatis)</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/60 shadow-lg">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800 uppercase">
                <tr>
                  <th className="py-3 px-3">ID</th>
                  <th className="py-3 px-3">Nama Elemen</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-2 text-center">Bobot</th>
                  <th className="py-3 px-2 text-center">Mode</th>
                  <th className="py-3 px-3 text-center">Nilai</th>
                  <th className="py-3 px-3">Status Evaluasi</th>
                  <th className="py-3 px-3">Alasan / Bukti Ekstraksi</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredElements.map(el => {
                  const score = elementScores[el.id] ?? 0;
                  const isOverridden = manualOverrides[el.id] !== undefined;
                  const mode = openDecisions.assessmentModes[el.id] || 'O';

                  return (
                    <tr key={el.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-cyan-400 whitespace-nowrap">
                        {el.id}
                        {!el.inti && (
                          <span className="ml-1 text-[9px] px-1 rounded bg-purple-950 text-purple-300 border border-purple-800">
                            ext
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-medium text-white max-w-[200px]">
                        {el.nama}
                      </td>
                      <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{el.kategori}</td>
                      <td className="py-3 px-2 text-center font-mono font-bold text-amber-400">
                        {el.bobot}
                      </td>
                      <td className="py-3 px-2 text-center whitespace-nowrap">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            mode === 'M'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : mode === 'U'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {mode}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-base">
                        <span
                          className={`px-2.5 py-1 rounded-lg border ${
                            score === 1
                              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                              : score === 0.5
                              ? 'bg-amber-950/80 border-amber-800 text-amber-300'
                              : 'bg-rose-950/80 border-rose-800 text-rose-300'
                          }`}
                        >
                          {score}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {isOverridden ? (
                          <span className="text-amber-400 font-semibold flex items-center gap-1">
                            <Edit3 className="w-3 h-3" />
                            <span>Diverifikasi Auditor</span>
                          </span>
                        ) : mode === 'M' ? (
                          <span className="text-amber-300 font-medium">Menunggu Verifikasi</span>
                        ) : mode === 'U' ? (
                          <span className="text-cyan-300 font-medium">Usulan Mesin</span>
                        ) : (
                          <span className="text-slate-400 font-medium">Otomatis</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-300 max-w-xs text-[11px] leading-relaxed">
                        {isOverridden && manualOverrides[el.id].notes ? (
                          <div className="text-amber-300">
                            <strong>Catatan:</strong> {manualOverrides[el.id].notes}
                          </div>
                        ) : (
                          <div>{score === 1 ? el.kriteria1 : score === 0.5 ? el.kriteria05 : el.kriteria0}</div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setActiveTab('manualReview');
                          }}
                          className="text-xs text-cyan-400 hover:text-cyan-300 font-medium hover:underline focus:outline-none"
                        >
                          Telaah
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Rekomendasi Perbaikan & Score Projection */}
      {activeTab === 'recommendations' && (
        <RecommendationsPanel
          recommendations={recommendations}
          projection={scoreProjection}
          datasetName={activeDatasetTitle}
        />
      )}

      {/* Tab 2: Manual Review Panel */}
      {activeTab === 'manualReview' && (
        <ManualReviewPanel
          report={report}
          elementValues={elementScores}
          manualOverrides={manualOverrides}
          onOverrideChange={handleOverrideChange}
          onResetOverride={handleResetOverride}
        />
      )}

      {/* Tab 3: Empty Elements List sorted by weight impact */}
      {activeTab === 'emptyElements' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-400" />
                <span>Daftar Elemen Kosong (Nilai 0) — Diurutkan Berdasarkan Dampak Bobot</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Sesuai handover final: Elemen berbobot 3 (kritis) diprioritaskan terlebih dahulu, diikuti bobot 2, lalu bobot 1.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('recommendations')}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-colors shadow flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Buka Panduan Rekomendasi &amp; Snippet</span>
              </button>
              <span className="px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 font-mono font-bold text-xs">
                {activeV7.emptyElements.length} Elemen
              </span>
            </div>
          </div>

          {activeV7.emptyElements.length === 0 ? (
            <div className="text-center py-10 bg-slate-950/60 rounded-xl border border-slate-800/80 text-emerald-400">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-400" />
              <p className="font-semibold text-sm">Tidak ada elemen kosong! Seluruh 32 elemen terisi dan terverifikasi.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeV7.emptyElements.map(el => (
                <div
                  key={el.id}
                  className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2 hover:border-rose-900/60 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono font-bold text-xs">
                      {el.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        el.weight === 3
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : el.weight === 2
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      Bobot: {el.weight} {el.weight === 3 ? '(Kritis)' : el.weight === 2 ? '(Penting)' : '(Pendukung)'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{el.name}</h4>
                  <div className="text-xs text-slate-400">{el.category}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Quality Flags F01–F14 */}
      {activeTab === 'warnings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>Penanda Kualitas Metadata (F01–F14)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Dilaporkan terpisah dari skor MQI untuk transparansi penuh audit
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-300 font-mono font-bold text-xs">
              {triggeredFlags.length} Terdeteksi Aktif
            </span>
          </div>

          <div className="space-y-3">
            {report.qualityFlags?.map(flag => (
              <div
                key={flag.id}
                className={`p-4 rounded-xl border transition-colors ${
                  flag.isTriggered
                    ? 'bg-amber-950/20 border-amber-800/80 text-amber-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-500 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                        flag.isTriggered
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {flag.id}
                    </span>
                    <h4 className="text-sm font-bold text-white">{flag.name}</h4>
                  </div>
                  <span className="text-xs font-mono">
                    {flag.isTriggered ? (
                      <span className="text-amber-400 font-bold">TERDETEKSI</span>
                    ) : (
                      <span>TIDAK AKTIF</span>
                    )}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{flag.description}</p>
                {flag.isTriggered && flag.evidence && (
                  <div className="mt-2 text-xs font-mono text-amber-300 bg-amber-950/40 p-2.5 rounded border border-amber-900/60">
                    <strong>Bukti:</strong> {flag.evidence}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Categories Diagram & Breakdown */}
      {activeTab === 'categories' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <span>Diagram &amp; Profil Mutu 8 Kategori MQI (Hasara 2026 / KOMPAS v7)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Fraksi kelengkapan parameter terdistribusi pada 8 kelompok informasi
              </p>
            </div>
          </div>

          <AuditComparisonBarChart
            report={{
              ...report,
              scoreReport: {
                ...report.scoreReport,
                adaptedScore: activeV7.skorA,
                originalScore: activeV7.mqiBiner,
              },
              v7Scoring: activeV7,
            }}
          />
        </div>
      )}

      {/* Tab 6: Benchmarks Explorer (D01–D18) */}
      {activeTab === 'benchmarks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Acuan Uji 15 Dataset Resmi (v7-2026-10-31)</h3>
            <button
              onClick={() => setIsBenchmarkModalOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-1.5 shadow"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Buka Matriks Lengkap D01–D18</span>
            </button>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-xs text-slate-400 leading-relaxed">
            Data acuan pengujian dibaca langsung dari berkas <strong className="text-cyan-300 font-mono">KOMPAS_aturan_dan_acuan_v7.json</strong>.
            Anda dapat memuat dataset patokan mana pun ke dalam antarmuka audit dengan mengeklik tombol &quot;Buka Matriks Lengkap D01–D18&quot;.
          </div>
        </div>
      )}

      {/* Tab 7: Configuration Manager (JSON v7 / v8 & Open Decisions) */}
      {activeTab === 'config' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-400" />
                <span>Pengelolaan Konfigurasi Aturan JSON &amp; Keputusan Terbuka</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Memenuhi Prinsip B &amp; L: Konfigurasi dinamis tanpa hardcode nilai di kode program
              </p>
            </div>
            <button
              onClick={() => {
                resetToDefaultConfig();
                setConfigUploadSuccess('Konfigurasi dikembalikan ke default v7-2026-10-31.');
                setConfigUploadError(null);
              }}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset ke Default v7</span>
            </button>
          </div>

          {configUploadError && (
            <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
              {configUploadError}
            </div>
          )}
          {configUploadSuccess && (
            <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs">
              {configUploadSuccess}
            </div>
          )}

          {/* JSON Upload Box */}
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-cyan-400" />
              <span>Unggah Berkas Aturan JSON Baru (v8 atau revisi v7)</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Jika tim menerbitkan <code className="text-cyan-300 font-mono">KOMPAS_aturan_dan_acuan_v8.json</code>, cukup unggah berkas tersebut di sini.
              Aplikasi akan memvalidasi skema secara otomatis dan memperbarui seluruh bobot, ambang, kodean, dan acuan uji tanpa perlu mengubah kode sumber kalkulasi.
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleConfigUpload}
              className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 cursor-pointer"
            />
          </div>

          {/* Open Decisions Form */}
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4 text-xs">
            <h4 className="text-sm font-bold text-white">Pengaturan Keputusan Terbuka (Bagian 17):</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
                <label className="font-semibold text-slate-300 block">
                  Strategi Blok Kontak (E19/E20):
                </label>
                <select
                  value={openDecisions.contactBlockStrategy}
                  onChange={e => updateOpenDecisions({ contactBlockStrategy: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                >
                  <option value="best_block">Usulan Ketua: Ambil blok terbaik (prioritas institusional)</option>
                  <option value="first_block">Pilihan Alternatif: Ambil blok kontak pertama</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  Jika ada blok kontak placeholder, penanda F06 tetap diaktifkan.
                </p>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
                <label className="font-semibold text-slate-300 block">
                  Nilai Awal Elemen Manual Mode M (Usulan):
                </label>
                <select
                  value={openDecisions.initialManualValue}
                  onChange={e => updateOpenDecisions({ initialManualValue: parseFloat(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                >
                  <option value="0.5">Nilai 0.5 (Usulan default jika teks terisi)</option>
                  <option value="0">Nilai 0.0 (Harus dinilai eksplisit oleh auditor)</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  Dapat dikonfigurasi fleksibel tanpa mengunci aturan dalam kode.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: Spatial Map */}
      {activeTab === 'map' && spatialData.hasAdequateSpatial && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              <span>Verifikasi Spasial Geometris &amp; Bounding Box</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">
              CRS: {spatialData.crsName}
            </span>
          </div>
          <OpenStreetMapViewer
            spatialData={spatialData}
            datasetTitle={activeDatasetTitle}
          />
        </div>
      )}
    </div>
  );
};

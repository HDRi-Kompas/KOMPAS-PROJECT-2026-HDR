import React, { useState } from 'react';
import {
  FileCheck2,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  Edit3,
  Undo2,
  Layers,
} from 'lucide-react';
import { getConfigElements, getOpenDecisions, ElementConfigItem } from '../audit/configLoader';
import { AuditReport } from '../types/audit';

interface ManualReviewPanelProps {
  report: AuditReport;
  elementValues: Record<string, number>;
  manualOverrides: Record<string, { value: number; notes: string; auditorName?: string; updatedAt: string }>;
  onOverrideChange: (elementId: string, value: number, notes: string) => void;
  onResetOverride: (elementId: string) => void;
}

export const ManualReviewPanel: React.FC<ManualReviewPanelProps> = ({
  report,
  elementValues,
  manualOverrides,
  onOverrideChange,
  onResetOverride,
}) => {
  const elements = getConfigElements();
  const openDecisions = getOpenDecisions();

  const [filterMode, setFilterMode] = useState<'M' | 'U' | 'ALL'>('M');
  const [activeElementId, setActiveElementId] = useState<string>('E04');
  const [currentNotes, setCurrentNotes] = useState<string>('');

  // Filter elements by active tab
  const displayedElements = elements.filter(el => {
    const elMode = openDecisions.assessmentModes[el.id] || (el.inti ? 'O' : 'O');
    if (filterMode === 'ALL') return true;
    return elMode === filterMode;
  });

  const activeElement = elements.find(el => el.id === activeElementId) || displayedElements[0] || elements[0];
  const currentValue = elementValues[activeElement.id] ?? 0;
  const isOverridden = manualOverrides[activeElement.id] !== undefined;
  const activeMode = openDecisions.assessmentModes[activeElement.id] || 'O';

  // Extract raw text for active element
  const getExtractedText = (id: string): string => {
    const meta = report.normalizedMetadata;
    if (!meta) return '(Berkas metadata tidak tersedia)';
    switch (id) {
      case 'E01':
        return meta.language ? `"${meta.language}"` : '(Kosong)';
      case 'E02':
        return meta.metaMetadata?.standardName
          ? `"${meta.metaMetadata.standardName} ${meta.metaMetadata.standardVersion || ''}"`
          : '(Kosong / Tidak dinyatakan)';
      case 'E03':
        return meta.distribution?.onlineResourceUrl || meta.allOnlineResources?.[0]?.url || '(Kosong)';
      case 'E04':
        return meta.title ? `"${meta.title}"` : '(Kosong)';
      case 'E05':
        return meta.temporalExtent?.publicationDate || meta.temporalExtent?.creationDate || '(Kosong)';
      case 'E06':
        return meta.datasetId ? `"${meta.datasetId}"` : '(Kosong)';
      case 'E07':
        return meta.abstract ? `"${meta.abstract}"` : '(Kosong)';
      case 'E08':
        return meta.purpose ? `"${meta.purpose}"` : '(Kosong / nilReason=missing)';
      case 'E09':
        return meta.keywords && meta.keywords.length > 0
          ? meta.keywords.join(', ')
          : '(Kosong / Tidak ditemukan kata kunci)';
      case 'E10':
        return meta.topicCategory && meta.topicCategory.length > 0
          ? meta.topicCategory.join(', ')
          : '(Kosong)';
      case 'E11':
        return `${meta.distribution?.useConstraints || ''} ${meta.distribution?.accessConstraints || ''}`.trim() || '(Kosong / Not Specified)';
      case 'E12':
        return meta.featureCatalogueCitationTitle || (meta.featureCatalogueFound ? 'Katalog fitur tercantum' : '(Tidak ditemukan)');
      case 'E13':
        if (meta.spatialExtent?.isBBoxValid === false) return `(Tidak valid: ${meta.spatialExtent.bboxError || 'kosong'})`;
        return meta.spatialExtent?.westBoundLongitude !== undefined
          ? `[${meta.spatialExtent.westBoundLongitude.toFixed(2)}, ${meta.spatialExtent.southBoundLatitude?.toFixed(2) ?? '0'}, ${meta.spatialExtent.eastBoundLongitude?.toFixed(2) ?? '0'}, ${meta.spatialExtent.northBoundLatitude?.toFixed(2) ?? '0'}]`
          : '(Kosong)';
      case 'E14':
        return meta.temporalExtent?.startDate ? `${meta.temporalExtent.startDate} s.d ${meta.temporalExtent.endDate || 'sekarang'}` : '(Kosong)';
      case 'E15':
        return meta.spatialExtent?.crsName || meta.spatialExtent?.crsCode || '(Kosong)';
      case 'E16':
        return meta.accuracy?.positionalAccuracy || meta.accuracy?.totalHorizontalUncertainty ? String(meta.accuracy.positionalAccuracy || meta.accuracy.totalHorizontalUncertainty) : '(Tidak ada laporan akurasi posisi)';
      case 'E17':
        return meta.hasDirectConformanceReport ? 'DQ_ConformanceResult (Tautan QC Status)' : (meta.rawEvidence?.dqReport?.value ? 'Laporan kualitas data tercatat' : '(Tidak ditemukan)');
      case 'E18':
        return meta.rawEvidence?.scaleDenominator?.value ? `1:${meta.rawEvidence.scaleDenominator.value}` : '(Tidak ada skala terstruktur)';
      case 'E19':
        return meta.contact?.organization ? `"${meta.contact.organization}"` : '(Kosong / nilReason=missing)';
      case 'E20':
        return meta.contact?.email ? `"${meta.contact.email}"` : '(Kosong / Belum Ada)';
      case 'E21':
        return meta.contact?.role ? `"${meta.contact.role}"` : '(Kosong)';
      case 'E22':
        return meta.metaMetadata?.metadataDate ? `"${meta.metaMetadata.metadataDate}"` : '(Kosong)';
      case 'E23':
        return meta.rawEvidence?.maintenanceFrequency?.value ? `"${meta.rawEvidence.maintenanceFrequency.value}"` : '(Kosong / unknown)';
      case 'E24':
        return meta.processing?.lineageStatement ? `"${meta.processing.lineageStatement}"` : '(Kosong / Tidak ada riwayat silsilah)';
      case 'E25':
        return meta.processing?.sourceDatasets && meta.processing.sourceDatasets.length > 0 ? meta.processing.sourceDatasets.join('; ') : '(Kosong / Tidak ada sumber data)';
      case 'E26':
        return meta.processing?.processingSteps && meta.processing.processingSteps.length > 0 ? meta.processing.processingSteps.join('; ') : '(Kosong / Tidak ada langkah metode)';
      case 'E27':
        return meta.rawEvidence?.e27_spatialRepresentation?.value
          ? JSON.stringify(meta.rawEvidence.e27_spatialRepresentation.value)
          : '(Kosong / Tidak ada representasi spasial)';
      case 'E28':
        return meta.scopeName ? `${meta.scopeCode || 'dataset'} (${meta.scopeName})` : meta.scopeCode ? `Scope: ${meta.scopeCode}` : '(Kosong)';
      case 'E29':
        return meta.rawEvidence?.e29_portrayalCatalogue?.value?.citation || '(Kosong / Tidak ada katalog simbol)';
      case 'E30':
        return meta.rawEvidence?.e30_applicationSchema?.value?.schemaName || '(Kosong / Tidak ada skema aplikasi)';
      case 'E31':
        return meta.kugiCitationFound ? `KUGI: compliance=${meta.kugiComplianceCode ?? '-'}` : '(Kosong / Tidak menyitasi KUGI)';
      case 'E32':
        return meta.allOnlineResources?.find(r => r.isService)?.description || meta.allOnlineResources?.find(r => r.isService)?.url || '(Kosong / Tidak ada tautan layanan)';
      default:
        return '(Tidak ada teks ekstraksi)';
    }
  };

  const handleSelectScore = (val: number) => {
    onOverrideChange(activeElement.id, val, currentNotes || manualOverrides[activeElement.id]?.notes || '');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Penelaahan &amp; Penilaian Auditor (Mode O / U / M)
              </h2>
              <p className="text-xs text-slate-400">
                Sesuai Handover Final Bagian 7 &amp; 17: Evaluasi elemen interpretasi manusia dengan transparansi bukti
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Selector Tabs */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterMode('M')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                filterMode === 'M' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mode M (Wajib Manual)
            </button>
            <button
              onClick={() => setFilterMode('U')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                filterMode === 'U' ? 'bg-cyan-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mode U (Usulan Mesin)
            </button>
            <button
              onClick={() => setFilterMode('ALL')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                filterMode === 'ALL' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua (32 Elemen)
            </button>
          </div>

          <span className="text-xs font-mono text-slate-400 hidden md:inline ml-2">
            {Object.keys(manualOverrides).length} Di-override
          </span>
        </div>
      </div>

      {/* Element Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80">
        {displayedElements.map(el => {
          const isSelected = el.id === activeElement.id;
          const val = elementValues[el.id] ?? 0;
          const overridden = manualOverrides[el.id] !== undefined;
          const elMode = openDecisions.assessmentModes[el.id] || 'O';

          return (
            <button
              key={el.id}
              onClick={() => {
                setActiveElementId(el.id);
                setCurrentNotes(manualOverrides[el.id]?.notes || '');
              }}
              className={`px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all border flex items-center gap-2 ${
                isSelected
                  ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-sm ring-1 ring-cyan-400/30'
                  : overridden
                  ? 'bg-amber-950/30 border-amber-800/60 text-amber-300 hover:bg-slate-850'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <span className="font-bold">{el.id}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  val === 1 ? 'bg-emerald-400' : val === 0.5 ? 'bg-amber-400' : 'bg-rose-500'
                }`}
              />
              <span className="text-[10px] opacity-75">[{elMode}]</span>
              {overridden && <span className="text-[9px] bg-amber-400/20 px-1 rounded text-amber-300">Auditor</span>}
            </button>
          );
        })}
      </div>

      {/* Active Element Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950/70 border border-slate-800/80 rounded-xl p-5 lg:p-6">
        {/* Left: Element Info & Criteria */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
              {activeElement.id}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-300 font-medium">{activeElement.kategori}</span>
            <span className="text-slate-400">·</span>
            <span className="text-amber-400 font-bold">Bobot: {activeElement.bobot}</span>
            <span className="text-slate-400">·</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-semibold uppercase">
              Mode: {activeMode === 'M' ? 'M (Wajib Manual)' : activeMode === 'U' ? 'U (Usulan Mesin)' : 'O (Otomatis)'}
            </span>
          </div>

          <h3 className="text-lg font-bold text-white tracking-tight">
            {activeElement.nama}
          </h3>

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-1.5">
            <div className="font-semibold text-slate-300">Teks Asli Metadata:</div>
            <div className="font-mono text-slate-200 bg-slate-950 p-2.5 rounded border border-slate-800/80 text-[11px] max-h-32 overflow-y-auto leading-relaxed">
              {getExtractedText(activeElement.id)}
            </div>
            <p className="text-[11px] text-slate-500 italic">
              Bukti asli hasil ekstraksi disimpan secara permanen dan tidak tertimpa saat auditor melakukan penilaian.
            </p>
          </div>

          {/* Checklist Scoring Definitions */}
          <div className="space-y-2 text-xs">
            <div className="font-semibold text-slate-300">Definisi Penilaian:</div>
            <div className="grid grid-cols-1 gap-2">
              <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-emerald-300">
                <span className="font-bold mr-1">[Nilai 1.0]:</span>
                {activeElement.kriteria1 || 'Tersedia lengkap, spesifik, dan memenuhi ketentuan standar.'}
              </div>
              <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/40 text-amber-300">
                <span className="font-bold mr-1">[Nilai 0.5]:</span>
                {activeElement.kriteria05 || 'Tersedia namun generik, templat bawaan, tidak spesifik lokasi, atau sebagian.'}
              </div>
              <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/40 text-rose-300">
                <span className="font-bold mr-1">[Nilai 0.0]:</span>
                {activeElement.kriteria0 || 'Kosong, tidak ada, atau nilReason=missing.'}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Auditor Decision Box */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4 bg-slate-900/90 border border-slate-800 p-5 rounded-xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-300">Tetapkan Nilai Auditor:</span>
              <span className="text-xs font-mono">
                Status Saat Ini:{' '}
                <strong className={`font-bold ${currentValue === 1 ? 'text-emerald-400' : currentValue === 0.5 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {currentValue}
                </strong>
              </span>
            </div>

            {/* Score Selector Radios */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <button
                type="button"
                onClick={() => handleSelectScore(1)}
                className={`py-3 px-2 rounded-xl border text-center transition-all ${
                  currentValue === 1
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold ring-2 ring-emerald-400/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className="text-base font-bold font-mono">1.0</div>
                <div className="text-[10px] mt-0.5">Lengkap &amp; Sah</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectScore(0.5)}
                className={`py-3 px-2 rounded-xl border text-center transition-all ${
                  currentValue === 0.5
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold ring-2 ring-amber-400/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className="text-base font-bold font-mono">0.5</div>
                <div className="text-[10px] mt-0.5">Generik / Sebagian</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectScore(0)}
                className={`py-3 px-2 rounded-xl border text-center transition-all ${
                  currentValue === 0
                    ? 'bg-rose-500/20 border-rose-400 text-rose-300 font-bold ring-2 ring-rose-400/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className="text-base font-bold font-mono">0.0</div>
                <div className="text-[10px] mt-0.5">Kosong / Cacat</div>
              </button>
            </div>

            {/* Auditor Notes Input */}
            <div className="mt-4 space-y-1.5">
              <label htmlFor="auditor-notes" className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Catatan Penelaahan Auditor:</span>
                <span className="text-[10px] text-slate-500 font-normal">Terekam di Catatan_Auditor</span>
              </label>
              <textarea
                id="auditor-notes"
                rows={3}
                value={currentNotes}
                onChange={e => {
                  setCurrentNotes(e.target.value);
                  onOverrideChange(activeElement.id, currentValue, e.target.value);
                }}
                placeholder="Tuliskan justifikasi penilaian, temuan kata kunci lokasi, atau rujukan standar..."
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          {/* Reset Action */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            {isOverridden ? (
              <button
                onClick={() => {
                  onResetOverride(activeElement.id);
                  setCurrentNotes('');
                }}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Kembalikan ke Nilai Otomatis</span>
              </button>
            ) : (
              <span className="text-[11px] text-slate-500 italic">
                {activeMode === 'M' ? 'Menunggu konfirmasi penilaian manusia' : 'Nilai otomatis mesin aktif'}
              </span>
            )}

            <span className="text-[10px] font-mono text-slate-500">
              Versi: {report.ruleVersion || 'v7-2026-10-31'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Layers,
  ShieldCheck,
  Compass,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { AuditReport, MQICategory } from '../types/audit';
import { MQI_CATEGORIES } from '../audit/methodology';

interface AuditComparisonBarChartProps {
  report: AuditReport;
  onSelectCategory?: (category: MQICategory) => void;
}

export const AuditComparisonBarChart: React.FC<AuditComparisonBarChartProps> = ({
  report,
  onSelectCategory,
}) => {
  const [viewMode, setViewMode] = useState<'categories' | 'benchmark' | 'rules'>('categories');
  const [hoveredCategory, setHoveredCategory] = useState<MQICategory | null>(null);

  const { scoreReport, iso19115Compliance, iso19115_3Readiness } = report;
  const categories = scoreReport.categorySummaries || [];

  // Core metrics for benchmark comparison
  const coreScore = report.coreScoreMqi ?? scoreReport.adaptedScore ?? 0;
  const originalScore = scoreReport.originalScore ?? 0;
  const adaptedScore = scoreReport.adaptedScore ?? 0;
  const isoExtensionScore = iso19115_3Readiness?.scorePercentage ?? null;
  const isoCoreScore = iso19115Compliance?.coreScore ?? 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl space-y-5">
      {/* Header bar chart section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Diagram Batang Komparasi Kualitas Metadata
              </h3>
              <p className="text-xs text-slate-400">
                Visualisasi perbandingan capaian per 8 kategori dan tolok ukur standar ISO/BIG
              </p>
            </div>
          </div>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('categories')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === 'categories'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>8 Kategori MQI</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('benchmark')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === 'benchmark'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tolok Ukur Standar</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: 8 KATEGORI MQI COMPARATIVE BARS */}
      {viewMode === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Perbandingan persentase pemenuhan bobot per kategori (% Capaian Skor):</span>
            <span className="text-[11px] font-mono text-cyan-400">Klik baris untuk menyaring parameter</span>
          </div>

          <div className="space-y-3 pt-1">
            {categories.map((cat, idx) => {
              const catMeta = MQI_CATEGORIES[cat.category];
              const percentage = cat.percentage;
              const isHovered = hoveredCategory === cat.category;

              // Color determination based on score
              const barColor =
                percentage >= 80
                  ? 'bg-emerald-500 shadow-emerald-500/20'
                  : percentage >= 50
                  ? 'bg-cyan-500 shadow-cyan-500/20'
                  : percentage >= 30
                  ? 'bg-amber-500 shadow-amber-500/20'
                  : 'bg-rose-500 shadow-rose-500/20';

              const badgeColor =
                percentage >= 80
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                  : percentage >= 50
                  ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
                  : percentage >= 30
                  ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                  : 'text-rose-400 bg-rose-500/10 border-rose-500/30';

              return (
                <div
                  key={cat.category}
                  onClick={() => onSelectCategory?.(cat.category)}
                  onMouseEnter={() => setHoveredCategory(cat.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`group p-3 rounded-xl border transition-all cursor-pointer ${
                    isHovered
                      ? 'bg-slate-800/90 border-cyan-500/40 shadow-lg shadow-cyan-950/20 scale-[1.01]'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-200 truncate group-hover:text-cyan-300 transition-colors">
                        {catMeta?.name || cat.categoryName}
                      </span>
                      <span className="text-[11px] text-slate-500 hidden sm:inline">
                        ({cat.fulfilledParameters}/{cat.applicableParameters} parameter)
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono text-slate-400 hidden md:inline">
                        {cat.scoreEarned.toFixed(1)} / {cat.scoreMaxPossible} poin
                      </span>
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${badgeColor}`}
                      >
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Progressive Bar */}
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 relative">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
                      style={{ width: `${Math.min(100, Math.max(3, percentage))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-400 border-t border-slate-800/80">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                <span>Tinggi (≥80%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500 inline-block" />
                <span>Sedang (50–79%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
                <span>Rendah (30–49%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" />
                <span>Kritis (&lt;30%)</span>
              </span>
            </div>
            <span>Total 8 Kategori Berdasarkan Jurnal Hasara & Karunanayaka (2026)</span>
          </div>
        </div>
      )}

      {/* VIEW 2: BENCHMARK STANDAR KOMPARATIF */}
      {viewMode === 'benchmark' && (
        <div className="space-y-5">
          <div className="text-xs text-slate-400">
            Perbandingan komprehensif antara Skor Inti MQI, Ekstensi ISO 19115-3, dan Metodologi:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Group 1: Inti vs Ekstensi */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Skor Inti (E01–E26) vs Ekstensi (E27–E32)</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500">Skala 0–100%</span>
              </div>

              {/* Bar 1: Skor Inti MQI */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">1. Skor Inti MQI (E01–E26)</span>
                  <span className="font-mono font-bold text-cyan-400">{coreScore.toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, Math.max(3, coreScore))}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  26 parameter mutu metadata geospasial wajib & inti.
                </p>
              </div>

              {/* Bar 2: Skor Ekstensi ISO 19115-3 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">2. Kesiapan ISO 19115-3 (E27–E32)</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {isoExtensionScore !== null ? `${isoExtensionScore.toFixed(1)}%` : 'N/A (Format gmd)'}
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                    style={{
                      width: `${isoExtensionScore !== null ? Math.min(100, Math.max(3, isoExtensionScore)) : 0}%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  {isoExtensionScore !== null
                    ? '6 elemen ekstensi modern format <mdb:MD_Metadata>.'
                    : 'Tidak berlaku untuk format lama <gmd:MD_Metadata> (ISO 19139).'}
                </p>
              </div>

              {/* Bar 3: ISO 19115-1 Core Elements */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">3. Pemenuhan Elemen Wajib ISO 19115</span>
                  <span className="font-mono font-bold text-indigo-400">{isoCoreScore.toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, Math.max(3, isoCoreScore))}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  {iso19115Compliance?.statusLabel || 'Standar SNI ISO 19115:2012'}
                </p>
              </div>
            </div>

            {/* Group 2: Adaptasi KOMPAS vs Hasara Asli */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>Komparasi Metodologi Audit</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500">Nilai Bobot</span>
              </div>

              {/* Adaptasi KOMPAS */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Adaptasi KOMPAS (Kelautan & BIG)</span>
                  <span className="font-mono font-bold text-cyan-400">
                    {adaptedScore !== null ? `${adaptedScore.toFixed(1)}` : 'N/A'} / 100
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, Math.max(3, adaptedScore || 0))}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Mencakup parameter spesifik kelautan (TVU/THU/TPU, datum vertikal) dan regulasi BIG No. 3/2023.
                </p>
              </div>

              {/* MQI Asli Hasara */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">MQI Asli Hasara & Karunanayaka (2026)</span>
                  <span className="font-mono font-bold text-purple-400">
                    {originalScore !== null ? `${originalScore.toFixed(1)}` : 'N/A'} / 100
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, Math.max(3, originalScore || 0))}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Kalkulasi murni berdasarkan 26 aturan umum tanpa pembobotan spesifik kelautan.
                </p>
              </div>

              {/* Catatan Komparasi */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  Perbedaan nilai mencerminkan penyesuaian bobot kelautan dan kepatuhan terhadap regulasi nasional BIG No. 3 Tahun 2023.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

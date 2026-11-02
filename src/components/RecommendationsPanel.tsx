/**
 * KOMPAS - Actionable Recommendations & Score Projection Panel
 * Menampilkan rekomendasi perbaikan spesifik per elemen, proyeksi peningkatan skor MQI,
 * dan template snippet XML/JSON siap salin.
 */

import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Download,
  Filter,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Code2,
  BookOpen,
  ArrowRight,
  Layers,
} from 'lucide-react';
import {
  ActionableRecommendation,
  ScoreProjection,
} from '../audit/recommendations';

interface RecommendationsPanelProps {
  recommendations: ActionableRecommendation[];
  projection: ScoreProjection;
  datasetName: string;
}

export const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({
  recommendations,
  projection,
  datasetName,
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(
    recommendations[0]?.id || null
  );

  const handleCopySnippet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadMarkdown = () => {
    let md = `# Rencana Aksi & Rekomendasi Perbaikan Mutu Metadata\n`;
    md += `**Dataset:** ${datasetName}\n`;
    md += `**Skor Saat Ini:** ${projection.currentSkorA}% (${projection.currentTier})\n`;
    md += `**Proyeksi Kritis:** ${projection.projectedCriticalSkorA}% (${projection.projectedCriticalTier})\n`;
    md += `**Proyeksi Maksimal:** ${projection.projectedFullSkorA}% (${projection.projectedFullTier})\n\n`;
    md += `---\n\n`;

    recommendations.forEach((rec, idx) => {
      md += `### ${idx + 1}. [${rec.priority.toUpperCase()}] ${rec.title}\n`;
      md += `- **Kategori:** ${rec.category}\n`;
      md += `- **Bobot:** ${rec.weight} | **Potensi Poin:** +${rec.scorePotentialPoints}\n`;
      md += `- **Masalah:** ${rec.issueDescription}\n`;
      md += `- **Tindakan Perbaikan:** ${rec.actionGuide}\n`;
      md += `- **Standar Rujukan:** ${rec.isoStandardRef}\n\n`;
      md += `\`\`\`xml\n${rec.xmlSnippet}\n\`\`\`\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KOMPAS_Rekomendasi_${datasetName.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecs = recommendations.filter((r) => {
    if (filterPriority === 'all') return true;
    return r.priority === filterPriority;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* 1. Header & Simulator Proyeksi Peningkatan Skor */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-800/80 rounded-2xl p-6 lg:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-cyan-950 border border-cyan-700 text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-white">
                Rencana Aksi &amp; Rekomendasi Peningkatan Mutu Metadata
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Panduan langkah demi langkah berbasis standar ISO 19115 dan SNI ISO 19115 untuk melengkapi elemen kosong dan menaikkan indeks mutu kuantitatif MQI.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadMarkdown}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-colors shadow shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Panduan Rekomendasi (.md)</span>
          </button>
        </div>

        {/* Score Improvement Projection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          {/* Current Score */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Skor Saat Ini
            </span>
            <div className="text-2xl font-black font-mono text-slate-200 mt-1">
              {projection.currentSkorA}%
            </div>
            <span className="text-xs text-slate-400 mt-0.5 block">
              Tier: <strong className="text-amber-300">{projection.currentTier}</strong>
            </span>
          </div>

          {/* Critical Priority Gain */}
          <div className="bg-cyan-950/40 border border-cyan-800/80 p-4 rounded-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-cyan-300 uppercase tracking-wider">
                Proyeksi Prioritas Kritis
              </span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black font-mono text-cyan-300 mt-1">
              {projection.projectedCriticalSkorA}%
            </div>
            <span className="text-xs text-slate-300 mt-0.5 block">
              Naik ke: <strong className="text-emerald-400">{projection.projectedCriticalTier}</strong>
            </span>
            <span className="text-[10px] text-cyan-400 font-mono mt-1 block">
              Hanya dengan mengisi {projection.criticalEmptyCount} elemen bobot 3
            </span>
          </div>

          {/* Full Maximum Potential */}
          <div className="bg-emerald-950/40 border border-emerald-800/80 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-emerald-300 uppercase tracking-wider">
                Potensi Maksimal (100%)
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black font-mono text-emerald-300 mt-1">
              {projection.projectedFullSkorA}%
            </div>
            <span className="text-xs text-slate-300 mt-0.5 block">
              Target Kepatuhan Penuh: <strong className="text-emerald-400">{projection.projectedFullTier}</strong>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
              Jika seluruh {projection.totalEmptyElementsCount} rekomendasi dipenuhi
            </span>
          </div>
        </div>
      </div>

      {/* 2. Filter & Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-300">Filter Prioritas:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: `Semua (${recommendations.length})` },
              { id: 'kritis', label: `Kritis (Bobot 3)` },
              { id: 'tinggi', label: `Tinggi (Bobot 2)` },
              { id: 'sedang', label: `Pendukung (Bobot 1)` },
              { id: 'ekstensi', label: `Ekstensi ISO 19115-3` },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterPriority(f.id)}
                className={`px-2.5 py-1 text-xs rounded-lg font-mono transition-colors ${
                  filterPriority === f.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Menampilkan <strong>{filteredRecs.length}</strong> dari {recommendations.length} rekomendasi
        </div>
      </div>

      {/* 3. Daftar Kartu Rekomendasi */}
      {filteredRecs.length === 0 ? (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl text-emerald-400">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
          <h3 className="font-bold text-sm text-white">Tidak Ada Rekomendasi Pada Kategori Ini</h3>
          <p className="text-xs text-slate-400 mt-1">Seluruh elemen terkait telah terisi dan terverifikasi dengan baik.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecs.map((rec) => {
            const isExpanded = expandedId === rec.id;
            const isCopied = copiedId === rec.id;

            return (
              <div
                key={rec.id}
                className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all shadow-md ${
                  rec.priority === 'kritis'
                    ? 'border-rose-900/60 hover:border-rose-700/80'
                    : rec.priority === 'tinggi'
                    ? 'border-amber-900/60 hover:border-amber-700/80'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header Card (Clickable to collapse/expand) */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer hover:bg-slate-850/40 select-none transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-bold text-xs uppercase mt-0.5 shrink-0 ${
                        rec.priority === 'kritis'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : rec.priority === 'tinggi'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : rec.priority === 'ekstensi'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      Prioritas {rec.priority}
                    </span>

                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{rec.title}</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {rec.category} · Bobot: {rec.weight} · Nilai Saat Ini: <strong className="text-rose-400">{rec.currentScore}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800 flex items-center gap-1">
                      <span>Dampak: +{rec.scorePotentialPoints} Poin</span>
                    </span>

                    <button
                      type="button"
                      className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 space-y-4 border-t border-slate-800/80 bg-slate-950/50">
                    {/* Temuan & Tindakan */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-3">
                      <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">
                          Masalah yang Ditemukan:
                        </span>
                        <p className="text-slate-300 leading-relaxed">
                          {rec.issueDescription}
                        </p>
                      </div>

                      <div className="p-3.5 bg-cyan-950/30 rounded-xl border border-cyan-800/50">
                        <span className="text-[10px] uppercase font-mono text-cyan-400 block mb-1 font-bold">
                          Langkah Perbaikan yang Disarankan:
                        </span>
                        <p className="text-white leading-relaxed">
                          {rec.actionGuide}
                        </p>
                        <span className="text-[10px] font-mono text-cyan-300/80 mt-2 block">
                          Rujukan: {rec.isoStandardRef}
                        </span>
                      </div>
                    </div>

                    {/* Template Snippet XML Siap Pakai */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                      <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Template Snippet XML Rekomendasi:</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopySnippet(rec.id, rec.xmlSnippet)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-400" />
                              <span>Salin Snippet XML</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-4 text-xs font-mono text-cyan-300 overflow-x-auto bg-slate-950/80 leading-relaxed">
                        {rec.xmlSnippet}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

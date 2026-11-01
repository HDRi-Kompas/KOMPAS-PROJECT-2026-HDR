import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Layers,
} from 'lucide-react';
import { getBenchmarkDatasetsV7, BenchmarkDatasetV7 } from '../data/benchmarksV7';

interface BenchmarkExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDataset?: (dataset: BenchmarkDatasetV7) => void;
}

export const BenchmarkExplorerModal: React.FC<BenchmarkExplorerModalProps> = ({
  isOpen,
  onClose,
  onSelectDataset,
}) => {
  const benchmarks = getBenchmarkDatasetsV7();
  const [selectedDs, setSelectedDs] = useState<BenchmarkDatasetV7>(benchmarks[0] || {} as BenchmarkDatasetV7);

  if (!isOpen || benchmarks.length === 0) return null;

  const currentDs = benchmarks.find(d => d.id === selectedDs.id) || benchmarks[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Matriks Acuan Uji 15 Dataset (KOMPAS v7)
              </h2>
              <p className="text-xs text-slate-400">
                Nilai acuan deterministik resmi D01–D18 dari sheet Kodean, Skor, dan Acuan_Uji_Aplikasi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Dataset Selector Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/60">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/80 text-slate-400 font-mono text-[11px] border-b border-slate-800 uppercase">
                <tr>
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Judul Dataset</th>
                  <th className="py-2.5 px-3">Format</th>
                  <th className="py-2.5 px-3 text-right">Skor A (32)</th>
                  <th className="py-2.5 px-3 text-right">MQI Diperluas</th>
                  <th className="py-2.5 px-3 text-right">Skor Inti (26)</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3 text-center">Kosong</th>
                  <th className="py-2.5 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {benchmarks.map(ds => {
                  const isSelected = ds.id === currentDs.id;
                  return (
                    <tr
                      key={ds.id}
                      onClick={() => setSelectedDs(ds)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-cyan-950/40 text-cyan-300'
                          : 'hover:bg-slate-900/50 text-slate-300'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono font-bold">{ds.id}</td>
                      <td className="py-2.5 px-3 font-medium max-w-[240px] truncate" title={ds.title}>
                        {ds.title}
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ds.format === 'gmd'
                              ? 'bg-blue-950/80 text-blue-300 border border-blue-800'
                              : ds.format === 'mdb'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                              : ds.format === 'ESRI'
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                              : 'bg-purple-950/80 text-purple-300 border border-purple-800'
                          }`}
                        >
                          {ds.format}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-right text-white tabular-nums">
                        {ds.expectedSkorA.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-right text-cyan-300 tabular-nums">
                        {ds.expectedMqiDiperluas.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-right text-slate-300 tabular-nums">
                        {ds.expectedSkorAInti.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            ds.expectedKategoriDiperluas === 'Excellent'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : ds.expectedKategoriDiperluas === 'Good'
                              ? 'bg-blue-950 text-blue-300 border border-blue-800'
                              : ds.expectedKategoriDiperluas === 'Fair'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              : ds.expectedKategoriDiperluas === 'Poor'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {ds.expectedKategoriDiperluas}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-400">
                        {ds.emptyElementsCount}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            if (onSelectDataset) {
                              onSelectDataset(ds);
                              onClose();
                            }
                          }}
                          className="px-2.5 py-1 text-[11px] font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-1 mx-auto"
                        >
                          <span>Muat</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Detailed Selected Dataset Inspector */}
          {currentDs && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                    <span>{currentDs.id}</span>
                    <span>·</span>
                    <span>{currentDs.sourceGroup}</span>
                    <span>·</span>
                    <span className="font-bold uppercase">{currentDs.format}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">{currentDs.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (onSelectDataset) {
                        onSelectDataset(currentDs);
                        onClose();
                      }
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Terapkan Dataset Ini ke Audit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 4 Scores Row */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Skor A (32 Elemen)</div>
                  <div className="text-lg font-bold font-mono text-white tabular-nums">
                    {currentDs.expectedSkorA.toFixed(2)}%
                  </div>
                  <div className="text-[10px] text-slate-500">Bobot Kategori 0–100</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">MQI Biner (32)</div>
                  <div className="text-lg font-bold font-mono text-cyan-300 tabular-nums">
                    {currentDs.expectedMqiBiner.toFixed(2)}%
                  </div>
                  <div className="text-[10px] text-slate-500">Formula Hasara 2026</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">MQI Diperluas (32)</div>
                  <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
                    {currentDs.expectedMqiDiperluas.toFixed(2)}%
                  </div>
                  <div className="text-[10px] text-slate-500">Gradasi 1 / 0.5 / 0</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Skor Inti (26)</div>
                  <div className="text-lg font-bold font-mono text-blue-400 tabular-nums">
                    {currentDs.expectedSkorAInti.toFixed(2)}%
                  </div>
                  <div className="text-[10px] text-slate-500">Pembanding Paper</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Skor Ekstensi</div>
                  <div className="text-lg font-bold font-mono text-purple-400 tabular-nums">
                    {currentDs.expectedSkorEkstensi.toFixed(2)}%
                  </div>
                  <div className="text-[10px] text-slate-500">E27–E32 (bobot 11)</div>
                </div>
              </div>

              {/* Empty elements list and Flags list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <div className="font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Elemen Kosong / Nilai 0 ({currentDs.emptyElementsCount}):</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentDs.emptyElementsList.map(el => (
                      <span key={el} className="px-2 py-0.5 rounded bg-rose-950/70 text-rose-300 border border-rose-800/80 font-mono text-[11px]">
                        {el}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <div className="font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Penanda Peringatan Mutu ({currentDs.expectedFlags.length}):</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentDs.expectedFlags.map(f => (
                      <span key={f} className="px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-800/80 font-mono text-[11px]">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span className="font-mono">Versi Aturan: v7-2026-10-31 · 15 Dataset Acuan Resmi</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

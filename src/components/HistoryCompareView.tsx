/**
 * KOMPAS - Audit History & Version Comparison View
 * Lists historical audits and allows side-by-side comparison between 2 dataset versions.
 */

import React from 'react';
import { Clock, Eye, Trash2 } from 'lucide-react';
import { AuditReport } from '../types/audit';

interface HistoryCompareViewProps {
  auditReports: AuditReport[];
  onSelectAudit: (report: AuditReport) => void;
  onClearHistory: () => void;
}

export const HistoryCompareView: React.FC<HistoryCompareViewProps> = ({
  auditReports,
  onSelectAudit,
  onClearHistory,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-cyan-400" />
            <span>Riwayat Audit Metadata</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Daftar lengkap seluruh riwayat sesi pengujian kualitas metadata dan data spasial kelautan yang telah diselesaikan.
          </p>
        </div>
        {auditReports.length > 0 && (
          <button
            onClick={onClearHistory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 border border-rose-900/60 rounded-lg transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Bersihkan Riwayat</span>
          </button>
        )}
      </div>

      {auditReports.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-sm">
          <Clock className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="font-medium text-slate-300">Belum ada riwayat audit yang tersimpan.</p>
          <p className="text-xs text-slate-500 mt-1">Jalankan audit baru melalui menu Unggah & Audit untuk mencatat histori pemeriksaan.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">
                Daftar Lengkap Riwayat Audit ({auditReports.length})
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Total {auditReports.length} Sesi Audit Selesai
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-950/70 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Nama Dataset</th>
                  <th className="py-3 px-4">Profil</th>
                  <th className="py-3 px-4">Waktu Audit</th>
                  <th className="py-3 px-4">Skor MQI</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Temuan</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {auditReports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white max-w-xs truncate">
                      {r.datasetName}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono capitalize text-slate-400">
                      {r.profileId.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400 font-mono">
                      {new Date(r.timestamp).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white tabular-nums">
                      {r.scoreReport.adaptedScore !== null ? `${r.scoreReport.adaptedScore}%` : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      {r.scoreReport.isProvisional ? (
                        <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 text-[11px] font-medium">Sementara</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[11px] font-medium">Sah (Final)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-400">
                      {r.scoreReport.statusCounts.tidak_terpenuhi + r.scoreReport.statusCounts.tidak_valid} temuan
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectAudit(r)}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1 hover:underline"
                      >
                        <span>Buka Detail</span>
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * KOMPAS - Main Dashboard View
 * Executive overview, key audit metrics, quick-start sample benchmarks, and recent audits.
 */

import React from 'react';
import {
  FileCheck2,
  AlertOctagon,
  Clock,
  Compass,
  ArrowRight,
  Database,
  Layers,
  FileCode2,
  ChevronRight,
  Sparkles,
  UploadCloud,
} from 'lucide-react';
import { AuditReport } from '../types/audit';
import { METHODOLOGY_METADATA } from '../audit/methodology';
import { MetadataRecord, AuditRun } from '../types/inventory';

interface DashboardViewProps {
  inventoryRecords: MetadataRecord[];
  allRuns: AuditRun[];
  auditReports: AuditReport[];
  onSelectAudit: (audit: AuditReport) => void;
  onNavigateUpload: () => void;
  onNavigateInventory?: () => void;
  onRunSampleAudit: (sampleKey: string) => void;
  isLoadingSample: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  inventoryRecords,
  allRuns,
  auditReports,
  onSelectAudit,
  onNavigateUpload,
  onNavigateInventory,
  onRunSampleAudit,
  isLoadingSample,
}) => {
  const totalMetadata = inventoryRecords.length;
  const totalAudits = allRuns.length;
  const completedAudits = allRuns.filter(r => r.completionStatus === 'completed').length;
  const compliantCount = inventoryRecords.filter(r => r.latestAuditStatus === 'Lolos Penuh').length;
  const totalFindings = inventoryRecords.reduce(
    (acc, r) => acc + (r.latestStatusCounts ? (r.latestStatusCounts.tidak_terpenuhi + r.latestStatusCounts.tidak_valid) : 0),
    0
  );
  const scoredRecords = inventoryRecords.filter(r => r.latestMqiScore !== null && r.latestMqiScore !== undefined);
  const avgMqi =
    scoredRecords.length > 0
      ? (scoredRecords.reduce((acc, r) => acc + (r.latestMqiScore || 0), 0) / scoredRecords.length).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-8">
      {/* Hero Strip */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 border border-slate-800 p-6 sm:p-8">
        {/* Full-bleed Seamless White Gradient & Watermark Background */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
          {/* Comprehensive white ambient gradient across the entire card */}
          <div className="absolute inset-0 bg-gradient-to-l from-white/25 via-white/[0.08] to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_50%,_var(--tw-gradient-stops))] from-white/30 via-cyan-500/15 to-transparent" />

          {/* Logo Watermark with mask applied directly to image, bleeding past right border */}
          <div className="absolute inset-y-0 right-0 w-full sm:w-4/5 md:w-3/4 lg:w-2/3 flex items-center justify-end opacity-30">
            <img
              src="/kompas-logo.jpeg"
              alt=""
              aria-hidden="true"
              className="h-full w-auto max-w-none object-contain filter contrast-125 translate-x-12"
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 25%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,1) 90%, rgba(0,0,0,1) 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 25%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,1) 90%, rgba(0,0,0,1) 100%)',
              }}
            />
          </div>
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 max-w-2xl sm:max-w-3xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-6">
            Audit Kualitas Metadata &amp; Data Spasial Kelautan
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateUpload}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow transition-colors"
            >
              <span>Unggah Berkas untuk Diaudit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-400 font-mono">
              Mendukung XML ISO 19139, Esri XML, JSON Katalog, GeoJSON, dan ZIP Shapefile
            </span>
          </div>
        </div>

        {/* Decorative Cartographic Background Lines */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden lg:block overflow-hidden">
          <svg viewBox="0 0 400 400" className="w-full h-full text-cyan-400 stroke-current fill-none">
            <circle cx="200" cy="200" r="180" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="200" cy="200" r="140" strokeWidth="1.5" />
            <circle cx="200" cy="200" r="100" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx="200" cy="200" r="60" strokeWidth="2" />
            <path d="M 20 200 L 380 200 M 200 20 L 200 380" strokeWidth="1" opacity="0.6" />
          </svg>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Metadata</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {totalMetadata}
          </div>
          <div className="text-xs text-slate-500 mt-1">Entri inventaris terdaftar</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Pelaksanaan Audit</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {totalAudits}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {completedAudits} tuntas ({totalAudits - completedAudits} bersyarat/gagal)
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Kelengkapan Inti Tinggi</span>
            <FileCheck2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {compliantCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">Skor inti ≥ 75% (indikasi kelengkapan)</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Rata-Rata MQI</span>
            <Compass className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {avgMqi}
            <span className="text-sm font-normal text-slate-400 ml-1">/ 100</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Dihitung dari data nyata</div>
        </div>
      </div>

      {/* Empty State Banner when 0 metadata exists */}
      {totalMetadata === 0 && (
        <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-8 sm:p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-800/80 flex items-center justify-center text-cyan-400 mx-auto mb-4">
            <Database className="w-7 h-7 text-cyan-400" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">
            Belum ada metadata. Unggah file metadata untuk memulai inventarisasi dan audit.
          </h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed mb-6">
            Aplikasi berada dalam kondisi awal kosong tanpa hasil audit rekaan. Anda dapat mengunggah hingga 15 file metadata sebagai sampel pengujian secara bertahap melalui antarmuka.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onNavigateUpload}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-md transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Unggah Metadata</span>
            </button>
            {onNavigateInventory && (
              <button
                onClick={onNavigateInventory}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg transition-colors"
              >
                <Database className="w-4 h-4 text-cyan-400" />
                <span>Buka Inventaris Metadata</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Recent Audits List or Empty State */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-400" />
          <span>Riwayat Pemeriksaan Terkini</span>
        </h2>

        {auditReports.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-slate-800 rounded-lg">
            <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-300 mb-1">
              Belum Ada Sesi Audit yang Dijalankan
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
              Silahkan unggah berkas metadata kelautan Anda
            </p>
            <button
              onClick={onNavigateUpload}
              className="px-4 py-2 text-xs font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
            >
              Unggah Dataset Baru
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-950/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Nama Dataset</th>
                  <th className="py-3 px-4">Profil</th>
                  <th className="py-3 px-4">Format Berkas</th>
                  <th className="py-3 px-4">Skor MQI</th>
                  <th className="py-3 px-4">Status Skor</th>
                  <th className="py-3 px-4">Waktu Audit</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {auditReports.slice(0, 8).map((report) => (
                  <tr key={report.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white max-w-xs truncate">
                      {report.datasetName}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono capitalize text-slate-400">
                      {report.profileId.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-400">
                      {report.metadataFile?.format || report.spatialFile?.format || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white tabular-nums">
                      {report.scoreReport.adaptedScore !== null ? `${report.scoreReport.adaptedScore}%` : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      {report.scoreReport.isProvisional ? (
                        <span className="text-amber-400 font-medium">Skor Sementara</span>
                      ) : (
                        <span className="text-emerald-400 font-medium">Skor Sah (Final)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 font-mono">
                      {new Date(report.timestamp).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectAudit(report)}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-medium hover:underline focus-visible:outline-none"
                      >
                        Buka Laporan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

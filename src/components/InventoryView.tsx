/**
 * KOMPAS - Halaman Inventaris Metadata & Histori Audit
 * Katalog metadata resmi sesuai Peraturan BIG No. 3 Tahun 2023 dan ISO 19115.
 * Mendukung kondisi awal kosong (empty state), pencarian, filter, pagination, dan histori per metadata.
 */

import React, { useState, useMemo } from 'react';
import {
  Database,
  Search,
  Filter,
  ArrowUpDown,
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ChevronRight,
  History,
  Eye,
  Plus,
  Play,
  Layers,
  FileCode,
  ShieldCheck,
  FileWarning,
  X,
  ExternalLink,
  ChevronLeft,
  MapPin,
  Globe2,
} from 'lucide-react';
import { AuditRun, MetadataRecord } from '../types/inventory';
import { AuditReport, DatasetProfileId } from '../types/audit';
import { OpenStreetMapViewer } from './OpenStreetMapViewer';
import { resolveSpatialFromRecord } from '../utils/spatialHelper';

interface InventoryViewProps {
  records: MetadataRecord[];
  allRuns: AuditRun[];
  onSelectAuditReport: (report: AuditReport) => void;
  onNavigateUpload: () => void;
  onRunAuditForRecord: (record: MetadataRecord) => void;
  onDeleteRecord?: (id: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  records,
  allRuns,
  onSelectAuditReport,
  onNavigateUpload,
  onRunAuditForRecord,
  onDeleteRecord,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'score_desc' | 'title_asc'>('date_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected Record for History Modal
  const [historyModalRecord, setHistoryModalRecord] = useState<MetadataRecord | null>(null);
  // Selected Record for Detail Modal
  const [detailModalRecord, setDetailModalRecord] = useState<MetadataRecord | null>(null);
  // Selected Record for OpenStreetMap Modal
  const [mapModalRecord, setMapModalRecord] = useState<MetadataRecord | null>(null);

  // Filtered & Sorted records
  const filteredRecords = useMemo(() => {
    return records
      .filter((rec) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = rec.title?.toLowerCase().includes(q);
          const matchFile = rec.sourceFileName?.toLowerCase().includes(q);
          const matchInv = rec.inventoryNumber?.toLowerCase().includes(q);
          if (!matchTitle && !matchFile && !matchInv) return false;
        }

        if (selectedFormat !== 'all') {
          if (!rec.fileFormat.toLowerCase().includes(selectedFormat.toLowerCase())) {
            return false;
          }
        }

        if (selectedStatus !== 'all') {
          if (rec.latestAuditStatus !== selectedStatus) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') {
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        }
        if (sortBy === 'date_asc') {
          return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
        }
        if (sortBy === 'score_desc') {
          return (b.latestMqiScore || 0) - (a.latestMqiScore || 0);
        }
        if (sortBy === 'title_asc') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [records, searchQuery, selectedFormat, selectedStatus, sortBy]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage, itemsPerPage]);

  // History runs for the selected record in modal
  const selectedRecordRuns = useMemo(() => {
    if (!historyModalRecord) return [];
    return allRuns
      .filter((r) => r.metadataRecordId === historyModalRecord.id)
      .sort((a, b) => new Date(b.runTimestamp).getTime() - new Date(a.runTimestamp).getTime());
  }, [historyModalRecord, allRuns]);

  // Summary Metrics
  const totalMetadataCount = records.length;
  const auditedCount = records.filter((r) => r.latestAuditStatus !== 'Belum Diaudit').length;
  const compliantCount = records.filter((r) => r.latestAuditStatus === 'Lolos Penuh').length;
  const scoredRecords = records.filter((r) => r.latestMqiScore !== null && r.latestMqiScore !== undefined);
  const avgMqiScore =
    scoredRecords.length > 0
      ? (scoredRecords.reduce((acc, r) => acc + (r.latestMqiScore || 0), 0) / scoredRecords.length).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300 font-semibold">
              KATALOG & INVENTARIS RESMI
            </span>
            <span aria-hidden="true">·</span>
            <span>PERATURAN BIG NO. 3 TAHUN 2023 & SNI ISO 19115</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Database className="w-6 h-6 text-cyan-400" />
            <span>Inventaris Metadata & Histori Audit</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Katalog terpadu untuk menampung seluruh berkas metadata geospasial kelautan yang diunggah. Menjamin pencatatan histori pelaksanaan audit secara persisten, komparasi antar-versi, dan kepatuhan regulasi wajib.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateUpload}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 rounded-lg shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Unggah Metadata Baru</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">Total Metadata Terdaftar</div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums mt-1">
            {totalMetadataCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Entri inventaris unik</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">Sesi Audit Tersimpan</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums mt-1">
            {allRuns.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">{auditedCount} dataset pernah diaudit</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">Lolos Penuh (MQI ≥ 75)</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-1">
            {compliantCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Memenuhi syarat pakai penuh</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">Rata-Rata MQI Aktual</div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums mt-1">
            {avgMqiScore}
            <span className="text-xs text-slate-400 ml-1">/ 100</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Dihitung dari data nyata</div>
        </div>
      </div>

      {/* Search, Filter, Sort Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan judul, nama file, atau no. inventaris (INV-...)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Format Filter */}
          <select
            value={selectedFormat}
            onChange={(e) => {
              setSelectedFormat(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="all">Semua Format</option>
            <option value="xml">XML (ISO / Esri)</option>
            <option value="iso 19139">XML (ISO 19139)</option>
            <option value="esri">XML (Esri)</option>
            <option value="json">JSON Katalog</option>
            <option value="geojson">GeoJSON</option>
            <option value="shapefile">Shapefile ZIP</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="all">Semua Status Audit</option>
            <option value="Lolos Penuh">Lolos Penuh</option>
            <option value="Lolos Bersyarat">Lolos Bersyarat</option>
            <option value="Perlu Perbaikan">Perlu Perbaikan</option>
            <option value="Belum Diaudit">Belum Diaudit</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="date_desc">Unggah Terbaru</option>
            <option value="date_asc">Unggah Terlama</option>
            <option value="score_desc">Skor MQI Tertinggi</option>
            <option value="title_asc">Judul (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Main Table or Empty State */}
      {records.length === 0 ? (
        /* Explicit Empty State as requested by user */
        <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-800/80 flex items-center justify-center text-cyan-400 mx-auto mb-4">
            <Database className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">
            Belum Ada Metadata Terdaftar
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
            Katalog inventaris masih kosong. Unggah file metadata (hingga 15 berkas sampel bertahap) untuk memulai inventarisasi dan proses audit mutu geospasial.
          </p>
          <button
            onClick={onNavigateUpload}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Unggah Metadata Sekarang</span>
          </button>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
          <FileWarning className="w-8 h-8 mx-auto mb-2 text-amber-400" />
          <p className="text-sm font-medium text-slate-300">Tidak ada metadata yang sesuai dengan filter atau pencarian Anda.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedFormat('all');
              setSelectedStatus('all');
            }}
            className="mt-3 text-xs text-cyan-400 hover:underline"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase bg-slate-950/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">No. Inventaris</th>
                  <th className="py-3 px-4 font-semibold">Judul Dataset & Kategori</th>
                  <th className="py-3 px-4 font-semibold">File Sumber & Format</th>
                  <th className="py-3 px-4 font-semibold">Waktu Unggah / Metadata</th>
                  <th className="py-3 px-4 font-semibold">Audit Terakhir</th>
                  <th className="py-3 px-4 font-semibold">Status & Skor MQI</th>
                  <th className="py-3 px-4 font-semibold">Rincian Parameter</th>
                  <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {paginatedRecords.map((rec) => {
                  const runsForThisRec = allRuns.filter((r) => r.metadataRecordId === rec.id);
                  const latestRun = runsForThisRec.length > 0 ? runsForThisRec[0] : null;

                  return (
                    <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* No. Inventaris */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-cyan-400 whitespace-nowrap">
                        {rec.inventoryNumber}
                      </td>

                      {/* Judul & Kategori */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-medium text-white truncate hover:text-cyan-300 transition-colors">
                          {rec.title}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono capitalize mt-0.5">
                          {rec.datasetCategory.replace('_', ' ')}
                        </div>
                      </td>

                      {/* File Sumber & Format */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-slate-300 truncate max-w-[160px]" title={rec.sourceFileName}>
                          {rec.sourceFileName}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                            {rec.fileFormat}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {(rec.fileSizeBytes / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      </td>

                      {/* Tanggal */}
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>
                            {new Date(rec.uploadDate).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        {rec.metadataDate && (
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            Doc: {rec.metadataDate}
                          </div>
                        )}
                      </td>

                      {/* Audit Terakhir */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {rec.lastAuditedAt ? (
                          <div>
                            <div className="text-[11px] text-slate-300 font-mono">
                              {new Date(rec.lastAuditedAt).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                            <div className="text-[10px] text-cyan-400/80 font-mono mt-0.5">
                              {runsForThisRec.length} sesi audit
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">Belum pernah</span>
                        )}
                      </td>

                      {/* Status & Skor MQI */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {rec.latestMqiScore !== null ? (
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-white text-sm tabular-nums">
                                {rec.latestMqiScore}%
                              </span>
                              <span
                                className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                                  rec.latestAuditStatus === 'Lolos Penuh'
                                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                                    : rec.latestAuditStatus === 'Lolos Bersyarat'
                                    ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                                    : 'bg-rose-950/80 text-rose-300 border border-rose-800'
                                }`}
                              >
                                {rec.latestAuditStatus}
                              </span>
                            </div>
                            {rec.latestIsoCoreScore !== null && (
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                Inti ISO: {rec.latestIsoCoreScore}%
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500">Belum Diaudit</span>
                        )}
                      </td>

                      {/* Parameter Counts */}
                      <td className="py-3.5 px-4">
                        {rec.latestStatusCounts ? (
                          <div className="flex items-center gap-2 font-mono text-[11px]">
                            <span className="text-emerald-400" title="Terpenuhi">
                              ✓ {rec.latestStatusCounts.terpenuhi || 0}
                            </span>
                            <span className="text-rose-400" title="Hilang / Tidak Terpenuhi">
                              ✗ {rec.latestStatusCounts.tidak_terpenuhi || 0}
                            </span>
                            <span className="text-amber-400" title="Tidak Valid / Placeholder">
                              ! {rec.latestStatusCounts.tidak_valid || 0}
                            </span>
                            {(rec.latestStatusCounts.perlu_ditinjau || 0) > 0 && (
                              <span className="text-purple-400" title="Perlu Ditinjau">
                                ? {rec.latestStatusCounts.perlu_ditinjau}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500 font-mono">-</span>
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {latestRun ? (
                            <button
                              onClick={() => onSelectAuditReport(latestRun.reportSnapshot)}
                              className="px-2 py-1 text-[11px] font-medium text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/80 rounded transition-colors inline-flex items-center gap-1"
                              title="Buka laporan audit lengkap dan peta"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Lihat Detail</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onRunAuditForRecord(rec)}
                              className="px-2 py-1 text-[11px] font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors inline-flex items-center gap-1"
                              title="Jalankan audit perdana"
                            >
                              <Play className="w-3 h-3" />
                              <span>Audit</span>
                            </button>
                          )}

                          <button
                            onClick={() => setMapModalRecord(rec)}
                            className={`px-2 py-1 text-[11px] font-medium rounded transition-colors inline-flex items-center gap-1 ${
                              rec.hasSpatialData && rec.spatialBounds
                                ? 'text-teal-300 bg-teal-950/60 hover:bg-teal-900/60 border border-teal-800/80'
                                : 'text-slate-400 bg-slate-900 hover:bg-slate-850 border border-slate-800'
                            }`}
                            title={
                              rec.hasSpatialData && rec.spatialBounds
                                ? 'Lihat letak geografis metadata di OpenStreetMap'
                                : 'Periksa status spasial dataset ini'
                            }
                          >
                            <MapPin className="w-3 h-3 text-teal-400" />
                            <span>Peta</span>
                          </button>

                          <button
                            onClick={() => setHistoryModalRecord(rec)}
                            className="px-2 py-1 text-[11px] font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors inline-flex items-center gap-1"
                            title="Buka riwayat eksekusi audit"
                          >
                            <History className="w-3 h-3 text-slate-400" />
                            <span>Histori ({runsForThisRec.length})</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div>
                Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{' '}
                {Math.min(currentPage * itemsPerPage, filteredRecords.length)} dari {filteredRecords.length} metadata
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono px-2">
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: Audit History per Metadata Record */}
      {historyModalRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Histori Pelaksanaan Audit
                  </h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                    <span className="text-cyan-400 font-semibold">{historyModalRecord.inventoryNumber}</span>
                    <span>·</span>
                    <span className="truncate max-w-sm">{historyModalRecord.title}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setHistoryModalRecord(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Runs List */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="text-xs text-slate-400 mb-2">
                Setiap kali dataset ini diaudit ulang, sistem membuat entri rekaman baru tanpa menimpa hasil sebelumnya, sehingga evolusi mutu metadata dapat ditelusuri.
              </div>

              {selectedRecordRuns.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-400">
                  <p className="text-xs">Dataset ini belum pernah diaudit.</p>
                  <button
                    onClick={() => {
                      const rec = historyModalRecord;
                      setHistoryModalRecord(null);
                      onRunAuditForRecord(rec);
                    }}
                    className="mt-3 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors"
                  >
                    Jalankan Audit Pertama
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedRecordRuns.map((run, idx) => (
                    <div
                      key={run.id}
                      className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                            Sesi #{selectedRecordRuns.length - idx}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {new Date(run.runTimestamp).toLocaleString('id-ID', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-white tabular-nums">
                            MQI: {run.mqiScore !== null ? `${run.mqiScore}%` : 'N/A'}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              run.isProvisional
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            }`}
                          >
                            {run.isProvisional ? 'Skor Sementara' : 'Skor Sah'}
                          </span>
                        </div>
                      </div>

                      {/* Parameter & Compliance Summary */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2 border-y border-slate-800/80 text-[11px] font-mono text-slate-400">
                        <div>
                          Terpenuhi: <span className="text-emerald-400 font-bold">{run.fulfilledCount}</span>
                        </div>
                        <div>
                          Hilang: <span className="text-rose-400 font-bold">{run.missingCount}</span>
                        </div>
                        <div>
                          Tidak Valid: <span className="text-amber-400 font-bold">{run.invalidCount}</span>
                        </div>
                        <div>
                          Perlu Ditinjau: <span className="text-purple-400 font-bold">{run.reviewCount}</span>
                        </div>
                      </div>

                      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="text-[11px] text-slate-400">
                          <span className="text-slate-500">Standar:</span>{' '}
                          <span className="text-cyan-300 font-medium">
                            {run.bigNo3Compliance?.standardCategory || 'ISO 19115'}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            setHistoryModalRecord(null);
                            onSelectAuditReport(run.reportSnapshot);
                          }}
                          className="px-3 py-1 text-xs font-semibold text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-800 rounded transition-colors inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat Laporan Sesi Ini</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <div className="text-xs text-slate-500 font-mono">
                Checksum: {historyModalRecord.fileChecksum.substring(0, 16)}...
              </div>
              <button
                onClick={() => {
                  const rec = historyModalRecord;
                  setHistoryModalRecord(null);
                  onRunAuditForRecord(rec);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Jalankan Audit Ulang Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: OpenStreetMap Viewer per Metadata Record */}
      {mapModalRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Letak Geografis Metadata: {mapModalRecord.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                      {mapModalRecord.inventoryNumber}
                    </span>
                  </h3>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    File: {mapModalRecord.sourceFileName} · Format: {mapModalRecord.fileFormat}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setMapModalRecord(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <OpenStreetMapViewer
                spatialData={resolveSpatialFromRecord(mapModalRecord)}
                datasetTitle={mapModalRecord.title}
                heightClass="h-[460px]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

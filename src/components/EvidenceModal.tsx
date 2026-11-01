/**
 * KOMPAS - Parameter Evidence & Remediation Modal
 * Displays technical details, source paths, and actionable recommendations.
 */

import React from 'react';
import { X, CheckCircle2, AlertTriangle, XCircle, HelpCircle, ExternalLink, ShieldAlert } from 'lucide-react';
import { ParameterAuditResult } from '../types/audit';
import { MQI_CATEGORIES } from '../audit/methodology';

interface EvidenceModalProps {
  result: ParameterAuditResult | null;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ result, onClose }) => {
  if (!result) return null;

  const categoryName = MQI_CATEGORIES[result.category]?.name || result.category;

  const getStatusBadge = () => {
    switch (result.status) {
      case 'terpenuhi':
        return (
          <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Terpenuhi (Pass)</span>
          </div>
        );
      case 'tidak_terpenuhi':
        return (
          <div className="flex items-center gap-1.5 text-amber-400 text-sm font-medium">
            <AlertTriangle className="w-4 h-4" />
            <span>Tidak Terpenuhi (Missing)</span>
          </div>
        );
      case 'tidak_valid':
        return (
          <div className="flex items-center gap-1.5 text-rose-400 text-sm font-medium">
            <XCircle className="w-4 h-4" />
            <span>Tidak Valid (Invalid / Placeholder)</span>
          </div>
        );
      case 'tidak_berlaku':
        return (
          <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
            <span>Tidak Berlaku (N/A)</span>
          </div>
        );
      case 'perlu_ditinjau':
        return (
          <div className="flex items-center gap-1.5 text-sky-400 text-sm font-medium">
            <HelpCircle className="w-4 h-4" />
            <span>Perlu Ditinjau Manual</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
            <span>Belum Diperiksa</span>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
          aria-label="Tutup jendela rincian"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>{result.ruleId}</span>
            <span aria-hidden="true">·</span>
            <span>{categoryName}</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">Bobot {result.weight} ({result.importance})</span>
          </div>
          <h2 id="modal-title" className="text-xl font-bold text-white">
            {result.name}
          </h2>
        </div>

        {/* Status & Methodology Provenance */}
        <div className="grid grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-lg border border-slate-800/80 mb-5">
          <div>
            <div className="text-xs text-slate-400 mb-1 font-medium">Status Audit</div>
            {getStatusBadge()}
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-1 font-medium">Sumber Metodologi</div>
            <div className="text-sm text-slate-200">
              {result.source === 'jurnal_hasara_2026' ? (
                <span className="text-cyan-300 font-medium">Jurnal Hasara & Karunanayaka (2026)</span>
              ) : (
                <span className="text-indigo-300 font-medium">Adaptasi Spesifik KOMPAS</span>
              )}
            </div>
          </div>
        </div>

        {/* Expected Format */}
        <div className="space-y-4 mb-6 text-sm">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Format yang Diharapkan
            </label>
            <div className="bg-slate-800/60 p-2.5 rounded font-mono text-xs text-slate-300 border border-slate-700/50">
              {result.expectedFormat}
            </div>
          </div>

          {/* Value Found */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Nilai yang Ditemukan di Berkas
            </label>
            <div className="bg-slate-800/60 p-2.5 rounded font-mono text-xs text-slate-300 border border-slate-700/50 break-words">
              {result.valueFound !== null && result.valueFound !== undefined
                ? String(result.valueFound)
                : '<Tidak ditemukan / null>'}
            </div>
          </div>

          {/* Source Path */}
          {result.sourcePath && (
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Lintasan Elemen Berkas (XPath / JSON Path)
              </label>
              <div className="bg-slate-800/60 p-2.5 rounded font-mono text-xs text-cyan-300 border border-slate-700/50">
                {result.sourcePath}
              </div>
            </div>
          )}

          {/* Finding Message */}
          {result.findingMessage && (
            <div className="bg-rose-950/30 border border-rose-800/50 p-3.5 rounded-lg">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-rose-300 text-xs uppercase tracking-wide">
                    Temuan Masalah Audit
                  </div>
                  <div className="text-slate-200 mt-1 leading-relaxed">
                    {result.findingMessage}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recommendation */}
          {result.recommendation && (
            <div className="bg-cyan-950/30 border border-cyan-800/50 p-3.5 rounded-lg">
              <div className="font-semibold text-cyan-300 text-xs uppercase tracking-wide mb-1">
                Rekomendasi Perbaikan Spesifik
              </div>
              <div className="text-slate-200 leading-relaxed">
                {result.recommendation}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

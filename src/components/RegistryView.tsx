/**
 * KOMPAS - Metadata Audit Rule Registry Explorer
 * Allows users to inspect every rule, its formula weight, source, and definition.
 */

import React, { useState } from 'react';
import { Search, BookOpen, ExternalLink, ShieldCheck, HelpCircle } from 'lucide-react';
import { AUDIT_RULE_REGISTRY } from '../audit/registry';
import { MQI_CATEGORIES } from '../audit/methodology';
import { MQICategory } from '../types/audit';

export const RegistryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedIso, setSelectedIso] = useState<string>('all');

  const filteredRules = AUDIT_RULE_REGISTRY.filter((rule) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        rule.id.toLowerCase().includes(q) ||
        rule.name.toLowerCase().includes(q) ||
        rule.definition.toLowerCase().includes(q) ||
        (rule.iso19115Tag && rule.iso19115Tag.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (selectedCat !== 'all' && rule.category !== selectedCat) return false;
    if (selectedSource !== 'all' && rule.source !== selectedSource) return false;
    if (selectedIso === 'core' && !rule.isIso19115Core) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Concept Explanation */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>KAMUS & SPESIFIKASI PARAMETER AUDIT (MQI)</span>
            <span aria-hidden="true">·</span>
            <span>STANDARISASI DATA GEOSPASIAL KELAUTAN</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Katalog Parameter Audit Geospasial
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Kamus parameter acuan formal yang mengatur seluruh evaluasi mutu metadata dan dataset spasial kelautan di KOMPAS. Setiap parameter mendefinisikan definisi operasional, spesifikasi format, bobot matematis, dan logika verifikasi berbasis SNI ISO 19115 dan IHO S-102.
          </p>
        </div>

        {/* Informative Explanation Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
            <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
              1. Standar Acuan Terpusat
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Mencegah logika pengujian tersebar terpisah. Seluruh parameter dari 8 kategori fundamental dikelola terpusat dengan kriteria validasi seragam.
            </p>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
            <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
              2. Keterlacakan Bukti & Lintasan Data
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Menyimpan lintasan pemetaan elemen sumber (XPath XML atau JSONPath), pendeteksi nilai placeholder, serta pemisahan sumber rujukan jurnal vs adaptasi.
            </p>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
            <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
              3. Pembobotan Matematis MQI
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Menyediakan bobot resmi (Kritis = 3, Penting = 2, Tambahan = 1) yang dihitung langsung ke dalam pembilang dan penyebut formula mutu Hasara (2026).
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari kode parameter (misal: TVU, EXT-01), nama, atau definisi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Kategori ({Object.keys(MQI_CATEGORIES).length})</option>
            {Object.keys(MQI_CATEGORIES).map((k) => (
              <option key={k} value={k}>
                {MQI_CATEGORIES[k as MQICategory].name}
              </option>
            ))}
          </select>

          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Dasar Rujukan</option>
            <option value="jurnal_hasara_2026">Jurnal Hasara & Karunanayaka (2026)</option>
            <option value="adaptasi_kompas">Adaptasi Tematik KOMPAS</option>
          </select>

          <select
            value={selectedIso}
            onChange={(e) => setSelectedIso(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-cyan-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 font-medium"
          >
            <option value="all">Semua Standar</option>
            <option value="core">Hanya Elemen Inti ISO 19115</option>
          </select>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRules.map((rule) => {
          const cat = MQI_CATEGORIES[rule.category];
          const importanceLabel =
            rule.importance === 'critical'
              ? 'Kritis (Bobot 3)'
              : rule.importance === 'important'
              ? 'Penting (Bobot 2)'
              : 'Tambahan (Bobot 1)';

          return (
            <div
              key={rule.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      {rule.id}
                    </span>
                    {rule.isIso19115Core && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 font-semibold">
                        ISO 19115 Core
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                      {importanceLabel}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      rule.source === 'jurnal_hasara_2026'
                        ? 'border-cyan-800/80 bg-cyan-950/40 text-cyan-300'
                        : 'border-indigo-800/80 bg-indigo-950/40 text-indigo-300'
                    }`}>
                      {rule.source === 'jurnal_hasara_2026' ? 'Jurnal Hasara 2026' : 'Adaptasi Tematik'}
                    </span>
                  </div>
                </div>

                <h3 className="font-semibold text-sm text-white mb-1">
                  {rule.name}
                </h3>
                <div className="text-xs text-slate-400 leading-relaxed mb-3">
                  {rule.definition}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                {rule.iso19115Tag && (
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">UML ISO 19115 / XPath:</span>
                    <span className="font-mono text-cyan-300 text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 inline-block mt-0.5">
                      {rule.iso19115Tag}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Spesifikasi Format Acuan:</span>
                  <span className="font-mono text-slate-300 text-[11px]">{rule.expectedFormat}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Kelompok Kategori Metadata:</span>
                  <span className="text-slate-400">{cat?.name}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

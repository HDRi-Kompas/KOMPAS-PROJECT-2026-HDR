/**
 * KOMPAS - Methodology Documentation & Scientific Reference View
 * Academic documentation of Hasara & Karunanayaka (2026) and KOMPAS Adaptations.
 */

import React from 'react';
import {
  BookOpen,
  Scale,
  FileText,
  AlertTriangle,
  Download,
  ExternalLink,
  Layers,
  CheckCircle2,
  ListOrdered,
  ShieldCheck,
} from 'lucide-react';
import {
  METHODOLOGY_METADATA,
  MQI_CATEGORIES,
  INDONESIAN_STANDARDS_SNI,
  ISO19115_CORE_ELEMENTS,
  ISO19115_PACKAGE_MAPPING,
} from '../audit/methodology';
import { MQICategory } from '../types/audit';

export const MethodologyView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
          <span>LANDASAN TEORETIS & STANDARISASI MSDI</span>
          <span aria-hidden="true">·</span>
          <span>IJRSI FEBRUARI 2026</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Pedoman Metodologi Metadata Quality Index (MQI)
        </h1>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          Dokumentasi formal formula penilaian kuantitatif, delapan kategori metadata, 15 parameter kritis, pembobotan bertingkat, dan tiga level integrasi MSDI sesuai publikasi ilmiah Hasara & Karunanayaka (2026).
        </p>
      </div>

      {/* Primary Reference Citation Box with Direct PDF Access */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase">
            <BookOpen className="w-4 h-4" />
            <span>Rujukan Penelitian Utama</span>
          </div>
          <a
            href={METHODOLOGY_METADATA.originalPaper.pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Buka Berkas Jurnal Asli (PDF 19 Halaman)</span>
          </a>
        </div>

        <div>
          <h2 className="text-lg font-bold text-white">
            {METHODOLOGY_METADATA.originalPaper.title}
          </h2>
          <div className="text-xs text-slate-300 font-mono mt-1">
            Penulis: <strong>{METHODOLOGY_METADATA.originalPaper.authors}</strong> ({METHODOLOGY_METADATA.originalPaper.year}) · {METHODOLOGY_METADATA.originalPaper.institution}
          </div>
          <div className="text-xs text-slate-400 font-mono mt-0.5">
            Publikasi: {METHODOLOGY_METADATA.originalPaper.journal}, {METHODOLOGY_METADATA.originalPaper.volume} (ISSN {METHODOLOGY_METADATA.originalPaper.issn}) · DOI: {METHODOLOGY_METADATA.originalPaper.doi}
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed pt-1">
          Penelitian ini memformulasikan kerangka kuantitatif berbasis bobot untuk mengukur kelayakan metadata batimetri dalam infrastruktur data spasial kelautan (*Marine Spatial Data Infrastructure* / MSDI). Menggunakan uji empiris terhadap 12 dataset hidrografi (1991–2024), penelitian ini mengungkap bahwa dokumentasi kalibrasi sensor dan kuantifikasi ketidakpastian posisi (*uncertainty reporting*) merupakan celah sistematis terbesar dalam data warisan (*legacy data*).
        </p>
      </div>

      {/* Two Layers of Methodology (Mandatory Distinction) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <h3 className="font-bold text-white text-base">
              A. MQI Asli (Jurnal Hasara 2026)
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Mewakili parameter batimetri murni, 15 parameter kritis, bobot 3-2-1, dan formula yang diverifikasi langsung dari jurnal:
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside font-mono">
            <li>Berfokus pada survei batimetri SBES dan MBES.</li>
            <li>Wajib memverifikasi ketidakpastian vertikal (TVU) dan horizontal (THU).</li>
            <li>Wajib mencatat kalibrasi sensor, status koreksi SVP, dan reduksi pasut ke LAT/MSL.</li>
            <li>Ambang batas kelayakan mutu MSDI (Tabel 2 & Tabel 9).</li>
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
            <h3 className="font-bold text-white text-base">
              B. KOMPAS Adapted MQI
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Adaptasi terverifikasi untuk keberagaman ekosistem dan tata ruang kelautan Indonesia:
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside font-mono">
            <li>Mendukung terumbu karang, mangrove, habitat bentik, dan kawasan konservasi.</li>
            <li>Parameter khusus batimetri berstatus "Tidak Berlaku" dan dikeluarkan dari penyebut.</li>
            <li>Parameter tambahan tematik (misal SK Menteri/Perda penetapan kawasan) dicatat transparan.</li>
            <li>Audit topologi spasial GeoJSON dan ZIP Shapefile (.shp/.dbf/.prj).</li>
          </ul>
        </div>
      </div>

      {/* Formula & Weighting System */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-cyan-400" />
          <span>Formula Matematis & Struktur Bobot Kritis</span>
        </h3>

        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-center">
          <div className="text-base font-bold text-cyan-300 tracking-wider">
            MQI = ( Σ (pᵢ × wᵢ) / Σ wᵢ ) × 100
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Di mana <strong className="text-slate-200">pᵢ = 1</strong> jika parameter terdokumentasi dan valid, atau <strong className="text-slate-200">0</strong> jika tidak terpenuhi. <strong className="text-slate-200">wᵢ</strong> adalah bobot parameter.
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-950/60 rounded-lg border border-rose-900/40 space-y-1">
            <div className="font-bold text-rose-400 uppercase font-mono">Critical (Bobot = 3)</div>
            <p className="text-slate-400 leading-relaxed">
              Esensial untuk penemuan dataset dan evaluasi awal kelayakan teknis. Ketiadaannya menggugurkan skor final atau menghasilkan skor sementara.
            </p>
          </div>
          <div className="p-3.5 bg-slate-950/60 rounded-lg border border-amber-900/40 space-y-1">
            <div className="font-bold text-amber-400 uppercase font-mono">Important (Bobot = 2)</div>
            <p className="text-slate-400 leading-relaxed">
              Diperlukan untuk evaluasi ketidakpastian mendalam dan penentuan kesesuaian tujuan (*fitness-for-purpose*).
            </p>
          </div>
          <div className="p-3.5 bg-slate-950/60 rounded-lg border border-cyan-900/40 space-y-1">
            <div className="font-bold text-cyan-400 uppercase font-mono">Supplementary (Bobot = 1)</div>
            <p className="text-slate-400 leading-relaxed">
              Konteks deskriptif pelengkap yang memperkaya keterlacakan sekunder dan interoperabilitas metadata.
            </p>
          </div>
        </div>
      </div>

      {/* 15 Critical Parameters from Table 7 in Paper */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-rose-400" />
            <span>15 Parameter Kritis Batimetri (Tabel 7 Jurnal, Bobot = 3)</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Weight = 3</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Hasara & Karunanayaka (2026) menetapkan 15 parameter di bawah ini sebagai parameter berbobot tertinggi (*Critical*) yang menentukan apakah suatu dataset batimetri dapat dimanfaatkan untuk aplikasi kritis keselamatan navigasi atau rekayasa maritim:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs font-mono">
          {METHODOLOGY_METADATA.criticalParametersList.map((param, idx) => (
            <div key={idx} className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg flex items-center gap-2">
              <span className="text-rose-400 font-bold text-[11px]">{idx + 1}.</span>
              <span className="text-slate-200">{param}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table 9: Minimum Metadata Thresholds for MSDI Integration */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ListOrdered className="w-5 h-5 text-cyan-400" />
          <span>Tiga Tingkat Integrasi MSDI (Tabel 9 Jurnal)</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Berdasarkan jurnal Hasara (2026), pemenuhan metadata dikelompokkan ke dalam 3 tingkatan operasional infrastruktur data spasial:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {METHODOLOGY_METADATA.msdiIntegrationLevels.map((lvl) => (
            <div key={lvl.level} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-white font-mono text-sm">{lvl.name}</span>
                  <span className="text-xs font-mono font-bold text-cyan-400">MQI ≥ {lvl.minMqi}%</span>
                </div>
                <div className="text-slate-300 text-xs mb-2 leading-relaxed">
                  {lvl.description}
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] space-y-1">
                  <span className="text-slate-500 font-mono block uppercase">Parameter Kritis Wajib:</span>
                  <div className="text-cyan-300 font-mono">{lvl.requiredCriticalParameters.join(', ')}</div>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800 font-mono">
                Aplikasi: {lvl.exampleApplications}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table 2: Metadata Quality Index Thresholds and Interpretations */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white">
          Ambang Batas Kualitas Mutu MQI (Tabel 2 Jurnal)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
              <tr>
                <th className="py-2.5 px-3">Rentang MQI</th>
                <th className="py-2.5 px-3">Kategori Mutu</th>
                <th className="py-2.5 px-3">Interpretasi Kelengkapan</th>
                <th className="py-2.5 px-3">Kesesuaian MSDI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {METHODOLOGY_METADATA.tiers.map((t) => (
                <tr key={t.label} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-bold text-white">{t.min} - {t.max}%</td>
                  <td className="py-2.5 px-3">
                    <span className={
                      t.label === 'Excellent' ? 'text-emerald-400 font-bold' :
                      t.label === 'Good' ? 'text-cyan-400 font-bold' :
                      t.label === 'Fair' ? 'text-amber-400 font-bold' :
                      t.label === 'Poor' ? 'text-rose-400 font-bold' :
                      'text-red-500 font-bold'
                    }>
                      {t.label}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-300">{t.description}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-400">
                    {t.label === 'Excellent' ? 'Full reuse capability; suitable for all applications' :
                     t.label === 'Good' ? 'Suitable for most applications with some limitations' :
                     t.label === 'Fair' ? 'Suitable for discovery and basic evaluation; reuse requires caution' :
                     t.label === 'Poor' ? 'Discovery only; significant limitations for evaluation/reuse' :
                     'Limited discovery value; requires retrospective documentation'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 8 Metadata Categories List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white">
          Delapan Kategori Fundamental Metadata (72 Parameter Total)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {(Object.keys(MQI_CATEGORIES) as MQICategory[]).map((k) => (
            <div key={k} className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
              <div className="font-semibold text-white">
                {MQI_CATEGORIES[k].name} ({MQI_CATEGORIES[k].nameEn})
              </div>
              <div className="text-slate-400 leading-relaxed">
                {MQI_CATEGORIES[k].description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arsitektur Standar ISO 19115 & Pemetaan Paket UML ke Kategori MQI */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Arsitektur Standar ISO 19115 & Pemetaan Paket UML ke MQI
            </h3>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
            ISO 19115-1:2014 & SNI ISO 19115:2012
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Dalam jurnal Hasara & Karunanayaka (2026), kerangka 72 parameter audit dikembangkan secara ilmiah dari sintesis standar internasional <strong className="text-cyan-300 font-semibold">ISO 19115-1:2014</strong>, standar hidrografi <strong className="text-cyan-300 font-semibold">IHO S-102</strong>, dan <strong className="text-cyan-300 font-semibold">IHO S-100</strong>. Di Indonesia, standar ini telah diadopsi penuh oleh BSN dan BIG sebagai <strong className="text-emerald-300 font-semibold">SNI ISO 19115:2012</strong>.
        </p>

        {/* UML Package to MQI Category Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
              <tr>
                <th className="py-2.5 px-3">Paket UML ISO 19115</th>
                <th className="py-2.5 px-3">Klausul Standar</th>
                <th className="py-2.5 px-3">Kategori MQI Terkait</th>
                <th className="py-2.5 px-3">Deskripsi Pemetaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {ISO19115_PACKAGE_MAPPING.map((pkg) => (
                <tr key={pkg.package} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-bold text-cyan-300">{pkg.package}</td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">{pkg.iso19115Part}</td>
                  <td className="py-2.5 px-3 text-white font-sans text-xs">
                    {pkg.mqiCategories.map(c => MQI_CATEGORIES[c as MQICategory]?.name).join(', ')}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 font-sans text-xs">{pkg.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Core Elements Specification Accordion / List */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-200">
              13 Elemen Metadata Inti (ISO 19115 Core Metadata Set / Annex F)
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Diwajibkan untuk Katalog Discovery NSDI / MSDI
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {ISO19115_CORE_ELEMENTS.map((el) => (
              <div key={el.code} className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800/90 flex flex-col justify-between gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-white">{el.nameId} ({el.name})</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                    el.isMandatory
                      ? 'border-rose-900/60 bg-rose-950/40 text-rose-300'
                      : 'border-slate-700 bg-slate-800 text-slate-300'
                  }`}>
                    {el.isMandatory ? 'Wajib (M)' : 'Kondisional (C)'}
                  </span>
                </div>
                <div className="text-cyan-400 font-mono text-[10px] truncate" title={el.isoTag}>
                  Tag: {el.isoTag}
                </div>
                <div className="text-slate-400 text-[11px]">
                  {el.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Standar Acuan Nasional (SNI) & Standar Internasional Teradopsi */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Standar Acuan Nasional (SNI) & Standar Internasional Teradopsi</span>
          </h3>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
            BSN · BIG · Pushidrosal
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          KOMPAS mengimplementasikan aturan audit dan pemetaan elemen berdasarkan Standar Nasional Indonesia (SNI) resmi yang diterbitkan oleh Badan Standardisasi Nasional (BSN), Badan Informasi Geospasial (BIG), dan Kementerian/Lembaga terkait:
        </p>
        <div className="space-y-2.5">
          {INDONESIAN_STANDARDS_SNI.map((sni, idx) => (
            <div key={idx} className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/80">
                    {sni.code}
                  </span>
                  <span className="font-medium text-white">
                    {sni.title}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {sni.scope}
                </p>
              </div>
              <div className="shrink-0 text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800 self-start">
                {sni.authority}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scientific Boundary Disclaimer */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-3 text-xs text-slate-400 leading-relaxed">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200 block mb-0.5">Batasan Ilmiah Audit:</strong>
          KOMPAS mengaudit kualitas dokumentasi metadata dan validitas teknis berkas yang dapat diperiksa secara otomatis. Kelengkapan metadata tidak boleh disamakan sebagai pembuktian bahwa data pengukuran lapangan 100% akurat atau mutlak bebas dari kesalahan geodetik di lapangan.
        </div>
      </div>
    </div>
  );
};

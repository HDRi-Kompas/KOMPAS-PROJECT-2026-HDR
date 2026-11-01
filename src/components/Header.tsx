/**
 * KOMPAS - Top Navigation Bar
 * Follows the Top Bar Contract: Brand Wordmark | Clean Nav Links | 1 Primary CTA
 */

import React from 'react';
import { Compass, ShieldCheck, UploadCloud } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onQuickUpload: () => void;
  activeAuditCount: number;
  inventoryCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onQuickUpload,
  activeAuditCount,
  inventoryCount = 0,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'inventory', label: 'Inventaris Metadata' },
    { id: 'upload', label: 'Unggah & Audit' },
    { id: 'results', label: 'Hasil Audit' },
    { id: 'registry', label: 'Parameter Audit' },
    { id: 'history', label: 'Riwayat Audit' },
    { id: 'methodology', label: 'Metodologi & BIG No. 3' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark (Single element) */}
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 text-left text-white hover:text-cyan-400 transition-colors shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded"
            aria-label="KOMPAS Beranda"
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 border border-cyan-500/30 flex items-center justify-center shadow-md shadow-cyan-900/40 p-0.5 group-hover:border-cyan-400 group-hover:shadow-cyan-500/20 transition-all shrink-0">
              <img
                src="/kompas-logo.jpeg"
                alt="Logo KOMPAS"
                className="w-full h-full object-contain rounded"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                KOMPAS
              </span>
              <span className="text-[10px] tracking-wider uppercase text-cyan-400 font-mono -mt-1">
                ISO · SNI · MQI
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Single-line whitespace-nowrap) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3.5 py-1.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 rounded-md ${
                    isActive
                      ? 'text-cyan-400 bg-slate-800/80 shadow-sm border border-slate-700/60'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  {item.label}
                  {item.id === 'inventory' && inventoryCount > 0 && (
                    <span className="ml-1.5 text-xs font-mono text-cyan-400">
                      ({inventoryCount})
                    </span>
                  )}
                  {item.id === 'results' && activeAuditCount > 0 && (
                    <span className="ml-1.5 text-xs font-mono text-cyan-400">
                      ({activeAuditCount})
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onQuickUpload}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Mulai Audit Baru</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

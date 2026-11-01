/**
 * KOMPAS - Audit Execution Progress View
 * Renders the multi-stage inspection pipeline in real-time.
 */

import React from 'react';
import { CheckCircle2, Loader2, Clock, AlertCircle } from 'lucide-react';

export interface AuditStepState {
  id: number;
  label: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  errorDetails?: string;
}

interface AuditProgressViewProps {
  steps: AuditStepState[];
  currentDatasetName: string;
}

export const AuditProgressView: React.FC<AuditProgressViewProps> = ({
  steps,
  currentDatasetName,
}) => {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
          Pipeline Mesin Audit Geospasial
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Memeriksa Kualitas Dataset
        </h2>
        <p className="text-sm text-slate-400 font-mono truncate max-w-md mx-auto">
          {currentDatasetName}
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 divide-y divide-slate-800/80">
        {steps.map((step) => {
          return (
            <div key={step.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-4">
              <div className="mt-0.5 shrink-0">
                {step.status === 'completed' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                )}
                {step.status === 'running' && (
                  <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                )}
                {step.status === 'pending' && (
                  <Clock className="w-5 h-5 text-slate-600" />
                )}
                {step.status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className={`text-sm font-semibold ${
                    step.status === 'completed'
                      ? 'text-white'
                      : step.status === 'running'
                      ? 'text-cyan-300'
                      : step.status === 'error'
                      ? 'text-rose-300'
                      : 'text-slate-500'
                  }`}>
                    {step.id}. {step.label}
                  </div>
                  <span className="text-[10px] font-mono uppercase text-slate-500">
                    {step.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {step.description}
                </div>
                {step.errorDetails && (
                  <div className="mt-1 text-xs text-rose-400 font-mono bg-rose-950/40 p-2 rounded border border-rose-900/60">
                    {step.errorDetails}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

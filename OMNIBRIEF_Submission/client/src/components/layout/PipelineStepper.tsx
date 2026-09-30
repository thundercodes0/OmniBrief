import React from 'react';
import {
  FileText,
  FileCheck2,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useTransformationStore } from '../../store/useTransformationStore';

export const PipelineStepper: React.FC = () => {
  const { pipelineStage, generationLatency, sourceBrief, artifacts } =
    useTransformationStore();

  const steps = [
    {
      id: 'ingestion',
      label: '1. Ingestion',
      sublabel: 'PDF / Text / Context',
      icon: FileText,
      status:
        pipelineStage === 'extracting_brief'
          ? 'active'
          : sourceBrief
          ? 'completed'
          : 'pending',
    },
    {
      id: 'brief',
      label: '2. Source Brief',
      sublabel: 'Single Ground Truth Anchor',
      icon: FileCheck2,
      status:
        pipelineStage === 'extracting_brief'
          ? 'loading'
          : sourceBrief
          ? 'completed'
          : 'pending',
    },
    {
      id: 'fanout',
      label: '3. Fan-Out (7 Formats)',
      sublabel: 'Parallel Gemini 3.8 Flash',
      icon: Cpu,
      status:
        pipelineStage === 'generating_artifacts'
          ? 'loading'
          : artifacts
          ? 'completed'
          : 'pending',
    },
    {
      id: 'audit',
      label: '4. Grounding Audit',
      sublabel: 'Closed-Loop NLI Verifier',
      icon: ShieldCheck,
      status:
        pipelineStage === 'generating_artifacts'
          ? 'loading'
          : artifacts
          ? 'completed'
          : 'pending',
    },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 px-5 flex items-center justify-between shadow-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = step.status === 'completed';
          const isLoading = step.status === 'loading';
          const isActive = step.status === 'active';

          return (
            <div key={step.id} className="flex items-center gap-3">
              <div
                className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : isLoading
                    ? 'bg-brand-500/20 text-brand-400 border border-brand-500/40 animate-pulse'
                    : isActive
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    : 'bg-slate-800 text-slate-500 border border-slate-700/50'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-brand-400" />
                ) : isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>

              <div>
                <p
                  className={`text-xs font-semibold tracking-tight ${
                    isCompleted
                      ? 'text-slate-200'
                      : isLoading
                      ? 'text-brand-300'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[11px] text-slate-500 truncate max-w-[140px]">
                  {step.sublabel}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {generationLatency && (
        <div className="hidden xl:flex items-center pl-6 border-l border-slate-800 text-right">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider block">
              Fan-Out Speed
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {(generationLatency / 1000).toFixed(2)}s Total
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

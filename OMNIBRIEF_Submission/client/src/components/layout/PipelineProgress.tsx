import React from 'react';
import {
  FileText,
  Search,
  FileCheck2,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { PipelineStep } from '../../types/transformation';

export const PipelineProgress: React.FC = () => {
  const { pipelineStatus, isProcessing } = useAppStore();

  const steps: {
    id: PipelineStep;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'source', label: 'Source', sublabel: 'Inputs Ingested', icon: FileText },
    { id: 'analyzing', label: 'Analyzing', sublabel: 'Document Parsing', icon: Search },
    { id: 'source_brief', label: 'Source Brief', sublabel: 'Single Truth Anchor', icon: FileCheck2 },
    { id: 'generating_outputs', label: 'Generating Outputs', sublabel: 'Parallel Fan-Out', icon: Cpu },
    { id: 'fact_verification', label: 'Fact Verification', sublabel: 'Grounding Check', icon: ShieldCheck },
    { id: 'complete', label: 'Complete', sublabel: '7 Artefacts Ready', icon: CheckCircle2 },
  ];

  const stepOrder: PipelineStep[] = [
    'source',
    'analyzing',
    'source_brief',
    'generating_outputs',
    'fact_verification',
    'complete',
  ];

  const currentStepIndex = stepOrder.indexOf(pipelineStatus);

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
      <div className="flex items-center justify-between overflow-x-auto gap-2 scrollbar-none">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx < currentStepIndex || pipelineStatus === 'complete';
          const isCurrent = idx === currentStepIndex && pipelineStatus !== 'complete';

          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2.5 min-w-[140px] shrink-0">
                <div
                  className={`h-8 w-8 rounded-xl flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-xs'
                      : isCurrent
                      ? 'bg-amber-50 text-amber-700 border border-amber-300 shadow-xs animate-pulse'
                      : 'bg-stone-100 text-stone-400 border border-stone-200'
                  }`}
                >
                  {isCurrent && isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>

                <div>
                  <p
                    className={`text-xs font-bold leading-tight ${
                      isCompleted
                        ? 'text-stone-900'
                        : isCurrent
                        ? 'text-amber-800'
                        : 'text-stone-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[10px] text-stone-500 leading-tight">
                    {step.sublabel}
                  </p>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:flex items-center text-stone-300 shrink-0">
                  <ChevronRight className="h-4 w-4" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

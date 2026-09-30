import React, { useState } from 'react';
import {
  Copy,
  Check,
  RotateCw,
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { InfographicArtifact } from '@shared/types';
import { useTransformationStore } from '../../store/useTransformationStore';

interface Props {
  data: InfographicArtifact;
}

export const InfographicViewer: React.FC<Props> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const { regenerateSingleArtifact, pipelineStage } = useTransformationStore();

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />;
      case 'down':
        return <TrendingDown className="h-3.5 w-3.5 text-rose-400" />;
      case 'alert':
        return <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
            Format 5 · Visual Layout & Data Canvas
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">
            {data.title}
          </h2>
          <p className="text-xs text-slate-400">{data.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => regenerateSingleArtifact('infographic')}
            disabled={pipelineStage === 'generating_artifacts'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Regenerate Infographic"
          >
            <RotateCw className="h-4 w-4" />
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shadow-sm"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied Spec</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-400" />
                <span>Copy JSON Spec</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Infographic Canvas Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
        {/* Infographic Banner */}
        <div className="text-center py-4 border-b border-slate-800/80">
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-400 px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 inline-block mb-2">
            Visual Intelligence Summary
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {data.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mt-1 font-medium">
            {data.subtitle}
          </p>
        </div>

        {/* 4 Hero KPI Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.kpiStats.map((kpi, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-400">
                  {kpi.label}
                </span>
                {getTrendIcon(kpi.trend)}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight my-1">
                {kpi.value}
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                {kpi.subtitle}
              </p>
              {/* Subtle top color bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-purple-500"></div>
            </div>
          ))}
        </div>

        {/* Process Flow Timeline */}
        {data.workflowOrTimeline?.length > 0 && (
          <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-brand-400" />
              Strategic Execution & Lifecycle Process
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 relative">
              {data.workflowOrTimeline.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between relative"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="h-6 w-6 rounded-lg bg-brand-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                        {step.stepNumber || idx + 1}
                      </span>
                      <h4 className="text-xs font-bold text-slate-200 truncate">
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Takeaway Callout Box */}
        {data.keyTakeawayBox && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-slate-950 border border-purple-800/40 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300 block mb-0.5">
                Core Infographic Takeaway
              </span>
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                {data.keyTakeawayBox}
              </p>
            </div>
          </div>
        )}

        {/* Comparative Data Points */}
        {data.dataPointsOrComparison?.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Comparative Dimension Breakdown
            </h3>
            <div className="divide-y divide-slate-800/80">
              {data.dataPointsOrComparison.map((dp, idx) => (
                <div
                  key={idx}
                  className="py-2.5 flex items-center justify-between text-xs"
                >
                  <span className="text-slate-300 font-medium">
                    {dp.category}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-white bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                      {dp.valueA}
                    </span>
                    {dp.valueB && (
                      <span className="font-mono text-slate-400 text-[11px]">
                        vs {dp.valueB}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

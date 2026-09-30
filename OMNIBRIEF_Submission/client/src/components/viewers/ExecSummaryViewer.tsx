import React, { useState } from 'react';
import {
  Copy,
  Check,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  FileDown,
  RotateCw,
} from 'lucide-react';
import { ExecutiveSummaryArtifact } from '@shared/types';
import { useTransformationStore } from '../../store/useTransformationStore';

interface Props {
  data: ExecutiveSummaryArtifact;
}

export const ExecSummaryViewer: React.FC<Props> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const { regenerateSingleArtifact, pipelineStage } = useTransformationStore();

  const handleCopy = () => {
    const text = `${data.title}\n\nTL;DR:\n${data.tldr}\n\nKey Findings:\n${data.keyFindings.map((f) => `• ${f}`).join('\n')}\n\nStrategic Implications:\n${data.strategicImplications.map((s) => `• ${s}`).join('\n')}\n\nRecommended Actions:\n${data.recommendedActions.map((a) => `• ${a}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-brand-400 tracking-wider">
            Format 1 · Leadership Briefing
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">
            {data.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => regenerateSingleArtifact('executive_summary')}
            disabled={pipelineStage === 'generating_artifacts'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Regenerate Executive Summary"
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
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-400" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* TL;DR Callout Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-brand-950/60 via-indigo-950/40 to-slate-900 border border-brand-800/40 shadow-sm">
        <span className="text-[10px] uppercase font-bold tracking-wider text-brand-300 mb-1.5 block">
          Executive TL;DR
        </span>
        <p className="text-sm text-slate-200 leading-relaxed font-medium">
          {data.tldr}
        </p>
      </div>

      {/* Highlighted Metric Badges */}
      {data.highlightedMetrics?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {data.highlightedMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between"
            >
              <span className="text-xs text-slate-400 font-medium">
                {metric.label}
              </span>
              <div className="my-1 text-xl font-bold text-emerald-400 font-mono">
                {metric.value}
              </div>
              <span className="text-[11px] text-slate-500 truncate">
                {metric.significance}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Key Findings and Strategic Implications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Key Findings */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Key Strategic Findings
          </h3>
          <ul className="space-y-2.5">
            {data.keyFindings.map((finding, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0"></span>
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Strategic Implications */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-amber-400" />
            Operational & Business Implications
          </h3>
          <ul className="space-y-2.5">
            {data.strategicImplications.map((imp, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-brand-400" />
          Recommended Next Directives
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {data.recommendedActions.map((action, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 text-xs text-slate-200 flex items-start gap-2.5"
            >
              <span className="h-5 w-5 rounded bg-brand-500/20 text-brand-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                {idx + 1}
              </span>
              <span className="leading-snug">{action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

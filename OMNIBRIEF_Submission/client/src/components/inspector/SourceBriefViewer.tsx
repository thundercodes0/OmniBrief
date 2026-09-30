import React, { useState } from 'react';
import {
  FileCheck2,
  X,
  Copy,
  Check,
  Quote,
  TrendingUp,
  Users,
  AlertCircle,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const SourceBriefViewer: React.FC = () => {
  const { sourceBrief, isBriefModalOpen, setIsBriefModalOpen } = useAppStore();
  const [copied, setCopied] = useState(false);

  if (!isBriefModalOpen) return null;

  if (!sourceBrief) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto">
        <div className="bg-white border border-stone-200 rounded-2xl max-w-lg w-full p-8 flex flex-col items-center text-center shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700">
            <FileCheck2 className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-900 tracking-tight">
              No Source Brief Available
            </h3>
            <p className="text-xs text-stone-500 max-w-sm">
              A canonical Source Brief is created when you ingest source material. Start a new transformation to extract atomic ground truth claims and metrics.
            </p>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setIsBriefModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const brief = sourceBrief;
  const isLive = Boolean(sourceBrief.isLiveGenerated);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(brief, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-700">
              <FileCheck2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900">
                  Canonical Source Brief
                </h3>
                {isLive && (
                  <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-emerald-600" />
                    Live Gemini Generated
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500">
                Factual ground truth extracted by Gemini from your submitted source content
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsBriefModalOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* 1. Source Title & 2. Detected Domain */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                Source Title
              </span>
              <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                Domain: {brief.detectedDomain}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-stone-900 tracking-tight leading-snug">
              {brief.sourceTitle}
            </h2>
          </div>

          {/* 3. Executive Summary */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block mb-1">
              Executive Summary
            </span>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {brief.executiveSummary}
            </p>
          </div>

          {/* 4. Key Claims */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
              <Quote className="h-4 w-4 text-emerald-600" />
              Key Atomic Claims & Verbatim Ground Truth Citations
            </h4>
            <div className="space-y-2.5">
              {brief.keyClaims?.map((claim, idx) => {
                const claimId = claim.claimId || claim.id || `CLAIM-0${idx + 1}`;
                const statement = claim.statement || claim.claim || '';
                const quote = claim.verbatimSourceQuote || claim.sourceQuote || '';

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-5 px-2 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold text-[11px] flex items-center">
                          {claimId}
                        </span>
                        <span className="font-semibold text-stone-900">
                          {statement}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {(claim.confidence * 100).toFixed(0)}% Confidence
                      </span>
                    </div>

                    {quote && (
                      <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-600 italic flex items-start gap-2">
                        <Quote className="h-3.5 w-3.5 text-stone-400 shrink-0 mt-0.5" />
                        <span>"{quote}"</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Entities & 6. Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Entities */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                Entities & Stakeholders
              </h4>
              <div className="space-y-2 text-xs">
                {brief.entities && brief.entities.length > 0 ? (
                  brief.entities.map((ent, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-white border border-stone-200 flex items-center justify-between shadow-xs"
                    >
                      <div>
                        <p className="font-medium text-stone-900">{ent.name}</p>
                        <p className="text-[10px] text-stone-500">{ent.type}</p>
                      </div>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                        {ent.relevance} Relevance
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-stone-400 italic">No specific entities cataloged.</p>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Quantitative Data Points & Statistics
              </h4>
              <div className="space-y-2 text-xs">
                {brief.statistics && brief.statistics.length > 0 ? (
                  brief.statistics.map((stat, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-white border border-stone-200 flex items-center justify-between shadow-xs"
                    >
                      <div>
                        <p className="font-medium text-stone-900">{stat.metric}</p>
                        <p className="text-[10px] text-stone-500">{stat.context}</p>
                      </div>
                      <span className="font-mono font-bold text-emerald-700 text-sm">
                        {stat.value}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-stone-400 italic">No quantitative metrics in source.</p>
                )}
              </div>
            </div>
          </div>

          {/* 7. Recommendations */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              Actionable Recommendations & Directives
            </h4>
            <div className="space-y-2 text-xs">
              {brief.recommendations && brief.recommendations.length > 0 ? (
                brief.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-white border border-stone-200 text-stone-800 flex items-start gap-2.5 shadow-xs"
                  >
                    <span className="h-5 w-5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{rec}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-400 italic">No explicit recommendations in source.</p>
              )}
            </div>
          </div>

          {/* 8. Uncertainties */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              Uncertainties & Bounded Scope (Grounding Limits)
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-700">
              {brief.uncertainties && brief.uncertainties.length > 0 ? (
                brief.uncertainties.map((unc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{unc}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-stone-400 italic">No unverified uncertainties flagged.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  X,
  FileCheck2,
  Quote,
  TrendingUp,
  Users,
  AlertCircle,
  ShieldCheck,
  Tag,
  Copy,
  Check,
} from 'lucide-react';
import { useTransformationStore } from '../../store/useTransformationStore';

export const SourceBriefModal: React.FC = () => {
  const { sourceBrief, isBriefModalOpen, setIsBriefModalOpen } =
    useTransformationStore();
  const [copied, setCopied] = React.useState(false);

  if (!isBriefModalOpen || !sourceBrief) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(sourceBrief, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
              <FileCheck2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Canonical Source Brief
                </h3>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ground Truth Anchor
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Single unified intermediate representation anchoring all 7 downstream artefacts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied JSON</span>
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
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                Domain
              </span>
              <span className="font-semibold text-slate-200">
                {sourceBrief.meta.detectedDomain}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                Urgency Level
              </span>
              <span className="font-bold text-rose-400">
                {sourceBrief.meta.urgencyLevel}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                Language
              </span>
              <span className="font-semibold text-slate-200 uppercase font-mono">
                {sourceBrief.meta.primaryLanguage}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                Source Words
              </span>
              <span className="font-mono font-bold text-slate-200">
                {sourceBrief.meta.originalWordCount}
              </span>
            </div>
          </div>

          {/* Core Thesis */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-brand-950/60 to-slate-950 border border-brand-800/40">
            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-400 block mb-1">
              Core Central Thesis
            </span>
            <p className="text-sm font-medium text-white leading-relaxed">
              {sourceBrief.coreThesis}
            </p>
          </div>

          {/* Key Atomic Claims with Verbatim Quotes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Quote className="h-4 w-4 text-emerald-400" />
              Key Atomic Claims & Verbatim Ground Truth Quotes
            </h4>
            <div className="space-y-2.5">
              {sourceBrief.keyClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-5 px-2 rounded bg-brand-500/20 text-brand-300 font-mono font-bold text-[11px] flex items-center">
                        {claim.id}
                      </span>
                      <span className="font-semibold text-slate-200">
                        {claim.statement}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {claim.category} · {(claim.confidence * 100).toFixed(0)}% Conf
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 italic flex items-start gap-2">
                    <Quote className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span>"{claim.verbatimQuote}"</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quantitative Data & Entities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quantitative Data */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                Extracted Metrics & Data Points
              </h4>
              <div className="space-y-2 text-xs">
                {sourceBrief.quantitativeData.map((data, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-slate-200">{data.metric}</p>
                      <p className="text-[11px] text-slate-400">{data.context}</p>
                    </div>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {data.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Entities & Stakeholders */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-400" />
                Identified Entities & Roles
              </h4>
              <div className="space-y-2 text-xs">
                {sourceBrief.entitiesAndStakeholders.map((ent, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between"
                  >
                    <span className="font-medium text-slate-200">{ent.name}</span>
                    <span className="text-slate-400 text-[11px]">{ent.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bounds & Uncertainties */}
          {sourceBrief.boundsAndUncertainties?.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-amber-900/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-400" />
                Uncertainties & Bounded Scope (Anti-Hallucination Guardrails)
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {sourceBrief.boundsAndUncertainties.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

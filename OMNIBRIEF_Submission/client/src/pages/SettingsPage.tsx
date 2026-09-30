import React from 'react';
import {
  Cpu,
  Shield,
  CheckCircle2,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in duration-200">
      <div className="border-b border-stone-200 pb-4">
        <h2 className="text-lg font-bold text-stone-900 tracking-tight">
          Platform Settings & Configuration
        </h2>
        <p className="text-xs text-stone-500">
          Global preferences, model selection targets, and system architecture status
        </p>
      </div>


      {/* AI Model Architecture Specification */}
      <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-4 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-stone-150 pb-3">
          <Cpu className="h-5 w-5 text-amber-600" />
          <h3 className="text-sm font-bold text-stone-900">
            Configured AI Model Architecture
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-stone-500 block mb-1">Active AI Engine</span>
            <span className="font-bold text-stone-900 font-mono text-sm">
              Google Gemini 3.6 Flash
            </span>
            <p className="text-[11px] text-stone-500 mt-1">
              Configured via GEMINI_MODEL with candidate fallback to gemini-3.5-flash and gemini-3-flash-preview.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-stone-500 block mb-1">Execution Paradigm</span>
            <span className="font-bold text-emerald-700 font-mono text-sm">
              Parallel Fan-Out Worker Pool
            </span>
            <p className="text-[11px] text-stone-500 mt-1">
              Rate-paced batch generation with zero cross-channel contamination; all outputs grounded in the canonical Source Brief.
            </p>
          </div>
        </div>
      </div>

      {/* Target Security & Grounding Policy */}
      <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-4 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-stone-150 pb-3">
          <Shield className="h-5 w-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-stone-900">
            Anti-Hallucination & Grounding Safeguards
          </h3>
        </div>

        <div className="space-y-2.5 text-xs text-stone-600">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-stone-900">Canonical Source Brief Intermediate Layer</p>
              <p className="text-[11px] text-stone-500">
                Downstream generators are restricted to atomic claims and verbatim quotes extracted during the canonical analysis pass.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-stone-900">Automated Factual Verification & Deterministic Scoring</p>
              <p className="text-[11px] text-stone-500">
                Post-generation verifier cross-examines generated claims against the brief, scoring results deterministically server-side.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="pt-6 pb-2 text-center text-xs text-stone-400">
        © 2026 OmniBrief all rights reserved
      </footer>
    </div>
  );
};

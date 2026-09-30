import React, { useState } from 'react';
import {
  Copy,
  Check,
  RotateCw,
  AlertTriangle,
  ShieldAlert,
  Server,
  Clock,
  Send,
  Lock,
} from 'lucide-react';
import { AdvisoryArtifact } from '@shared/types';
import { useTransformationStore } from '../../store/useTransformationStore';

interface Props {
  data: AdvisoryArtifact;
}

export const AdvisoryViewer: React.FC<Props> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const { regenerateSingleArtifact, pipelineStage } = useTransformationStore();

  const handleCopy = () => {
    navigator.clipboard.writeText(data.fullMarkdownContent || data.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-rose-950/60 border-rose-600/60 text-rose-300';
      case 'HIGH':
        return 'bg-amber-950/60 border-amber-600/60 text-amber-300';
      case 'MEDIUM':
        return 'bg-yellow-950/60 border-yellow-600/60 text-yellow-300';
      default:
        return 'bg-blue-950/60 border-blue-600/60 text-blue-300';
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'Immediate':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'Within 24h':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
            Format 4 · Formal Security & Operational Alert
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">
            {data.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => regenerateSingleArtifact('advisory')}
            disabled={pipelineStage === 'generating_artifacts'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Regenerate Advisory"
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
                <span>Copy Advisory</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Official Alert Banner with ID and Protocols */}
      <div
        className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md ${getSeverityStyle(
          data.severity
        )}`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/25 border border-rose-500/40 text-rose-200">
                {data.severity}
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {data.advisoryId}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {data.summary}
            </p>
          </div>
        </div>

        <div className="flex sm:flex-col items-start sm:items-end gap-1 shrink-0 font-mono text-[11px]">
          <span className="px-2 py-0.5 rounded bg-slate-900/80 text-amber-300 border border-slate-700 font-bold">
            {data.tlpClassification || 'TLP:AMBER'}
          </span>
          <span className="text-slate-400 text-[10px]">Active Enforcement</span>
        </div>
      </div>

      {/* Target Systems & Stakeholders */}
      {data.targetSystemsOrStakeholders?.length > 0 && (
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5 mb-2">
            <Server className="h-3.5 w-3.5 text-brand-400" />
            Affected Scope & Target Systems
          </span>
          <div className="flex flex-wrap gap-2">
            {data.targetSystemsOrStakeholders.map((sys, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-700/80"
              >
                {sys}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Threat / Issue Synopsis */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          Threat Synopsis & Attack Mechanics
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
          {data.threatOrIssueSynopsis}
        </p>
      </div>

      {/* Mandatory Mitigation Checklist */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-emerald-400" />
          Mandatory Remediation Playbook
        </h3>
        <div className="space-y-2.5">
          {data.mitigationChecklist.map((step, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded bg-brand-500/20 text-brand-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {step.stepNumber || idx + 1}
                </span>
                <div>
                  <p className="text-slate-200 font-medium">{step.action}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Target: {step.affectedComponent}
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border self-start sm:self-center shrink-0 ${getUrgencyBadge(
                  step.urgency
                )}`}
              >
                {step.urgency}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reporting Channel */}
      {data.contactAndReportingChannel && (
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Send className="h-4 w-4 text-brand-400" />
            <span>Incident Reporting & Response Contact:</span>
          </div>
          <span className="font-mono text-slate-200 font-semibold">
            {data.contactAndReportingChannel}
          </span>
        </div>
      )}
    </div>
  );
};

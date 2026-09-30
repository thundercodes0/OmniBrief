import React from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  Sparkles,
  ExternalLink,
  RotateCw,
  ShieldAlert,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { OutputType, VerificationStatus } from '../../types/transformation';

export const VerificationAuditModal: React.FC = () => {
  const {
    isAuditModalOpen,
    auditModalTarget,
    closeAuditModal,
    openAuditModal,
    verificationResults,
    isVerifying,
    verifySingleArtifact,
    regenerateSingleArtifact,
    selectedOutputs,
    setIsBriefModalOpen,
  } = useAppStore();

  if (!isAuditModalOpen || !auditModalTarget) return null;

  const currentResult = verificationResults[auditModalTarget];
  const isCurrentlyVerifying = isVerifying[auditModalTarget];

  const formatNames: Record<OutputType, string> = {
    executive_summary: 'Executive Summary',
    linkedin_post: 'LinkedIn Post',
    x_thread: 'X / Twitter Thread',
    advisory: 'Security Advisory',
    infographic: 'Infographic Design Spec',
    presentation: 'Presentation Deck',
    video_package: 'Video Package',
  };

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'SUPPORTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Supported
          </span>
        );
      case 'PARTIALLY_SUPPORTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Partially Supported
          </span>
        );
      case 'NEEDS_REVIEW':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-50 text-sky-800 border border-sky-200 flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-sky-600" /> Needs Review
          </span>
        );
      case 'UNSUPPORTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1.5">
            <XCircle className="h-3.5 w-3.5 text-rose-600" /> Unsupported Claim
          </span>
        );
      case 'CONTRADICTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5 text-rose-600" /> Contradicted
          </span>
        );
    }
  };

  const hasIssues =
    currentResult &&
    (currentResult.unsupported_count > 0 || currentResult.contradicted_count > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-700">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900 tracking-tight">
                  Factual Verification Audit
                </h3>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Grounding Guardrail
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Audited against canonical Source Brief claims with deterministic scoring
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => verifySingleArtifact(auditModalTarget)}
              disabled={isCurrentlyVerifying}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-xs"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isCurrentlyVerifying ? 'animate-spin text-amber-600' : ''}`} />
              <span>{isCurrentlyVerifying ? 'Auditing...' : 'Re-verify'}</span>
            </button>

            <button
              onClick={closeAuditModal}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Format Selector Tabs */}
        <div className="px-5 py-2.5 border-b border-stone-200 bg-stone-50/40 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {selectedOutputs.map((type) => {
            const isSelected = auditModalTarget === type;
            const res = verificationResults[type];

            return (
              <button
                key={type}
                onClick={() => openAuditModal(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
                }`}
              >
                <span>{formatNames[type]}</span>
                {res && (
                  <span className={`font-mono text-[10px] px-1.5 py-0.2 rounded ${isSelected ? 'bg-amber-700/60 text-white' : 'bg-stone-100 text-stone-700'}`}>
                    {Math.round(res.verification_score * 100)}%
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {isCurrentlyVerifying ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <RotateCw className="h-8 w-8 animate-spin text-amber-600" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-stone-900">
                  Auditing {formatNames[auditModalTarget]}...
                </h4>
                <p className="text-xs text-stone-500 max-w-sm">
                  Checking every assertion against key claims, metrics, and entities in the canonical Source Brief.
                </p>
              </div>
            </div>
          ) : currentResult ? (
            <>
              {/* Score & Metrics Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 col-span-2 sm:col-span-1 flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-stone-500">
                    Verification Score
                  </span>
                  <div className="text-3xl font-black font-mono text-emerald-600 my-1">
                    {Math.round(currentResult.verification_score * 100)}%
                  </div>
                  <div>{getStatusBadge(currentResult.overall_status)}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] text-stone-500 block">Supported</span>
                  <span className="text-2xl font-mono font-bold text-emerald-600">
                    {currentResult.supported_count}
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-1">Weight: 1.0</span>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] text-stone-500 block">Partially Supported</span>
                  <span className="text-2xl font-mono font-bold text-amber-600">
                    {currentResult.partially_supported_count}
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-1">Weight: 0.5</span>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] text-stone-500 block">Needs Review</span>
                  <span className="text-2xl font-mono font-bold text-sky-600">
                    {currentResult.needs_review_count}
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-1">Weight: 0.5</span>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] text-stone-500 block">Unsupported / Conflict</span>
                  <span
                    className={`text-2xl font-mono font-bold ${
                      currentResult.unsupported_count + currentResult.contradicted_count > 0
                        ? 'text-rose-600'
                        : 'text-stone-400'
                    }`}
                  >
                    {currentResult.unsupported_count + currentResult.contradicted_count}
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-1">Weight: 0.0</span>
                </div>
              </div>

              {/* Action Banner if unsupported/conflicting claims exist */}
              {hasIssues && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-rose-600" />
                      Verification Detected Unsupported or Conflicting Claims
                    </h4>
                    <p className="text-[11px] text-rose-700">
                      The generated text includes statements that could not be grounded in the Source Brief.
                    </p>
                  </div>

                  <button
                    onClick={async () => {
                      await regenerateSingleArtifact(auditModalTarget);
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                    <span>Regenerate Artifact</span>
                  </button>
                </div>
              )}

              {/* Verified Claims Citation Strip */}
              {currentResult.verified_claim_ids.length > 0 && (
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-bold text-stone-600 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" /> Verified Source Claims:
                  </span>
                  {currentResult.verified_claim_ids.map((cid) => (
                    <button
                      key={cid}
                      onClick={() => {
                        closeAuditModal();
                        setIsBriefModalOpen(true);
                      }}
                      className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1 transition-colors"
                      title="Inspect claim quote in Source Brief"
                    >
                      <span>{cid}</span>
                      <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                    </button>
                  ))}
                </div>
              )}

              {/* Findings Inspection List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Factual Claim Findings ({currentResult.findings.length})
                  </h4>
                  <span className="text-[11px] text-stone-500">
                    {currentResult.summary}
                  </span>
                </div>

                <div className="space-y-3">
                  {currentResult.findings.map((f, idx) => (
                    <div
                      key={f.finding_id || idx}
                      className="p-4 rounded-xl bg-white border border-stone-200 space-y-3 hover:border-stone-300 transition-colors shadow-xs"
                    >
                      <div className="flex items-center justify-between text-xs gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-500 text-[11px]">
                            {f.finding_id}
                          </span>
                          {f.source_claim_ids && f.source_claim_ids.length > 0 && (
                            <div className="flex items-center gap-1">
                              {f.source_claim_ids.map((cid) => (
                                <span
                                  key={cid}
                                  className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200"
                                >
                                  {cid}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {getStatusBadge(f.status)}
                      </div>

                      {/* Evaluated Claim Snippet */}
                      <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 font-medium">
                        "{f.claim_text}"
                      </div>

                      {/* Explanation & Suggested Action */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-stone-500 block">
                            Auditor Explanation
                          </span>
                          <p className="text-stone-700 leading-relaxed">{f.explanation}</p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-amber-700 block">
                            Suggested Action
                          </span>
                          <p className="text-stone-700 leading-relaxed">{f.suggested_action}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-stone-900">
                  No Audit Telemetry for {formatNames[auditModalTarget]}
                </h4>
                <p className="text-xs text-stone-500 max-w-sm">
                  Run the factual verification engine to audit this artifact against the canonical Source Brief.
                </p>
              </div>
              <button
                onClick={() => verifySingleArtifact(auditModalTarget)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2 shadow-xs transition-colors"
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>Run Verification Now</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  FileText,
  Linkedin,
  Twitter,
  ShieldAlert,
  BarChart3,
  Presentation,
  Video,
  Copy,
  Check,
  RotateCw,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  MoreHorizontal,
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
  Heart,
  Repeat,
  MessageCircle,
  Layers,
  ExternalLink,
  ShieldCheck,
  PlusCircle,
  Mic,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { OutputType, RealSlide, RealVideoScene, RealXPost } from '../types/transformation';
import { PipelineProgress } from '../components/layout/PipelineProgress';

export const ResultsPage: React.FC = () => {
  const {
    artifacts,
    artifactStatuses,
    artifactErrors,
    activeArtifact,
    setActiveArtifact,
    selectedOutputs,
    sourceData,
    sourceBrief,
    configuration,
    setIsBriefModalOpen,
    setActivePage,
    regenerateSingleArtifact,
    verificationResults,
    isVerifying,
    verifySingleArtifact,
    openAuditModal,
  } = useAppStore();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [videoTab, setVideoTab] = useState<'storyboard' | 'script' | 'visuals'>('storyboard');
  const [isRegenerating, setIsRegenerating] = useState(false);

  // If there are no real artifacts and no brief, show a clean empty state
  if (!artifacts && !sourceBrief) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-200">
        <PipelineProgress />
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center space-y-4 shadow-xs max-w-2xl mx-auto my-8">
          <div className="h-14 w-14 mx-auto rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700">
            <FileCheck2 className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-900 tracking-tight">
              No Transformation Results Yet
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              No communication artefacts have been generated yet. Upload source material or enter raw text in the transformation studio to synthesize all 7 formats.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setActivePage('new-transformation')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white inline-flex items-center gap-2 shadow-xs transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Start New Transformation</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Real generated artifacts; no fake fallback
  const rawData = artifacts || ({} as any);

  const tabs: {
    type: OutputType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { type: 'executive_summary', label: 'Executive Summary', icon: FileText },
    { type: 'linkedin_post', label: 'LinkedIn Post', icon: Linkedin },
    { type: 'x_thread', label: 'X Thread', icon: Twitter },
    { type: 'advisory', label: 'Advisory', icon: ShieldAlert },
    { type: 'infographic', label: 'Infographic Spec', icon: BarChart3 },
    { type: 'presentation', label: 'Presentation Deck', icon: Presentation },
    { type: 'video_package', label: 'Video Package', icon: Video },
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRegenerate = async (type: OutputType) => {
    setIsRegenerating(true);
    try {
      await regenerateSingleArtifact(type);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Helper component for Grounded Source Claims
  const ClaimCitations: React.FC<{ claimIds?: string[] }> = ({ claimIds }) => {
    if (!claimIds || claimIds.length === 0) return null;
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1 mr-1">
          <Sparkles className="h-3 w-3 text-amber-600" /> Grounded Claims:
        </span>
        {claimIds.map((cid) => (
          <button
            key={cid}
            onClick={() => setIsBriefModalOpen(true)}
            className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1 transition-colors shadow-xs"
            title="Inspect claim quote in Source Brief"
          >
            <span>{cid}</span>
            <ExternalLink className="h-2.5 w-2.5 opacity-60" />
          </button>
        ))}
      </div>
    );
  };

  // Phase 4: In-place verification badge & action strip
  const VerificationBanner: React.FC<{ type: OutputType }> = ({ type }) => {
    const result = verificationResults[type];
    const isRunning = isVerifying[type];

    if (isRunning) {
      return (
        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs animate-pulse">
          <div className="flex items-center gap-2">
            <RotateCw className="h-4 w-4 text-amber-600 animate-spin" />
            <span className="font-semibold text-stone-900">
              Auditing factual grounding against Source Brief...
            </span>
          </div>
          <span className="text-[11px] text-stone-500 font-mono">CLOSED-LOOP AUDIT</span>
        </div>
      );
    }

    if (!result) {
      return (
        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-stone-500" />
            <span className="text-stone-700">
              Factual Grounding Audit:{' '}
              <span className="text-stone-500 font-medium">Ready to verify against Source Brief</span>
            </span>
          </div>
          <button
            onClick={() => verifySingleArtifact(type)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-xs"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
            <span>Run Verification</span>
          </button>
        </div>
      );
    }

    const hasIssues = result.unsupported_count > 0 || result.contradicted_count > 0;

    return (
      <div className="space-y-2">
        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              {result.overall_status === 'SUPPORTED' && (
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              )}
              {result.overall_status === 'PARTIALLY_SUPPORTED' && (
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              )}
              {result.overall_status === 'NEEDS_REVIEW' && (
                <span className="h-2 w-2 rounded-full bg-sky-500"></span>
              )}
              {(result.overall_status === 'UNSUPPORTED' || result.overall_status === 'CONTRADICTED') && (
                <span className="h-2 w-2 rounded-full bg-rose-500"></span>
              )}
              <span className="font-bold uppercase tracking-wider text-stone-900">
                Grounding: {result.overall_status.replace('_', ' ')}
              </span>
            </div>

            <span className="text-stone-400">|</span>

            <div className="flex items-center gap-1 font-mono">
              <span className="text-stone-500">Score:</span>
              <span className="font-bold text-stone-900">
                {Math.round(result.verification_score * 100)}%
              </span>
            </div>

            <span className="text-stone-400">|</span>

            <div className="flex items-center gap-2 text-[11px] text-stone-600 font-mono">
              <span className="text-emerald-700">{result.supported_count} Supported</span>
              <span>·</span>
              <span className="text-amber-700">{result.partially_supported_count} Partial</span>
              <span>·</span>
              <span className={hasIssues ? 'text-rose-700 font-bold' : 'text-stone-500'}>
                {result.unsupported_count + result.contradicted_count} Issues
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openAuditModal(type)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 flex items-center gap-1 transition-colors shadow-xs"
            >
              <span>View Audit Details</span>
              <ExternalLink className="h-3 w-3" />
            </button>

            <button
              onClick={() => verifySingleArtifact(type)}
              title="Re-run factual verification against current Source Brief"
              className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded transition-colors"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {hasIssues && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>
                Auditor flagged unsupported assertions. Review details in Audit modal or click Regenerate.
              </span>
            </div>
            <button
              onClick={() => openAuditModal(type)}
              className="underline font-bold shrink-0 hover:text-rose-950"
            >
              Inspect Findings
            </button>
          </div>
        )}
      </div>
    );
  };

  const isSelected = selectedOutputs.includes(activeArtifact);
  const currentStatus = artifactStatuses[activeArtifact];
  const currentError = artifactErrors[activeArtifact];

  const execData = rawData.executive_summary;
  const liData = rawData.linkedin_post || rawData.linkedin;
  const xData = rawData.x_thread;
  const advData = rawData.advisory;
  const infoData = rawData.infographic;
  const presData = rawData.presentation;
  const vidData = rawData.video_package || rawData.video;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Visible Pipeline Stepper */}
      <PipelineProgress />

      {/* Top Results Overview Bar */}
      <div className="p-5 rounded-2xl bg-white border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              Synchronized Suite
            </span>
            <span className="text-xs text-stone-500">
              Audience: {configuration.targetAudience} · Tone: {configuration.tone}
            </span>
          </div>
          <h2 className="text-base font-bold text-stone-900 tracking-tight">
            {sourceBrief?.sourceTitle || sourceData.fileName || 'Verified Source Analysis'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBriefModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-2 transition-colors shadow-xs"
          >
            <FileCheck2 className="h-4 w-4 text-amber-600" />
            <span>View Source Brief</span>
            {sourceBrief?.keyClaims && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-200/80 text-[10px] font-mono text-amber-900 font-bold">
                {sourceBrief.keyClaims.length} Claims
              </span>
            )}
          </button>

          <button
            onClick={() => setActivePage('new-transformation')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors shadow-xs"
          >
            Configure Another
          </button>
        </div>
      </div>

      {/* 7 Output Navigation Tabs */}
      <div className="border-b border-stone-200 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeArtifact === tab.type;
            const status = artifactStatuses[tab.type];
            const isIncludedInBatch = selectedOutputs.includes(tab.type);
            const vRes = verificationResults[tab.type];

            return (
              <button
                key={tab.type}
                onClick={() => setActiveArtifact(tab.type)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                  isTabActive
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>

                {status === 'generating' && (
                  <RotateCw className="h-3 w-3 animate-spin text-amber-600" />
                )}
                {status === 'completed' && !vRes && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                )}
                {vRes && (
                  <span
                    className={`font-mono text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      vRes.overall_status === 'SUPPORTED'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : vRes.overall_status === 'PARTIALLY_SUPPORTED' || vRes.overall_status === 'NEEDS_REVIEW'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {Math.round(vRes.verification_score * 100)}%
                  </span>
                )}
                {status === 'failed' && (
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                )}
                {status === 'pending' && isIncludedInBatch && (
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500/60"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Artifact Display Area */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs min-h-[500px]">
        {/* State 1: Currently Generating */}
        {currentStatus === 'generating' && (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-inner">
              <RotateCw className="h-8 w-8 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-900">
                Generating {tabs.find((t) => t.type === activeArtifact)?.label}...
              </h3>
              <p className="text-xs text-stone-500 max-w-sm">
                Gemini is synthesizing this communication format and strictly grounding every statement against the canonical Source Brief.
              </p>
            </div>
          </div>
        )}

        {/* State 2: Failed Generation */}
        {currentStatus === 'failed' && (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <AlertCircle className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-900">
                Generation Encountered an Issue
              </h3>
              <p className="text-xs text-rose-800 max-w-md bg-rose-50 p-3 rounded-xl border border-rose-200">
                {currentError || 'An error occurred during artifact generation. Rate limit or quota may have been reached.'}
              </p>
            </div>
            <button
              onClick={() => handleRegenerate(activeArtifact)}
              disabled={isRegenerating}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-2 shadow-xs transition-colors"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>Retry Generation</span>
            </button>
          </div>
        )}

        {/* State 3: Not Selected During Pipeline */}
        {currentStatus !== 'generating' && currentStatus !== 'failed' && !isSelected && !(artifacts?.[activeArtifact]) && (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400">
              <Layers className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-900">
                {tabs.find((t) => t.type === activeArtifact)?.label} was not selected
              </h3>
              <p className="text-xs text-stone-500 max-w-sm">
                This format was excluded during transformation setup. You can generate it on-demand right now using the canonical Source Brief.
              </p>
            </div>
            <button
              onClick={() => handleRegenerate(activeArtifact)}
              disabled={isRegenerating}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2 shadow-xs transition-colors"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>Generate Format Now</span>
            </button>
          </div>
        )}

        {/* State 4: Completed Artifact Viewer */}
        {currentStatus !== 'generating' && currentStatus !== 'failed' && (isSelected || artifacts?.[activeArtifact]) && (
          <>
            {/* TAB 1: EXECUTIVE SUMMARY */}
            {activeArtifact === 'executive_summary' && execData && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-3 gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                      Format 1 · Leadership Intelligence
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                      {execData.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRegenerate('executive_summary')}
                      disabled={isRegenerating}
                      title="Regenerate Executive Summary"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors shadow-xs"
                    >
                      <RotateCw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin text-amber-600' : ''}`} />
                      <span>Regenerate</span>
                    </button>

                    <button
                      onClick={() =>
                        handleCopy(
                          `# ${execData.title}\n\n## Executive Summary\n${execData.summary || execData.tldr}\n\n## Key Points\n${(execData.key_points || execData.keyTakeaways || []).map((k: string) => `- ${k}`).join('\n')}\n\n## Implications\n${(execData.implications || execData.strategicImplications || []).map((i: string) => `- ${i}`).join('\n')}\n\n## Recommendations\n${(execData.recommendations || execData.actionItems || []).map((r: string) => `- ${r}`).join('\n')}`,
                          'exec'
                        )
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 shadow-xs"
                    >
                      {copiedKey === 'exec' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === 'exec' ? 'Copied' : 'Copy Markdown'}</span>
                    </button>
                  </div>
                </div>

                {/* Grounding Claim Badges */}
                <ClaimCitations claimIds={execData.source_claim_ids} />

                {/* Phase 4: Factual Verification Banner */}
                <VerificationBanner type="executive_summary" />

                {/* TLDR Callout */}
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80">
                  <span className="text-[10px] uppercase font-bold text-amber-900 block mb-1">
                    Executive Summary / TL;DR
                  </span>
                  <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                    {execData.summary || execData.tldr}
                  </p>
                </div>

                {/* Optional Metrics (if present) */}
                {execData.metrics && execData.metrics.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {execData.metrics.map((m: any, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                        <span className="text-[11px] text-stone-500 block">{m.label}</span>
                        <span className="text-xl font-mono font-bold text-emerald-700">{m.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Takeaways & Implications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Key Strategic Findings
                    </h4>
                    <ul className="space-y-2 text-xs text-stone-700">
                      {(execData.key_points || execData.keyTakeaways || []).map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-amber-600" />
                      Operational Implications
                    </h4>
                    <ul className="space-y-2 text-xs text-stone-700">
                      {(execData.implications || execData.strategicImplications || []).map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Items */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
                    Recommended Action Directives
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(execData.recommendations || execData.actionItems || []).map((act: string, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg bg-white border border-stone-200 text-xs text-stone-800 flex items-start gap-2 shadow-xs">
                        <span className="h-5 w-5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          {idx + 1}
                        </span>
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: LINKEDIN POST */}
            {activeArtifact === 'linkedin_post' && liData && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-3 gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
                      Format 2 · Professional Social Channel
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                      LinkedIn Thought Leadership Post
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRegenerate('linkedin_post')}
                      disabled={isRegenerating}
                      title="Regenerate LinkedIn Post"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors shadow-xs"
                    >
                      <RotateCw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin text-blue-600' : ''}`} />
                      <span>Regenerate</span>
                    </button>

                    <button
                      onClick={() => {
                        const bodyText = Array.isArray(liData.body) ? liData.body.join('\n\n') : liData.body;
                        const bullets = liData.bulletPoints?.map((b: string) => `• ${b}`).join('\n') || '';
                        const cta = liData.call_to_action || liData.callToAction || '';
                        const tags = (liData.hashtags || []).join(' ');
                        handleCopy(`${liData.hook}\n\n${bodyText}\n\n${bullets}\n\n${cta}\n\n${tags}`, 'li');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                    >
                      {copiedKey === 'li' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === 'li' ? 'Copied' : 'Copy Post'}</span>
                    </button>
                  </div>
                </div>

                {/* Grounding Claim Badges */}
                <ClaimCitations claimIds={liData.source_claim_ids} />

                {/* Phase 4: Factual Verification Banner */}
                <VerificationBanner type="linkedin_post" />

                {/* Simulated LinkedIn Card */}
                <div className="max-w-xl mx-auto bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                        OB
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-900">OMNIBRIEF</h4>
                        <p className="text-[11px] text-stone-500">Verified Communications · Official Channel</p>
                      </div>
                    </div>
                    <MoreHorizontal className="h-4 w-4 text-stone-400" />
                  </div>

                  <div className="space-y-3 text-xs text-stone-800 leading-relaxed font-sans">
                    <p className="font-semibold text-stone-900 text-sm">{liData.hook}</p>
                    {Array.isArray(liData.body) ? (
                      liData.body.map((p: string, idx: number) => <p key={idx}>{p}</p>)
                    ) : (
                      <p className="whitespace-pre-line">{liData.body}</p>
                    )}

                    {liData.bulletPoints && liData.bulletPoints.length > 0 && (
                      <div className="space-y-1 py-1">
                        {liData.bulletPoints.map((b: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span>•</span>
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="font-medium text-amber-800">
                      {liData.call_to_action || liData.callToAction}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(liData.hashtags || []).map((tag: string, idx: number) => (
                        <span key={idx} className="text-xs text-blue-700 font-medium hover:underline cursor-pointer">
                          {tag.startsWith('#') ? tag : `#${tag}`}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-150 flex items-center justify-between text-xs text-stone-500">
                    <button className="flex items-center gap-1.5 hover:text-stone-900"><ThumbsUp className="h-3.5 w-3.5" /> Like</button>
                    <button className="flex items-center gap-1.5 hover:text-stone-900"><MessageSquare className="h-3.5 w-3.5" /> Comment</button>
                    <button className="flex items-center gap-1.5 hover:text-stone-900"><Repeat2 className="h-3.5 w-3.5" /> Repost</button>
                    <button className="flex items-center gap-1.5 hover:text-stone-900"><Send className="h-3.5 w-3.5" /> Send</button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: X THREAD */}
            {activeArtifact === 'x_thread' && xData && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {(() => {
                  const postList: RealXPost[] = xData.posts && xData.posts.length > 0
                    ? xData.posts
                    : (xData.tweets || []).map((t: any) => ({
                        text: t.text,
                        source_claim_ids: [],
                        index: t.index,
                        charCount: t.charCount,
                        tag: t.tag,
                      }));

                  return (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-3 gap-3">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-sky-700 tracking-wider">
                            Format 3 · Microblogging & Real-Time Broadcast
                          </span>
                          <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                            Twitter / X Thread ({postList.length} Posts)
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRegenerate('x_thread')}
                            disabled={isRegenerating}
                            title="Regenerate X Thread"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors shadow-xs"
                          >
                            <RotateCw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin text-sky-600' : ''}`} />
                            <span>Regenerate</span>
                          </button>

                          <button
                            onClick={() =>
                              handleCopy(
                                postList.map((t) => t.text).join('\n\n---\n\n'),
                                'x'
                              )
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-xs"
                          >
                            {copiedKey === 'x' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                            <span>{copiedKey === 'x' ? 'Copied' : 'Copy Thread'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Phase 4: Factual Verification Banner */}
                      <VerificationBanner type="x_thread" />

                      <div className="max-w-xl mx-auto space-y-3">
                        {postList.map((tweet, idx) => (
                          <div
                            key={idx}
                            className="bg-white border border-stone-200 rounded-2xl p-4 space-y-2 hover:border-stone-300 transition-all shadow-xs"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-stone-900">OMNIBRIEF</span>
                                <span className="text-stone-400">@omnibrief</span>
                                <span className="font-mono text-sky-700 font-bold">
                                  {idx + 1}/{postList.length}
                                </span>
                              </div>
                              {tweet.tag && (
                                <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                                  {tweet.tag}
                                </span>
                              )}
                            </div>

                            <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-sans whitespace-pre-line">
                              {tweet.text}
                            </p>

                            {/* Cited claims for this individual tweet */}
                            {tweet.source_claim_ids && tweet.source_claim_ids.length > 0 && (
                              <div className="pt-1 flex items-center gap-1 flex-wrap">
                                {tweet.source_claim_ids.map((cid) => (
                                  <span
                                    key={cid}
                                    onClick={() => setIsBriefModalOpen(true)}
                                    className="cursor-pointer font-mono text-[9px] px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100"
                                  >
                                    {cid}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-2 border-t border-stone-150 text-[11px] text-stone-400">
                              <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> Reply</span>
                              <span className="flex items-center gap-1"><Repeat className="h-3 w-3" /> Repost</span>
                              <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> Like</span>
                              <span className="font-mono">{tweet.text.length}/280 chars</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* TAB 4: ADVISORY */}
            {activeArtifact === 'advisory' && advData && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-3 gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider">
                      Format 4 · Formal Security & Operational Alert
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                      {advData.title || advData.advisoryId || 'Operational Security Advisory'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRegenerate('advisory')}
                      disabled={isRegenerating}
                      title="Regenerate Advisory"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors shadow-xs"
                    >
                      <RotateCw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin text-rose-600' : ''}`} />
                      <span>Regenerate</span>
                    </button>

                    <button
                      onClick={() =>
                        handleCopy(
                          `# ${advData.title || advData.advisoryId}\n\nSeverity: ${advData.severity?.toUpperCase()}\nAudience: ${advData.audience || advData.targetAudience}\n\n## Situation\n${advData.situation || advData.threatSummary}\n\n## Key Findings\n${(advData.key_findings || [advData.technicalDetails]).filter(Boolean).map((k: string) => `- ${k}`).join('\n')}\n\n## Recommended Actions\n${(advData.recommended_actions || (advData.mitigationSteps ? advData.mitigationSteps.map((m: any) => m.action) : [])).map((a: string) => `- ${a}`).join('\n')}`,
                          'adv'
                        )
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 shadow-xs"
                    >
                      {copiedKey === 'adv' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === 'adv' ? 'Copied' : 'Copy Advisory'}</span>
                    </button>
                  </div>
                </div>

                {/* Grounding Claim Badges */}
                <ClaimCitations claimIds={advData.source_claim_ids} />

                {/* Phase 4: Factual Verification Banner */}
                <VerificationBanner type="advisory" />

                {/* Alert Banner */}
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-rose-100 text-rose-700">
                      <ShieldAlert className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase px-2 py-0.5 rounded bg-rose-600 text-white">
                          {advData.severity?.toUpperCase() || 'HIGH'}
                        </span>
                        <span className="text-xs font-mono font-bold text-stone-900">
                          {advData.advisoryId || 'ADVISORY-REF'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-700 mt-1">
                        {advData.situation || advData.threatSummary}
                      </p>
                    </div>
                  </div>
                  {advData.tlp && (
                    <span className="px-2.5 py-1 rounded bg-white text-stone-800 font-mono text-xs border border-stone-200 self-start sm:self-center font-bold shadow-xs">
                      {advData.tlp}
                    </span>
                  )}
                </div>

                {/* Warnings Callout (if present) */}
                {advData.warnings && advData.warnings.length > 0 && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" /> Critical Warnings & Prerequisites
                    </h4>
                    <ul className="space-y-1.5 text-xs text-stone-800">
                      {advData.warnings.map((w: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0"></span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Target Audience */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-bold text-stone-600">Target Stakeholders:</span>
                  {Array.isArray(advData.targetAudience) ? (
                    advData.targetAudience.map((aud: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded bg-white text-stone-800 border border-stone-200 shadow-xs">
                        {aud}
                      </span>
                    ))
                  ) : (
                    <span className="px-2.5 py-0.5 rounded bg-white text-stone-800 border border-stone-200 shadow-xs">
                      {advData.audience || advData.targetAudience}
                    </span>
                  )}
                </div>

                {/* Key Findings / Technical Details */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Key Incident & Operational Findings
                  </h4>
                  {advData.key_findings ? (
                    <ul className="space-y-2 text-xs text-stone-700">
                      {advData.key_findings.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-stone-700 leading-relaxed font-sans">
                      {advData.technicalDetails}
                    </p>
                  )}
                </div>

                {/* Mitigation / Recommended Actions */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Actionable Remediation Playbook
                  </h4>
                  <div className="space-y-2">
                    {advData.recommended_actions ? (
                      advData.recommended_actions.map((action: string, idx: number) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-white border border-stone-200 flex items-center justify-between gap-3 text-xs shadow-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="h-5 w-5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold flex items-center justify-center shrink-0 text-[10px]">
                              {idx + 1}
                            </span>
                            <span className="text-stone-800">{action}</span>
                          </div>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded border shrink-0 bg-emerald-50 text-emerald-800 border-emerald-200">
                            Required
                          </span>
                        </div>
                      ))
                    ) : advData.mitigationSteps ? (
                      advData.mitigationSteps.map((step: any) => (
                        <div
                          key={step.step}
                          className="p-3 rounded-lg bg-white border border-stone-200 flex items-center justify-between gap-3 text-xs shadow-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="h-5 w-5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold flex items-center justify-center shrink-0 text-[10px]">
                              {step.step}
                            </span>
                            <span className="text-stone-800">{step.action}</span>
                          </div>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border shrink-0 ${
                              step.urgency === 'Immediate'
                                ? 'bg-rose-50 text-rose-800 border-rose-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            {step.urgency}
                          </span>
                        </div>
                      ))
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: INFOGRAPHIC */}
            {activeArtifact === 'infographic' && infoData && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-3 gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wider">
                      Format 5 · Visual Data Canvas Specification
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                      {infoData.title || infoData.headline}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRegenerate('infographic')}
                      disabled={isRegenerating}
                      title="Regenerate Infographic Spec"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors shadow-xs"
                    >
                      <RotateCw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin text-purple-600' : ''}`} />
                      <span>Regenerate</span>
                    </button>

                    <button
                      onClick={() =>
                        handleCopy(JSON.stringify(infoData, null, 2), 'info')
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 shadow-xs"
                    >
                      {copiedKey === 'info' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === 'info' ? 'Copied' : 'Copy Spec JSON'}</span>
                    </button>
                  </div>
                </div>

                {/* Grounding Claim Badges */}
                <ClaimCitations claimIds={infoData.source_claim_ids} />

                {/* Phase 4: Factual Verification Banner */}
                <VerificationBanner type="infographic" />

                {/* Canvas Display */}
                <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-6">
                  {/* Header */}
                  <div className="text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-800 tracking-widest px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200">
                      Infographic Design Specification
                    </span>
                    <h2 className="text-xl font-black text-stone-900">{infoData.title || infoData.headline}</h2>
                    <p className="text-xs text-stone-500">{infoData.subtitle || infoData.subheadline}</p>
                  </div>

                  {/* Hero KPI Cards */}
                  {infoData.key_statistics && infoData.key_statistics.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {infoData.key_statistics.map((stat: any, idx: number) => (
                        <div key={idx} className="p-4 rounded-xl bg-white border border-stone-200 relative overflow-hidden shadow-xs">
                          <span className="text-[10px] font-semibold text-stone-500 uppercase line-clamp-1">{stat.metric}</span>
                          <div className="text-2xl font-black text-stone-900 font-mono my-1">{stat.value}</div>
                          {stat.source_claim_id && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                              {stat.source_claim_id}
                            </span>
                          )}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
                        </div>
                      ))}
                    </div>
                  ) : infoData.kpiStats && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {infoData.kpiStats.map((kpi: any, idx: number) => (
                        <div key={idx} className="p-4 rounded-xl bg-white border border-stone-200 relative overflow-hidden shadow-xs">
                          <span className="text-[10px] font-semibold text-stone-500 uppercase">{kpi.label}</span>
                          <div className="text-2xl font-black text-stone-900 font-mono my-1">{kpi.value}</div>
                          <span className="text-[11px] text-stone-400">{kpi.subtitle}</span>
                          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Structured Infographic Sections */}
                  {infoData.sections && infoData.sections.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {infoData.sections.map((sec: any, idx: number) => (
                        <div key={idx} className="p-4 rounded-xl bg-white border border-stone-200 space-y-2 shadow-xs">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                            {sec.heading}
                          </h4>
                          <ul className="space-y-1.5 text-xs text-stone-700">
                            {sec.key_takeaways.map((point: string, pIdx: number) => (
                              <li key={pIdx} className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0"></span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Visual Layout Elements */}
                  {infoData.visual_elements && infoData.visual_elements.length > 0 && (
                    <div className="p-4 rounded-xl bg-stone-100/50 border border-stone-200 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-2">
                        <Layers className="h-4 w-4 text-amber-600" />
                        Visual Composition Elements
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {infoData.visual_elements.map((elem: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-lg bg-white border border-stone-200 space-y-1 shadow-xs">
                            <span className="text-[10px] font-mono uppercase font-bold text-amber-800 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 inline-block">
                              {elem.element_type}
                            </span>
                            <p className="text-[11px] text-stone-700 leading-relaxed">{elem.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer / Core Takeaway Box */}
                  {(infoData.footer || infoData.coreTakeaway) && (
                    <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                      <span className="text-[10px] uppercase font-bold text-amber-900 block mb-0.5">
                        Design Summary / Takeaway
                      </span>
                      <p className="text-xs text-stone-800 font-medium">
                        {infoData.footer || infoData.coreTakeaway}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 6: PRESENTATION */}
            {activeArtifact === 'presentation' && presData && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {(() => {
                  const slides: RealSlide[] = presData.slides || [];
                  const activeSlide = slides[currentSlideIdx] || slides[0];

                  return (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-3 gap-3">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                            Format 6 · Executive Briefing & Slide Deck
                          </span>
                          <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                            {presData.title || presData.deckTitle}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRegenerate('presentation')}
                            disabled={isRegenerating}
                            title="Regenerate Deck"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors shadow-xs"
                          >
                            <RotateCw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin text-amber-600' : ''}`} />
                            <span>Regenerate</span>
                          </button>

                          <button
                            onClick={() =>
                              handleCopy(
                                slides
                                  .map(
                                    (s, idx) =>
                                      `# Slide ${s.slide_number || s.slideNumber || idx + 1}: ${s.title}\n${(s.bullets || s.bulletPoints || []).map((b) => `- ${b}`).join('\n')}\n\nSpeaker Notes: ${s.speaker_notes || s.speakerNotes || ''}`
                                  )
                                  .join('\n\n---\n\n'),
                                'deck'
                              )
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 shadow-xs"
                          >
                            {copiedKey === 'deck' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                            <span>{copiedKey === 'deck' ? 'Copied' : 'Copy Deck Markdown'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Phase 4: Factual Verification Banner */}
                      <VerificationBanner type="presentation" />

                      {/* Slide Stage */}
                      {slides.length > 0 && activeSlide && (
                        <div className="max-w-2xl mx-auto space-y-4">
                          <div className="aspect-[16/9] w-full bg-white border-2 border-stone-200 rounded-2xl p-8 flex flex-col justify-between shadow-xs relative">
                            <div className="flex items-center justify-between border-b border-stone-150 pb-2">
                              <span className="text-xs text-stone-500 font-semibold truncate max-w-[280px]">
                                {presData.title || presData.deckTitle}
                              </span>
                              <span className="text-xs font-mono font-bold text-stone-500">
                                {currentSlideIdx + 1} / {slides.length}
                              </span>
                            </div>

                            <div className="my-auto space-y-3">
                              <h2 className="text-xl font-black text-stone-900">
                                {activeSlide.title}
                              </h2>
                              <ul className="space-y-2">
                                {(activeSlide.bullets || activeSlide.bulletPoints || []).map((bp, idx) => (
                                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-800">
                                    <span className="h-2 w-2 rounded-full bg-amber-600 mt-1.5 shrink-0"></span>
                                    <span>{bp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Cited claims for this slide */}
                            {activeSlide.source_claim_ids && activeSlide.source_claim_ids.length > 0 && (
                              <div className="flex items-center gap-1.5 flex-wrap pt-2">
                                <span className="text-[10px] font-bold text-stone-500 uppercase">Claims:</span>
                                {activeSlide.source_claim_ids.map((cid) => (
                                  <span
                                    key={cid}
                                    onClick={() => setIsBriefModalOpen(true)}
                                    className="cursor-pointer font-mono text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                                  >
                                    {cid}
                                  </span>
                                ))}
                              </div>
                            )}

                            {activeSlide.visualPrompt && (
                              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-[11px] text-stone-600 truncate">
                                <span className="font-semibold text-purple-700 mr-1.5">Visual Prompt:</span>
                                {activeSlide.visualPrompt}
                              </div>
                            )}
                          </div>

                          {/* Slide Carousel Controls */}
                          <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setCurrentSlideIdx(Math.max(0, currentSlideIdx - 1))}
                                disabled={currentSlideIdx === 0}
                                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 disabled:opacity-40 shadow-xs"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  setCurrentSlideIdx(Math.min(slides.length - 1, currentSlideIdx + 1))
                                }
                                disabled={currentSlideIdx === slides.length - 1}
                                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 disabled:opacity-40 shadow-xs"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {slides.map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setCurrentSlideIdx(idx)}
                                  className={`h-2 rounded-full transition-all ${
                                    idx === currentSlideIdx ? 'w-6 bg-amber-600' : 'w-2 bg-stone-300'
                                  }`}
                                />
                              ))}
                            </div>

                            <span className="text-xs font-mono text-stone-500">
                              Slide {currentSlideIdx + 1} of {slides.length}
                            </span>
                          </div>

                          {/* Speaker Notes */}
                          {(activeSlide.speaker_notes || activeSlide.speakerNotes) && (
                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1 shadow-xs">
                              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-800">
                                <Mic className="h-3.5 w-3.5" />
                                <span>Presenter Speaker Notes</span>
                              </div>
                              <p className="italic">
                                "{activeSlide.speaker_notes || activeSlide.speakerNotes}"
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {/* TAB 7: VIDEO PACKAGE */}
            {activeArtifact === 'video_package' && vidData && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {(() => {
                  const scenes: RealVideoScene[] = vidData.scenes || [];
                  const scriptText = vidData.narration || vidData.fullScript || '';

                  return (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-3 gap-3">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-pink-700 tracking-wider">
                            Format 7 · Production Video Package
                          </span>
                          <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                            {vidData.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRegenerate('video_package')}
                            disabled={isRegenerating}
                            title="Regenerate Video Package"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors shadow-xs"
                          >
                            <RotateCw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin text-pink-600' : ''}`} />
                            <span>Regenerate</span>
                          </button>

                          <button
                            onClick={() => handleCopy(scriptText, 'vid')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-pink-600 hover:bg-pink-700 text-white shadow-xs"
                          >
                            {copiedKey === 'vid' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                            <span>{copiedKey === 'vid' ? 'Copied' : 'Copy Voiceover'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Phase 4: Factual Verification Banner */}
                      <VerificationBanner type="video_package" />

                      {/* Video Sub-Tabs */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setVideoTab('storyboard')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            videoTab === 'storyboard'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-stone-100 text-stone-700 hover:text-stone-900 border border-stone-200'
                          }`}
                        >
                          Storyboard Cards ({scenes.length} Scenes)
                        </button>
                        <button
                          onClick={() => setVideoTab('script')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            videoTab === 'script'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-stone-100 text-stone-700 hover:text-stone-900 border border-stone-200'
                          }`}
                        >
                          Continuous Voiceover Script
                        </button>
                        {vidData.visual_recommendations && vidData.visual_recommendations.length > 0 && (
                          <button
                            onClick={() => setVideoTab('visuals')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              videoTab === 'visuals'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-stone-100 text-stone-700 hover:text-stone-900 border border-stone-200'
                            }`}
                          >
                            Visual Guidelines ({vidData.visual_recommendations.length})
                          </button>
                        )}
                      </div>

                      {videoTab === 'storyboard' && (
                        <div className="space-y-3.5">
                          {scenes.map((scene, idx) => (
                            <div
                              key={scene.scene_number || scene.sceneNumber || idx}
                              className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3 shadow-xs"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-stone-900">
                                  Scene {scene.scene_number || scene.sceneNumber || idx + 1}
                                  {scene.duration_seconds ? ` · ${scene.duration_seconds}s` : scene.timestamp ? ` · ${scene.timestamp}` : ''}
                                </span>
                                {(scene.cameraDirection || scene.on_screen_text) && (
                                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white text-stone-600 border border-stone-200 shadow-xs">
                                    {scene.cameraDirection || `TEXT: ${scene.on_screen_text}`}
                                  </span>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                <div className="p-3 rounded-lg bg-white border border-stone-200 shadow-xs">
                                  <span className="text-[10px] uppercase font-bold text-purple-700 block mb-1">
                                    Visual Scene Composition
                                  </span>
                                  <p className="text-stone-700">
                                    {scene.visual_description || scene.visualDescription}
                                  </p>
                                </div>

                                <div className="p-3 rounded-lg bg-white border border-stone-200 shadow-xs">
                                  <span className="text-[10px] uppercase font-bold text-blue-700 block mb-1">
                                    On-Screen Text & Directive
                                  </span>
                                  <p className="text-stone-700">
                                    {scene.on_screen_text || scene.visualRecommendation || 'Standard framing with brand watermark overlay'}
                                  </p>
                                </div>
                              </div>

                              <div className="p-3 rounded-lg bg-white border border-stone-200 text-xs italic text-stone-800 shadow-xs">
                                <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-0.5 not-italic">
                                  Voiceover Narration
                                </span>
                                "{scene.narration || scene.narrationText}"
                              </div>

                              {/* Cited claims for this scene */}
                              {scene.source_claim_ids && scene.source_claim_ids.length > 0 && (
                                <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[10px] font-bold text-stone-500 uppercase">Claims:</span>
                                  {scene.source_claim_ids.map((cid) => (
                                    <span
                                      key={cid}
                                      onClick={() => setIsBriefModalOpen(true)}
                                      className="cursor-pointer font-mono text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                                    >
                                      {cid}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {videoTab === 'script' && (
                        <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                            Full Voiceover Audio Script
                          </h4>
                          <div className="text-sm text-stone-900 font-serif leading-loose whitespace-pre-line p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
                            {scriptText}
                          </div>
                        </div>
                      )}

                      {videoTab === 'visuals' && vidData.visual_recommendations && (
                        <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                            Production Visual Guidelines
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {vidData.visual_recommendations.map((rec: string, idx: number) => (
                              <div key={idx} className="p-3.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 flex items-start gap-2.5 shadow-xs">
                                <span className="h-5 w-5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold flex items-center justify-center shrink-0 text-[10px]">
                                  {idx + 1}
                                </span>
                                <span>{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

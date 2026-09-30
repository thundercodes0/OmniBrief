import React from 'react';
import {
  FileText,
  Linkedin,
  Twitter,
  ShieldAlert,
  BarChart3,
  Presentation,
  Video,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Download,
  Share2,
} from 'lucide-react';
import { useTransformationStore } from '../../store/useTransformationStore';
import { ArtifactType } from '@shared/types';
import { ExecSummaryViewer } from './ExecSummaryViewer';
import { LinkedInPostViewer } from './LinkedInPostViewer';
import { TwitterThreadViewer } from './TwitterThreadViewer';
import { AdvisoryViewer } from './AdvisoryViewer';
import { InfographicViewer } from './InfographicViewer';
import { PresentationViewer } from './PresentationViewer';
import { VideoPackageViewer } from './VideoPackageViewer';

export const ArtifactStudio: React.FC = () => {
  const {
    artifacts,
    activeArtifactTab,
    setActiveArtifactTab,
    pipelineStage,
    parameters,
    sourceBrief,
    extractSourceBrief,
    generateAllArtifacts,
  } = useTransformationStore();

  const tabConfig: {
    type: ArtifactType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { type: 'executive_summary', label: 'Executive Summary', icon: FileText },
    { type: 'linkedin_post', label: 'LinkedIn Post', icon: Linkedin },
    { type: 'twitter_thread', label: 'Twitter/X Thread', icon: Twitter },
    { type: 'advisory', label: 'Advisory', icon: ShieldAlert },
    { type: 'infographic', label: 'Infographic Spec', icon: BarChart3 },
    { type: 'presentation', label: 'Presentation', icon: Presentation },
    { type: 'video_package', label: 'Video Package', icon: Video },
  ];

  const isGenerating = pipelineStage === 'generating_artifacts';

  // Render the active format viewer
  const renderActiveViewer = () => {
    if (!artifacts) return null;
    const envelope = artifacts[activeArtifactTab];

    if (!envelope || envelope.status === 'failed') {
      return (
        <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
          <AlertCircle className="h-8 w-8 text-rose-400 mx-auto" />
          <h4 className="text-sm font-bold text-white">
            Generation Incomplete for {activeArtifactTab.replace('_', ' ').toUpperCase()}
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {envelope?.error || 'This artifact has not been generated yet or encountered an issue.'}
          </p>
        </div>
      );
    }

    if (envelope.status === 'generating') {
      return (
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
          <Loader2 className="h-8 w-8 text-brand-400 animate-spin mx-auto" />
          <h4 className="text-sm font-bold text-white">
            Generating with Gemini 3.8 Flash...
          </h4>
        </div>
      );
    }

    switch (activeArtifactTab) {
      case 'executive_summary':
        return <ExecSummaryViewer data={envelope.data} />;
      case 'linkedin_post':
        return <LinkedInPostViewer data={envelope.data} />;
      case 'twitter_thread':
        return <TwitterThreadViewer data={envelope.data} />;
      case 'advisory':
        return <AdvisoryViewer data={envelope.data} />;
      case 'infographic':
        return <InfographicViewer data={envelope.data} />;
      case 'presentation':
        return <PresentationViewer data={envelope.data} />;
      case 'video_package':
        return <VideoPackageViewer data={envelope.data} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col h-full">
      {/* 7 Tab Navigation Bar */}
      <div className="border-b border-slate-800 pb-3 mb-5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {tabConfig.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeArtifactTab === tab.type;
            const status = artifacts?.[tab.type]?.status;
            const factScore = artifacts?.[tab.type]?.audit?.factualityScore;

            return (
              <button
                key={tab.type}
                onClick={() => setActiveArtifactTab(tab.type)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>

                {status === 'completed' && (
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                )}
                {isGenerating && !status && (
                  <span className="h-2 w-2 rounded-full bg-brand-400 animate-ping"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="flex-1 overflow-y-auto pr-1">
        {artifacts ? (
          renderActiveViewer()
        ) : (
          /* Empty State: Explains the Core Engine Workflow */
          <div className="h-full min-h-[420px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-brand-600/20 via-purple-500/20 to-indigo-500/20 border border-brand-500/30 text-brand-400 flex items-center justify-center mb-4 shadow-lg shadow-brand-500/10">
              <Sparkles className="h-7 w-7" />
            </div>

            <h3 className="text-base font-bold text-white mb-2 tracking-tight">
              Ready for Multi-Channel Transformation
            </h3>
            <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
              Input raw content on the left pane, configure your communication parameters, and trigger the fan-out engine to synthesize <strong>all 7 grounded communication artefacts</strong> simultaneously.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl w-full text-left mb-6">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-brand-400 block mb-1">
                  1. Canonical Brief
                </span>
                <p className="text-[11px] text-slate-400">
                  Extracts verified claims and metrics table.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-purple-400 block mb-1">
                  2. Parallel Fan-Out
                </span>
                <p className="text-[11px] text-slate-400">
                  Synthesizes 7 channels in sub-8 seconds.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">
                  3. Zero Hallucination
                </span>
                <p className="text-[11px] text-slate-400">
                  Strict closed-loop NLI grounding check.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">
                  4. Multi-Export
                </span>
                <p className="text-[11px] text-slate-400">
                  1-Click Markdown, JSON & Deck copy.
                </p>
              </div>
            </div>

            <button
              onClick={generateAllArtifacts}
              disabled={isGenerating}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white flex items-center gap-2 shadow-lg shadow-brand-500/25 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Transform Now (All 7 Formats)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

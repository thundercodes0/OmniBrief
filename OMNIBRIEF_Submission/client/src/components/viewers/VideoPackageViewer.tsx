import React, { useState } from 'react';
import {
  Copy,
  Check,
  RotateCw,
  Video,
  Clapperboard,
  Film,
  Camera,
  Music,
  FileText,
  Clock,
  Sparkles,
  Subtitles,
  ImageIcon,
} from 'lucide-react';
import { VideoPackageArtifact } from '@shared/types';
import { useTransformationStore } from '../../store/useTransformationStore';

interface Props {
  data: VideoPackageArtifact;
}

export const VideoPackageViewer: React.FC<Props> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'storyboard' | 'script' | 'notes'>('storyboard');
  const [copied, setCopied] = useState(false);
  const { regenerateSingleArtifact, pipelineStage } = useTransformationStore();

  const handleCopyScript = () => {
    navigator.clipboard.writeText(data.fullVoiceoverScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySRT = () => {
    navigator.clipboard.writeText(data.productionNotes?.srtSubtitles || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
            Format 7 · Comprehensive Production Video Package
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">
            {data.videoMetadata?.title || 'Production Video Package'}
          </h2>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
            <span>⏱️ {data.videoMetadata?.targetDurationSeconds || 60}s Target</span>
            <span>·</span>
            <span>📐 Aspect: {data.videoMetadata?.recommendedAspectRatio || '16:9'}</span>
            <span>·</span>
            <span>🎭 Tone: {data.videoMetadata?.tone}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => regenerateSingleArtifact('video_package')}
            disabled={pipelineStage === 'generating_artifacts'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Regenerate Video Package"
          >
            <RotateCw className="h-4 w-4" />
          </button>
          <button
            onClick={handleCopyScript}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md shadow-rose-600/25"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied Script</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Voiceover Script</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub-Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
        <button
          onClick={() => setActiveTab('storyboard')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'storyboard'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clapperboard className="h-3.5 w-3.5" />
          <span>Storyboard Timeline ({data.scenes?.length || 0} Scenes)</span>
        </button>

        <button
          onClick={() => setActiveTab('script')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'script'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Continuous Voiceover Script</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'notes'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Film className="h-3.5 w-3.5" />
          <span>SRT Subtitles & Production Notes</span>
        </button>
      </div>

      {/* Tab 1: Storyboard Scene Cards */}
      {activeTab === 'storyboard' && (
        <div className="space-y-4">
          {data.scenes?.map((scene, idx) => (
            <div
              key={idx}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-md space-y-4 hover:border-slate-700 transition-all"
            >
              {/* Scene Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="h-7 w-7 rounded-lg bg-rose-500/20 text-rose-300 font-bold text-xs flex items-center justify-center border border-rose-500/30">
                    {scene.sceneNumber || idx + 1}
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-tight">
                      Scene {scene.sceneNumber || idx + 1} · {scene.timestamp}
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      Duration: {scene.durationSeconds} seconds
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {scene.cameraDirection}
                  </span>
                </div>
              </div>

              {/* Visual Action & Visual Recommendation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Visual Description */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-[11px] uppercase font-bold text-purple-400 tracking-wider flex items-center gap-1.5 mb-1">
                    <Camera className="h-3.5 w-3.5" />
                    Cinematic Action
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {scene.visualDescription}
                  </p>
                </div>

                {/* Visual Recommendation & Style */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-[11px] uppercase font-bold text-blue-400 tracking-wider flex items-center gap-1.5 mb-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    Visual Style & Assets
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {scene.visualRecommendation}
                  </p>
                </div>
              </div>

              {/* Spoken Narration Text */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] uppercase font-bold text-emerald-400 tracking-wider block mb-1">
                  Spoken Narration (Voiceover)
                </span>
                <p className="text-xs text-slate-100 font-medium leading-relaxed italic">
                  "{scene.narrationText}"
                </p>
              </div>

              {/* Subtitles & On-Screen Overlay Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5 mb-1">
                    <Subtitles className="h-3 w-3 text-amber-400" />
                    Synced Subtitle
                  </span>
                  <p className="text-slate-300 font-mono text-[11px]">
                    {scene.subtitles}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5 mb-1">
                    <Music className="h-3 w-3 text-rose-400" />
                    Audio & SFX
                  </span>
                  <p className="text-slate-300 text-[11px]">
                    {scene.soundFxAndMusic}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Full Continuous Voiceover Script */}
      {activeTab === 'script' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand-400" />
              Complete Voiceover Narration Script
            </h3>
            <span className="text-xs font-mono text-slate-500">
              ~{data.fullVoiceoverScript.split(/\s+/).length} Words (Estimated {data.videoMetadata?.targetDurationSeconds || 60}s)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 leading-loose font-serif whitespace-pre-line">
            {data.fullVoiceoverScript}
          </div>
        </div>
      )}

      {/* Tab 3: SRT Subtitles & Production Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          {/* Thumbnail Concept */}
          {data.productionNotes?.thumbnailConcept && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-brand-500/20 text-brand-300 shrink-0">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-300 block mb-0.5">
                  High-CTR Thumbnail Concept
                </span>
                <p className="text-xs sm:text-sm text-slate-200 font-medium">
                  {data.productionNotes.thumbnailConcept}
                </p>
              </div>
            </div>
          )}

          {/* SRT Subtitle Box */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Subtitles className="h-4 w-4 text-amber-400" />
                Production SRT Subtitle Track
              </span>
              <button
                onClick={handleCopySRT}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300"
              >
                Copy SRT
              </button>
            </div>
            <pre className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap max-h-60">
              {data.productionNotes?.srtSubtitles || 'No SRT subtitle track available.'}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

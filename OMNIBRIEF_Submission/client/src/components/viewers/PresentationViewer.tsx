import React, { useState } from 'react';
import {
  Copy,
  Check,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Mic,
  Image as ImageIcon,
  Sparkles,
  Maximize2,
} from 'lucide-react';
import { PresentationArtifact } from '@shared/types';
import { useTransformationStore } from '../../store/useTransformationStore';

interface Props {
  data: PresentationArtifact;
}

export const PresentationViewer: React.FC<Props> = ({ data }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(true);
  const [copied, setCopied] = useState(false);
  const { regenerateSingleArtifact, pipelineStage } = useTransformationStore();

  const totalSlides = data.slides?.length || 0;
  const currentSlide = data.slides[currentSlideIndex];

  const handleNext = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleCopyDeck = () => {
    const markdown = data.slides
      .map(
        (s) =>
          `# Slide ${s.slideNumber}: ${s.title}\n*${s.subtitle || ''}*\n\n${s.bulletPoints
            .map((b) => `- ${b}`)
            .join('\n')}\n\n**Visual:** ${s.visualDiagramPrompt}\n\n**Speaker Notes:** ${s.speakerNotes}`
      )
      .join('\n\n---\n\n');

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!currentSlide) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
            Format 6 · Executive Briefing & Slide Deck
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">
            {data.deckTitle}
          </h2>
          <p className="text-xs text-slate-400">
            {data.subtitle} · {data.targetDurationMinutes || 10} Min Presentation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
              showSpeakerNotes
                ? 'bg-amber-950/40 border-amber-800/40 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Mic className="h-3.5 w-3.5" />
            <span>Speaker Notes</span>
          </button>

          <button
            onClick={() => regenerateSingleArtifact('presentation')}
            disabled={pipelineStage === 'generating_artifacts'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Regenerate Presentation"
          >
            <RotateCw className="h-4 w-4" />
          </button>

          <button
            onClick={handleCopyDeck}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shadow-sm"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied Deck</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-400" />
                <span>Copy Deck</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Slide Presentation Stage */}
      <div className="max-w-3xl mx-auto space-y-4">
        {/* The Slide Canvas */}
        <div className="aspect-[16/9] w-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-slate-800 rounded-2xl p-8 sm:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          {/* Top Slide Meta */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                {currentSlide.slideType?.toUpperCase() || 'CONTENT'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {data.deckTitle}
              </span>
            </div>

            <span className="text-xs font-mono font-bold text-slate-400">
              {currentSlideIndex + 1} / {totalSlides}
            </span>
          </div>

          {/* Slide Center: Title and Bullet Content */}
          <div className="my-auto py-4 space-y-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {currentSlide.title}
              </h1>
              {currentSlide.subtitle && (
                <p className="text-xs sm:text-sm text-brand-300 font-medium mt-1">
                  {currentSlide.subtitle}
                </p>
              )}
            </div>

            <ul className="space-y-3 pt-2">
              {currentSlide.bulletPoints.map((point, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-xs sm:text-sm text-slate-200 leading-relaxed"
                >
                  <span className="h-2 w-2 rounded-full bg-brand-500 mt-1.5 shrink-0 shadow-sm shadow-brand-500"></span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Slide Visual Graphic Cue */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center gap-2.5 text-xs text-slate-400">
            <ImageIcon className="h-4 w-4 text-purple-400 shrink-0" />
            <div className="truncate">
              <span className="font-semibold text-purple-300 mr-1.5">
                Visual Composition:
              </span>
              <span className="text-slate-300 text-[11px]">
                {currentSlide.visualDiagramPrompt}
              </span>
            </div>
          </div>
        </div>

        {/* Slide Carousel Controls */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors shadow-sm"
              title="Previous Slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={handleNext}
              disabled={currentSlideIndex === totalSlides - 1}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors shadow-sm"
              title="Next Slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Slide Dots */}
          <div className="flex items-center gap-1.5">
            {data.slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlideIndex
                    ? 'w-6 bg-brand-500'
                    : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Jump to slide ${idx + 1}`}
              />
            ))}
          </div>

          <span className="text-xs font-mono text-slate-400">
            Slide {currentSlideIndex + 1} of {totalSlides}
          </span>
        </div>

        {/* Expandable Speaker Notes Drawer */}
        {showSpeakerNotes && currentSlide.speakerNotes && (
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-1.5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
              <Mic className="h-3.5 w-3.5" />
              <span>Presenter Speaker Notes (Scripted Delivery)</span>
            </div>
            <p className="text-xs text-amber-100/90 leading-relaxed font-sans whitespace-pre-line italic">
              "{currentSlide.speakerNotes}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import {
  SlidersHorizontal,
  Users,
  Volume2,
  Globe,
  Gauge,
  Target,
  Sparkles,
  Layers,
  ArrowRight,
  FileCheck2,
  CheckSquare,
  Square,
} from 'lucide-react';
import { useTransformationStore } from '../../store/useTransformationStore';
import { ArtifactType } from '@shared/types';

export const ParameterControls: React.FC = () => {
  const {
    parameters,
    setParameter,
    toggleArtifactSelection,
    selectAllArtifacts,
    extractSourceBrief,
    generateAllArtifacts,
    pipelineStage,
    sourceBrief,
  } = useTransformationStore();

  const artifactLabels: Record<ArtifactType, { label: string; icon: string }> = {
    executive_summary: { label: 'Executive Summary', icon: '📋' },
    linkedin_post: { label: 'LinkedIn Post', icon: '💼' },
    twitter_thread: { label: 'Twitter/X Thread', icon: '🧵' },
    advisory: { label: 'Security Advisory', icon: '🚨' },
    infographic: { label: 'Infographic Spec', icon: '📊' },
    presentation: { label: 'Slide Deck Deck', icon: '🖥️' },
    video_package: { label: 'Video Package', icon: '🎬' },
  };

  const isExtracting = pipelineStage === 'extracting_brief';
  const isGenerating = pipelineStage === 'generating_artifacts';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-brand-400" />
          <h3 className="text-sm font-bold text-slate-100 tracking-tight">
            Transformation Parameters
          </h3>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">
          User-Controlled Engine
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Target Audience */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-blue-400" />
            Target Audience
          </label>
          <select
            value={parameters.targetAudience}
            onChange={(e) => setParameter('targetAudience', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            <option value="CISOs & Enterprise IT Teams">CISOs & Enterprise IT Teams</option>
            <option value="Executive Leadership / C-Suite">Executive Leadership / C-Suite</option>
            <option value="Technical Engineers & Developers">Technical Engineers & Developers</option>
            <option value="Healthcare & Clinical Leadership">Healthcare & Clinical Leadership</option>
            <option value="Investors & Board of Directors">Investors & Board of Directors</option>
            <option value="General Public & Media">General Public & Media</option>
          </select>
        </div>

        {/* Tone */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Volume2 className="h-3.5 w-3.5 text-amber-400" />
            Tone
          </label>
          <select
            value={parameters.tone}
            onChange={(e) => setParameter('tone', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            <option value="Urgent & Authoritative">Urgent & Authoritative</option>
            <option value="Formal & Professional">Formal & Professional</option>
            <option value="Scientific & Analytical">Scientific & Analytical</option>
            <option value="Persuasive & Engaging">Persuasive & Engaging</option>
            <option value="Accessible & Educational">Accessible & Educational</option>
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-emerald-400" />
            Language
          </label>
          <select
            value={parameters.language}
            onChange={(e) => setParameter('language', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi (हिंदी)</option>
            <option value="Spanish">Spanish (Español)</option>
            <option value="French">French (Français)</option>
            <option value="German">German (Deutsch)</option>
            <option value="Japanese">Japanese (日本語)</option>
          </select>
        </div>

        {/* Level of Detail */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5 text-purple-400" />
            Level of Detail
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-700/80">
            {(['concise', 'standard', 'comprehensive'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setParameter('detailLevel', level)}
                className={`py-1 text-[11px] font-semibold capitalize rounded-lg transition-all ${
                  parameters.detailLevel === level
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Communication Objective */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-rose-400" />
            Communication Objective
          </label>
          <select
            value={parameters.objective}
            onChange={(e) => setParameter('objective', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            <option value="Warn & Advise">Warn & Advise</option>
            <option value="Inform & Educate">Inform & Educate</option>
            <option value="Report Findings">Report Findings</option>
            <option value="Executive Briefing">Executive Briefing</option>
            <option value="Drive Direct Action">Drive Direct Action</option>
          </select>
        </div>

        {/* Content Style */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            Content Style
          </label>
          <select
            value={parameters.contentStyle}
            onChange={(e) => setParameter('contentStyle', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            <option value="Actionable & Threat-Focused">Actionable & Threat-Focused</option>
            <option value="Data-Driven & Analytical">Data-Driven & Analytical</option>
            <option value="Narrative & Storytelling">Narrative & Storytelling</option>
            <option value="Punchy & Direct">Punchy & Direct</option>
            <option value="Regulatory & Compliance Standard">Regulatory & Compliance Standard</option>
          </select>
        </div>
      </div>

      {/* Artefact Selection Chips */}
      <div className="pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-brand-400" />
            Target Communication Channels ({parameters.selectedArtifacts.length}/7 selected)
          </label>
          <button
            type="button"
            onClick={selectAllArtifacts}
            className="text-[11px] font-medium text-brand-400 hover:text-brand-300 transition-colors"
          >
            Select All 7
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {(Object.keys(artifactLabels) as ArtifactType[]).map((type) => {
            const isSelected = parameters.selectedArtifacts.includes(type);
            const info = artifactLabels[type];
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleArtifactSelection(type)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-brand-500/15 border-brand-500/40 text-brand-200 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                <span>{info.icon}</span>
                <span className="truncate">{info.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Execution Buttons */}
      <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={extractSourceBrief}
          disabled={isExtracting || isGenerating}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-sm"
        >
          <FileCheck2 className="h-4 w-4 text-brand-400" />
          <span>
            {isExtracting
              ? 'Analyzing Brief...'
              : sourceBrief
              ? 'Re-extract Source Brief'
              : '1. Extract Source Brief'}
          </span>
        </button>

        <button
          type="button"
          onClick={generateAllArtifacts}
          disabled={isExtracting || isGenerating}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-500/25 disabled:opacity-50"
        >
          <span>
            {isGenerating
              ? 'Generating 7 Artefacts...'
              : '2. Transform & Fan-Out'}
          </span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

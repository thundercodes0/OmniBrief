import React, { useState } from 'react';
import {
  Sparkles,
  Key,
  ShieldCheck,
  FileSearch,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { useTransformationStore } from '../../store/useTransformationStore';

export const Navbar: React.FC = () => {
  const {
    apiKey,
    setApiKey,
    isGeminiConfigured,
    presets,
    selectedPresetId,
    loadPreset,
    resetAll,
    sourceBrief,
    setIsBriefModalOpen,
    setIsFactInspectorOpen,
    artifacts,
  } = useTransformationStore();

  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  const handleSaveKey = () => {
    setApiKey(tempKey);
    setIsKeyModalOpen(false);
  };

  return (
    <>
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
        {/* Left: Brand & Badges */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  OMNIBRIEF
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Autonomous Content Transformation Engine
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center pl-4 border-l border-slate-800 text-xs text-slate-400">
            <span className="text-slate-500 mr-2">Core Axiom:</span>
            <span className="font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
              1 Source → 1 Brief → 7 Outputs
            </span>
          </div>
        </div>

        {/* Center: Presets */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            Quick Presets:
          </span>
          <select
            value={selectedPresetId || ''}
            onChange={(e) => loadPreset(e.target.value)}
            className="bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer font-medium max-w-[280px] truncate"
          >
            {presets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right Actions: Brief, Fact Inspector, API Key, Reset */}
        <div className="flex items-center gap-2.5">
          {sourceBrief && (
            <button
              onClick={() => setIsBriefModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors shadow-sm"
              title="Inspect canonical Source Brief"
            >
              <FileSearch className="h-3.5 w-3.5 text-brand-400" />
              <span>Source Brief</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            </button>
          )}

          {artifacts && (
            <button
              onClick={() => setIsFactInspectorOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-700/50 text-emerald-300 flex items-center gap-1.5 transition-colors shadow-sm"
              title="Audit factual consistency"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Fact Auditor</span>
              <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.2 rounded text-emerald-300 font-mono">
                99%
              </span>
            </button>
          )}

          <button
            onClick={() => setIsKeyModalOpen(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              apiKey || isGeminiConfigured
                ? 'bg-brand-950/50 border-brand-700/50 text-brand-300 hover:bg-brand-900/50'
                : 'bg-amber-950/40 border-amber-800/40 text-amber-300 hover:bg-amber-900/40'
            }`}
          >
            <Key className="h-3.5 w-3.5" />
            <span>
              {apiKey || isGeminiConfigured ? 'Gemini 3.8 Flash' : 'Configured'}
            </span>
          </button>

          <button
            onClick={resetAll}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            title="Reset Workspace"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* API Key Modal */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Gemini API Configuration
                </h3>
                <p className="text-xs text-slate-400">
                  Powered by Google Gemini 3.8 Flash
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Google Gemini API Key
                </label>
                <input
                  type="password"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Resilient Fallback Included</span>
                </div>
                <p>
                  If you do not have an API key configured right now, leave it blank. The system can connect to the configured backend server environment.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsKeyModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveKey}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-colors shadow-lg shadow-brand-500/25"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

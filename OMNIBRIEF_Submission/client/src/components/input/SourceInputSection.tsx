import React, { useState, useRef } from 'react';
import {
  FileText,
  UploadCloud,
  FileCheck,
  X,
  File,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';
import { useTransformationStore } from '../../store/useTransformationStore';

export const SourceInputSection: React.FC = () => {
  const {
    sourceText,
    setSourceText,
    contextPrompt,
    setContextPrompt,
    selectedFile,
    setSelectedFile,
    pipelineStage,
  } = useTransformationStore();

  const [activeTab, setActiveTab] = useState<'text' | 'file' | 'context'>('text');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = sourceText.trim() ? sourceText.trim().split(/\s+/).length : 0;
  const charCount = sourceText.length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // If text file, also preview contents
      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setSourceText(event.target.result as string);
          }
        };
        reader.readAsText(file);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'text'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Source Text</span>
          </button>

          <button
            onClick={() => setActiveTab('file')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'file'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UploadCloud className="h-3.5 w-3.5" />
            <span>Document / PDF</span>
            {selectedFile && (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('context')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'context'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="h-3.5 w-3.5" />
            <span>Context Notes</span>
            {contextPrompt.trim() && (
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
            )}
          </button>
        </div>

        <div className="text-[11px] text-slate-500 font-mono">
          {activeTab === 'text' && `${wordCount} words · ${charCount} chars`}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 flex flex-col min-h-[260px]">
        {activeTab === 'text' && (
          <div className="flex-1 flex flex-col relative">
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Paste raw content here: research paper findings, incident report, news article, threat advisory, or free-form notes..."
              disabled={pipelineStage === 'extracting_brief' || pipelineStage === 'generating_artifacts'}
              className="w-full flex-1 min-h-[240px] bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-xs leading-relaxed text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none font-mono selection:bg-brand-500/30"
            />
          </div>
        )}

        {activeTab === 'file' && (
          <div className="flex-1 flex flex-col justify-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.md,.json"
              className="hidden"
            />

            {selectedFile ? (
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    <File className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · {selectedFile.type || 'Document'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedFile(null)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
                  title="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700/80 hover:border-brand-500/60 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-slate-950/40 group"
              >
                <div className="p-3.5 rounded-2xl bg-slate-800 text-slate-400 group-hover:text-brand-400 group-hover:bg-brand-500/10 transition-colors mb-3">
                  <UploadCloud className="h-7 w-7" />
                </div>
                <h4 className="text-sm font-semibold text-slate-200 mb-1">
                  Upload Document, PDF, or Image
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mb-3">
                  Supports native multimodal parsing for PDF reports, telemetry diagrams, threat bulletins, and scan images.
                </p>
                <span className="text-[11px] font-semibold text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
                  Browse Files
                </span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'context' && (
          <div className="flex-1 flex flex-col">
            <label className="text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Additional Contextual Guidance or Custom Instructions
            </label>
            <textarea
              value={contextPrompt}
              onChange={(e) => setContextPrompt(e.target.value)}
              placeholder="e.g. 'Emphasize that this vulnerability has no available vendor patch yet. Focus heavily on healthcare operational impacts and CISO action items.'"
              className="w-full flex-1 min-h-[220px] bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-xs leading-relaxed text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none font-sans"
            />
          </div>
        )}
      </div>
    </div>
  );
};

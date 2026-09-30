import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileText,
  File,
  X,
  Sparkles,
  Users,
  Volume2,
  Globe,
  Gauge,
  Target,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Table,
  Eye,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { OutputType } from '../types/transformation';

export const NewTransformationPage: React.FC = () => {
  const {
    sourceData,
    normalizedSource,
    setSourceData,
    configuration,
    setConfiguration,
    selectedOutputs,
    toggleOutputType,
    selectAllOutputs,
    clearAllOutputs,
    startTransformation,
    isProcessing,
    errors,
  } = useAppStore();

  const [activeInputTab, setActiveInputTab] = useState<'upload' | 'text'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const outputCards: {
    type: OutputType;
    title: string;
    description: string;
    icon: string;
  }[] = [
    {
      type: 'executive_summary',
      title: 'Executive Summary',
      description: 'Strategic briefing with TL;DR, high-impact KPI metrics, and leadership action items.',
      icon: '📋',
    },
    {
      type: 'linkedin_post',
      title: 'LinkedIn Post',
      description: 'Professional thought-leadership post with scannable bullet points, CTA, and hashtags.',
      icon: '💼',
    },
    {
      type: 'x_thread',
      title: 'X Post / Thread',
      description: 'Bite-sized viral microblogging thread with 280-char limits and atomic numbered tweets.',
      icon: '🧵',
    },
    {
      type: 'advisory',
      title: 'Advisory',
      description: 'Official alert with severity badge, TLP classification, and numbered mitigation checklist.',
      icon: '🚨',
    },
    {
      type: 'infographic',
      title: 'Infographic Spec',
      description: 'Visual layout canvas with 4 Hero KPI stat cards, process flow nodes, and core takeaway.',
      icon: '📊',
    },
    {
      type: 'presentation',
      title: 'Presentation',
      description: 'Structured 16:9 slide deck with concise bullet points, visual prompts, and speaker notes.',
      icon: '🖥️',
    },
    {
      type: 'video_package',
      title: 'Video Package',
      description: 'Production package with scene storyboards, narration script, camera directions, and subtitles.',
      icon: '🎬',
    },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSourceData({
        file,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || 'document',
      });

      // If text file, preview into raw text
      if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setSourceData({ rawText: event.target.result as string });
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
      setSourceData({
        file,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || 'document',
      });
    }
  };

  const removeFile = () => {
    setSourceData({
      file: null,
      fileName: null,
      fileSize: null,
      fileType: null,
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isAllSelected = selectedOutputs.length === outputCards.length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Error Banner */}
      {errors && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            <span>{errors}</span>
          </div>
        </div>
      )}

      {/* SECTION 1: SOURCE INPUT */}
      <section className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="border-b border-stone-150 pb-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
              Step 1 of 3
            </span>
            <h3 className="text-base font-bold text-stone-900 tracking-tight">
              Source Input Material
            </h3>
            <p className="text-xs text-stone-500">
              Provide the raw source data (document or text) to establish the canonical ground truth
            </p>
          </div>
        </div>

        {/* Multimodal Capability Highlights */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
            Engine Capabilities:
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-medium bg-stone-50 text-stone-700 border border-stone-200">
            <FileText className="h-3 w-3 text-cyan-600" /> PDF Page-Aware
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-medium bg-stone-50 text-stone-700 border border-stone-200">
            <Table className="h-3 w-3 text-emerald-600" /> Table Extraction
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-medium bg-stone-50 text-stone-700 border border-stone-200">
            <Eye className="h-3 w-3 text-indigo-600" /> Multimodal Vision OCR
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-medium bg-stone-50 text-stone-700 border border-stone-200">
            <Layers className="h-3 w-3 text-amber-600" /> Scanned Doc Fallback
          </span>
        </div>

        {/* Input Method Selector Tabs */}
        <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl border border-stone-200 w-fit">
          <button
            onClick={() => setActiveInputTab('upload')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeInputTab === 'upload'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <UploadCloud className="h-3.5 w-3.5" />
            <span>Document / File Upload</span>
          </button>
          <button
            onClick={() => setActiveInputTab('text')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeInputTab === 'text'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Raw Text Input</span>
          </button>
        </div>

        {/* Upload Dropzone Tab */}
        {activeInputTab === 'upload' && (
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
              className="hidden"
            />

            {/* File Preview Area if file is present */}
            {sourceData.fileName ? (
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-700">
                    <File className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900">
                      {sourceData.fileName}
                    </h4>
                    <p className="text-xs text-stone-500">
                      {sourceData.fileSize
                        ? `${(sourceData.fileSize / (1024 * 1024)).toFixed(2)} MB`
                        : 'Uploaded Document'}
                      {' · '}
                      <span className="uppercase text-amber-800 font-mono text-[10px]">
                        {sourceData.fileType || 'Document'}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={removeFile}
                  className="p-2 text-stone-400 hover:text-rose-600 hover:bg-stone-100 rounded-lg transition-colors"
                  title="Remove selected file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              /* Drag & Drop Area */
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-300 hover:border-amber-400 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-amber-50/20 bg-stone-50/50 group"
              >
                <div className="p-3 rounded-2xl bg-stone-100 text-stone-500 group-hover:text-amber-700 group-hover:bg-amber-50 transition-colors mb-3">
                  <UploadCloud className="h-8 w-8" />
                </div>
                <h4 className="text-sm font-bold text-stone-900 mb-1">
                  Drag and drop your source file here
                </h4>
                <p className="text-xs text-stone-500 max-w-sm mb-3">
                  Supported formats: <strong>PDF, DOCX, TXT, PNG, JPG</strong>
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 transition-colors shadow-xs"
                >
                  Select File from Computer
                </button>
              </div>
            )}
          </div>
        )}

        {/* Raw Text Tab */}
        {activeInputTab === 'text' && (
          <div className="space-y-2">
            <textarea
              value={sourceData.rawText}
              onChange={(e) => setSourceData({ rawText: e.target.value })}
              placeholder="Paste raw text, news article, research findings, advisory notes, or incident writeup..."
              rows={8}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs font-mono leading-relaxed text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 resize-y"
            />
            <div className="flex justify-end text-[11px] text-stone-500 font-mono">
              {sourceData.rawText.length} characters ·{' '}
              {sourceData.rawText.trim() ? sourceData.rawText.trim().split(/\s+/).length : 0} words
            </div>
          </div>
        )}

        {/* Context / Additional Instructions Field */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            Context & Additional Instructions (Optional)
          </label>
          <input
            type="text"
            value={sourceData.contextInstructions}
            onChange={(e) => setSourceData({ contextInstructions: e.target.value })}
            placeholder="e.g. 'Highlight the healthcare sector impact. Focus on the 72-hour patch window for executive leadership.'"
            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 shadow-xs"
          />
        </div>

        {/* Phase 5: Multimodal Extraction Intelligence Card */}
        {normalizedSource && (
          <div className="p-4 rounded-xl bg-stone-50 border border-indigo-200 shadow-xs space-y-3 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                  <Eye className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-stone-900">
                      Multimodal Extraction Intelligence
                    </h5>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        normalizedSource.extraction_method === 'native_text'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : normalizedSource.extraction_method === 'multimodal_ocr'
                          ? 'bg-amber-50 border-amber-200 text-amber-800'
                          : 'bg-amber-100 border-amber-300 text-amber-900'
                      }`}
                    >
                      {normalizedSource.extraction_method === 'native_text'
                        ? 'Native Text Extraction'
                        : normalizedSource.extraction_method === 'multimodal_ocr'
                        ? 'Multimodal Vision OCR'
                        : 'Hybrid Text + Vision OCR'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Source normalized into canonical ground truth with {Math.round((normalizedSource.confidence_score || 1) * 100)}% confidence
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs">
                <div className="text-center">
                  <span className="text-[9px] uppercase font-bold text-stone-400 block">Pages</span>
                  <span className="font-mono font-bold text-stone-800">{normalizedSource.page_count || 1}</span>
                </div>
                <div className="h-6 w-px bg-stone-200" />
                <div className="text-center">
                  <span className="text-[9px] uppercase font-bold text-stone-400 block">Tables</span>
                  <span className="font-mono font-bold text-emerald-600">{normalizedSource.tables.length}</span>
                </div>
                <div className="h-6 w-px bg-stone-200" />
                <div className="text-center">
                  <span className="text-[9px] uppercase font-bold text-stone-400 block">Visual Elements</span>
                  <span className="font-mono font-bold text-indigo-600">{normalizedSource.visual_content.length}</span>
                </div>
              </div>
            </div>

            {normalizedSource.tables.length > 0 && (
              <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center gap-2 text-[11px] text-stone-700">
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <Table className="h-3 w-3" /> Extracted Tables:
                </span>
                {normalizedSource.tables.map((tbl, i) => (
                  <span key={tbl.id || i} className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-[10px] font-mono text-emerald-700 shadow-xs">
                    {tbl.caption || tbl.id} ({tbl.headers.length} cols, {tbl.rows.length} rows)
                  </span>
                ))}
              </div>
            )}

            {normalizedSource.visual_content.length > 0 && (
              <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center gap-2 text-[11px] text-stone-700">
                <span className="font-semibold text-indigo-700 flex items-center gap-1">
                  <Eye className="h-3 w-3" /> Visual Elements:
                </span>
                {normalizedSource.visual_content.map((vis, i) => (
                  <span key={vis.id || i} className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-[10px] font-mono text-indigo-700 shadow-xs">
                    {vis.type}: {vis.description.substring(0, 35)}...
                  </span>
                ))}
              </div>
            )}

            {normalizedSource.extraction_warnings.length > 0 && (
              <div className="pt-2 border-t border-stone-200 space-y-1">
                {normalizedSource.extraction_warnings.map((w, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[11px] text-amber-800">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* SECTION 2: CONFIGURATION PARAMETERS */}
      <section className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="border-b border-stone-150 pb-3">
          <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider">
            Step 2 of 3
          </span>
          <h3 className="text-base font-bold text-stone-900 tracking-tight">
            User-Controlled Parameters
          </h3>
          <p className="text-xs text-stone-500">
            Tailor the tone, audience, language, and depth for all synthesized outputs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Target Audience */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-blue-600" />
              Target Audience
            </label>
            <select
              value={configuration.targetAudience}
              onChange={(e) => setConfiguration({ targetAudience: e.target.value })}
              className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 cursor-pointer shadow-xs"
            >
              <option value="CISOs & Security Operations Teams">CISOs & Security Operations Teams</option>
              <option value="Executive Leadership / C-Suite">Executive Leadership / C-Suite</option>
              <option value="Software Engineers & Architects">Software Engineers & Architects</option>
              <option value="Healthcare & Clinical Leadership">Healthcare & Clinical Leadership</option>
              <option value="Investors & Board Members">Investors & Board Members</option>
              <option value="General Public & Consumers">General Public & Consumers</option>
            </select>
          </div>

          {/* Tone */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Volume2 className="h-3.5 w-3.5 text-amber-600" />
              Tone
            </label>
            <select
              value={configuration.tone}
              onChange={(e) => setConfiguration({ tone: e.target.value })}
              className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 cursor-pointer shadow-xs"
            >
              <option value="Urgent & Authoritative">Urgent & Authoritative</option>
              <option value="Formal & Professional">Formal & Professional</option>
              <option value="Scientific & Analytical">Scientific & Analytical</option>
              <option value="Persuasive & Compelling">Persuasive & Compelling</option>
              <option value="Accessible & Educational">Accessible & Educational</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-emerald-600" />
              Language
            </label>
            <select
              value={configuration.language}
              onChange={(e) => setConfiguration({ language: e.target.value })}
              className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 cursor-pointer shadow-xs"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi (हिंदी)</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="French">French (Français)</option>
              <option value="German">German (Deutsch)</option>
              <option value="Japanese">Japanese (日本語)</option>
            </select>
          </div>

          {/* Detail Level */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 text-purple-600" />
              Detail Level
            </label>
            <select
              value={configuration.detailLevel}
              onChange={(e) => setConfiguration({ detailLevel: e.target.value as any })}
              className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 cursor-pointer shadow-xs"
            >
              <option value="Concise (TL;DR)">Concise (TL;DR)</option>
              <option value="Standard (Balanced)">Standard (Balanced)</option>
              <option value="Comprehensive (In-depth)">Comprehensive (In-depth)</option>
            </select>
          </div>

          {/* Communication Objective */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-rose-600" />
              Communication Objective
            </label>
            <select
              value={configuration.communicationObjective}
              onChange={(e) => setConfiguration({ communicationObjective: e.target.value })}
              className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 cursor-pointer shadow-xs"
            >
              <option value="Warn & Advise">Warn & Advise (Operational Alert)</option>
              <option value="Inform & Educate">Inform & Educate (Knowledge Sharing)</option>
              <option value="Report Findings">Report Findings (Audit / Trial Results)</option>
              <option value="Drive Action / Convert">Drive Action / Convert (Decision Making)</option>
              <option value="Executive Briefing">Executive Briefing (Board Overview)</option>
            </select>
          </div>
        </div>
      </section>

      {/* SECTION 3: OUTPUT TYPES SELECTION */}
      <section className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-150 pb-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wider">
              Step 3 of 3
            </span>
            <h3 className="text-base font-bold text-stone-900 tracking-tight">
              Select Output Types ({selectedOutputs.length}/7 Selected)
            </h3>
            <p className="text-xs text-stone-500">
              Choose the specific communication artefacts to generate from the single source understanding
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={isAllSelected ? clearAllOutputs : selectAllOutputs}
              className="text-xs font-semibold text-amber-800 hover:text-amber-900 px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 transition-colors shadow-xs"
            >
              {isAllSelected ? 'Deselect All' : 'Select All Outputs'}
            </button>
          </div>
        </div>

        {/* 7 Selectable Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {outputCards.map((card) => {
            const isSelected = selectedOutputs.includes(card.type);

            return (
              <div
                key={card.type}
                onClick={() => toggleOutputType(card.type)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between select-none relative shadow-xs ${
                  isSelected
                    ? 'border-amber-400 bg-amber-50/40 ring-1 ring-amber-400 text-stone-900'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{card.icon}</span>
                    <div
                      className={`h-5 w-5 rounded-md flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-amber-600 border-amber-600 text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-stone-900 mb-1">
                    {card.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Primary Action Button */}
        <div className="pt-4 border-t border-stone-150 flex justify-end">
          <button
            type="button"
            onClick={startTransformation}
            disabled={isProcessing}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center gap-2.5 shadow-sm transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Analyze & Generate ({selectedOutputs.length} Outputs)</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
};

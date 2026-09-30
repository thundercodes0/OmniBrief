import React from 'react';
import {
  Sparkles,
  PlusCircle,
  FileText,
  Layers,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileSearch,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { OutputType } from '../types/transformation';

export const DashboardPage: React.FC = () => {
  const {
    setActivePage,
    recentTransformations,
  } = useAppStore();

  const getChannelBadge = (type: OutputType) => {
    const map: Record<OutputType, { label: string; color: string }> = {
      executive_summary: { label: 'Exec Summary', color: 'text-amber-800 bg-amber-50 border-amber-200' },
      linkedin_post: { label: 'LinkedIn', color: 'text-blue-800 bg-blue-50 border-blue-200' },
      x_thread: { label: 'X Thread', color: 'text-sky-800 bg-sky-50 border-sky-200' },
      advisory: { label: 'Advisory', color: 'text-rose-800 bg-rose-50 border-rose-200' },
      infographic: { label: 'Infographic', color: 'text-purple-800 bg-purple-50 border-purple-200' },
      presentation: { label: 'Presentation', color: 'text-amber-900 bg-amber-100 border-amber-300' },
      video_package: { label: 'Video Pkg', color: 'text-pink-800 bg-pink-50 border-pink-200' },
    };
    const info = map[type] || { label: type, color: 'text-stone-700 bg-stone-100 border-stone-200' };

    return (
      <span
        key={type}
        className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${info.color}`}
      >
        {info.label}
      </span>
    );
  };

  const totalTransformations = recentTransformations.length;
  const totalOutputs = recentTransformations.reduce(
    (acc, cur) => acc + (cur.outputTypes?.length || 0),
    0
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-6xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 relative overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Autonomous Content Transformation & Verification</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-stone-900 tracking-tight">
            One Source Material, Seven Tailored Communication Artefacts.
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Eliminate manual content repurposing bottlenecks. Ingest raw reports, documents, or advisories, extract a single canonical Source Brief, and synthesize executive summaries, social threads, infographics, presentations, and video packages in parallel.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActivePage('new-transformation')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2 transition-all shadow-xs"
            >
              <PlusCircle className="h-4 w-4" />
              <span>New Transformation</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative warm background gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-50/60 to-transparent pointer-events-none"></div>
      </div>

      {/* Metrics or Clean Empty State */}
      {totalTransformations > 0 ? (
        <>
          {/* 3 Core Metric Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stat 1: Total Transformations */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between group hover:border-stone-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">
                  Total Transformations
                </span>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/50">
                  <Layers className="h-4 w-4" />
                </div>
              </div>
              <div className="my-2">
                <span className="text-3xl font-black text-stone-900 font-mono tracking-tight">
                  {totalTransformations}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Active session pipelines</span>
              </div>
            </div>

            {/* Stat 2: Documents Processed */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between group hover:border-stone-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">
                  Documents Processed
                </span>
                <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200/50">
                  <FileText className="h-4 w-4" />
                </div>
              </div>
              <div className="my-2">
                <span className="text-3xl font-black text-stone-900 font-mono tracking-tight">
                  {totalTransformations}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                <span>PDF, DOCX, TXT, and raw input files</span>
              </div>
            </div>

            {/* Stat 3: Outputs Generated */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between group hover:border-stone-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">
                  Outputs Generated
                </span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <div className="my-2">
                <span className="text-3xl font-black text-stone-900 font-mono tracking-tight">
                  {totalOutputs}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600">
                <span>Synchronized across target formats</span>
              </div>
            </div>
          </div>

          {/* Recent Transformations Section */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 tracking-tight">
                  Recent Transformations
                </h3>
                <p className="text-xs text-stone-500">
                  Audit log of source documents and their synchronized output suites
                </p>
              </div>

              <button
                onClick={() => setActivePage('history')}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                <span>View All History</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Table List */}
            <div className="divide-y divide-stone-100">
              {recentTransformations.map((item) => (
                <div
                  key={item.id}
                  className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 hover:bg-stone-50/70 p-3 rounded-xl transition-colors"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                        {item.inputType}
                      </span>
                      <span className="text-xs font-bold text-stone-900 tracking-tight">
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-stone-500">
                      <span>Domain: {item.domain}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.date}
                      </span>
                    </div>
                  </div>

                  {/* Output Channels Badges */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.outputTypes.map((type) => getChannelBadge(type))}
                    </div>

                    <button
                      onClick={() => setActivePage('results')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-all shrink-0"
                    >
                      View Results
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Clean Empty State when no transformations have run yet */
        <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center space-y-4 shadow-xs">
          <div className="h-12 w-12 mx-auto rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700">
            <Layers className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-900 tracking-tight">
              No transformations yet
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Your completed transformations and output statistics will appear here once you run your first pipeline.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setActivePage('new-transformation')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white inline-flex items-center gap-2 shadow-xs transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create First Transformation</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  History,
  Search,
  Calendar,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const HistoryPage: React.FC = () => {
  const { setActivePage, recentTransformations } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = recentTransformations.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">
            Transformation Audit History
          </h2>
          <p className="text-xs text-stone-500">
            Historical log of ingested source materials and generated communication suites
          </p>
        </div>

        {/* Search */}
        {recentTransformations.length > 0 && (
          <div className="relative w-full sm:w-64">
            <Search className="h-4 w-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or domain..."
              className="w-full bg-white border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        )}
      </div>

      {/* History List or Empty State */}
      {recentTransformations.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center space-y-4 shadow-xs">
          <div className="h-12 w-12 mx-auto rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700">
            <History className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-900 tracking-tight">
              No transformations yet
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Your completed transformations will appear here. Start a new transformation to extract a canonical Source Brief and generate 7 synchronized communication artifacts.
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
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-stone-300 transition-all shadow-xs"
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    {item.id}
                  </span>
                  <span className="text-xs font-mono text-stone-300">·</span>
                  <span className="text-xs font-mono text-stone-600 font-semibold">
                    {item.inputType}
                  </span>
                  <span className="text-xs font-mono text-stone-300">·</span>
                  <span className="text-xs font-medium text-emerald-600">
                    {item.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-stone-900 tracking-tight">
                  {item.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <span>Domain: {item.domain}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {item.date}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono text-stone-500">
                  {item.outputTypes.length} Artefacts
                </span>

                <button
                  onClick={() => setActivePage('results')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-amber-600 hover:text-white text-stone-800 border border-stone-200 flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <span>View Results</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && searchQuery && (
            <div className="p-12 text-center bg-white border border-stone-200 rounded-2xl text-xs text-stone-500 shadow-xs">
              No transformations found matching "{searchQuery}".
            </div>
          )}
        </div>
      )}
    </div>
  );
};

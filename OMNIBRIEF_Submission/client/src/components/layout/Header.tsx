import React from 'react';
import {
  FileSearch,
  PlusCircle,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const Header: React.FC = () => {
  const {
    activePage,
    setActivePage,
    sourceBrief,
    setIsBriefModalOpen,
  } = useAppStore();

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard':
        return { title: 'Transformation Dashboard', subtitle: 'Overview & Recent Repurposing Pipelines' };
      case 'new-transformation':
        return { title: 'New Content Transformation', subtitle: 'Ingest Source Material & Configure Parameters' };
      case 'results':
        return { title: 'Transformation Results Studio', subtitle: 'Multi-Channel Synchronized Communication Artefacts' };
      case 'history':
        return { title: 'Transformation History', subtitle: 'Audit Log of Past Repurposed Outputs' };
      case 'templates':
        return { title: 'Communication Templates', subtitle: 'Preset Profiles for Advisories, Press Releases & Executive Memos' };
      case 'settings':
        return { title: 'Platform Settings', subtitle: 'Model Configuration & Environment Profiles' };
      default:
        return { title: 'OMNIBRIEF', subtitle: 'Content Transformation Engine' };
    }
  };

  const { title, subtitle } = getPageTitle();

  return (
    <header className="h-16 border-b border-stone-200 bg-white/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Left: Title and Breadcrumb */}
      <div>
        <h1 className="text-sm sm:text-base font-bold text-stone-900 tracking-tight leading-none">
          {title}
        </h1>
        <p className="text-[11px] text-stone-500 mt-1 hidden sm:block">
          {subtitle}
        </p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5">
        {/* Source Brief Inspector button if brief exists */}
        {sourceBrief && (
          <button
            onClick={() => setIsBriefModalOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <FileSearch className="h-3.5 w-3.5 text-amber-600" />
            <span className="hidden sm:inline">Source Brief</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          </button>
        )}

        {/* New Transformation Primary CTA if not already there */}
        {activePage !== 'new-transformation' && (
          <button
            onClick={() => setActivePage('new-transformation')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>New Transformation</span>
          </button>
        )}
      </div>
    </header>
  );
};

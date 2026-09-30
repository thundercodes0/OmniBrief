import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Layers,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FileCheck2,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { NavigationPage } from '../../types/transformation';

interface NavItem {
  id: NavigationPage;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    sidebarCollapsed,
    toggleSidebar,
    artifacts,
    recentTransformations,
  } = useAppStore();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-transformation', label: 'New Transformation', icon: PlusCircle, badge: 'Core' },
    {
      id: 'history',
      label: 'History',
      icon: History,
      badge: recentTransformations.length > 0 ? String(recentTransformations.length) : undefined,
    },
    { id: 'templates', label: 'Templates', icon: Layers },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`bg-white border-r border-stone-200 transition-all duration-300 flex flex-col justify-between shrink-0 z-30 shadow-xs ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header / Branding */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-stone-200">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 rounded-xl bg-amber-500 flex items-center justify-center shrink-0 shadow-sm text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            {!sidebarCollapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-tight text-stone-900">
                    OMNIBRIEF
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-50 text-amber-900 border border-amber-200/80 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-amber-700' : 'text-stone-500'}`} />
                {!sidebarCollapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? 'bg-amber-200/80 text-amber-900'
                            : 'bg-stone-100 text-stone-600 border border-stone-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}

          {/* Quick link to Results if artifacts are present */}
          {artifacts && (
            <button
              onClick={() => setActivePage('results')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all mt-4 ${
                activePage === 'results'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-xs'
                  : 'text-emerald-700 hover:bg-emerald-50/70 border border-emerald-200'
              }`}
              title={sidebarCollapsed ? 'Results' : undefined}
            >
              <FileCheck2 className="h-4 w-4 shrink-0 text-emerald-600" />
              {!sidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span>Transformation Results</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                </div>
              )}
            </button>
          )}
        </nav>
      </div>

      {/* Bottom Footer Info */}
      <div className="p-3 border-t border-stone-200">
        {!sidebarCollapsed ? (
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <p className="text-[10px] text-stone-500 leading-relaxed">
              One Source → One Canonical Brief → 7 Communication Artefacts
            </p>
          </div>
        ) : (
          <div className="flex justify-center py-2 text-stone-400" title="OMNIBRIEF">
            <ShieldCheck className="h-5 w-5 text-amber-600" />
          </div>
        )}
      </div>
    </aside>
  );
};

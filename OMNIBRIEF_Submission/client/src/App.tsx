import React from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardPage } from './pages/DashboardPage';
import { NewTransformationPage } from './pages/NewTransformationPage';
import { ResultsPage } from './pages/ResultsPage';
import { HistoryPage } from './pages/HistoryPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { SettingsPage } from './pages/SettingsPage';
import { SourceBriefViewer } from './components/inspector/SourceBriefViewer';
import { VerificationAuditModal } from './components/verification/VerificationAuditModal';
import { useAppStore } from './store/useAppStore';

export const App: React.FC = () => {
  const { activePage } = useAppStore();

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'new-transformation':
        return <NewTransformationPage />;
      case 'results':
        return <ResultsPage />;
      case 'history':
        return <HistoryPage />;
      case 'templates':
        return <TemplatesPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-[#FAFAF7] text-stone-900 overflow-hidden font-sans">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar />

      {/* 2. Main Content Layout (Header + Scrollable Body) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderActivePage()}
        </main>
      </div>

      {/* 3. Source Brief Inspection Modal */}
      <SourceBriefViewer />

      {/* 4. Phase 4: Factual Verification Audit Modal */}
      <VerificationAuditModal />
    </div>
  );
};

export default App;

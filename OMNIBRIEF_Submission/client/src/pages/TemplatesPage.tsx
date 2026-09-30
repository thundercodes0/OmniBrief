import React from 'react';
import { Layers } from 'lucide-react';

export const TemplatesPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-200">
      <div className="border-b border-stone-200 pb-4">
        <h2 className="text-lg font-bold text-stone-900 tracking-tight">
          Communication Strategy Templates
        </h2>
        <p className="text-xs text-stone-500">
          Saved configuration profiles for organizational communication objectives
        </p>
      </div>

      {/* Clean Empty State */}
      <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center space-y-4 shadow-xs">
        <div className="h-12 w-12 mx-auto rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700">
          <Layers className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-stone-900 tracking-tight">
            No templates yet
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            You don't have any saved templates.
          </p>
        </div>
      </div>
    </div>
  );
};

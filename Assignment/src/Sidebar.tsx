import React from 'react';
import {
  Home,
  Database,
  Filter,
  Scissors,
  Tag,
  Search,
  GitCompare,
  BarChart3,
  AlertTriangle,
  Award,
  ShieldCheck,
  Users,
  Info,
  CheckCircle2
} from 'lucide-react';

export interface TabItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  category?: 'pipeline' | 'evaluation' | 'meta';
}

export const NAVIGATION_TABS: TabItem[] = [
  { id: 'home', name: '1. Home / Overview', icon: Home, category: 'pipeline' },
  { id: 'dataset', name: '2. Support Dataset', icon: Database, category: 'pipeline' },
  { id: 'preprocessing', name: '3. Text Preprocessing', icon: Filter, category: 'pipeline' },
  { id: 'stemming', name: '4. Morphology / Stemming', icon: Scissors, category: 'pipeline' },
  { id: 'pos_tagging', name: '5. POS Tagging', icon: Tag, category: 'pipeline' },
  { id: 'retrieval', name: '6. Information Retrieval', icon: Search, badge: 'Live IR', category: 'pipeline' },
  { id: 'comparison', name: '7. Model Comparison', icon: GitCompare, category: 'evaluation' },
  { id: 'evaluation', name: '8. Evaluation Benchmark', icon: BarChart3, badge: 'P@k, MRR', category: 'evaluation' },
  { id: 'error_analysis', name: '9. Error & Failure Analysis', icon: AlertTriangle, category: 'evaluation' },
  { id: 'decision', name: '10. Engineering Decision', icon: Award, badge: 'BM25 Win', category: 'evaluation' },
  { id: 'ethics', name: '11. Ethics & Sustainability', icon: ShieldCheck, category: 'meta' },
  { id: 'team', name: '12. Project Team', icon: Users, category: 'meta' },
  { id: 'about', name: '13. About / Compliance', icon: Info, category: 'meta' }
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-full lg:w-64 shrink-0 bg-white border-r border-slate-200 p-3.5 flex flex-col gap-1 overflow-y-auto">
      <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        Assignment Modules
      </div>

      <nav className="flex flex-col gap-1">
        {NAVIGATION_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-button-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition cursor-pointer text-left ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="truncate">{tab.name}</span>
              </div>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tight shrink-0 ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Decision Callout Box in Sidebar */}
      <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verdict: Okapi BM25</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-tight">
          Superior non-linear TF saturation and document length calibration.
        </p>
      </div>

      {/* College & Team Info Footer */}
      <div className="mt-auto pt-3 border-t border-slate-100 px-2 text-[11px] space-y-0.5">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-bold text-slate-700">DSA0301 Slot A</span>
        </div>
        <p className="text-[10px] text-slate-500">Natural Language Processing</p>
        <p className="text-[10px] text-emerald-700 font-semibold pt-0.5">
          Tharani • Lalitha • Tejasri • Anusha
        </p>
      </div>
    </aside>
  );
};

import React from 'react';
import { Play, Sparkles, GraduationCap, Users, Database, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  ticketCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDemoMode,
  onToggleDemoMode,
  ticketCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0F172A] text-white px-4 sm:px-6 py-3.5 flex justify-between items-center shadow-md border-b border-slate-800">
      {/* Brand & Project Info */}
      <div className="flex items-center gap-3">
        <button
          id="brand-home-button"
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="bg-emerald-500 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-base text-white shadow-xs group-hover:scale-105 transition-transform">
            N
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight text-white group-hover:text-emerald-300 transition">
                INTELLIGENT TICKET RETRIEVAL SYSTEM
              </h1>
              <span className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                BM25 + TF-IDF
              </span>
            </div>
            <p className="text-[10px] text-slate-400 opacity-80 uppercase tracking-widest font-medium">
              DSA0301 NLP • Slot A Assignment
            </p>
          </div>
        </button>
      </div>

      {/* Right Controls & Team Metadata */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Team Members */}
        <div className="hidden md:block text-right">
          <p className="text-[10px] text-slate-400 opacity-70 uppercase tracking-wider font-semibold">Team Members</p>
          <p className="text-[11px] font-medium text-slate-200">Tharani, Lalitha, Tejasri, Anusha</p>
        </div>

        <div className="hidden md:block h-7 w-[1px] bg-white/20"></div>

        {/* Dataset Counter Pill */}
        <button
          id="nav-dataset-indicator"
          onClick={() => setActiveTab('dataset')}
          className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
          title="Click to view and manage dataset"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-[11px]">Dataset: <strong className="text-emerald-400 font-bold">{ticketCount}</strong></span>
        </button>

        {/* System Status Badge */}
        <div className="hidden sm:flex items-center bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-md">
          <span className="text-emerald-400 text-[11px] font-bold uppercase tracking-tight">System Status: Active</span>
        </div>

        {/* Guided Demo Flow Stepper Toggle */}
        <button
          id="nav-toggle-demo-mode"
          onClick={onToggleDemoMode}
          className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
            isDemoMode
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-xs'
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border-slate-700'
          }`}
          title="Toggle 17-Step Guided Faculty Demonstration Mode"
        >
          <Play className="w-3 h-3 text-amber-400" />
          <span className="hidden lg:inline">{isDemoMode ? 'Demo Flow Active' : 'Faculty Demo Mode'}</span>
          <span className="lg:hidden">Demo</span>
        </button>

        {/* Team Details Quick Link */}
        <button
          id="nav-team-link"
          onClick={() => setActiveTab('team')}
          className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
          title="Team Contributions"
        >
          <Users className="w-3.5 h-3.5" />
        </button>

        {/* About Quick Link */}
        <button
          id="nav-about-link"
          onClick={() => setActiveTab('about')}
          className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
          title="About & Assignment Compliance"
        >
          <GraduationCap className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};

import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Search, 
  CheckCircle2, 
  Code, 
  Users, 
  Target, 
  HelpCircle,
  Database,
  Cpu,
  BarChart,
  ShieldAlert
} from 'lucide-react';
import { PipelineVisualizer } from '../PipelineVisualizer';

interface HomeViewProps {
  onStartAnalysis: () => void;
  setActiveTab: (tab: string) => void;
  ticketCount: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartAnalysis,
  setActiveTab,
  ticketCount
}) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F172A] via-slate-900 to-slate-800 border border-slate-800 p-6 sm:p-8 shadow-sm text-white">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>College NLP Assignment • Slot A • DSA0301</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            Intelligent Customer Support Ticket Understanding and Retrieval System Using NLP
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            An end-to-end natural language processing system that preprocesses customer support tickets, 
            executes morphological Porter stemming and Penn Treebank POS tagging, indexes historical ticket corpora, 
            and evaluates two genuine Information Retrieval models: <strong>TF-IDF + Cosine Similarity</strong> vs <strong>Okapi BM25</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="start-analysis-btn"
              onClick={onStartAnalysis}
              className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Start Analysis & Demonstration</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="view-dataset-btn"
              onClick={() => setActiveTab('dataset')}
              className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 flex items-center gap-2 transition cursor-pointer"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Inspect Dataset ({ticketCount} Tickets)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Problem Statement & Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Problem */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-amber-600">
            <HelpCircle className="w-5 h-5" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Problem Statement
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Customer support organizations handle massive volumes of incoming textual tickets daily. 
            Manual triaging, searching, and categorizing is repetitive, error-prone, and bottlenecked by human bandwidth. 
            Traditional keyword search fails on morphological variations (e.g. <em>connecting</em> vs <em>connected</em>), 
            synonym gaps, and query-length disparities.
          </p>
          <div className="pt-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Key Challenges Addressed:</div>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>Lexical noise: URLs, email addresses, and punctuation polluting index terms.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>Inflectional variations requiring systematic morphological root reduction.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>Retrieving relevant historical resolutions accurately under short and ambiguous queries.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Objectives */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-emerald-700">
            <Target className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Project Objectives
            </h2>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>End-to-End Pipeline:</strong> Clean, tokenize, remove stopwords, stem, and tag parts of speech.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Alternative IR Models:</strong> Implement and compare TF-IDF + Cosine Similarity against Okapi BM25 ranking.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Quantitative Benchmarking:</strong> Calculate Precision@K, Recall@K, F1@K, and MRR directly from dataset ground truth.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Automated Engineering Decision:</strong> Recommend the optimal model with formal trade-off analysis.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* NLP Components Overview Grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-600" />
            Core NLP Components Implemented
          </h2>
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            100% Functional Mathematical Code
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => setActiveTab('preprocessing')}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/40 transition cursor-pointer group"
          >
            <div className="text-[10px] font-bold uppercase text-emerald-700 mb-1">Component 1</div>
            <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition mb-1">Regex Preprocessing</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Lowercasing, regex URL/email removal, non-alphanumeric filtering, whitespace normalization, and stop-word filtering.
            </p>
          </div>

          <div 
            onClick={() => setActiveTab('stemming')}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/40 transition cursor-pointer group"
          >
            <div className="text-[10px] font-bold uppercase text-emerald-700 mb-1">Component 2</div>
            <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition mb-1">Porter Stemming</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              5-step morphological suffix reduction (e.g. <em>connecting → connect</em>) with syllable measure (m) calculations.
            </p>
          </div>

          <div 
            onClick={() => setActiveTab('pos_tagging')}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/40 transition cursor-pointer group"
          >
            <div className="text-[10px] font-bold uppercase text-emerald-700 mb-1">Component 3</div>
            <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition mb-1">POS Tagging</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Penn Treebank syntax classification (NOUN, VERB, ADJ) using lexicon lookup, affixes, and contextual rules.
            </p>
          </div>

          <div 
            onClick={() => setActiveTab('retrieval')}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/40 transition cursor-pointer group"
          >
            <div className="text-[10px] font-bold uppercase text-emerald-700 mb-1">Component 4</div>
            <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition mb-1">Dual IR Engine</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Live side-by-side execution of TF-IDF Vector Space Cosine Similarity vs Okapi BM25 Ranking Engine.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Pipeline */}
      <PipelineVisualizer onSelectStage={setActiveTab} />

      {/* Bottom Info: Tech Stack & Team */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tech Stack */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-slate-900">
            <Code className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Technology Stack</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
              <span className="text-slate-400 block text-[10px] font-medium">Frontend Framework</span>
              <strong className="text-slate-800">React 19 + TypeScript</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
              <span className="text-slate-400 block text-[10px] font-medium">Styling System</span>
              <strong className="text-slate-800">Tailwind CSS 4</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
              <span className="text-slate-400 block text-[10px] font-medium">NLP Algorithms</span>
              <strong className="text-slate-800">Pure TypeScript Modules</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
              <span className="text-slate-400 block text-[10px] font-medium">Data & Charts</span>
              <strong className="text-slate-800">PapaParse & Recharts</strong>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900">
              <Users className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Project Team Members</h3>
            </div>
            <button
              onClick={() => setActiveTab('team')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold cursor-pointer"
            >
              View Details →
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
              <div className="font-bold text-slate-800">Tharani</div>
              <div className="text-[11px] text-slate-500 truncate">Dataset & Preprocessing</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
              <div className="font-bold text-slate-800">Lalitha</div>
              <div className="text-[11px] text-slate-500 truncate">Stemming & POS Tagging</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
              <div className="font-bold text-slate-800">Tejasri</div>
              <div className="text-[11px] text-slate-500 truncate">TF-IDF & BM25 Retrieval</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
              <div className="font-bold text-slate-800">Anusha</div>
              <div className="text-[11px] text-slate-500 truncate">Evaluation & Error Analysis</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

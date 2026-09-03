import React from 'react';
import { 
  Info, 
  CheckCircle2, 
  Layers, 
  FileText, 
  Code2, 
  Cpu, 
  Database, 
  ExternalLink, 
  ShieldCheck, 
  Award 
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const REQUIREMENTS_CHECKLIST = [
    { req: 'Real-world customer support ticket understanding and retrieval problem statement', status: 'Implemented' },
    { req: 'Input / Output processing handling customer complaints and queries', status: 'Implemented' },
    { req: 'At least 3 core NLP components (Text Preprocessing & Regex, Porter Stemmer, POS Tagger)', status: 'Implemented' },
    { req: 'Modern web interface with interactive user controls', status: 'Implemented' },
    { req: 'Two alternative IR approaches (TF-IDF + Cosine Similarity vs Okapi BM25)', status: 'Implemented' },
    { req: 'Quantitative evaluation with empirical Precision@K, Recall@K, F1@K, and MRR', status: 'Implemented' },
    { req: 'Detailed failure case and error analysis with root causes and mitigations', status: 'Implemented' },
    { req: 'Clear engineering recommendation with justified trade-offs and decision matrix', status: 'Implemented' },
    { req: 'Comprehensive discussion of ethics, privacy (PII scrubbing), algorithmic bias, and sustainability', status: 'Implemented' },
    { req: 'Future improvement roadmap (Dense semantic retrieval, bi-encoders, LLM query expansion)', status: 'Implemented' },
    { req: 'CSV dataset upload support with validation, stats, charts, and built-in benchmark corpus', status: 'Implemented' },
    { req: 'Live demonstration mode with guided step-by-step faculty walkthrough', status: 'Implemented' }
  ];

  const FORMULAS_SUMMARY = [
    {
      name: 'Porter Syllable Measure (m)',
      formula: '[C](VC)^m[V]',
      description: 'Counts vowel-consonant sequences to govern valid affix stripping boundaries.'
    },
    {
      name: 'Term Frequency (TF)',
      formula: 'TF(t, d) = f(t, d) / |d|',
      description: 'Proportion of term occurrences relative to total token count in ticket document d.'
    },
    {
      name: 'Inverse Document Frequency (IDF)',
      formula: 'IDF(t) = ln((N + 1) / (df(t) + 1)) + 1.0',
      description: 'Logarithmic downweighting of terms that appear ubiquitously across the corpus.'
    },
    {
      name: 'Cosine Similarity',
      formula: 'Sim(Q, D) = (v_Q • v_D) / (||v_Q|| * ||v_D||)',
      description: 'Dot product of L2-normalized sparse vector representations in Euclidean term space.'
    },
    {
      name: 'Okapi BM25 Score',
      formula: 'Score(D, Q) = Σ IDF(q_i) * [ tf * (k1 + 1) ] / [ tf + k1 * (1 - b + b * (|D| / avgdl)) ]',
      description: 'Asymptotically saturated probabilistic relevance with explicit document length tuning.'
    },
    {
      name: 'Mean Reciprocal Rank (MRR)',
      formula: 'MRR = (1 / |Q|) * Σ (1 / rank_i)',
      description: 'Harmonic mean of the ranking positions of the first relevant retrieved ticket.'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-700 mb-1">
          <Info className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900">About the NLP System & Academic Compliance</h2>
        </div>
        <p className="text-xs text-slate-500">
          Full project documentation, Slot A assignment requirements validation checklist, and mathematical formula references.
        </p>
      </div>

      {/* Project Overview Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Project Abstract</span>
        </div>
        <h3 className="text-base font-bold text-slate-900">
          "Intelligent Customer Support Ticket Understanding and Retrieval System Using NLP"
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Modern enterprise support desks suffer from manual categorization latency and high ticket backlogs. 
          This project implements an end-to-end computational linguistics architecture that parses unstructured customer tickets, 
          cleans noise via regular expressions, reduces morphological variations via the Porter Stemming algorithm, 
          labels syntax via Penn Treebank POS Tagging, and searches historical resolutions through a comparative Information Retrieval suite 
          evaluating TF-IDF Vector Space modeling against Okapi BM25.
        </p>
      </div>

      {/* Assignment Compliance Checklist */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Slot A Assignment Requirements Verification Checklist
          </h3>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            12 of 12 (100% Complete)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {REQUIREMENTS_CHECKLIST.map((item, idx) => (
            <div 
              key={idx}
              className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-xs text-slate-800 font-medium block leading-snug">{item.req}</span>
                <span className="text-[10px] text-emerald-700 font-mono font-bold uppercase">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mathematical Formulas Summary Reference */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <Code2 className="w-4 h-4 text-emerald-600" />
          Mathematical Formulations & Algorithmic Reference
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FORMULAS_SUMMARY.map((f, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="font-bold text-slate-900 text-xs">{f.name}</div>
              <div className="p-2.5 rounded bg-white font-mono text-xs text-slate-800 border border-slate-200 shadow-2xs">
                {f.formula}
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

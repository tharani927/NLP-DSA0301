import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Search, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Layers, 
  ShieldAlert, 
  ArrowRight 
} from 'lucide-react';
import { SupportTicket, ErrorCase } from '../../types';
import { ErrorAnalyzer } from '../../nlp/errorAnalysis';

interface ErrorAnalysisViewProps {
  tickets: SupportTicket[];
  onProceedToDecision?: () => void;
}

const ERROR_CATEGORIES = [
  { id: 'ALL', label: 'All Error Categories' },
  { id: 'Out of Vocabulary (OOV)', label: 'Out-of-Vocabulary (OOV)' },
  { id: 'Lexical Polysemy & Semantic Gap', label: 'Polysemy & Synonym Gap' },
  { id: 'Syntactic Negation Inversion', label: 'Negation Inversion' },
  { id: 'Document Length & Verbosity Bias', label: 'Length & Verbosity Disparity' },
  { id: 'Morphological Over-Stemming / Under-Stemming', label: 'Stemming Boundary Errors' }
];

export const ErrorAnalysisView: React.FC<ErrorAnalysisViewProps> = ({
  tickets,
  onProceedToDecision
}) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [testQuery, setTestQuery] = useState('I never authorized this transaction, cancel the subscription immediately!');
  const [testResult, setTestResult] = useState<ErrorCase | null>(() => {
    const cases = ErrorAnalyzer.getCuratedErrorCases();
    return cases[0];
  });

  const curatedCases = ErrorAnalyzer.getCuratedErrorCases();

  const filteredCases = curatedCases.filter(c => {
    if (selectedCategory === 'ALL') return true;
    return c.errorCategory.toLowerCase().includes(selectedCategory.toLowerCase()) || 
           c.errorCategory === selectedCategory;
  });

  const handleTestErrorCase = (ec: ErrorCase) => {
    setTestQuery(ec.query);
    setTestResult(ec);
  };

  const handleDiagnoseCustomQuery = () => {
    if (!testQuery.trim()) return;
    const diagnosis = ErrorAnalyzer.diagnoseQuery(testQuery, tickets);
    setTestResult(diagnosis);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 text-rose-700 mb-1">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <h2 className="text-base font-bold text-slate-900">Error & Failure-Case Diagnostic Analysis</h2>
        </div>
        <p className="text-xs text-slate-500">
          Rigorous analysis of edge cases where lexical Information Retrieval models degrade: OOV terms, syntactic negation, polysemy, typos, and length disparities.
        </p>
      </div>

      {/* Interactive Failure Case Sandbox */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Test a Diagnostic Edge Case Query
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="error-query-input"
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="e.g. I never wanted a refund, do NOT cancel my order..."
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-xs font-sans"
            />
            <button
              id="diagnose-btn"
              onClick={handleDiagnoseCustomQuery}
              className="px-5 py-2.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
            >
              Diagnose Query
            </button>
          </div>
        </div>

        {/* Live Diagnostic Card */}
        {testResult && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                  {testResult.errorCategory}
                </span>
                <span className="text-xs font-mono text-slate-600">Query: "{testResult.query}"</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-emerald-700 font-bold">Expected: <strong>{testResult.expectedCategory}</strong></span>
                <span className="text-rose-700 font-bold">Retrieved: <strong>{testResult.retrievedCategory}</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1 shadow-2xs">
                <div className="font-bold text-amber-700 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  Root Cause Mechanism
                </div>
                <p className="text-slate-600 leading-relaxed">{testResult.rootCause}</p>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1 shadow-2xs">
                <div className="font-bold text-emerald-700 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Recommended Mitigation Architecture
                </div>
                <p className="text-slate-600 leading-relaxed">{testResult.mitigation}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Curated Benchmark Failure Cases List */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Empirical Failure-Case Taxonomy ({filteredCases.length} Scenarios)
            </h3>
            <p className="text-xs text-slate-500">Systematic breakdown of lexical IR failure patterns.</p>
          </div>

          {/* Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-slate-200 text-xs text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-xs"
          >
            {ERROR_CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          {filteredCases.map((ec, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-900">"{ec.query}"</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    {ec.errorCategory}
                  </span>
                  <button
                    onClick={() => handleTestErrorCase(ec)}
                    className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200 cursor-pointer shadow-2xs"
                  >
                    Test Case →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Retrieved vs Expected:</span>
                  <div className="text-slate-700 truncate">
                    Expected <strong className="text-emerald-700 font-bold">{ec.expectedCategory}</strong>, got <strong className="text-rose-700 font-bold">{ec.retrievedCategory}</strong>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-white border border-slate-200 shadow-2xs md:col-span-2">
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-0.5">Root Cause & Mitigation:</span>
                  <div className="text-slate-600 text-[11px] leading-relaxed">
                    {ec.rootCause} <span className="text-emerald-700 font-medium">→ Solution: {ec.mitigation}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Step */}
      {onProceedToDecision && (
        <div className="flex justify-end">
          <button
            id="proceed-to-decision-btn"
            onClick={onProceedToDecision}
            className="px-5 py-2.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <span>Proceed to Engineering Decision & Recommendation</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      )}
    </div>
  );
};

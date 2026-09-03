import React, { useState } from 'react';
import { 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Code2, 
  Layers, 
  Copy, 
  Check, 
  HelpCircle,
  Scissors
} from 'lucide-react';
import { TextPreprocessor } from '../../nlp/preprocessing';
import { PreprocessingResult } from '../../types';

interface PreprocessingViewProps {
  initialQuery?: string;
  onProceedToStemming?: (query: string) => void;
}

const PRESET_QUERIES = [
  'My payment of $120.50 was deducted from john.doe@example.com at https://pay.service.com/checkout, but the transaction failed with code #ERR-402!',
  'I forgot my account password and cannot login to https://app.system.com/auth after 3 failed attempts.',
  'Need immediate refund for cancelled order #88412 - damaged product received in parcel!',
  'The web application is crashing repeatedly with 500 Internal Server Error when exporting PDF reports.'
];

export const PreprocessingView: React.FC<PreprocessingViewProps> = ({
  initialQuery = PRESET_QUERIES[0],
  onProceedToStemming
}) => {
  const [inputText, setInputText] = useState(initialQuery);
  const [result, setResult] = useState<PreprocessingResult>(() => TextPreprocessor.process(initialQuery));
  const [copied, setCopied] = useState(false);

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    const res = TextPreprocessor.process(inputText);
    setResult(res);
  };

  const handleSelectPreset = (preset: string) => {
    setInputText(preset);
    const res = TextPreprocessor.process(preset);
    setResult(res);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-700 mb-1">
          <Filter className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900">Component 1 — Text Preprocessing & Regular Expressions</h2>
        </div>
        <p className="text-xs text-slate-500">
          Transforms raw, noisy customer text into standardized lexical tokens using sequential regex cleaning patterns, lowercasing, normalization, and stop-word elimination.
        </p>
      </div>

      {/* Input Box & Presets */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Enter Support Ticket / Query Text
          </label>
          <textarea
            id="preprocessing-input-text"
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste customer support ticket text here..."
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs font-sans"
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Test Presets:</span>
            {PRESET_QUERIES.map((p, idx) => (
              <button
                key={idx}
                id={`preset-btn-${idx}`}
                onClick={() => handleSelectPreset(p)}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-[11px] text-slate-700 border border-slate-200 font-medium transition cursor-pointer truncate max-w-xs"
                title={p}
              >
                Sample #{idx + 1}
              </button>
            ))}
          </div>

          <button
            id="analyze-text-btn"
            onClick={handleAnalyze}
            className="px-5 py-2.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Analyze Text Pipeline</span>
          </button>
        </div>
      </div>

      {/* High-Level Transformations Comparison Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Text */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Original Raw Input</span>
            <span className="text-[10px] text-slate-500 font-mono">{result.originalText.length} characters</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-sans leading-relaxed">
            {result.originalText || '(Empty)'}
          </div>
        </div>

        {/* Cleaned & Processed Text */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Final Cleaned & Filtered Text</span>
            <button
              onClick={() => handleCopy(result.finalProcessedText)}
              className="text-[10px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-medium"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 font-sans font-medium leading-relaxed">
            {result.finalProcessedText || '(No remaining informative terms)'}
          </div>
        </div>
      </div>

      {/* Tokenization & Stopwords Breakdown */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <Layers className="w-4 h-4 text-emerald-600" />
          Lexical Tokenization & Stop-Word Filtering Analysis
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Extracted Tokens */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800">
                Informative Content Tokens ({result.stopwordsRemoved.length})
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Retained for indexing & retrieval</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {result.stopwordsRemoved.map((tok, i) => (
                <span 
                  key={i} 
                  className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold"
                >
                  {tok}
                </span>
              ))}
              {result.stopwordsRemoved.length === 0 && (
                <span className="text-xs text-slate-400">No content tokens extracted.</span>
              )}
            </div>
          </div>

          {/* Filtered Stopwords */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-700">
                Filtered Stop-Words ({result.removedStopwords.length})
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Eliminated function words</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {result.removedStopwords.map((tok, i) => (
                <span 
                  key={i} 
                  className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-xs font-mono line-through opacity-80"
                >
                  {tok}
                </span>
              ))}
              {result.removedStopwords.length === 0 && (
                <span className="text-xs text-slate-400">No stop-words detected in input.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Pipeline Trace Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-600" />
            Step-by-Step Regex Pipeline Execution Trace
          </h3>
          <span className="text-xs text-slate-500 font-medium">7 Sequential Transformations</span>
        </div>

        <div className="space-y-3">
          {result.steps.map((step, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="space-y-1 min-w-0 max-w-md">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">
                    {idx}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{step.stepName}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {step.description}
                </p>
                {step.regexPattern && (
                  <div className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded inline-block font-semibold">
                    Regex: /{step.regexPattern}/g
                  </div>
                )}
              </div>

              {/* Output value */}
              <div className="p-2.5 rounded-md bg-white border border-slate-200 text-xs font-mono text-slate-800 min-w-[240px] max-w-xl truncate shadow-2xs">
                {Array.isArray(step.output) 
                  ? `[${step.output.join(', ')}]` 
                  : String(step.output)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Step CTA */}
      {onProceedToStemming && (
        <div className="flex justify-end">
          <button
            id="proceed-to-stemming-btn"
            onClick={() => onProceedToStemming(inputText)}
            className="px-5 py-2.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <span>Proceed to Morphological Stemming</span>
            <Scissors className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      )}
    </div>
  );
};

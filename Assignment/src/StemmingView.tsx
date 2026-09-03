import React, { useState } from 'react';
import { 
  Scissors, 
  Sparkles, 
  ArrowRight, 
  Info, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  Tag
} from 'lucide-react';
import { PorterStemmer } from '../../nlp/porterStemmer';
import { TextPreprocessor } from '../../nlp/preprocessing';
import { StemmingResult } from '../../types';

interface StemmingViewProps {
  initialText?: string;
  onProceedToPos?: () => void;
}

const SAMPLE_WORDS_LIST = [
  'connecting',
  'connected',
  'connection',
  'deliveries',
  'delivered',
  'operational',
  'operating',
  'refunded',
  'refunding',
  'cancellations',
  'authenticating',
  'authentication'
];

export const StemmingView: React.FC<StemmingViewProps> = ({
  initialText = 'My payment was connecting and processing, but the connection dropped and deliveries were cancelled.',
  onProceedToPos
}) => {
  const [inputText, setInputText] = useState(initialText);
  const [tokens, setTokens] = useState<string[]>(() => {
    return TextPreprocessor.tokenizeAndClean(initialText);
  });

  const [stemmedResults, setStemmedResults] = useState<StemmingResult[]>(() => {
    const toks = TextPreprocessor.tokenizeAndClean(initialText);
    return toks.map(t => PorterStemmer.stemTokenWithTrace(t));
  });

  const [singleWordInput, setSingleWordInput] = useState('');
  const [singleWordResult, setSingleWordResult] = useState<StemmingResult | null>(null);

  const handleAnalyzeText = () => {
    const toks = TextPreprocessor.tokenizeAndClean(inputText);
    setTokens(toks);
    setStemmedResults(toks.map(t => PorterStemmer.stemTokenWithTrace(t)));
  };

  const handleStemSingleWord = (word: string) => {
    setSingleWordInput(word);
    setSingleWordResult(PorterStemmer.stemTokenWithTrace(word));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-700 mb-1">
          <Scissors className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900">Component 2 — Morphological Processing / Stemming</h2>
        </div>
        <p className="text-xs text-slate-500">
          Stemming reduces inflectional and derivational word variants to a canonical base/root form to maximize Information Retrieval recall.
        </p>
      </div>

      {/* Educational Concept Box */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <div className="font-bold text-slate-900">The Porter Stemming Algorithm (1980)</div>
          <p className="text-slate-600 leading-relaxed">
            In English, words often carry grammatical affixes (such as plurals, past tense suffixes, or nominalizers). 
            For instance, <strong className="text-slate-900">"connecting"</strong>, <strong className="text-slate-900">"connected"</strong>, and <strong className="text-slate-900">"connection"</strong> all originate from the common lexical root <strong className="text-emerald-700">"connect"</strong>. 
            By stripping these suffixes using structured consonant-vowel sequence measures <em className="text-amber-700">m</em>, the search engine matches user queries regardless of syntactic tense.
          </p>
        </div>
      </div>

      {/* Interactive Text Input & Stemmer */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Enter Sentence / Query to Stem
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="stemming-sentence-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. connecting, connected, connection..."
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs font-sans"
            />
            <button
              id="stem-text-btn"
              onClick={handleAnalyzeText}
              className="px-5 py-2.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
            >
              Stem All Tokens
            </button>
          </div>
        </div>

        {/* Stemming Results Comparison Table */}
        <div>
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Token-by-Token Morphological Reduction Table ({stemmedResults.length} Tokens)
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Martin Porter 5-Step Process</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">#</th>
                  <th className="py-2.5 px-4 w-44">Original Token</th>
                  <th className="py-2.5 px-4 w-12 text-center">→</th>
                  <th className="py-2.5 px-4 w-44">Stemmed Form</th>
                  <th className="py-2.5 px-4">Morphological Rule Applied</th>
                  <th className="py-2.5 px-3 w-28 text-right">Porter Step</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {stemmedResults.map((r, idx) => {
                  const hasChanged = r.original !== r.stemmed;
                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 px-3 text-center text-slate-400 font-sans">{idx + 1}</td>
                      <td className="py-2.5 px-4 text-slate-800 font-medium">{r.original}</td>
                      <td className="py-2.5 px-4 text-center text-slate-400 font-sans">→</td>
                      <td className="py-2.5 px-4">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          hasChanged 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {r.stemmed}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-xs font-sans text-slate-600">
                        {r.ruleApplied}
                      </td>
                      <td className="py-2.5 px-3 text-right font-sans">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {r.step}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {stemmedResults.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400 font-sans">
                      No tokens available. Enter text above to execute morphological stemming.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Interactive Single-Word Sandbox */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            Interactive Porter Stemmer Word Sandbox
          </h3>
          <span className="text-xs text-slate-500 font-medium">Inspect affix transformations</span>
        </div>

        {/* Word Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Test Words:</span>
          {SAMPLE_WORDS_LIST.map((w, i) => (
            <button
              key={i}
              id={`stem-word-btn-${w}`}
              onClick={() => handleStemSingleWord(w)}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-xs font-mono text-slate-700 border border-slate-200 transition cursor-pointer font-medium"
            >
              {w}
            </button>
          ))}
        </div>

        {/* Single Word Inspector Box */}
        {singleWordResult && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] mb-1 font-semibold uppercase tracking-wider">Input Word:</span>
              <span className="text-base font-bold font-mono text-slate-900">{singleWordResult.original}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] mb-1 font-semibold uppercase tracking-wider">Stemmed Output:</span>
              <span className="text-base font-bold font-mono text-emerald-700">{singleWordResult.stemmed}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] mb-1 font-semibold uppercase tracking-wider">Rule Applied:</span>
              <span className="text-xs font-medium text-slate-700">{singleWordResult.ruleApplied} ({singleWordResult.step})</span>
            </div>
          </div>
        )}
      </div>

      {/* Next Step */}
      {onProceedToPos && (
        <div className="flex justify-end">
          <button
            id="proceed-to-pos-btn"
            onClick={onProceedToPos}
            className="px-5 py-2.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <span>Proceed to Part-of-Speech Tagging</span>
            <Tag className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      )}
    </div>
  );
};

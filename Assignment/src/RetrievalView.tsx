import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  Layers, 
  GitCompare, 
  HelpCircle, 
  Clock, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  BarChart2 
} from 'lucide-react';
import { SupportTicket, RetrievalResult, RetrievalComparison } from '../../types';
import { TfIdfEngine } from '../../nlp/tfidf';
import { BM25Engine } from '../../nlp/bm25';
import { TextPreprocessor } from '../../nlp/preprocessing';
import { PorterStemmer } from '../../nlp/porterStemmer';

interface RetrievalViewProps {
  tickets: SupportTicket[];
  onCompareModels?: () => void;
}

const SAMPLE_QUERIES = [
  'my payment was deducted but the transaction failed',
  'I forgot my account password and cannot login to dashboard',
  'I want to request a refund for my cancelled order',
  'Courier marked package as delivered but never received parcel',
  'Application crashes with 500 server error when exporting report'
];

export const RetrievalView: React.FC<RetrievalViewProps> = ({
  tickets,
  onCompareModels
}) => {
  const [query, setQuery] = useState(SAMPLE_QUERIES[0]);
  const [topK, setTopK] = useState<number>(5);
  const [tfidfEngine, setTfidfEngine] = useState<TfIdfEngine>(() => new TfIdfEngine(tickets));
  const [bm25Engine, setBm25Engine] = useState<BM25Engine>(() => new BM25Engine(tickets));
  
  const [comparison, setComparison] = useState<RetrievalComparison | null>(null);
  const [showMathDetails, setShowMathDetails] = useState(false);

  // Retrain engines when tickets change
  useEffect(() => {
    const tEngine = new TfIdfEngine(tickets);
    const bEngine = new BM25Engine(tickets);
    setTfidfEngine(tEngine);
    setBm25Engine(bEngine);
    executeSearch(query, topK, tEngine, bEngine);
  }, [tickets]);

  const executeSearch = (
    searchQuery: string, 
    k: number = topK, 
    tEngine: TfIdfEngine = tfidfEngine, 
    bEngine: BM25Engine = bm25Engine
  ) => {
    if (!searchQuery.trim() || tickets.length === 0) {
      setComparison(null);
      return;
    }

    const cleanTokens = TextPreprocessor.tokenizeAndClean(searchQuery);
    const stemmedTokens = PorterStemmer.stemTokens(cleanTokens);

    // Measure TF-IDF
    const t0 = performance.now();
    const tfidfRes = tEngine.search(searchQuery, k);
    const t1 = performance.now();

    // Measure BM25
    const b0 = performance.now();
    const bm25Res = bEngine.search(searchQuery, k);
    const b1 = performance.now();

    setComparison({
      query: searchQuery,
      queryTokens: cleanTokens,
      stemmedQueryTokens: stemmedTokens,
      tfidfResults: tfidfRes,
      bm25Results: bm25Res,
      tfidfTimeMs: Number((t1 - t0).toFixed(3)),
      bm25TimeMs: Number((b1 - b0).toFixed(3))
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query, topK);
  };

  const handleSelectQuery = (q: string) => {
    setQuery(q);
    executeSearch(q, topK);
  };

  const handleTopKChange = (k: number) => {
    setTopK(k);
    executeSearch(query, k);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-700 mb-1">
          <Search className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900">Component 4 — Information Retrieval Engine</h2>
        </div>
        <p className="text-xs text-slate-500">
          Search the support ticket corpus using two distinct genuine information retrieval approaches: <strong>TF-IDF Vector Space Model</strong> and <strong>Okapi BM25 Probabilistic Ranking</strong>.
        </p>
      </div>

      {/* Query Search Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Enter Customer Support Query
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="ir-query-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. my payment was deducted but the transaction failed..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs font-sans"
              />
            </div>

            {/* Top-K Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1 shrink-0">
              <span className="text-[11px] font-bold text-slate-500 px-2 uppercase tracking-wider">Top K:</span>
              {[3, 5, 10].map((k) => (
                <button
                  key={k}
                  type="button"
                  id={`top-k-btn-${k}`}
                  onClick={() => handleTopKChange(k)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    topK === k
                      ? 'bg-[#0F172A] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>

            <button
              id="ir-search-btn"
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Search Both Models</span>
            </button>
          </div>
        </form>

        {/* Preset Sample Queries */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Test Queries:</span>
          {SAMPLE_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectQuery(q)}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-[11px] text-slate-700 border border-slate-200 font-medium transition cursor-pointer truncate max-w-xs"
              title={q}
            >
              Query #{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Query Linguistic Token Breakdown */}
      {comparison && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-600">Processed Query Tokens:</span>
            {comparison.queryTokens.map((tok, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-white text-slate-800 font-mono border border-slate-200 shadow-2xs">
                {tok}
              </span>
            ))}
            <span className="text-slate-400 mx-1">→</span>
            <span className="font-bold text-emerald-700">Porter Stems:</span>
            {comparison.stemmedQueryTokens.map((stem, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono font-bold border border-emerald-200">
                {stem}
              </span>
            ))}
          </div>

          <button
            onClick={() => setShowMathDetails(!showMathDetails)}
            className="text-emerald-700 hover:text-emerald-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>{showMathDetails ? 'Hide' : 'Inspect'} Formula Math</span>
            {showMathDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}

      {/* Formula Math Breakdown Drawer */}
      {showMathDetails && (
        <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-4 text-xs text-slate-700 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TF-IDF Math */}
            <div className="space-y-2">
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Approach 1: TF-IDF + Cosine Similarity Formula
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-800 space-y-1">
                <div>TF(t, d) = count(t, d) / |d|</div>
                <div>IDF(t) = ln((N + 1) / (df(t) + 1)) + 1.0</div>
                <div>CosineSim(q, d) = (v_q • v_d) / (||v_q|| * ||v_d||)</div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Calculates the geometric angle between the L2-normalized sparse query vector and candidate document vectors in a {tfidfEngine.getVocabularySize()}-dimensional term space.
              </p>
            </div>

            {/* BM25 Math */}
            <div className="space-y-2">
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Approach 2: Okapi BM25 Ranking Formula
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-800 space-y-1">
                <div>IDF(q_i) = ln((N - n(q_i) + 0.5) / (n(q_i) + 0.5) + 1.0)</div>
                <div>Score(D, Q) = Σ IDF(q_i) * [ tf * (k1 + 1) ] / [ tf + k1 * (1 - b + b * (|D| / avgdl)) ]</div>
                <div className="text-emerald-700 font-semibold">k1 = 1.5 (saturation), b = 0.75 (length norm), avgdl = {bm25Engine.getAvgDocLength()}</div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Incorporates asymptotic non-linear term saturation and penalizes document length disparities relative to the corpus average document length.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Dual Model Retrieval Results */}
      {comparison && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* APPROACH 1: TF-IDF RESULTS */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Approach 1</span>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>TF-IDF + Cosine Similarity</span>
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{comparison.tfidfTimeMs} ms</span>
              </div>
            </div>

            <div className="space-y-3">
              {comparison.tfidfResults.map((res) => (
                <div 
                  key={res.ticket_id}
                  className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 hover:border-emerald-400 transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200">
                        #{res.rank}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-900">{res.ticket_id}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {res.category}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-emerald-700">
                        Score: {res.score.toFixed(4)}
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">{res.normalizedScore}% match</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 font-sans leading-relaxed">
                    {res.text}
                  </p>

                  {/* Matched Token Pills */}
                  {res.matchedTokens.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                      <span className="text-slate-400 font-bold uppercase tracking-wider">Matched Stems:</span>
                      {res.matchedTokens.map((tok, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono font-semibold border border-emerald-200">
                          {tok} ({res.termScores?.[tok] || ''})
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Visual Score Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${res.normalizedScore}%` }}
                    />
                  </div>
                </div>
              ))}

              {comparison.tfidfResults.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400">
                  No matching tickets found in dataset for this query under TF-IDF.
                </div>
              )}
            </div>
          </div>

          {/* APPROACH 2: BM25 RESULTS */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Approach 2</span>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Okapi BM25 Ranking</span>
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{comparison.bm25TimeMs} ms</span>
              </div>
            </div>

            <div className="space-y-3">
              {comparison.bm25Results.map((res) => (
                <div 
                  key={res.ticket_id}
                  className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 hover:border-emerald-400 transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200">
                        #{res.rank}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-900">{res.ticket_id}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {res.category}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-emerald-700">
                        Score: {res.score.toFixed(4)}
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">{res.normalizedScore}% match</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 font-sans leading-relaxed">
                    {res.text}
                  </p>

                  {/* Matched Token Pills */}
                  {res.matchedTokens.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                      <span className="text-slate-400 font-bold uppercase tracking-wider">Matched Stems:</span>
                      {res.matchedTokens.map((tok, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono font-semibold border border-emerald-200">
                          {tok} ({res.termScores?.[tok] || ''})
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Visual Score Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${res.normalizedScore}%` }}
                    />
                  </div>
                </div>
              ))}

              {comparison.bm25Results.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400">
                  No matching tickets found in dataset for this query under BM25.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action to proceed to Comparison */}
      {onCompareModels && (
        <div className="flex justify-end">
          <button
            id="proceed-to-model-comp-btn"
            onClick={onCompareModels}
            className="px-5 py-2.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <span>Proceed to In-Depth Model Comparison & Benchmarks</span>
            <GitCompare className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      )}
    </div>
  );
};

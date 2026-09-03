import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  Layers, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  Rocket 
} from 'lucide-react';
import { EvaluationResults, EngineeringDecision } from '../../types';
import { DecisionEngine } from '../../nlp/decisionEngine';

interface EngineeringDecisionViewProps {
  evaluation: EvaluationResults;
  onProceedToEthics?: () => void;
}

export const EngineeringDecisionView: React.FC<EngineeringDecisionViewProps> = ({
  evaluation,
  onProceedToEthics
}) => {
  const decision: EngineeringDecision = DecisionEngine.generateDecision(evaluation);

  const FUTURE_IMPROVEMENTS = [
    {
      title: 'Hybrid Dense-Sparse Retrieval',
      desc: 'Combine BM25 lexical keyword matching with Dense Vector Embeddings (Sentence-Transformers / text-embedding-004) via Reciprocal Rank Fusion (RRF).',
      tag: 'Semantic Search'
    },
    {
      title: 'Cross-Encoder Deep Re-Ranking',
      desc: 'Deploy a lightweight cross-encoder (e.g., MiniLM-L6) on the top 20 candidate tickets retrieved by BM25 to score deep query-document attention.',
      tag: 'Precision Booster'
    },
    {
      title: 'Multi-Lingual & Cross-Lingual Support',
      desc: 'Incorporate XLM-RoBERTa tokenizers and language-agnostic morphological stemmers (Snowball stemmers for Spanish, French, German, and Hindi).',
      tag: 'Global Scale'
    },
    {
      title: 'Query Expansion & Reformulation via LLMs',
      desc: 'Expand short user queries with contextual synonyms and domain abbreviations (e.g. "auth failure" → "authentication, login, 403, 401").',
      tag: 'Recall Expansion'
    }
  ];

  const DEFAULT_LIMITATIONS = [
    'Purely lexical matching lacks understanding of deep colloquial slang and novel domain abbreviations.',
    'Rule-based Porter Stemmer occasionally under-stems irregular verbs or over-stems proper nouns.',
    'Small support corpora can exhibit sparse vocabulary overlap for out-of-vocabulary technical keywords.',
    'Single-node in-memory inverted index requires distributed sharding (e.g. Lucene / OpenSearch) for 10M+ tickets.'
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-700 mb-1">
          <Award className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900">Engineering Decision & Architectural Recommendation</h2>
        </div>
        <p className="text-xs text-slate-500">
          Synthesizing quantitative benchmark metrics, algorithmic complexity, runtime efficiency, and industrial production readiness.
        </p>
      </div>

      {/* Final Verdict Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F172A] via-slate-900 to-slate-800 border border-slate-800 p-6 shadow-sm text-white space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>FINAL RECOMMENDED MODEL: {decision.recommendedModel}</span>
          </div>

          <div className="text-xs font-mono text-slate-300">
            Precision: <strong className="text-emerald-400">{(evaluation.bm25.precisionAtK * 100).toFixed(1)}%</strong> | F1: <strong className="text-emerald-400">{evaluation.bm25.f1AtK.toFixed(3)}</strong> | MRR: <strong className="text-emerald-400">{evaluation.bm25.mrr.toFixed(3)}</strong>
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white">
          Why Okapi BM25 is the Optimal Retrieval Engine for Customer Support Ticket Systems
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          {decision.summary || decision.recommendationJustification}
        </p>
      </div>

      {/* Summary Decision Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            Engineering Trade-Offs & Multi-Criteria Decision Matrix
          </h3>
          <span className="text-xs text-slate-500 font-medium">Formal Architectural Comparison</span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-52">Evaluation Criteria</th>
                <th className="py-3 px-4 text-slate-900 font-bold">TF-IDF + Cosine Similarity</th>
                <th className="py-3 px-4 text-emerald-700 font-bold">Okapi BM25 Ranking</th>
                <th className="py-3 px-3 w-32 text-right">Chosen Winner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {(decision.criteriaScores || []).map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-bold text-slate-900 font-mono">{item.criterion}</td>
                  <td className="py-3 px-4 text-slate-600 leading-relaxed">
                    Score: <span className="font-mono text-slate-900 font-bold">{typeof item.tfidfScore === 'number' ? item.tfidfScore.toFixed(3) : item.tfidfScore}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 leading-relaxed">
                    Score: <span className="font-mono text-emerald-700 font-bold">{typeof item.bm25Score === 'number' ? item.bm25Score.toFixed(3) : item.bm25Score}</span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
                      item.winner === 'BM25'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : item.winner === 'TF-IDF'
                        ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {item.winner}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trade-offs & Limitations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tradeoffs */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-amber-700 border-b border-slate-100 pb-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Engineering Trade-Offs</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-600">
            {(decision.tradeoffs || []).map((t, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Limitations */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-rose-700 border-b border-slate-100 pb-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Prototype Constraints & Limitations</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-600">
            {(decision.limitations || DEFAULT_LIMITATIONS).map((l, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span className="leading-relaxed">{l}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Academic Conclusion */}
      {decision.academicConclusion && (
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 shadow-xs">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Formal Academic Conclusion</div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {decision.academicConclusion}
          </p>
        </div>
      )}

      {/* Future Improvements Roadmap */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Rocket className="w-4 h-4 text-emerald-600" />
            Future Production Roadmap & Semantic Enhancements
          </h3>
          <span className="text-xs text-emerald-700 font-bold">Next Phase Extensions</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FUTURE_IMPROVEMENTS.map((fi, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">{fi.title}</h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800">
                  {fi.tag}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{fi.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Next Step */}
      {onProceedToEthics && (
        <div className="flex justify-end">
          <button
            id="proceed-to-ethics-btn"
            onClick={onProceedToEthics}
            className="px-5 py-2.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <span>Proceed to Ethics, Privacy & Sustainability</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      )}
    </div>
  );
};

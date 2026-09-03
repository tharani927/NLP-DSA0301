import React from 'react';
import { 
  GitCompare, 
  CheckCircle2, 
  Layers, 
  Clock, 
  Database, 
  Cpu, 
  Zap, 
  BarChart2, 
  TrendingUp, 
  Activity 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, LineChart, Line } from 'recharts';
import { EvaluationResults } from '../../types';

interface ModelComparisonViewProps {
  evaluation: EvaluationResults;
  onProceedToEvaluation?: () => void;
}

export const ModelComparisonView: React.FC<ModelComparisonViewProps> = ({
  evaluation,
  onProceedToEvaluation
}) => {
  const { tfidf, bm25, k } = evaluation;

  // Metric Comparison Chart Data
  const metricsChartData = [
    {
      metric: `Precision@${k}`,
      'TF-IDF': Number((tfidf.precisionAtK * 100).toFixed(1)),
      'BM25': Number((bm25.precisionAtK * 100).toFixed(1))
    },
    {
      metric: `Recall@${k}`,
      'TF-IDF': Number((tfidf.recallAtK * 100).toFixed(1)),
      'BM25': Number((bm25.recallAtK * 100).toFixed(1))
    },
    {
      metric: `F1-Score`,
      'TF-IDF': Number((tfidf.f1AtK * 100).toFixed(1)),
      'BM25': Number((bm25.f1AtK * 100).toFixed(1))
    },
    {
      metric: 'MRR (x100)',
      'TF-IDF': Number((tfidf.mrr * 100).toFixed(1)),
      'BM25': Number((bm25.mrr * 100).toFixed(1))
    }
  ];

  // Saturation Curve Simulation Data (TF vs Score)
  const saturationCurveData = [
    { tf: 1, 'TF-IDF Weight': 1.0, 'BM25 Weight': 1.0 },
    { tf: 2, 'TF-IDF Weight': 2.0, 'BM25 Weight': 1.5 },
    { tf: 3, 'TF-IDF Weight': 3.0, 'BM25 Weight': 1.8 },
    { tf: 5, 'TF-IDF Weight': 5.0, 'BM25 Weight': 2.1 },
    { tf: 8, 'TF-IDF Weight': 8.0, 'BM25 Weight': 2.3 },
    { tf: 12, 'TF-IDF Weight': 12.0, 'BM25 Weight': 2.45 },
    { tf: 20, 'TF-IDF Weight': 20.0, 'BM25 Weight': 2.48 }
  ];

  const ARCHITECTURAL_COMPARISON = [
    {
      dimension: 'Theoretical Foundation',
      tfidf: 'Geometric Vector Space Model (VSM) using cosine of angular distance in Euclidean term space.',
      bm25: 'Probabilistic Information Retrieval based on Robertson-Spärck Jones 2-Poisson indexing framework.',
      advantage: 'BM25 is theoretically grounded in probabilistic document relevance.'
    },
    {
      dimension: 'Term Frequency (TF) Scaling',
      tfidf: 'Linear TF scaling: Weight increases proportionally with raw occurrence count.',
      bm25: 'Non-linear asymptotic saturation: TF weight asymptotes toward (k1 + 1) * IDF, preventing term spamming.',
      advantage: 'BM25 eliminates distortion caused by excessive keyword repetition.'
    },
    {
      dimension: 'Document Length Normalization',
      tfidf: 'Global L2 Euclidean vector norm ||v||2 dividing the entire document vector.',
      bm25: 'Explicit document length tuning via parameter b (0.75) against corpus average document length (avgdl).',
      advantage: 'BM25 avoids penalizing concise tickets or over-rewarding verbose tickets.'
    },
    {
      dimension: 'Query Processing Complexity',
      tfidf: 'O(|Q| + |D_matched| * |V|), highly parallelizable sparse vector dot products.',
      bm25: 'O(|Q| + |D_matched|), fast inverted index traversal with scalar scoring.',
      advantage: 'Both achieve sub-millisecond execution on standard support ticket databases.'
    },
    {
      dimension: 'Memory / Index Footprint',
      tfidf: 'Requires storing vocabulary vectors or sparse matrices with L2 precomputed norms.',
      bm25: 'Requires standard inverted posting lists plus document length array |D| and avgdl.',
      advantage: 'BM25 uses compact scalar index postings.'
    },
    {
      dimension: 'Hyperparameter Tuning',
      tfidf: 'Non-parametric (or sublinear TF thresholding).',
      bm25: 'Parametric: k1 (typically 1.2 to 2.0) and b (typically 0.75). Tunable to domain specifics.',
      advantage: 'BM25 offers flexibility for domain calibration.'
    },
    {
      dimension: 'Industrial Scalability',
      tfidf: 'Commonly used for baseline similarity, document clustering, and deduplication.',
      bm25: 'De-facto industry standard engine powering Lucene, Elasticsearch, and Vespa search.',
      advantage: 'BM25 is the proven production search standard.'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-700 mb-1">
          <GitCompare className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900">Model Comparison — TF-IDF vs Okapi BM25</h2>
        </div>
        <p className="text-xs text-slate-500">
          Rigorous academic and algorithmic comparison across mathematical formulation, empirical performance, computational complexity, and scalability.
        </p>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Metric Comparison Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2.5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-600" />
              Retrieval Effectiveness Metrics (Scale 0-100%)
            </h3>
            <span className="text-xs text-slate-500 font-medium">Calculated from Dataset</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="metric" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a', fontSize: '12px' }}
                  formatter={(val: any) => [`${val}%`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="TF-IDF" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="BM25" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Term Saturation Curve (Linear vs BM25 Asymptotic) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2.5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Term Frequency Saturation Function Dynamics
            </h3>
            <span className="text-xs text-slate-500 font-medium">TF vs Weighted Contribution</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={saturationCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="tf" stroke="#64748b" fontSize={11} label={{ value: 'Raw Term Frequency (tf)', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#64748b' }} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="TF-IDF Weight" stroke="#4f46e5" strokeWidth={2} dot />
                <Line type="monotone" dataKey="BM25 Weight" stroke="#10b981" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Latency & Resource Footprint Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-bold">Average Latency</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-bold font-mono text-slate-900">{tfidf.avgQueryTimeMs} ms <span className="text-xs text-slate-500 font-sans font-normal">TF-IDF</span></span>
            <span className="text-slate-400">vs</span>
            <span className="text-lg font-bold font-mono text-emerald-700">{bm25.avgQueryTimeMs} ms <span className="text-xs text-slate-500 font-sans font-normal">BM25</span></span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">Sub-millisecond Real-Time Scoring</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-bold">Time Complexity</span>
          <div className="text-base font-bold font-mono text-slate-900 mt-1">O(|Q| + |D|) Query Time</div>
          <span className="text-[10px] text-slate-500">Linear with query terms & matched postings</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-bold">Space Complexity</span>
          <div className="text-base font-bold font-mono text-slate-900 mt-1">O(|V| + N) Inverted Index</div>
          <span className="text-[10px] text-slate-500">Minimal RAM footprint, zero GPU requirements</span>
        </div>
      </div>

      {/* Comprehensive Architectural Dimensions Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <Layers className="w-4 h-4 text-emerald-600" />
          Technical & Algorithmic Comparison Matrix
        </h3>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 w-44">Dimension</th>
                <th className="py-2.5 px-4 text-slate-900 font-bold">Approach 1: TF-IDF + Cosine</th>
                <th className="py-2.5 px-4 text-emerald-700 font-bold">Approach 2: Okapi BM25</th>
                <th className="py-2.5 px-4 text-slate-900 font-bold">Engineering Tradeoff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {ARCHITECTURAL_COMPARISON.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">{row.dimension}</td>
                  <td className="py-3 px-4 text-slate-600 leading-relaxed">{row.tfidf}</td>
                  <td className="py-3 px-4 text-slate-600 leading-relaxed">{row.bm25}</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold leading-relaxed">{row.advantage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Next Step */}
      {onProceedToEvaluation && (
        <div className="flex justify-end">
          <button
            id="proceed-to-eval-btn"
            onClick={onProceedToEvaluation}
            className="px-5 py-2.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <span>Proceed to Quantitative Evaluation Benchmark</span>
            <BarChart2 className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      )}
    </div>
  );
};

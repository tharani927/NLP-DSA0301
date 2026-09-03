import React from 'react';
import { Layers, ArrowRight } from 'lucide-react';

interface PipelineVisualizerProps {
  currentStage?: string;
  onSelectStage?: (stageId: string) => void;
}

export const PIPELINE_NODES = [
  { id: 'raw', name: '1. Raw Support Ticket', tab: 'preprocessing', desc: 'Unstructured customer complaint or inquiry text' },
  { id: 'cleaning', name: '2. Text Cleaning & Regex', tab: 'preprocessing', desc: 'Lowercasing, URLs, Emails, Special chars & Punctuation removal' },
  { id: 'tokenization', name: '3. Word Tokenization', tab: 'preprocessing', desc: 'Splitting into discrete lexical tokens via regex boundaries' },
  { id: 'stopwords', name: '4. Stopword Removal', tab: 'preprocessing', desc: 'Filtering high-frequency functional words (the, was, in, for)' },
  { id: 'stemming', name: '5. Morphological Stemming', tab: 'stemming', desc: 'Porter Stemmer algorithm (connecting → connect, plurals, affixes)' },
  { id: 'pos', name: '6. Part-of-Speech Tagging', tab: 'pos_tagging', desc: 'Penn Treebank grammatical roles (NOUN, VERB, ADJ, PRON)' },
  { id: 'ir_index', name: '7. IR Dual Indexing', tab: 'retrieval', desc: 'Dual index construction for historical ticket corpus' },
  { id: 'tfidf', name: '8. TF-IDF + Cosine Sim', tab: 'retrieval', desc: 'L2-normalized vector space model with angular scoring' },
  { id: 'bm25', name: '9. Okapi BM25 Ranking', tab: 'retrieval', desc: 'Non-linear term saturation (k1=1.5) & length normalization (b=0.75)' },
  { id: 'evaluation', name: '10. Quantitative Evaluation', tab: 'evaluation', desc: 'Empirical Precision@K, Recall@K, F1@K, MRR computation' },
  { id: 'decision', name: '11. Engineering Decision', tab: 'decision', desc: 'Multi-criteria automated recommendation & tradeoffs' }
];

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  currentStage,
  onSelectStage
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-[#0F172A]">
          <Layers className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-bold tracking-tight">
            End-to-End NLP Processing Architecture Pipeline
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">Click any stage to inspect live module</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {PIPELINE_NODES.map((node, index) => {
          const isCurrent = currentStage === node.tab || currentStage === node.id;
          return (
            <div key={node.id} className="relative group">
              <button
                onClick={() => onSelectStage && onSelectStage(node.tab)}
                className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-50 border-emerald-300 shadow-xs'
                    : 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isCurrent ? 'text-emerald-700' : 'text-slate-400'}`}>
                    Stage {index + 1}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                </div>
                <div className={`text-xs font-bold mb-1 truncate ${isCurrent ? 'text-emerald-900' : 'text-slate-800'}`}>
                  {node.name}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {node.desc}
                </p>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

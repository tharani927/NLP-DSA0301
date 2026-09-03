import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, ListOrdered, X } from 'lucide-react';

export interface DemoStep {
  stepNumber: number;
  title: string;
  tabTarget: string;
  tab: string;
  description: string;
}

export const DEMO_STEPS: DemoStep[] = [
  { stepNumber: 1, title: 'Open Application', tabTarget: 'home', tab: 'home', description: 'Introduce the Intelligent Customer Support Ticket Understanding and Retrieval System.' },
  { stepNumber: 2, title: 'Problem & Objectives', tabTarget: 'home', tab: 'home', description: 'Review high ticket volumes, manual bottlenecks, and end-to-end NLP objectives.' },
  { stepNumber: 3, title: 'Upload CSV Dataset', tabTarget: 'dataset', tab: 'dataset', description: 'Demonstrate CSV loading, validation, and parsing of support tickets.' },
  { stepNumber: 4, title: 'Dataset Statistics', tabTarget: 'dataset', tab: 'dataset', description: 'Show total records, category distributions, and text length metrics.' },
  { stepNumber: 5, title: 'Enter Support Query', tabTarget: 'preprocessing', tab: 'preprocessing', description: 'Supply realistic customer queries (e.g. payment deducted but failed).' },
  { stepNumber: 6, title: 'Text Preprocessing Pipeline', tabTarget: 'preprocessing', tab: 'preprocessing', description: 'Demonstrate lowercasing, regex cleaning (URLs, emails, punctuation), whitespace, and stop-word filtering.' },
  { stepNumber: 7, title: 'Morphology & Stemming', tabTarget: 'stemming', tab: 'stemming', description: 'Execute Porter Stemming on tokens (e.g. connecting → connect) with rule tracing.' },
  { stepNumber: 8, title: 'Part-of-Speech Tagging', tabTarget: 'pos_tagging', tab: 'pos_tagging', description: 'Tag words with Penn Treebank syntactic roles (NOUN, VERB, ADJ, etc.) in a structured table.' },
  { stepNumber: 9, title: 'TF-IDF Retrieval', tabTarget: 'retrieval', tab: 'retrieval', description: 'Run Term Frequency - Inverse Document Frequency with Cosine Similarity vector ranking.' },
  { stepNumber: 10, title: 'BM25 Retrieval', tabTarget: 'retrieval', tab: 'retrieval', description: 'Run Okapi BM25 ranking with non-linear saturation and length normalization.' },
  { stepNumber: 11, title: 'Compare Retrieved Results', tabTarget: 'comparison', tab: 'comparison', description: 'Compare top-k rankings, scores, matched tokens, and retrieval dynamics.' },
  { stepNumber: 12, title: 'Quantitative Evaluation', tabTarget: 'evaluation', tab: 'evaluation', description: 'Compute Precision@K, Recall@K, F1@K, and Mean Reciprocal Rank (MRR) from dataset.' },
  { stepNumber: 13, title: 'Evaluation Graphs', tabTarget: 'evaluation', tab: 'evaluation', description: 'Inspect empirical comparison charts across precision, recall, F1, and latency.' },
  { stepNumber: 14, title: 'Error & Failure Analysis', tabTarget: 'error_analysis', tab: 'error_analysis', description: 'Analyze real failure cases: vocabulary mismatch, short query sparsity, and model divergences.' },
  { stepNumber: 15, title: 'Final Engineering Decision', tabTarget: 'decision', tab: 'decision', description: 'Review automated recommendation engine verdict based on empirical benchmark results.' },
  { stepNumber: 16, title: 'Ethics & Sustainability', tabTarget: 'ethics', tab: 'ethics', description: 'Address PII protection/scanner, dataset bias, responsible AI, and green NLP computational footprint.' },
  { stepNumber: 17, title: 'Team Contributions', tabTarget: 'team', tab: 'team', description: 'Present individual contributions of Tharani, Lalitha, Tejasri, and Anusha.' }
];

interface DemoFlowBarProps {
  currentStepIndex: number;
  setCurrentStepIndex: (idx: number) => void;
  setActiveTab: (tab: string) => void;
  onClose: () => void;
}

export const DemoFlowBar: React.FC<DemoFlowBarProps> = ({
  currentStepIndex,
  setCurrentStepIndex,
  setActiveTab,
  onClose
}) => {
  const currentStep = DEMO_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setActiveTab(DEMO_STEPS[nextIdx].tabTarget);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      setActiveTab(DEMO_STEPS[prevIdx].tabTarget);
    }
  };

  const handleSelectStep = (idx: number) => {
    setCurrentStepIndex(idx);
    setActiveTab(DEMO_STEPS[idx].tabTarget);
  };

  return (
    <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Step Info */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm shrink-0">
            {currentStep.stepNumber}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                Faculty Demonstration Flow • Step {currentStep.stepNumber} of 17
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-slate-900 truncate">
                {currentStep.title}
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate max-w-xl">
              {currentStep.description}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          {/* Quick Step Selector */}
          <select
            id="demo-step-dropdown"
            value={currentStepIndex}
            onChange={(e) => handleSelectStep(Number(e.target.value))}
            className="bg-white border border-slate-200 text-xs text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
          >
            {DEMO_STEPS.map((s, idx) => (
              <option key={s.stepNumber} value={idx}>
                Step {s.stepNumber}: {s.title}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5">
            <button
              id="demo-prev-button"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-xs font-medium text-slate-700 border border-slate-200 flex items-center gap-1 transition cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              id="demo-next-button"
              onClick={handleNext}
              disabled={currentStepIndex === DEMO_STEPS.length - 1}
              className="px-3 py-1.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 disabled:opacity-40 text-xs font-bold text-white flex items-center gap-1 transition shadow-xs cursor-pointer"
            >
              <span>Next Step</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              id="demo-close-button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition ml-1 cursor-pointer"
              title="Close Demonstration Bar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

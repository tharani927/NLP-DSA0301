import React, { useState } from 'react';
import { 
  Tag, 
  Sparkles, 
  Search, 
  HelpCircle, 
  Layers, 
  CheckCircle2, 
  BarChart2,
  BookOpen
} from 'lucide-react';
import { PosTagger } from '../../nlp/posTagger';
import { PosTaggedToken, PosCategory } from '../../types';

interface PosTaggingViewProps {
  initialSentence?: string;
  onProceedToRetrieval?: () => void;
}

const SAMPLE_SENTENCES = [
  'A customer requested an immediate refund for a declined card transaction.',
  'My payment was deducted from my account but the checkout failed.',
  'I forgot my account password and cannot login to the corporate dashboard.',
  'Courier marked the package as delivered, but I never received the parcel.'
];

const CATEGORY_BADGE_STYLES: { [key in PosCategory]: string } = {
  NOUN: 'bg-blue-50 text-blue-800 border-blue-200',
  VERB: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  ADJECTIVE: 'bg-amber-50 text-amber-800 border-amber-200',
  ADVERB: 'bg-purple-50 text-purple-800 border-purple-200',
  PRONOUN: 'bg-pink-50 text-pink-800 border-pink-200',
  DETERMINER: 'bg-sky-50 text-sky-800 border-sky-200',
  PREPOSITION: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  CONJUNCTION: 'bg-teal-50 text-teal-800 border-teal-200',
  NUMBER: 'bg-orange-50 text-orange-800 border-orange-200',
  PUNCTUATION: 'bg-slate-100 text-slate-600 border-slate-200',
  OTHER: 'bg-slate-100 text-slate-700 border-slate-200'
};

const PENN_TREEBANK_GLOSSARY = [
  { tag: 'NN / NNS', role: 'Noun (Singular / Plural)', example: 'customer, payment, refunds' },
  { tag: 'VB / VBD / VBN', role: 'Verb (Base / Past / Participle)', example: 'refund, deducted, cancelled' },
  { tag: 'JJ / JJR / JJS', role: 'Adjective (General / Comparative)', example: 'immediate, slow, damaged' },
  { tag: 'RB / WRB', role: 'Adverb (Modifier / Wh-adverb)', example: 'immediately, twice, where' },
  { tag: 'PRP / PRP$', role: 'Pronoun (Personal / Possessive)', example: 'I, my, your, they' },
  { tag: 'DT', role: 'Determiner / Article', example: 'the, a, this, every' },
  { tag: 'IN / TO', role: 'Preposition / Subordinator', example: 'in, from, for, to' },
  { tag: 'MD', role: 'Modal Auxiliary Verb', example: 'can, cannot, should, will' }
];

export const PosTaggingView: React.FC<PosTaggingViewProps> = ({
  initialSentence = SAMPLE_SENTENCES[0],
  onProceedToRetrieval
}) => {
  const [inputText, setInputText] = useState(initialSentence);
  const [taggedTokens, setTaggedTokens] = useState<PosTaggedToken[]>(() => {
    return PosTagger.tagSentence(initialSentence);
  });

  const handleTagText = () => {
    if (!inputText.trim()) return;
    setTaggedTokens(PosTagger.tagSentence(inputText));
  };

  const handleSelectPreset = (sentence: string) => {
    setInputText(sentence);
    setTaggedTokens(PosTagger.tagSentence(sentence));
  };

  // Category counts
  const categoryCounts: { [key: string]: number } = {};
  taggedTokens.forEach(t => {
    categoryCounts[t.universalCategory] = (categoryCounts[t.universalCategory] || 0) + 1;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-700 mb-1">
          <Tag className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900">Component 3 — Part-of-Speech (POS) Tagging</h2>
        </div>
        <p className="text-xs text-slate-500">
          Syntactic analysis assigning Penn Treebank and Universal grammatical tags to each word using lexicon lookup, morphological affixes, and contextual rules.
        </p>
      </div>

      {/* Input Form & Presets */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Enter Support Ticket Sentence to POS Tag
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="pos-sentence-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. A customer requested an immediate refund..."
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs font-sans"
            />
            <button
              id="tag-pos-btn"
              onClick={handleTagText}
              className="px-5 py-2.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
            >
              Tag Sentence
            </button>
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Presets:</span>
          {SAMPLE_SENTENCES.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSelectPreset(s)}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-[11px] text-slate-700 border border-slate-200 font-medium transition cursor-pointer truncate max-w-xs"
              title={s}
            >
              Example #{i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Sentence View with Tag Chips */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
          Visual Sentence Syntax Breakdown
        </h3>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-2.5 leading-relaxed">
          {taggedTokens.map((t, idx) => (
            <div 
              key={idx} 
              className="inline-flex flex-col items-center p-2 rounded-lg bg-white border border-slate-200 text-center shadow-xs"
            >
              <span className="text-xs font-bold text-slate-900 font-sans">{t.word}</span>
              <span className={`mt-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-tight border ${CATEGORY_BADGE_STYLES[t.universalCategory] || 'bg-slate-100 text-slate-700'}`}>
                {t.tag} ({t.universalCategory})
              </span>
            </div>
          ))}
        </div>

        {/* Category Count Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {Object.entries(categoryCounts).map(([cat, count]) => (
            <span 
              key={cat}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${CATEGORY_BADGE_STYLES[cat as PosCategory] || 'bg-slate-100 text-slate-700'}`}
            >
              {cat}: {count}
            </span>
          ))}
        </div>
      </div>

      {/* Detailed POS Tag Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            POS Tagging Results Table
          </h3>
          <span className="text-xs text-slate-500 font-medium">{taggedTokens.length} Tokens Analyzed</span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">#</th>
                <th className="py-2.5 px-4 w-40">Word / Token</th>
                <th className="py-2.5 px-4 w-32">Universal Category</th>
                <th className="py-2.5 px-4 w-28">Penn Tag</th>
                <th className="py-2.5 px-4">Grammatical Description</th>
                <th className="py-2.5 px-3 w-24 text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {taggedTokens.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="py-2 px-3 text-center text-slate-400 font-sans">{idx + 1}</td>
                  <td className="py-2 px-4 text-slate-900 font-bold font-sans">{t.word}</td>
                  <td className="py-2 px-4 font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${CATEGORY_BADGE_STYLES[t.universalCategory]}`}>
                      {t.universalCategory}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <span className="px-2 py-0.5 rounded text-slate-800 bg-slate-100 border border-slate-200 font-bold">
                      {t.tag}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-slate-600 font-sans text-xs">
                    {t.description}
                  </td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-bold font-sans">
                    {t.confidence ? `${(t.confidence * 100).toFixed(0)}%` : '90%'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Common Penn Treebank Tags Glossary */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-2">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider">
            Common Penn Treebank POS Tags Reference Guide
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PENN_TREEBANK_GLOSSARY.map((g, i) => (
            <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs space-y-1">
              <div className="font-mono font-bold text-emerald-800">{g.tag}</div>
              <div className="text-slate-800 font-semibold">{g.role}</div>
              <div className="text-[11px] text-slate-500 italic">e.g. {g.example}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Step */}
      {onProceedToRetrieval && (
        <div className="flex justify-end">
          <button
            id="proceed-to-ir-btn"
            onClick={onProceedToRetrieval}
            className="px-5 py-2.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <span>Proceed to Information Retrieval (TF-IDF vs BM25)</span>
            <Search className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      )}
    </div>
  );
};

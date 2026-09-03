export interface SupportTicket {
  ticket_id: string;
  text: string;
  category: string;
  cleanText?: string;
  tokens?: string[];
  stemmedTokens?: string[];
  posTags?: PosTaggedToken[];
}

export interface PreprocessingStep {
  stepName: string;
  description: string;
  regexPattern?: string;
  output: string | string[];
}

export interface PreprocessingResult {
  originalText: string;
  cleanedText: string;
  tokens: string[];
  stopwordsRemoved: string[];
  removedStopwords: string[];
  stemmedTokens: string[];
  finalProcessedText: string;
  steps: PreprocessingStep[];
}

export interface StemmingResult {
  original: string;
  stemmed: string;
  ruleApplied: string;
  step: string;
}

export type PosCategory = 'NOUN' | 'VERB' | 'ADJECTIVE' | 'ADVERB' | 'PRONOUN' | 'PREPOSITION' | 'CONJUNCTION' | 'DETERMINER' | 'NUMBER' | 'PUNCTUATION' | 'OTHER';

export interface PosTaggedToken {
  word: string;
  tag: string;
  universalCategory: PosCategory;
  description: string;
  confidence?: number;
}

export interface RetrievalResult {
  rank: number;
  ticket_id: string;
  text: string;
  category: string;
  score: number;
  normalizedScore: number;
  matchedTokens: string[];
  termScores?: { [term: string]: number };
}

export interface RetrievalComparison {
  query: string;
  queryTokens: string[];
  stemmedQueryTokens: string[];
  tfidfResults: RetrievalResult[];
  bm25Results: RetrievalResult[];
  tfidfTimeMs: number;
  bm25TimeMs: number;
}

export interface MetricSet {
  precisionAtK: number;
  recallAtK: number;
  f1AtK: number;
  mrr: number;
  avgQueryTimeMs: number;
  k: number;
}

export interface EvaluationResults {
  k: number;
  tfidf: MetricSet;
  bm25: MetricSet;
  evaluatedQueriesCount: number;
  totalDatasetSize: number;
  categoryPerformance: {
    category: string;
    tfidfPrecision: number;
    bm25Precision: number;
    sampleCount: number;
  }[];
}

export type ErrorType = 
  | 'FALSE_NEGATIVE'
  | 'FALSE_POSITIVE'
  | 'VOCABULARY_MISMATCH'
  | 'SHORT_QUERY_SPARSITY'
  | 'TFIDF_SUPERIOR'
  | 'BM25_SUPERIOR'
  | 'AMBIGUOUS_QUERY';

export interface ErrorCase {
  id: string;
  query: string;
  expectedCategory: string;
  retrievedCategory?: string;
  errorCategory?: string;
  rootCause?: string;
  mitigation?: string;
  tfidfTopResult?: { id: string; text: string; category: string; score: number };
  bm25TopResult?: { id: string; text: string; category: string; score: number };
  errorType?: ErrorType;
  cause?: string;
  nlpExplanation?: string;
}

export interface EngineeringDecision {
  recommendedModel: 'BM25' | 'TF-IDF';
  recommendationTitle: string;
  confidenceScore: number;
  summary: string;
  recommendationJustification?: string;
  criteriaMatrix?: {
    criteria: string;
    tfidf: string;
    bm25: string;
    chosen: string;
  }[];
  criteriaScores: {
    criterion: string;
    tfidfScore: number;
    bm25Score: number;
    winner: 'TF-IDF' | 'BM25' | 'TIE';
    rationale: string;
  }[];
  tradeoffs: string[];
  limitations?: string[];
  academicConclusion: string;
}

export interface DatasetStats {
  totalRecords: number;
  categories: { [key: string]: number };
  avgTextLengthChars: number;
  avgTokenCount: number;
  trainCount: number;
  testCount: number;
  vocabularySize: number;
  duplicatesRemoved: number;
  emptyRowsRemoved: number;
}

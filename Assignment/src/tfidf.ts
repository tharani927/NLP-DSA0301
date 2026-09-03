import { SupportTicket, RetrievalResult } from '../types';
import { TextPreprocessor } from './preprocessing';
import { PorterStemmer } from './porterStemmer';

/**
 * TF-IDF (Term Frequency - Inverse Document Frequency) Model
 * with Cosine Similarity Ranking Engine.
 */
export class TfIdfEngine {
  private tickets: SupportTicket[] = [];
  private vocabulary: string[] = [];
  private vocabIndexMap: Map<string, number> = new Map();
  private docTermFrequencies: Map<string, number>[] = [];
  private docLengths: number[] = [];
  private docVectors: number[][] = [];
  private docNorms: number[] = [];
  private idfMap: Map<string, number> = new Map();
  private documentFrequencyMap: Map<string, number> = new Map();
  private numDocs: number = 0;

  constructor(tickets: SupportTicket[]) {
    this.train(tickets);
  }

  /**
   * Builds the inverted index, calculates IDF for all terms, and precomputes L2-normalized document vectors.
   */
  public train(tickets: SupportTicket[]): void {
    this.tickets = tickets;
    this.numDocs = tickets.length;
    this.vocabulary = [];
    this.vocabIndexMap.clear();
    this.docTermFrequencies = [];
    this.docLengths = [];
    this.docVectors = [];
    this.docNorms = [];
    this.idfMap.clear();
    this.documentFrequencyMap.clear();

    if (this.numDocs === 0) return;

    // Step 1: Tokenize, stem, and compute Term Frequencies for each document
    const docTokenLists: string[][] = [];

    for (const ticket of tickets) {
      const cleanTokens = TextPreprocessor.tokenizeAndClean(ticket.text);
      const stemmed = PorterStemmer.stemTokens(cleanTokens);
      docTokenLists.push(stemmed);

      const tfMap = new Map<string, number>();
      for (const token of stemmed) {
        tfMap.set(token, (tfMap.get(token) || 0) + 1);
      }
      this.docTermFrequencies.push(tfMap);
      this.docLengths.push(stemmed.length);

      // Track unique terms for Document Frequency (DF)
      for (const term of tfMap.keys()) {
        this.documentFrequencyMap.set(
          term,
          (this.documentFrequencyMap.get(term) || 0) + 1
        );
      }
    }

    // Step 2: Build vocabulary
    const vocabSet = Array.from(this.documentFrequencyMap.keys());
    vocabSet.sort();
    this.vocabulary = vocabSet;
    this.vocabulary.forEach((term, idx) => {
      this.vocabIndexMap.set(term, idx);
    });

    // Step 3: Compute Smooth IDF: ln((N + 1) / (df + 1)) + 1
    for (const term of this.vocabulary) {
      const df = this.documentFrequencyMap.get(term) || 0;
      const idf = Math.log((this.numDocs + 1) / (df + 1)) + 1.0;
      this.idfMap.set(term, idf);
    }

    // Step 4: Precompute L2-normalized TF-IDF vectors for all documents
    for (let i = 0; i < this.numDocs; i++) {
      const tfMap = this.docTermFrequencies[i];
      const docLen = Math.max(1, this.docLengths[i]);
      const vec: number[] = new Array(this.vocabulary.length).fill(0);
      let sumSquares = 0;

      for (const [term, count] of tfMap.entries()) {
        const vocabIdx = this.vocabIndexMap.get(term);
        if (vocabIdx !== undefined) {
          // Normalized Term Frequency * IDF
          const tf = count / docLen;
          const idf = this.idfMap.get(term) || 0;
          const tfidf = tf * idf;
          vec[vocabIdx] = tfidf;
          sumSquares += tfidf * tfidf;
        }
      }

      const norm = Math.sqrt(sumSquares);
      this.docVectors.push(vec);
      this.docNorms.push(norm > 0 ? norm : 1.0);
    }
  }

  /**
   * Searches documents by calculating Cosine Similarity between Query Vector and Document Vectors.
   */
  public search(query: string, topK: number = 5): RetrievalResult[] {
    if (!query || query.trim().length === 0 || this.numDocs === 0) {
      return [];
    }

    const startTime = performance.now();
    const queryCleanTokens = TextPreprocessor.tokenizeAndClean(query);
    const queryStemmed = PorterStemmer.stemTokens(queryCleanTokens);

    if (queryStemmed.length === 0) {
      return [];
    }

    // Compute Query TF
    const queryTfMap = new Map<string, number>();
    for (const tok of queryStemmed) {
      queryTfMap.set(tok, (queryTfMap.get(tok) || 0) + 1);
    }

    // Compute Query TF-IDF vector & norm
    const queryVec: number[] = new Array(this.vocabulary.length).fill(0);
    let querySumSquares = 0;
    const qLen = Math.max(1, queryStemmed.length);

    for (const [term, count] of queryTfMap.entries()) {
      const vocabIdx = this.vocabIndexMap.get(term);
      if (vocabIdx !== undefined) {
        const tf = count / qLen;
        const idf = this.idfMap.get(term) || 0;
        const tfidf = tf * idf;
        queryVec[vocabIdx] = tfidf;
        querySumSquares += tfidf * tfidf;
      }
    }

    const queryNorm = Math.sqrt(querySumSquares);
    if (queryNorm === 0) {
      // Query terms not found in vocabulary
      return [];
    }

    // Compute Cosine Similarity against each document
    const scoredDocs: { index: number; score: number; matchedTokens: string[]; termScores: { [t: string]: number } }[] = [];

    for (let d = 0; d < this.numDocs; d++) {
      let dotProduct = 0;
      const matchedTokens: string[] = [];
      const termScores: { [t: string]: number } = {};

      const docTfMap = this.docTermFrequencies[d];

      for (const [qTerm] of queryTfMap.entries()) {
        if (docTfMap.has(qTerm)) {
          const vocabIdx = this.vocabIndexMap.get(qTerm);
          if (vocabIdx !== undefined) {
            const termContrib = queryVec[vocabIdx] * this.docVectors[d][vocabIdx];
            dotProduct += termContrib;
            matchedTokens.push(qTerm);
            termScores[qTerm] = Number((termContrib / (queryNorm * this.docNorms[d])).toFixed(4));
          }
        }
      }

      const cosineSim = dotProduct / (queryNorm * this.docNorms[d]);

      if (cosineSim > 0.0001) {
        scoredDocs.push({
          index: d,
          score: cosineSim,
          matchedTokens,
          termScores
        });
      }
    }

    // Sort in descending order of Cosine Similarity
    scoredDocs.sort((a, b) => b.score - a.score);

    const results: RetrievalResult[] = scoredDocs.slice(0, topK).map((item, idx) => {
      const ticket = this.tickets[item.index];
      return {
        rank: idx + 1,
        ticket_id: ticket.ticket_id,
        text: ticket.text,
        category: ticket.category,
        score: Number(item.score.toFixed(4)),
        normalizedScore: Math.min(100, Math.round(item.score * 100)),
        matchedTokens: item.matchedTokens,
        termScores: item.termScores
      };
    });

    return results;
  }

  public getVocabularySize(): number {
    return this.vocabulary.length;
  }

  public getTermIdf(term: string): number {
    return this.idfMap.get(term) || 0;
  }
}

import { SupportTicket, RetrievalResult } from '../types';
import { TextPreprocessor } from './preprocessing';
import { PorterStemmer } from './porterStemmer';

/**
 * Okapi BM25 (Best Matching 25) Information Retrieval Model
 * Non-linear term-frequency saturation with document-length normalization.
 */
export class BM25Engine {
  private tickets: SupportTicket[] = [];
  private docTermFrequencies: Map<string, number>[] = [];
  private docLengths: number[] = [];
  private documentFrequencyMap: Map<string, number> = new Map();
  private idfMap: Map<string, number> = new Map();
  private avgDocLength: number = 0;
  private numDocs: number = 0;

  // Hyperparameters (Standard Okapi parameters)
  private k1: number = 1.5; // Term frequency saturation parameter
  private b: number = 0.75; // Document length normalization weight

  constructor(tickets: SupportTicket[], k1: number = 1.5, b: number = 0.75) {
    this.k1 = k1;
    this.b = b;
    this.train(tickets);
  }

  /**
   * Builds BM25 indexes, computes average document length, and calculates Robertson-Spärck Jones IDF.
   */
  public train(tickets: SupportTicket[]): void {
    this.tickets = tickets;
    this.numDocs = tickets.length;
    this.docTermFrequencies = [];
    this.docLengths = [];
    this.documentFrequencyMap.clear();
    this.idfMap.clear();

    if (this.numDocs === 0) {
      this.avgDocLength = 0;
      return;
    }

    let totalDocLengths = 0;

    // Step 1: Tokenize, stem, and index frequencies
    for (const ticket of tickets) {
      const cleanTokens = TextPreprocessor.tokenizeAndClean(ticket.text);
      const stemmed = PorterStemmer.stemTokens(cleanTokens);

      const tfMap = new Map<string, number>();
      for (const token of stemmed) {
        tfMap.set(token, (tfMap.get(token) || 0) + 1);
      }
      this.docTermFrequencies.push(tfMap);
      this.docLengths.push(stemmed.length);
      totalDocLengths += stemmed.length;

      for (const term of tfMap.keys()) {
        this.documentFrequencyMap.set(
          term,
          (this.documentFrequencyMap.get(term) || 0) + 1
        );
      }
    }

    this.avgDocLength = totalDocLengths / this.numDocs;

    // Step 2: Compute Okapi BM25 Robertson-Spärck Jones IDF
    // IDF(q) = ln( (N - n(q) + 0.5) / (n(q) + 0.5) + 1 )
    for (const [term, df] of this.documentFrequencyMap.entries()) {
      const idf = Math.log(((this.numDocs - df + 0.5) / (df + 0.5)) + 1.0);
      this.idfMap.set(term, Math.max(0.01, idf)); // ensure non-negative weight
    }
  }

  /**
   * Searches documents and scores them using the BM25 formula.
   */
  public search(query: string, topK: number = 5): RetrievalResult[] {
    if (!query || query.trim().length === 0 || this.numDocs === 0) {
      return [];
    }

    const queryCleanTokens = TextPreprocessor.tokenizeAndClean(query);
    const queryStemmed = PorterStemmer.stemTokens(queryCleanTokens);

    if (queryStemmed.length === 0) {
      return [];
    }

    // Unique query terms and their frequencies in the query
    const queryTermCounts = new Map<string, number>();
    for (const tok of queryStemmed) {
      queryTermCounts.set(tok, (queryTermCounts.get(tok) || 0) + 1);
    }

    const scoredDocs: { index: number; rawScore: number; matchedTokens: string[]; termScores: { [t: string]: number } }[] = [];

    // Calculate BM25 score for each document
    for (let d = 0; d < this.numDocs; d++) {
      const docTf = this.docTermFrequencies[d];
      const docLen = this.docLengths[d];
      let totalBm25Score = 0;
      const matchedTokens: string[] = [];
      const termScores: { [t: string]: number } = {};

      for (const [qTerm] of queryTermCounts.entries()) {
        const tf = docTf.get(qTerm) || 0;
        if (tf > 0) {
          const idf = this.idfMap.get(qTerm) || 0;

          // BM25 term weight calculation:
          // numerator = tf * (k1 + 1)
          // denominator = tf + k1 * (1 - b + b * (docLen / avgDocLength))
          const lenNorm = 1.0 - this.b + this.b * (docLen / (this.avgDocLength || 1.0));
          const termScore = idf * ((tf * (this.k1 + 1.0)) / (tf + this.k1 * lenNorm));

          totalBm25Score += termScore;
          matchedTokens.push(qTerm);
          termScores[qTerm] = Number(termScore.toFixed(4));
        }
      }

      if (totalBm25Score > 0.0001) {
        scoredDocs.push({
          index: d,
          rawScore: totalBm25Score,
          matchedTokens,
          termScores
        });
      }
    }

    // Sort descending by raw BM25 score
    scoredDocs.sort((a, b) => b.rawScore - a.rawScore);

    // Max score for relative normalization (0 to 100)
    const maxScore = scoredDocs.length > 0 ? scoredDocs[0].rawScore : 1.0;

    const results: RetrievalResult[] = scoredDocs.slice(0, topK).map((item, idx) => {
      const ticket = this.tickets[item.index];
      const normalizedScore = Math.min(100, Math.round((item.rawScore / maxScore) * 100));

      return {
        rank: idx + 1,
        ticket_id: ticket.ticket_id,
        text: ticket.text,
        category: ticket.category,
        score: Number(item.rawScore.toFixed(4)),
        normalizedScore,
        matchedTokens: item.matchedTokens,
        termScores: item.termScores
      };
    });

    return results;
  }

  public getAvgDocLength(): number {
    return Number(this.avgDocLength.toFixed(2));
  }

  public getHyperparameters() {
    return { k1: this.k1, b: this.b };
  }
}

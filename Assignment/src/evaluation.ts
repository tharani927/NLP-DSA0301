import { SupportTicket, EvaluationResults, MetricSet, DatasetStats } from '../types';
import { TfIdfEngine } from './tfidf';
import { BM25Engine } from './bm25';

/**
 * Quantitative Evaluation Engine for Information Retrieval
 * Computes Precision@K, Recall@K, F1@K, and Mean Reciprocal Rank (MRR)
 * using ground-truth category relevance from the actual loaded dataset.
 */
export class IrEvaluator {
  public static evaluate(
    tickets: SupportTicket[],
    k: number = 5
  ): EvaluationResults {
    if (!tickets || tickets.length < 3) {
      return this.getEmptyEvaluation(k, tickets ? tickets.length : 0);
    }

    const tfidfEngine = new TfIdfEngine(tickets);
    const bm25Engine = new BM25Engine(tickets);

    // Group tickets by category to determine total relevant items per category
    const categoryCountMap = new Map<string, number>();
    for (const t of tickets) {
      categoryCountMap.set(t.category, (categoryCountMap.get(t.category) || 0) + 1);
    }

    let tfidfPrecSum = 0;
    let tfidfRecallSum = 0;
    let tfidfMrrSum = 0;
    let tfidfTimeSum = 0;

    let bm25PrecSum = 0;
    let bm25RecallSum = 0;
    let bm25MrrSum = 0;
    let bm25TimeSum = 0;

    const categoryStats = new Map<
      string,
      { count: number; tfidfPrecSum: number; bm25PrecSum: number }
    >();

    for (const cat of categoryCountMap.keys()) {
      categoryStats.set(cat, { count: 0, tfidfPrecSum: 0, bm25PrecSum: 0 });
    }

    const evaluatedTickets = tickets.filter(t => t.text && t.text.trim().length > 5);
    const N = evaluatedTickets.length;

    if (N === 0) {
      return this.getEmptyEvaluation(k, tickets.length);
    }

    for (const testTicket of evaluatedTickets) {
      const targetCategory = testTicket.category;
      const totalRelevantInCategory = Math.max(1, (categoryCountMap.get(targetCategory) || 1) - 1); // exclude self

      // 1. Evaluate TF-IDF
      const t0 = performance.now();
      const tfidfResults = tfidfEngine.search(testTicket.text, k + 1);
      const t1 = performance.now();
      tfidfTimeSum += (t1 - t0);

      // Filter out identical self-ticket if retrieved at rank 1
      const filteredTfidf = tfidfResults
        .filter(r => r.ticket_id !== testTicket.ticket_id)
        .slice(0, k);

      let tfidfRelRetrieved = 0;
      let tfidfFirstRelRank = 0;

      filteredTfidf.forEach((res, idx) => {
        if (res.category.toLowerCase() === targetCategory.toLowerCase()) {
          tfidfRelRetrieved++;
          if (tfidfFirstRelRank === 0) {
            tfidfFirstRelRank = idx + 1;
          }
        }
      });

      const tfidfP = filteredTfidf.length > 0 ? tfidfRelRetrieved / k : 0;
      const tfidfR = totalRelevantInCategory > 0 ? Math.min(1.0, tfidfRelRetrieved / totalRelevantInCategory) : 0;
      const tfidfRR = tfidfFirstRelRank > 0 ? 1.0 / tfidfFirstRelRank : 0;

      tfidfPrecSum += tfidfP;
      tfidfRecallSum += tfidfR;
      tfidfMrrSum += tfidfRR;

      // 2. Evaluate BM25
      const b0 = performance.now();
      const bm25Results = bm25Engine.search(testTicket.text, k + 1);
      const b1 = performance.now();
      bm25TimeSum += (b1 - b0);

      const filteredBm25 = bm25Results
        .filter(r => r.ticket_id !== testTicket.ticket_id)
        .slice(0, k);

      let bm25RelRetrieved = 0;
      let bm25FirstRelRank = 0;

      filteredBm25.forEach((res, idx) => {
        if (res.category.toLowerCase() === targetCategory.toLowerCase()) {
          bm25RelRetrieved++;
          if (bm25FirstRelRank === 0) {
            bm25FirstRelRank = idx + 1;
          }
        }
      });

      const bm25P = filteredBm25.length > 0 ? bm25RelRetrieved / k : 0;
      const bm25R = totalRelevantInCategory > 0 ? Math.min(1.0, bm25RelRetrieved / totalRelevantInCategory) : 0;
      const bm25RR = bm25FirstRelRank > 0 ? 1.0 / bm25FirstRelRank : 0;

      bm25PrecSum += bm25P;
      bm25RecallSum += bm25R;
      bm25MrrSum += bm25RR;

      // Update Category Stats
      const cStat = categoryStats.get(targetCategory);
      if (cStat) {
        cStat.count++;
        cStat.tfidfPrecSum += tfidfP;
        cStat.bm25PrecSum += bm25P;
      }
    }

    const avgTfidfP = tfidfPrecSum / N;
    const avgTfidfR = tfidfRecallSum / N;
    const avgTfidfF1 = (avgTfidfP + avgTfidfR) > 0 ? (2 * avgTfidfP * avgTfidfR) / (avgTfidfP + avgTfidfR) : 0;
    const avgTfidfMrr = tfidfMrrSum / N;

    const avgBm25P = bm25PrecSum / N;
    const avgBm25R = bm25RecallSum / N;
    const avgBm25F1 = (avgBm25P + avgBm25R) > 0 ? (2 * avgBm25P * avgBm25R) / (avgBm25P + avgBm25R) : 0;
    const avgBm25Mrr = bm25MrrSum / N;

    const tfidfMetrics: MetricSet = {
      precisionAtK: Number(avgTfidfP.toFixed(4)),
      recallAtK: Number(avgTfidfR.toFixed(4)),
      f1AtK: Number(avgTfidfF1.toFixed(4)),
      mrr: Number(avgTfidfMrr.toFixed(4)),
      avgQueryTimeMs: Number((tfidfTimeSum / N).toFixed(3)),
      k
    };

    const bm25Metrics: MetricSet = {
      precisionAtK: Number(avgBm25P.toFixed(4)),
      recallAtK: Number(avgBm25R.toFixed(4)),
      f1AtK: Number(avgBm25F1.toFixed(4)),
      mrr: Number(avgBm25Mrr.toFixed(4)),
      avgQueryTimeMs: Number((bm25TimeSum / N).toFixed(3)),
      k
    };

    const categoryPerformance = Array.from(categoryStats.entries()).map(([category, stat]) => ({
      category,
      tfidfPrecision: stat.count > 0 ? Number((stat.tfidfPrecSum / stat.count).toFixed(3)) : 0,
      bm25Precision: stat.count > 0 ? Number((stat.bm25PrecSum / stat.count).toFixed(3)) : 0,
      sampleCount: stat.count
    }));

    return {
      k,
      tfidf: tfidfMetrics,
      bm25: bm25Metrics,
      evaluatedQueriesCount: N,
      totalDatasetSize: tickets.length,
      categoryPerformance
    };
  }

  public static computeDatasetStats(tickets: SupportTicket[]): DatasetStats {
    const categories: { [key: string]: number } = {};
    let totalChars = 0;
    let totalTokens = 0;
    const vocab = new Set<string>();

    for (const t of tickets) {
      categories[t.category] = (categories[t.category] || 0) + 1;
      totalChars += t.text ? t.text.length : 0;
      const cleanWords = (t.text || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(Boolean);
      totalTokens += cleanWords.length;
      for (const w of cleanWords) {
        vocab.add(w);
      }
    }

    const totalRecords = tickets.length;
    const trainCount = Math.round(totalRecords * 0.8);
    const testCount = totalRecords - trainCount;

    return {
      totalRecords,
      categories,
      avgTextLengthChars: totalRecords > 0 ? Math.round(totalChars / totalRecords) : 0,
      avgTokenCount: totalRecords > 0 ? Math.round(totalTokens / totalRecords) : 0,
      trainCount,
      testCount,
      vocabularySize: vocab.size,
      duplicatesRemoved: 0,
      emptyRowsRemoved: 0
    };
  }

  private static getEmptyEvaluation(k: number, size: number): EvaluationResults {
    return {
      k,
      tfidf: { precisionAtK: 0, recallAtK: 0, f1AtK: 0, mrr: 0, avgQueryTimeMs: 0, k },
      bm25: { precisionAtK: 0, recallAtK: 0, f1AtK: 0, mrr: 0, avgQueryTimeMs: 0, k },
      evaluatedQueriesCount: 0,
      totalDatasetSize: size,
      categoryPerformance: []
    };
  }
}

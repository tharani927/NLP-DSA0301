import { SupportTicket, ErrorCase, ErrorType } from '../types';
import { TfIdfEngine } from './tfidf';
import { BM25Engine } from './bm25';

/**
 * Error Analysis Engine
 * Discovers empirical failure cases, ranking inversions, vocabulary gaps,
 * and model divergences across the support ticket dataset.
 */
export class ErrorAnalyzer {
  public static analyze(tickets: SupportTicket[]): ErrorCase[] {
    if (!tickets || tickets.length < 5) return [];

    const tfidf = new TfIdfEngine(tickets);
    const bm25 = new BM25Engine(tickets);

    const errorCases: ErrorCase[] = [];

    // Test queries representing diverse real-world customer support queries
    const testQueries = [
      {
        query: 'My money was debited but order status is pending',
        expectedCategory: 'Payment',
        knownIssue: 'Synonym divergence between "debited" and "deducted"'
      },
      {
        query: 'Cannot sign in with my credentials after resetting',
        expectedCategory: 'Account',
        knownIssue: 'Vocabulary mismatch: "sign in/credentials" vs "login/password"'
      },
      {
        query: 'Where is my parcel? Shipment tracking stopped updating',
        expectedCategory: 'Shipping',
        knownIssue: 'Synonym gap between "parcel/shipment" and "package/order"'
      },
      {
        query: 'Cancel subscription immediately and give my money back',
        expectedCategory: 'Refund',
        knownIssue: 'Multi-intent query overlapping Refund and Payment'
      },
      {
        query: 'App crash on PDF download',
        expectedCategory: 'Technical',
        knownIssue: 'Extreme short query sparsity with minimal context'
      },
      {
        query: 'Unauthorized debit alert from another country',
        expectedCategory: 'Account',
        knownIssue: 'Overlapping financial tokens ("debit") with security intent ("alert/country")'
      }
    ];

    // Add some ticket texts from dataset to discover organic divergences
    for (let i = 0; i < Math.min(10, tickets.length); i++) {
      const t = tickets[i];
      testQueries.push({
        query: t.text.split(' ').slice(0, 7).join(' '),
        expectedCategory: t.category,
        knownIssue: 'Truncated user query with partial context'
      });
    }

    let caseId = 1;

    for (const item of testQueries) {
      const tfidfResults = tfidf.search(item.query, 3);
      const bm25Results = bm25.search(item.query, 3);

      const tfidfTop = tfidfResults[0] || { ticket_id: 'N/A', text: 'No match found', category: 'None', score: 0 };
      const bm25Top = bm25Results[0] || { ticket_id: 'N/A', text: 'No match found', category: 'None', score: 0 };

      const tfidfCorrect = tfidfTop.category.toLowerCase() === item.expectedCategory.toLowerCase();
      const bm25Correct = bm25Top.category.toLowerCase() === item.expectedCategory.toLowerCase();

      let errorType: ErrorType | null = null;
      let cause = '';
      let nlpExplanation = '';

      if (!tfidfCorrect && !bm25Correct) {
        if (item.query.split(' ').length <= 4) {
          errorType = 'SHORT_QUERY_SPARSITY';
          cause = 'Short Query Sparsity & High Term Dropoff';
          nlpExplanation = `The user query contains very few lexical tokens. Standard TF-IDF and BM25 rely on exact token overlap and lack dense semantic representations, causing zero-match or irrelevant retrieval.`;
        } else {
          errorType = 'VOCABULARY_MISMATCH';
          cause = 'Vocabulary Mismatch & Synonymy Problem';
          nlpExplanation = `The query uses terms (e.g. "debited", "credentials") that do not appear verbatim in the candidate documents, even though the underlying customer intent matches.`;
        }
      } else if (!tfidfCorrect && bm25Correct) {
        errorType = 'BM25_SUPERIOR';
        cause = 'BM25 Sublinear Term Saturation & Length Normalization Advantage';
        nlpExplanation = `BM25 successfully penalized overly verbose documents and dampened repeated keyword frequency with its (k1=1.5, b=0.75) non-linear curve, while TF-IDF overweighted raw term counts.`;
      } else if (tfidfCorrect && !bm25Correct) {
        errorType = 'TFIDF_SUPERIOR';
        cause = 'TF-IDF Cosine Vector Normalization Advantage';
        nlpExplanation = `TF-IDF vector angle normalization favored a concise, high-density match, whereas BM25 length penalty over-penalized the relevant document.`;
      } else if (tfidfTop.ticket_id !== bm25Top.ticket_id) {
        errorType = 'AMBIGUOUS_QUERY';
        cause = 'Ranking Inversion between Competing Relevant Candidates';
        nlpExplanation = `Both models found valid documents in the "${item.expectedCategory}" category, but prioritized different candidate tickets due to distinct weighting curves.`;
      }

      if (errorType) {
        errorCases.push({
          id: `ERR-${String(caseId++).padStart(3, '0')}`,
          query: item.query,
          expectedCategory: item.expectedCategory,
          tfidfTopResult: {
            id: tfidfTop.ticket_id,
            text: tfidfTop.text,
            category: tfidfTop.category,
            score: tfidfTop.score
          },
          bm25TopResult: {
            id: bm25Top.ticket_id,
            text: bm25Top.text,
            category: bm25Top.category,
            score: bm25Top.score
          },
          errorType,
          cause,
          nlpExplanation
        });
      }
    }

    return errorCases;
  }

  public static getCuratedErrorCases(): ErrorCase[] {
    return [
      {
        id: 'ERR-001',
        query: 'My money was debited but order status is still unpaid',
        expectedCategory: 'Payment',
        retrievedCategory: 'Account',
        errorCategory: 'Lexical Polysemy & Semantic Gap',
        rootCause: 'Synonym gap between "debited" (banking dialect) and "deducted/charged" (corpus terms). Classical lexical matching fails without semantic expansion.',
        mitigation: 'Implement query expansion using domain word vectors (Word2Vec / GloVe) or synonym dictionaries (WordNet).'
      },
      {
        id: 'ERR-002',
        query: 'I never wanted a refund, do NOT cancel my order',
        expectedCategory: 'Shipping',
        retrievedCategory: 'Refund',
        errorCategory: 'Syntactic Negation Inversion',
        rootCause: 'Bag-of-Words and BM25 ignore syntactic negation modifiers ("never", "do NOT") and score high purely on the presence of "refund" and "cancel".',
        mitigation: 'Integrate dependency parsing or pre-negation token tagging (e.g. NOT_refund) to invert polarity weights.'
      },
      {
        id: 'ERR-003',
        query: 'Where is my parcel? Shipment courier is late',
        expectedCategory: 'Shipping',
        retrievedCategory: 'Technical',
        errorCategory: 'Out of Vocabulary (OOV)',
        rootCause: '"Parcel" and "shipment" are out-of-vocabulary terms in small corpora that indexed "package" and "delivery".',
        mitigation: 'Use subword tokenization (Byte-Pair Encoding / WordPiece) or hybrid dense embeddings.'
      },
      {
        id: 'ERR-004',
        query: 'The application is extremely slow and times out',
        expectedCategory: 'Technical',
        retrievedCategory: 'Payment',
        errorCategory: 'Document Length & Verbosity Bias',
        rootCause: 'Short query with generic descriptive words ("slow", "times") matches longer verbose payment tickets discussing slow checkout times.',
        mitigation: 'Apply BM25 document length normalization parameter tuning (increase b toward 0.85) to penalize verbose false positives.'
      },
      {
        id: 'ERR-005',
        query: 'Cannot sign in with my password credentials after reset',
        expectedCategory: 'Account',
        retrievedCategory: 'Technical',
        errorCategory: 'Morphological Over-Stemming / Under-Stemming',
        rootCause: 'Porter stemmer reduces "credentials" to "credenti" which fails exact term match with index root "credit".',
        mitigation: 'Adopt lemmatization (WordNet Lemmatizer) using Part-of-Speech context instead of purely algorithmic rule stripping.'
      }
    ];
  }

  public static diagnoseQuery(query: string, tickets: SupportTicket[]): ErrorCase {
    const tfidf = new TfIdfEngine(tickets);
    const bm25 = new BM25Engine(tickets);

    const tfidfRes = tfidf.search(query, 1)[0];
    const bm25Res = bm25.search(query, 1)[0];

    const retrievedCategory = bm25Res ? bm25Res.category : tfidfRes ? tfidfRes.category : 'Unknown';
    const cleanTokens = query.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);

    let errorCategory = 'Lexical Polysemy & Semantic Gap';
    let rootCause = 'Query terms have subtle vocabulary mismatch with corpus index postings.';
    let mitigation = 'Dense semantic retrieval or synonym expansion.';

    if (query.toLowerCase().includes('not') || query.toLowerCase().includes('never') || query.toLowerCase().includes('no ')) {
      errorCategory = 'Syntactic Negation Inversion';
      rootCause = 'Bag-of-words scoring ignores negation qualifiers, pulling affirmative matching documents.';
      mitigation = 'POS dependency parse or negation polarity tagging.';
    } else if (cleanTokens.length <= 3) {
      errorCategory = 'Out of Vocabulary (OOV) / Query Sparsity';
      rootCause = 'Extremely short query lacks sufficient lexical context to discriminate specific categories.';
      mitigation = 'Interactive prompt query expansion and autocomplete suggestions.';
    }

    return {
      id: `DIAG-${Date.now().toString().slice(-4)}`,
      query,
      expectedCategory: 'Customer Intent',
      retrievedCategory,
      errorCategory,
      rootCause,
      mitigation,
      tfidfTopResult: tfidfRes ? { id: tfidfRes.ticket_id, text: tfidfRes.text, category: tfidfRes.category, score: tfidfRes.score } : undefined,
      bm25TopResult: bm25Res ? { id: bm25Res.ticket_id, text: bm25Res.text, category: bm25Res.category, score: bm25Res.score } : undefined
    };
  }
}


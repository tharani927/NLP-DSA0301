import { ENGLISH_STOPWORDS } from './stopwords';
import { PreprocessingResult, PreprocessingStep } from '../types';

/**
 * Text Preprocessing Pipeline for Natural Language Processing
 * Implements regex-based cleaning, normalization, tokenization, and stop-word filtering.
 */
export class TextPreprocessor {
  // Regex patterns
  private static URL_REGEX = /https?:\/\/\S+|www\.\S+/gi;
  private static EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
  private static SPECIAL_CHARS_REGEX = /[^a-zA-Z0-9\s]/g;
  private static MULTI_WHITESPACE_REGEX = /\s+/g;
  private static WORD_TOKEN_REGEX = /[a-zA-Z0-9]+/g;

  /**
   * Runs the complete end-to-end preprocessing pipeline and records every intermediate transformation.
   */
  public static process(rawText: string): PreprocessingResult {
    const steps: PreprocessingStep[] = [];
    const originalText = rawText || '';

    // Step 0: Input Capture
    steps.push({
      stepName: 'Raw Input',
      description: 'Original unstructured customer support ticket text as received.',
      output: originalText
    });

    // Step 1: Lowercasing
    const lowercased = originalText.toLowerCase();
    steps.push({
      stepName: 'Lowercasing',
      description: 'Converts all characters to lowercase to ensure case-insensitive uniformity.',
      output: lowercased
    });

    // Step 2: URL Removal
    const noUrls = lowercased.replace(this.URL_REGEX, ' ');
    steps.push({
      stepName: 'URL Removal',
      description: 'Strips web hyperlinks and URLs using regular expression matching.',
      regexPattern: 'https?:\\/\\/\\S+|www\\.\\S+',
      output: noUrls
    });

    // Step 3: Email Address Removal
    const noEmails = noUrls.replace(this.EMAIL_REGEX, ' ');
    steps.push({
      stepName: 'Email Removal',
      description: 'Strips email addresses to sanitize PII and reduce non-informative noise.',
      regexPattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
      output: noEmails
    });

    // Step 4: Special Characters & Punctuation Removal
    const noSpecial = noEmails.replace(this.SPECIAL_CHARS_REGEX, ' ');
    steps.push({
      stepName: 'Punctuation & Special Character Removal',
      description: 'Removes symbols, quotes, brackets, and non-alphanumeric punctuation.',
      regexPattern: '[^a-zA-Z0-9\\s]',
      output: noSpecial
    });

    // Step 5: Whitespace Normalization
    const cleanedText = noSpecial.replace(this.MULTI_WHITESPACE_REGEX, ' ').trim();
    steps.push({
      stepName: 'Whitespace Normalization',
      description: 'Collapses redundant spaces, tabs, and linebreaks into single spaces.',
      regexPattern: '\\s+',
      output: cleanedText
    });

    // Step 6: Word Tokenization
    const tokenMatches = cleanedText.match(this.WORD_TOKEN_REGEX);
    const tokens: string[] = tokenMatches ? Array.from(tokenMatches) : [];
    steps.push({
      stepName: 'Tokenization',
      description: 'Splits normalized text into discrete lexical units (tokens/words).',
      regexPattern: '[a-zA-Z0-9]+',
      output: tokens
    });

    // Step 7: Stop-word Removal
    const stopwordsRemoved: string[] = [];
    const removedStopwords: string[] = [];

    for (const token of tokens) {
      if (ENGLISH_STOPWORDS.has(token)) {
        removedStopwords.push(token);
      } else if (token.length > 0) {
        stopwordsRemoved.push(token);
      }
    }

    steps.push({
      stepName: 'Stop-word Removal',
      description: `Filters out high-frequency function words (e.g. "the", "was", "for") to retain semantic content.`,
      output: stopwordsRemoved
    });

    const finalProcessedText = stopwordsRemoved.join(' ');

    return {
      originalText,
      cleanedText,
      tokens,
      stopwordsRemoved,
      removedStopwords,
      stemmedTokens: [], // Will be populated in stemming module
      finalProcessedText,
      steps
    };
  }

  /**
   * Fast token extraction for indexing
   */
  public static tokenizeAndClean(text: string): string[] {
    if (!text) return [];
    const lower = text.toLowerCase()
      .replace(this.URL_REGEX, ' ')
      .replace(this.EMAIL_REGEX, ' ')
      .replace(this.SPECIAL_CHARS_REGEX, ' ')
      .replace(this.MULTI_WHITESPACE_REGEX, ' ')
      .trim();

    const matches = lower.match(this.WORD_TOKEN_REGEX) || [];
    return matches.filter(tok => !ENGLISH_STOPWORDS.has(tok) && tok.length > 1);
  }
}

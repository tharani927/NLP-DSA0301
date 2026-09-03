import { StemmingResult } from '../types';

/**
 * Porter Stemming Algorithm (Martin Porter, 1980)
 * Faithfully implements the 5-step morphological reduction rules
 * with syllable measure (m) calculation, condition testing, and step tracing.
 */
export class PorterStemmer {
  private static vowels = 'aeiou';

  private static isConsonant(word: string, i: number): boolean {
    const letter = word[i];
    if (this.vowels.includes(letter)) return false;
    if (letter === 'y') {
      return i === 0 ? true : !this.isConsonant(word, i - 1);
    }
    return true;
  }

  /**
   * Measure m: A word form can be represented as [C](VC)^m[V]
   * m is the number of vowel-consonant sequences.
   */
  private static getMeasure(word: string): number {
    let m = 0;
    let inVowel = false;

    for (let i = 0; i < word.length; i++) {
      const isCons = this.isConsonant(word, i);
      if (!isCons) {
        inVowel = true;
      } else if (inVowel) {
        m++;
        inVowel = false;
      }
    }
    return m;
  }

  private static containsVowel(word: string): boolean {
    for (let i = 0; i < word.length; i++) {
      if (!this.isConsonant(word, i)) return true;
    }
    return false;
  }

  private static endsWithDoubleConsonant(word: string): boolean {
    if (word.length < 2) return false;
    const last = word[word.length - 1];
    const prev = word[word.length - 2];
    if (last !== prev) return false;
    return this.isConsonant(word, word.length - 1);
  }

  private static cvc(word: string): boolean {
    if (word.length < 3) return false;
    const l1 = word.length - 1;
    const l2 = word.length - 2;
    const l3 = word.length - 3;
    if (
      this.isConsonant(word, l3) &&
      !this.isConsonant(word, l2) &&
      this.isConsonant(word, l1)
    ) {
      const last = word[l1];
      return last !== 'w' && last !== 'x' && last !== 'y';
    }
    return false;
  }

  /**
   * Stems a single token and returns detailed rule trace.
   */
  public static stemTokenWithTrace(token: string): StemmingResult {
    const original = token.toLowerCase();
    if (original.length <= 2) {
      return {
        original,
        stemmed: original,
        ruleApplied: 'Length <= 2 (No reduction needed)',
        step: 'Base'
      };
    }

    let w = original;
    let appliedRule = 'No matching suffix rules';
    let appliedStep = 'None';

    // Step 1a: Plurals and past participles
    if (w.endsWith('sses')) {
      w = w.slice(0, -2);
      appliedRule = 'sses → ss';
      appliedStep = 'Step 1a';
    } else if (w.endsWith('ies')) {
      w = w.slice(0, -2);
      appliedRule = 'ies → i';
      appliedStep = 'Step 1a';
    } else if (w.endsWith('ss')) {
      // do nothing
      appliedRule = 'ss → ss';
      appliedStep = 'Step 1a';
    } else if (w.endsWith('s')) {
      w = w.slice(0, -1);
      appliedRule = 's → ∅ (plural stripping)';
      appliedStep = 'Step 1a';
    }

    // Step 1b: -eed, -ed, -ing
    let step1bExtra = false;
    if (w.endsWith('eed')) {
      const stem = w.slice(0, -3);
      if (this.getMeasure(stem) > 0) {
        w = stem + 'ee';
        appliedRule = 'eed → ee (m > 0)';
        appliedStep = 'Step 1b';
      }
    } else if (w.endsWith('ed')) {
      const stem = w.slice(0, -2);
      if (this.containsVowel(stem)) {
        w = stem;
        step1bExtra = true;
        appliedRule = 'ed → ∅ (*v*)';
        appliedStep = 'Step 1b';
      }
    } else if (w.endsWith('ing')) {
      const stem = w.slice(0, -3);
      if (this.containsVowel(stem)) {
        w = stem;
        step1bExtra = true;
        appliedRule = 'ing → ∅ (*v*)';
        appliedStep = 'Step 1b';
      }
    }

    if (step1bExtra) {
      if (w.endsWith('at')) {
        w = w + 'e';
        appliedRule += ' & at → ate';
      } else if (w.endsWith('bl')) {
        w = w + 'e';
        appliedRule += ' & bl → ble';
      } else if (w.endsWith('iz')) {
        w = w + 'e';
        appliedRule += ' & iz → ize';
      } else if (
        this.endsWithDoubleConsonant(w) &&
        !w.endsWith('l') &&
        !w.endsWith('s') &&
        !w.endsWith('z')
      ) {
        w = w.slice(0, -1);
        appliedRule += ' & double consonant reduction';
      } else if (this.getMeasure(w) === 1 && this.cvc(w)) {
        w = w + 'e';
        appliedRule += ' & (m=1 and *o) → e';
      }
    }

    // Step 1c: Y to I
    if (w.endsWith('y')) {
      const stem = w.slice(0, -1);
      if (this.containsVowel(stem)) {
        w = stem + 'i';
        appliedRule = 'y → i (*v*)';
        appliedStep = 'Step 1c';
      }
    }

    // Step 2: Derivational suffixes
    const step2Map: [string, string][] = [
      ['ational', 'ate'],
      ['tional', 'tion'],
      ['enci', 'ence'],
      ['anci', 'ance'],
      ['izer', 'ize'],
      ['abli', 'able'],
      ['alli', 'al'],
      ['entli', 'ent'],
      ['eli', 'e'],
      ['ousli', 'ous'],
      ['ization', 'ize'],
      ['ation', 'ate'],
      ['ator', 'ate'],
      ['alism', 'al'],
      ['iveness', 'ive'],
      ['fulness', 'ful'],
      ['ousness', 'ous'],
      ['aliti', 'al'],
      ['iviti', 'ive'],
      ['biliti', 'ble']
    ];

    for (const [suffix, replacement] of step2Map) {
      if (w.endsWith(suffix)) {
        const stem = w.slice(0, -suffix.length);
        if (this.getMeasure(stem) > 0) {
          w = stem + replacement;
          appliedRule = `${suffix} → ${replacement} (m > 0)`;
          appliedStep = 'Step 2';
          break;
        }
      }
    }

    // Step 3: -ic-, -ful-, -ness-
    const step3Map: [string, string][] = [
      ['icate', 'ic'],
      ['ative', ''],
      ['alize', 'al'],
      ['iciti', 'ic'],
      ['ical', 'ic'],
      ['ful', ''],
      ['ness', '']
    ];

    for (const [suffix, replacement] of step3Map) {
      if (w.endsWith(suffix)) {
        const stem = w.slice(0, -suffix.length);
        if (this.getMeasure(stem) > 0) {
          w = stem + replacement;
          appliedRule = `${suffix} → ${replacement || '∅'} (m > 0)`;
          appliedStep = 'Step 3';
          break;
        }
      }
    }

    // Step 4: Suffix stripping in measure > 1
    const step4Suffixes = [
      'al', 'ance', 'ence', 'er', 'ic', 'able', 'ible', 'ant',
      'ement', 'ment', 'ent', 'ou', 'ism', 'ate', 'iti', 'ous', 'ive', 'ize'
    ];

    for (const suffix of step4Suffixes) {
      if (w.endsWith(suffix)) {
        const stem = w.slice(0, -suffix.length);
        if (this.getMeasure(stem) > 1) {
          w = stem;
          appliedRule = `${suffix} → ∅ (m > 1)`;
          appliedStep = 'Step 4';
          break;
        }
      }
    }

    // Step 4 special case for 'ion'
    if (w.endsWith('ion')) {
      const stem = w.slice(0, -3);
      if (this.getMeasure(stem) > 1 && (stem.endsWith('s') || stem.endsWith('t'))) {
        w = stem;
        appliedRule = `(s|t)ion → ∅ (m > 1)`;
        appliedStep = 'Step 4';
      }
    }

    // Step 5a: -e removal
    if (w.endsWith('e')) {
      const stem = w.slice(0, -1);
      const m = this.getMeasure(stem);
      if (m > 1 || (m === 1 && !this.cvc(stem))) {
        w = stem;
        appliedRule = 'e → ∅ (m > 1 or not cvc)';
        appliedStep = 'Step 5a';
      }
    }

    // Step 5b: Double consonant removal if m > 1 and ends with 'll'
    if (this.getMeasure(w) > 1 && this.endsWithDoubleConsonant(w) && w.endsWith('l')) {
      w = w.slice(0, -1);
      appliedRule = 'll → l (m > 1)';
      appliedStep = 'Step 5b';
    }

    return {
      original,
      stemmed: w,
      ruleApplied: appliedRule,
      step: appliedStep
    };
  }

  /**
   * Fast stem for tokens
   */
  public static stem(token: string): string {
    return this.stemTokenWithTrace(token).stemmed;
  }

  /**
   * Stems an array of tokens
   */
  public static stemTokens(tokens: string[]): string[] {
    return tokens.map(t => this.stem(t));
  }
}

import { PosCategory, PosTaggedToken } from '../types';

/**
 * Part-of-Speech (POS) Tagger
 * Implements a hybrid Lexicon-Lookup + Morphological Suffix Analysis +
 * Contextual Transformation Rule system following Penn Treebank & Universal POS standards.
 */
export class PosTagger {
  // Common POS Lexicon for customer support & general English
  private static LEXICON: { [word: string]: { tag: string; cat: PosCategory; desc: string } } = {
    // Pronouns
    'i': { tag: 'PRP', cat: 'PRONOUN', desc: 'Personal Pronoun' },
    'me': { tag: 'PRP', cat: 'PRONOUN', desc: 'Personal Pronoun' },
    'my': { tag: 'PRP$', cat: 'PRONOUN', desc: 'Possessive Pronoun' },
    'myself': { tag: 'PRP', cat: 'PRONOUN', desc: 'Reflexive Pronoun' },
    'you': { tag: 'PRP', cat: 'PRONOUN', desc: 'Personal Pronoun' },
    'your': { tag: 'PRP$', cat: 'PRONOUN', desc: 'Possessive Pronoun' },
    'yours': { tag: 'PRP$', cat: 'PRONOUN', desc: 'Possessive Pronoun' },
    'he': { tag: 'PRP', cat: 'PRONOUN', desc: 'Personal Pronoun' },
    'him': { tag: 'PRP', cat: 'PRONOUN', desc: 'Personal Pronoun' },
    'his': { tag: 'PRP$', cat: 'PRONOUN', desc: 'Possessive Pronoun' },
    'she': { tag: 'PRP', cat: 'PRONOUN', desc: 'Personal Pronoun' },
    'her': { tag: 'PRP$', cat: 'PRONOUN', desc: 'Possessive Pronoun' },
    'it': { tag: 'PRP', cat: 'PRONOUN', desc: 'Personal Pronoun' },
    'its': { tag: 'PRP$', cat: 'PRONOUN', desc: 'Possessive Pronoun' },
    'we': { tag: 'PRP', cat: 'PRONOUN', desc: 'Personal Pronoun' },
    'us': { tag: 'PRP', cat: 'PRONOUN', desc: 'Personal Pronoun' },
    'our': { tag: 'PRP$', cat: 'PRONOUN', desc: 'Possessive Pronoun' },
    'they': { tag: 'PRP', cat: 'PRONOUN', desc: 'Personal Pronoun' },
    'them': { tag: 'PRP', cat: 'PRONOUN', desc: 'Personal Pronoun' },
    'their': { tag: 'PRP$', cat: 'PRONOUN', desc: 'Possessive Pronoun' },
    'this': { tag: 'DT', cat: 'DETERMINER', desc: 'Demonstrative Determiner' },
    'that': { tag: 'DT', cat: 'DETERMINER', desc: 'Demonstrative Determiner' },
    'these': { tag: 'DT', cat: 'DETERMINER', desc: 'Demonstrative Determiner' },
    'those': { tag: 'DT', cat: 'DETERMINER', desc: 'Demonstrative Determiner' },

    // Determiners & Articles
    'the': { tag: 'DT', cat: 'DETERMINER', desc: 'Definite Article' },
    'a': { tag: 'DT', cat: 'DETERMINER', desc: 'Indefinite Article' },
    'an': { tag: 'DT', cat: 'DETERMINER', desc: 'Indefinite Article' },
    'all': { tag: 'DT', cat: 'DETERMINER', desc: 'Determiner / Quantifier' },
    'any': { tag: 'DT', cat: 'DETERMINER', desc: 'Determiner / Quantifier' },
    'some': { tag: 'DT', cat: 'DETERMINER', desc: 'Determiner / Quantifier' },
    'every': { tag: 'DT', cat: 'DETERMINER', desc: 'Determiner' },
    'no': { tag: 'DT', cat: 'DETERMINER', desc: 'Negative Determiner' },

    // Prepositions & Conjunctions
    'in': { tag: 'IN', cat: 'PREPOSITION', desc: 'Preposition' },
    'on': { tag: 'IN', cat: 'PREPOSITION', desc: 'Preposition' },
    'at': { tag: 'IN', cat: 'PREPOSITION', desc: 'Preposition' },
    'to': { tag: 'TO', cat: 'PREPOSITION', desc: 'Infinitive Marker / Preposition' },
    'for': { tag: 'IN', cat: 'PREPOSITION', desc: 'Preposition' },
    'with': { tag: 'IN', cat: 'PREPOSITION', desc: 'Preposition' },
    'from': { tag: 'IN', cat: 'PREPOSITION', desc: 'Preposition' },
    'by': { tag: 'IN', cat: 'PREPOSITION', desc: 'Preposition' },
    'about': { tag: 'IN', cat: 'PREPOSITION', desc: 'Preposition' },
    'into': { tag: 'IN', cat: 'PREPOSITION', desc: 'Preposition' },
    'over': { tag: 'IN', cat: 'PREPOSITION', desc: 'Preposition' },
    'after': { tag: 'IN', cat: 'PREPOSITION', desc: 'Preposition' },
    'before': { tag: 'IN', cat: 'PREPOSITION', desc: 'Preposition' },
    'and': { tag: 'CC', cat: 'CONJUNCTION', desc: 'Coordinating Conjunction' },
    'but': { tag: 'CC', cat: 'CONJUNCTION', desc: 'Coordinating Conjunction' },
    'or': { tag: 'CC', cat: 'CONJUNCTION', desc: 'Coordinating Conjunction' },
    'so': { tag: 'CC', cat: 'CONJUNCTION', desc: 'Coordinating Conjunction' },
    'because': { tag: 'IN', cat: 'CONJUNCTION', desc: 'Subordinating Conjunction' },
    'if': { tag: 'IN', cat: 'CONJUNCTION', desc: 'Subordinating Conjunction' },

    // Common Verbs & Auxiliaries
    'is': { tag: 'VBZ', cat: 'VERB', desc: 'Verb, 3rd person singular present' },
    'am': { tag: 'VBP', cat: 'VERB', desc: 'Verb, non-3rd person singular present' },
    'are': { tag: 'VBP', cat: 'VERB', desc: 'Verb, non-3rd person singular present' },
    'was': { tag: 'VBD', cat: 'VERB', desc: 'Verb, past tense' },
    'were': { tag: 'VBD', cat: 'VERB', desc: 'Verb, past tense' },
    'be': { tag: 'VB', cat: 'VERB', desc: 'Verb, base form' },
    'been': { tag: 'VBN', cat: 'VERB', desc: 'Verb, past participle' },
    'being': { tag: 'VBG', cat: 'VERB', desc: 'Verb, gerund/present participle' },
    'have': { tag: 'VBP', cat: 'VERB', desc: 'Verb, non-3rd person present' },
    'has': { tag: 'VBZ', cat: 'VERB', desc: 'Verb, 3rd person singular present' },
    'had': { tag: 'VBD', cat: 'VERB', desc: 'Verb, past tense' },
    'do': { tag: 'VB', cat: 'VERB', desc: 'Verb, base form' },
    'does': { tag: 'VBZ', cat: 'VERB', desc: 'Verb, 3rd person present' },
    'did': { tag: 'VBD', cat: 'VERB', desc: 'Verb, past tense' },
    'can': { tag: 'MD', cat: 'VERB', desc: 'Modal Auxiliary Verb' },
    'cannot': { tag: 'MD', cat: 'VERB', desc: 'Modal Auxiliary Verb' },
    'could': { tag: 'MD', cat: 'VERB', desc: 'Modal Auxiliary Verb' },
    'will': { tag: 'MD', cat: 'VERB', desc: 'Modal Auxiliary Verb' },
    'would': { tag: 'MD', cat: 'VERB', desc: 'Modal Auxiliary Verb' },
    'should': { tag: 'MD', cat: 'VERB', desc: 'Modal Auxiliary Verb' },
    'must': { tag: 'MD', cat: 'VERB', desc: 'Modal Auxiliary Verb' },
    'want': { tag: 'VB', cat: 'VERB', desc: 'Verb, base form' },
    'need': { tag: 'VB', cat: 'VERB', desc: 'Verb, base form' },
    'like': { tag: 'VB', cat: 'VERB', desc: 'Verb, base form' },
    'get': { tag: 'VB', cat: 'VERB', desc: 'Verb, base form' },
    'receive': { tag: 'VB', cat: 'VERB', desc: 'Verb, base form' },
    'received': { tag: 'VBD', cat: 'VERB', desc: 'Verb, past tense' },
    'send': { tag: 'VB', cat: 'VERB', desc: 'Verb, base form' },
    'sent': { tag: 'VBD', cat: 'VERB', desc: 'Verb, past tense' },
    'charged': { tag: 'VBD', cat: 'VERB', desc: 'Verb, past tense' },
    'deducted': { tag: 'VBD', cat: 'VERB', desc: 'Verb, past tense' },
    'debited': { tag: 'VBD', cat: 'VERB', desc: 'Verb, past tense' },
    'credited': { tag: 'VBN', cat: 'VERB', desc: 'Verb, past participle' },
    'declined': { tag: 'VBD', cat: 'VERB', desc: 'Verb, past tense' },
    'failed': { tag: 'VBD', cat: 'VERB', desc: 'Verb, past tense' },
    'crashes': { tag: 'VBZ', cat: 'VERB', desc: 'Verb, 3rd person singular present' },
    'crashed': { tag: 'VBD', cat: 'VERB', desc: 'Verb, past tense' },
    'requested': { tag: 'VBD', cat: 'VERB', desc: 'Verb, past tense' },
    'cancelling': { tag: 'VBG', cat: 'VERB', desc: 'Verb, gerund' },
    'cancelled': { tag: 'VBN', cat: 'VERB', desc: 'Verb, past participle' },
    'delivered': { tag: 'VBN', cat: 'VERB', desc: 'Verb, past participle' },
    'reset': { tag: 'VB', cat: 'VERB', desc: 'Verb, base form' },
    'login': { tag: 'VB', cat: 'VERB', desc: 'Verb / Base action' },
    'logout': { tag: 'VB', cat: 'VERB', desc: 'Verb, base form' },
    'unlock': { tag: 'VB', cat: 'VERB', desc: 'Verb, base form' },
    'locked': { tag: 'VBN', cat: 'VERB', desc: 'Verb, past participle' },
    'update': { tag: 'VB', cat: 'VERB', desc: 'Verb, base form' },
    'change': { tag: 'VB', cat: 'VERB', desc: 'Verb, base form' },
    'process': { tag: 'VB', cat: 'VERB', desc: 'Verb, base form' },
    'export': { tag: 'VB', cat: 'VERB', desc: 'Verb, base form' },
    'shows': { tag: 'VBZ', cat: 'VERB', desc: 'Verb, 3rd person present' },
    'marked': { tag: 'VBD', cat: 'VERB', desc: 'Verb, past tense' },
    'arriving': { tag: 'VBG', cat: 'VERB', desc: 'Verb, gerund' },

    // Domain Support Nouns
    'payment': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'payments': { tag: 'NNS', cat: 'NOUN', desc: 'Noun, plural' },
    'refund': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'refunds': { tag: 'NNS', cat: 'NOUN', desc: 'Noun, plural' },
    'customer': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'customers': { tag: 'NNS', cat: 'NOUN', desc: 'Noun, plural' },
    'ticket': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'tickets': { tag: 'NNS', cat: 'NOUN', desc: 'Noun, plural' },
    'account': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'accounts': { tag: 'NNS', cat: 'NOUN', desc: 'Noun, plural' },
    'password': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'transaction': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'transactions': { tag: 'NNS', cat: 'NOUN', desc: 'Noun, plural' },
    'order': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'orders': { tag: 'NNS', cat: 'NOUN', desc: 'Noun, plural' },
    'money': { tag: 'NN', cat: 'NOUN', desc: 'Noun, mass/singular' },
    'bank': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'website': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'dashboard': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'profile': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'card': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'credit': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'debit': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'gateway': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'subscription': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'renewal': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'product': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'package': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'parcel': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'shipment': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'courier': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'delivery': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'address': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'status': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'server': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'error': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'errors': { tag: 'NNS', cat: 'NOUN', desc: 'Noun, plural' },
    'code': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'phone': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'email': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'agent': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'invoice': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'receipt': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'reimbursement': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'warehouse': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'voucher': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'coupon': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'discount': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'tax': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'time': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'day': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'days': { tag: 'NNS', cat: 'NOUN', desc: 'Noun, plural' },
    'hours': { tag: 'NNS', cat: 'NOUN', desc: 'Noun, plural' },
    'week': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },
    'month': { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular' },

    // Adjectives & Adverbs
    'immediate': { tag: 'JJ', cat: 'ADJECTIVE', desc: 'Adjective' },
    'annual': { tag: 'JJ', cat: 'ADJECTIVE', desc: 'Adjective' },
    'monthly': { tag: 'JJ', cat: 'ADJECTIVE', desc: 'Adjective' },
    'damaged': { tag: 'JJ', cat: 'ADJECTIVE', desc: 'Adjective' },
    'slow': { tag: 'JJ', cat: 'ADJECTIVE', desc: 'Adjective' },
    'fast': { tag: 'JJ', cat: 'ADJECTIVE', desc: 'Adjective' },
    'internal': { tag: 'JJ', cat: 'ADJECTIVE', desc: 'Adjective' },
    'international': { tag: 'JJ', cat: 'ADJECTIVE', desc: 'Adjective' },
    'corporate': { tag: 'JJ', cat: 'ADJECTIVE', desc: 'Adjective' },
    'primary': { tag: 'JJ', cat: 'ADJECTIVE', desc: 'Adjective' },
    'registered': { tag: 'JJ', cat: 'ADJECTIVE', desc: 'Adjective / Participle' },
    'unpaid': { tag: 'JJ', cat: 'ADJECTIVE', desc: 'Adjective' },
    'pending': { tag: 'JJ', cat: 'ADJECTIVE', desc: 'Adjective / Participle' },
    'suspicious': { tag: 'JJ', cat: 'ADJECTIVE', desc: 'Adjective' },
    'wrong': { tag: 'JJ', cat: 'ADJECTIVE', desc: 'Adjective' },
    'single': { tag: 'JJ', cat: 'ADJECTIVE', desc: 'Adjective' },
    'multiple': { tag: 'JJ', cat: 'ADJECTIVE', desc: 'Adjective' },
    'full': { tag: 'JJ', cat: 'ADJECTIVE', desc: 'Adjective' },
    'new': { tag: 'JJ', cat: 'ADJECTIVE', desc: 'Adjective' },
    'good': { tag: 'JJ', cat: 'ADJECTIVE', desc: 'Adjective' },
    'bad': { tag: 'JJ', cat: 'ADJECTIVE', desc: 'Adjective' },
    'not': { tag: 'RB', cat: 'ADVERB', desc: 'Adverb / Negation' },
    'never': { tag: 'RB', cat: 'ADVERB', desc: 'Adverb' },
    'always': { tag: 'RB', cat: 'ADVERB', desc: 'Adverb' },
    'now': { tag: 'RB', cat: 'ADVERB', desc: 'Adverb' },
    'then': { tag: 'RB', cat: 'ADVERB', desc: 'Adverb' },
    'here': { tag: 'RB', cat: 'ADVERB', desc: 'Adverb' },
    'there': { tag: 'RB', cat: 'ADVERB', desc: 'Adverb' },
    'where': { tag: 'WRB', cat: 'ADVERB', desc: 'Wh-adverb' },
    'when': { tag: 'WRB', cat: 'ADVERB', desc: 'Wh-adverb' },
    'how': { tag: 'WRB', cat: 'ADVERB', desc: 'Wh-adverb' },
    'why': { tag: 'WRB', cat: 'ADVERB', desc: 'Wh-adverb' },
    'immediately': { tag: 'RB', cat: 'ADVERB', desc: 'Adverb' },
    'extremely': { tag: 'RB', cat: 'ADVERB', desc: 'Adverb' },
    'twice': { tag: 'RB', cat: 'ADVERB', desc: 'Adverb' },
    'back': { tag: 'RB', cat: 'ADVERB', desc: 'Adverb' },
    'still': { tag: 'RB', cat: 'ADVERB', desc: 'Adverb' },
    'even': { tag: 'RB', cat: 'ADVERB', desc: 'Adverb' },
    'please': { tag: 'UH', cat: 'OTHER', desc: 'Interjection / Politeness Marker' }
  };

  /**
   * Performs morphological suffix tagging for out-of-vocabulary words.
   */
  private static tagByMorphology(word: string): { tag: string; cat: PosCategory; desc: string } {
    const w = word.toLowerCase();

    // Numbers
    if (/^\d+(\.\d+)?$/.test(w)) {
      return { tag: 'CD', cat: 'NUMBER', desc: 'Cardinal Number' };
    }

    // Adverbs (-ly)
    if (w.endsWith('ly') && w.length > 3) {
      return { tag: 'RB', cat: 'ADVERB', desc: 'Adverb (-ly suffix)' };
    }

    // Gerund / Present Participle (-ing)
    if (w.endsWith('ing') && w.length > 4) {
      return { tag: 'VBG', cat: 'VERB', desc: 'Verb, gerund/present participle (-ing)' };
    }

    // Past tense / Participle (-ed)
    if (w.endsWith('ed') && w.length > 3) {
      return { tag: 'VBD', cat: 'VERB', desc: 'Verb, past tense (-ed suffix)' };
    }

    // Noun derivational suffixes
    if (
      w.endsWith('tion') || w.endsWith('sion') ||
      w.endsWith('ment') || w.endsWith('ness') ||
      w.endsWith('ity') || w.endsWith('ance') ||
      w.endsWith('ence') || w.endsWith('ship') ||
      w.endsWith('ism') || w.endsWith('er') || w.endsWith('or')
    ) {
      return { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular (derivational suffix)' };
    }

    // Adjective derivational suffixes
    if (
      w.endsWith('able') || w.endsWith('ible') ||
      w.endsWith('ful') || w.endsWith('less') ||
      w.endsWith('ous') || w.endsWith('ive') ||
      w.endsWith('al') || w.endsWith('ic')
    ) {
      return { tag: 'JJ', cat: 'ADJECTIVE', desc: 'Adjective (derivational suffix)' };
    }

    // Plural noun (-s / -es)
    if ((w.endsWith('s') || w.endsWith('es')) && !w.endsWith('ss') && w.length > 3) {
      return { tag: 'NNS', cat: 'NOUN', desc: 'Noun, plural (-s suffix)' };
    }

    // Capitalized word not at start -> Proper Noun
    if (/^[A-Z][a-z0-9]+$/.test(word)) {
      return { tag: 'NNP', cat: 'NOUN', desc: 'Proper Noun, singular' };
    }

    // Default fallback: general noun
    return { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular (default open class)' };
  }

  /**
   * Tags a sentence / array of words using Lexicon + Morphology + Contextual rules.
   */
  public static tagSentence(textOrTokens: string | string[]): PosTaggedToken[] {
    let rawTokens: string[];
    if (typeof textOrTokens === 'string') {
      const matches = textOrTokens.match(/[a-zA-Z0-9'’]+|[.,!?;:#]/g);
      rawTokens = matches ? Array.from(matches) : [];
    } else {
      rawTokens = textOrTokens;
    }

    const tagged: PosTaggedToken[] = [];

    for (let i = 0; i < rawTokens.length; i++) {
      const raw = rawTokens[i];
      const lower = raw.toLowerCase();

      // Punctuation check
      if (/^[.,!?;:#"'\-\/()]+$/.test(raw)) {
        tagged.push({
          word: raw,
          tag: '.',
          universalCategory: 'PUNCTUATION',
          description: 'Punctuation Mark',
          confidence: 0.99
        });
        continue;
      }

      let info: { tag: string; cat: PosCategory; desc: string };

      if (this.LEXICON[lower]) {
        info = { ...this.LEXICON[lower] };
      } else {
        info = this.tagByMorphology(raw);
      }

      // Contextual transformation rules (Brill-style transformations)
      const prev = i > 0 ? tagged[i - 1] : null;
      const prevWord = prev ? prev.word.toLowerCase() : '';

      // Rule: Word following "to" when ambiguous is likely base verb
      if (prevWord === 'to' && (info.cat === 'NOUN' || info.cat === 'ADJECTIVE')) {
        info = { tag: 'VB', cat: 'VERB', desc: 'Verb, base form (infinitive after "to")' };
      }

      // Rule: Word following modal (can, will, should) is likely base verb
      if (prev && prev.tag === 'MD' && (info.cat === 'NOUN' || info.cat === 'ADJECTIVE')) {
        info = { tag: 'VB', cat: 'VERB', desc: 'Verb, base form (after modal auxiliary)' };
      }

      // Rule: Word following Determiner/Possessive (my, your, the, a) that is not followed by another noun -> NOUN
      if (prev && (prev.tag === 'DT' || prev.tag === 'PRP$') && info.tag === 'VBD') {
        // e.g., "my account reset" -> reset as NOUN or ADJ
        info = { tag: 'NN', cat: 'NOUN', desc: 'Noun, singular (after determiner)' };
      }

      tagged.push({
        word: raw,
        tag: info.tag,
        universalCategory: info.cat,
        description: info.desc,
        confidence: this.LEXICON[lower] ? 0.95 : 0.85
      });
    }

    return tagged;
  }
}

from nltk.corpus import wordnet as wn

def lesk(context, word):
    context_words = set(context.lower().split())

    best_sense = None
    max_overlap = 0

    for sense in wn.synsets(word):
        definition_words = set(sense.definition().lower().split())

        overlap = len(context_words.intersection(definition_words))

        if overlap > max_overlap:
            max_overlap = overlap
            best_sense = sense

    return best_sense


context = "I went to the bank to deposit money"
word = "bank"

sense = lesk(context, word)

if sense:
    print("Word:", word)
    print("Best Sense:", sense.name())
    print("Definition:", sense.definition())
else:
    print("No sense found")
from nltk.corpus import wordnet as wn

word = "bank"

# Retrieve synsets
synsets = wn.synsets(word)

print("Synsets for:", word)

for synset in synsets:
    print("\nSynset:", synset.name())
    print("Definition:", synset.definition())
    print("Examples:", synset.examples())

pos_prob = {
    "I": {"PRON": 1.0},
    "eat": {"VERB": 0.9, "NOUN": 0.1},
    "apple": {"NOUN": 0.8, "VERB": 0.2},
    "quickly": {"ADV": 1.0}
}

sentence = input("Enter a sentence: ").split()

print("\nPOS Tags:")
for word in sentence:
    if word in pos_prob:
        tag = max(pos_prob[word], key=pos_prob[word].get)
        print(word, "->", tag)
    else:
        print(word, "->", "UNKNOWN")
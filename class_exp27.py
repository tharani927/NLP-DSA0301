from collections import Counter

corpus = [
    "I love NLP",
    "I love Python",
    "I study NLP",
    "You love NLP",
    "We study Python",
    "I study Python"
]

tokens = []
for sentence in corpus:
    tokens.extend(sentence.split())

unigrams = Counter(tokens)

bigrams = []
for sentence in corpus:
    words = sentence.split()
    bigrams.extend(zip(words[:-1], words[1:]))

bigram_counts = Counter(bigrams)

print("Unigram Frequency")
for word, count in unigrams.items():
    print(word, ":", count)

print("\nBigram Frequency")
for bg, count in bigram_counts.items():
    print(bg, ":", count)

total_words = sum(unigrams.values())

print("\nUnigram Probabilities")
for word, count in unigrams.items():
    print(f"P({word}) = {count}/{total_words} = {count/total_words:.3f}")

print("\nBigram Probabilities (MLE)")
for (w1, w2), count in bigram_counts.items():
    print(f"P({w2}|{w1}) = {count}/{unigrams[w1]} = {count/unigrams[w1]:.3f}")

check = ("love", "NLP")

if check in bigram_counts:
    print(f"\nBigram {check} exists.")
    print(f"Probability = {bigram_counts[check]}/{unigrams[check[0]]} = {bigram_counts[check]/unigrams[check[0]]:.3f}")
else:
    print(f"\nBigram {check} does not exist.")
    print("Probability = 0")

check = ("Python", "love")

if check in bigram_counts:
    print(f"\nBigram {check} exists.")
    print(f"Probability = {bigram_counts[check]}/{unigrams[check[0]]} = {bigram_counts[check]/unigrams[check[0]]:.3f}")
else:
    print(f"\nBigram {check} does not exist.")
    print("Probability = 0")
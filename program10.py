sentence = input("Enter sentence: ").split()

tags = []

for word in sentence:
    tags.append((word, "NOUN"))

for i in range(len(tags)):
    word, tag = tags[i]

    if word.endswith("ing"):
        tags[i] = (word, "VERB")

    if word in ["is", "am", "are", "was", "were"]:
        tags[i] = (word, "VERB")

print("\nTagged Sentence:")
for word, tag in tags:
    print(word, "->", tag)
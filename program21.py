import spacy

nlp = spacy.load("en_core_web_sm")

text = "The intelligent student reads a computer science book."

doc = nlp(text)

print("Noun Phrases and their meanings:\n")

for chunk in doc.noun_chunks:
    print("Noun Phrase:", chunk.text)

    # Print the main noun and its semantic information
    for token in chunk:
        if token.pos_ in ["NOUN", "PROPN"]:
            print("Meaning:", token.lemma_)
            print("Part of Speech:", token.pos_)
            break

    print()
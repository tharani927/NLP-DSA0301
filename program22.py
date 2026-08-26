import spacy

nlp = spacy.load("en_core_web_sm")

text = "John went to the library. He borrowed a book. The book was interesting."

doc = nlp(text)

# Store previously identified nouns
entities = []

print("Reference Resolution:\n")

for token in doc:
    if token.pos_ in ["PROPN", "NOUN"]:
        entities.append(token.text)

    if token.pos_ == "PRON":
        if token.text.lower() in ["he", "she", "it", "they"]:
            if entities:
                print(token.text, "->", entities[-1])
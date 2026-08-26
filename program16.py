import spacy

# Load the English NLP model
nlp = spacy.load("en_core_web_sm")

text = "Apple was founded by Steve Jobs in California in 1976."

# Process the text
doc = nlp(text)

print("Named Entities:")

for ent in doc.ents:
    print(ent.text, "->", ent.label_)
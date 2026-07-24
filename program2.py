import nltk
from nltk.tokenize import sent_tokenize

text = input("Enter a paragraph: ")

sentences = sent_tokenize(text)

print("Sentences:")
for sentence in sentences:
    print(sentence)
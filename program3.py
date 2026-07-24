import nltk
from nltk.tokenize import word_tokenize

text = input("Enter a sentence: ")

words = word_tokenize(text)

print("Words:")
print(words)
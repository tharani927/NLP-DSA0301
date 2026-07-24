from nltk.tokenize import word_tokenize

text = input("Enter a paragraph: ")

words = word_tokenize(text)

print("Total Words:", len(words))
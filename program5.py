import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

text = input("Enter a sentence: ")

words = word_tokenize(text)

stop_words = set(stopwords.words('english'))

filtered_words = []

for word in words:
    if word.lower() not in stop_words:
        filtered_words.append(word)

print("After Removing Stop Words:")
print(filtered_words)
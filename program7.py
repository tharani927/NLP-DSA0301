from nltk.tokenize import word_tokenize

text = input("Enter a paragraph: ")

words = word_tokenize(text.lower())

frequency = {}

for word in words:
    if word.isalpha():
        if word in frequency:
            frequency[word] += 1
        else:
            frequency[word] = 1

print("Word Frequency:")

for word, count in frequency.items():
    print(word, ":", count)
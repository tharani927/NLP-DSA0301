import re
sentence = input("Enter a sentence: ").split()

print("\nPOS Tags:")

for word in sentence:
    if re.fullmatch(r".*ing", word):
        tag = "VERB"
    elif re.fullmatch(r".*ly", word):
        tag = "ADV"
    elif re.fullmatch(r".*ed", word):
        tag = "VERB"
    elif word[0].isupper():
        tag = "NOUN"
    else:
        tag = "NOUN"

    print(word, "->", tag)
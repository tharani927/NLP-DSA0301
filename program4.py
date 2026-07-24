import string

text = input("Enter a sentence: ")

result = ""

for ch in text:
    if ch not in string.punctuation:
        result += ch

print("Text without punctuation:")
print(result)
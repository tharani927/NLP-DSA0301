agreement = {
    ("He", "runs"),
    ("She", "runs"),
    ("They", "run"),
    ("I", "run")
}

sentence = input("Enter sentence: ").split()

if len(sentence) >= 2:
    if (sentence[0], sentence[1]) in agreement:
        print("Agreement Correct")
    else:
        print("Agreement Incorrect")
else:
    print("Invalid Sentence")
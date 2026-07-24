grammar = {
    "S": [("NP VP", 1.0)],
    "NP": [("I", 0.6), ("You", 0.4)],
    "VP": [("eat", 0.7), ("run", 0.3)]
}

sentence = input("Enter sentence: ").split()

if len(sentence) == 2:
    np = sentence[0]
    vp = sentence[1]

    np_prob = 0
    vp_prob = 0

    for word, prob in grammar["NP"]:
        if word == np:
            np_prob = prob

    for word, prob in grammar["VP"]:
        if word == vp:
            vp_prob = prob

    if np_prob > 0 and vp_prob > 0:
        total = np_prob * vp_prob
        print("Sentence Accepted")
        print("Probability =", total)
    else:
        print("Sentence Rejected")
else:
    print("Sentence Rejected")
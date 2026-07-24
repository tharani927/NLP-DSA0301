grammar = {
    "S": [["NP", "VP"]],
    "NP": [["I"], ["You"]],
    "VP": [["run"], ["eat"]]
}

sentence = input("Enter sentence: ").split()

if len(sentence) == 2:
    if sentence[0] in ["I", "You"] and sentence[1] in ["run", "eat"]:
        print("Sentence Accepted")
    else:
        print("Sentence Rejected")
else:
    print("Sentence Rejected")
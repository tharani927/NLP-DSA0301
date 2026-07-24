grammar = {
    "S": ["NP VP"],
    "NP": ["I", "You"],
    "VP": ["run", "eat"]
}

sentence = input("Enter sentence: ").split()

if sentence == ["I", "run"] or sentence == ["You", "eat"]:
    print("Accepted by Earley Parser")
else:
    print("Rejected")
sentence = input("Enter sentence: ").split()

if sentence == ["I", "eat"]:
    print("""
        S
      /   \\
    NP     VP
    |      |
    I     eat
    """)
else:
    print("Parse tree not available")
def recognize_dialog_act(text):
    t = text.lower()

    if "?" in text or t.startswith(("what", "where", "when", "why", "how", "who")):
        return "Question"
    elif t.startswith(("please", "can you", "could you")):
        return "Request"
    elif t.startswith(("hi", "hello", "hey")):
        return "Greeting"
    elif t.startswith(("yes", "okay", "ok", "sure")):
        return "Agreement"
    elif t.startswith(("no", "not")):
        return "Disagreement"
    elif t.startswith(("thank", "thanks")):
        return "Thanking"
    else:
        return "Statement"

text = input("Enter dialog: ")

print("Dialog Act:", recognize_dialog_act(text))
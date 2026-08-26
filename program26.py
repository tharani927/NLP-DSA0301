from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

m = "Helsinki-NLP/opus-mt-en-fr"

t = AutoTokenizer.from_pretrained(m)
model = AutoModelForSeq2SeqLM.from_pretrained(m)

text = input("Enter English text: ")

x = t(text, return_tensors="pt")
y = model.generate(**x)

print("French:", t.decode(y[0], skip_special_tokens=True))
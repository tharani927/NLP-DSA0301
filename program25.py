from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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"
)

prompt = input("Enter prompt: ")

response = client.chat.completions.create(
    model="openrouter/free",
    messages=[
        {"role": "user", "content": prompt}
    ]
)

print("Generated Text:")
print(response.choices[0].message.content)
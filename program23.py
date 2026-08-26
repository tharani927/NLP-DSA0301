from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("all-MiniLM-L6-v2")

text = """
Python is a popular programming language.
Python is widely used in machine learning.
Machine learning is used to build intelligent applications.
"""

sentences = [s.strip() for s in text.strip().split(".") if s.strip()]

embeddings = model.encode(sentences)

print("Sentence Similarity:\n")

total_similarity = 0

for i in range(len(sentences) - 1):
    similarity = cosine_similarity(
        [embeddings[i]],
        [embeddings[i + 1]]
    )[0][0]

    total_similarity += similarity

    print("Sentence", i + 1, "and Sentence", i + 2)
    print("Similarity:", round(similarity, 4))
    print()

average = total_similarity / (len(sentences) - 1)

print("Overall Coherence Score:", round(average, 4))
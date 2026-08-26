from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

documents = [
    "Python is a programming language",
    "Python is used for machine learning",
    "Java is a programming language",
    "Machine learning uses Python"
]

query = "Python machine learning"

# Create TF-IDF vectors
vectorizer = TfidfVectorizer()

doc_vectors = vectorizer.fit_transform(documents)
query_vector = vectorizer.transform([query])

# Calculate cosine similarity
similarity = cosine_similarity(query_vector, doc_vectors)[0]

# Rank documents
ranking = similarity.argsort()[::-1]

print("Document Ranking:")

for i in ranking:
    print("Document", i + 1, "-> Score:", round(similarity[i], 4))
    print(documents[i])
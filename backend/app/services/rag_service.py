import os
import chromadb
from chromadb.utils import embedding_functions
from dotenv import load_dotenv

load_dotenv()

# Initialize ChromaDB persistent client
# This creates a SQLite database locally inside your 'data' folder
chroma_client = chromadb.PersistentClient(path="./data/chroma_db")

# We use OpenAI's fast and cheap embedding model to convert text to vectors
openai_ef = embedding_functions.OpenAIEmbeddingFunction(
    api_key=os.getenv("OPENAI_API_KEY"),
    model_name="text-embedding-3-small"
)

# Get or create a collection (similar to a table in SQL)
collection = chroma_client.get_or_create_collection(
    name="architecture_best_practices",
    embedding_function=openai_ef # type: ignore
)

def seed_database():
    """
    Populates the vector database with baseline architectural knowledge.
    In a production app, you would scrape official docs or AWS whitepapers.
    """
    if collection.count() > 0:
        return  # Skip if already seeded

    print("Seeding Vector DB with architectural patterns...")
    
    # Core engineering principles to ground the AI
    patterns = [
        "Data Warehousing: When dealing with massive analytical workloads, prefer columnar data warehouses like BigQuery over relational databases. Decouple storage and compute.",
        "ML Serving: For serving parametric signature models (e.g., XGBoost) with high throughput, deploy behind a load-balanced stateless API layer (like FastAPI). Cache frequent predictions using Redis.",
        "Event-Driven Architecture: For real-time processing, use a streaming platform like Kafka or Spark Streaming. Ensure idempotent processing to handle retries without duplicating data.",
        "Web Architecture: Decouple the frontend from the backend. Serve static frontend assets (like Next.js or Hugo builds) via a CDN, and route dynamic requests to scalable backend services.",
        "Reliability: Always implement Dead Letter Queues (DLQs) and circuit breakers for message-driven architectures to isolate bottlenecks and handle failed events."
    ]
    
    # Generate unique IDs for the documents
    ids = [f"pattern_{i}" for i in range(len(patterns))]
    
    # Add to ChromaDB (this automatically calculates embeddings via OpenAI and stores them)
    collection.add(
        documents=patterns,
        ids=ids
    )
    print("Seeding complete! Vector DB is ready.")

def retrieve_relevant_patterns(user_architecture: str, n_results: int = 2) -> str:
    """
    Searches the vector database for patterns most relevant to the user's design.
    """
    # Ensure DB has data before querying
    if collection.count() == 0:
        seed_database()

    # Query the collection
    results = collection.query(
        query_texts=[user_architecture],
        n_results=n_results
    )
    
    # Combine retrieved documents into a single context string for the LLM
    if results['documents'] and results['documents'][0]:
        retrieved_text = "\n\n".join(results['documents'][0])
        return retrieved_text
    
    return "No specific architectural patterns found."
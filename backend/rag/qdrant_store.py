from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from rag.embeddings import HF_EMBEDDING_DIM, get_embedding
import uuid

client = QdrantClient(":memory:")
COLLECTION_NAME = "recruitment_kb"
CHUNK_SIZE = 900
CHUNK_OVERLAP = 150

def create_collection():
    existing = [c.name for c in client.get_collections().collections]
    if COLLECTION_NAME not in existing:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=HF_EMBEDDING_DIM, distance=Distance.COSINE)
        )


def chunk_text(text):
    cleaned = "\n".join(line.strip() for line in text.splitlines() if line.strip())
    if len(cleaned) <= CHUNK_SIZE:
        return [cleaned] if cleaned else []

    chunks = []
    start = 0
    while start < len(cleaned):
        end = start + CHUNK_SIZE
        chunks.append(cleaned[start:end])
        next_start = end - CHUNK_OVERLAP
        start = next_start if next_start > start else end
    return chunks


def point_id_for(text, metadata, index):
    key = f"{metadata.get('type', 'document')}:{index}:{text}"
    return str(uuid.uuid5(uuid.NAMESPACE_URL, key))


def store_document(text, metadata=None):
    metadata = metadata or {}
    points = []
    for index, chunk in enumerate(chunk_text(text)):
        embedding = get_embedding(chunk)
        points.append(
            PointStruct(
                id=point_id_for(chunk, metadata, index),
                vector=embedding,
                payload={"text": chunk, "chunk_index": index, **metadata}
            )
        )

    if points:
        client.upsert(collection_name=COLLECTION_NAME, points=points)

def search_documents(query, top_k=3):
    embedding = get_embedding(query)
    if hasattr(client, "query_points"):
        response = client.query_points(
            collection_name=COLLECTION_NAME,
            query=embedding,
            limit=top_k,
            with_payload=True,
        )
        results = response.points
    else:
        results = client.search(
            collection_name=COLLECTION_NAME,
            query_vector=embedding,
            limit=top_k
        )
    return [r.payload["text"] for r in results]

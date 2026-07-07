import json
import os
import time
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

from utils.env import load_project_env

load_project_env()

HF_API_TOKEN = os.getenv("HF_API_TOKEN")
HF_EMBEDDING_MODEL = os.getenv(
    "HF_EMBEDDING_MODEL",
    "sentence-transformers/all-MiniLM-L6-v2",
)
HF_EMBEDDING_DIM = int(os.getenv("HF_EMBEDDING_DIM", "384"))
HF_API_URL = (
    "https://api-inference.huggingface.co/pipeline/feature-extraction/"
    f"{quote(HF_EMBEDDING_MODEL, safe='')}"
)


def normalize_embedding(payload):
    if not payload:
        raise RuntimeError("Hugging Face returned an empty embedding response.")

    if isinstance(payload, list) and payload and isinstance(payload[0], (int, float)):
        return [float(value) for value in payload]

    if isinstance(payload, list) and payload and isinstance(payload[0], list):
        first_embedding = payload[0]
        if first_embedding and isinstance(first_embedding[0], list):
            first_embedding = first_embedding[0]
        return [float(value) for value in first_embedding]

    raise RuntimeError("Unexpected Hugging Face embedding response shape.")


def request_embedding(text):
    if not HF_API_TOKEN:
        raise RuntimeError("HF_API_TOKEN is required for hosted RAG embeddings.")

    body = json.dumps({
        "inputs": text,
        "options": {"wait_for_model": True},
    }).encode("utf-8")

    request = Request(
        HF_API_URL,
        data=body,
        headers={
            "Authorization": f"Bearer {HF_API_TOKEN}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    with urlopen(request, timeout=45) as response:
        return json.loads(response.read().decode("utf-8"))


def get_embedding(text):
    cleaned = " ".join(text.split())[:4000]
    if not cleaned:
        cleaned = "empty"

    for attempt in range(3):
        try:
            embedding = normalize_embedding(request_embedding(cleaned))
            if len(embedding) != HF_EMBEDDING_DIM:
                raise RuntimeError(
                    f"Embedding dimension mismatch: expected {HF_EMBEDDING_DIM}, got {len(embedding)}."
                )
            return embedding
        except HTTPError as exc:
            message = exc.read().decode("utf-8", errors="ignore")
            if exc.code == 503 and attempt < 2:
                time.sleep(2 + attempt * 3)
                continue
            raise RuntimeError(f"Hugging Face embedding request failed: {message}") from exc
        except URLError as exc:
            if attempt < 2:
                time.sleep(2 + attempt * 3)
                continue
            raise RuntimeError(f"Hugging Face embedding request failed: {exc}") from exc

    raise RuntimeError("Hugging Face embedding request failed after retries.")

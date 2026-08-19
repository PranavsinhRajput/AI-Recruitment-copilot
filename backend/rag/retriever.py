from groq import Groq
import os
from utils.env import load_project_env
from rag.qdrant_store import search_documents

load_project_env()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def ask_with_rag(question, missing_skills=None):
    chunks = search_documents(question, top_k=3)
    context = "\n\n".join(chunks)
    skills_context = ", ".join(missing_skills or [])
    prompt = f"""You are a helpful career assistant.
Use the following context to answer the question.
Context:
{context}

Known missing skills:
{skills_context or "Not available"}

Question: {question}
Answer:"""
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": "You are a concise assistant. Never use markdown tables, headers, or emojis in your responses unless explicitly asked. Respond in plain text or simple numbered/bulleted lists only."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content.strip()


def compact_context(text, max_chars=2500):
    return " ".join(text.split())[:max_chars]


def ask_with_rag(question, missing_skills=None):
    chunks = search_documents(question, top_k=3)
    context = "\n\n".join(chunks)
    skills_context = ", ".join(missing_skills or [])
    prompt = f"""You are a helpful career assistant.
Use the following context to answer the question.
Context:
{context}

Known missing skills:
{skills_context or "Not available"}

Question: {question}
Answer:"""
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": "You are a concise assistant. Never use markdown tables, headers, or emojis in your responses unless explicitly asked. Respond in plain text or simple numbered/bulleted lists only."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content.strip()

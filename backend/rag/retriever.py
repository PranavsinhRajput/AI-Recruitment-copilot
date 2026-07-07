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
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()


def compact_context(text, max_chars=2500):
    return " ".join(text.split())[:max_chars]


def ask_with_direct_context(question, resume_text="", jd_text="", missing_skills=None):
    skills_context = ", ".join(missing_skills or [])
    prompt = f"""You are a helpful career assistant.
Answer using the uploaded resume and job description context.
If the user asks about fit, gaps, improvements, interviews, or roadmap, be specific and practical.

Resume context:
{compact_context(resume_text)}

Job description context:
{compact_context(jd_text)}

Known missing skills:
{skills_context or "Not available"}

Question: {question}
Answer:"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()

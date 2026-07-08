from groq import Groq
import os
from utils.env import load_project_env

load_project_env()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_roadmap(missing_skills, days=30):
    skills_list = ", ".join(missing_skills)
    if days <= 7:
        format_instruction = f"""Create a day-wise roadmap with exactly {days} sections.
Use this structure:
Day 1: Focus topic
- Learn:
- Practice:
- Deliverable:

Continue until Day {days}. Keep each day practical and achievable."""
    else:
        format_instruction = f"""Create a weekly roadmap scoped to exactly {days} days.
Use week sections, and include the day range in each heading, for example:
Week 1 (Days 1-7): ...
Week 2 (Days 8-14): ...

If the final week is shorter than 7 days, label it with the exact remaining day range."""

    prompt = f"""You are an expert career coach for GenAI and software engineering roles.
Build a focused learning roadmap for these missing skills: {skills_list}

Roadmap duration: {days} days.

Rules:
- Prioritize the skills most relevant to the target role.
- Keep the roadmap specific, practical, and action-oriented.
- Include practice tasks and concrete outputs, not only theory.
- Do not change the requested duration.
- Do not add unrelated skills unless they are necessary prerequisites.

{format_instruction}"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()

def generate_interview_questions(resume_text, jd_text):
    prompt = f"""You are an expert interviewer.
Generate 10 interview questions based on this resume and job description.
Mix technical and behavioral questions.
Resume: {resume_text}
Job Description: {jd_text}
Return as a numbered list."""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()

import json
import os
import re

from groq import Groq
from utils.env import load_project_env

load_project_env()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def compact_text(text, max_chars=1800):
    cleaned = re.sub(r'\s+', ' ', text).strip()
    return cleaned[:max_chars]


def extract_relevant_lines(text, keywords, max_chars=1800):
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    selected = []
    lowered_keywords = [keyword.lower() for keyword in keywords]

    for line in lines:
        lower_line = line.lower()
        if any(keyword in lower_line for keyword in lowered_keywords):
            selected.append(line)

    if not selected:
        return compact_text(text, max_chars=max_chars)

    return compact_text("\n".join(selected), max_chars=max_chars)


def clamp_score(value):
    try:
        score = float(value)
    except (TypeError, ValueError):
        return 0
    return max(0, min(100, round(score, 2)))


def semantic_similarity(resume_text, jd_text, resume_skills=None, jd_skills=None):
    resume_skills = resume_skills or []
    jd_skills = jd_skills or []

    candidate_profile = f"""
Skills: {", ".join(resume_skills[:40])}
Relevant resume lines:
{extract_relevant_lines(
    resume_text,
    ["summary", "experience", "project", "skills", "education", "intern", "developer", "engineer"],
    max_chars=2200,
)}
"""

    job_profile = f"""
Required skills: {", ".join(jd_skills[:40])}
Relevant job description lines:
{extract_relevant_lines(
    jd_text,
    ["require", "responsib", "skill", "qualification", "experience", "education", "role", "developer", "engineer"],
    max_chars=2200,
)}
"""

    prompt = f"""You are an ATS semantic matcher.
Compare the candidate profile and job profile for role fit.
Do not score only exact keyword overlap. Consider:
- related technologies
- project relevance
- responsibility alignment
- domain fit
- seniority fit

Return ONLY valid JSON in this exact shape:
{{"semantic_score": 0}}

The score must be a number from 0 to 100.

Candidate Profile:
{candidate_profile[:2600]}

Job Profile:
{job_profile[:2600]}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
            max_tokens=40,
        )
        raw = response.choices[0].message.content.strip()
        parsed = json.loads(raw)
        return clamp_score(parsed.get("semantic_score"))
    except Exception:
        resume_set = set(s.lower() for s in resume_skills)
        jd_set = set(s.lower() for s in jd_skills)
        if not jd_set:
            return 0
        return round((len(resume_set.intersection(jd_set)) / len(jd_set)) * 100, 2)

def extract_years_required(jd_text):
    patterns = [
        r'(\d+)\+?\s*years?\s*of\s*experience',
        r'(\d+)\+?\s*years?\s*experience',
        r'minimum\s*(\d+)\s*years?',
        r'at\s*least\s*(\d+)\s*years?',
    ]
    for pattern in patterns:
        match = re.search(pattern, jd_text.lower())
        if match:
            return int(match.group(1))
    return 0

def extract_years_in_resume(resume_text):
    patterns = [
        r'(\d+)\+?\s*years?\s*of\s*experience',
        r'(\d+)\+?\s*years?\s*experience',
        r'experience\s*of\s*(\d+)\s*years?',
    ]
    for pattern in patterns:
        match = re.search(pattern, resume_text.lower())
        if match:
            return int(match.group(1))
    return 0

def check_experience_match(resume_text, jd_text):
    required = extract_years_required(jd_text)
    available = extract_years_in_resume(resume_text)
    if required == 0:
        return 100, f"No specific experience requirement found in JD"
    if available >= required:
        return 100, f"✅ Required: {required}+ years | You have: {available} years"
    elif available > 0:
        score = round((available / required) * 100)
        return score, f"⚠️ Required: {required}+ years | You have: {available} years"
    else:
        return 50, f"ℹ️ Required: {required}+ years | Could not detect years in resume"

def check_education_match(resume_text, jd_text):
    education_levels = {
        "phd": 5, "doctorate": 5,
        "m.tech": 4, "mtech": 4, "m.e": 4, "masters": 4, "mba": 4, "msc": 4, "m.sc": 4,
        "b.tech": 3, "btech": 3, "b.e": 3, "bachelor": 3, "bsc": 3, "b.sc": 3, "degree": 3,
        "diploma": 2,
        "12th": 1, "hsc": 1, "intermediate": 1,
        "10th": 0, "ssc": 0,
    }
    jd_lower = jd_text.lower()
    resume_lower = resume_text.lower()

    jd_level = 0
    jd_edu = "Not specified"
    for edu, level in education_levels.items():
        if edu in jd_lower:
            if level > jd_level:
                jd_level = level
                jd_edu = edu.upper()

    resume_level = 0
    resume_edu = "Not found"
    for edu, level in education_levels.items():
        if edu in resume_lower:
            if level > resume_level:
                resume_level = level
                resume_edu = edu.upper()

    if jd_level == 0:
        return 100, "✅ No specific education requirement in JD"
    if resume_level >= jd_level:
        return 100, f"✅ Required: {jd_edu} | You have: {resume_edu}"
    else:
        return 50, f"⚠️ Required: {jd_edu} | You have: {resume_edu}"

def check_resume_format(resume_text):
    score = 100
    issues = []
    suggestions = []

    if len(resume_text) < 200:
        score -= 30
        issues.append("❌ Resume text too short — ATS may not read it properly")
        suggestions.append("Add more content to your resume")

    important_sections = ["experience", "education", "skills"]
    for section in important_sections:
        if section not in resume_text.lower():
            score -= 15
            issues.append(f"❌ Missing '{section.upper()}' section heading")
            suggestions.append(f"Add a clear '{section.upper()}' section")

    contact_indicators = ["@", "phone", "email", "linkedin", "github"]
    has_contact = any(c in resume_text.lower() for c in contact_indicators)
    if not has_contact:
        score -= 10
        issues.append("❌ No contact information detected")
        suggestions.append("Add email, phone, LinkedIn to your resume")

    if len(resume_text.split()) < 100:
        score -= 20
        issues.append("❌ Resume seems too short")
        suggestions.append("Expand your experience and skills sections")

    if not issues:
        issues.append("✅ Resume format looks good!")

    return max(score, 0), issues, suggestions

def calculate_ats_score(resume_skills, jd_skills, resume_text="", jd_text=""):
    resume_set = set([s.lower() for s in resume_skills])
    jd_set = set([s.lower() for s in jd_skills])

    matched = resume_set.intersection(jd_set)
    missing = jd_set - resume_set

    keyword_score = round((len(matched) / len(jd_set)) * 100) if jd_set else 0

    if resume_text and jd_text:
        semantic_score = semantic_similarity(resume_text, jd_text, resume_skills, jd_skills)
        experience_score, experience_msg = check_experience_match(resume_text, jd_text)
        education_score, education_msg = check_education_match(resume_text, jd_text)
        format_score, format_issues, format_suggestions = check_resume_format(resume_text)
    else:
        semantic_score = 0
        experience_score = 0
        experience_msg = "No data"
        education_score = 0
        education_msg = "No data"
        format_score = 0
        format_issues = []
        format_suggestions = []

    final_score = round(
        (keyword_score * 0.30) +
        (semantic_score * 0.30) +
        (experience_score * 0.20) +
        (education_score * 0.10) +
        (format_score * 0.10)
    )

    return {
        "ats_score": final_score,
        "keyword_score": keyword_score,
        "semantic_score": semantic_score,
        "experience_score": experience_score,
        "experience_msg": experience_msg,
        "education_score": education_score,
        "education_msg": education_msg,
        "format_score": format_score,
        "format_issues": format_issues,
        "format_suggestions": format_suggestions,
        "matched_skills": list(matched),
        "missing_skills": list(missing),
        "total_jd_skills": len(jd_set),
        "total_matched": len(matched)
    }

# def calculate_ats_score(resume_skills, jd_skills):
#     resume_set = set([s.lower() for s in resume_skills])
#     jd_set = set([s.lower() for s in jd_skills])
#     matched = resume_set.intersection(jd_set)
#     missing = jd_set - resume_set
#     score = round((len(matched) / len(jd_set)) * 100) if jd_set else 0
#     return {
#         "ats_score": score,
#         "matched_skills": list(matched),
#         "missing_skills": list(missing),
#         "total_jd_skills": len(jd_set),
#         "total_matched": len(matched)
#     }

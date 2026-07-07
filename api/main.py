from pathlib import Path
from typing import Any

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agents.resume_agent import resume_agent
from agents.router_agent import router_agent
from ats.ats_score import calculate_ats_score
from ats.skill_extractor import extract_skills, extract_text_from_pdf
from cover_letter.generator import generate_cover_letter
from rag.qdrant_store import create_collection, store_document
from roadmap.roadmap_generator import generate_interview_questions, generate_roadmap


ROOT_DIR = Path(__file__).resolve().parents[1]
UPLOAD_DIR = ROOT_DIR / "data" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="AI Recruitment Copilot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class JobDescriptionRequest(BaseModel):
    jobDescription: str


class TextPairRequest(BaseModel):
    resumeText: str
    jdText: str


class ResumeTextRequest(BaseModel):
    resumeText: str


class RoadmapRequest(BaseModel):
    missingSkills: list[str]


class ChatRequest(BaseModel):
    query: str
    resumeText: str = ""
    jdText: str = ""
    missingSkills: list[str] = []


def require_text(value: str, label: str) -> str:
    cleaned = value.strip()
    if not cleaned:
        raise HTTPException(status_code=400, detail=f"{label} is required.")
    return cleaned


async def save_upload(file: UploadFile, filename: str) -> Path:
    path = UPLOAD_DIR / filename
    path.write_bytes(await file.read())
    return path


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/resume")
async def upload_resume(file: UploadFile = File(...)) -> dict[str, Any]:
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Resume must be a PDF file.")

    path = await save_upload(file, "resume.pdf")
    resume_text = extract_text_from_pdf(str(path))
    if not resume_text.strip():
        raise HTTPException(status_code=422, detail="Could not extract text from this PDF.")

    return {
        "filename": file.filename,
        "resumeText": resume_text,
        "characters": len(resume_text),
    }


@app.post("/api/job-description")
def save_job_description(payload: JobDescriptionRequest) -> dict[str, Any]:
    jd_text = require_text(payload.jobDescription, "Job description")
    return {
        "jdText": jd_text,
        "characters": len(jd_text),
    }


@app.post("/api/ats-analysis")
def run_ats_analysis(payload: TextPairRequest) -> dict[str, Any]:
    resume_text = require_text(payload.resumeText, "Resume text")
    jd_text = require_text(payload.jdText, "Job description")
    resume_skills = extract_skills(resume_text, "resume")
    jd_skills = extract_skills(jd_text, "job description")
    result = calculate_ats_score(
        resume_skills,
        jd_skills,
        resume_text=resume_text,
        jd_text=jd_text,
    )
    return {
        "result": result,
        "resumeSkills": resume_skills,
        "jdSkills": jd_skills,
    }


@app.post("/api/resume-analysis")
def analyze_resume(payload: ResumeTextRequest) -> dict[str, str]:
    resume_text = require_text(payload.resumeText, "Resume text")
    return {"analysis": resume_agent(resume_text)}


@app.post("/api/cover-letter")
def cover_letter(payload: TextPairRequest) -> dict[str, str]:
    resume_text = require_text(payload.resumeText, "Resume text")
    jd_text = require_text(payload.jdText, "Job description")
    return {"coverLetter": generate_cover_letter(resume_text, jd_text)}


@app.post("/api/interview-questions")
def interview_questions(payload: TextPairRequest) -> dict[str, str]:
    resume_text = require_text(payload.resumeText, "Resume text")
    jd_text = require_text(payload.jdText, "Job description")
    return {"questions": generate_interview_questions(resume_text, jd_text)}


@app.post("/api/roadmap")
def roadmap(payload: RoadmapRequest) -> dict[str, str]:
    if not payload.missingSkills:
        raise HTTPException(status_code=400, detail="Missing skills are required.")
    return {"roadmap": generate_roadmap(payload.missingSkills)}


@app.post("/api/chat")
def chat(payload: ChatRequest) -> dict[str, str]:
    query = require_text(payload.query, "Query")
    create_collection()
    if payload.resumeText.strip():
        store_document(payload.resumeText, {"type": "resume"})
    if payload.jdText.strip():
        store_document(payload.jdText, {"type": "jd"})
    answer = router_agent(
        query,
        resume_text=payload.resumeText,
        jd_text=payload.jdText,
        missing_skills=payload.missingSkills,
    )
    return {"answer": answer}

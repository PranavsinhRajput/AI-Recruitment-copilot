# AI Recruitment Copilot

AI Recruitment Copilot helps job seekers compare a resume against a job description,
calculate ATS fit, generate application materials, prepare for interviews, build a
learning roadmap, and chat with an AI career assistant.

## Features

| Feature | Description |
| --- | --- |
| Dashboard / ATS Score Calculator | Calculates keyword, semantic, experience, education, and format scores. |
| Skill Gap Analysis | Finds matched and missing skills between the resume and job description. |
| Resume Analysis | Reviews the resume and suggests improvements. |
| Cover Letter Generator | Creates a personalized cover letter from the resume and JD. |
| Interview Questions | Generates technical and behavioral interview questions. |
| Learning Roadmap | Builds a 30-day plan from missing skills after ATS analysis. |
| AI Chatbot | Answers career, resume, ATS, and interview questions using the uploaded context. |

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | Vite, React, TypeScript, Tailwind CSS, Framer Motion |
| Backend API | FastAPI, Uvicorn |
| AI | Groq API with LLaMA 3.3 70B |
| Embeddings | Sentence Transformers `all-MiniLM-L6-v2` |
| Vector Store | Qdrant in-memory client |
| Parsing | pdfplumber |

## Project Structure

```text
AI-Recruitment-Copilot/
├── agents/
├── api/
│   └── main.py
├── ats/
├── cover_letter/
├── data/
│   └── uploads/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── state/
│   │   └── views/
│   ├── package.json
│   └── tailwind.config.js
├── rag/
├── roadmap/
├── utils/
├── .env
└── requirements.txt
```

## Environment Variables

Create `.env` in the project root:

```bash
GROQ_API_KEY=your-groq-api-key-here
QDRANT_HOST=localhost
QDRANT_PORT=6333
```

Create `frontend/.env` if the API is not running on the default URL:

```bash
VITE_API_BASE_URL=http://localhost:8001
```

## Backend Setup

```bash
pip install -r requirements.txt
uvicorn api.main:app --reload --port 8001
```

Health check:

```bash
curl http://localhost:8001/health
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## App Flow

The Vite frontend starts on the upload screen. Upload a resume PDF and save a
job description first. Every other sidebar feature is disabled until both inputs
are successfully processed by the backend.

After both are ready:

1. Run Dashboard / ATS Analysis to calculate scores and missing skills.
2. Use Resume Analysis, Cover Letter, Interview Questions, or Chatbot.
3. Run Learning Roadmap after ATS Analysis so it can use the missing skills list.

## API Routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/health` | Backend health check. |
| POST | `/api/resume` | Upload and parse resume PDF. |
| POST | `/api/job-description` | Validate and save JD text. |
| POST | `/api/ats-analysis` | Extract skills and calculate ATS score. |
| POST | `/api/resume-analysis` | Generate resume review. |
| POST | `/api/cover-letter` | Generate cover letter. |
| POST | `/api/interview-questions` | Generate interview questions. |
| POST | `/api/roadmap` | Generate learning roadmap. |
| POST | `/api/chat` | Ask the AI career chatbot. |

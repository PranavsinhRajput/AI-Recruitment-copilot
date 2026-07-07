# AI Recruitment Copilot

AI Recruitment Copilot helps job seekers compare a resume against a job description,
calculate ATS fit, generate application materials, prepare for interviews, build a
learning roadmap, and chat with an AI career assistant.

## Project Layout

```text
AI-Recruitment-Copilot/
├── backend/
│   ├── agents/
│   ├── api/
│   │   └── main.py
│   ├── ats/
│   ├── cover_letter/
│   ├── data/
│   │   └── uploads/
│   ├── rag/
│   ├── roadmap/
│   ├── utils/
│   ├── .env
│   └── requirements.txt
└── frontend/
    ├── src/
    ├── package.json
    └── vite.config.js
```

## Features

| Feature | Description |
| --- | --- |
| Dashboard / ATS Score Calculator | Calculates keyword, semantic, experience, education, and format scores. |
| Skill Gap Analysis | Finds matched and missing skills between the resume and job description. |
| Resume Analysis | Reviews the resume and suggests improvements. |
| Cover Letter Generator | Creates a personalized cover letter from the resume and JD. |
| Interview Questions | Generates technical and behavioral interview questions. |
| Learning Roadmap | Builds a 30-day plan from missing skills after ATS analysis. |
| AI Chatbot | Answers career, resume, ATS, and interview questions using uploaded context and RAG. |

## Backend

Create `backend/.env`:

```bash
GROQ_API_KEY=your-groq-api-key-here
HF_API_TOKEN=your-hugging-face-token-here
HF_EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
HF_EMBEDDING_DIM=384
QDRANT_HOST=localhost
QDRANT_PORT=6333
```

Install and run:

```bash
cd backend
pip install -r requirements.txt
uvicorn api.main:app --reload --port 8001
```

Health check:

```bash
curl http://localhost:8001/health
```

## Frontend

Create `frontend/.env` if the API URL differs from the default:

```bash
VITE_API_BASE_URL=http://localhost:8001
```

Install and run:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

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

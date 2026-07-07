import { AtsResult, EmailResult, Recruiter } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8001";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers:
      options?.body instanceof FormData
        ? options.headers
        : { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!response.ok) {
    let message = "Request failed.";
    try {
      const payload = await response.json();
      message = payload.detail ?? message;
    } catch {
      message = response.statusText;
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export const api = {
  uploadResume(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return request<{ filename: string; resumeText: string; characters: number }>(
      "/api/resume",
      { method: "POST", body: formData },
    );
  },
  saveJobDescription(jobDescription: string) {
    return request<{ jdText: string; characters: number }>("/api/job-description", {
      method: "POST",
      body: JSON.stringify({ jobDescription }),
    });
  },
  runAtsAnalysis(resumeText: string, jdText: string) {
    return request<{ result: AtsResult; resumeSkills: string[]; jdSkills: string[] }>(
      "/api/ats-analysis",
      { method: "POST", body: JSON.stringify({ resumeText, jdText }) },
    );
  },
  analyzeResume(resumeText: string) {
    return request<{ analysis: string }>("/api/resume-analysis", {
      method: "POST",
      body: JSON.stringify({ resumeText }),
    });
  },
  generateCoverLetter(resumeText: string, jdText: string) {
    return request<{ coverLetter: string }>("/api/cover-letter", {
      method: "POST",
      body: JSON.stringify({ resumeText, jdText }),
    });
  },
  generateInterviewQuestions(resumeText: string, jdText: string) {
    return request<{ questions: string }>("/api/interview-questions", {
      method: "POST",
      body: JSON.stringify({ resumeText, jdText }),
    });
  },
  generateRoadmap(missingSkills: string[]) {
    return request<{ roadmap: string }>("/api/roadmap", {
      method: "POST",
      body: JSON.stringify({ missingSkills }),
    });
  },
  askChatbot(query: string, resumeText: string, jdText: string, missingSkills: string[]) {
    return request<{ answer: string }>("/api/chat", {
      method: "POST",
      body: JSON.stringify({ query, resumeText, jdText, missingSkills }),
    });
  },
  previewRecruiters(file: File, resumeSkills: string[]) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("resumeSkills", JSON.stringify(resumeSkills));
    return request<{ count: number; recruiters: Recruiter[]; preview: string }>(
      "/api/recruiters/preview",
      { method: "POST", body: formData },
    );
  },
  sendColdEmails(file: File, senderEmail: string, appPassword: string, delay: number, resumeSkills: string[]) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("senderEmail", senderEmail);
    formData.append("appPassword", appPassword);
    formData.append("delay", String(delay));
    formData.append("resumeSkills", JSON.stringify(resumeSkills));
    return request<{ total: number; results: EmailResult[] }>("/api/cold-emails/send", {
      method: "POST",
      body: formData,
    });
  },
};

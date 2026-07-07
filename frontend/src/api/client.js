const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8001";

async function request(path, options) {
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

  return response.json();
}

export const api = {
  async ping() {
    try {
      await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
        cache: "no-store",
      });
    } catch {
      // Keep-alive pings should never interrupt the user experience.
    }
  },
  uploadResume(file) {
    const formData = new FormData();
    formData.append("file", file);
    return request("/api/resume", { method: "POST", body: formData });
  },
  saveJobDescription(jobDescription) {
    return request("/api/job-description", {
      method: "POST",
      body: JSON.stringify({ jobDescription }),
    });
  },
  runAtsAnalysis(resumeText, jdText) {
    return request("/api/ats-analysis", {
      method: "POST",
      body: JSON.stringify({ resumeText, jdText }),
    });
  },
  analyzeResume(resumeText) {
    return request("/api/resume-analysis", {
      method: "POST",
      body: JSON.stringify({ resumeText }),
    });
  },
  generateCoverLetter(resumeText, jdText) {
    return request("/api/cover-letter", {
      method: "POST",
      body: JSON.stringify({ resumeText, jdText }),
    });
  },
  generateInterviewQuestions(resumeText, jdText) {
    return request("/api/interview-questions", {
      method: "POST",
      body: JSON.stringify({ resumeText, jdText }),
    });
  },
  generateRoadmap(missingSkills) {
    return request("/api/roadmap", {
      method: "POST",
      body: JSON.stringify({ missingSkills }),
    });
  },
  askChatbot(query, resumeText, jdText, missingSkills) {
    return request("/api/chat", {
      method: "POST",
      body: JSON.stringify({ query, resumeText, jdText, missingSkills }),
    });
  },
};

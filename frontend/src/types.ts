export type SectionId =
  | "upload"
  | "dashboard"
  | "resume-analysis"
  | "cover-letter"
  | "interview-questions"
  | "learning-roadmap"
  | "cold-email"
  | "chatbot";

export type AtsResult = {
  ats_score: number;
  keyword_score: number;
  semantic_score: number;
  experience_score: number;
  experience_msg: string;
  education_score: number;
  education_msg: string;
  format_score: number;
  format_issues: string[];
  format_suggestions: string[];
  matched_skills: string[];
  missing_skills: string[];
  total_jd_skills: number;
  total_matched: number;
};

export type Recruiter = {
  "Company Name": string;
  "HR / Contact Person": string;
  "Email ID": string;
};

export type EmailResult = {
  hr_name: string;
  company: string;
  email: string;
  status: string;
};

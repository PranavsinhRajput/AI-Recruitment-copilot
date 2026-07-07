import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, HelpCircle, Wand2 } from "lucide-react";
import { api } from "./api/client";
import { Sidebar } from "./components/Sidebar";
import { useUploadState } from "./state/UploadContext";
import { SectionId } from "./types";
import { ChatbotView } from "./views/ChatbotView";
import { ColdEmailView } from "./views/ColdEmailView";
import { DashboardView } from "./views/DashboardView";
import { GeneratedTextView } from "./views/GeneratedTextView";
import { LearningRoadmapView } from "./views/LearningRoadmapView";
import { UploadView } from "./views/UploadView";

const pageMotion = {
  initial: { opacity: 0, x: 14 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -14 },
  transition: { duration: 0.2, ease: "easeOut" },
};

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>("upload");
  const { resumeText, jdText } = useUploadState();

  function renderSection() {
    switch (activeSection) {
      case "upload":
        return <UploadView />;
      case "dashboard":
        return <DashboardView />;
      case "resume-analysis":
        return (
          <GeneratedTextView
            eyebrow="Resume Analysis"
            title="Resume Analysis"
            description="Get an AI-powered resume review with strengths, weaknesses, and improvement suggestions."
            buttonLabel="Analyze My Resume"
            icon={<FileText className="h-4 w-4" />}
            resultTitle="Resume Review"
            action={async () => {
              const response = await api.analyzeResume(resumeText);
              return response.analysis;
            }}
          />
        );
      case "cover-letter":
        return (
          <GeneratedTextView
            eyebrow="Cover Letter Generator"
            title="Cover Letter"
            description="Generate a concise cover letter tailored to your resume and target job description."
            buttonLabel="Generate Cover Letter"
            icon={<Wand2 className="h-4 w-4" />}
            resultTitle="Cover Letter"
            action={async () => {
              const response = await api.generateCoverLetter(resumeText, jdText);
              return response.coverLetter;
            }}
          />
        );
      case "interview-questions":
        return (
          <GeneratedTextView
            eyebrow="Interview Prep"
            title="Interview Questions"
            description="Generate technical and behavioral questions based on the uploaded resume and JD."
            buttonLabel="Generate Questions"
            icon={<HelpCircle className="h-4 w-4" />}
            resultTitle="Questions"
            action={async () => {
              const response = await api.generateInterviewQuestions(resumeText, jdText);
              return response.questions;
            }}
          />
        );
      case "learning-roadmap":
        return <LearningRoadmapView />;
      case "cold-email":
        return <ColdEmailView />;
      case "chatbot":
        return <ChatbotView />;
      default:
        return <UploadView />;
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7f8]">
      <Sidebar activeSection={activeSection} onSelect={setActiveSection} />
      <main className="ml-72 min-h-screen px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div key={activeSection} {...pageMotion}>
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

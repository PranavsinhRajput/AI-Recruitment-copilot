import { Fragment, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, HelpCircle, Wand2 } from "lucide-react";
import { api } from "./api/client";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { useUploadState } from "./state/UploadContext";
import { ChatbotView } from "./views/ChatbotView";
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
  const [activeSection, setActiveSection] = useState("upload");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(() => {
    return window.localStorage.getItem("ai-recruitment-sidebar-collapsed") === "true";
  });
  const { resumeText, jdText } = useUploadState();

  useEffect(() => {
    api.ping();
    const intervalId = window.setInterval(() => {
      api.ping();
    }, 10 * 60 * 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "ai-recruitment-sidebar-collapsed",
      String(isDesktopSidebarCollapsed),
    );
  }, [isDesktopSidebarCollapsed]);

  function handleMenuClick() {
    setIsMobileSidebarOpen((current) => !current);
  }

  function handleMobileSelect(sectionId) {
    setActiveSection(sectionId);
    setIsMobileSidebarOpen(false);
  }

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
            cacheKey="resume-analysis"
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
            cacheKey="cover-letter"
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
            cacheKey="interview-questions"
            action={async () => {
              const response = await api.generateInterviewQuestions(resumeText, jdText);
              return response.questions;
            }}
          />
        );
      case "learning-roadmap":
        return <LearningRoadmapView />;
      case "chatbot":
        return <ChatbotView />;
      default:
        return <UploadView />;
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-app pt-20 text-ink transition-colors">
      <Navbar onMenuClick={handleMenuClick} />

      <AnimatePresence>
        {isMobileSidebarOpen ? (
          <Fragment key="mobile-sidebar">
            <motion.button
              type="button"
              aria-label="Close sidebar"
              className="fixed inset-x-0 bottom-0 top-20 z-30 bg-black/45 backdrop-blur-[2px] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 top-20 z-40 w-[min(20rem,calc(100vw-1rem))] lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.24, ease: "easeOut" }}
            >
              <Sidebar activeSection={activeSection} mode="mobile" onSelect={handleMobileSelect} />
            </motion.div>
          </Fragment>
        ) : null}
      </AnimatePresence>

      <div className="flex h-[calc(100vh-5rem)] min-h-0">
        <motion.div
          className="hidden h-full shrink-0 lg:block"
          animate={{ width: isDesktopSidebarCollapsed ? 80 : 288 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        >
          <Sidebar
            activeSection={activeSection}
            collapsed={isDesktopSidebarCollapsed}
            onToggleCollapse={() => setIsDesktopSidebarCollapsed((current) => !current)}
            onSelect={setActiveSection}
          />
        </motion.div>

        <main className="min-w-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
          <AnimatePresence mode="wait">
            <motion.div key={activeSection} {...pageMotion}>
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

import {
  BarChart3,
  Bot,
  Check,
  FileText,
  HelpCircle,
  Lock,
  Mail,
  Map,
  Upload,
  Wand2,
} from "lucide-react";
import { motion } from "framer-motion";
import { SectionId } from "../types";
import { useUploadState } from "../state/UploadContext";

const sections: Array<{
  id: SectionId;
  label: string;
  locked: boolean;
  icon: typeof Upload;
}> = [
  { id: "upload", label: "Upload Resume + JD", locked: false, icon: Upload },
  { id: "dashboard", label: "Dashboard", locked: true, icon: BarChart3 },
  { id: "resume-analysis", label: "Resume Analysis", locked: true, icon: FileText },
  { id: "cover-letter", label: "Cover Letter", locked: true, icon: Wand2 },
  { id: "interview-questions", label: "Interview Questions", locked: true, icon: HelpCircle },
  { id: "learning-roadmap", label: "Learning Roadmap", locked: true, icon: Map },
  { id: "cold-email", label: "Cold Email Sender", locked: true, icon: Mail },
  { id: "chatbot", label: "AI Chatbot", locked: true, icon: Bot },
];

type Props = {
  activeSection: SectionId;
  onSelect: (section: SectionId) => void;
};

export function Sidebar({ activeSection, onSelect }: Props) {
  const { isReady, isResumeUploaded, isJDUploaded } = useUploadState();

  return (
    <aside className="fixed left-0 top-0 z-20 flex h-screen w-72 flex-col border-r border-slate-200 bg-ink px-4 py-5 text-white">
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-widest text-mint">AI Recruitment</p>
        <h1 className="mt-1 text-2xl font-bold tracking-normal">Copilot</h1>
      </div>

      <div className="mb-5 rounded-md bg-white/8 p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-300">Upload status</p>
        <StatusRow label="Resume" done={isResumeUploaded} />
        <StatusRow label="Job Description" done={isJDUploaded} />
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {sections.map((section) => {
          const locked = section.locked && !isReady;
          const Icon = section.icon;
          const selected = activeSection === section.id;

          return (
            <motion.button
              key={section.id}
              type="button"
              disabled={locked}
              onClick={() => onSelect(section.id)}
              animate={{ opacity: locked ? 0.38 : 1 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              whileHover={locked ? undefined : { scale: 1.02 }}
              className={`flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition ${
                selected ? "bg-mint text-white" : "text-slate-200 hover:bg-white/10"
              } ${locked ? "pointer-events-none grayscale" : ""}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="min-w-0 flex-1 truncate">{section.label}</span>
              {locked ? <Lock className="h-3.5 w-3.5 shrink-0" /> : null}
            </motion.button>
          );
        })}
      </nav>
    </aside>
  );
}

function StatusRow({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className={done ? "text-white" : "text-slate-400"}>{label}</span>
      <motion.span
        animate={{
          backgroundColor: done ? "#15a47f" : "rgba(148, 163, 184, 0.25)",
          color: done ? "#ffffff" : "#94a3b8",
        }}
        className="grid h-5 w-5 place-items-center rounded-full"
      >
        {done ? <Check className="h-3.5 w-3.5" /> : null}
      </motion.span>
    </div>
  );
}

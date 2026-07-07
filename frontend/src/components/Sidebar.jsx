import {
  BarChart3,
  Bot,
  Check,
  FileText,
  HelpCircle,
  Lock,
  Map,
  Upload,
  Wand2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useUploadState } from "../state/UploadContext";

const sections = [
  { id: "upload", label: "Upload Resume + JD", locked: false, icon: Upload },
  { id: "dashboard", label: "Dashboard", locked: true, icon: BarChart3 },
  { id: "resume-analysis", label: "Resume Analysis", locked: true, icon: FileText },
  { id: "cover-letter", label: "Cover Letter", locked: true, icon: Wand2 },
  { id: "interview-questions", label: "Interview Questions", locked: true, icon: HelpCircle },
  { id: "learning-roadmap", label: "Learning Roadmap", locked: true, icon: Map },
  { id: "chatbot", label: "AI Chatbot", locked: true, icon: Bot },
];

export function Sidebar({ activeSection, onSelect }) {
  const { isReady, isResumeUploaded, isJDUploaded } = useUploadState();

  return (
    <aside className="sticky top-[5.5rem] z-20 flex h-[calc(100vh-5.5rem)] w-72 shrink-0 flex-col border-r border-line bg-slatepanel px-4 py-5 text-ink shadow-soft transition-colors">
      <div className="mb-6 border-b border-line pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-mint">Workspace</p>
        <p className="mt-2 text-sm leading-6 text-muted">Upload once, then move through each hiring workflow without losing progress.</p>
      </div>

      <div className="mb-5 rounded-md border border-line bg-elevated p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-mint">Upload status</p>
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
                selected ? "bg-mint text-white shadow-button" : "text-muted hover:bg-elevated hover:text-ink"
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

function StatusRow({ label, done }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className={done ? "text-ink" : "text-muted"}>{label}</span>
      <motion.span
        animate={{
          backgroundColor: done ? "var(--color-accent)" : "var(--color-panel)",
          color: done ? "#ffffff" : "var(--color-muted)",
        }}
        className="grid h-5 w-5 place-items-center rounded-full border border-line"
      >
        {done ? <Check className="h-3.5 w-3.5" /> : null}
      </motion.span>
    </div>
  );
}

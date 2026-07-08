import {
  BarChart3,
  Bot,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
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

export function Sidebar({
  activeSection,
  onSelect,
  collapsed = false,
  mode = "desktop",
  onToggleCollapse,
}) {
  const { isReady, isResumeUploaded, isJDUploaded } = useUploadState();
  const isCollapsed = mode === "desktop" && collapsed;
  const CollapseIcon = isCollapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <aside
      className={`flex h-full w-full shrink-0 flex-col border-r border-line bg-slatepanel text-ink shadow-soft transition-colors ${
        isCollapsed ? "px-3 py-5" : "px-4 py-5"
      }`}
    >
      <div className={`mb-6 border-b border-line pb-5 ${isCollapsed ? "text-center" : ""}`}>
        <div className={`flex items-start ${isCollapsed ? "justify-center" : "justify-between gap-3"}`}>
          {!isCollapsed ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-mint">
              Workspace
            </p>
          ) : null}
          {mode === "desktop" ? (
            <motion.button
              type="button"
              onClick={onToggleCollapse}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-line bg-elevated text-muted shadow-soft transition hover:border-mint hover:text-mint"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <CollapseIcon className="h-4 w-4" />
            </motion.button>
          ) : null}
        </div>
        {!isCollapsed ? (
          <p className="mt-2 text-sm leading-6 text-muted">
            Upload once, then move through each hiring workflow without losing progress.
          </p>
        ) : null}
      </div>

      <div className={`mb-5 rounded-md border border-line bg-elevated p-3 ${isCollapsed ? "px-2" : ""}`}>
        {!isCollapsed ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-mint">Upload status</p>
        ) : null}
        <StatusRow label="Resume" done={isResumeUploaded} collapsed={isCollapsed} />
        <StatusRow label="Job Description" done={isJDUploaded} collapsed={isCollapsed} />
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
              title={isCollapsed ? section.label : undefined}
              className={`flex min-h-11 items-center rounded-md py-2 text-left text-sm font-medium transition ${
                selected ? "bg-mint text-white shadow-button" : "text-muted hover:bg-elevated hover:text-ink"
              } ${isCollapsed ? "justify-center px-2" : "gap-3 px-3"} ${locked ? "pointer-events-none grayscale" : ""}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!isCollapsed ? <span className="min-w-0 flex-1 truncate">{section.label}</span> : null}
              {locked && !isCollapsed ? <Lock className="h-3.5 w-3.5 shrink-0" /> : null}
            </motion.button>
          );
        })}
      </nav>
    </aside>
  );
}

function StatusRow({ label, done, collapsed = false }) {
  return (
    <div
      className={`flex items-center py-1 text-sm ${
        collapsed ? "justify-center" : "justify-between"
      }`}
      title={collapsed ? `${label}: ${done ? "uploaded" : "missing"}` : undefined}
    >
      {!collapsed ? <span className={done ? "text-ink" : "text-muted"}>{label}</span> : null}
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

import { useState } from "react";
import { FileUp, Save } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../api/client";
import { ActionButton } from "../components/ActionButton";
import { useUploadState } from "../state/UploadContext";

export function UploadView() {
  const { resumeFileName, jdText, setResume, setJobDescription } = useUploadState();
  const [jdDraft, setJdDraft] = useState(jdText);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(null);

  async function handleResume(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoading("resume");
    setError("");
    setStatus("");
    try {
      const response = await api.uploadResume(file);
      setResume(response.filename, response.resumeText);
      setStatus(`Resume processed: ${response.characters.toLocaleString()} characters extracted.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Resume upload failed.");
    } finally {
      setLoading(null);
    }
  }

  async function handleJD(event) {
    event.preventDefault();
    setLoading("jd");
    setError("");
    setStatus("");
    try {
      const response = await api.saveJobDescription(jdDraft);
      setJobDescription(response.jdText);
      setStatus(`Job description saved: ${response.characters.toLocaleString()} characters.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Job description save failed.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="max-w-5xl">
      <p className="text-sm font-semibold uppercase tracking-widest text-mint">Start here</p>
      <h2 className="mt-2 text-3xl font-bold text-ink">Upload Resume and Job Description</h2>
      <p className="mt-3 max-w-2xl text-muted">
        These two inputs unlock the rest of the copilot. The resume is parsed from PDF,
        and the job description is validated before the sidebar sections become active.
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <motion.label
          whileHover={{ scale: 1.01 }}
          className="flex min-h-72 cursor-pointer flex-col justify-between rounded-md border border-dashed border-line bg-panel p-6 shadow-soft transition hover:border-mint"
        >
          <div>
            <FileUp className="h-9 w-9 text-mint" />
            <h3 className="mt-5 text-xl font-semibold text-ink">Resume PDF</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Upload a PDF resume so the backend can extract the text used across
              analysis, scoring, cover letters, interview prep, and chat.
            </p>
          </div>
          <div>
            <p className="mb-3 truncate text-sm font-medium text-muted">
              {resumeFileName || "No resume uploaded yet"}
            </p>
            <span className="inline-flex rounded-md bg-gradient-to-b from-orange-400 to-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-button">
              {loading === "resume" ? "Processing..." : "Choose PDF"}
            </span>
            <input type="file" accept="application/pdf" className="sr-only" onChange={handleResume} />
          </div>
        </motion.label>

        <form onSubmit={handleJD} className="rounded-md border border-line bg-panel p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-ink">Job Description</h3>
          <textarea
            value={jdDraft}
            onChange={(event) => setJdDraft(event.target.value)}
            className="mt-4 h-52 w-full resize-none rounded-md border border-line bg-elevated p-3 text-sm leading-6 text-ink outline-none transition placeholder:text-muted/65 focus:border-mint focus:ring-2 focus:ring-mint/20"
            placeholder="Paste the full job description here..."
          />
          <div className="mt-4">
            <ActionButton type="submit" disabled={loading === "jd"}>
              <Save className="h-4 w-4" />
              {loading === "jd" ? "Saving..." : "Save JD"}
            </ActionButton>
          </div>
        </form>
      </div>

      {status ? <p className="mt-5 rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">{status}</p> : null}
      {error ? <p className="mt-5 rounded-md bg-rose-50 p-3 text-sm text-rose-800">{error}</p> : null}
    </div>
  );
}

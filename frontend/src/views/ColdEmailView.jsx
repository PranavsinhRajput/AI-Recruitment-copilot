import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { api } from "../api/client";
import { ActionButton } from "../components/ActionButton";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { useUploadState } from "../state/UploadContext";

export function ColdEmailView() {
  const { resumeSkills } = useUploadState();
  const [file, setFile] = useState(null);
  const [senderEmail, setSenderEmail] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [delay, setDelay] = useState(30);
  const [recruiters, setRecruiters] = useState([]);
  const [preview, setPreview] = useState("");
  const [results, setResults] = useState([]);
  const { loading, error, run } = useAsyncAction();

  async function handleFile(event) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    const response = await run(() => api.previewRecruiters(selected, resumeSkills));
    if (response) {
      setRecruiters(response.recruiters);
      setPreview(response.preview);
    }
  }

  async function handleSend(event) {
    event.preventDefault();
    if (!file) return;
    const response = await run(() =>
      api.sendColdEmails(file, senderEmail, appPassword, delay, resumeSkills),
    );
    if (response) setResults(response.results);
  }

  return (
    <div className="max-w-6xl">
      <p className="text-sm font-semibold uppercase tracking-widest text-mint">Recruiter Outreach</p>
      <h2 className="mt-2 text-3xl font-bold text-ink">Cold Email Sender</h2>
      <p className="mt-3 max-w-2xl text-muted">
        Upload an XLSX file with Company Name, HR / Contact Person, and Email ID columns,
        preview a personalized email, then send with your Gmail app password.
      </p>

      <form onSubmit={handleSend} className="mt-7 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-md border border-line bg-panel p-5 shadow-soft">
          <label className="text-sm font-semibold text-ink">Recruiter XLSX</label>
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFile}
            className="mt-2 block w-full rounded-md border border-line bg-elevated p-2 text-sm text-ink"
          />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Input label="Your Gmail" value={senderEmail} onChange={setSenderEmail} />
            <Input label="Gmail App Password" value={appPassword} onChange={setAppPassword} type="password" />
          </div>
          <label className="mt-5 block text-sm font-semibold text-ink">
            Delay between emails: {delay}s
          </label>
          <input
            type="range"
            min={10}
            max={60}
            value={delay}
            onChange={(event) => setDelay(Number(event.target.value))}
            className="mt-2 w-full accent-mint"
          />
          <div className="mt-5">
            <ActionButton type="submit" disabled={loading || !file || !senderEmail || !appPassword}>
              <Send className="h-4 w-4" />
              {loading ? "Working..." : `Send Emails${recruiters.length ? ` to ${recruiters.length}` : ""}`}
            </ActionButton>
          </div>
        </section>

        <section className="rounded-md border border-line bg-panel p-5 shadow-soft">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-mint" />
            <h3 className="text-lg font-semibold text-ink">Email Preview</h3>
          </div>
          <div className="mt-4 h-72 overflow-auto rounded-md bg-elevated p-4 text-sm leading-6 text-muted whitespace-pre-wrap">
            {preview || "Upload a recruiter workbook to preview the first email."}
          </div>
        </section>
      </form>

      {error ? <p className="mt-5 rounded-md bg-rose-50 p-3 text-sm text-rose-800">{error}</p> : null}

      {recruiters.length ? (
        <section className="mt-6 rounded-md border border-line bg-panel p-5 shadow-soft">
          <h3 className="text-lg font-semibold text-ink">Recruiters Found</h3>
          <div className="mt-4 overflow-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-elevated text-muted">
                <tr>
                  <th className="p-3">Company</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Email</th>
                </tr>
              </thead>
              <tbody>
                {recruiters.map((recruiter) => (
                  <tr key={recruiter["Email ID"]} className="border-t border-line">
                    <td className="p-3">{recruiter["Company Name"]}</td>
                    <td className="p-3">{recruiter["HR / Contact Person"]}</td>
                    <td className="p-3">{recruiter["Email ID"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {results.length ? (
        <section className="mt-6 rounded-md border border-line bg-panel p-5 shadow-soft">
          <h3 className="text-lg font-semibold text-ink">Send Results</h3>
          <div className="mt-3 space-y-2">
            {results.map((result) => (
              <p key={`${result.email}-${result.status}`} className="rounded-md bg-elevated p-3 text-sm text-muted">
                {result.status} - {result.hr_name} | {result.company} | {result.email}
              </p>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}) {
  return (
    <label className="block text-sm font-semibold text-ink">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-md border border-line bg-elevated p-2.5 text-sm font-normal text-ink outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20"
      />
    </label>
  );
}

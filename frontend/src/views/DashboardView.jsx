import { BarChart3 } from "lucide-react";
import { api } from "../api/client";
import { ActionButton } from "../components/ActionButton";
import { MetricCard } from "../components/MetricCard";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { useUploadState } from "../state/UploadContext";

export function DashboardView() {
  const { resumeText, jdText, atsResult, setAtsData } = useUploadState();
  const { loading, error, run } = useAsyncAction();

  async function handleRun() {
    const response = await run(() => api.runAtsAnalysis(resumeText, jdText));
    if (response) {
      setAtsData(response.result, response.resumeSkills);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-mint">ATS Score Calculator</p>
          <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">Dashboard</h2>
        </div>
        <ActionButton onClick={handleRun} disabled={loading}>
          <BarChart3 className="h-4 w-4" />
          {loading ? "Analyzing..." : atsResult ? "Regenerate ATS Analysis" : "Run Full ATS Analysis"}
        </ActionButton>
      </div>

      {error ? <p className="mt-5 rounded-md bg-rose-50 p-3 text-sm text-rose-800">{error}</p> : null}

      {atsResult ? (
        <div className="mt-7 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Final Score" value={`${atsResult.ats_score}%`} />
            <MetricCard label="Keywords" value={`${atsResult.keyword_score}%`} />
            <MetricCard label="Semantic" value={`${atsResult.semantic_score}%`} />
            <MetricCard label="Experience" value={`${atsResult.experience_score}%`} />
            <MetricCard label="Education" value={`${atsResult.education_score}%`} />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Panel title="Experience Analysis" items={[atsResult.experience_msg]} />
            <Panel title="Education Analysis" items={[atsResult.education_msg]} />
            <Panel title="Resume Format Check" items={atsResult.format_issues} />
            <Panel title="Suggestions" items={atsResult.format_suggestions.length ? atsResult.format_suggestions : ["No suggestions."]} />
            <Panel title="Matched Skills" items={atsResult.matched_skills} tone="good" />
            <Panel title="Missing Skills" items={atsResult.missing_skills} tone="warn" />
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-md border border-line bg-panel p-6 text-muted shadow-soft">
          Run the analysis to calculate keyword, semantic, experience, education, and format scores.
        </div>
      )}
    </div>
  );
}

function Panel({ title, items, tone = "neutral" }) {
  const toneClass =
    tone === "good"
      ? "bg-emerald-50 text-emerald-800"
      : tone === "warn"
        ? "bg-softaccent text-ink dark:text-red-500"
        : "bg-elevated text-muted";

  return (
    <section className="rounded-md border border-line bg-panel p-5 shadow-soft">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className={`rounded-md px-3 py-2 text-sm ${toneClass}`}>
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

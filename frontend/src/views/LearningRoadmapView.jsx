import { useState } from "react";
import { Map } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../api/client";
import { ActionButton } from "../components/ActionButton";
import { ResultBlock } from "../components/ResultBlock";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { useUploadState } from "../state/UploadContext";

const DAY_STORAGE_KEY = "ai-recruitment-roadmap-days";

export function LearningRoadmapView() {
  const { atsResult, featureResults, setFeatureResult } = useUploadState();
  const { loading, error, run } = useAsyncAction();
  const missingSkills = atsResult?.missing_skills ?? [];
  const [dayCount, setDayCount] = useState(() => {
    const saved = Number(window.localStorage.getItem(DAY_STORAGE_KEY));
    return Number.isInteger(saved) && saved >= 1 && saved <= 30 ? saved : 30;
  });
  const cacheKey = `learning-roadmap-${dayCount}`;
  const result = featureResults[cacheKey] ?? "";
  const fillPercent = ((dayCount - 1) / 29) * 100;

  function handleDayChange(event) {
    const nextDayCount = Number(event.target.value);
    setDayCount(nextDayCount);
    window.localStorage.setItem(DAY_STORAGE_KEY, String(nextDayCount));
  }

  async function handleGenerate() {
    const response = await run(() => api.generateRoadmap(missingSkills, dayCount));
    if (response?.roadmap) {
      setFeatureResult(cacheKey, response.roadmap);
    }
  }

  return (
    <div>
      {!atsResult ? (
        <div className="mb-6 rounded-md border border-line bg-softaccent p-5 text-sm text-ink">
          Run ATS Analysis from the Dashboard first so the roadmap can use your missing skills.
        </div>
      ) : null}

      <div className="max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-mint">Skill Gap Analysis</p>
        <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">Learning Roadmap</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Missing skills: {missingSkills.length ? missingSkills.join(", ") : "none detected yet."}
        </p>

        <div className="mt-6 max-w-xl rounded-md border border-line bg-panel p-5 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-mint">Roadmap duration</p>
              <p className="mt-1 text-sm text-muted">
                {dayCount <= 7 ? "Day-wise plan" : "Weekly plan"}
              </p>
            </div>
            <motion.span
              key={dayCount}
              initial={{ scale: 0.94 }}
              animate={{ scale: 1 }}
              className="rounded-md bg-gradient-to-b from-orange-400 to-orange-600 px-3 py-2 text-sm font-bold text-white shadow-button"
            >
              {dayCount} {dayCount === 1 ? "Day" : "Days"}
            </motion.span>
          </div>

          <div className="mt-5">
            <input
              type="range"
              min="1"
              max="30"
              value={dayCount}
              onChange={handleDayChange}
              className="roadmap-range h-2 w-full cursor-pointer appearance-none rounded-full border border-line bg-elevated transition"
              style={{
                background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${fillPercent}%, var(--color-elevated) ${fillPercent}%, var(--color-elevated) 100%)`,
              }}
              aria-label="Roadmap duration in days"
            />
            <div className="mt-3 flex justify-between text-sm font-medium text-muted">
              <span>1 day</span>
              <span>30 days</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <ActionButton onClick={handleGenerate} disabled={loading || !missingSkills.length}>
            <Map className="h-4 w-4" />
            {loading ? "Working..." : result ? "Regenerate Roadmap" : "Generate Roadmap"}
          </ActionButton>
        </div>

        {error ? <p className="mt-5 rounded-md bg-rose-50 p-3 text-sm text-rose-800">{error}</p> : null}

        {result ? (
          <div className="mt-7">
            <ResultBlock title={`${dayCount}-Day Roadmap`} content={result} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

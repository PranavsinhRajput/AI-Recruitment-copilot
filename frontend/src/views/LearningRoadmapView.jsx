import { Map } from "lucide-react";
import { api } from "../api/client";
import { GeneratedTextView } from "./GeneratedTextView";
import { useUploadState } from "../state/UploadContext";

export function LearningRoadmapView() {
  const { atsResult } = useUploadState();
  const missingSkills = atsResult?.missing_skills ?? [];

  return (
    <div>
      {!atsResult ? (
        <div className="mb-6 rounded-md border border-line bg-softaccent p-5 text-sm text-ink">
          Run ATS Analysis from the Dashboard first so the roadmap can use your missing skills.
        </div>
      ) : null}
      <GeneratedTextView
        eyebrow="Skill Gap Analysis"
        title="Learning Roadmap"
        description={`Missing skills: ${missingSkills.length ? missingSkills.join(", ") : "none detected yet."}`}
        buttonLabel="Generate Roadmap"
        icon={<Map className="h-4 w-4" />}
        resultTitle="30-Day Roadmap"
        cacheKey="learning-roadmap"
        action={async () => {
          const response = await api.generateRoadmap(missingSkills);
          return response.roadmap;
        }}
      />
    </div>
  );
}

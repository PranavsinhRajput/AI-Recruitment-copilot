import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { AtsResult } from "../types";

type UploadContextValue = {
  resumeFileName: string;
  resumeText: string;
  jdText: string;
  resumeSkills: string[];
  atsResult: AtsResult | null;
  isResumeUploaded: boolean;
  isJDUploaded: boolean;
  isReady: boolean;
  setResume: (fileName: string, text: string) => void;
  setJobDescription: (text: string) => void;
  setAtsData: (result: AtsResult, skills: string[]) => void;
};

const UploadContext = createContext<UploadContextValue | null>(null);

export function UploadProvider({ children }: { children: ReactNode }) {
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [resumeSkills, setResumeSkills] = useState<string[]>([]);
  const [atsResult, setAtsResult] = useState<AtsResult | null>(null);

  const value = useMemo<UploadContextValue>(
    () => ({
      resumeFileName,
      resumeText,
      jdText,
      resumeSkills,
      atsResult,
      isResumeUploaded: Boolean(resumeText.trim()),
      isJDUploaded: Boolean(jdText.trim()),
      isReady: Boolean(resumeText.trim() && jdText.trim()),
      setResume(fileName, text) {
        setResumeFileName(fileName);
        setResumeText(text);
        setAtsResult(null);
        setResumeSkills([]);
      },
      setJobDescription(text) {
        setJdText(text);
        setAtsResult(null);
      },
      setAtsData(result, skills) {
        setAtsResult(result);
        setResumeSkills(skills);
      },
    }),
    [atsResult, jdText, resumeFileName, resumeSkills, resumeText],
  );

  return <UploadContext.Provider value={value}>{children}</UploadContext.Provider>;
}

export function useUploadState() {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUploadState must be used inside UploadProvider");
  }
  return context;
}

import { createContext, useContext, useMemo, useState } from "react";

const UploadContext = createContext(null);

export function UploadProvider({ children }) {
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [resumeSkills, setResumeSkills] = useState([]);
  const [atsResult, setAtsResult] = useState(null);
  const [featureResults, setFeatureResults] = useState({});

  const value = useMemo(
    () => ({
      resumeFileName,
      resumeText,
      jdText,
      resumeSkills,
      atsResult,
      featureResults,
      isResumeUploaded: Boolean(resumeText.trim()),
      isJDUploaded: Boolean(jdText.trim()),
      isReady: Boolean(resumeText.trim() && jdText.trim()),
      setResume(fileName, text) {
        setResumeFileName(fileName);
        setResumeText(text);
        setAtsResult(null);
        setResumeSkills([]);
        setFeatureResults({});
      },
      setJobDescription(text) {
        setJdText(text);
        setAtsResult(null);
        setFeatureResults({});
      },
      setAtsData(result, skills) {
        setAtsResult(result);
        setResumeSkills(skills);
      },
      setFeatureResult(key, value) {
        setFeatureResults((current) => ({ ...current, [key]: value }));
      },
    }),
    [atsResult, featureResults, jdText, resumeFileName, resumeSkills, resumeText],
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

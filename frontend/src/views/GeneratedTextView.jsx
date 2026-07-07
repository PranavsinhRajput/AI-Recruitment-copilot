import { ActionButton } from "../components/ActionButton";
import { ResultBlock } from "../components/ResultBlock";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { useUploadState } from "../state/UploadContext";

export function GeneratedTextView({
  eyebrow,
  title,
  description,
  buttonLabel,
  icon,
  resultTitle,
  action,
  cacheKey,
}) {
  const { featureResults, setFeatureResult } = useUploadState();
  const { loading, error, run } = useAsyncAction();
  const result = cacheKey ? featureResults[cacheKey] : "";

  async function handleGenerate() {
    const response = await run(action);
    if (response && cacheKey) setFeatureResult(cacheKey, response);
  }

  return (
    <div className="max-w-5xl">
      <p className="text-sm font-semibold uppercase tracking-widest text-mint">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold text-ink">{title}</h2>
      <p className="mt-3 max-w-2xl text-muted">{description}</p>
      <div className="mt-6">
        <ActionButton onClick={handleGenerate} disabled={loading}>
          {icon}
          {loading ? "Working..." : result ? `Regenerate ${buttonLabel.replace(/^Generate |^Analyze /, "")}` : buttonLabel}
        </ActionButton>
      </div>
      {error ? <p className="mt-5 rounded-md bg-rose-50 p-3 text-sm text-rose-800">{error}</p> : null}
      {result ? (
        <div className="mt-7">
          <ResultBlock title={resultTitle} content={result} />
        </div>
      ) : null}
    </div>
  );
}

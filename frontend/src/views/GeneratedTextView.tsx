import { ReactNode, useState } from "react";
import { ActionButton } from "../components/ActionButton";
import { ResultBlock } from "../components/ResultBlock";
import { useAsyncAction } from "../hooks/useAsyncAction";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  buttonLabel: string;
  icon: ReactNode;
  resultTitle: string;
  action: () => Promise<string>;
};

export function GeneratedTextView({
  eyebrow,
  title,
  description,
  buttonLabel,
  icon,
  resultTitle,
  action,
}: Props) {
  const [result, setResult] = useState("");
  const { loading, error, run } = useAsyncAction();

  async function handleGenerate() {
    const response = await run(action);
    if (response) setResult(response);
  }

  return (
    <div className="max-w-5xl">
      <p className="text-sm font-semibold uppercase tracking-widest text-mint">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold text-ink">{title}</h2>
      <p className="mt-3 max-w-2xl text-slate-600">{description}</p>
      <div className="mt-6">
        <ActionButton onClick={handleGenerate} disabled={loading}>
          {icon}
          {loading ? "Working..." : buttonLabel}
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

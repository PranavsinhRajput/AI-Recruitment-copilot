import { FormEvent, useState } from "react";
import { Bot, Send } from "lucide-react";
import { api } from "../api/client";
import { ActionButton } from "../components/ActionButton";
import { ResultBlock } from "../components/ResultBlock";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { useUploadState } from "../state/UploadContext";

export function ChatbotView() {
  const { resumeText, jdText, atsResult } = useUploadState();
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const { loading, error, run } = useAsyncAction();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await run(() =>
      api.askChatbot(query, resumeText, jdText, atsResult?.missing_skills ?? []),
    );
    if (response) setAnswer(response.answer);
  }

  return (
    <div className="max-w-4xl">
      <p className="text-sm font-semibold uppercase tracking-widest text-mint">Career Guidance</p>
      <h2 className="mt-2 text-3xl font-bold text-ink">AI Chatbot</h2>
      <p className="mt-3 max-w-2xl text-slate-600">
        Ask anything about your resume, target role, interview prep, ATS gaps, or career path.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 rounded-md border border-slate-200 bg-white p-5 shadow-soft">
        <label className="text-sm font-semibold text-ink">Question</label>
        <textarea
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="mt-3 h-32 w-full resize-none rounded-md border border-slate-200 p-3 text-sm leading-6 outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20"
          placeholder="Ask about your resume, this JD, or the next best move..."
        />
        <div className="mt-4">
          <ActionButton type="submit" disabled={loading || !query.trim()}>
            {loading ? <Bot className="h-4 w-4 animate-pulse" /> : <Send className="h-4 w-4" />}
            {loading ? "Thinking..." : "Ask"}
          </ActionButton>
        </div>
      </form>

      {error ? <p className="mt-5 rounded-md bg-rose-50 p-3 text-sm text-rose-800">{error}</p> : null}
      {answer ? (
        <div className="mt-7">
          <ResultBlock title="Answer" content={answer} />
        </div>
      ) : null}
    </div>
  );
}

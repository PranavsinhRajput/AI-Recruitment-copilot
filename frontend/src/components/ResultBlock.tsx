export function ResultBlock({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
      <h3 className="mb-3 text-lg font-semibold text-ink">{title}</h3>
      <div className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{content}</div>
    </div>
  );
}

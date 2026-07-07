export function ResultBlock({ title, content }) {
  return (
    <div className="rounded-md border border-line bg-panel p-5 shadow-soft">
      <h3 className="mb-3 text-lg font-semibold text-ink">{title}</h3>
      <MarkdownText content={content} />
    </div>
  );
}

function MarkdownText({ content }) {
  const lines = content.split(/\r?\n/);

  return (
    <div className="space-y-3 text-sm leading-6 text-muted">
      {lines.map((line, index) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={index} className="h-1" />;
        }

        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={index} className="pt-2 text-base font-semibold text-ink">
              {renderInlineMarkdown(trimmed.slice(4))}
            </h4>
          );
        }

        if (trimmed.startsWith("## ")) {
          return (
            <h4 key={index} className="pt-2 text-lg font-semibold text-ink">
              {renderInlineMarkdown(trimmed.slice(3))}
            </h4>
          );
        }

        if (trimmed.startsWith("# ")) {
          return (
            <h4 key={index} className="pt-2 text-xl font-semibold text-ink">
              {renderInlineMarkdown(trimmed.slice(2))}
            </h4>
          );
        }

        const bulletMatch = trimmed.match(/^[-*]\s+(.+)$/);
        if (bulletMatch) {
          return (
            <div key={index} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
              <p>{renderInlineMarkdown(bulletMatch[1])}</p>
            </div>
          );
        }

        const numberedMatch = trimmed.match(/^(\d+)[.)]\s+(.+)$/);
        if (numberedMatch) {
          return (
            <div key={index} className="flex gap-2">
              <span className="min-w-6 font-semibold text-mint">{numberedMatch[1]}.</span>
              <p>{renderInlineMarkdown(numberedMatch[2])}</p>
            </div>
          );
        }

        return <p key={index}>{renderInlineMarkdown(trimmed)}</p>;
      })}
    </div>
  );
}

function renderInlineMarkdown(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={index} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }

    return part;
  });
}

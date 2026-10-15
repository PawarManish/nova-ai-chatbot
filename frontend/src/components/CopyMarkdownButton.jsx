import { useState } from "react";

export default function CopyMarkdownButton({ content }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      className="copy-markdown-button"
      onClick={handleCopy}
      title="Copy Markdown source"
      aria-label="Copy Markdown source"
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

"use client";

import { useState } from "react";

interface ShareWidgetProps {
  title: string;
}

export function ShareWidget({ title }: ShareWidgetProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const url = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
  const text = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Share:</span>
      <button
        type="button"
        onClick={copyLink}
        className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
      <a
        href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-600"
      >
        Twitter
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-600"
      >
        Facebook
      </a>
    </div>
  );
}

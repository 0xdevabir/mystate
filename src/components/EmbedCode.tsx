"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, Code2 } from "lucide-react";
import { buildEmbedUrl, buildMarkdown } from "@/lib/utils";

interface EmbedCodeProps {
  username: string;
  theme: string;
}

export function EmbedCode({ username, theme }: EmbedCodeProps) {
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<"markdown" | "html">("markdown");

  if (!username) return null;

  const markdown = buildMarkdown(username, theme);
  const html = `<img src="${buildEmbedUrl(username, theme)}" alt="My GitHub Stats" />`;
  const code = format === "markdown" ? markdown : html;

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-6 py-16"
    >
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                <Code2 className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Your embed code</h3>
                <p className="text-sm text-zinc-500">Paste this into your GitHub README</p>
              </div>
            </div>

            <div className="flex rounded-lg border border-zinc-800 p-0.5">
              {(["markdown", "html"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    format === f
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {f === "markdown" ? "Markdown" : "HTML"}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <pre className="overflow-x-auto rounded-xl bg-zinc-950 p-4 text-sm text-emerald-400">
              <code>{code}</code>
            </pre>
            <button
              type="button"
              onClick={handleCopy}
              className="absolute right-3 top-3 flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-zinc-700"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1.5"
                  >
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    Copied
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1.5"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          <p className="mt-4 text-center text-sm text-zinc-500">
            Add this line anywhere in your README.md and your stats will appear automatically.
          </p>
        </div>
      </div>
    </motion.section>
  );
}

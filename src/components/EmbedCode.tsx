"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { buildEmbedUrl, buildMarkdown, buildPreviewUrl } from "@/lib/utils";
import { SectionLabel, SectionTitle } from "./SectionHeader";

interface EmbedCodeProps {
  username: string;
  template: string;
  theme: string;
}

export function EmbedCode({ username, template, theme }: EmbedCodeProps) {
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<"markdown" | "html">("markdown");

  if (!username) return null;

  const markdown = buildMarkdown(username, template, theme);
  const html = `<img src="${buildEmbedUrl(username, template, theme)}" alt="My GitHub Stats" />`;
  const code = format === "markdown" ? markdown : html;

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-dark px-6 py-24 md:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <SectionLabel>Embed Code</SectionLabel>
        <SectionTitle dark className="mb-4">
          Copy & paste.
        </SectionTitle>
        <p className="mb-10 text-[14px] text-bg/50">
          Layout: <span className="font-bold text-accent">{template}</span>
          {" · "}
          Theme: <span className="font-bold text-accent">{theme}</span>
        </p>

        <div className="rounded-2xl border border-bg/10 bg-ink p-6 md:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[14px] text-bg/55">
              Add this to your <span className="font-mono text-accent">README.md</span>
            </p>

            <div className="flex rounded-full border border-bg/10 p-0.5">
              {(["markdown", "html"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  className={`rounded-full px-4 py-1.5 text-[12px] font-bold transition-colors ${
                    format === f
                      ? "bg-accent text-dark"
                      : "text-bg/40 hover:text-bg/70"
                  }`}
                >
                  {f === "markdown" ? "Markdown" : "HTML"}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <pre className="overflow-x-auto rounded-xl bg-dark/60 p-5 font-mono text-[12px] leading-relaxed text-highlight sm:text-[13px]">
              <code>{code}</code>
            </pre>
            <button
              type="button"
              onClick={handleCopy}
              className="absolute right-3 top-3 flex items-center gap-2 rounded-full bg-bg px-4 py-2 text-[12px] font-bold text-dark transition-all hover:-translate-y-0.5 active:scale-95"
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
                    <Check className="h-3.5 w-3.5" />
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

          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-px flex-1 bg-bg/10" />
            <p className="text-[12px] font-bold uppercase tracking-widest text-bg/30">
              Live preview
            </p>
            <div className="h-px flex-1 bg-bg/10" />
          </div>

          <div className="mt-6 overflow-x-auto rounded-xl bg-bg/5 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={buildPreviewUrl(username, template, theme)}
              alt="Stats preview"
              className="mx-auto max-w-none rounded-lg"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}


"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { buildEmbedUrl, buildMarkdown, buildPreviewUrl } from "@/lib/utils";
import { CUSTOM_THEME_ID } from "@/lib/themes/custom";
import type { CustomThemeColors } from "@/types";

const DEMO_USERNAME = "0xdevabir";

export type EmbedFormat = "markdown" | "html";

interface EmbedCodePanelProps {
  username: string;
  template: string;
  theme: string;
  customColors?: CustomThemeColors;
  previewBg?: string;
  templateWidth?: number;
  templateHeight?: number;
  showPreview?: boolean;
  variant?: "dark" | "light";
  layout?: "default" | "modal";
  usernameHint?: string;
}

export function EmbedCodePanel({
  username,
  template,
  theme,
  customColors,
  previewBg = "#0d1117",
  templateWidth,
  templateHeight,
  showPreview = true,
  variant = "dark",
  layout = "default",
  usernameHint,
}: EmbedCodePanelProps) {
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<EmbedFormat>("markdown");

  const colors = theme === CUSTOM_THEME_ID ? customColors : undefined;
  const embedUser = username.trim() || "your-username";
  const previewUser = username.trim() || DEMO_USERNAME;
  const markdown = buildMarkdown(embedUser, template, theme, colors);
  const html = `<img src="${buildEmbedUrl(embedUser, template, theme, colors)}" alt="My GitHub Stats" />`;
  const code = format === "markdown" ? markdown : html;
  const previewKey =
    theme === CUSTOM_THEME_ID && customColors
      ? `${previewUser}-${template}-${theme}-${customColors.bg}-${customColors.accent}-${customColors.highlight}`
      : `${previewUser}-${template}-${theme}`;

  const isDark = variant === "dark";
  const isModal = layout === "modal";

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const previewBlock = showPreview ? (
    <div className={isModal ? "space-y-4" : undefined}>
      {!isModal && (
        <div className="flex items-center gap-3">
          <div className={`h-px flex-1 ${isDark ? "bg-bg/10" : "bg-dark/10"}`} />
          <p
            className={`text-[11px] font-bold uppercase tracking-widest ${
              isDark ? "text-bg/30" : "text-dark/30"
            }`}
          >
            Preview
          </p>
          <div className={`h-px flex-1 ${isDark ? "bg-bg/10" : "bg-dark/10"}`} />
        </div>
      )}

      {isModal && (
        <p className="text-[11px] font-bold uppercase tracking-widest text-dark/35">
          Preview
        </p>
      )}

      <div
        className={`rounded-xl p-3 sm:p-4 ${
          isDark ? "bg-bg/5" : "border border-dark/8"
        }`}
        style={{ backgroundColor: isDark ? undefined : previewBg }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={previewKey}
            src={buildPreviewUrl(previewUser, template, theme, true, colors)}
            alt="Stats preview"
            width={templateWidth}
            height={templateHeight}
            className="block h-auto w-full max-w-full rounded-lg"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>
      </div>
    </div>
  ) : null;

  const codeBlock = (
  <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className={`text-[13px] ${isDark ? "text-bg/55" : "text-dark/55"}`}>
          Paste into your{" "}
          <span className={`font-mono font-semibold ${isDark ? "text-accent" : "text-dark"}`}>
            README.md
          </span>
        </p>

        <div
          className={`flex w-fit shrink-0 rounded-full border p-0.5 ${
            isDark ? "border-bg/10" : "border-dark/10"
          }`}
        >
          {(["markdown", "html"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFormat(f)}
              className={`rounded-full px-4 py-1.5 text-[12px] font-bold transition-all duration-300 ${
                format === f
                  ? isDark
                    ? "bg-accent text-dark"
                    : "bg-dark text-bg"
                  : isDark
                    ? "text-bg/40 hover:text-bg/70"
                    : "text-dark/40 hover:text-dark/70"
              }`}
            >
              {f === "markdown" ? "Markdown" : "HTML"}
            </button>
          ))}
        </div>
      </div>

      {!username.trim() && usernameHint && (
        <p
          className={`rounded-xl px-4 py-2.5 text-[12px] leading-relaxed ${
            isDark
              ? "border border-amber-500/20 bg-amber-500/10 text-amber-200/90"
              : "border border-amber-600/20 bg-amber-500/10 text-amber-900/80"
          }`}
        >
          {usernameHint}
        </p>
      )}

      <div className="relative">
        <div
          className={`rounded-xl p-4 pr-24 ${
            isDark
              ? "bg-dark/60"
              : "border border-dark/8 bg-light/80"
          }`}
        >
          <code
            className={`block font-mono text-[11px] leading-relaxed break-all sm:text-[12px] ${
              isDark ? "text-highlight" : "text-dark/80"
            }`}
          >
            {code}
          </code>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={`absolute right-3 top-3 flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-bold transition-all hover:-translate-y-0.5 active:scale-95 ${
            isDark ? "bg-bg text-dark" : "bg-dark text-bg"
          }`}
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
    </div>
  );

  if (isModal) {
    return (
      <div className="flex flex-col gap-8">
        {previewBlock}
        <div className="h-px bg-dark/8" />
        {codeBlock}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {codeBlock}
      {previewBlock}
    </div>
  );
}

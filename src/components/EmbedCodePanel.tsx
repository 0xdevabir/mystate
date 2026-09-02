"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { buildPreviewUrl } from "@/lib/utils";
import {
  buildEmbedSnippet,
  buildPairEmbedSnippet,
  getEmbedLayout,
  getEmbedLayoutHint,
  getEmbedLayoutLabel,
  type EmbedFormat,
  type EmbedLayout,
} from "@/lib/embed-layout";
import { CUSTOM_THEME_ID } from "@/lib/themes/custom";
import { TEMPLATES } from "@/lib/templates";
import type { CustomThemeColors } from "@/types";
import { TemplatePreview } from "./TemplatePreview";

const DEMO_USERNAME = "0xdevabir";

interface EmbedCodePanelProps {
  username: string;
  template: string;
  theme: string;
  customColors?: CustomThemeColors;
  previewBg?: string;
  templateWidth?: number;
  templateHeight?: number;
  embedLayout?: EmbedLayout;
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
  embedLayout: embedLayoutProp,
  showPreview = true,
  variant = "dark",
  layout = "default",
  usernameHint,
}: EmbedCodePanelProps) {
  const [copied, setCopied] = useState<"single" | "pair" | null>(null);
  const [format, setFormat] = useState<EmbedFormat>("github");

  const colors = theme === CUSTOM_THEME_ID ? customColors : undefined;
  const embedUser = username.trim() || "your-username";
  const previewUser = username.trim() || DEMO_USERNAME;

  const embedLayout = useMemo(() => {
    if (embedLayoutProp) return embedLayoutProp;
    const meta = TEMPLATES[template]?.meta;
    return meta ? getEmbedLayout(meta) : "full";
  }, [embedLayoutProp, template]);

  const snippet = buildEmbedSnippet({
    username: embedUser,
    template,
    theme,
    customColors: colors,
    layout: embedLayout,
    format,
  });

  const pairSnippet =
    embedLayout === "half"
      ? buildPairEmbedSnippet({
          username: embedUser,
          template,
          theme,
          customColors: colors,
        })
      : null;

  const previewSrc = buildPreviewUrl(previewUser, template, theme, true, colors);
  const isDark = variant === "dark";
  const isModal = layout === "modal";

  async function handleCopy(text: string, which: "single" | "pair") {
    await navigator.clipboard.writeText(text);
    setCopied(which);
    setTimeout(() => setCopied(null), 2000);
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
        <div
          className={
            embedLayout === "half" && !isModal
              ? "mx-auto max-w-[50%]"
              : embedLayout === "half" && isModal
                ? "mx-auto max-w-[70%]"
                : undefined
          }
        >
          <TemplatePreview
            src={previewSrc}
            alt="Stats preview"
            width={templateWidth}
            height={templateHeight}
            className="block h-auto w-full max-w-full rounded-lg"
            priority={isModal}
          />
        </div>
      </div>
    </div>
  ) : null;

  const codeBlock = (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className={`text-[13px] ${isDark ? "text-bg/55" : "text-dark/55"}`}>
            Paste into your{" "}
            <span className={`font-mono font-semibold ${isDark ? "text-accent" : "text-dark"}`}>
              README.md
            </span>
          </p>
          <p
            className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${
              isDark ? "bg-accent/15 text-accent" : "bg-dark/8 text-dark/70"
            }`}
          >
            {getEmbedLayoutLabel(embedLayout)}
          </p>
        </div>

        <div
          className={`flex w-fit shrink-0 rounded-full border p-0.5 ${
            isDark ? "border-bg/10" : "border-dark/10"
          }`}
        >
          {(["github", "markdown"] as const).map((f) => (
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
              {f === "github" ? "GitHub HTML" : "Markdown"}
            </button>
          ))}
        </div>
      </div>

      <p className={`text-[12px] leading-relaxed ${isDark ? "text-bg/45" : "text-dark/50"}`}>
        {getEmbedLayoutHint(embedLayout)}
        {format === "markdown" && embedLayout === "full" && (
          <> For full-width on GitHub, use the GitHub HTML tab instead.</>
        )}
      </p>

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
            isDark ? "bg-dark/60" : "border border-dark/8 bg-light/80"
          }`}
        >
          <code
            className={`block whitespace-pre-wrap font-mono text-[11px] leading-relaxed break-all sm:text-[12px] ${
              isDark ? "text-highlight" : "text-dark/80"
            }`}
          >
            {snippet}
          </code>
        </div>
        <button
          type="button"
          onClick={() => handleCopy(snippet, "single")}
          className={`absolute right-3 top-3 flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-bold transition-all hover:-translate-y-0.5 active:scale-95 ${
            isDark ? "bg-bg text-dark" : "bg-dark text-bg"
          }`}
        >
          <AnimatePresence mode="wait">
            {copied === "single" ? (
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

      {pairSnippet && format === "github" && (
        <div className="space-y-3">
          <p className={`text-[12px] font-bold ${isDark ? "text-bg/60" : "text-dark/60"}`}>
            Two cards in one row
          </p>
          <div className="relative">
            <div
              className={`rounded-xl p-4 pr-24 ${
                isDark ? "bg-dark/60" : "border border-dark/8 bg-light/80"
              }`}
            >
              <code
                className={`block whitespace-pre-wrap font-mono text-[11px] leading-relaxed break-all sm:text-[12px] ${
                  isDark ? "text-highlight" : "text-dark/80"
                }`}
              >
                {pairSnippet}
              </code>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(pairSnippet, "pair")}
              className={`absolute right-3 top-3 flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-bold transition-all hover:-translate-y-0.5 active:scale-95 ${
                isDark ? "bg-bg text-dark" : "bg-dark text-bg"
              }`}
            >
              {copied === "pair" ? (
                <span className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" />
                  Copied
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Copy className="h-3.5 w-3.5" />
                  Copy pair
                </span>
              )}
            </button>
          </div>
          <p className={`text-[11px] ${isDark ? "text-bg/40" : "text-dark/40"}`}>
            Replace the second URL with another small card template, or duplicate this one.
          </p>
        </div>
      )}
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

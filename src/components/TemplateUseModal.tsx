"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { CustomThemeColors, TemplateMeta } from "@/types";
import { EmbedCodePanel } from "./EmbedCodePanel";

interface TemplateUseModalProps {
  template: TemplateMeta | null;
  username: string;
  draftUsername?: string;
  theme: string;
  customColors?: CustomThemeColors;
  onClose: () => void;
}

function modalMaxWidth(templateWidth: number): string {
  const padded = templateWidth + 96;
  const capped = Math.min(padded, 1200);
  return `min(96vw, ${capped}px)`;
}

export function TemplateUseModal({
  template,
  username,
  draftUsername = "",
  theme,
  customColors,
  onClose,
}: TemplateUseModalProps) {
  const embedUsername = username.trim() || draftUsername.trim();

  useEffect(() => {
    if (!template) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [template, onClose]);

  return (
    <AnimatePresence>
      {template && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.button
            type="button"
            aria-label="Close modal"
            className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="template-use-title"
            style={{ maxWidth: modalMaxWidth(template.width) }}
            className="relative z-10 flex max-h-[94vh] w-full flex-col overflow-hidden rounded-2xl border border-dark/10 bg-bg shadow-2xl"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-dark/8 px-5 py-4 sm:px-8 sm:py-5">
              <div className="min-w-0">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-accent">
                  Use template
                </p>
                <h2
                  id="template-use-title"
                  className="text-[20px] font-extrabold text-dark sm:text-[26px]"
                >
                  {template.name}
                </h2>
                <p className="mt-1 text-[13px] text-dark/50">
                  {template.description}
                  <span className="mx-2 text-dark/20">·</span>
                  <span className="font-mono text-[12px]">
                    {template.width}×{template.height}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dark/10 bg-light/80 text-dark/60 transition-colors hover:bg-dark hover:text-bg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
              <EmbedCodePanel
                username={embedUsername}
                template={template.id}
                theme={theme}
                customColors={customColors}
                previewBg={template.previewBg}
                templateWidth={template.width}
                templateHeight={template.height}
                variant="light"
                layout="modal"
                usernameHint={
                  !embedUsername
                    ? "Enter your GitHub username at the top first — the embed link below uses a placeholder until then."
                    : undefined
                }
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

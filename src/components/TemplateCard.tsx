"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { CustomThemeColors, TemplateMeta } from "@/types";
import { buildPreviewUrl } from "@/lib/utils";
import { CUSTOM_THEME_ID } from "@/lib/themes/custom";
import { getEmbedLayout, getEmbedLayoutLabel } from "@/lib/embed-layout";
import { TemplatePreview } from "./TemplatePreview";

const DEMO_USERNAME = "0xdevabir";

interface TemplateCardProps {
  template: TemplateMeta;
  username: string;
  colorTheme: string;
  customColors?: CustomThemeColors;
  selected: boolean;
  onSelect: (id: string) => void;
  onUse: (template: TemplateMeta) => void;
  index: number;
  compact?: boolean;
}

export function TemplateCard({
  template,
  username,
  colorTheme,
  customColors,
  selected,
  onSelect,
  onUse,
  index,
  compact = false,
}: TemplateCardProps) {
  const previewUser = username || DEMO_USERNAME;
  const previewUrl = buildPreviewUrl(
    previewUser,
    template.id,
    colorTheme,
    true,
    colorTheme === CUSTOM_THEME_ID ? customColors : undefined,
  );

  const embedLayout = getEmbedLayout(template);
  const layoutLabel = getEmbedLayoutLabel(embedLayout);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      className={`group flex h-full w-full flex-col bg-bg transition-all duration-500 ease-out hover:bg-dark ${
        selected ? "ring-2 ring-inset ring-accent" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect(template.id)}
        className="flex-1 cursor-pointer p-0 text-left"
      >
        <div className={compact ? "p-5 pb-3 sm:p-6 sm:pb-4" : "p-6 pb-4 sm:p-8 sm:pb-5"}>
          <div className="mb-4 flex items-center justify-between">
            <span
              className={`text-[11px] font-bold uppercase tracking-widest transition-colors duration-500 ${
                selected ? "text-accent" : "text-accent/60 group-hover:text-accent"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-bold text-dark/30 transition-colors duration-500 group-hover:text-bg/40">
              {template.width}×{template.height}
            </span>
          </div>

          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-dark/35 transition-colors group-hover:text-bg/40">
            {layoutLabel}
          </p>

          <div
            className="relative mb-5 overflow-hidden rounded-lg border border-dark/5 transition-colors duration-500"
            style={{ background: template.previewBg }}
          >
            <TemplatePreview
              src={previewUrl}
              alt={`${template.name} preview`}
              width={template.width}
              height={template.height}
              className="block h-auto w-full min-w-0 rounded-lg"
            />
            {!username && (
              <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-widest text-dark/30">
                Demo preview
              </p>
            )}
          </div>

          <h3
            className={`mb-2 font-extrabold text-dark transition-colors duration-500 group-hover:text-bg ${
              compact ? "text-[17px] sm:text-[18px]" : "text-[20px] sm:text-[22px]"
            }`}
          >
            {template.name}
          </h3>
          <p className="text-[14px] leading-relaxed text-dark/55 transition-colors duration-500 group-hover:text-bg/60">
            {template.description}
          </p>

          {selected && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 inline-block text-[12px] font-bold uppercase tracking-widest text-accent"
            >
              Selected layout
            </motion.span>
          )}
        </div>
      </button>

      <div className={compact ? "px-5 pb-5 sm:px-6 sm:pb-6" : "px-6 pb-6 sm:px-8 sm:pb-8"}>
        <button
          type="button"
          onClick={() => onUse(template)}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-dark/15 bg-light/80 px-4 py-2.5 text-[12px] font-bold uppercase tracking-widest text-dark transition-all duration-300 hover:border-dark hover:bg-dark hover:text-bg group-hover:border-dark/30 group-hover:bg-bg group-hover:text-dark"
        >
          Use this
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.article>
  );
}


"use client";

import { motion } from "framer-motion";
import type { TemplateMeta } from "@/types";
import { buildPreviewUrl } from "@/lib/utils";

const DEMO_USERNAME = "0xdevabir";

interface TemplateCardProps {
  template: TemplateMeta;
  username: string;
  colorTheme: string;
  selected: boolean;
  onSelect: (id: string) => void;
  index: number;
}

export function TemplateCard({
  template,
  username,
  colorTheme,
  selected,
  onSelect,
  index,
}: TemplateCardProps) {
  const previewUser = username || DEMO_USERNAME;
  const previewUrl = buildPreviewUrl(previewUser, template.id, colorTheme);

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      onClick={() => onSelect(template.id)}
      className={`group h-full w-full cursor-pointer bg-bg p-0 text-left transition-all duration-500 hover:bg-dark ${
        selected ? "ring-2 ring-inset ring-accent" : ""
      }`}
    >
      <div className="p-6 sm:p-8">
        <div className="mb-4 flex items-center justify-between">
          <span
            className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${
              selected ? "text-accent" : "text-accent/60 group-hover:text-accent"
            }`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-[10px] font-bold text-dark/30 group-hover:text-bg/40">
            {template.width}×{template.height}
          </span>
        </div>

        <div
          className="mb-5 overflow-x-auto overflow-y-hidden rounded-lg border border-dark/5"
          style={{ background: template.previewBg }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={`${previewUser}-${template.id}-${colorTheme}`}
            src={previewUrl}
            alt={`${template.name} preview`}
            className="block w-full min-w-[280px]"
            loading="lazy"
          />
          {!username && (
            <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-widest text-dark/30">
              Demo preview
            </p>
          )}
        </div>

        <h3 className="mb-2 text-[20px] font-extrabold text-dark transition-colors group-hover:text-bg sm:text-[22px]">
          {template.name}
        </h3>
        <p className="text-[14px] leading-relaxed text-dark/55 transition-colors group-hover:text-bg/60">
          {template.description}
        </p>

        {selected && (
          <span className="mt-4 inline-block text-[12px] font-bold uppercase tracking-widest text-accent">
            Selected layout
          </span>
        )}
      </div>
    </motion.button>
  );
}


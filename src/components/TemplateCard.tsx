"use client";

import { motion } from "framer-motion";
import type { TemplateMeta } from "@/types";
import { buildEmbedUrl } from "@/lib/utils";

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
  const previewUrl = username
    ? buildEmbedUrl(username, template.id, colorTheme)
    : null;

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
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt={`${template.name} preview`}
              className="w-full min-w-[280px]"
              loading="lazy"
            />
          ) : (
            <div
              className="flex items-center justify-center"
              style={{ height: Math.min(template.height * 0.4, 120) }}
            >
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded bg-white/10"
                    style={{
                      width: 40 + i * 8,
                      height: 24,
                      opacity: 0.2 + i * 0.15,
                    }}
                  />
                ))}
              </div>
            </div>
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

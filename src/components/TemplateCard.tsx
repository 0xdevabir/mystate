"use client";

import { motion } from "framer-motion";
import type { TemplateMeta } from "@/types";

interface TemplateCardProps {
  template: TemplateMeta;
  username: string;
  selected: boolean;
  onSelect: (id: string) => void;
  index: number;
}

export function TemplateCard({
  template,
  username,
  selected,
  onSelect,
  index,
}: TemplateCardProps) {
  const previewUrl = username
    ? `/api/stats?username=${encodeURIComponent(username)}&theme=${template.id}`
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
        <span
          className={`mb-4 block text-[11px] font-bold uppercase tracking-widest transition-colors ${
            selected ? "text-accent" : "text-accent/60 group-hover:text-accent"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div
          className="mb-5 overflow-hidden rounded-lg"
          style={{ background: template.preview.bg }}
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt={`${template.name} preview`}
              className="w-full"
              loading="lazy"
            />
          ) : (
            <div className="flex h-[78px] items-center justify-center">
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-6 w-10 rounded bg-white/10"
                    style={{ opacity: 0.3 + i * 0.15 }}
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
            Selected
          </span>
        )}
      </div>
    </motion.button>
  );
}

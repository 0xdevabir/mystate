"use client";

import { motion } from "framer-motion";
import type { TemplateMeta } from "@/types";
import { Check } from "lucide-react";

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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => onSelect(template.id)}
      className={`group relative w-full rounded-2xl border text-left transition-all duration-300 ${
        selected
          ? "border-violet-500/60 bg-violet-500/10 shadow-lg shadow-violet-500/10"
          : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900/80"
      }`}
    >
      {selected && (
        <div className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-white">
          <Check className="h-3.5 w-3.5" />
        </div>
      )}

      <div
        className="relative overflow-hidden rounded-t-2xl p-4"
        style={{ background: template.preview.bg }}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={`${template.name} preview`}
            className="w-full rounded-lg"
            loading="lazy"
          />
        ) : (
          <div className="flex h-[78px] items-center justify-center rounded-lg bg-black/20">
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-8 w-12 animate-pulse rounded"
                  style={{ background: `${template.preview.accent}20` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-white">{template.name}</h3>
        <p className="mt-1 text-sm text-zinc-500">{template.description}</p>
      </div>
    </motion.button>
  );
}

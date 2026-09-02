"use client";

import { motion } from "framer-motion";
import type { TemplateMeta } from "@/types";
import { TemplateCard } from "./TemplateCard";

interface TemplateGalleryProps {
  templates: TemplateMeta[];
  username: string;
  selectedTheme: string;
  onSelectTheme: (id: string) => void;
}

export function TemplateGallery({
  templates,
  username,
  selectedTheme,
  onSelectTheme,
}: TemplateGalleryProps) {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            Choose your style
          </h2>
          <p className="mt-3 text-zinc-400">
            {username
              ? `Previewing stats for @${username}`
              : "Enter your username above to see live previews"}
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template, index) => (
            <TemplateCard
              key={template.id}
              template={template}
              username={username}
              selected={selectedTheme === template.id}
              onSelect={onSelectTheme}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

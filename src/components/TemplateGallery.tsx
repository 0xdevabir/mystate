"use client";

import { motion } from "framer-motion";
import type { TemplateMeta } from "@/types";
import { SectionLabel, SectionTitle } from "./SectionHeader";
import { TemplateCard } from "./TemplateCard";
import { ThemePicker } from "./ThemePicker";

interface TemplateGalleryProps {
  templates: TemplateMeta[];
  username: string;
  selectedTemplate: string;
  selectedTheme: string;
  onSelectTemplate: (id: string) => void;
  onSelectTheme: (id: string) => void;
}

export function TemplateGallery({
  templates,
  username,
  selectedTemplate,
  selectedTheme,
  onSelectTemplate,
  onSelectTheme,
}: TemplateGalleryProps) {
  return (
    <section id="templates" className="bg-bg px-6 py-24 md:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20"
        >
          <SectionLabel>Layouts</SectionLabel>
          <SectionTitle>Pick a layout.</SectionTitle>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-dark/55">
            Each layout arranges your stats differently. Color themes change the
            palette — content stays the same.
            {username && (
              <>
                {" "}
                Previewing{" "}
                <span className="font-bold text-dark">@{username}</span>
              </>
            )}
          </p>

          <ThemePicker selected={selectedTheme} onSelect={onSelectTheme} />
        </motion.div>

        <div className="grid grid-cols-1 gap-px bg-dark/10 md:grid-cols-2">
          {templates.map((template, index) => (
            <TemplateCard
              key={template.id}
              template={template}
              username={username}
              colorTheme={selectedTheme}
              selected={selectedTemplate === template.id}
              onSelect={onSelectTemplate}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

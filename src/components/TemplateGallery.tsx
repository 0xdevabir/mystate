"use client";

import { motion } from "framer-motion";
import type { TemplateMeta } from "@/types";
import { SectionLabel, SectionTitle } from "./SectionHeader";
import { TemplateCard } from "./TemplateCard";
import { ThemePicker } from "./ThemePicker";
import { PREMIUM_TEMPLATES, CLASSIC_TEMPLATES } from "@/lib/templates";

interface TemplateGalleryProps {
  username: string;
  selectedTemplate: string;
  selectedTheme: string;
  onSelectTemplate: (id: string) => void;
  onSelectTheme: (id: string) => void;
}

function TemplateSection({
  title,
  label,
  templates,
  username,
  selectedTemplate,
  selectedTheme,
  onSelectTemplate,
  startIndex,
}: {
  title: string;
  label: string;
  templates: TemplateMeta[];
  username: string;
  selectedTemplate: string;
  selectedTheme: string;
  onSelectTemplate: (id: string) => void;
  startIndex: number;
}) {
  if (templates.length === 0) return null;

  return (
    <div className="mb-20">
      <SectionLabel>{label}</SectionLabel>
      <h3 className="mb-8 text-[28px] font-black leading-none text-dark sm:text-[36px]">
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-px bg-dark/10 lg:grid-cols-2">
        {templates.map((template, index) => (
          <TemplateCard
            key={template.id}
            template={template}
            username={username}
            colorTheme={selectedTheme}
            selected={selectedTemplate === template.id}
            onSelect={onSelectTemplate}
            index={startIndex + index}
          />
        ))}
      </div>
    </div>
  );
}

export function TemplateGallery({
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
            Premium layouts include contribution graphs, streaks, rank badges, and
            detailed language breakdowns. Color themes change the palette only.
            {username && (
              <>
                {" "}
                Previewing{" "}
                <span className="font-bold text-dark">@{username}</span>
              </>
            )}
          </p>

          <ThemePicker selected={selectedTheme} onSelect={onSelectTheme} />

          {!username && (
            <p className="mt-4 rounded-full border border-dark/10 bg-light/50 px-4 py-2 text-[13px] text-dark/50">
              Add <span className="font-bold">GITHUB_TOKEN</span> on the server for
              contribution graphs, streaks, and full language data.
            </p>
          )}
        </motion.div>

        <TemplateSection
          label="Premium"
          title="World-class templates."
          templates={PREMIUM_TEMPLATES}
          username={username}
          selectedTemplate={selectedTemplate}
          selectedTheme={selectedTheme}
          onSelectTemplate={onSelectTemplate}
          startIndex={0}
        />

        <TemplateSection
          label="Classic"
          title="Alternative layouts."
          templates={CLASSIC_TEMPLATES}
          username={username}
          selectedTemplate={selectedTemplate}
          selectedTheme={selectedTheme}
          onSelectTemplate={onSelectTemplate}
          startIndex={PREMIUM_TEMPLATES.length}
        />
      </div>
    </section>
  );
}

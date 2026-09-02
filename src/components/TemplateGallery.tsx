"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { CustomThemeColors, TemplateMeta } from "@/types";
import { SectionLabel, SectionTitle } from "./SectionHeader";
import { TemplateCard } from "./TemplateCard";
import { ThemePicker } from "./ThemePicker";
import { TemplateUseModal } from "./TemplateUseModal";
import {
  PREMIUM_TEMPLATES,
  CLASSIC_TEMPLATES,
  CARD_TEMPLATES,
  PAIR_TEMPLATES,
} from "@/lib/templates";

interface TemplateGalleryProps {
  username: string;
  draftUsername?: string;
  selectedTemplate: string;
  selectedTheme: string;
  customColors: CustomThemeColors;
  onSelectTemplate: (id: string) => void;
  onSelectTheme: (id: string) => void;
  onCustomColorsChange: (colors: CustomThemeColors) => void;
}

function TemplateSection({
  title,
  label,
  templates,
  username,
  selectedTemplate,
  selectedTheme,
  customColors,
  onSelectTemplate,
  onUseTemplate,
  startIndex,
  compact = false,
  columns = "lg:grid-cols-2",
}: {
  title: string;
  label: string;
  templates: TemplateMeta[];
  username: string;
  selectedTemplate: string;
  selectedTheme: string;
  customColors: CustomThemeColors;
  onSelectTemplate: (id: string) => void;
  onUseTemplate: (template: TemplateMeta) => void;
  startIndex: number;
  compact?: boolean;
  columns?: string;
}) {
  if (templates.length === 0) return null;

  return (
    <div className="mb-20">
      <SectionLabel>{label}</SectionLabel>
      <h3 className="mb-8 text-[28px] font-black leading-none text-dark sm:text-[36px]">
        {title}
      </h3>
      <div className={`grid grid-cols-1 gap-px bg-dark/10 ${columns}`}>
        {templates.map((template, index) => (
          <TemplateCard
            key={template.id}
            template={template}
            username={username}
            colorTheme={selectedTheme}
            customColors={customColors}
            selected={selectedTemplate === template.id}
            onSelect={onSelectTemplate}
            onUse={onUseTemplate}
            index={startIndex + index}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
}

export function TemplateGallery({
  username,
  draftUsername,
  selectedTemplate,
  selectedTheme,
  customColors,
  onSelectTemplate,
  onSelectTheme,
  onCustomColorsChange,
}: TemplateGalleryProps) {
  const [modalTemplate, setModalTemplate] = useState<TemplateMeta | null>(null);
  const cardStart = PREMIUM_TEMPLATES.length + CLASSIC_TEMPLATES.length;
  const pairStart = cardStart + CARD_TEMPLATES.length;

  function handleUseTemplate(template: TemplateMeta) {
    onSelectTemplate(template.id);
    setModalTemplate(template);
  }

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
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-dark/55">
            Premium layouts include contribution graphs, streaks, rank badges, and
            detailed language breakdowns. Single cards and pairs let you mix stats
            into your README — or build your own palette with Custom colors.
            {username && (
              <>
                {" "}
                Previewing{" "}
                <span className="font-bold text-dark">@{username}</span>
              </>
            )}
          </p>

          <ThemePicker
            selected={selectedTheme}
            onSelect={onSelectTheme}
            customColors={customColors}
            onCustomColorsChange={onCustomColorsChange}
          />

          {!username && (
            <p className="mt-4 rounded-full border border-dark/10 bg-light/50 px-4 py-2 text-[13px] text-dark/50">
              Enter a username above, or browse with demo data. Add{" "}
              <span className="font-bold">GITHUB_TOKEN</span> on the server for
              live contribution graphs, streaks, and language data.
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
          customColors={customColors}
          onSelectTemplate={onSelectTemplate}
          onUseTemplate={handleUseTemplate}
          startIndex={0}
        />

        <TemplateSection
          label="Classic"
          title="Alternative layouts."
          templates={CLASSIC_TEMPLATES}
          username={username}
          selectedTemplate={selectedTemplate}
          selectedTheme={selectedTheme}
          customColors={customColors}
          onSelectTemplate={onSelectTemplate}
          onUseTemplate={handleUseTemplate}
          startIndex={PREMIUM_TEMPLATES.length}
        />

        <TemplateSection
          label="Single Cards"
          title="Modular stat cards."
          templates={CARD_TEMPLATES}
          username={username}
          selectedTemplate={selectedTemplate}
          selectedTheme={selectedTheme}
          customColors={customColors}
          onSelectTemplate={onSelectTemplate}
          onUseTemplate={handleUseTemplate}
          startIndex={cardStart}
          compact
          columns="lg:grid-cols-3"
        />

        <TemplateSection
          label="Pairs"
          title="Stack two stats side by side."
          templates={PAIR_TEMPLATES}
          username={username}
          selectedTemplate={selectedTemplate}
          selectedTheme={selectedTheme}
          customColors={customColors}
          onSelectTemplate={onSelectTemplate}
          onUseTemplate={handleUseTemplate}
          startIndex={pairStart}
          columns="lg:grid-cols-2"
        />
      </div>

      <TemplateUseModal
        template={modalTemplate}
        username={username}
        draftUsername={draftUsername}
        theme={selectedTheme}
        customColors={customColors}
        onClose={() => setModalTemplate(null)}
      />
    </section>
  );
}

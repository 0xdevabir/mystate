"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

type TemplateCategory = "premium" | "classic" | "card" | "pair";

const CATEGORIES: {
  id: TemplateCategory;
  label: string;
  title: string;
  description: string;
  templates: TemplateMeta[];
  compact?: boolean;
  columns?: string;
}[] = [
  {
    id: "premium",
    label: "Premium",
    title: "World-class templates.",
    description: "Full dashboards with graphs, streaks, rank badges, and language breakdowns.",
    templates: PREMIUM_TEMPLATES,
    columns: "lg:grid-cols-2",
  },
  {
    id: "classic",
    label: "Classic",
    title: "Alternative layouts.",
    description: "Timeless arrangements for profile READMEs and portfolio pages.",
    templates: CLASSIC_TEMPLATES,
    columns: "lg:grid-cols-2",
  },
  {
    id: "card",
    label: "Single Cards",
    title: "Modular stat cards.",
    description: "Compact cards for streaks, languages, heatmaps — mix and match in your README.",
    templates: CARD_TEMPLATES,
    compact: true,
    columns: "lg:grid-cols-3",
  },
  {
    id: "pair",
    label: "Pairs",
    title: "Stack two stats side by side.",
    description: "Pre-composed duos that fill a row perfectly on GitHub.",
    templates: PAIR_TEMPLATES,
    columns: "lg:grid-cols-2",
  },
];

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
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>("premium");

  const activeConfig = useMemo(
    () => CATEGORIES.find((c) => c.id === activeCategory) ?? CATEGORIES[0],
    [activeCategory],
  );

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
          className="mb-12 md:mb-16"
        >
          <SectionLabel>Layouts</SectionLabel>
          <SectionTitle>Pick a layout.</SectionTitle>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-dark/55">
            Browse by category — premium dashboards, classic layouts, modular cards,
            or pairs. Customize colors below.
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

        <div className="mb-10">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-accent">
            Category
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <motion.button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  layout
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-bold transition-all duration-500 ease-out ${
                    isActive
                      ? "border-dark bg-dark text-bg shadow-sm"
                      : "border-dark/15 bg-light/60 text-dark/60 hover:border-dark/30 hover:bg-light hover:text-dark"
                  }`}
                >
                  {category.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      isActive ? "bg-bg/15 text-bg/80" : "bg-dark/8 text-dark/45"
                    }`}
                  >
                    {category.templates.length}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionLabel>{activeConfig.label}</SectionLabel>
            <h3 className="mb-3 text-[28px] font-black leading-none text-dark sm:text-[36px]">
              {activeConfig.title}
            </h3>
            <p className="mb-8 max-w-2xl text-[14px] leading-relaxed text-dark/55">
              {activeConfig.description}
            </p>

            <div
              className={`grid grid-cols-1 gap-px bg-dark/10 ${activeConfig.columns ?? "lg:grid-cols-2"}`}
            >
              {activeConfig.templates.map((template, index) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  username={username}
                  colorTheme={selectedTheme}
                  customColors={customColors}
                  selected={selectedTemplate === template.id}
                  onSelect={onSelectTemplate}
                  onUse={handleUseTemplate}
                  index={index}
                  compact={activeConfig.compact}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
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

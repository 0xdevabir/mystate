"use client";

import { motion } from "framer-motion";
import type { TemplateMeta } from "@/types";
import { SectionLabel, SectionTitle } from "./SectionHeader";
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
    <section id="templates" className="bg-bg px-6 py-24 md:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20"
        >
          <SectionLabel>Templates</SectionLabel>
          <SectionTitle>Choose your style.</SectionTitle>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-dark/55">
            {username ? (
              <>
                Showing live previews for{" "}
                <span className="font-bold text-dark">@{username}</span>
              </>
            ) : (
              "Enter your username above to see your stats rendered in each template."
            )}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-px bg-dark/10 md:grid-cols-2 lg:grid-cols-3">
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

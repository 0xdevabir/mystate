"use client";

import { motion } from "framer-motion";
import { TEMPLATES } from "@/lib/templates";
import type { CustomThemeColors } from "@/types";
import { EmbedCodePanel } from "./EmbedCodePanel";
import { SectionLabel, SectionTitle } from "./SectionHeader";

interface EmbedCodeProps {
  username: string;
  template: string;
  theme: string;
  customColors?: CustomThemeColors;
}

export function EmbedCode({ username, template, theme, customColors }: EmbedCodeProps) {
  if (!username) return null;

  const meta = TEMPLATES[template]?.meta;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-dark px-6 py-24 md:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <SectionLabel>Embed Code</SectionLabel>
        <SectionTitle dark className="mb-4">
          Copy & paste.
        </SectionTitle>
        <p className="mb-10 text-[14px] text-bg/50">
          Layout: <span className="font-bold text-accent">{template}</span>
          {" · "}
          Theme: <span className="font-bold text-accent">{theme}</span>
        </p>

        <div className="rounded-2xl border border-bg/10 bg-ink p-6 md:p-8">
          <EmbedCodePanel
            username={username}
            template={template}
            theme={theme}
            customColors={customColors}
            templateWidth={meta?.width}
            templateHeight={meta?.height}
            variant="dark"
          />
        </div>
      </div>
    </motion.section>
  );
}


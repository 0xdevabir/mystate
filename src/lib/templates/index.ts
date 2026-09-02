import type { TemplateMeta, TemplateRenderer } from "@/types";
import { classic } from "./classic";
import { aurora } from "./aurora";
import { minimal } from "./minimal";
import { glass } from "./glass";
import { terminal } from "./terminal";
import { neon } from "./neon";
import { ocean } from "./ocean";
import { sunset } from "./sunset";
import { midnight } from "./midnight";

export const TEMPLATES: Record<string, { meta: TemplateMeta; render: TemplateRenderer }> = {
  classic: {
    meta: {
      id: "classic",
      name: "Classic",
      description: "Clean GitHub-inspired dark card",
      preview: { bg: "#0d1117", accent: "#e6edf3" },
    },
    render: classic,
  },
  aurora: {
    meta: {
      id: "aurora",
      name: "Aurora",
      description: "Northern lights gradient glow",
      preview: { bg: "#302b63", accent: "#00d2ff" },
    },
    render: aurora,
  },
  minimal: {
    meta: {
      id: "minimal",
      name: "Minimal",
      description: "Elegant serif typography on white",
      preview: { bg: "#fafafa", accent: "#171717" },
    },
    render: minimal,
  },
  glass: {
    meta: {
      id: "glass",
      name: "Glass",
      description: "Frosted glass morphism effect",
      preview: { bg: "#1a1a2e", accent: "#94a3b8" },
    },
    render: glass,
  },
  terminal: {
    meta: {
      id: "terminal",
      name: "Terminal",
      description: "Hacker terminal aesthetic",
      preview: { bg: "#0a0a0a", accent: "#4ade80" },
    },
    render: terminal,
  },
  neon: {
    meta: {
      id: "neon",
      name: "Neon",
      description: "Cyberpunk neon borders",
      preview: { bg: "#0a0014", accent: "#ff00ff" },
    },
    render: neon,
  },
  ocean: {
    meta: {
      id: "ocean",
      name: "Ocean",
      description: "Deep blue wave gradients",
      preview: { bg: "#075985", accent: "#38bdf8" },
    },
    render: ocean,
  },
  sunset: {
    meta: {
      id: "sunset",
      name: "Sunset",
      description: "Warm orange and purple hues",
      preview: { bg: "#4a1942", accent: "#fbbf24" },
    },
    render: sunset,
  },
  midnight: {
    meta: {
      id: "midnight",
      name: "Midnight",
      description: "Deep purple with accent stripe",
      preview: { bg: "#0f0720", accent: "#a78bfa" },
    },
    render: midnight,
  },
};

export const TEMPLATE_LIST = Object.values(TEMPLATES).map((t) => t.meta);
export const DEFAULT_THEME = "classic";

export function renderTemplate(theme: string, stats: Parameters<TemplateRenderer>[0]): string {
  const template = TEMPLATES[theme] ?? TEMPLATES[DEFAULT_THEME];
  return template.render(stats);
}

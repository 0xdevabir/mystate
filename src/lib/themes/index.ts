import type { CustomThemeColors, ThemePalette } from "@/types";
import {
  buildCustomPalette,
  CUSTOM_THEME_ID,
  DEFAULT_CUSTOM_COLORS,
  parseCustomColors,
} from "./custom";

export {
  buildCustomPalette,
  CUSTOM_THEME_ID,
  DEFAULT_CUSTOM_COLORS,
  customColorsToParams,
  normalizeHex,
  parseCustomColors,
  stripHash,
} from "./custom";

const base = (id: string, name: string, colors: Omit<ThemePalette, "id" | "name">): ThemePalette => ({
  id,
  name,
  ...colors,
});

export const THEME_PALETTES: Record<string, ThemePalette> = {
  dark: base("dark", "Dark", {
    bg: "#0d1117",
    bgSecondary: "#161b22",
    card: "#1c2128",
    text: "#e6edf3",
    textMuted: "#7d8590",
    accent: "#58a6ff",
    border: "#30363d",
    statLabel: "#7d8590",
    statValue: "#e6edf3",
    highlight: "#3fb950",
    chartLine: "#58a6ff",
    chartFill: "#58a6ff",
    rankRing: "#388bfd",
  }),

  classy: base("classy", "Classy", {
    bg: "#121212",
    bgSecondary: "#1a1a1a",
    card: "#1f1f1f",
    text: "#f5f0e8",
    textMuted: "#9a958c",
    accent: "#c9a962",
    border: "#2e2e2c",
    statLabel: "#8a857c",
    statValue: "#f5f0e8",
    highlight: "#d4bc8a",
    chartLine: "#c9a962",
    chartFill: "#c9a962",
    rankRing: "#a68b4b",
  }),

  glass: base("glass", "Glass", {
    bg: "#0b0f14",
    bgSecondary: "#111820",
    card: "#161d27",
    text: "#eef2f7",
    textMuted: "#8b9cb3",
    accent: "#a8b8cc",
    border: "#2a3544",
    statLabel: "#7a8a9e",
    statValue: "#eef2f7",
    highlight: "#c5d0de",
    chartLine: "#9eb0c4",
    chartFill: "#9eb0c4",
    rankRing: "#7a8fa8",
  }),

  "dark-green": base("dark-green", "Dark Green", {
    bg: "#0a1210",
    bgSecondary: "#0f1a16",
    card: "#132620",
    text: "#d8ebe0",
    textMuted: "#5f8a72",
    accent: "#4caf82",
    border: "#1e3329",
    statLabel: "#5f8a72",
    statValue: "#d8ebe0",
    highlight: "#6ecf9a",
    chartLine: "#4caf82",
    chartFill: "#4caf82",
    rankRing: "#2d8a5c",
  }),

  terminal: base("terminal", "Terminal", {
    bg: "#0a0a0a",
    bgSecondary: "#111111",
    card: "#141414",
    text: "#d4d4d4",
    textMuted: "#4a7c59",
    accent: "#4ade80",
    border: "#1f2e22",
    statLabel: "#4a7c59",
    statValue: "#86efac",
    highlight: "#4ade80",
    chartLine: "#4ade80",
    chartFill: "#4ade80",
    rankRing: "#22c55e",
  }),

  midnight: base("midnight", "Midnight", {
    bg: "#09090b",
    bgSecondary: "#111113",
    card: "#18181b",
    text: "#fafafa",
    textMuted: "#71717a",
    accent: "#a1a1aa",
    border: "#27272a",
    statLabel: "#71717a",
    statValue: "#fafafa",
    highlight: "#d4d4d8",
    chartLine: "#a1a1aa",
    chartFill: "#a1a1aa",
    rankRing: "#52525b",
  }),

  slate: base("slate", "Slate", {
    bg: "#0f172a",
    bgSecondary: "#1e293b",
    card: "#1e293b",
    text: "#f1f5f9",
    textMuted: "#94a3b8",
    accent: "#94a3b8",
    border: "#334155",
    statLabel: "#94a3b8",
    statValue: "#f1f5f9",
    highlight: "#cbd5e1",
    chartLine: "#94a3b8",
    chartFill: "#64748b",
    rankRing: "#475569",
  }),

  paper: base("paper", "Paper", {
    bg: "#fafaf9",
    bgSecondary: "#f5f5f4",
    card: "#ffffff",
    text: "#1c1917",
    textMuted: "#78716c",
    accent: "#44403c",
    border: "#e7e5e4",
    statLabel: "#78716c",
    statValue: "#1c1917",
    highlight: "#57534e",
    chartLine: "#57534e",
    chartFill: "#a8a29e",
    rankRing: "#44403c",
  }),
};

export const THEME_LIST = Object.values(THEME_PALETTES);
export const DEFAULT_THEME = "dark";

export function getTheme(id: string, customColors?: CustomThemeColors): ThemePalette {
  if (id === CUSTOM_THEME_ID && customColors) {
    return buildCustomPalette(customColors);
  }
  return THEME_PALETTES[id] ?? THEME_PALETTES[DEFAULT_THEME];
}

export function resolveThemeFromParams(
  themeId: string,
  searchParams: { get(name: string): string | null },
): ThemePalette {
  if (themeId === CUSTOM_THEME_ID) {
    const custom = parseCustomColors(
      searchParams.get("bg"),
      searchParams.get("accent"),
      searchParams.get("highlight"),
    );
    if (custom) return buildCustomPalette(custom);
  }
  return getTheme(themeId);
}


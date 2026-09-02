import type { CustomThemeColors, ThemePalette } from "@/types";

export const CUSTOM_THEME_ID = "custom";

export const DEFAULT_CUSTOM_COLORS: CustomThemeColors = {
  bg: "#0d1117",
  accent: "#58a6ff",
  highlight: "#3fb950",
};

const HEX_RE = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function normalizeHex(hex: string): string {
  const trimmed = hex.trim();
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  if (!HEX_RE.test(withHash)) return "";
  if (withHash.length === 4) {
    const [, r, g, b] = withHash;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return withHash.toLowerCase();
}

export function stripHash(hex: string): string {
  return normalizeHex(hex).replace("#", "");
}

function parseHex(hex: string): [number, number, number] {
  const normalized = normalizeHex(hex);
  const h = normalized.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function toHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
    .join("")}`;
}

function mixHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = parseHex(a);
  const [br, bg, bb] = parseHex(b);
  return toHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = parseHex(hex).map((v) => {
    const channel = v / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function buildCustomPalette(colors: CustomThemeColors): ThemePalette {
  const bg = normalizeHex(colors.bg);
  const accent = normalizeHex(colors.accent);
  const highlight = normalizeHex(colors.highlight);

  const light = relativeLuminance(bg) > 0.5;
  const text = light ? "#1c1917" : "#e6edf3";
  const textMuted = mixHex(text, bg, 0.55);
  const bgSecondary = mixHex(bg, light ? "#000000" : "#ffffff", 0.08);
  const card = mixHex(bgSecondary, light ? "#ffffff" : "#000000", light ? 0.45 : 0.12);
  const border = mixHex(bg, text, 0.2);
  const rankRing = mixHex(accent, bg, 0.35);

  return {
    id: CUSTOM_THEME_ID,
    name: "Custom",
    bg,
    bgSecondary,
    card,
    text,
    textMuted,
    accent,
    border,
    statLabel: textMuted,
    statValue: text,
    highlight,
    chartLine: accent,
    chartFill: accent,
    rankRing,
  };
}

export function parseCustomColors(
  bg?: string | null,
  accent?: string | null,
  highlight?: string | null,
): CustomThemeColors | null {
  if (!bg || !accent || !highlight) return null;

  const normalized = {
    bg: normalizeHex(bg),
    accent: normalizeHex(accent),
    highlight: normalizeHex(highlight),
  };

  if (!normalized.bg || !normalized.accent || !normalized.highlight) return null;
  return normalized;
}

export function customColorsToParams(colors: CustomThemeColors): Record<string, string> {
  return {
    bg: stripHash(colors.bg),
    accent: stripHash(colors.accent),
    highlight: stripHash(colors.highlight),
  };
}

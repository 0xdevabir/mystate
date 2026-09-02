import type { CustomThemeColors } from "@/types";
import { CUSTOM_THEME_ID, customColorsToParams } from "@/lib/themes/custom";

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function appendCustomColors(
  params: URLSearchParams,
  theme: string,
  customColors?: CustomThemeColors,
) {
  if (theme === CUSTOM_THEME_ID && customColors) {
    const colorParams = customColorsToParams(customColors);
    params.set("bg", colorParams.bg);
    params.set("accent", colorParams.accent);
    params.set("highlight", colorParams.highlight);
  }
}

/** Relative URL for in-app previews (works on localhost + production). */
export function buildPreviewUrl(
  username: string,
  template: string,
  theme: string,
  preview = true,
  customColors?: CustomThemeColors,
): string {
  const params = new URLSearchParams({
    username,
    template,
    theme,
  });
  if (preview) params.set("preview", "1");
  appendCustomColors(params, theme, customColors);
  return `/api/stats?${params.toString()}`;
}

/** Absolute URL for README embed code. */
export function buildEmbedUrl(
  username: string,
  template: string,
  theme: string,
  customColors?: CustomThemeColors,
): string {
  const params = new URLSearchParams({ username, template, theme });
  appendCustomColors(params, theme, customColors);
  return `${getBaseUrl()}/api/stats?${params.toString()}`;
}

export function buildMarkdown(
  username: string,
  template: string,
  theme: string,
  customColors?: CustomThemeColors,
): string {
  return `![MyState](${buildEmbedUrl(username, template, theme, customColors)})`;
}

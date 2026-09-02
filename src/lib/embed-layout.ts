import type { TemplateMeta } from "@/types";
import type { CustomThemeColors } from "@/types";
import { buildEmbedUrl } from "./utils";

export type EmbedLayout = "full" | "half";

export type EmbedFormat = "github" | "markdown";

/** GitHub profile README content column is ~830px; optimize embed width accordingly. */
export function getEmbedLayout(
  meta: Pick<TemplateMeta, "width" | "category">,
): EmbedLayout {
  if (meta.category === "card") return "half";
  if (meta.category === "premium" || meta.category === "pair") return "full";
  return meta.width < 600 ? "half" : "full";
}

export function getEmbedLayoutLabel(layout: EmbedLayout): string {
  return layout === "full" ? "Full width" : "Half width (2 per row)";
}

export function getEmbedLayoutHint(layout: EmbedLayout): string {
  if (layout === "full") {
    return "Uses 100% of your README column — best for dashboards and wide layouts.";
  }
  return "Uses ~49% width so you can place two small cards side by side. Copy the pair snippet below or paste two embeds on one line.";
}

interface BuildEmbedOptions {
  username: string;
  template: string;
  theme: string;
  customColors?: CustomThemeColors;
  layout: EmbedLayout;
  format: EmbedFormat;
}

export function buildEmbedSnippet({
  username,
  template,
  theme,
  customColors,
  layout,
  format,
}: BuildEmbedOptions): string {
  const url = buildEmbedUrl(username, template, theme, customColors);

  if (format === "markdown") {
    return `![My GitHub Stats](${url})`;
  }

  const width = layout === "full" ? "100%" : "49%";
  return `<p align="center">\n  <img src="${url}" width="${width}" alt="My GitHub Stats" />\n</p>`;
}

export function buildPairEmbedSnippet({
  username,
  template,
  theme,
  customColors,
  secondTemplate,
}: {
  username: string;
  template: string;
  theme: string;
  customColors?: CustomThemeColors;
  secondTemplate?: string;
}): string {
  const url1 = buildEmbedUrl(username, template, theme, customColors);
  const url2 = buildEmbedUrl(
    username,
    secondTemplate ?? template,
    theme,
    customColors,
  );

  return `<p align="center">
  <img src="${url1}" width="49%" alt="GitHub Stats" />
  <img src="${url2}" width="49%" alt="GitHub Stats" />
</p>`;
}

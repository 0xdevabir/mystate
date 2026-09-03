import type { TemplateMeta, TemplateRenderer } from "@/types";
import type { CustomThemeColors } from "@/types";
import { getTheme } from "@/lib/themes";
import { profileCard, profileCardMeta } from "./layouts/profile-card";
import { dashboard, dashboardMeta } from "./layouts/dashboard";
import { terminal, terminalMeta } from "./layouts/terminal";
import { statsGrid, statsGridMeta } from "./layouts/stats-grid";
import { banner, bannerMeta } from "./layouts/banner";
import { radialHub, radialHubMeta } from "./layouts/radial-hub";
import { activityStack, activityStackMeta } from "./layouts/activity-stack";
import { compactStrip, compactStripMeta } from "./layouts/compact-strip";
import { proDashboard, proDashboardMeta } from "./layouts/pro-dashboard";
import { contribGraph, contribGraphMeta } from "./layouts/contrib-graph";
import { languageExpert, languageExpertMeta } from "./layouts/language-expert";
import { cleanSlate, cleanSlateMeta } from "./layouts/clean-slate";
import { streakHero, streakHeroMeta } from "./layouts/streak-hero";
import { heatmapPro, heatmapProMeta } from "./layouts/heatmap-pro";
import { radarPulse, radarPulseMeta } from "./layouts/radar-pulse";
import { orbitRings, orbitRingsMeta } from "./layouts/orbit-rings";
import { CARD_TEMPLATE_ENTRIES } from "./layouts/cards";
import { PAIR_TEMPLATE_ENTRIES } from "./layouts/pairs";

export const TEMPLATES: Record<
  string,
  { meta: TemplateMeta; render: TemplateRenderer }
> = {
  [proDashboardMeta.id]: { meta: proDashboardMeta, render: proDashboard },
  [contribGraphMeta.id]: { meta: contribGraphMeta, render: contribGraph },
  [languageExpertMeta.id]: { meta: languageExpertMeta, render: languageExpert },
  [streakHeroMeta.id]: { meta: streakHeroMeta, render: streakHero },
  [heatmapProMeta.id]: { meta: heatmapProMeta, render: heatmapPro },
  [radarPulseMeta.id]: { meta: radarPulseMeta, render: radarPulse },
  [orbitRingsMeta.id]: { meta: orbitRingsMeta, render: orbitRings },
  [cleanSlateMeta.id]: { meta: cleanSlateMeta, render: cleanSlate },
  [profileCardMeta.id]: { meta: profileCardMeta, render: profileCard },
  [dashboardMeta.id]: { meta: dashboardMeta, render: dashboard },
  [terminalMeta.id]: { meta: terminalMeta, render: terminal },
  [statsGridMeta.id]: { meta: statsGridMeta, render: statsGrid },
  [bannerMeta.id]: { meta: bannerMeta, render: banner },
  [radialHubMeta.id]: { meta: radialHubMeta, render: radialHub },
  [activityStackMeta.id]: { meta: activityStackMeta, render: activityStack },
  [compactStripMeta.id]: { meta: compactStripMeta, render: compactStrip },
  ...Object.fromEntries(
    CARD_TEMPLATE_ENTRIES.map((t) => [t.meta.id, { meta: t.meta, render: t.render }]),
  ),
  ...Object.fromEntries(
    PAIR_TEMPLATE_ENTRIES.map((t) => [t.meta.id, { meta: t.meta, render: t.render }]),
  ),
};

export const TEMPLATE_LIST = Object.values(TEMPLATES).map((t) => t.meta);
export const PREMIUM_TEMPLATES = TEMPLATE_LIST.filter((t) => t.category === "premium");
export const CLASSIC_TEMPLATES = TEMPLATE_LIST.filter((t) => t.category === "classic");
export const CARD_TEMPLATES = TEMPLATE_LIST.filter((t) => t.category === "card");
export const PAIR_TEMPLATES = TEMPLATE_LIST.filter((t) => t.category === "pair");
export const DEFAULT_TEMPLATE = "pro-dashboard";

export function renderTemplate(
  templateId: string,
  themeId: string,
  stats: Parameters<TemplateRenderer>[0],
  customColors?: CustomThemeColors,
): string {
  const template = TEMPLATES[templateId] ?? TEMPLATES[DEFAULT_TEMPLATE];
  const palette = getTheme(themeId, customColors);
  return template.render(stats, palette);
}

export function getTemplateDimensions(templateId: string): {
  width: number;
  height: number;
} {
  const template = TEMPLATES[templateId] ?? TEMPLATES[DEFAULT_TEMPLATE];
  return { width: template.meta.width, height: template.meta.height };
}



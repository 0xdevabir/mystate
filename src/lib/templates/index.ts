import type { TemplateMeta, TemplateRenderer } from "@/types";
import { getTheme } from "@/lib/themes";
import { profileCard, profileCardMeta } from "./layouts/profile-card";
import { dashboard, dashboardMeta } from "./layouts/dashboard";
import { terminal, terminalMeta } from "./layouts/terminal";
import { statsGrid, statsGridMeta } from "./layouts/stats-grid";
import { banner, bannerMeta } from "./layouts/banner";
import { radialHub, radialHubMeta } from "./layouts/radial-hub";
import { activityStack, activityStackMeta } from "./layouts/activity-stack";
import { compactStrip, compactStripMeta } from "./layouts/compact-strip";

export const TEMPLATES: Record<
  string,
  { meta: TemplateMeta; render: TemplateRenderer }
> = {
  [profileCardMeta.id]: { meta: profileCardMeta, render: profileCard },
  [dashboardMeta.id]: { meta: dashboardMeta, render: dashboard },
  [terminalMeta.id]: { meta: terminalMeta, render: terminal },
  [statsGridMeta.id]: { meta: statsGridMeta, render: statsGrid },
  [bannerMeta.id]: { meta: bannerMeta, render: banner },
  [radialHubMeta.id]: { meta: radialHubMeta, render: radialHub },
  [activityStackMeta.id]: { meta: activityStackMeta, render: activityStack },
  [compactStripMeta.id]: { meta: compactStripMeta, render: compactStrip },
};

export const TEMPLATE_LIST = Object.values(TEMPLATES).map((t) => t.meta);
export const DEFAULT_TEMPLATE = "profile-card";

export function renderTemplate(
  templateId: string,
  themeId: string,
  stats: Parameters<TemplateRenderer>[0],
): string {
  const template = TEMPLATES[templateId] ?? TEMPLATES[DEFAULT_TEMPLATE];
  const palette = getTheme(themeId);
  return template.render(stats, palette);
}

export function getTemplateDimensions(templateId: string): {
  width: number;
  height: number;
} {
  const template = TEMPLATES[templateId] ?? TEMPLATES[DEFAULT_TEMPLATE];
  return { width: template.meta.width, height: template.meta.height };
}

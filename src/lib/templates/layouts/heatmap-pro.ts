import type { GitHubStats, ThemePalette } from "@/types";
import { formatNumber } from "@/lib/utils";
import { svgOpen, svgClose, bgRect, text, displayName } from "../core/svg";
import { subtleFrame, heatmapStrip, rankBadge } from "../core/charts";

const W = 780;
const H = 220;

export function heatmapPro(stats: GitHubStats, palette: ThemePalette): string {
  const name = displayName(stats);

  return `${svgOpen(W, H)}
    ${bgRect(W, H, palette, 10)}
    ${subtleFrame(W, H, palette)}

    ${text(24, 32, name, { fill: palette.text, size: 15, weight: 800 })}
    ${text(24, 50, `@${stats.username}`, { fill: palette.textMuted, size: 10 })}
    ${text(280, 40, `${formatNumber(stats.contributionsLastYear)} contributions last year`, {
      fill: palette.textMuted,
      size: 10,
    })}
    ${text(280, 56, `${stats.currentStreak} day streak · ${stats.longestStreak} longest`, {
      fill: palette.textMuted,
      size: 9,
    })}

    ${rankBadge(W - 52, 50, stats.rank, palette, 44)}

    ${heatmapStrip(stats.contributionDays, 24, 80, W - 48, 100, palette)}

    <g transform="translate(24, ${H - 24})">
      ${text(0, 0, "Less", { fill: palette.textMuted, size: 8 })}
      ${[0.1, 0.3, 0.5, 0.7, 1].map((o, i) => `<rect x="${30 + i * 14}" y="-10" width="12" height="12" rx="2" fill="${palette.highlight}" opacity="${0.1 + o * 0.8}"/>`).join("")}
      ${text(110, 0, "More", { fill: palette.textMuted, size: 8 })}
    </g>
  ${svgClose()}`;
}

export const heatmapProMeta = {
  id: "heatmap-pro",
  name: "Heatmap Pro",
  description: "GitHub-style contribution heatmap with rank badge",
  width: W,
  height: H,
  previewBg: "#0d1117",
  category: "premium" as const,
};


import type { GitHubStats, ThemePalette } from "@/types";
import { formatNumber } from "@/lib/utils";
import { svgOpen, svgClose, bgRect, text, displayName } from "../core/svg";
import { subtleFrame, streakCard, heatmapStrip } from "../core/charts";

const W = 760;
const H = 280;

export function streakHero(stats: GitHubStats, palette: ThemePalette): string {
  const name = displayName(stats);
  const streakW = (W - 56) / 3;

  return `${svgOpen(W, H)}
    ${bgRect(W, H, palette, 12)}
    ${subtleFrame(W, H, palette)}

    ${text(28, 36, name, { fill: palette.text, size: 18, weight: 800 })}
    ${text(28, 56, `@${stats.username} · Rank ${stats.rank}`, { fill: palette.textMuted, size: 10 })}

    ${streakCard(24, 72, streakW, 96, "★", "Total Stars", formatNumber(stats.totalStars), `${stats.publicRepos} repos`, palette, palette.accent)}
    ${streakCard(28 + streakW, 72, streakW, 96, "🔥", "Current Streak", `${stats.currentStreak} days`, stats.currentStreakRange, palette, "#ff8a65")}
    ${streakCard(32 + streakW * 2, 72, streakW, 96, "↻", "Longest Streak", `${stats.longestStreak} days`, stats.longestStreakRange, palette, palette.highlight)}

    ${text(28, 188, "Contribution Heatmap", { fill: palette.textMuted, size: 9, weight: 600 })}
    ${heatmapStrip(stats.contributionDays, 28, 200, W - 56, 48, palette)}
  ${svgClose()}`;
}

export const streakHeroMeta = {
  id: "streak-hero",
  name: "Streak Hero",
  description: "Streak cards with contribution heatmap strip",
  width: W,
  height: H,
  previewBg: "#0d1117",
  category: "premium" as const,
};


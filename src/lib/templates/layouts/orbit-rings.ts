import type { GitHubStats, ThemePalette } from "@/types";
import { formatNumber } from "@/lib/utils";
import { svgOpen, svgClose, bgRect, text, avatar, displayName } from "../core/svg";
import { subtleFrame, card, ringGauge, rankBadge, areaChartPro } from "../core/charts";

const W = 700;
const H = 430;

export function orbitRings(stats: GitHubStats, palette: ThemePalette): string {
  const name = displayName(stats);

  const cx = 168;
  const cy = 220;

  const rings = [
    {
      r: 104,
      sw: 13,
      color: "#ff8a65",
      value: stats.currentStreak,
      max: Math.max(stats.currentStreak, stats.longestStreak, 30),
      label: "Current Streak",
      display: `${stats.currentStreak}d`,
      sub: `best ${stats.longestStreak}d`,
    },
    {
      r: 79,
      sw: 12,
      color: "#f1e05a",
      value: stats.totalStars,
      max: Math.max(stats.totalStars, 400),
      label: "Total Stars",
      display: formatNumber(stats.totalStars),
      sub: `${stats.publicRepos} repos`,
    },
    {
      r: 54,
      sw: 11,
      color: "#bc8cff",
      value: stats.totalPullRequests,
      max: Math.max(stats.totalPullRequests, 250),
      label: "Pull Requests",
      display: formatNumber(stats.totalPullRequests),
      sub: `${stats.followers} followers`,
    },
  ];

  const ringsSvg = rings.map((rg) => ringGauge(cx, cy, rg.r, rg.value, rg.max, rg.color, rg.sw)).join("");

  const legend = rings
    .map((rg, i) => {
      const y = 96 + i * 62;
      return `
        <circle cx="384" cy="${y - 5}" r="4" fill="${rg.color}"/>
        ${text(398, y, rg.label, { fill: palette.textMuted, size: 10, weight: 600 })}
        ${text(398, y + 22, rg.display, { fill: palette.text, size: 20, weight: 800 })}
        ${text(398, y + 36, rg.sub, { fill: palette.textMuted, size: 8, opacity: 0.75 })}`;
    })
    .join("");

  const chartY = 318;
  const chartH = H - chartY - 24;

  return `${svgOpen(W, H)}
    ${bgRect(W, H, palette, 14)}
    ${subtleFrame(W, H, palette)}

    ${avatar(stats.avatar, 24, 24, 40, palette)}
    ${text(74, 40, name, { fill: palette.text, size: 15, weight: 800 })}
    ${text(74, 56, `@${stats.username} · Rank ${stats.rank}`, { fill: palette.textMuted, size: 10 })}
    ${rankBadge(W - 52, 46, stats.rank, palette, 44)}

    ${ringsSvg}
    ${text(cx, cy - 6, "🔥", { fill: rings[0].color, size: 20, anchor: "middle" })}
    ${text(cx, cy + 22, `${stats.currentStreak}`, { fill: palette.text, size: 26, weight: 800, anchor: "middle" })}
    ${text(cx, cy + 38, "day streak", { fill: palette.textMuted, size: 9, weight: 600, anchor: "middle" })}

    <line x1="360" y1="90" x2="360" y2="290" stroke="${palette.border}" stroke-width="1" opacity="0.4"/>
    ${legend}

    ${card(24, chartY, W - 48, chartH, palette)}
    ${text(40, chartY + 20, "Contribution Trend", { fill: palette.textMuted, size: 10, weight: 600 })}
    ${areaChartPro(stats.monthlyContributions, 28, chartY + 26, W - 72, chartH - 32, palette, "orbit")}
  ${svgClose()}`;
}

export const orbitRingsMeta = {
  id: "orbit-rings",
  name: "Orbit Rings",
  description: "Apple-Watch style progress rings with a monthly trend chart",
  width: W,
  height: H,
  previewBg: "#0d1117",
  category: "premium" as const,
};

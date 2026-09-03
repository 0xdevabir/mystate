import type { GitHubStats, ThemePalette } from "@/types";
import { formatNumber } from "@/lib/utils";
import { svgOpen, svgClose, bgRect, text, avatar, displayName } from "../core/svg";
import { subtleFrame, radarChart, rankBadge } from "../core/charts";

const W = 700;
const H = 460;

export function radarPulse(stats: GitHubStats, palette: ThemePalette): string {
  const name = displayName(stats);

  const metrics = [
    { label: "Stars", value: stats.totalStars, max: Math.max(stats.totalStars, 400) },
    { label: "Repos", value: stats.publicRepos, max: Math.max(stats.publicRepos, 100) },
    { label: "Pull Requests", value: stats.totalPullRequests, max: Math.max(stats.totalPullRequests, 250) },
    { label: "Followers", value: stats.followers, max: Math.max(stats.followers, 150) },
    { label: "Streak", value: stats.currentStreak, max: Math.max(stats.currentStreak, 45) },
    { label: "Commits", value: stats.totalCommits, max: Math.max(stats.totalCommits, 2500) },
  ];

  const cx = 248;
  const cy = 268;
  const r = 132;

  const legend = metrics
    .map((m, i) => {
      const y = 108 + i * 34;
      return `
        <circle cx="${472}" cy="${y - 4}" r="3.5" fill="${palette.chartLine}" opacity="${0.4 + (i / metrics.length) * 0.6}"/>
        ${text(484, y, m.label, { fill: palette.textMuted, size: 10, weight: 600 })}
        ${text(676, y, formatNumber(m.value), { fill: palette.text, size: 13, weight: 800, anchor: "end" })}`;
    })
    .join("");

  return `${svgOpen(W, H)}
    ${bgRect(W, H, palette, 14)}
    ${subtleFrame(W, H, palette)}

    ${avatar(stats.avatar, 24, 24, 40, palette)}
    ${text(74, 40, name, { fill: palette.text, size: 15, weight: 800 })}
    ${text(74, 56, `@${stats.username}`, { fill: palette.textMuted, size: 10 })}
    ${rankBadge(W - 52, 46, stats.rank, palette, 44)}

    ${text(28, 100, "CONTRIBUTION FINGERPRINT", { fill: palette.accent, size: 9, weight: 700, opacity: 0.85 })}

    ${radarChart(metrics, cx, cy, r, palette, "pulse")}

    <line x1="440" y1="90" x2="440" y2="${H - 32}" stroke="${palette.border}" stroke-width="1" opacity="0.4"/>
    ${legend}
  ${svgClose()}`;
}

export const radarPulseMeta = {
  id: "radar-pulse",
  name: "Radar Pulse",
  description: "Six-axis contribution radar with a glowing polygon fingerprint",
  width: W,
  height: H,
  previewBg: "#0d1117",
  category: "premium" as const,
};

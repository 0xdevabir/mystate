import type { GitHubStats, ThemePalette, TemplateMeta } from "@/types";
import { formatNumber } from "@/lib/utils";
import { svgOpen, svgClose, bgRect, text, displayName, footer, avatar } from "../core/svg";
import {
  subtleFrame,
  card,
  areaChart,
  rankBadge,
  languageListRows,
  heatmapStrip,
  streakCard,
} from "../core/charts";

function pairShell(
  w: number,
  h: number,
  palette: ThemePalette,
  body: string,
): string {
  return `${svgOpen(w, h)}
    ${bgRect(w, h, palette, 12)}
    ${subtleFrame(w, h, palette)}
    ${body}
    ${footer(24, h - 8, palette)}
  ${svgClose()}`;
}

// ── Streak + Languages ───────────────────────────────────────
const SL_W = 760;
const SL_H = 200;

export function pairStreakLang(stats: GitHubStats, palette: ThemePalette): string {
  const leftW = 360;
  const rightX = 388;
  const rightW = SL_W - rightX - 24;
  const half = (leftW - 8) / 2;

  return pairShell(
    SL_W,
    SL_H,
    palette,
    `
    ${text(24, 32, displayName(stats), { fill: palette.text, size: 14, weight: 800 })}
    ${text(24, 48, `@${stats.username}`, { fill: palette.textMuted, size: 9 })}

    ${streakCard(24, 60, half, 108, "🔥", "Current streak", `${stats.currentStreak}d`, stats.currentStreakRange, palette, palette.highlight)}
    ${streakCard(32 + half, 60, half, 108, "↻", "Longest streak", `${stats.longestStreak}d`, stats.longestStreakRange, palette, palette.accent)}

    ${card(rightX, 60, rightW, 108, palette)}
    ${text(rightX + 16, 80, "Languages", { fill: palette.text, size: 11, weight: 700 })}
    ${languageListRows(stats.topLanguages, rightX + 16, 92, rightW - 32, palette, 20, 4)}
  `,
  );
}

export const pairStreakLangMeta: TemplateMeta = {
  id: "pair-streak-lang",
  name: "Streak + Languages",
  description: "Contribution streaks paired with language breakdown",
  width: SL_W,
  height: SL_H,
  previewBg: "#0d1117",
  category: "pair",
};

// ── Graph + Stats ────────────────────────────────────────────
const GS_W = 780;
const GS_H = 220;

export function pairGraphStats(stats: GitHubStats, palette: ThemePalette): string {
  const leftW = 420;
  const rightX = 448;
  const rightW = GS_W - rightX - 24;

  const statLines = [
    { label: "Stars", value: stats.totalStars },
    { label: "Contributions", value: stats.contributionsLastYear },
    { label: "Pull Requests", value: stats.totalPullRequests },
    { label: "Issues", value: stats.totalIssues },
  ];

  const statsSvg = statLines
    .map((s, i) => {
      const y = 88 + i * 28;
      return `
        ${text(rightX + 16, y, s.label, { fill: palette.textMuted, size: 10 })}
        ${text(rightX + rightW - 16, y, formatNumber(s.value), {
          fill: palette.text,
          size: 12,
          weight: 700,
          anchor: "end",
        })}`;
    })
    .join("");

  return pairShell(
    GS_W,
    GS_H,
    palette,
    `
    ${text(24, 32, "Contributions & Stats", { fill: palette.text, size: 14, weight: 800 })}
    ${text(24, 48, `@${stats.username}`, { fill: palette.textMuted, size: 9 })}

    ${card(24, 60, leftW, 132, palette)}
    ${areaChart(stats.monthlyContributions, 36, 72, leftW - 24, 108, palette, "pair-gs")}

    ${card(rightX, 60, rightW, 132, palette)}
    ${text(rightX + 16, 80, "GitHub Stats", { fill: palette.text, size: 11, weight: 700 })}
    ${statsSvg}
    ${rankBadge(rightX + rightW - 44, 148, stats.rank, palette, 36)}
  `,
  );
}

export const pairGraphStatsMeta: TemplateMeta = {
  id: "pair-graph-stats",
  name: "Graph + Stats",
  description: "Monthly contribution chart with key metrics",
  width: GS_W,
  height: GS_H,
  previewBg: "#0d1117",
  category: "pair",
};

// ── Rank + Streak ────────────────────────────────────────────
const RS_W = 700;
const RS_H = 180;

export function pairRankStreak(stats: GitHubStats, palette: ThemePalette): string {
  const name = displayName(stats);
  const streakW = (RS_W - 280) / 2;

  return pairShell(
    RS_W,
    RS_H,
    palette,
    `
    ${text(24, 32, name, { fill: palette.text, size: 14, weight: 800 })}
    ${text(24, 48, `@${stats.username}`, { fill: palette.textMuted, size: 9 })}

    ${card(24, 60, 200, 100, palette)}
    ${rankBadge(124, 108, stats.rank, palette, 52)}
    ${text(124, 148, `${formatNumber(stats.totalStars)} stars`, {
      fill: palette.textMuted,
      size: 9,
      anchor: "middle",
    })}

    ${streakCard(240, 60, streakW, 100, "🔥", "Current", `${stats.currentStreak}d`, stats.currentStreakRange, palette, palette.highlight)}
    ${streakCard(248 + streakW, 60, streakW, 100, "↻", "Longest", `${stats.longestStreak}d`, stats.longestStreakRange, palette, palette.accent)}
  `,
  );
}

export const pairRankStreakMeta: TemplateMeta = {
  id: "pair-rank-streak",
  name: "Rank + Streak",
  description: "Rank badge with current and longest streaks",
  width: RS_W,
  height: RS_H,
  previewBg: "#0d1117",
  category: "pair",
};

// ── Profile + Stats ──────────────────────────────────────────
const PS_W = 720;
const PS_H = 170;

export function pairProfileStats(stats: GitHubStats, palette: ThemePalette): string {
  const name = displayName(stats);
  const metrics = [
    { label: "Stars", value: stats.totalStars },
    { label: "Contribs", value: stats.contributionsLastYear },
    { label: "PRs", value: stats.totalPullRequests },
    { label: "Followers", value: stats.followers },
  ];
  const tileW = (PS_W - 280) / 4;

  const tiles = metrics
    .map((m, i) => {
      const x = 256 + i * (tileW + 4);
      return `
        ${card(x, 52, tileW, 96, palette)}
        ${text(x + tileW / 2, 88, formatNumber(m.value), {
          fill: palette.text,
          size: 16,
          weight: 800,
          anchor: "middle",
        })}
        ${text(x + tileW / 2, 106, m.label, {
          fill: palette.textMuted,
          size: 8,
          anchor: "middle",
        })}`;
    })
    .join("");

  return pairShell(
    PS_W,
    PS_H,
    palette,
    `
    ${avatar(stats.avatar, 24, 52, 64, palette)}
    ${text(100, 76, name, { fill: palette.text, size: 14, weight: 800 })}
    ${text(100, 94, `@${stats.username}`, { fill: palette.textMuted, size: 10 })}
    ${text(100, 112, stats.bio ?? "", { fill: palette.textMuted, size: 9 })}
    ${rankBadge(200, 100, stats.rank, palette, 36)}
    ${tiles}
  `,
  );
}

export const pairProfileStatsMeta: TemplateMeta = {
  id: "pair-profile-stats",
  name: "Profile + Stats",
  description: "Profile header with four stat tiles",
  width: PS_W,
  height: PS_H,
  previewBg: "#0d1117",
  category: "pair",
};

// ── Heatmap + Rank ───────────────────────────────────────────
const HR_W = 760;
const HR_H = 180;

export function pairHeatmapRank(stats: GitHubStats, palette: ThemePalette): string {
  return pairShell(
    HR_W,
    HR_H,
    palette,
    `
    ${text(24, 32, displayName(stats), { fill: palette.text, size: 14, weight: 800 })}
    ${text(24, 48, `${formatNumber(stats.contributionsLastYear)} contributions · ${stats.currentStreak}d streak`, {
      fill: palette.textMuted,
      size: 9,
    })}

    ${card(24, 60, HR_W - 120, 100, palette)}
    ${heatmapStrip(stats.contributionDays, 36, 72, HR_W - 148, 76, palette)}

    ${rankBadge(HR_W - 56, 108, stats.rank, palette, 48)}
  `,
  );
}

export const pairHeatmapRankMeta: TemplateMeta = {
  id: "pair-heatmap-rank",
  name: "Heatmap + Rank",
  description: "Activity heatmap with rank badge",
  width: HR_W,
  height: HR_H,
  previewBg: "#0d1117",
  category: "pair",
};

export const PAIR_TEMPLATE_ENTRIES = [
  { meta: pairStreakLangMeta, render: pairStreakLang },
  { meta: pairGraphStatsMeta, render: pairGraphStats },
  { meta: pairRankStreakMeta, render: pairRankStreak },
  { meta: pairProfileStatsMeta, render: pairProfileStats },
  { meta: pairHeatmapRankMeta, render: pairHeatmapRank },
] as const;

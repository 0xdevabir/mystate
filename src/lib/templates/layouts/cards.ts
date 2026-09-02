import type { GitHubStats, ThemePalette, TemplateMeta } from "@/types";
import { formatNumber } from "@/lib/utils";
import { svgOpen, svgClose, bgRect, text, displayName, footer, avatar } from "../core/svg";
import {
  subtleFrame,
  card,
  areaChart,
  rankBadge,
  languageListRows,
  languageStackedBar,
  heatmapStrip,
  streakCard,
} from "../core/charts";

function cardShell(
  w: number,
  h: number,
  palette: ThemePalette,
  body: string,
  title?: string,
): string {
  return `${svgOpen(w, h)}
    ${bgRect(w, h, palette, 10)}
    ${subtleFrame(w, h, palette)}
    ${title ? text(20, 28, title, { fill: palette.text, size: 12, weight: 700 }) : ""}
    ${body}
    ${footer(20, h - 8, palette)}
  ${svgClose()}`;
}

// ── Streak card ──────────────────────────────────────────────
const STREAK_W = 400;
const STREAK_H = 160;

export function cardStreak(stats: GitHubStats, palette: ThemePalette): string {
  const half = (STREAK_W - 52) / 2;
  return cardShell(
    STREAK_W,
    STREAK_H,
    palette,
    `
    ${text(20, 48, `@${stats.username}`, { fill: palette.textMuted, size: 9 })}
    ${streakCard(20, 56, half, 88, "🔥", "Current", `${stats.currentStreak}d`, stats.currentStreakRange, palette, palette.highlight)}
    ${streakCard(28 + half, 56, half, 88, "↻", "Longest", `${stats.longestStreak}d`, stats.longestStreakRange, palette, palette.accent)}
  `,
    "Streak",
  );
}

export const cardStreakMeta: TemplateMeta = {
  id: "card-streak",
  name: "Streak",
  description: "Current & longest contribution streaks",
  width: STREAK_W,
  height: STREAK_H,
  previewBg: "#0d1117",
  category: "card",
};

// ── Languages card ───────────────────────────────────────────
const LANG_W = 420;
const LANG_H = 200;

export function cardLanguages(stats: GitHubStats, palette: ThemePalette): string {
  return cardShell(
    LANG_W,
    LANG_H,
    palette,
    `
    ${languageStackedBar(stats.topLanguages, 32, 54, LANG_W - 64, 6)}
    ${languageListRows(stats.topLanguages, 32, 72, LANG_W - 64, palette, 22, 5)}
  `,
    "Languages",
  );
}

export const cardLanguagesMeta: TemplateMeta = {
  id: "card-languages",
  name: "Languages",
  description: "Top languages with distribution bar",
  width: LANG_W,
  height: LANG_H,
  previewBg: "#0d1117",
  category: "card",
};

// ── Contributions card ───────────────────────────────────────
const CONTRIB_W = 440;
const CONTRIB_H = 170;

export function cardContrib(stats: GitHubStats, palette: ThemePalette): string {
  return cardShell(
    CONTRIB_W,
    CONTRIB_H,
    palette,
    `
    ${text(CONTRIB_W - 20, 48, `${formatNumber(stats.contributionsLastYear)} / yr`, {
      fill: palette.accent,
      size: 11,
      weight: 700,
      anchor: "end",
    })}
    ${areaChart(stats.monthlyContributions, 20, 58, CONTRIB_W - 40, 88, palette, "card-contrib")}
  `,
    "Contributions",
  );
}

export const cardContribMeta: TemplateMeta = {
  id: "card-contrib",
  name: "Contributions",
  description: "12-month contribution area chart",
  width: CONTRIB_W,
  height: CONTRIB_H,
  previewBg: "#0d1117",
  category: "card",
};

// ── Rank card ────────────────────────────────────────────────
const RANK_W = 340;
const RANK_H = 150;

export function cardRank(stats: GitHubStats, palette: ThemePalette): string {
  const name = displayName(stats);
  return cardShell(
    RANK_W,
    RANK_H,
    palette,
    `
    ${rankBadge(RANK_W / 2, 88, stats.rank, palette, 56)}
    ${text(RANK_W / 2, 118, name, { fill: palette.text, size: 11, weight: 700, anchor: "middle" })}
    ${text(RANK_W / 2, 132, `${formatNumber(stats.totalStars)} stars · ${stats.publicRepos} repos`, {
      fill: palette.textMuted,
      size: 8,
      anchor: "middle",
    })}
  `,
    "GitHub Rank",
  );
}

export const cardRankMeta: TemplateMeta = {
  id: "card-rank",
  name: "Rank",
  description: "Developer rank badge with quick stats",
  width: RANK_W,
  height: RANK_H,
  previewBg: "#0d1117",
  category: "card",
};

// ── Stats card ───────────────────────────────────────────────
const STATS_W = 440;
const STATS_H = 160;

export function cardStats(stats: GitHubStats, palette: ThemePalette): string {
  const tiles = [
    { label: "Stars", value: stats.totalStars },
    { label: "PRs", value: stats.totalPullRequests },
    { label: "Issues", value: stats.totalIssues },
    { label: "Repos", value: stats.publicRepos },
  ];
  const tileW = (STATS_W - 56) / 4;
  const tilesSvg = tiles
    .map((t, i) => {
      const x = 20 + i * (tileW + 4);
      return `
        ${card(x, 52, tileW, 88, palette)}
        ${text(x + tileW / 2, 88, formatNumber(t.value), {
          fill: palette.text,
          size: 18,
          weight: 800,
          anchor: "middle",
        })}
        ${text(x + tileW / 2, 108, t.label, {
          fill: palette.textMuted,
          size: 9,
          anchor: "middle",
        })}`;
    })
    .join("");

  return cardShell(STATS_W, STATS_H, palette, tilesSvg, "Quick Stats");
}

export const cardStatsMeta: TemplateMeta = {
  id: "card-stats",
  name: "Stats",
  description: "Compact four-metric stat tiles",
  width: STATS_W,
  height: STATS_H,
  previewBg: "#0d1117",
  category: "card",
};

// ── Heatmap card ─────────────────────────────────────────────
const HEAT_W = 480;
const HEAT_H = 130;

export function cardHeatmap(stats: GitHubStats, palette: ThemePalette): string {
  return cardShell(
    HEAT_W,
    HEAT_H,
    palette,
    `
    ${text(HEAT_W - 20, 48, `${stats.currentStreak}d streak`, {
      fill: palette.textMuted,
      size: 9,
      anchor: "end",
    })}
    ${heatmapStrip(stats.contributionDays, 20, 58, HEAT_W - 40, 52, palette)}
  `,
    "Activity",
  );
}

export const cardHeatmapMeta: TemplateMeta = {
  id: "card-heatmap",
  name: "Heatmap",
  description: "Contribution activity heatmap strip",
  width: HEAT_W,
  height: HEAT_H,
  previewBg: "#0d1117",
  category: "card",
};

// ── Profile card ─────────────────────────────────────────────
const PROFILE_W = 420;
const PROFILE_H = 150;

export function cardProfile(stats: GitHubStats, palette: ThemePalette): string {
  const name = displayName(stats);
  const topLang = stats.topLanguages[0];
  return cardShell(
    PROFILE_W,
    PROFILE_H,
    palette,
    `
    ${avatar(stats.avatar, 20, 48, 56, palette)}
    ${text(88, 68, name, { fill: palette.text, size: 14, weight: 800 })}
    ${text(88, 86, `@${stats.username}`, { fill: palette.textMuted, size: 10 })}
    ${text(88, 102, `${formatNumber(stats.followers)} followers · ${stats.publicRepos} repos`, {
      fill: palette.textMuted,
      size: 9,
    })}
    ${topLang ? text(88, 118, `${topLang.name} ${topLang.percentage}%`, { fill: palette.accent, size: 9, weight: 600 }) : ""}
    ${rankBadge(PROFILE_W - 52, 72, stats.rank, palette, 40)}
  `,
    "Profile",
  );
}

export const cardProfileMeta: TemplateMeta = {
  id: "card-profile",
  name: "Profile",
  description: "Avatar, bio snippet, rank & top language",
  width: PROFILE_W,
  height: PROFILE_H,
  previewBg: "#0d1117",
  category: "card",
};

export const CARD_TEMPLATE_ENTRIES = [
  { meta: cardStreakMeta, render: cardStreak },
  { meta: cardLanguagesMeta, render: cardLanguages },
  { meta: cardContribMeta, render: cardContrib },
  { meta: cardRankMeta, render: cardRank },
  { meta: cardStatsMeta, render: cardStats },
  { meta: cardHeatmapMeta, render: cardHeatmap },
  { meta: cardProfileMeta, render: cardProfile },
] as const;

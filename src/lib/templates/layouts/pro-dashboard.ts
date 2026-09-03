import type { GitHubStats, ThemePalette } from "@/types";
import { formatNumber } from "@/lib/utils";
import { svgOpen, svgClose, bgRect, text, displayName } from "../core/svg";
import {
  card,
  gradientBorder,
  areaChartPro,
  rankBadge,
  donutChart,
  languageListRows,
  streakCardPro,
} from "../core/charts";

const W = 860;
const H = 560;

export function proDashboard(stats: GitHubStats, palette: ThemePalette): string {
  const name = displayName(stats);

  const pad = 28;
  const gap = 10;
  const cardW = (W - pad * 2 - gap) / 2;
  const topY = 72;
  const topH = 148;
  const midY = topY + topH + gap;
  const midH = 198;
  const bottomY = midY + midH + gap;
  const streakH = 108;
  const streakW = (W - pad * 2 - gap * 2) / 3;

  const leftX = pad;
  const rightX = pad + cardW + gap;

  const overviewItems = [
    {
      icon: "★",
      color: "#f1e05a",
      text: `${formatNumber(stats.totalStars)} total stars earned`,
    },
    {
      icon: "📚",
      color: palette.accent,
      text: `${stats.publicRepos} public repositories`,
    },
    {
      icon: "👥",
      color: palette.highlight,
      text: `${formatNumber(stats.followers)} followers`,
    },
    {
      icon: "📅",
      color: palette.textMuted,
      text: stats.joinedLabel,
    },
    ...(stats.location
      ? [{ icon: "📍", color: palette.accent, text: stats.location }]
      : []),
  ];

  const overviewList = overviewItems
    .map((item, i) => {
      const y = topY + 36 + i * 26;
      return `
        ${text(leftX + 20, y, item.icon, { fill: item.color, size: 13 })}
        ${text(leftX + 42, y, item.text, { fill: palette.text, size: 11, weight: 500 })}`;
    })
    .join("");

  const statLines = [
    { icon: "★", color: "#f1e05a", label: "Total Stars Earned", value: stats.totalStars },
    { icon: "◎", color: palette.accent, label: "Public Repositories", value: stats.publicRepos },
    { icon: "⑂", color: "#bc8cff", label: "Pull Requests", value: stats.totalPullRequests },
    { icon: "👥", color: palette.highlight, label: "Followers", value: stats.followers },
  ];

  const statList = statLines
    .map((s, i) => {
      const y = midY + 58 + i * 28;
      return `
        ${text(leftX + 20, y, s.icon, { fill: s.color, size: 12 })}
        ${text(leftX + 40, y, s.label, { fill: palette.textMuted, size: 11 })}
        ${text(leftX + cardW - 100, y, formatNumber(s.value), {
          fill: palette.text,
          size: 12,
          weight: 700,
          anchor: "end",
        })}`;
    })
    .join("");

  return `${svgOpen(W, H)}
    ${bgRect(W, H, palette, 14)}
    ${gradientBorder(W, H, "pro", palette)}

    ${text(W / 2, 34, name, { fill: palette.accent, size: 24, weight: 800, anchor: "middle" })}
    ${text(W / 2, 56, `@${stats.username}`, { fill: palette.textMuted, size: 12, anchor: "middle" })}

    ${card(leftX, topY, cardW, topH, palette)}
    ${overviewList}

    ${card(rightX, topY, cardW, topH, palette)}
    ${text(rightX + 16, topY + 22, "Monthly Contributions (Last 12 Months)", {
      fill: palette.textMuted,
      size: 10,
      weight: 600,
    })}
    ${areaChartPro(stats.monthlyContributions, rightX + 12, topY + 30, cardW - 24, topH - 42, palette, "pro")}

    ${card(leftX, midY, cardW, midH, palette)}
    ${text(leftX + 20, midY + 24, "📈", { fill: palette.accent, size: 14 })}
    ${text(leftX + 40, midY + 24, "GitHub Stats", { fill: palette.text, size: 14, weight: 700 })}
    ${statList}
    ${rankBadge(leftX + cardW - 44, midY + 108, stats.rank, palette, 56)}

    ${card(rightX, midY, cardW, midH, palette)}
    ${text(rightX + 20, midY + 24, "〈〉", { fill: palette.accent, size: 14, weight: 700 })}
    ${text(rightX + 44, midY + 24, "Most Used Languages", {
      fill: palette.text,
      size: 14,
      weight: 700,
    })}
    ${donutChart(stats.topLanguages, rightX + 74, midY + 128, 50, palette)}
    ${languageListRows(
      stats.topLanguages,
      rightX + 148,
      midY + 60,
      cardW - 148 - 20,
      palette,
      22,
      4,
    )}

    ${streakCardPro(
      pad,
      bottomY,
      streakW,
      streakH,
      "▦",
      "Contributions",
      stats.contributionsLastYear,
      "last year",
      palette,
      palette.accent,
      true,
    )}
    ${streakCardPro(
      pad + streakW + gap,
      bottomY,
      streakW,
      streakH,
      "🔥",
      "Current Streak",
      stats.currentStreak,
      stats.currentStreakRange,
      palette,
      "#ff8a65",
      true,
    )}
    ${streakCardPro(
      pad + (streakW + gap) * 2,
      bottomY,
      streakW,
      streakH,
      "↻",
      "Longest Streak",
      stats.longestStreak,
      stats.longestStreakRange,
      palette,
      palette.highlight,
      true,
    )}

  ${svgClose()}`;
}

export const proDashboardMeta = {
  id: "pro-dashboard",
  name: "Pro Dashboard",
  description: "Full developer dashboard with graph, rank, languages & streaks",
  width: W,
  height: H,
  previewBg: "#0d1117",
  category: "premium" as const,
};


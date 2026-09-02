import type { GitHubStats, ThemePalette } from "@/types";
import { formatNumber } from "@/lib/utils";
import { svgOpen, svgClose, bgRect, text, displayName } from "../core/svg";
import {
  subtleFrame,
  card,
  areaChart,
  rankBadge,
  languageBarDetailed,
  streakCard,
} from "../core/charts";

const W = 820;
const H = 520;

export function proDashboard(stats: GitHubStats, palette: ThemePalette): string {
  const name = displayName(stats);
  const joined = new Date(stats.createdAt).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const statLines = [
    { icon: "★", label: "Total Stars Earned", value: stats.totalStars },
    { icon: "↗", label: "Contributions (12mo)", value: stats.contributionsLastYear },
    { icon: "⑂", label: "Pull Requests", value: stats.totalPullRequests },
    { icon: "◉", label: "Issues", value: stats.totalIssues },
    { icon: "◎", label: "Contributed To", value: stats.contributedTo },
  ];

  const statList = statLines
    .map((s, i) => {
      const y = 168 + i * 28;
      return `
        ${text(36, y, s.icon, { fill: palette.accent, size: 11 })}
        ${text(56, y, s.label, { fill: palette.textMuted, size: 10 })}
        ${text(200, y, formatNumber(s.value), { fill: palette.text, size: 11, weight: 700, anchor: "end" })}`;
    })
    .join("");

  const quickFacts = [
    `🔥 ${formatNumber(stats.contributionsLastYear)} contributions in the last year`,
    `📦 ${stats.publicRepos} public repositories`,
    `📅 ${stats.joinedLabel}`,
    stats.location ? `📍 ${stats.location}` : "",
  ].filter(Boolean);

  const facts = quickFacts
    .map((f, i) => text(36, 88 + i * 16, f, { fill: palette.textMuted, size: 9 }))
    .join("");

  const cardW = (W - 48) / 2;
  const bottomY = H - 118;
  const streakW = (W - 56) / 3;

  return `${svgOpen(W, H)}
    ${bgRect(W, H, palette, 14)}
    ${subtleFrame(W, H, palette)}

    ${text(W / 2, 36, name, { fill: palette.accent, size: 20, weight: 800, anchor: "middle" })}
    ${text(W / 2, 56, `@${stats.username}`, { fill: palette.textMuted, size: 11, anchor: "middle" })}
    ${facts}

    ${card(24, 72, cardW, 130, palette)}
    ${text(36, 92, "Overview", { fill: palette.text, size: 11, weight: 700 })}

    ${card(24 + cardW + 8, 72, cardW - 8, 130, palette)}
    ${text(36 + cardW + 8, 92, "Monthly Contributions (Last 12 Months)", {
      fill: palette.text,
      size: 10,
      weight: 700,
    })}
    ${areaChart(stats.monthlyContributions, 36 + cardW + 8, 100, cardW - 32, 88, palette, "pro")}

    ${card(24, 210, cardW, 170, palette)}
    ${text(36, 230, "GitHub Stats", { fill: palette.text, size: 12, weight: 700 })}
    ${statList}
    ${rankBadge(24 + cardW - 50, 300, stats.rank, palette)}

    ${card(24 + cardW + 8, 210, cardW - 8, 170, palette)}
    ${text(36 + cardW + 8, 230, "Most Used Languages", { fill: palette.text, size: 12, weight: 700 })}
    ${languageBarDetailed(stats.topLanguages, 36 + cardW + 8, 248, cardW - 48, palette, 4)}

    ${streakCard(24, bottomY, streakW, 88, "✦", "Total Contributions", formatNumber(stats.totalLifetimeContributions), `${joined} – Present`, palette, palette.accent)}
    ${streakCard(28 + streakW, bottomY, streakW, 88, "🔥", "Current Streak", stats.currentStreak, stats.currentStreakRange, palette, palette.highlight)}
    ${streakCard(32 + streakW * 2, bottomY, streakW, 88, "↻", "Longest Streak", stats.longestStreak, stats.longestStreakRange, palette, palette.highlight)}

    ${text(24, H - 10, "mystate.devabir.me", { fill: palette.textMuted, size: 8, opacity: 0.5 })}
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

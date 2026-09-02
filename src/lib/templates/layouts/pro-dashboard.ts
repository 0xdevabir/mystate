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

  const cardW = (W - 48) / 2;
  const statsX = 36;
  const statsValueX = 24 + cardW - 28;
  const midCardH = 182;
  const bottomY = H - 126;
  const streakH = 96;
  const streakW = (W - 56) / 3;

  const statLines = [
    { icon: "★", label: "Total Stars Earned", value: stats.totalStars },
    { icon: "↗", label: "Contributions (12mo)", value: stats.contributionsLastYear },
    { icon: "⑂", label: "Pull Requests", value: stats.totalPullRequests },
    { icon: "◉", label: "Issues", value: stats.totalIssues },
    { icon: "◎", label: "Contributed To", value: stats.contributedTo },
  ];

  const statList = statLines
    .map((s, i) => {
      const y = 274 + i * 22;
      return `
        ${text(statsX, y, s.icon, { fill: palette.accent, size: 11 })}
        ${text(statsX + 20, y, s.label, { fill: palette.textMuted, size: 10 })}
        ${text(statsValueX, y, formatNumber(s.value), {
          fill: palette.text,
          size: 11,
          weight: 700,
          anchor: "end",
        })}`;
    })
    .join("");

  const quickFacts = [
    `${formatNumber(stats.contributionsLastYear)} contributions (12mo)`,
    `${stats.publicRepos} public repositories`,
    stats.joinedLabel,
    stats.location ?? "",
  ].filter(Boolean);

  const facts = quickFacts
    .map((f, i) => text(statsX, 108 + i * 16, f, { fill: palette.textMuted, size: 9 }))
    .join("");

  return `${svgOpen(W, H)}
    ${bgRect(W, H, palette, 14)}
    ${subtleFrame(W, H, palette)}

    ${text(W / 2, 36, name, { fill: palette.accent, size: 20, weight: 800, anchor: "middle" })}
    ${text(W / 2, 56, `@${stats.username}`, { fill: palette.textMuted, size: 11, anchor: "middle" })}

    ${card(24, 72, cardW, 130, palette)}
    ${text(statsX, 92, "Overview", { fill: palette.text, size: 11, weight: 700 })}
    ${facts}

    ${card(24 + cardW + 8, 72, cardW - 8, 130, palette)}
    ${text(statsX + cardW + 8, 92, "Monthly Contributions", {
      fill: palette.text,
      size: 10,
      weight: 700,
    })}
    ${areaChart(stats.monthlyContributions, statsX + cardW + 8, 104, cardW - 48, 72, palette, "pro")}

    ${card(24, 210, cardW, midCardH, palette)}
    ${text(statsX, 230, "GitHub Stats", { fill: palette.text, size: 12, weight: 700 })}
    ${rankBadge(24 + cardW - 36, 248, stats.rank, palette, 40)}
    ${statList}

    ${card(24 + cardW + 8, 210, cardW - 8, midCardH, palette)}
    ${text(statsX + cardW + 8, 230, "Most Used Languages", { fill: palette.text, size: 12, weight: 700 })}
    ${languageBarDetailed(stats.topLanguages, statsX + cardW + 8, 248, cardW - 56, palette, 4)}

    ${streakCard(24, bottomY, streakW, streakH, "✦", "Total Contributions", stats.totalLifetimeContributions, `${joined} – Present`, palette, palette.accent)}
    ${streakCard(28 + streakW, bottomY, streakW, streakH, "🔥", "Current Streak", stats.currentStreak, stats.currentStreakRange, palette, palette.highlight)}
    ${streakCard(32 + streakW * 2, bottomY, streakW, streakH, "↻", "Longest Streak", stats.longestStreak, stats.longestStreakRange, palette, palette.highlight)}

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

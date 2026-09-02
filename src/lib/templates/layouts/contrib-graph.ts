import type { GitHubStats, ThemePalette } from "@/types";
import { formatNumber } from "@/lib/utils";
import { svgOpen, svgClose, bgRect, text, displayName } from "../core/svg";
import { subtleFrame, card, areaChart, statRow } from "../core/charts";

const W = 780;
const H = 300;

export function contribGraph(stats: GitHubStats, palette: ThemePalette): string {
  const name = displayName(stats);

  const miniStats = [
    { icon: "●", label: "Commits", value: stats.totalCommits },
    { icon: "⑂", label: "PRs", value: stats.totalPullRequests },
    { icon: "🔥", label: "Streak", value: stats.currentStreak },
    { icon: "★", label: "Stars", value: stats.totalStars },
    { icon: "◎", label: "Repos", value: stats.publicRepos },
  ];

  const sidebarW = 168;
  const chartX = 24 + sidebarW + 12;
  const chartW = W - chartX - 24;

  const statsCol = miniStats
    .map((s, i) => statRow(28, 88 + i * 30, s.icon, s.label, s.value, palette))
    .join("");

  return `${svgOpen(W, H)}
    ${bgRect(W, H, palette, 12)}
    ${subtleFrame(W, H, palette)}

    ${text(28, 36, name, { fill: palette.text, size: 18, weight: 800 })}
    ${text(28, 56, `@${stats.username} · ${stats.publicRepos} public repos`, {
      fill: palette.textMuted,
      size: 10,
    })}

    ${statsCol}

    ${card(chartX, 68, chartW, H - 92, palette)}
    ${text(chartX + 16, 92, "Contribution Activity", { fill: palette.text, size: 11, weight: 700 })}
    ${areaChart(stats.monthlyContributions, chartX + 16, 104, chartW - 32, H - 148, palette, "cg")}
    ${text(28, H - 10, "mystate.devabir.me", { fill: palette.textMuted, size: 8, opacity: 0.5 })}
  ${svgClose()}`;
}

export const contribGraphMeta = {
  id: "contrib-graph",
  name: "Contribution Graph",
  description: "Large area chart with contribution metrics sidebar",
  width: W,
  height: H,
  previewBg: "#0d1117",
  category: "premium" as const,
};



import type { GitHubStats, ThemePalette } from "@/types";
import { formatNumber } from "@/lib/utils";
import { svgOpen, svgClose, bgRect, text, displayName } from "../core/svg";
import { gradientBorder, card, areaChart, statRow } from "../core/charts";

const W = 780;
const H = 300;

export function contribGraph(stats: GitHubStats, palette: ThemePalette): string {
  const name = displayName(stats);

  const miniStats = [
    { icon: "↗", label: "12mo Contribs", value: stats.contributionsLastYear },
    { icon: "●", label: "Commits", value: stats.totalCommits },
    { icon: "⑂", label: "PRs", value: stats.totalPullRequests },
    { icon: "◉", label: "Issues", value: stats.totalIssues },
    { icon: "✎", label: "Reviews", value: stats.totalReviews },
    { icon: "🔥", label: "Streak", value: stats.currentStreak },
  ];

  const statsCol = miniStats
    .map((s, i) => statRow(28, 100 + i * 32, s.icon, s.label, s.value, palette))
    .join("");

  return `${svgOpen(W, H)}
    ${bgRect(W, H, palette, 12)}
    ${gradientBorder(W, H, "gb-cg", palette)}

    ${text(28, 36, name, { fill: palette.text, size: 18, weight: 800 })}
    ${text(28, 56, `@${stats.username} · ${formatNumber(stats.totalLifetimeContributions)} lifetime contributions`, {
      fill: palette.textMuted,
      size: 10,
    })}

    ${card(200, 24, W - 224, H - 48, palette)}
    ${text(216, 48, "Contribution Activity", { fill: palette.text, size: 11, weight: 700 })}
    ${areaChart(stats.monthlyContributions, 216, 58, W - 256, H - 100, palette, "cg")}

    ${statsCol}
    ${text(28, H - 14, "mystate.devabir.me", { fill: palette.textMuted, size: 8, opacity: 0.5 })}
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

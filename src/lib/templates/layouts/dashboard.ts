import type { GitHubStats, ThemePalette } from "@/types";
import {
  svgOpen,
  svgClose,
  bgRect,
  text,
  statCell,
  sectionTitle,
  languageBar,
  footer,
  displayName,
  divider,
} from "../core/svg";

const W = 580;
const H = 300;

export function dashboard(stats: GitHubStats, palette: ThemePalette): string {
  const name = displayName(stats);

  const activityStats = [
    { label: "Commits", value: stats.totalCommits },
    { label: "PRs", value: stats.totalPullRequests },
    { label: "Issues", value: stats.totalIssues },
    { label: "Reviews", value: stats.totalReviews },
    { label: "Contributions", value: stats.totalContributions },
  ];

  const repoStats = [
    { label: "Repos", value: stats.publicRepos },
    { label: "Stars", value: stats.totalStars },
    { label: "Forks", value: stats.totalForks },
    { label: "Watchers", value: stats.totalWatchers },
    { label: "Avg Stars", value: stats.avgStarsPerRepo },
  ];

  const socialStats = [
    { label: "Followers", value: stats.followers },
    { label: "Following", value: stats.following },
    { label: "Gists", value: stats.publicGists },
    { label: "Account", value: stats.accountAge },
  ];

  const renderCol = (
    title: string,
    items: { label: string; value: number | string }[],
    x: number,
  ) => `
    ${sectionTitle(x, 78, title, palette)}
    ${items.map((item, i) => statCell(x, 92 + i * 36, item.label, item.value, palette, 90)).join("")}`;

  return `${svgOpen(W, H)}
    ${bgRect(W, H, palette)}
    <rect x="0" y="0" width="${W}" height="52" rx="10" fill="${palette.bgSecondary}"/>
    ${text(20, 33, name, { fill: palette.text, size: 18, weight: 800 })}
    ${text(W - 20, 33, `@${stats.username}`, { fill: palette.textMuted, size: 12, anchor: "end" })}
    ${divider(20, 52, W - 20, 52, palette)}
    ${renderCol("Activity", activityStats, 24)}
    ${divider(195, 68, 195, H - 50, palette)}
    ${renderCol("Repositories", repoStats, 210)}
    ${divider(381, 68, 381, H - 50, palette)}
    ${renderCol("Social", socialStats, 396)}
    <rect x="16" y="${H - 48}" width="${W - 32}" height="36" rx="6" fill="${palette.card}"/>
    ${languageBar(stats.topLanguages, 24, H - 44, W - 48, palette)}
    ${footer(20, H - 6, palette)}
  ${svgClose()}`;
}

export const dashboardMeta = {
  id: "dashboard",
  name: "Dashboard",
  description: "Three-column panel: activity, repos, and social metrics",
  width: W,
  height: H,
  previewBg: "#161b22",
  category: "classic" as const,
};

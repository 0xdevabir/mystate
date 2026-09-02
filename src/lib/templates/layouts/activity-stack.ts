import type { GitHubStats, ThemePalette } from "@/types";
import {
  svgOpen,
  svgClose,
  bgRect,
  avatar,
  text,
  statCell,
  languageBar,
  footer,
  displayName,
  divider,
  sectionTitle,
} from "../core/svg";

const W = 480;
const H = 500;

export function activityStack(stats: GitHubStats, palette: ThemePalette): string {
  const name = displayName(stats);

  const sections = [
    {
      title: "Profile",
      items: [
        { label: "Account Age", value: stats.accountAge },
        { label: "Location", value: stats.location ?? "—" },
        { label: "Company", value: stats.company ?? "—" },
      ],
    },
    {
      title: "Repositories",
      items: [
        { label: "Public Repos", value: stats.publicRepos },
        { label: "Total Stars", value: stats.totalStars },
        { label: "Total Forks", value: stats.totalForks },
        { label: "Watchers", value: stats.totalWatchers },
        { label: "Avg Stars/Repo", value: stats.avgStarsPerRepo },
      ],
    },
    {
      title: "Contributions",
      items: [
        { label: "Commits", value: stats.totalCommits },
        { label: "Pull Requests", value: stats.totalPullRequests },
        { label: "Issues", value: stats.totalIssues },
        { label: "Reviews", value: stats.totalReviews },
        { label: "Total", value: stats.totalContributions },
      ],
    },
    {
      title: "Social",
      items: [
        { label: "Followers", value: stats.followers },
        { label: "Following", value: stats.following },
        { label: "Gists", value: stats.publicGists },
      ],
    },
  ];

  let y = 88;
  const sectionBlocks = sections
    .map((sec) => {
      const block = `
        ${sectionTitle(120, y, sec.title, palette)}
        ${sec.items.map((item, i) => statCell(120, y + 14 + i * 28, item.label, item.value, palette, 100)).join("")}
        ${divider(110, y - 8, W - 16, y - 8, palette)}`;
      y += 14 + sec.items.length * 28 + 12;
      return block;
    })
    .join("");

  return `${svgOpen(W, H)}
    ${bgRect(W, H, palette)}
    ${avatar(stats.avatar, 16, 16, 52, palette)}
    ${text(80, 36, name, { fill: palette.text, size: 16, weight: 800 })}
    ${text(80, 54, `@${stats.username}`, { fill: palette.textMuted, size: 11 })}
    ${stats.bio ? text(80, 70, stats.bio.slice(0, 45), { fill: palette.textMuted, size: 9 }) : ""}
    ${divider(16, 82, W - 16, 82, palette)}
    ${sectionBlocks}
    <rect x="16" y="${H - 40}" width="${W - 32}" height="28" rx="5" fill="${palette.card}"/>
    ${languageBar(stats.topLanguages, 22, H - 36, W - 44, palette)}
    ${footer(16, H - 6, palette)}
  ${svgClose()}`;
}

export const activityStackMeta = {
  id: "activity-stack",
  name: "Activity Stack",
  description: "Vertical sections grouped by profile, repos, activity, social",
  width: W,
  height: 500,
  previewBg: "#0c1929",
  category: "classic" as const,
};

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
const H = 560;

function statGrid(
  items: { label: string; value: number | string }[],
  startX: number,
  startY: number,
  palette: ThemePalette,
  colW = 168,
  rowH = 26,
): string {
  return items
    .map((item, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      return statCell(startX + col * colW, startY + row * rowH, item.label, item.value, palette, colW - 12);
    })
    .join("");
}

function sectionHeight(itemCount: number, rowH = 26): number {
  const rows = Math.ceil(itemCount / 2);
  return 16 + rows * rowH + 14;
}

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
        { label: "Watchers", value: stats.totalWatchers },
        { label: "Avg Stars/Repo", value: stats.avgStarsPerRepo },
      ],
    },
    {
      title: "Activity",
      items: [
        { label: "Pull Requests", value: stats.totalPullRequests },
        { label: "Commits", value: stats.totalCommits },
      ],
    },
    {
      title: "Social",
      items: [
        { label: "Followers", value: stats.followers },
        { label: "Following", value: stats.following },
      ],
    },
  ];

  let y = 96;
  const sectionBlocks = sections
    .map((sec) => {
      const block = `
        ${divider(110, y - 10, W - 16, y - 10, palette)}
        ${sectionTitle(120, y + 4, sec.title, palette)}
        ${statGrid(sec.items, 120, y + 18, palette)}`;
      y += sectionHeight(sec.items.length);
      return block;
    })
    .join("");

  const langY = H - 56;

  return `${svgOpen(W, H)}
    ${bgRect(W, H, palette)}
    ${avatar(stats.avatar, 16, 16, 52, palette)}
    ${text(80, 36, name, { fill: palette.text, size: 16, weight: 800 })}
    ${text(80, 54, `@${stats.username}`, { fill: palette.textMuted, size: 11 })}
    ${stats.bio ? text(80, 70, stats.bio.slice(0, 48), { fill: palette.textMuted, size: 9 }) : ""}
    ${divider(16, 86, W - 16, 86, palette)}
    ${sectionBlocks}
    <rect x="16" y="${langY}" width="${W - 32}" height="44" rx="5" fill="${palette.card}"/>
    ${languageBar(stats.topLanguages, 22, langY + 10, W - 44, palette)}
    ${footer(16, H - 8, palette)}
  ${svgClose()}`;
}

export const activityStackMeta = {
  id: "activity-stack",
  name: "Activity Stack",
  description: "Vertical sections grouped by profile, repos, activity, social",
  width: W,
  height: H,
  previewBg: "#0c1929",
  category: "classic" as const,
};

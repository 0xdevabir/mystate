import type { GitHubStats, ThemePalette } from "@/types";
import { formatNumber } from "@/lib/utils";
import {
  svgOpen,
  svgClose,
  bgRect,
  avatar,
  text,
  displayName,
} from "../core/svg";

const W = 380;
const H = 380;

export function radialHub(stats: GitHubStats, palette: ThemePalette): string {
  const cx = W / 2;
  const cy = H / 2 - 10;
  const radius = 130;
  const name = displayName(stats);

  const items = [
    { label: "Stars", value: stats.totalStars },
    { label: "Repos", value: stats.publicRepos },
    { label: "Followers", value: stats.followers },
    { label: "PRs", value: stats.totalPullRequests },
    { label: "Commits", value: stats.totalCommits },
    { label: "Following", value: stats.following },
    { label: "Watchers", value: stats.totalWatchers },
    { label: "Account", value: stats.accountAge },
  ];

  const nodes = items
    .map((item, i) => {
      const angle = (i / items.length) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      return `
        <line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${palette.border}" stroke-width="1" opacity="0.4"/>
        <circle cx="${x}" cy="${y}" r="28" fill="${palette.card}" stroke="${palette.border}" stroke-width="1"/>
        ${text(x, y - 4, typeof item.value === "number" ? formatNumber(item.value) : String(item.value), {
          fill: palette.statValue,
          size: 11,
          weight: 800,
          anchor: "middle",
        })}
        ${text(x, y + 10, item.label, {
          fill: palette.statLabel,
          size: 7,
          weight: 600,
          anchor: "middle",
        })}`;
    })
    .join("");

  return `${svgOpen(W, H)}
    ${bgRect(W, H, palette)}
    <circle cx="${cx}" cy="${cy}" r="95" fill="${palette.bgSecondary}" stroke="${palette.border}" stroke-width="1"/>
    ${nodes}
    ${avatar(stats.avatar, cx - 36, cy - 36, 72, palette)}
    ${text(cx, cy + 58, name, { fill: palette.text, size: 13, weight: 700, anchor: "middle" })}
    ${text(cx, cy + 74, `@${stats.username}`, { fill: palette.textMuted, size: 9, anchor: "middle" })}
  ${svgClose()}`;
}

export const radialHubMeta = {
  id: "radial-hub",
  name: "Radial Hub",
  description: "Circular layout with avatar center and stats orbiting",
  width: W,
  height: H,
  previewBg: "#13091f",
  category: "classic" as const,
};



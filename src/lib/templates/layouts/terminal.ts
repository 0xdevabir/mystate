import type { GitHubStats, ThemePalette } from "@/types";
import { escapeXml } from "@/lib/utils";
import { svgOpen, svgClose, bgRect, text, footer, displayName } from "../core/svg";

const W = 540;
const H = 400;

export function terminal(stats: GitHubStats, palette: ThemePalette): string {
  const name = displayName(stats);
  const lines = [
    `$ mystate fetch --user ${stats.username}`,
    ``,
    `┌─ Profile ─────────────────────────────────────`,
    `│  name:        ${name}`,
    `│  username:    @${stats.username}`,
    `│  location:    ${stats.location ?? "—"}`,
    `│  company:     ${stats.company ?? "—"}`,
    `│  joined:      ${stats.accountAge} ago`,
    `├─ Repositories ────────────────────────────────`,
    `│  repos:       ${stats.publicRepos}`,
    `│  stars:       ${stats.totalStars}`,
    `│  watchers:    ${stats.totalWatchers}`,
    `│  avg_stars:   ${stats.avgStarsPerRepo}`,
    `├─ Activity ────────────────────────────────────`,
    `│  prs:         ${stats.totalPullRequests}`,
    `│  commits:     ${stats.totalCommits}`,
    `├─ Social ──────────────────────────────────────`,
    `│  followers:   ${stats.followers}`,
    `│  following:   ${stats.following}`,
    `├─ Languages ───────────────────────────────────`,
    `│  ${stats.topLanguages.slice(0, 4).map((l) => `${l.name}(${l.percentage}%)`).join("  ") || "—"}`,
    `└──────────────────────────────────────────────`,
  ];

  const body = lines
    .map((line, i) =>
      text(16, 48 + i * 12, line, {
        fill: line.startsWith("│") ? palette.highlight : palette.accent,
        size: 10,
        family: "ui-monospace,SFMono-Regular,Menlo,monospace",
      }),
    )
    .join("");

  return `${svgOpen(W, H)}
    ${bgRect(W, H, palette, 6)}
    <rect x="0" y="0" width="${W}" height="28" rx="6" fill="${palette.bgSecondary}"/>
    <circle cx="14" cy="14" r="5" fill="#ff5f57"/>
    <circle cx="30" cy="14" r="5" fill="#febc2e"/>
    <circle cx="46" cy="14" r="5" fill="#28c840"/>
    ${text(62, 18, `~/github/${escapeXml(stats.username)}`, {
      fill: palette.textMuted,
      size: 10,
      family: "ui-monospace,monospace",
    })}
    ${body}
    ${footer(16, H - 8, palette)}
  ${svgClose()}`;
}

export const terminalMeta = {
  id: "terminal",
  name: "Terminal",
  description: "CLI-style output with every stat in structured blocks",
  width: W,
  height: H,
  previewBg: "#0a0a0a",
  category: "classic" as const,
};


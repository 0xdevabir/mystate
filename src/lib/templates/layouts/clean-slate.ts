import type { GitHubStats, ThemePalette } from "@/types";
import { formatNumber } from "@/lib/utils";
import { svgOpen, svgClose, bgRect, text, displayName, avatar } from "../core/svg";

const W = 600;
const H = 200;

export function cleanSlate(stats: GitHubStats, palette: ThemePalette): string {
  const name = displayName(stats);

  const metrics = [
    { label: "Stars", value: stats.totalStars },
    { label: "Repos", value: stats.publicRepos },
    { label: "PRs", value: stats.totalPullRequests },
    { label: "Followers", value: stats.followers },
    { label: "Rank", value: stats.rank },
  ];

  const row = metrics
    .map((m, i) => {
      const x = 200 + i * 78;
      return `
        ${text(x, 120, String(m.value), { fill: palette.text, size: 20, weight: 300, anchor: "middle" })}
        ${text(x, 140, m.label, { fill: palette.textMuted, size: 9, anchor: "middle" })}`;
    })
    .join("");

  const topLang = stats.topLanguages[0];

  return `${svgOpen(W, H)}
    ${bgRect(W, H, palette, 8)}
    <line x1="24" y1="24" x2="80" y2="24" stroke="${palette.accent}" stroke-width="2"/>
    ${avatar(stats.avatar, 24, 48, 48, palette)}
    ${text(84, 72, name, { fill: palette.text, size: 16, weight: 700 })}
    ${text(84, 90, `@${stats.username}`, { fill: palette.textMuted, size: 10 })}
    ${topLang ? text(84, 106, `${topLang.name} · ${topLang.percentage}%`, { fill: palette.accent, size: 9 }) : ""}
    <line x1="180" y1="48" x2="180" y2="${H - 32}" stroke="${palette.border}" stroke-width="1"/>
    ${row}
    ${text(24, H - 12, `mystate.devabir.me · ${formatNumber(stats.followers)} followers`, {
      fill: palette.textMuted,
      size: 8,
      opacity: 0.5,
    })}
  ${svgClose()}`;
}

export const cleanSlateMeta = {
  id: "clean-slate",
  name: "Clean Slate",
  description: "Minimal, whitespace-rich layout for elegant profiles",
  width: W,
  height: H,
  previewBg: "#ffffff",
  category: "premium" as const,
};


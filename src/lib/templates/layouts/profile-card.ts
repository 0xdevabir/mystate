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
  allStatFields,
} from "../core/svg";

const W = 520;
const H = 260;

export function profileCard(stats: GitHubStats, palette: ThemePalette): string {
  const name = displayName(stats);
  const fields = allStatFields(stats);

  const statsGrid = fields
    .map((f, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      return statCell(168 + col * 82, 72 + row * 42, f.label, f.value, palette);
    })
    .join("");

  const meta = [stats.location, stats.company].filter(Boolean).join(" · ");

  return `${svgOpen(W, H)}
    ${bgRect(W, H, palette)}
    ${avatar(stats.avatar, 20, 20, 64, palette)}
    ${text(96, 38, name, { fill: palette.text, size: 16, weight: 700 })}
    ${text(96, 56, `@${stats.username}`, { fill: palette.textMuted, size: 11 })}
    ${meta ? text(96, 72, meta.slice(0, 40), { fill: palette.textMuted, size: 9, opacity: 0.8 }) : ""}
    <line x1="148" y1="20" x2="148" y2="${H - 20}" stroke="${palette.border}" stroke-width="1"/>
    ${statsGrid}
  <rect x="20" y="${H - 36}" width="${W - 40}" height="28" rx="6" fill="${palette.card}"/>
    ${languageBar(stats.topLanguages, 28, H - 32, W - 56, palette)}
    ${footer(20, H - 6, palette)}
  ${svgClose()}`;
}

export const profileCardMeta = {
  id: "profile-card",
  name: "Profile Card",
  description: "Avatar sidebar with full stats grid and language bar",
  width: W,
  height: H,
  previewBg: "#0d1117",
  category: "classic" as const,
};

import type { GitHubStats, ThemePalette } from "@/types";
import {
  svgOpen,
  svgClose,
  bgRect,
  avatar,
  text,
  statCell,
  languageBar,
  displayName,
  allStatFields,
} from "../core/svg";

const W = 520;
const H = 260;

export function profileCard(stats: GitHubStats, palette: ThemePalette): string {
  const name = displayName(stats);
  const fields = allStatFields(stats);

  const gridY = 128;
  const colW = (W - 40) / 4;
  const statsGrid = fields
    .map((f, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      return statCell(20 + col * colW, gridY + row * 38, f.label, f.value, palette);
    })
    .join("");

  const meta = [stats.location, stats.company].filter(Boolean).join(" · ");

  return `${svgOpen(W, H)}
    ${bgRect(W, H, palette)}
    ${avatar(stats.avatar, 20, 20, 64, palette)}
    ${text(96, 40, name, { fill: palette.text, size: 16, weight: 700 })}
    ${text(96, 58, `@${stats.username}`, { fill: palette.textMuted, size: 11 })}
    ${meta ? text(96, 76, meta.slice(0, 44), { fill: palette.textMuted, size: 9, opacity: 0.8 }) : ""}
    <line x1="20" y1="100" x2="${W - 20}" y2="100" stroke="${palette.border}" stroke-width="1"/>
    ${statsGrid}
  <rect x="20" y="${H - 40}" width="${W - 40}" height="32" rx="6" fill="${palette.card}"/>
    ${languageBar(stats.topLanguages, 28, H - 36, W - 56, palette)}
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

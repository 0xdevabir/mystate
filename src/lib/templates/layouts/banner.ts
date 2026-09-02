import type { GitHubStats, ThemePalette } from "@/types";
import {
  svgOpen,
  svgClose,
  bgRect,
  avatar,
  text,
  languageBar,
  footer,
  displayName,
  allStatFields,
} from "../core/svg";

const W = 680;
const H = 160;

export function banner(stats: GitHubStats, palette: ThemePalette): string {
  const fields = allStatFields(stats);
  const name = displayName(stats);

  const ribbon = fields
    .map((f, i) => {
      const x = 100 + i * 40;
      if (x > W - 30) return "";
      return `
        <g transform="translate(${x}, 95)">
          ${text(0, 0, String(f.value), {
            fill: palette.statValue,
            size: 13,
            weight: 800,
            anchor: "middle",
          })}
          ${text(0, 14, f.label, {
            fill: palette.statLabel,
            size: 7,
            weight: 500,
            anchor: "middle",
          })}
        </g>`;
    })
    .join("");

  return `${svgOpen(W, H)}
    ${bgRect(W, H, palette, 8)}
    <rect x="0" y="0" width="6" height="${H}" rx="3" fill="${palette.accent}"/>
    ${avatar(stats.avatar, 16, 28, 56, palette)}
    ${text(84, 48, name, { fill: palette.text, size: 17, weight: 800 })}
    ${text(84, 66, `@${stats.username} · ${stats.accountAge}`, {
      fill: palette.textMuted,
      size: 10,
    })}
    ${stats.bio ? text(84, 82, stats.bio.slice(0, 60), { fill: palette.textMuted, size: 9, opacity: 0.85 }) : ""}
    <line x1="16" y1="88" x2="${W - 16}" y2="88" stroke="${palette.border}" stroke-width="1"/>
    ${ribbon}
    <rect x="16" y="${H - 28}" width="${W - 32}" height="20" rx="4" fill="${palette.card}"/>
    ${languageBar(stats.topLanguages, 20, H - 26, W - 40, palette)}
    ${footer(W - 120, H - 4, palette)}
  ${svgClose()}`;
}

export const bannerMeta = {
  id: "banner",
  name: "Banner",
  description: "Wide horizontal strip with avatar and inline stat ribbon",
  width: W,
  height: H,
  previewBg: "#0d1117",
  category: "classic" as const,
};

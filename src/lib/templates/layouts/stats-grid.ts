import type { GitHubStats, ThemePalette } from "@/types";
import {
  svgOpen,
  svgClose,
  bgRect,
  text,
  languageBar,
  footer,
  displayName,
  allStatFields,
} from "../core/svg";

const W = 560;
const H = 220;

export function statsGrid(stats: GitHubStats, palette: ThemePalette): string {
  const fields = allStatFields(stats);
  const cols = 7;
  const cellW = (W - 40) / cols;
  const cellH = 52;

  const cells = fields
    .map((f, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = 20 + col * cellW;
      const y = 58 + row * cellH;
      return `
        <g transform="translate(${x},${y})">
          <rect width="${cellW - 6}" height="${cellH - 8}" rx="6" fill="${palette.card}" stroke="${palette.border}" stroke-width="0.5"/>
          ${text((cellW - 6) / 2, 18, f.label, {
            fill: palette.statLabel,
            size: 8,
            weight: 600,
            anchor: "middle",
          })}
          ${text((cellW - 6) / 2, 36, String(f.value), {
            fill: palette.statValue,
            size: 14,
            weight: 800,
            anchor: "middle",
          })}
        </g>`;
    })
    .join("");

  return `${svgOpen(W, H)}
    ${bgRect(W, H, palette)}
    ${text(20, 32, displayName(stats), { fill: palette.text, size: 20, weight: 800 })}
    ${text(W - 20, 32, `@${stats.username}`, { fill: palette.textMuted, size: 12, anchor: "end" })}
    ${cells}
    ${footer(20, H - 6, palette)}
  ${svgClose()}`;
}

export const statsGridMeta = {
  id: "stats-grid",
  name: "Stats Grid",
  description: "Dense 7-column metric grid with all GitHub stats",
  width: W,
  height: H,
  previewBg: "#1f2328",
};

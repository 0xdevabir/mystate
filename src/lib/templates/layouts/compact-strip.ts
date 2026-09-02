import type { GitHubStats, ThemePalette } from "@/types";
import {
  svgOpen,
  svgClose,
  bgRect,
  text,
  footer,
  displayName,
  allStatFields,
} from "../core/svg";

const W = 720;
const H = 110;

export function compactStrip(stats: GitHubStats, palette: ThemePalette): string {
  const fields = allStatFields(stats);
  const name = displayName(stats);
  const segW = (W - 180) / fields.length;

  const segments = fields
    .map((f, i) => {
      const x = 170 + i * segW;
      return `
        ${i > 0 ? `<line x1="${x}" y1="24" x2="${x}" y2="${H - 24}" stroke="${palette.border}" stroke-width="1"/>` : ""}
        <g transform="translate(${x + segW / 2}, 44)">
          ${text(0, 0, String(f.value), {
            fill: palette.statValue,
            size: 12,
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
    ${bgRect(W, H, palette, 6)}
    <rect x="0" y="0" width="160" height="${H}" rx="6" fill="${palette.bgSecondary}"/>
    ${text(16, 38, name, { fill: palette.text, size: 14, weight: 800 })}
    ${text(16, 56, `@${stats.username}`, { fill: palette.accent, size: 10, weight: 600 })}
    ${text(16, 74, stats.accountAge, { fill: palette.textMuted, size: 9 })}
    ${text(16, 90, stats.topLanguages.slice(0, 3).map((l) => l.name).join(" · ") || "—", {
      fill: palette.textMuted,
      size: 8,
    })}
    ${segments}
    ${footer(W - 110, H - 8, palette)}
  ${svgClose()}`;
}

export const compactStripMeta = {
  id: "compact-strip",
  name: "Compact Strip",
  description: "Ultra-wide single-row strip for README headers",
  width: W,
  height: H,
  previewBg: "#2e3440",
};

import type { GitHubStats, ThemePalette } from "@/types";
import { svgOpen, svgClose, bgRect, text, displayName, footer } from "../core/svg";
import {
  subtleFrame,
  card,
  donutChart,
  languageBarDetailed,
  languageListRows,
} from "../core/charts";

const W = 740;
const H = 420;

export function languageExpert(stats: GitHubStats, palette: ThemePalette): string {
  const name = displayName(stats);
  const langs = stats.topLanguages;
  const rightX = 272;
  const rightW = W - rightX - 28;

  return `${svgOpen(W, H)}
    ${bgRect(W, H, palette, 12)}
    ${subtleFrame(W, H, palette)}

    ${text(28, 36, "Language Breakdown", { fill: palette.text, size: 17, weight: 800 })}
    ${text(28, 56, `${name} · @${stats.username}`, { fill: palette.textMuted, size: 10 })}

    ${card(28, 76, 224, 320, palette)}
    ${donutChart(langs, 140, 220, 68, palette)}
    ${text(140, 318, `${langs.length} languages tracked`, { fill: palette.textMuted, size: 9, anchor: "middle" })}

    ${card(rightX, 76, rightW, 118, palette)}
    ${text(rightX + 16, 100, "Distribution", { fill: palette.text, size: 11, weight: 700 })}
    ${languageBarDetailed(langs, rightX + 16, 114, rightW - 32, palette, 4)}

    ${card(rightX, 206, rightW, 190, palette)}
    ${text(rightX + 16, 230, "By percentage", { fill: palette.text, size: 11, weight: 700 })}
    ${languageListRows(langs, rightX + 16, 248, rightW - 32, palette, 24, 6)}

    ${footer(28, H - 8, palette)}
  ${svgClose()}`;
}

export const languageExpertMeta = {
  id: "language-expert",
  name: "Language Expert",
  description: "Donut chart + detailed language bars and percentages",
  width: W,
  height: H,
  previewBg: "#0d1117",
  category: "premium" as const,
};

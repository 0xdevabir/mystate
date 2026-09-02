import type { GitHubStats, ThemePalette } from "@/types";
import { svgOpen, svgClose, bgRect, text, displayName } from "../core/svg";
import {
  gradientBorder,
  card,
  donutChart,
  languageBarDetailed,
} from "../core/charts";

const W = 720;
const H = 360;

export function languageExpert(stats: GitHubStats, palette: ThemePalette): string {
  const name = displayName(stats);
  const langs = stats.topLanguages;

  const langRows = langs
    .map((lang, i) => {
      const y = 200 + i * 22;
      const barW = (lang.percentage / 100) * 280;
      return `
        ${text(300, y, lang.name, { fill: palette.text, size: 11, weight: 600 })}
        ${text(680, y, `${lang.percentage}%`, { fill: palette.textMuted, size: 11, anchor: "end" })}
        <rect x="400" y="${y - 10}" width="280" height="8" rx="3" fill="${palette.border}" opacity="0.3"/>
        <rect x="400" y="${y - 10}" width="${barW}" height="8" rx="3" fill="${lang.color}"/>`;
    })
    .join("");

  return `${svgOpen(W, H)}
    ${bgRect(W, H, palette, 12)}
    ${gradientBorder(W, H, "gb-le", palette)}

    ${text(28, 38, "Language Breakdown", { fill: palette.text, size: 18, weight: 800 })}
    ${text(28, 58, `${name} · @${stats.username}`, { fill: palette.textMuted, size: 11 })}

    ${card(28, 80, 240, 260, palette)}
    ${donutChart(langs, 148, 210, 72, palette)}
    ${text(148, 300, `${langs.length} languages`, { fill: palette.textMuted, size: 9, anchor: "middle" })}

    ${card(284, 80, W - 312, 120, palette)}
    ${text(300, 104, "Distribution", { fill: palette.text, size: 11, weight: 700 })}
    ${languageBarDetailed(langs, 300, 118, W - 340, palette)}

    ${card(284, 212, W - 312, 128, palette)}
    ${text(300, 236, "By Percentage", { fill: palette.text, size: 11, weight: 700 })}
    ${langRows}

    ${text(28, H - 12, "mystate.devabir.me", { fill: palette.textMuted, size: 8, opacity: 0.5 })}
  ${svgClose()}`;
}

export const languageExpertMeta = {
  id: "language-expert",
  name: "Language Expert",
  description: "Donut chart + detailed language bars and percentages",
  width: W,
  height: H,
  previewBg: "#13091f",
  category: "premium" as const,
};


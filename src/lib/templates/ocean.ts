import type { GitHubStats } from "@/types";
import { header, languageBar, statRow, wrapSvg, W, H } from "./shared";

export function ocean(stats: GitHubStats): string {
  return wrapSvg(`
    <defs>
      <linearGradient id="ocean-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0c4a6e"/>
        <stop offset="50%" stop-color="#075985"/>
        <stop offset="100%" stop-color="#0369a1"/>
      </linearGradient>
      <linearGradient id="wave" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#22d3ee" stop-opacity="0.1"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" rx="12" fill="url(#ocean-bg)"/>
    <path d="M0,160 Q124,140 248,155 T${W},150 L${W},${H} L0,${H} Z" fill="url(#wave)"/>
    <path d="M0,170 Q160,155 320,168 T${W},165 L${W},${H} L0,${H} Z" fill="#38bdf820"/>
    ${header(stats, "#f0f9ff", "#7dd3fc")}
    ${statRow(20, 75, "★", "Stars", stats.totalStars, "#e0f2fe")}
    ${statRow(130, 75, "⑂", "Forks", stats.totalForks, "#e0f2fe")}
    ${statRow(240, 75, "◫", "Repos", stats.publicRepos, "#e0f2fe")}
    ${statRow(350, 75, "◎", "Followers", stats.followers, "#e0f2fe")}
    ${languageBar(stats.topLanguages, 20, 130, 455, "#bae6fd")}
    <text x="20" y="${H - 12}" fill="#38bdf8" font-size="9" font-family="system-ui, sans-serif" opacity="0.7">mystate.devabir.me</text>
  `);
}

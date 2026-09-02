import type { GitHubStats } from "@/types";
import { header, languageBar, statRow, wrapSvg, W, H } from "./shared";

export function midnight(stats: GitHubStats): string {
  return wrapSvg(`
    <defs>
      <linearGradient id="mid-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0f0720"/>
        <stop offset="100%" stop-color="#1e1035"/>
      </linearGradient>
      <pattern id="mid-dots" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="0.8" fill="#ffffff08"/>
      </pattern>
    </defs>
    <rect width="${W}" height="${H}" rx="10" fill="url(#mid-bg)"/>
    <rect width="${W}" height="${H}" rx="10" fill="url(#mid-dots)"/>
    <rect x="0" y="0" width="4" height="${H}" rx="2" fill="#a78bfa"/>
    ${header(stats, "#ede9fe", "#a78bfa")}
    ${statRow(24, 75, "★", "Stars", stats.totalStars, "#ddd6fe")}
    ${statRow(134, 75, "⑂", "Forks", stats.totalForks, "#ddd6fe")}
    ${statRow(244, 75, "◫", "Repos", stats.publicRepos, "#ddd6fe")}
    ${statRow(354, 75, "◎", "Followers", stats.followers, "#ddd6fe")}
    ${languageBar(stats.topLanguages, 24, 130, 451, "#c4b5fd")}
    <text x="24" y="${H - 12}" fill="#7c3aed" font-size="9" font-family="system-ui, sans-serif" opacity="0.6">mystate.devabir.me</text>
  `);
}

import type { GitHubStats } from "@/types";
import { header, languageBar, statRow, wrapSvg, W, H } from "./shared";

export function sunset(stats: GitHubStats): string {
  return wrapSvg(`
    <defs>
      <linearGradient id="sunset-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1a0a00"/>
        <stop offset="40%" stop-color="#4a1942"/>
        <stop offset="100%" stop-color="#c2410c"/>
      </linearGradient>
      <radialGradient id="sun" cx="85%" cy="20%" r="40%">
        <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#fbbf24" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" rx="12" fill="url(#sunset-bg)"/>
    <rect width="${W}" height="${H}" rx="12" fill="url(#sun)"/>
    ${header(stats, "#fff7ed", "#fed7aa")}
    ${statRow(20, 75, "★", "Stars", stats.totalStars, "#ffedd5")}
    ${statRow(130, 75, "⑂", "Forks", stats.totalForks, "#ffedd5")}
    ${statRow(240, 75, "◫", "Repos", stats.publicRepos, "#ffedd5")}
    ${statRow(350, 75, "◎", "Followers", stats.followers, "#ffedd5")}
    ${languageBar(stats.topLanguages, 20, 130, 455, "#fdba74")}
    <text x="20" y="${H - 12}" fill="#fb923c" font-size="9" font-family="system-ui, sans-serif" opacity="0.7">mystate.devabir.me</text>
  `);
}

import type { GitHubStats } from "@/types";
import { header, languageBar, statRow, wrapSvg, W, H } from "./shared";

export function classic(stats: GitHubStats): string {
  return wrapSvg(`
    <defs>
      <linearGradient id="classic-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0d1117"/>
        <stop offset="100%" stop-color="#161b22"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" rx="10" fill="url(#classic-bg)" stroke="#30363d" stroke-width="1"/>
    ${header(stats, "#e6edf3", "#8b949e")}
    ${statRow(20, 75, "★", "Stars", stats.totalStars, "#e6edf3")}
    ${statRow(130, 75, "⑂", "Forks", stats.totalForks, "#e6edf3")}
    ${statRow(240, 75, "◫", "Repos", stats.publicRepos, "#e6edf3")}
    ${statRow(350, 75, "◎", "Followers", stats.followers, "#e6edf3")}
    ${languageBar(stats.topLanguages, 20, 130, 455, "#8b949e")}
    <text x="20" y="${H - 12}" fill="#484f58" font-size="9" font-family="system-ui, sans-serif">mystate.devabir.me</text>
  `);
}

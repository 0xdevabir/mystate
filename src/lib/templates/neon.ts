import type { GitHubStats } from "@/types";
import { header, languageBar, statRow, wrapSvg, W, H } from "./shared";

export function neon(stats: GitHubStats): string {
  return wrapSvg(`
    <defs>
      <linearGradient id="neon-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0a0014"/>
        <stop offset="100%" stop-color="#14001f"/>
      </linearGradient>
      <linearGradient id="neon-border" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ff00ff"/>
        <stop offset="50%" stop-color="#00ffff"/>
        <stop offset="100%" stop-color="#ff00ff"/>
      </linearGradient>
      <filter id="neon-glow">
        <feGaussianBlur stdDeviation="2" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <rect width="${W}" height="${H}" rx="10" fill="url(#neon-bg)"/>
    <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="9" fill="none" stroke="url(#neon-border)" stroke-width="2" filter="url(#neon-glow)"/>
    ${header(stats, "#ff00ff", "#00ffff")}
    ${statRow(20, 75, "★", "Stars", stats.totalStars, "#f0abfc")}
    ${statRow(130, 75, "⑂", "Forks", stats.totalForks, "#67e8f9")}
    ${statRow(240, 75, "◫", "Repos", stats.publicRepos, "#f0abfc")}
    ${statRow(350, 75, "◎", "Followers", stats.followers, "#67e8f9")}
    ${languageBar(stats.topLanguages, 20, 130, 455, "#c084fc")}
    <text x="20" y="${H - 12}" fill="#a855f7" font-size="9" font-family="system-ui, sans-serif" opacity="0.7">mystate.devabir.me</text>
  `);
}

import type { GitHubStats } from "@/types";
import { header, languageBar, statRow, wrapSvg, W, H } from "./shared";

export function aurora(stats: GitHubStats): string {
  return wrapSvg(`
    <defs>
      <linearGradient id="aurora-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0f0c29"/>
        <stop offset="50%" stop-color="#302b63"/>
        <stop offset="100%" stop-color="#24243e"/>
      </linearGradient>
      <linearGradient id="aurora-glow" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#00d2ff" stop-opacity="0.3"/>
        <stop offset="50%" stop-color="#7b2ff7" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#f107a3" stop-opacity="0.3"/>
      </linearGradient>
      <filter id="aurora-blur">
        <feGaussianBlur stdDeviation="20"/>
      </filter>
    </defs>
    <rect width="${W}" height="${H}" rx="12" fill="url(#aurora-bg)"/>
    <ellipse cx="120" cy="40" rx="80" ry="50" fill="url(#aurora-glow)" filter="url(#aurora-blur)" opacity="0.6"/>
    <ellipse cx="380" cy="150" rx="100" ry="60" fill="url(#aurora-glow)" filter="url(#aurora-blur)" opacity="0.4"/>
    <rect width="${W}" height="${H}" rx="12" fill="none" stroke="url(#aurora-glow)" stroke-width="1" opacity="0.5"/>
    ${header(stats, "#ffffff", "#c4b5fd")}
    ${statRow(20, 75, "★", "Stars", stats.totalStars, "#e0e7ff")}
    ${statRow(130, 75, "⑂", "Forks", stats.totalForks, "#e0e7ff")}
    ${statRow(240, 75, "◫", "Repos", stats.publicRepos, "#e0e7ff")}
    ${statRow(350, 75, "◎", "Followers", stats.followers, "#e0e7ff")}
    ${languageBar(stats.topLanguages, 20, 130, 455, "#c4b5fd")}
    <text x="20" y="${H - 12}" fill="#6366f1" font-size="9" font-family="system-ui, sans-serif" opacity="0.6">mystate.devabir.me</text>
  `);
}

import type { GitHubStats } from "@/types";
import { header, languageBar, statRow, wrapSvg, W, H } from "./shared";

export function glass(stats: GitHubStats): string {
  return wrapSvg(`
    <defs>
      <linearGradient id="glass-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1a1a2e"/>
        <stop offset="100%" stop-color="#16213e"/>
      </linearGradient>
      <linearGradient id="glass-shine" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.02"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" rx="16" fill="url(#glass-bg)"/>
    <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="15" fill="url(#glass-shine)"/>
    <rect x="12" y="12" width="${W - 24}" height="${H - 24}" rx="12" fill="#ffffff08" stroke="#ffffff18" stroke-width="1"/>
    ${header(stats, "#f0f4ff", "#94a3b8")}
    ${statRow(28, 78, "★", "Stars", stats.totalStars, "#e2e8f0")}
    ${statRow(138, 78, "⑂", "Forks", stats.totalForks, "#e2e8f0")}
    ${statRow(248, 78, "◫", "Repos", stats.publicRepos, "#e2e8f0")}
    ${statRow(358, 78, "◎", "Followers", stats.followers, "#e2e8f0")}
    ${languageBar(stats.topLanguages, 28, 133, 439, "#94a3b8")}
    <text x="28" y="${H - 14}" fill="#64748b" font-size="9" font-family="system-ui, sans-serif">mystate.devabir.me</text>
  `);
}

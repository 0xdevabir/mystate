import type { GitHubStats } from "@/types";
import { escapeXml, formatNumber } from "@/lib/utils";
import { wrapSvg, W, H } from "./shared";

export function terminal(stats: GitHubStats): string {
  const displayName = stats.name ?? stats.username;
  return wrapSvg(`
    <rect width="${W}" height="${H}" rx="6" fill="#0a0a0a" stroke="#1a3a1a" stroke-width="1"/>
    <rect x="0" y="0" width="${W}" height="28" rx="6" fill="#111"/>
    <circle cx="16" cy="14" r="5" fill="#ff5f57"/>
    <circle cx="32" cy="14" r="5" fill="#febc2e"/>
    <circle cx="48" cy="14" r="5" fill="#28c840"/>
    <text x="70" y="18" fill="#4ade80" font-size="11" font-family="monospace">~/github/${escapeXml(stats.username)}</text>
    <text x="20" y="55" fill="#4ade80" font-size="12" font-family="monospace">$ whoami</text>
    <text x="20" y="72" fill="#86efac" font-size="13" font-family="monospace" font-weight="600">${escapeXml(displayName)}</text>
    <text x="20" y="95" fill="#4ade80" font-size="12" font-family="monospace">$ stats --json</text>
    <text x="20" y="115" fill="#bbf7d0" font-size="11" font-family="monospace">{ stars: ${formatNumber(stats.totalStars)}, repos: ${formatNumber(stats.publicRepos)}, followers: ${formatNumber(stats.followers)}, forks: ${formatNumber(stats.totalForks)} }</text>
    <text x="20" y="140" fill="#4ade80" font-size="12" font-family="monospace">$ langs</text>
    <text x="20" y="158" fill="#86efac" font-size="11" font-family="monospace">${stats.topLanguages.slice(0, 4).map((l) => l.name).join(" · ") || "—"}</text>
    <text x="20" y="${H - 10}" fill="#166534" font-size="9" font-family="monospace">mystate.devabir.me</text>
  `);
}

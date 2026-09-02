import type { GitHubStats } from "@/types";
import { escapeXml, formatNumber } from "@/lib/utils";
import { wrapSvg, W, H } from "./shared";

export function minimal(stats: GitHubStats): string {
  const displayName = stats.name ?? stats.username;
  return wrapSvg(`
    <rect width="${W}" height="${H}" rx="4" fill="#fafafa" stroke="#e5e5e5" stroke-width="1"/>
    <text x="24" y="36" fill="#171717" font-size="16" font-weight="500" font-family="Georgia, serif">${escapeXml(displayName)}</text>
    <line x1="24" y1="48" x2="120" y2="48" stroke="#171717" stroke-width="1"/>
    <text x="24" y="80" fill="#737373" font-size="11" font-family="system-ui, sans-serif">stars</text>
    <text x="24" y="100" fill="#171717" font-size="28" font-weight="300" font-family="Georgia, serif">${formatNumber(stats.totalStars)}</text>
    <text x="140" y="80" fill="#737373" font-size="11" font-family="system-ui, sans-serif">repos</text>
    <text x="140" y="100" fill="#171717" font-size="28" font-weight="300" font-family="Georgia, serif">${formatNumber(stats.publicRepos)}</text>
    <text x="256" y="80" fill="#737373" font-size="11" font-family="system-ui, sans-serif">followers</text>
    <text x="256" y="100" fill="#171717" font-size="28" font-weight="300" font-family="Georgia, serif">${formatNumber(stats.followers)}</text>
    <text x="372" y="80" fill="#737373" font-size="11" font-family="system-ui, sans-serif">forks</text>
    <text x="372" y="100" fill="#171717" font-size="28" font-weight="300" font-family="Georgia, serif">${formatNumber(stats.totalForks)}</text>
    <text x="24" y="${H - 16}" fill="#a3a3a3" font-size="9" font-family="system-ui, sans-serif">@${escapeXml(stats.username)} · mystate.devabir.me</text>
  `);
}

import type { GitHubStats } from "@/types";
import { escapeXml, formatNumber } from "@/lib/utils";

export const W = 495;
export const H = 195;

export function statRow(
  x: number,
  y: number,
  icon: string,
  label: string,
  value: number,
  color: string,
): string {
  return `
    <g transform="translate(${x}, ${y})">
      <text x="0" y="0" fill="${color}" font-size="11" font-family="system-ui, sans-serif" opacity="0.7">${escapeXml(label)}</text>
      <text x="0" y="22" fill="${color}" font-size="20" font-weight="600" font-family="system-ui, sans-serif">${formatNumber(value)}</text>
      <text x="0" y="-8" fill="${color}" font-size="14" opacity="0.5">${icon}</text>
    </g>`;
}

export function languageBar(
  languages: GitHubStats["topLanguages"],
  x: number,
  y: number,
  width: number,
  textColor: string,
): string {
  if (languages.length === 0) return "";

  const barHeight = 8;
  let offset = 0;
  const segments = languages
    .map((lang) => {
      const segWidth = (lang.percentage / 100) * width;
      const seg = `<rect x="${x + offset}" y="${y}" width="${segWidth}" height="${barHeight}" rx="2" fill="${lang.color}"/>`;
      offset += segWidth;
      return seg;
    })
    .join("");

  const labels = languages
    .slice(0, 4)
    .map((lang, i) => {
      const lx = x + i * 110;
      return `
        <circle cx="${lx}" cy="${y + 22}" r="4" fill="${lang.color}"/>
        <text x="${lx + 10}" y="${y + 26}" fill="${textColor}" font-size="10" font-family="system-ui, sans-serif" opacity="0.8">${escapeXml(lang.name)} ${lang.percentage}%</text>`;
    })
    .join("");

  return `${segments}${labels}`;
}

export function wrapSvg(content: string, width = W, height = H): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
${content}
</svg>`;
}

export function header(
  stats: GitHubStats,
  titleColor: string,
  subtitleColor: string,
): string {
  const displayName = stats.name ?? stats.username;
  return `
    <text x="20" y="32" fill="${titleColor}" font-size="18" font-weight="700" font-family="system-ui, sans-serif">${escapeXml(displayName)}</text>
    <text x="20" y="50" fill="${subtitleColor}" font-size="12" font-family="system-ui, sans-serif" opacity="0.6">@${escapeXml(stats.username)}</text>`;
}

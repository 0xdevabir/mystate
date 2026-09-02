import type { GitHubStats, ThemePalette } from "@/types";
import { escapeXml, formatNumber } from "@/lib/utils";

export function wrapSvg(
  content: string,
  width: number,
  height: number,
  palette: ThemePalette,
): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="GitHub stats for ${escapeXml(content.includes("stats") ? "" : "")}">
${content}
</svg>`;
}

export function svgOpen(width: number, height: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
}

export function svgClose(): string {
  return `</svg>`;
}

export function bgRect(
  w: number,
  h: number,
  palette: ThemePalette,
  rx = 10,
): string {
  return `<rect width="${w}" height="${h}" rx="${rx}" fill="${palette.bg}" stroke="${palette.border}" stroke-width="1"/>`;
}

export function avatar(
  url: string,
  x: number,
  y: number,
  size: number,
  palette: ThemePalette,
): string {
  const r = size / 2;
  return `
    <defs>
      <clipPath id="av-${x}-${y}"><circle cx="${x + r}" cy="${y + r}" r="${r}"/></clipPath>
    </defs>
    <circle cx="${x + r}" cy="${y + r}" r="${r + 1}" fill="${palette.border}"/>
    <image href="${escapeXml(url)}" xlink:href="${escapeXml(url)}" x="${x}" y="${y}" width="${size}" height="${size}" clip-path="url(#av-${x}-${y})" preserveAspectRatio="xMidYMid slice"/>`;
}

export function text(
  x: number,
  y: number,
  content: string,
  opts: {
    fill: string;
    size?: number;
    weight?: number | string;
    anchor?: string;
    opacity?: number;
    family?: string;
  },
): string {
  const {
    fill,
    size = 12,
    weight = 400,
    anchor = "start",
    opacity = 1,
    family = "system-ui,-apple-system,sans-serif",
  } = opts;
  return `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="${weight}" font-family="${family}" text-anchor="${anchor}" opacity="${opacity}">${escapeXml(content)}</text>`;
}

export function statCell(
  x: number,
  y: number,
  label: string,
  value: number | string,
  palette: ThemePalette,
  w = 72,
): string {
  return `
    <g transform="translate(${x},${y})">
      ${text(0, 0, label, { fill: palette.statLabel, size: 9, weight: 500 })}
      ${text(0, 16, String(typeof value === "number" ? formatNumber(value) : value), {
        fill: palette.statValue,
        size: 15,
        weight: 700,
      })}
    </g>`;
}

export function sectionTitle(
  x: number,
  y: number,
  title: string,
  palette: ThemePalette,
): string {
  return text(x, y, title.toUpperCase(), {
    fill: palette.accent,
    size: 9,
    weight: 700,
    opacity: 0.9,
  });
}

export function divider(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  palette: ThemePalette,
): string {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${palette.border}" stroke-width="1"/>`;
}

export function languageBar(
  languages: GitHubStats["topLanguages"],
  x: number,
  y: number,
  width: number,
  palette: ThemePalette,
): string {
  if (languages.length === 0) {
    return text(x, y + 10, "No language data", { fill: palette.textMuted, size: 10 });
  }

  const barH = 6;
  let offset = 0;
  const segments = languages
    .map((lang) => {
      const segW = Math.max((lang.percentage / 100) * width, 2);
      const seg = `<rect x="${x + offset}" y="${y}" width="${segW}" height="${barH}" rx="2" fill="${lang.color}"/>`;
      offset += segW;
      return seg;
    })
    .join("");

  const labels = languages
    .slice(0, 4)
    .map((lang, i) => {
      const lx = x + i * Math.min(95, width / 4);
      return `
        <circle cx="${lx}" cy="${y + 18}" r="3.5" fill="${lang.color}"/>
        ${text(lx + 8, y + 22, `${lang.name} ${lang.percentage}%`, {
          fill: palette.textMuted,
          size: 9,
        })}`;
    })
    .join("");

  return `${segments}${labels}`;
}

export function footer(
  x: number,
  y: number,
  palette: ThemePalette,
  label = "mystate.devabir.me",
): string {
  return text(x, y, label, { fill: palette.textMuted, size: 8, opacity: 0.5 });
}

export function allStatFields(stats: GitHubStats): {
  label: string;
  value: number | string;
}[] {
  return [
    { label: "Stars", value: stats.totalStars },
    { label: "Repos", value: stats.publicRepos },
    { label: "Followers", value: stats.followers },
    { label: "Following", value: stats.following },
    { label: "PRs", value: stats.totalPullRequests },
    { label: "Watchers", value: stats.totalWatchers },
    { label: "Avg Stars", value: stats.avgStarsPerRepo },
    { label: "Account", value: stats.accountAge },
  ];
}

export function displayName(stats: GitHubStats): string {
  return stats.name ?? stats.username;
}

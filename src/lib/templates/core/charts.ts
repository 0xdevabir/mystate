import type { GitHubStats, ThemePalette } from "@/types";
import { formatNumber } from "@/lib/utils";
import { text } from "./svg";

export function subtleFrame(
  w: number,
  h: number,
  palette: ThemePalette,
  rx = 14,
): string {
  return `
    <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="${rx}" fill="none" stroke="${palette.border}" stroke-width="1" opacity="0.55"/>
    <rect x="1.5" y="1.5" width="${w - 3}" height="${h - 3}" rx="${rx - 1}" fill="none" stroke="${palette.text}" stroke-width="0.5" opacity="0.04"/>`;
}

export function gradientBorder(
  w: number,
  h: number,
  _id: string,
  palette: ThemePalette,
): string {
  return subtleFrame(w, h, palette);
}

export function card(
  x: number,
  y: number,
  w: number,
  h: number,
  palette: ThemePalette,
  rx = 10,
): string {
  const glassShine =
    palette.id === "glass"
      ? `<rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="${Math.min(h * 0.45, 48)}" rx="${rx - 1}" fill="${palette.text}" opacity="0.04"/>`
      : "";
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${palette.card}" stroke="${palette.border}" stroke-width="1" opacity="${palette.id === "glass" ? "0.92" : "1"}"/>
    ${glassShine}`;
}

export function areaChart(
  data: GitHubStats["monthlyContributions"],
  x: number,
  y: number,
  w: number,
  h: number,
  palette: ThemePalette,
  uid: string,
): string {
  if (data.length === 0) {
    const gridLines = [0.25, 0.5, 0.75].map(
      (pct) =>
        `<line x1="${x}" y1="${y + h * pct}" x2="${x + w}" y2="${y + h * pct}" stroke="${palette.border}" stroke-width="0.5" opacity="0.25"/>`,
    );
    return `
      ${gridLines.join("")}
      <line x1="${x}" y1="${y + h}" x2="${x + w}" y2="${y + h}" stroke="${palette.border}" stroke-width="1" opacity="0.35"/>`;
  }

  const max = Math.max(...data.map((d) => d.count), 1);
  const plotH = h - 14;
  const step = data.length > 1 ? w / (data.length - 1) : w;
  const points = data.map((d, i) => ({
    x: x + i * step,
    y: y + plotH - (d.count / max) * (plotH - 8),
  }));

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L${(x + w).toFixed(1)},${y + plotH} L${x},${y + plotH} Z`;

  const gridLines = [0.25, 0.5, 0.75].map(
    (pct) =>
      `<line x1="${x}" y1="${y + plotH * pct}" x2="${x + w}" y2="${y + plotH * pct}" stroke="${palette.border}" stroke-width="0.5" opacity="0.4"/>`,
  );

  const labels = data
    .filter((_, i) => i % 2 === 0 || i === data.length - 1)
    .map((d, _, arr) => {
      const idx = data.indexOf(d);
      const px = x + idx * step;
      return text(px, y + h - 2, d.month, {
        fill: palette.textMuted,
        size: 7,
        anchor: "middle",
      });
    })
    .join("");

  return `
    <defs>
      <linearGradient id="area-${uid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${palette.chartFill}" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="${palette.chartFill}" stop-opacity="0.02"/>
      </linearGradient>
    </defs>
    ${gridLines.join("")}
    <path d="${area}" fill="url(#area-${uid})"/>
    <path d="${line}" fill="none" stroke="${palette.chartLine}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${points.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="2.5" fill="${palette.chartLine}"/>`).join("")}
    ${labels}`;
}

export function rankBadge(
  x: number,
  y: number,
  rank: string,
  palette: ThemePalette,
  size = 56,
): string {
  const r = size / 2;
  const rankSize = Math.max(14, Math.round(size * 0.36));
  return `
    ${text(x, y - r - 5, "RANK", { fill: palette.textMuted, size: 7, weight: 700, anchor: "middle" })}
    <circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${palette.rankRing}" stroke-width="3" opacity="0.3"/>
    <circle cx="${x}" cy="${y}" r="${r - 6}" fill="none" stroke="${palette.rankRing}" stroke-width="2"/>
    ${text(x, y + 5, rank, { fill: palette.accent, size: rankSize, weight: 800, anchor: "middle" })}`;
}


export function languageStackedBar(
  languages: GitHubStats["topLanguages"],
  x: number,
  y: number,
  w: number,
  maxItems = 5,
  barH = 8,
): string {
  if (languages.length === 0) return "";

  const items = languages.slice(0, maxItems);
  const total = items.reduce((s, l) => s + l.percentage, 0) || 100;
  let offset = 0;
  return items
    .map((lang) => {
      const segW = Math.max((lang.percentage / total) * w, 2);
      const seg = `<rect x="${x + offset}" y="${y}" width="${segW}" height="${barH}" rx="2" fill="${lang.color}"/>`;
      offset += segW;
      return seg;
    })
    .join("");
}

export function languageBarDetailed(
  languages: GitHubStats["topLanguages"],
  x: number,
  y: number,
  w: number,
  palette: ThemePalette,
  maxItems = 4,
): string {
  if (languages.length === 0) {
    return text(x, y + 10, "No language data", { fill: palette.textMuted, size: 10 });
  }

  const items = languages.slice(0, maxItems);
  const barH = 8;
  const segments = languageStackedBar(languages, x, y, w, maxItems, barH);

  const labels = items
    .map((lang, i) => {
      const ly = y + 20 + i * 16;
      return `
      <circle cx="${x}" cy="${ly}" r="3.5" fill="${lang.color}"/>
      ${text(x + 10, ly + 4, lang.name, { fill: palette.text, size: 9, weight: 600 })}
      ${text(x + w, ly + 4, `${lang.percentage}%`, { fill: palette.textMuted, size: 9, anchor: "end" })}`;
    })
    .join("");

  return `${segments}${labels}`;
}

export function languageListRows(
  languages: GitHubStats["topLanguages"],
  x: number,
  y: number,
  w: number,
  palette: ThemePalette,
  rowH = 24,
  maxItems = 6,
): string {
  const items = languages.slice(0, maxItems);
  const barMaxW = w - 130;
  return items
    .map((lang, i) => {
      const ly = y + i * rowH;
      const barW = Math.max((lang.percentage / 100) * barMaxW, 2);
      return `
      <circle cx="${x}" cy="${ly}" r="4" fill="${lang.color}"/>
      ${text(x + 12, ly + 4, lang.name, { fill: palette.text, size: 10, weight: 600 })}
      ${text(x + 88, ly + 4, `${lang.percentage}%`, { fill: palette.textMuted, size: 10, anchor: "end" })}
      <rect x="${x + 100}" y="${ly - 6}" width="${barMaxW}" height="6" rx="2" fill="${palette.border}" opacity="0.35"/>
      <rect x="${x + 100}" y="${ly - 6}" width="${barW}" height="6" rx="2" fill="${lang.color}"/>`;
    })
    .join("");
}

export function donutChart(
  languages: GitHubStats["topLanguages"],
  cx: number,
  cy: number,
  r: number,
  palette: ThemePalette,
): string {
  if (languages.length === 0) return "";

  const circumference = 2 * Math.PI * r;
  let offset = 0;
  const segments = languages.slice(0, 6).map((lang) => {
    const len = (lang.percentage / 100) * circumference;
    const seg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${lang.color}" stroke-width="14" stroke-dasharray="${len} ${circumference - len}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})"/>`;
    offset += len;
    return seg;
  });

  const top = languages[0];
  return `
    ${segments.join("")}
    <circle cx="${cx}" cy="${cy}" r="${r - 10}" fill="${palette.card}"/>
    ${text(cx, cy - 4, top?.name ?? "", { fill: palette.text, size: 11, weight: 700, anchor: "middle" })}
    ${text(cx, cy + 12, `${top?.percentage ?? 0}%`, { fill: palette.accent, size: 14, weight: 800, anchor: "middle" })}`;
}

export function heatmapStrip(
  days: GitHubStats["contributionDays"],
  x: number,
  y: number,
  w: number,
  h: number,
  palette: ThemePalette,
): string {
  const recent = days.slice(-52);
  if (recent.length === 0) {
    const cellW = w / 52;
    return Array.from({ length: 52 }, (_, i) =>
      `<rect x="${x + i * cellW}" y="${y}" width="${Math.max(cellW - 1, 1)}" height="${h}" rx="1" fill="${palette.border}" opacity="0.12"/>`,
    ).join("");
  }

  const cellW = w / recent.length;
  const max = Math.max(...recent.map((d) => d.count), 1);

  return recent
    .map((d, i) => {
      const intensity = d.count / max;
      const opacity = d.count === 0 ? 0.08 : 0.2 + intensity * 0.8;
      return `<rect x="${x + i * cellW}" y="${y}" width="${Math.max(cellW - 1, 1)}" height="${h}" rx="1" fill="${palette.highlight}" opacity="${opacity}"/>`;
    })
    .join("");
}

export function statRow(
  x: number,
  y: number,
  icon: string,
  label: string,
  value: string | number,
  palette: ThemePalette,
): string {
  return `
    <g transform="translate(${x},${y})">
      ${text(0, 0, icon, { fill: palette.accent, size: 11 })}
      ${text(16, 0, label, { fill: palette.textMuted, size: 10 })}
      ${text(16, 16, typeof value === "number" ? formatNumber(value) : value, {
        fill: palette.statValue,
        size: 13,
        weight: 700,
      })}
    </g>`;
}

export function streakCard(
  x: number,
  y: number,
  w: number,
  h: number,
  icon: string,
  title: string,
  value: number | string,
  subtitle: string,
  palette: ThemePalette,
  accentColor?: string,
): string {
  const valueStr = typeof value === "number" ? formatNumber(value) : String(value);
  const subtitleLine = subtitle
    ? text(x + 14, y + h - 10, subtitle, { fill: palette.textMuted, size: 7, opacity: 0.75 })
    : "";
  return `
    ${card(x, y, w, h, palette)}
    ${text(x + 14, y + 22, icon, { fill: accentColor ?? palette.accent, size: 13 })}
    ${text(x + 32, y + 22, title, { fill: palette.textMuted, size: 9, weight: 600 })}
    ${text(x + 14, y + 54, valueStr, { fill: palette.text, size: 20, weight: 800 })}
    ${subtitleLine}`;
}

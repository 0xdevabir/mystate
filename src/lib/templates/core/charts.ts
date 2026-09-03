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
  id: string,
  palette: ThemePalette,
): string {
  return `
    <defs>
      <linearGradient id="grad-border-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${palette.highlight}" stop-opacity="0.95"/>
        <stop offset="45%" stop-color="${palette.accent}" stop-opacity="1"/>
        <stop offset="100%" stop-color="#a371f7" stop-opacity="0.9"/>
      </linearGradient>
    </defs>
    <rect x="1.5" y="1.5" width="${w - 3}" height="${h - 3}" rx="13" fill="none" stroke="url(#grad-border-${id})" stroke-width="2"/>`;
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

export function languageBarGrid(
  languages: GitHubStats["topLanguages"],
  x: number,
  y: number,
  w: number,
  palette: ThemePalette,
  maxItems = 8,
): string {
  if (languages.length === 0) {
    return text(x, y + 12, "No language data", { fill: palette.textMuted, size: 11 });
  }

  const items = languages.slice(0, maxItems);
  const barH = 10;
  const segments = languageStackedBar(items, x, y, w, maxItems, barH);
  const colW = w / 2;

  const labels = items
    .map((lang, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const lx = x + col * colW;
      const ly = y + 24 + row * 20;
      return `
      <circle cx="${lx}" cy="${ly}" r="4.5" fill="${lang.color}"/>
      ${text(lx + 14, ly + 4, lang.name, { fill: palette.text, size: 10, weight: 600 })}
      ${text(lx + colW - 6, ly + 4, `${lang.percentage}%`, {
        fill: palette.textMuted,
        size: 10,
        weight: 600,
        anchor: "end",
      })}`;
    })
    .join("");

  return `${segments}${labels}`;
}

export function areaChartPro(
  data: GitHubStats["monthlyContributions"],
  x: number,
  y: number,
  w: number,
  h: number,
  palette: ThemePalette,
  uid: string,
): string {
  if (data.length === 0) {
    return areaChart(data, x, y, w, h, palette, uid);
  }

  const max = Math.max(...data.map((d) => d.count), 1);
  const mid = Math.round(max / 2);
  const plotH = h - 18;
  const plotX = x + 36;
  const plotW = w - 40;
  const step = data.length > 1 ? plotW / (data.length - 1) : plotW;

  const points = data.map((d, i) => ({
    x: plotX + i * step,
    y: y + plotH - (d.count / max) * (plotH - 10),
  }));

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L${(plotX + plotW).toFixed(1)},${y + plotH} L${plotX},${y + plotH} Z`;

  const yLabels = [
    { v: max, y: y + 12 },
    { v: mid, y: y + plotH / 2 + 4 },
    { v: 0, y: y + plotH - 2 },
  ]
    .map(
      (t) =>
        `${text(plotX - 8, t.y, formatNumber(t.v), {
          fill: palette.textMuted,
          size: 8,
          anchor: "end",
        })}`,
    )
    .join("");

  const gridLines = [0.25, 0.5, 0.75]
    .map(
      (pct) =>
        `<line x1="${plotX}" y1="${y + plotH * pct}" x2="${plotX + plotW}" y2="${y + plotH * pct}" stroke="${palette.border}" stroke-width="0.5" opacity="0.35"/>`,
    )
    .join("");

  const labels = data
    .filter((_, i) => i % 2 === 0 || i === data.length - 1)
    .map((d) => {
      const idx = data.indexOf(d);
      const px = plotX + idx * step;
      return text(px, y + h - 4, d.month, {
        fill: palette.textMuted,
        size: 7,
        anchor: "middle",
      });
    })
    .join("");

  return `
    <defs>
      <linearGradient id="area-pro-${uid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${palette.chartFill}" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="${palette.chartFill}" stop-opacity="0.03"/>
      </linearGradient>
      <filter id="glow-${uid}" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    ${yLabels}
    ${gridLines}
    <path d="${area}" fill="url(#area-pro-${uid})"/>
    <path d="${line}" fill="none" stroke="${palette.chartLine}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow-${uid})"/>
    ${points.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="3" fill="${palette.chartLine}"/>`).join("")}
    ${labels}`;
}

export function streakCardPro(
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
  ring = false,
): string {
  const valueStr = typeof value === "number" ? formatNumber(value) : String(value);
  const accent = accentColor ?? palette.accent;
  const ringSvg = ring
    ? `<circle cx="${x + w / 2}" cy="${y + 46}" r="22" fill="none" stroke="${accent}" stroke-width="2.5" opacity="0.35"/>
       <circle cx="${x + w / 2}" cy="${y + 46}" r="16" fill="none" stroke="${accent}" stroke-width="1.5" opacity="0.5"/>`
    : "";

  return `
    ${card(x, y, w, h, palette)}
    ${ringSvg}
    ${text(ring ? x + w / 2 : x + 16, ring ? y + 50 : y + 28, icon, {
      fill: accent,
      size: ring ? 14 : 16,
      anchor: ring ? "middle" : "start",
    })}
    ${ring
      ? ""
      : text(x + 16, y + 50, title, { fill: palette.textMuted, size: 10, weight: 600 })}
    ${text(ring ? x + w / 2 : x + 16, ring ? y + 72 : y + 78, valueStr, {
      fill: palette.text,
      size: ring ? 26 : 28,
      weight: 800,
      anchor: ring ? "middle" : "start",
    })}
    ${ring
      ? text(x + w / 2, y + 90, title, {
          fill: palette.textMuted,
          size: 9,
          weight: 600,
          anchor: "middle",
        })
      : ""}
    ${subtitle
      ? text(ring ? x + w / 2 : x + 16, y + h - 12, subtitle, {
          fill: palette.textMuted,
          size: 7,
          opacity: 0.8,
          anchor: ring ? "middle" : "start",
        })
      : ""}`;
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
  const nameW = 104;
  const pctX = nameW + 12;
  const barX = pctX + 40;
  const barMaxW = Math.max(w - barX, 20);
  return items
    .map((lang, i) => {
      const ly = y + i * rowH;
      const barW = Math.max((lang.percentage / 100) * barMaxW, 2);
      return `
      <circle cx="${x}" cy="${ly}" r="4" fill="${lang.color}"/>
      ${text(x + 12, ly + 4, lang.name, { fill: palette.text, size: 10, weight: 600 })}
      ${text(x + pctX, ly + 4, `${lang.percentage}%`, { fill: palette.textMuted, size: 10, anchor: "end" })}
      <rect x="${x + barX}" y="${ly - 6}" width="${barMaxW}" height="6" rx="2" fill="${palette.border}" opacity="0.35"/>
      <rect x="${x + barX}" y="${ly - 6}" width="${barW}" height="6" rx="2" fill="${lang.color}"/>`;
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
  const rows = 7;
  const gap = Math.max(1, Math.min(3, w / 200));

  if (days.length === 0) {
    const weeks = 52;
    const cell = Math.min((w - (weeks - 1) * gap) / weeks, (h - (rows - 1) * gap) / rows);
    const ox = x + (w - (weeks * cell + (weeks - 1) * gap)) / 2;
    const cells: string[] = [];
    for (let wk = 0; wk < weeks; wk++) {
      for (let r = 0; r < rows; r++) {
        cells.push(
          `<rect x="${(ox + wk * (cell + gap)).toFixed(1)}" y="${(y + r * (cell + gap)).toFixed(1)}" width="${cell.toFixed(1)}" height="${cell.toFixed(1)}" rx="${Math.min(2, cell / 4).toFixed(1)}" fill="${palette.border}" opacity="0.12"/>`,
        );
      }
    }
    return cells.join("");
  }

  const recent = days.slice(-364);
  const first = new Date(recent[0].date);
  const firstDow = Number.isNaN(first.getTime()) ? 0 : first.getUTCDay();
  const weeksCount = Math.ceil((firstDow + recent.length) / rows);
  const cell = Math.min((w - (weeksCount - 1) * gap) / weeksCount, (h - (rows - 1) * gap) / rows);
  const ox = x + (w - (weeksCount * cell + (weeksCount - 1) * gap)) / 2;
  const max = Math.max(...recent.map((d) => d.count), 1);

  return recent
    .map((d, i) => {
      const idx = i + firstDow;
      const wk = Math.floor(idx / rows);
      const r = idx % rows;
      const intensity = d.count / max;
      const opacity = d.count === 0 ? 0.08 : 0.2 + intensity * 0.8;
      return `<rect x="${(ox + wk * (cell + gap)).toFixed(1)}" y="${(y + r * (cell + gap)).toFixed(1)}" width="${cell.toFixed(1)}" height="${cell.toFixed(1)}" rx="${Math.min(2, cell / 4).toFixed(1)}" fill="${palette.highlight}" opacity="${opacity.toFixed(2)}"/>`;
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

export function radarChart(
  metrics: { label: string; value: number; max: number }[],
  cx: number,
  cy: number,
  r: number,
  palette: ThemePalette,
  uid: string,
): string {
  const n = metrics.length;
  if (n < 3) return "";

  const angleStep = (Math.PI * 2) / n;
  const startAngle = -Math.PI / 2;

  const point = (i: number, frac: number) => {
    const angle = startAngle + i * angleStep;
    return { x: cx + Math.cos(angle) * r * frac, y: cy + Math.sin(angle) * r * frac };
  };

  const grid = [0.25, 0.5, 0.75, 1]
    .map((lvl) => {
      const pts = metrics.map((_, i) => point(i, lvl));
      const path = `${pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")} Z`;
      return `<path d="${path}" fill="none" stroke="${palette.border}" stroke-width="1" opacity="${lvl === 1 ? 0.45 : 0.18}"/>`;
    })
    .join("");

  const spokes = metrics
    .map((_, i) => {
      const p = point(i, 1);
      return `<line x1="${cx}" y1="${cy}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="${palette.border}" stroke-width="1" opacity="0.25"/>`;
    })
    .join("");

  const dataPts = metrics.map((m, i) => point(i, Math.max(0.05, Math.min(1, m.max > 0 ? m.value / m.max : 0))));
  const dataPath = `${dataPts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")} Z`;

  const labels = metrics
    .map((m, i) => {
      const p = point(i, 1.24);
      const angle = startAngle + i * angleStep;
      const cos = Math.cos(angle);
      const anchor = Math.abs(cos) < 0.35 ? "middle" : cos > 0 ? "start" : "end";
      return text(p.x, p.y, m.label, { fill: palette.textMuted, size: 9, weight: 600, anchor });
    })
    .join("");

  return `
    <defs>
      <radialGradient id="radar-fill-${uid}" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="${palette.chartFill}" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="${palette.chartFill}" stop-opacity="0.06"/>
      </radialGradient>
      <filter id="radar-glow-${uid}" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    ${grid}
    ${spokes}
    <path d="${dataPath}" fill="url(#radar-fill-${uid})" stroke="${palette.chartLine}" stroke-width="2" stroke-linejoin="round" filter="url(#radar-glow-${uid})"/>
    ${dataPts.map((p) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="2.5" fill="${palette.chartLine}"/>`).join("")}
    ${labels}`;
}

export function ringGauge(
  cx: number,
  cy: number,
  r: number,
  value: number,
  max: number,
  color: string,
  strokeWidth = 10,
): string {
  const circumference = 2 * Math.PI * r;
  const frac = Math.max(0, Math.min(1, max > 0 ? value / max : 0));
  const len = frac * circumference;
  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" opacity="0.16"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-dasharray="${len.toFixed(1)} ${(circumference - len).toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"/>`;
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

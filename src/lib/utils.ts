export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function statsParams(username: string, template: string, theme: string): string {
  return new URLSearchParams({ username, template, theme }).toString();
}

/** Relative URL for in-app previews (works on localhost + production). */
export function buildPreviewUrl(
  username: string,
  template: string,
  theme: string,
): string {
  return `/api/stats?${statsParams(username, template, theme)}`;
}

/** Absolute URL for README embed code. */
export function buildEmbedUrl(
  username: string,
  template: string,
  theme: string,
): string {
  return `${getBaseUrl()}/api/stats?${statsParams(username, template, theme)}`;
}

export function buildMarkdown(
  username: string,
  template: string,
  theme: string,
): string {
  return `![MyState](${buildEmbedUrl(username, template, theme)})`;
}


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

export function buildEmbedUrl(
  username: string,
  template: string,
  theme: string,
): string {
  const params = new URLSearchParams({
    username,
    template,
    theme,
  });
  return `${getBaseUrl()}/api/stats?${params.toString()}`;
}

export function buildMarkdown(
  username: string,
  template: string,
  theme: string,
): string {
  return `![MyState](${buildEmbedUrl(username, template, theme)})`;
}

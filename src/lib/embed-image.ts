const UA = "MyState-Stats-Builder";

/** Embed remote images in SVG (browsers block external URLs in <img src="*.svg">). */
export async function embedImageAsDataUrl(url: string): Promise<string> {
  if (!url || url.startsWith("data:")) return url;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "image/*" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return url;

    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length === 0 || buffer.length > 512_000) return url;

    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch {
    return url;
  }
}

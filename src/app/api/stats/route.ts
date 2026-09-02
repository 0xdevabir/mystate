import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubStats } from "@/lib/github";
import { getDemoStats } from "@/lib/demo-stats";
import { DEFAULT_TEMPLATE, renderTemplate } from "@/lib/templates";
import { DEFAULT_THEME } from "@/lib/themes";
import { escapeXml } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const username = searchParams.get("username");
  const template =
    searchParams.get("template") ?? searchParams.get("layout") ?? DEFAULT_TEMPLATE;
  const theme = searchParams.get("theme") ?? searchParams.get("color") ?? DEFAULT_THEME;
  const isPreview = searchParams.get("preview") === "1";

  if (!username) {
    return svgResponse(errorSvg("Missing username parameter"));
  }

  try {
    const stats = await fetchGitHubStats(username);
    const svg = renderTemplate(template, theme, stats);
    return svgResponse(svg);
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN";

    if (isPreview) {
      const stats = getDemoStats(username);
      const svg = renderTemplate(template, theme, stats);
      return svgResponse(svg);
    }

    if (message === "USER_NOT_FOUND") {
      return svgResponse(errorSvg("User not found"));
    }
    if (message === "INVALID_USERNAME") {
      return svgResponse(errorSvg("Invalid username"));
    }

    console.error("[stats]", message);
    return svgResponse(
      errorSvg("Failed to fetch stats — add GITHUB_TOKEN on server"),
    );
  }
}

function svgResponse(svg: string) {
  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

function errorSvg(message: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="495" height="80" viewBox="0 0 495 80">
    <rect width="495" height="80" rx="8" fill="#1a1a1a" stroke="#333" stroke-width="1"/>
    <text x="247" y="45" fill="#ef4444" font-size="13" font-family="system-ui,sans-serif" text-anchor="middle">${escapeXml(message)}</text>
  </svg>`;
}

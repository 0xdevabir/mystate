import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubStats } from "@/lib/github";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;

  try {
    const stats = await fetchGitHubStats(username);
    return NextResponse.json({
      username: stats.username,
      name: stats.name,
      avatar: stats.avatar,
      publicRepos: stats.publicRepos,
      followers: stats.followers,
      following: stats.following,
      totalStars: stats.totalStars,
      totalForks: stats.totalForks,
      topLanguages: stats.topLanguages,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN";

    if (message === "USER_NOT_FOUND") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (message === "INVALID_USERNAME") {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

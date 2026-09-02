import type { GitHubStats, LanguageStat } from "@/types";

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Vue: "#41b883",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Scala: "#c22d40",
  Elixir: "#6e4a7e",
};

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  language: string | null;
}

async function githubFetch<T>(path: string): Promise<T> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "MyState-Stats-Builder",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(`https://api.github.com${path}`, {
    headers,
    next: { revalidate: 3600 },
  });

  if (res.status === 404) throw new Error("USER_NOT_FOUND");
  if (!res.ok) throw new Error(`GITHUB_API_ERROR:${res.status}`);

  return res.json() as Promise<T>;
}

function computeLanguages(repos: GitHubRepo[]): LanguageStat[] {
  const counts: Record<string, number> = {};
  let total = 0;

  for (const repo of repos) {
    if (!repo.language) continue;
    counts[repo.language] = (counts[repo.language] ?? 0) + 1;
    total++;
  }

  if (total === 0) return [];

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / total) * 100),
      color: LANGUAGE_COLORS[name] ?? "#8b949e",
    }));
}

export async function fetchGitHubStats(username: string): Promise<GitHubStats> {
  const clean = username.trim().toLowerCase();
  if (!clean || !/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(clean)) {
    throw new Error("INVALID_USERNAME");
  }

  const [user, repos] = await Promise.all([
    githubFetch<GitHubUser>(`/users/${clean}`),
    githubFetch<GitHubRepo[]>(`/users/${clean}/repos?per_page=100&sort=updated`),
  ]);

  let totalStars = 0;
  let totalForks = 0;
  for (const repo of repos) {
    totalStars += repo.stargazers_count;
    totalForks += repo.forks_count;
  }

  return {
    username: user.login,
    name: user.name,
    avatar: user.avatar_url,
    publicRepos: user.public_repos,
    followers: user.followers,
    following: user.following,
    totalStars,
    totalForks,
    topLanguages: computeLanguages(repos),
  };
}

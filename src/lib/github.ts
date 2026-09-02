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
  Jupyter: "#DA5B0B",
  Markdown: "#083fa1",
  Dockerfile: "#384d54",
};

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "MyState-Stats-Builder",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function githubFetch<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: getHeaders(),
    next: { revalidate: 3600 },
  });
  if (res.status === 404) throw new Error("USER_NOT_FOUND");
  if (!res.ok) throw new Error(`GITHUB_API_ERROR:${res.status}`);
  return res.json() as Promise<T>;
}

async function githubGraphQL<T>(query: string, variables: Record<string, string>): Promise<T> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      ...getHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`GITHUB_GRAPHQL_ERROR:${res.status}`);
  const json = (await res.json()) as { data: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(`GITHUB_GRAPHQL_ERROR:${json.errors[0].message}`);
  return json.data;
}

function formatAccountAge(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const years = now.getFullYear() - created.getFullYear();
  const months = now.getMonth() - created.getMonth();
  const totalMonths = years * 12 + months;
  if (totalMonths < 12) return `${totalMonths}mo`;
  const y = Math.floor(totalMonths / 12);
  const m = totalMonths % 12;
  return m > 0 ? `${y}y ${m}mo` : `${y}y`;
}

function computeLanguagesFromBytes(
  langBytes: Record<string, number>,
): LanguageStat[] {
  const total = Object.values(langBytes).reduce((a, b) => a + b, 0);
  if (total === 0) return [];

  return Object.entries(langBytes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: Math.round((bytes / total) * 100),
      color: LANGUAGE_COLORS[name] ?? "#8b949e",
    }));
}

function computeLanguagesFromRepos(
  repos: { language: string | null }[],
): LanguageStat[] {
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
    .slice(0, 6)
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / total) * 100),
      color: LANGUAGE_COLORS[name] ?? "#8b949e",
    }));
}

const GRAPHQL_QUERY = `
  query($username: String!) {
    user(login: $username) {
      login
      name
      avatarUrl
      bio
      location
      company
      websiteUrl
      twitterUsername
      createdAt
      followers { totalCount }
      following { totalCount }
      gists { totalCount }
      repositories(privacy: PUBLIC) { totalCount }
      contributionsCollection {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        restrictedContributionsCount
      }
      repositories(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}, ownerAffiliations: OWNER) {
        nodes {
          stargazerCount
          forkCount
          watchers { totalCount }
          primaryLanguage { name }
          languages(first: 10) {
            edges { size node { name } }
          }
        }
      }
    }
  }
`;

interface GraphQLUser {
  user: {
    login: string;
    name: string | null;
    avatarUrl: string;
    bio: string | null;
    location: string | null;
    company: string | null;
    websiteUrl: string | null;
    twitterUsername: string | null;
    createdAt: string;
    followers: { totalCount: number };
    following: { totalCount: number };
    gists: { totalCount: number };
    repositories: {
      totalCount: number;
      nodes: {
        stargazerCount: number;
        forkCount: number;
        watchers: { totalCount: number };
        primaryLanguage: { name: string } | null;
        languages: { edges: { size: number; node: { name: string } }[] };
      }[];
    };
    contributionsCollection: {
      totalCommitContributions: number;
      totalIssueContributions: number;
      totalPullRequestContributions: number;
      totalPullRequestReviewContributions: number;
      restrictedContributionsCount: number;
    };
  } | null;
}

interface RESTUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string | null;
  twitter_username: string | null;
  created_at: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
}

interface RESTRepo {
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
}

function buildStats(
  base: Omit<
    GitHubStats,
    | "totalStars"
    | "totalForks"
    | "totalWatchers"
    | "avgStarsPerRepo"
    | "topLanguages"
    | "totalCommits"
    | "totalIssues"
    | "totalPullRequests"
    | "totalReviews"
    | "totalContributions"
  >,
  repos: {
    stars: number;
    forks: number;
    watchers: number;
  },
  contributions: {
    commits: number;
    issues: number;
    prs: number;
    reviews: number;
    restricted: number;
  },
  languages: LanguageStat[],
): GitHubStats {
  const totalContributions =
    contributions.commits +
    contributions.issues +
    contributions.prs +
    contributions.reviews +
    contributions.restricted;

  return {
    ...base,
    totalStars: repos.stars,
    totalForks: repos.forks,
    totalWatchers: repos.watchers,
    avgStarsPerRepo:
      base.publicRepos > 0
        ? Math.round((repos.stars / base.publicRepos) * 10) / 10
        : 0,
    totalCommits: contributions.commits,
    totalIssues: contributions.issues,
    totalPullRequests: contributions.prs,
    totalReviews: contributions.reviews,
    totalContributions,
    topLanguages: languages,
  };
}

async function fetchViaGraphQL(clean: string): Promise<GitHubStats> {
  const data = await githubGraphQL<GraphQLUser>(GRAPHQL_QUERY, { username: clean });
  if (!data.user) throw new Error("USER_NOT_FOUND");

  const u = data.user;
  const nodes = u.repositories.nodes;

  let totalStars = 0;
  let totalForks = 0;
  let totalWatchers = 0;
  const langBytes: Record<string, number> = {};

  for (const repo of nodes) {
    totalStars += repo.stargazerCount;
    totalForks += repo.forkCount;
    totalWatchers += repo.watchers.totalCount;
    for (const edge of repo.languages.edges) {
      langBytes[edge.node.name] = (langBytes[edge.node.name] ?? 0) + edge.size;
    }
  }

  const c = u.contributionsCollection;

  return buildStats(
    {
      username: u.login,
      name: u.name,
      avatar: u.avatarUrl,
      bio: u.bio,
      location: u.location,
      company: u.company,
      blog: u.websiteUrl,
      twitter: u.twitterUsername,
      createdAt: u.createdAt,
      accountAge: formatAccountAge(u.createdAt),
      publicRepos: u.repositories.totalCount,
      publicGists: u.gists.totalCount,
      followers: u.followers.totalCount,
      following: u.following.totalCount,
    },
    { stars: totalStars, forks: totalForks, watchers: totalWatchers },
    {
      commits: c.totalCommitContributions,
      issues: c.totalIssueContributions,
      prs: c.totalPullRequestContributions,
      reviews: c.totalPullRequestReviewContributions,
      restricted: c.restrictedContributionsCount,
    },
    computeLanguagesFromBytes(langBytes),
  );
}

async function fetchViaREST(clean: string): Promise<GitHubStats> {
  const [user, repos] = await Promise.all([
    githubFetch<RESTUser>(`/users/${clean}`),
    githubFetch<RESTRepo[]>(`/users/${clean}/repos?per_page=100&sort=updated`),
  ]);

  let totalStars = 0;
  let totalForks = 0;
  let totalWatchers = 0;
  for (const repo of repos) {
    totalStars += repo.stargazers_count;
    totalForks += repo.forks_count;
    totalWatchers += repo.watchers_count;
  }

  return buildStats(
    {
      username: user.login,
      name: user.name,
      avatar: user.avatar_url,
      bio: user.bio,
      location: user.location,
      company: user.company,
      blog: user.blog,
      twitter: user.twitter_username,
      createdAt: user.created_at,
      accountAge: formatAccountAge(user.created_at),
      publicRepos: user.public_repos,
      publicGists: user.public_gists,
      followers: user.followers,
      following: user.following,
    },
    { stars: totalStars, forks: totalForks, watchers: totalWatchers },
    { commits: 0, issues: 0, prs: 0, reviews: 0, restricted: 0 },
    computeLanguagesFromRepos(repos),
  );
}

export async function fetchGitHubStats(username: string): Promise<GitHubStats> {
  const clean = username.trim().toLowerCase();
  if (!clean || !/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(clean)) {
    throw new Error("INVALID_USERNAME");
  }

  if (process.env.GITHUB_TOKEN) {
    try {
      return await fetchViaGraphQL(clean);
    } catch {
      return fetchViaREST(clean);
    }
  }

  return fetchViaREST(clean);
}

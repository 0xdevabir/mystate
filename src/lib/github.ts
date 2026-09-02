import type {
  ContributionDay,
  GitHubStats,
  LanguageStat,
  MonthlyContribution,
} from "@/types";

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

async function githubGraphQL<T>(
  query: string,
  variables: Record<string, string>,
): Promise<T> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { ...getHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`GITHUB_GRAPHQL_ERROR:${res.status}`);
  const json = (await res.json()) as { data: T; errors?: { message: string }[] };
  if (json.errors?.length) {
    throw new Error(`GITHUB_GRAPHQL_ERROR:${json.errors[0].message}`);
  }
  return json.data;
}

function formatAccountAge(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const months =
    (now.getFullYear() - created.getFullYear()) * 12 +
    (now.getMonth() - created.getMonth());
  if (months < 12) return `${months}mo`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return m > 0 ? `${y}y ${m}mo` : `${y}y`;
}

function joinedLabel(createdAt: string): string {
  const years = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (365.25 * 24 * 60 * 60 * 1000),
  );
  return years <= 0 ? "Joined this year" : `Joined GitHub ${years} year${years > 1 ? "s" : ""} ago`;
}

function computeLanguagesFromBytes(langBytes: Record<string, number>): LanguageStat[] {
  const total = Object.values(langBytes).reduce((a, b) => a + b, 0);
  if (total === 0) return [];
  return Object.entries(langBytes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: Math.round((bytes / total) * 1000) / 10,
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
    .slice(0, 8)
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / total) * 1000) / 10,
      color: LANGUAGE_COLORS[name] ?? "#8b949e",
    }));
}

function parseCalendarDays(
  weeks: { contributionDays: { contributionCount: number; date: string }[] }[],
): ContributionDay[] {
  return weeks
    .flatMap((w) => w.contributionDays)
    .map((d) => ({ date: d.date, count: d.contributionCount }));
}

function aggregateMonthly(days: ContributionDay[]): MonthlyContribution[] {
  const buckets: Record<string, number> = {};
  for (const day of days) {
    const key = day.date.slice(0, 7);
    buckets[key] = (buckets[key] ?? 0) + day.count;
  }
  const sorted = Object.entries(buckets).sort(([a], [b]) => a.localeCompare(b));
  return sorted.slice(-12).map(([month, count]) => ({
    month: new Date(`${month}-01`).toLocaleString("en", { month: "short" }),
    count,
  }));
}

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function computeStreaks(days: ContributionDay[]) {
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const map = new Map(days.map((d) => [d.date, d.count]));

  let longest = 0;
  let longestStart = "";
  let longestEnd = "";
  let run = 0;
  let runStart = "";

  for (const day of sorted) {
    if (day.count > 0) {
      if (run === 0) runStart = day.date;
      run++;
      if (run > longest) {
        longest = run;
        longestStart = runStart;
        longestEnd = day.date;
      }
    } else {
      run = 0;
    }
  }

  let current = 0;
  let currentStart = "";
  const cursor = new Date();
  for (let i = 0; i < 400; i++) {
    const key = cursor.toISOString().slice(0, 10);
    if ((map.get(key) ?? 0) > 0) {
      if (current === 0) currentStart = key;
      current++;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }

  const today = new Date().toISOString().slice(0, 10);
  return {
    currentStreak: current,
    longestStreak: longest,
    currentStreakRange:
      current > 0
        ? `${formatDateShort(currentStart)} – ${formatDateShort(today)}`
        : "—",
    longestStreakRange:
      longest > 0
        ? `${formatDateShort(longestStart)} – ${formatDateShort(longestEnd)}`
        : "—",
  };
}

function calculateRank(contributions: number, stars: number): string {
  const score = contributions + stars * 3;
  if (score >= 6000) return "S+";
  if (score >= 4500) return "S";
  if (score >= 3000) return "A+";
  if (score >= 2000) return "A";
  if (score >= 1200) return "B+";
  if (score >= 600) return "B";
  if (score >= 250) return "C+";
  return "C";
}

const GRAPHQL_QUERY = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
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
      repositoriesContributedTo(includeUserRepositories: false) { totalCount }
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        restrictedContributionsCount
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
      repositories(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}, ownerAffiliations: OWNER) {
        nodes {
          stargazerCount
          forkCount
          watchers { totalCount }
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
    repositoriesContributedTo: { totalCount: number };
    repositories: {
      totalCount: number;
      nodes: {
        stargazerCount: number;
        forkCount: number;
        watchers: { totalCount: number };
        languages: { edges: { size: number; node: { name: string } }[] };
      }[];
    };
    contributionsCollection: {
      totalCommitContributions: number;
      totalIssueContributions: number;
      totalPullRequestContributions: number;
      totalPullRequestReviewContributions: number;
      restrictedContributionsCount: number;
      contributionCalendar: {
        totalContributions: number;
        weeks: { contributionDays: { contributionCount: number; date: string }[] }[];
      };
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

function emptyAnalytics(createdAt: string) {
  const streaks = computeStreaks([]);
  return {
    contributionsLastYear: 0,
    contributedTo: 0,
    totalLifetimeContributions: 0,
    monthlyContributions: [] as MonthlyContribution[],
    contributionDays: [] as ContributionDay[],
    joinedLabel: joinedLabel(createdAt),
    ...streaks,
  };
}

function buildFromAnalytics(
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
    | "contributionsLastYear"
    | "contributedTo"
    | "totalLifetimeContributions"
    | "currentStreak"
    | "longestStreak"
    | "currentStreakRange"
    | "longestStreakRange"
    | "rank"
    | "monthlyContributions"
    | "contributionDays"
    | "joinedLabel"
  >,
  repos: { stars: number; forks: number; watchers: number },
  contributions: {
    commits: number;
    issues: number;
    prs: number;
    reviews: number;
    restricted: number;
  },
  languages: LanguageStat[],
  analytics: ReturnType<typeof emptyAnalytics> & {
    contributionsLastYear: number;
    totalLifetimeContributions: number;
    monthlyContributions: MonthlyContribution[];
    contributionDays: ContributionDay[];
    contributedTo: number;
  },
): GitHubStats {
  const totalContributions =
    contributions.commits +
    contributions.issues +
    contributions.prs +
    contributions.reviews +
    contributions.restricted;

  return {
    ...base,
    ...analytics,
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
    rank: calculateRank(analytics.contributionsLastYear, repos.stars),
  };
}

async function fetchViaGraphQL(clean: string): Promise<GitHubStats> {
  const now = new Date().toISOString();
  const data = await githubGraphQL<GraphQLUser>(GRAPHQL_QUERY, {
    username: clean,
    from: "2015-01-01T00:00:00Z",
    to: now,
  });
  if (!data.user) throw new Error("USER_NOT_FOUND");

  const u = data.user;
  const c = u.contributionsCollection;
  const calendar = c.contributionCalendar;
  const days = parseCalendarDays(calendar.weeks);
  const streaks = computeStreaks(days);

  let totalStars = 0;
  let totalForks = 0;
  let totalWatchers = 0;
  const langBytes: Record<string, number> = {};

  for (const repo of u.repositories.nodes) {
    totalStars += repo.stargazerCount;
    totalForks += repo.forkCount;
    totalWatchers += repo.watchers.totalCount;
    for (const edge of repo.languages.edges) {
      langBytes[edge.node.name] = (langBytes[edge.node.name] ?? 0) + edge.size;
    }
  }

  const analytics = {
    contributionsLastYear: calendar.totalContributions,
    contributedTo: u.repositoriesContributedTo.totalCount,
    totalLifetimeContributions: days.reduce((s, d) => s + d.count, 0),
    monthlyContributions: aggregateMonthly(days),
    contributionDays: days,
    joinedLabel: joinedLabel(u.createdAt),
  };

  return buildFromAnalytics(
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
    { ...analytics, ...streaks },
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

  return buildFromAnalytics(
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
    emptyAnalytics(user.created_at),
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

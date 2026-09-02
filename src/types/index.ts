export interface LanguageStat {
  name: string;
  percentage: number;
  color: string;
  bytes?: number;
}

export interface MonthlyContribution {
  month: string;
  count: number;
}

export interface ContributionDay {
  date: string;
  count: number;
}

export interface GitHubStats {
  username: string;
  name: string | null;
  avatar: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string | null;
  twitter: string | null;
  createdAt: string;
  accountAge: string;
  joinedLabel: string;

  publicRepos: number;
  publicGists: number;
  followers: number;
  following: number;

  totalStars: number;
  totalForks: number;
  totalWatchers: number;
  avgStarsPerRepo: number;

  totalCommits: number;
  totalIssues: number;
  totalPullRequests: number;
  totalReviews: number;
  totalContributions: number;
  contributionsLastYear: number;
  contributedTo: number;

  totalLifetimeContributions: number;
  currentStreak: number;
  longestStreak: number;
  currentStreakRange: string;
  longestStreakRange: string;

  rank: string;
  monthlyContributions: MonthlyContribution[];
  contributionDays: ContributionDay[];

  topLanguages: LanguageStat[];
}

export interface ThemePalette {
  id: string;
  name: string;
  bg: string;
  bgSecondary: string;
  card: string;
  text: string;
  textMuted: string;
  accent: string;
  border: string;
  statLabel: string;
  statValue: string;
  highlight: string;
  chartLine: string;
  chartFill: string;
  rankRing: string;
}

export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  width: number;
  height: number;
  previewBg: string;
  category: "premium" | "classic";
}

export type TemplateRenderer = (
  stats: GitHubStats,
  palette: ThemePalette,
) => string;

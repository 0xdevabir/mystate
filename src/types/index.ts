export interface GitHubStats {
  username: string;
  name: string | null;
  avatar: string;
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  totalForks: number;
  topLanguages: LanguageStat[];
}

export interface LanguageStat {
  name: string;
  percentage: number;
  color: string;
}

export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  preview: {
    bg: string;
    accent: string;
  };
}

export type TemplateRenderer = (stats: GitHubStats) => string;

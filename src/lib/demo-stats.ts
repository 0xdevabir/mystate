import type { GitHubStats } from "@/types";

export function getDemoStats(username: string): GitHubStats {
  return {
    username,
    name: "Md Abir Hossain",
    avatar: `https://github.com/${username}.png`,
    bio: "Full-stack developer",
    location: "Dhaka, Bangladesh",
    company: "WebNest",
    blog: "https://devabir.me",
    twitter: "0xdevabir",
    createdAt: "2020-05-20T00:00:00Z",
    accountAge: "6y",
    joinedLabel: "Joined GitHub 6 years ago",

    publicRepos: 83,
    publicGists: 12,
    followers: 120,
    following: 95,

    totalStars: 84,
    totalForks: 42,
    totalWatchers: 38,
    avgStarsPerRepo: 1.0,

    totalCommits: 2100,
    totalIssues: 1,
    totalPullRequests: 103,
    totalReviews: 45,
    totalContributions: 2896,
    contributionsLastYear: 2896,
    contributedTo: 27,

    totalLifetimeContributions: 3451,
    currentStreak: 15,
    longestStreak: 33,
    currentStreakRange: "Aug 19, 2026 – Sep 2, 2026",
    longestStreakRange: "Apr 29, 2026 – May 31, 2026",

    rank: "B+",
    monthlyContributions: [
      { month: "Oct", count: 180 },
      { month: "Nov", count: 220 },
      { month: "Dec", count: 195 },
      { month: "Jan", count: 250 },
      { month: "Feb", count: 210 },
      { month: "Mar", count: 280 },
      { month: "Apr", count: 320 },
      { month: "May", count: 290 },
      { month: "Jun", count: 240 },
      { month: "Jul", count: 260 },
      { month: "Aug", count: 310 },
      { month: "Sep", count: 341 },
    ],
    contributionDays: generateDemoDays(),
    topLanguages: [
      { name: "TypeScript", percentage: 67.9, color: "#3178c6" },
      { name: "JavaScript", percentage: 7.9, color: "#f1e05a" },
      { name: "Go", percentage: 7.3, color: "#00ADD8" },
      { name: "CSS", percentage: 5.8, color: "#563d7c" },
      { name: "C++", percentage: 4.2, color: "#f34b7d" },
      { name: "HTML", percentage: 3.1, color: "#e34c26" },
      { name: "Python", percentage: 2.4, color: "#3572A5" },
      { name: "C", percentage: 1.4, color: "#555555" },
    ],
  };
}

function generateDemoDays() {
  const days: { date: string; count: number }[] = [];
  const now = new Date();
  for (let i = 365; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const count = Math.random() > 0.35 ? Math.floor(Math.random() * 12) : 0;
    days.push({ date: d.toISOString().slice(0, 10), count });
  }
  return days;
}

import {
  CommitActivity,
  Contributor,
  IssueStats,
  PullRequestStats,
  Release,
  RepoMeta,
} from "./github";
import { BusFactorResult } from "./busFactor";

export interface HealthScore {
  total: number; // 0-100
  breakdown: {
    activityScore: number;    // 0-25: recent commits
    maintenanceScore: number; // 0-25: PR/issue response time
    communityScore: number;   // 0-25: contributors + stars
    stabilityScore: number;   // 0-25: releases + age
  };
  label: "EXCELLENT" | "GOOD" | "FAIR" | "POOR" | "CRITICAL";
}

export interface RepoAge {
  years: number;
  months: number;
  totalDays: number;
  createdOn: string;
}

export interface ReleaseCadenceMetric {
  totalReleases: number;
  lastReleaseAgo: string;
  avgDaysBetweenReleases: number;
}

export function computeHealthScore(
  commitActivity: CommitActivity[],
  contributors: Contributor[],
  prStats: PullRequestStats,
  issueStats: IssueStats,
  releases: Release[],
  meta: RepoMeta,
  busFactor: BusFactorResult
): HealthScore {
  // Activity score (0-25): commits in last 4 weeks
  const recentWeeks = commitActivity.slice(-4);
  const recentCommits = recentWeeks.reduce((s, w) => s + w.total, 0);
  const activityScore = Math.min(25, Math.round((recentCommits / 50) * 25));

  // Maintenance score (0-25): fast PR + issue response
  const prTimeScore = Math.max(0, 15 - prStats.avgMergeTimeDays);
  const issueTimeScore = Math.max(0, 10 - issueStats.avgResponseTimeDays);
  const maintenanceScore = Math.min(25, Math.round((prTimeScore + issueTimeScore) / 25 * 25));

  // Community score (0-25): contributors count + star power
  const contribScore = Math.min(15, Math.round(contributors.length / 2));
  const starScore = Math.min(10, Math.round(Math.log10(meta.stars + 1) * 3));
  const communityScore = contribScore + starScore;

  // Stability score (0-25): releases + low bus factor risk
  const releaseScore = Math.min(15, releases.length);
  const busScore = busFactor.riskLevel === "LOW" ? 10 :
    busFactor.riskLevel === "MEDIUM" ? 7 :
    busFactor.riskLevel === "HIGH" ? 3 : 0;
  const stabilityScore = Math.min(25, releaseScore + busScore);

  const total = activityScore + maintenanceScore + communityScore + stabilityScore;

  let label: HealthScore["label"];
  if (total >= 80) label = "EXCELLENT";
  else if (total >= 60) label = "GOOD";
  else if (total >= 40) label = "FAIR";
  else if (total >= 20) label = "POOR";
  else label = "CRITICAL";

  return {
    total,
    breakdown: { activityScore, maintenanceScore, communityScore, stabilityScore },
    label,
  };
}

export function computeRepoAge(createdAt: string): RepoAge {
  const created = new Date(createdAt);
  const now = new Date();
  const totalDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);

  return {
    years,
    months,
    totalDays,
    createdOn: created.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
}

export function computeReleaseCadence(releases: Release[]): ReleaseCadenceMetric {
  if (releases.length === 0) {
    return { totalReleases: 0, lastReleaseAgo: "Never", avgDaysBetweenReleases: 0 };
  }

  const sorted = [...releases].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const lastDate = new Date(sorted[0].publishedAt);
  const daysSinceLast = Math.floor(
    (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const lastReleaseAgo =
    daysSinceLast === 0
      ? "Today"
      : daysSinceLast === 1
      ? "1 day ago"
      : daysSinceLast < 30
      ? `${daysSinceLast} days ago`
      : daysSinceLast < 365
      ? `${Math.floor(daysSinceLast / 30)} months ago`
      : `${Math.floor(daysSinceLast / 365)} years ago`;

  let avgDaysBetweenReleases = 0;
  if (releases.length >= 2) {
    const oldest = new Date(sorted[sorted.length - 1].publishedAt);
    const newest = new Date(sorted[0].publishedAt);
    const span = (newest.getTime() - oldest.getTime()) / (1000 * 60 * 60 * 24);
    avgDaysBetweenReleases = Math.round(span / (releases.length - 1));
  }

  return {
    totalReleases: releases.length,
    lastReleaseAgo,
    avgDaysBetweenReleases,
  };
}

export function computeLanguagePercentages(
  languages: Record<string, number>
): Array<{ name: string; percentage: number; bytes: number }> {
  const total = Object.values(languages).reduce((s, b) => s + b, 0);
  if (total === 0) return [];

  return Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: Math.round((bytes / total) * 1000) / 10,
    }));
}

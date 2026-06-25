import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export interface RepoMeta {
  full_name: string;
  name: string;
  owner: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  license: string | null;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  openIssues: number;
}

export interface CommitActivity {
  week: number; // Unix timestamp
  days: number[]; // 0=Sun .. 6=Sat
  total: number;
}

export interface Contributor {
  login: string;
  avatar: string;
  contributions: number;
  profileUrl: string;
}

export interface PullRequestStats {
  total: number;
  merged: number;
  closed: number;
  open: number;
  avgMergeTimeDays: number;
}

export interface IssueStats {
  total: number;
  open: number;
  closed: number;
  stale: number;
  avgResponseTimeDays: number;
}

export interface Release {
  tag: string;
  name: string | null;
  publishedAt: string;
  url: string;
}

export interface LanguageBreakdown {
  [language: string]: number;
}

export interface RateLimitInfo {
  remaining: number;
  limit: number;
  resetAt: string;
}

export async function fetchRepoMeta(owner: string, repo: string): Promise<RepoMeta> {
  const { data } = await octokit.rest.repos.get({ owner, repo });
  return {
    full_name: data.full_name,
    name: data.name,
    owner: data.owner.login,
    description: data.description,
    stars: data.stargazers_count,
    forks: data.forks_count,
    language: data.language,
    license: data.license?.name ?? null,
    isPrivate: data.private,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    openIssues: data.open_issues_count,
  };
}

export async function fetchCommitActivity(owner: string, repo: string): Promise<CommitActivity[]> {
  try {
    const commits = [];
    let page = 1;
    const perPage = 100;
    const maxPages = 10;
    const since = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();

    while (page <= maxPages) {
      const response = await octokit.rest.repos.listCommits({
        owner,
        repo,
        since,
        per_page: perPage,
        page,
      });

      if (!response.data || response.data.length === 0) {
        break;
      }

      commits.push(...response.data);

      if (response.data.length < perPage) {
        break;
      }
      page++;
    }

    // Start from 52 Sundays ago
    const now = new Date();
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startDate = new Date(endDate.getTime() - 52 * 7 * 86400 * 1000);
    const startDay = startDate.getDay();
    // If not Sunday, adjust to the previous Sunday
    startDate.setDate(startDate.getDate() - startDay);

    const startUnix = Math.floor(startDate.getTime() / 1000);
    const weeks: CommitActivity[] = [];
    for (let w = 0; w < 53; w++) {
      weeks.push({
        week: startUnix + w * 7 * 86400,
        days: [0, 0, 0, 0, 0, 0, 0],
        total: 0,
      });
    }

    for (const commit of commits) {
      const dateStr = commit.commit.author?.date ?? commit.commit.committer?.date;
      if (!dateStr) continue;
      const date = new Date(dateStr);
      const dateUnix = Math.floor(date.getTime() / 1000);

      const secondsFromStart = dateUnix - startUnix;
      if (secondsFromStart < 0) continue;

      const weekIndex = Math.floor(secondsFromStart / (7 * 86400));
      if (weekIndex >= 0 && weekIndex < weeks.length) {
        const dayIndex = date.getDay(); // 0=Sunday .. 6=Saturday
        weeks[weekIndex].days[dayIndex]++;
        weeks[weekIndex].total++;
      }
    }

    return weeks;
  } catch {
    return [];
  }
}

export async function fetchContributors(owner: string, repo: string): Promise<Contributor[]> {
  try {
    const { data } = await octokit.rest.repos.listContributors({
      owner,
      repo,
      per_page: 30,
    });
    return data.map((c) => ({
      login: c.login ?? "unknown",
      avatar: c.avatar_url ?? "",
      contributions: c.contributions,
      profileUrl: c.html_url ?? "",
    }));
  } catch {
    return [];
  }
}

export async function fetchPullRequestStats(owner: string, repo: string): Promise<PullRequestStats> {
  try {
    const [openRes, closedRes] = await Promise.all([
      octokit.rest.pulls.list({ owner, repo, state: "open", per_page: 1 }),
      octokit.rest.pulls.list({ owner, repo, state: "closed", per_page: 30 }),
    ]);

    const totalOpen = parseInt(String(openRes.headers["x-total"] ?? openRes.data.length));
    const closedPRs = closedRes.data;

    let totalMergeMs = 0;
    let mergedCount = 0;
    let closedCount = 0;

    for (const pr of closedPRs) {
      if (pr.merged_at) {
        mergedCount++;
        totalMergeMs +=
          new Date(pr.merged_at).getTime() - new Date(pr.created_at).getTime();
      } else {
        closedCount++;
      }
    }

    const avgMergeTimeDays =
      mergedCount > 0 ? totalMergeMs / mergedCount / (1000 * 60 * 60 * 24) : 0;

    return {
      total: totalOpen + closedPRs.length,
      merged: mergedCount,
      closed: closedCount,
      open: totalOpen,
      avgMergeTimeDays: Math.round(avgMergeTimeDays * 10) / 10,
    };
  } catch {
    return { total: 0, merged: 0, closed: 0, open: 0, avgMergeTimeDays: 0 };
  }
}

export async function fetchIssueStats(owner: string, repo: string): Promise<IssueStats> {
  try {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const [openRes, closedRes] = await Promise.all([
      octokit.rest.issues.listForRepo({ owner, repo, state: "open", per_page: 30 }),
      octokit.rest.issues.listForRepo({ owner, repo, state: "closed", per_page: 30 }),
    ]);

    // Filter out PRs (GitHub issues API returns PRs too)
    const openIssues = openRes.data.filter((i) => !i.pull_request);
    const closedIssues = closedRes.data.filter((i) => !i.pull_request);

    const stale = openIssues.filter(
      (i) => new Date(i.updated_at) < ninetyDaysAgo
    ).length;

    // Calculate avg response time from closed issues
    let totalResponseMs = 0;
    let respondedCount = 0;
    for (const issue of closedIssues) {
      if (issue.closed_at) {
        totalResponseMs +=
          new Date(issue.closed_at).getTime() - new Date(issue.created_at).getTime();
        respondedCount++;
      }
    }

    const avgResponseTimeDays =
      respondedCount > 0
        ? totalResponseMs / respondedCount / (1000 * 60 * 60 * 24)
        : 0;

    return {
      total: openIssues.length + closedIssues.length,
      open: openIssues.length,
      closed: closedIssues.length,
      stale,
      avgResponseTimeDays: Math.round(avgResponseTimeDays * 10) / 10,
    };
  } catch {
    return { total: 0, open: 0, closed: 0, stale: 0, avgResponseTimeDays: 0 };
  }
}

export async function fetchReleases(owner: string, repo: string): Promise<Release[]> {
  try {
    const { data } = await octokit.rest.repos.listReleases({ owner, repo, per_page: 10 });
    return data.map((r) => ({
      tag: r.tag_name,
      name: r.name,
      publishedAt: r.published_at ?? r.created_at,
      url: r.html_url,
    }));
  } catch {
    return [];
  }
}

export async function fetchLanguages(owner: string, repo: string): Promise<LanguageBreakdown> {
  try {
    const { data } = await octokit.rest.repos.listLanguages({ owner, repo });
    return data as LanguageBreakdown;
  } catch {
    return {};
  }
}

export async function getRateLimit(): Promise<RateLimitInfo> {
  try {
    const { data } = await octokit.rest.rateLimit.get();
    return {
      remaining: data.rate.remaining,
      limit: data.rate.limit,
      resetAt: new Date(data.rate.reset * 1000).toISOString(),
    };
  } catch {
    return { remaining: 0, limit: 5000, resetAt: new Date().toISOString() };
  }
}

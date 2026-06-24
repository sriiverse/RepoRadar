import { NextRequest, NextResponse } from "next/server";
import { parseGitHubUrl } from "@/lib/urlParser";
import { getCached, setCached } from "@/lib/cache";
import {
  fetchRepoMeta,
  fetchCommitActivity,
  fetchContributors,
  fetchPullRequestStats,
  fetchIssueStats,
  fetchReleases,
  fetchLanguages,
  getRateLimit,
} from "@/lib/github";
import { computeBusFactor } from "@/lib/busFactor";
import {
  computeHealthScore,
  computeRepoAge,
  computeReleaseCadence,
  computeLanguagePercentages,
} from "@/lib/metrics";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  const parsed = parseGitHubUrl(url);
  if (!parsed) {
    return NextResponse.json(
      { error: "Invalid GitHub URL. Try: github.com/owner/repo or owner/repo" },
      { status: 400 }
    );
  }

  const { owner, repo } = parsed;
  const cacheKey = `repo:${owner}:${repo}`;

  // Check cache first
  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json({ ...cached, cached: true });
  }

  try {
    // Parallel fetch all GitHub data
    const [meta, commitActivity, contributors, prStats, issueStats, releases, languages, rateLimit] =
      await Promise.all([
        fetchRepoMeta(owner, repo),
        fetchCommitActivity(owner, repo),
        fetchContributors(owner, repo),
        fetchPullRequestStats(owner, repo),
        fetchIssueStats(owner, repo),
        fetchReleases(owner, repo),
        fetchLanguages(owner, repo),
        getRateLimit(),
      ]);

    // Compute derived metrics
    const busFactor = computeBusFactor(contributors);
    const healthScore = computeHealthScore(
      commitActivity,
      contributors,
      prStats,
      issueStats,
      releases,
      meta,
      busFactor
    );
    const repoAge = computeRepoAge(meta.createdAt);
    const releaseCadence = computeReleaseCadence(releases);
    const languageBreakdown = computeLanguagePercentages(languages);

    const result = {
      meta,
      commitActivity,
      contributors,
      prStats,
      issueStats,
      releases,
      languageBreakdown,
      busFactor,
      healthScore,
      repoAge,
      releaseCadence,
      rateLimit,
      analyzedAt: new Date().toISOString(),
      cached: false,
    };

    // Cache for 1 hour
    setCached(cacheKey, result, 3600);

    return NextResponse.json(result);
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };

    if (error?.status === 404) {
      return NextResponse.json(
        { error: "Repository not found. Make sure it's public." },
        { status: 404 }
      );
    }
    if (error?.status === 403 || error?.message?.includes("rate limit")) {
      return NextResponse.json(
        {
          error: "GitHub API rate limit reached. Please add a GITHUB_TOKEN environment variable or try again later.",
          rateLimitError: true,
        },
        { status: 429 }
      );
    }

    console.error("Analysis error:", err);
    return NextResponse.json(
      { error: "Failed to analyze repository. Please try again." },
      { status: 500 }
    );
  }
}

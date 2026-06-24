export interface ContributorCommit {
  login: string;
  commits: number;
  percentage: number;
}

export interface BusFactorResult {
  busFactor: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  riskPercentage: number; // % of codebase lost if top N contributors leave
  contributors: ContributorCommit[];
  topContributorPercentage: number;
}

export function computeBusFactor(
  contributors: Array<{ login: string; contributions: number }>
): BusFactorResult {
  if (!contributors || contributors.length === 0) {
    return {
      busFactor: 0,
      riskLevel: "CRITICAL",
      riskPercentage: 100,
      contributors: [],
      topContributorPercentage: 100,
    };
  }

  // Sort descending by contributions
  const sorted = [...contributors].sort((a, b) => b.contributions - a.contributions);
  const totalCommits = sorted.reduce((sum, c) => sum + c.contributions, 0);

  const mapped: ContributorCommit[] = sorted.map((c) => ({
    login: c.login,
    commits: c.contributions,
    percentage: totalCommits > 0 ? (c.contributions / totalCommits) * 100 : 0,
  }));

  // Bus factor: minimum contributors whose combined commits > 50% of total
  let cumulative = 0;
  let busFactor = 0;
  for (const contributor of mapped) {
    cumulative += contributor.commits;
    busFactor++;
    if (cumulative / totalCommits > 0.5) break;
  }

  // Risk: % of codebase if top `busFactor` contributors left
  const riskPercentage = Math.round(
    (mapped.slice(0, busFactor).reduce((s, c) => s + c.commits, 0) / totalCommits) * 100
  );

  const topContributorPercentage = Math.round(mapped[0]?.percentage ?? 0);

  let riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  if (busFactor >= 5) riskLevel = "LOW";
  else if (busFactor >= 3) riskLevel = "MEDIUM";
  else if (busFactor >= 2) riskLevel = "HIGH";
  else riskLevel = "CRITICAL";

  return {
    busFactor,
    riskLevel,
    riskPercentage,
    contributors: mapped,
    topContributorPercentage,
  };
}

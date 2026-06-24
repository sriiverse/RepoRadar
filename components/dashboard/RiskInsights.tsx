"use client";

import { useRepoStore } from "@/store/repoStore";

export default function RiskInsights() {
  const { data } = useRepoStore();
  if (!data) return null;
  const { busFactor, issueStats, commitActivity } = data;

  const insights: Array<{ type: "warning" | "danger" | "ok"; text: string; sub: string }> = [];

  // High contributor concentration
  if (busFactor.topContributorPercentage > 40) {
    insights.push({
      type: "warning",
      text: "High contributor concentration",
      sub: `Top 1 contributor owns ${busFactor.topContributorPercentage}% of commits.`,
    });
  }

  // Stale issues
  if (issueStats.stale > 5) {
    insights.push({
      type: "warning",
      text: `${issueStats.stale} stale issues detected`,
      sub: "Issues with no activity for more than 90 days.",
    });
  }

  // Recent activity check (last 4 weeks)
  const recentWeeks = commitActivity.slice(-4);
  const recentCommits = recentWeeks.reduce((s, w) => s + w.total, 0);
  if (recentCommits > 10) {
    insights.push({
      type: "ok",
      text: "Active development",
      sub: `${recentCommits} commits in the last 4 weeks.`,
    });
  } else {
    insights.push({
      type: "danger",
      text: "Low recent activity",
      sub: `Only ${recentCommits} commits in the last 4 weeks.`,
    });
  }

  // Bus factor health
  if (busFactor.riskLevel === "LOW") {
    insights.push({
      type: "ok",
      text: "Healthy bus factor",
      sub: `${busFactor.busFactor} contributors needed to reach 50% codebase.`,
    });
  }

  const iconMap = {
    warning: { icon: "⚠", color: "var(--yellow)" },
    danger: { icon: "⚠", color: "var(--orange)" },
    ok: { icon: "✓", color: "var(--green)" },
  };

  return (
    <div className="glass-card bounce-card p-5 flex-1">
      <div className="cyber-label">◆ RISK INSIGHTS</div>

      <div className="space-y-3">
        {insights.map((insight, i) => {
          const cfg = iconMap[insight.type];
          return (
            <div key={i} className="flex gap-3 items-start">
              <span
                className="text-sm mt-0.5 flex-shrink-0"
                style={{ color: cfg.color }}
              >
                {cfg.icon}
              </span>
              <div>
                <div className="text-xs font-semibold" style={{ color: cfg.color }}>
                  {insight.text}
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {insight.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

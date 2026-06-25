"use client";

import { useRepoStore } from "@/store/repoStore";

export default function RiskInsights() {
  const { data } = useRepoStore();
  if (!data) return null;
  const { busFactor, commitActivity, releases } = data;

  const insights: Array<{ type: "warning" | "danger" | "ok"; text: string; sub: string }> = [];

  // Bus factor health / threshold check
  if (busFactor.busFactor < 3) {
    insights.push({
      type: "danger",
      text: "Bus Factor below recommended threshold",
      sub: `A minimum Bus Factor of 3 is recommended for stable production systems. Currently: ${busFactor.busFactor}.`,
    });
  } else {
    insights.push({
      type: "ok",
      text: "Distributed team bus factor",
      sub: `${busFactor.busFactor} core contributors own the critical knowledge base.`,
    });
  }

  // Contributor concentration percentage
  if (busFactor.topContributorPercentage > 40) {
    insights.push({
      type: "warning",
      text: `${busFactor.topContributorPercentage}% of knowledge owned by one contributor`,
      sub: `High dependency on contributor "${data.contributors[0]?.login ?? "top developer"}" for development continuity.`,
    });
  } else {
    insights.push({
      type: "ok",
      text: "Healthy contribution diversity",
      sub: `No single contributor owns more than 40% of the codebase history.`,
    });
  }

  // Recent activity check (last 4 weeks)
  const recentWeeks = commitActivity.slice(-4);
  const recentCommits = recentWeeks.reduce((s, w) => s + w.total, 0);
  if (recentCommits > 10) {
    insights.push({
      type: "ok",
      text: "Repository maintained recently",
      sub: `${recentCommits} commits logged over the past 30 days.`,
    });
  } else if (recentCommits > 0) {
    insights.push({
      type: "warning",
      text: "Slowed development velocity",
      sub: `Only ${recentCommits} commits in the last 4 weeks.`,
    });
  } else {
    insights.push({
      type: "danger",
      text: "No recent maintenance activity",
      sub: "Zero commits detected in the last 30 days.",
    });
  }

  // Release cadence check
  const releaseCount = releases?.length ?? 0;
  if (releaseCount === 0) {
    insights.push({
      type: "warning",
      text: "No releases detected",
      sub: "Repository does not publish tags or release binaries via GitHub.",
    });
  } else {
    insights.push({
      type: "ok",
      text: "Release cadence is active",
      sub: `Found ${releaseCount} active release tag(s) published.`,
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

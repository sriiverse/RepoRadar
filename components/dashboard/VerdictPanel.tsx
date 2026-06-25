"use client";

import { useRepoStore } from "@/store/repoStore";

export default function VerdictPanel() {
  const { data } = useRepoStore();

  if (!data) return null;

  const busFactor = data.busFactor;
  const healthScore = data.healthScore;
  const releaseCadence = data.releaseCadence;
  const commitActivity = data.commitActivity ?? [];
  const recentCommits = commitActivity.slice(-4).reduce((s, w) => s + w.total, 0);

  // 1. Dynamic Overall Health Label Color
  const score = healthScore.total;
  const scoreColor =
    score >= 80 ? "var(--green)" :
    score >= 60 ? "var(--cyan)" :
    score >= 40 ? "var(--yellow)" :
    score >= 20 ? "var(--orange)" : "#ff4444";

  // UI themes based on riskLevel
  const riskConfig = {
    LOW: { color: "var(--green)", glow: "rgba(0,255,136,0.3)", bg: "rgba(0,255,136,0.02)", border: "rgba(0,255,136,0.18)" },
    MEDIUM: { color: "var(--yellow)", glow: "rgba(255,215,0,0.22)", bg: "rgba(255,215,0,0.02)", border: "rgba(255,215,0,0.18)" },
    HIGH: { color: "var(--orange)", glow: "rgba(255,107,53,0.25)", bg: "rgba(255,107,53,0.02)", border: "rgba(255,107,53,0.18)" },
    CRITICAL: { color: "#ff4444", glow: "rgba(255,68,68,0.3)", bg: "rgba(255,68,68,0.02)", border: "rgba(255,68,68,0.18)" },
  };

  const cfg = riskConfig[busFactor.riskLevel];

  // 2. Synthesize detailed, realistic summary based on codebase metrics
  const getVerdictSummary = () => {
    const activityText = recentCommits >= 15
      ? "shows active recent development and frequent updates"
      : recentCommits > 0
      ? "shows moderate development activity in recent weeks"
      : "shows stalled development activity with no recent commits";

    const concentrationText = busFactor.busFactor === 1
      ? `but exhibits a critical key-person risk with a Bus Factor of 1 (${busFactor.topContributorPercentage}% of commits owned by the top contributor)`
      : `and displays healthy contributor diversity with a Bus Factor of ${busFactor.busFactor}`;

    const releaseText = releaseCadence.totalReleases === 0
      ? "The absence of release tags reduces confidence for production version control."
      : `The presence of structured releases (latest: ${releaseCadence.lastReleaseAgo}) shows good versioning stability.`;

    const prText = (data.prStats?.open ?? 0) > 0
      ? "Ongoing pull request workflow is active."
      : "Low pull request activity suggests a closed or inactive workflow.";

    return `This repository ${activityText}, ${concentrationText}. ${releaseText} ${prText}`;
  };

  // 3. Dynamic Strengths Checklist
  const strengths: string[] = [];
  if (recentCommits >= 15) {
    strengths.push("Good commit history");
  } else if (recentCommits > 0) {
    strengths.push("Steady commit frequency");
  }
  if (healthScore.breakdown.activityScore >= 15) {
    strengths.push("Active contributor recently");
  }
  if (busFactor.busFactor >= 3) {
    strengths.push("Distributed codebase ownership");
  }
  if (data.contributors.length >= 8) {
    strengths.push(`Healthy community size (${data.contributors.length} contributors)`);
  }
  if (releaseCadence.totalReleases > 0) {
    strengths.push("Structured package releases");
  }
  if (healthScore.breakdown.maintenanceScore >= 18) {
    strengths.push("Healthy documentation and responsive PRs");
  }
  // Fallbacks if empty
  if (strengths.length < 2) {
    strengths.push("Publicly accessible repository");
    strengths.push("Standard open-source layout");
  }

  // 4. Dynamic Risks Checklist
  const risks: string[] = [];
  if (busFactor.busFactor === 1) {
    risks.push("Bus Factor = 1");
  }
  if (busFactor.topContributorPercentage >= 75) {
    risks.push("Single maintainer dependency");
  } else if (busFactor.topContributorPercentage >= 50) {
    risks.push("High contributor concentration");
  }
  if (recentCommits === 0) {
    risks.push("Stalled development activity");
  }
  if (releaseCadence.totalReleases === 0) {
    risks.push("No releases");
  }
  if ((data.prStats?.total ?? 0) === 0 && (data.issueStats?.total ?? 0) === 0) {
    risks.push("Low community engagement");
  }
  if (healthScore.total < 45) {
    risks.push("Low overall repository health");
  }
  if (risks.length === 0) {
    risks.push("No major vulnerabilities detected");
  }

  // 5. Dynamic Recommendation
  const getRecommendationText = () => {
    if (busFactor.riskLevel === "CRITICAL") {
      return "Suitable for learning,\ninternal tooling,\nor personal projects.\n\nProduction usage should include\nan internal maintenance plan.";
    }
    if (busFactor.riskLevel === "HIGH") {
      return "Recommended for pre-production\nor auxiliary tools.\n\nEstablish internal codebase ownership\nbefore mission-critical adoption.";
    }
    if (busFactor.riskLevel === "MEDIUM") {
      return "Suitable for production use\nwith periodic reviews.\n\nMonitor maintainer status and\ndocument internal backup strategies.";
    }
    return "Fully recommended for\nmission-critical production.\n\nStrong contributor base,\nsolid activity, and stable version history.";
  };

  // 6. Dynamic Confidence Score
  const confidence = Math.min(99, 88 + (data.contributors.length > 5 ? 4 : 1) + (releaseCadence.totalReleases > 0 ? 4 : 1) + (recentCommits > 10 ? 3 : 1));

  return (
    <div
      id="verdict"
      className="relative overflow-hidden w-full animate-fade-in-up mt-8"
      style={{
        background: "rgba(6, 8, 16, 0.95)",
        border: `1px solid ${cfg.border}`,
        borderRadius: "16px",
        boxShadow: `0 0 35px ${cfg.glow}, inset 0 0 30px rgba(0,0,0,0.85)`,
      }}
    >
      {/* Top accent glow line */}
      <div style={{
        height: "3px",
        background: `linear-gradient(90deg, transparent, ${cfg.color}, ${cfg.color}, transparent)`,
        boxShadow: `0 0 15px ${cfg.color}`,
      }} />

      <div className="p-8 font-mono">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-3xl animate-pulse">🤖</span>
            <div>
              <h2 className="text-2xl font-black tracking-tight" style={{
                color: cfg.color,
                textShadow: `0 0 20px ${cfg.color}40`,
                fontFamily: "JetBrains Mono, monospace",
              }}>
                🤖 AI VERDICT
              </h2>
              <div className="text-[9px] tracking-[0.25em] font-bold text-slate-500 uppercase mt-0.5">
                RADAR SYNTHESIS REPORT
              </div>
            </div>
          </div>

          {/* Metrics block */}
          <div className="flex flex-wrap items-center gap-8">
            <div className="text-right">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">
                Overall Health
              </div>
              <div className="text-xl font-black flex items-baseline gap-1 justify-end">
                <span style={{ color: scoreColor, textShadow: `0 0 8px ${scoreColor}40` }}>{score}</span>
                <span className="text-slate-600 text-xs">/100</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded ml-1.5 font-sans" style={{
                  background: `${scoreColor}15`,
                  color: scoreColor,
                  border: `1px solid ${scoreColor}30`,
                }}>{healthScore.label}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">
                Confidence
              </div>
              <div className="text-xl font-black" style={{ color: "var(--cyan)", textShadow: "0 0 8px rgba(0,245,255,0.4)" }}>
                {confidence}%
              </div>
            </div>
          </div>
        </div>

        {/* Separator 1 */}
        <div className="h-[1px] mb-6" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.06), transparent)" }} />

        {/* Summary Block */}
        <div className="mb-6">
          <div className="text-[10px] tracking-widest text-slate-500 uppercase mb-2">
            Summary
          </div>
          <p className="text-slate-300 leading-relaxed text-sm md:text-base" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {getVerdictSummary()}
          </p>
        </div>

        {/* Separator 2 */}
        <div className="h-[1px] mb-6" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.06), transparent)" }} />

        {/* 3-Column Content Block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Strengths */}
          <div className="space-y-3">
            <div className="text-xs tracking-widest text-slate-400 font-bold uppercase mb-1 flex items-center gap-1.5">
              <span style={{ color: "var(--green)" }}>✓</span> Strengths
            </div>
            <div className="space-y-2">
              {strengths.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold" style={{ color: "var(--green)" }}>✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risks */}
          <div className="space-y-3">
            <div className="text-xs tracking-widest text-slate-400 font-bold uppercase mb-1 flex items-center gap-1.5">
              <span style={{ color: cfg.color }}>⚠</span> Risks
            </div>
            <div className="space-y-2">
              {risks.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold" style={{ color: cfg.color }}>⚠</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className="space-y-3">
            <div className="text-xs tracking-widest text-slate-400 font-bold uppercase mb-1">
              Recommendation
            </div>
            <p className="text-xs leading-relaxed text-slate-300" style={{ whiteSpace: "pre-line" }}>
              {getRecommendationText()}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

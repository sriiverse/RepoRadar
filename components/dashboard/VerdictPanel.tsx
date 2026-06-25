"use client";

import { useRepoStore } from "@/store/repoStore";

interface ProblemDetail {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  label: string;
  actions: string[];
  estimated_health_gain: number;
}

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

  // 2. Rule-Based Problem Detection Engine
  const getDetectedProblems = (): ProblemDetail[] => {
    const list: ProblemDetail[] = [];

    // Bus Factor Checks
    if (busFactor.busFactor === 1) {
      list.push({
        id: "LOW_BUS_FACTOR",
        severity: "critical",
        label: "Bus Factor = 1 (Critical dependency)",
        actions: [
          "Invite additional maintainers.",
          "Document critical operational knowledge.",
          "Reduce dependency on a single contributor."
        ],
        estimated_health_gain: 15,
      });
    } else if (busFactor.busFactor < 3) {
      list.push({
        id: "LOW_BUS_FACTOR_WARNING",
        severity: "high",
        label: `Low Bus Factor (Currently: ${busFactor.busFactor})`,
        actions: [
          "Cross-train contributors on key modules.",
          "Establish shared repository access."
        ],
        estimated_health_gain: 8,
      });
    }

    // Contributor Concentration
    if (busFactor.topContributorPercentage > 75) {
      list.push({
        id: "SINGLE_MAINTAINER",
        severity: "critical",
        label: "Single maintainer dependency",
        actions: [
          "Add co-maintainers to review code.",
          "Distribute master branch merge permissions."
        ],
        estimated_health_gain: 10,
      });
    } else if (busFactor.topContributorPercentage > 50) {
      list.push({
        id: "HIGH_CONCENTRATION",
        severity: "high",
        label: "High contributor concentration",
        actions: [
          "Encourage secondary authors to contribute.",
          "Delegate sub-module write rights."
        ],
        estimated_health_gain: 6,
      });
    }

    // Releases Check
    if (releaseCadence.totalReleases === 0) {
      list.push({
        id: "NO_RELEASES",
        severity: "high",
        label: "No releases detected",
        actions: [
          "Publish semantic versioned releases.",
          "Use GitHub Releases for changelogs."
        ],
        estimated_health_gain: 10,
      });
    }

    // Activity velocity Checks
    if (recentCommits === 0) {
      list.push({
        id: "NO_ACTIVITY",
        severity: "high",
        label: "Stalled development (no commits in 30d)",
        actions: [
          "Resume regular commit cycles.",
          "Audit open issues for quick fixes."
        ],
        estimated_health_gain: 12,
      });
    } else if (recentCommits < 5) {
      list.push({
        id: "LOW_ACTIVITY",
        severity: "medium",
        label: "Slowed development velocity",
        actions: [
          "Review stale branches and pull requests.",
          "Set project milestones."
        ],
        estimated_health_gain: 6,
      });
    }

    // Pull request lifecycle
    if ((data.prStats?.total ?? 0) === 0) {
      list.push({
        id: "NO_PRS",
        severity: "medium",
        label: "No pull request workflow history",
        actions: [
          "Adopt a pull-request based workflow.",
          "Setup branch protection guidelines."
        ],
        estimated_health_gain: 7,
      });
    }

    // Issue lifecycle
    if ((data.issueStats?.total ?? 0) === 0) {
      list.push({
        id: "NO_ISSUES",
        severity: "medium",
        label: "Low community engagement (Issues disabled)",
        actions: [
          "Enable GitHub Issues.",
          "Encourage community bug reports."
        ],
        estimated_health_gain: 6,
      });
    }

    // License Check
    if (!data.meta.license || data.meta.license === "None" || data.meta.license === "Unknown") {
      list.push({
        id: "NO_LICENSE",
        severity: "medium",
        label: "Missing open-source license",
        actions: [
          "Add an open-source LICENSE file (e.g. MIT, Apache 2.0)."
        ],
        estimated_health_gain: 5,
      });
    }

    // Stargazers / documentation health
    if (healthScore.breakdown.communityScore < 10) {
      list.push({
        id: "LOW_DOCUMENTATION",
        severity: "low",
        label: "Minimal project documentation",
        actions: [
          "Create a detailed README file.",
          "Add contribution guidelines (CONTRIBUTING.md)."
        ],
        estimated_health_gain: 5,
      });
    }

    // Framework specific suggestions
    const languages = data.languageBreakdown ?? [];
    const isTS = languages.some((l: { name: string }) => l.name === "TypeScript" || l.name === "JavaScript");
    const isPython = languages.some((l: { name: string }) => l.name === "Python");
    const isDocker = languages.some((l: { name: string }) => l.name === "Dockerfile" || l.name === "Docker");

    if (isTS) {
      list.push({
        id: "TECH_TS",
        severity: "low",
        label: "TypeScript/JavaScript environment configuration",
        actions: [
          "Enable Dependabot for secure npm audit scans.",
          "Add ESLint + Prettier validation checks in CI."
        ],
        estimated_health_gain: 3,
      });
    }
    if (isPython) {
      list.push({
        id: "TECH_PYTHON",
        severity: "low",
        label: "Python environment configuration",
        actions: [
          "Configure Ruff/Flake8 style checking.",
          "Add automated pytest runner in GitHub Actions."
        ],
        estimated_health_gain: 3,
      });
    }
    if (isDocker) {
      list.push({
        id: "TECH_DOCKER",
        severity: "low",
        label: "Docker containerization environment",
        actions: [
          "Optimize multi-stage Docker build layers.",
          "Scan container images with Trivy in CI."
        ],
        estimated_health_gain: 3,
      });
    }

    return list;
  };

  const detectedProblems = getDetectedProblems();

  // 3. Sort Problems by Severity
  const severityRank = { critical: 4, high: 3, medium: 2, low: 1 };
  const sortedProblems = [...detectedProblems].sort((a, b) => severityRank[b.severity] - severityRank[a.severity]);

  // Extract Top 5 unique recommendations
  const nextActions: string[] = [];
  let calculatedGain = 0;

  for (const prob of sortedProblems) {
    if (nextActions.length >= 5) break;
    for (const act of prob.actions) {
      if (nextActions.length < 5 && !nextActions.includes(act)) {
        nextActions.push(act);
      }
    }
    calculatedGain += prob.estimated_health_gain;
  }

  // Fallback for ideal projects
  if (nextActions.length === 0) {
    nextActions.push("Continue current release cadence.");
    nextActions.push("Maintain contributor onboarding guidelines.");
    nextActions.push("Monitor dependency security updates monthly.");
  }

  const targetScore = Math.min(99, score + calculatedGain);

  // 4. Skimmable Summary Block Generator
  const getVerdictSummaryParagraphs = () => {
    const paragraphs = [];

    // Paragraph 1: Activity
    if (recentCommits >= 15) {
      paragraphs.push(`Development activity is robust and active, with ${recentCommits} commits detected over the last 30 days.`);
    } else if (recentCommits > 0) {
      paragraphs.push(`Development activity shows moderate velocity, with ${recentCommits} commits detected recently.`);
    } else {
      paragraphs.push("Development activity appears stalled, with no recent commits detected over the past month.");
    }

    // Paragraph 2: Bus factor & Concentration
    if (busFactor.busFactor === 1) {
      paragraphs.push(`The project exhibits a critical key-person dependency (Bus Factor = 1), meaning that codebase knowledge is concentrated in a single contributor (${busFactor.topContributorPercentage}% ownership).`);
    } else if (busFactor.busFactor <= 2) {
      paragraphs.push(`The codebase shows a highly concentrated contributor hierarchy (Bus Factor = ${busFactor.busFactor}), which increases operational risks if core developers become inactive.`);
    } else {
      paragraphs.push(`The project is backed by a resilient contributor team with a Bus Factor of ${busFactor.busFactor}, distributing technical knowledge safely.`);
    }

    // Paragraph 3: Releases & PR lifecycle
    if (releaseCadence.totalReleases === 0) {
      paragraphs.push("The complete absence of tagged releases and structured pull request versions reduces operational confidence for mission-critical production adoption.");
    } else {
      paragraphs.push(`The presence of structured version tags (${releaseCadence.totalReleases} releases) and pull request merge procedures supports stable package management.`);
    }

    return paragraphs;
  };

  // 4.5 Dynamic Strengths Checklist
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
  if (strengths.length < 2) {
    strengths.push("Publicly accessible repository");
    strengths.push("Standard open-source layout");
  }

  // 5. Dynamic Recommended Environment Mappings
  let recommendedUses = ["Learning & Exploration", "Personal Projects", "Internal Tooling"];
  let notRecommendedUses = ["Production Environments", "Mission-Critical Systems"];

  if (busFactor.riskLevel === "LOW") {
    recommendedUses = ["Mission-Critical Production", "Enterprise Applications", "High-Availability Systems"];
    notRecommendedUses = ["No major environment exclusions detected"];
  } else if (busFactor.riskLevel === "MEDIUM") {
    recommendedUses = ["Standard Production Use", "Internal Operations", "General Deployments"];
    notRecommendedUses = ["Ultra High-Reliability Systems (without internal audits)"];
  } else if (busFactor.riskLevel === "HIGH") {
    recommendedUses = ["Pre-production Testing", "Developer Sandboxes", "Secondary Tooling"];
    notRecommendedUses = ["Core Production Dependency", "Mission-Critical Systems"];
  }

  // 6. Dynamic Narrative Repository Timeline Generator
  const getTimelineEvents = () => {
    const events: Array<{ dateStr: string; label: string; icon: string; bar?: string }> = [];

    // Created event
    const createdDate = new Date(data.meta.createdAt);
    const createdMonthStr = createdDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    events.push({
      dateStr: createdMonthStr,
      label: "Repository Created",
      icon: "✓",
    });

    // Group commits by month
    const monthlyCommits: { [key: string]: { total: number; weeks: Array<{ week: number; days: number[]; total: number }> } } = {};
    for (const week of commitActivity) {
      const date = new Date(week.week * 1000);
      const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      if (!monthlyCommits[monthKey]) {
        monthlyCommits[monthKey] = { total: 0, weeks: [] };
      }
      monthlyCommits[monthKey].total += week.total;
      monthlyCommits[monthKey].weeks.push(week);
    }

    const monthKeys = Object.keys(monthlyCommits).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });

    // Find peak activity month
    let peakMonth = "";
    let peakCount = 0;
    for (const mKey of monthKeys) {
      if (monthlyCommits[mKey].total > peakCount) {
        peakCount = monthlyCommits[mKey].total;
        peakMonth = mKey;
      }
    }

    if (peakMonth && peakMonth !== createdMonthStr && peakCount > 0) {
      const barLength = Math.min(10, Math.max(2, Math.round((peakCount / 150) * 10)));
      events.push({
        dateStr: peakMonth,
        label: "Peak Activity Month",
        icon: "⚡",
        bar: "█".repeat(barLength) + "░".repeat(10 - barLength),
      });
    }

    // Release Milestone Check (midway point)
    const midIndex = Math.floor(monthKeys.length / 2);
    const midMonth = monthKeys[midIndex];
    if (midMonth && midMonth !== createdMonthStr && midMonth !== peakMonth) {
      if (releaseCadence.totalReleases === 0) {
        events.push({
          dateStr: midMonth,
          label: "Releases Pending",
          icon: "⚠",
        });
      } else {
        events.push({
          dateStr: midMonth,
          label: `Active Releases Published`,
          icon: "✓",
        });
      }
    }

    // Contributor concentration shift
    const recentMonthKey = monthKeys[monthKeys.length - 2];
    if (recentMonthKey && recentMonthKey !== createdMonthStr && recentMonthKey !== peakMonth && recentMonthKey !== midMonth) {
      if (busFactor.topContributorPercentage > 75) {
        events.push({
          dateStr: recentMonthKey,
          label: "Single Developer Dominance",
          icon: "⚠⚠",
        });
      } else {
        events.push({
          dateStr: recentMonthKey,
          label: "Contributor Diversity Stable",
          icon: "✓",
        });
      }
    }

    // Current State
    events.push({
      dateStr: "Current",
      label: busFactor.riskLevel === "CRITICAL"
        ? "Critical Maintainer Risk"
        : busFactor.riskLevel === "HIGH"
        ? "High Contributor Concentration"
        : busFactor.riskLevel === "MEDIUM"
        ? "Moderate Maintenance Exposure"
        : "Healthy Repository Autonomy",
      icon: busFactor.riskLevel === "CRITICAL" || busFactor.riskLevel === "HIGH" ? "🔴" : busFactor.riskLevel === "MEDIUM" ? "🟠" : "🟢",
    });

    // Dedup events by dateStr to prevent layout conflicts
    const seen = new Set();
    const uniqueEvents = [];
    for (const ev of events) {
      if (!seen.has(ev.dateStr)) {
        seen.add(ev.dateStr);
        uniqueEvents.push(ev);
      }
    }

    return uniqueEvents.slice(0, 5);
  };

  const timelineEvents = getTimelineEvents();
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
              <h2 className="text-2xl font-black tracking-tight animate-pulse-glow" style={{
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

          {/* Meters block */}
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

        {/* Summary Block (3 paragraphs layout) */}
        <div className="mb-6">
          <div className="text-[10px] tracking-widest text-slate-500 uppercase mb-2">
            Summary
          </div>
          <div className="text-slate-300 leading-relaxed text-sm md:text-base space-y-3" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {getVerdictSummaryParagraphs().map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </div>

        {/* Separator 2 */}
        <div className="h-[1px] mb-6" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.06), transparent)" }} />

        {/* 3-Column Content Block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Strengths */}
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

          {/* Column 2: Risks (Sorted by Severity) */}
          <div className="space-y-3">
            <div className="text-xs tracking-widest text-slate-400 font-bold uppercase mb-1 flex items-center gap-1.5">
              <span style={{ color: cfg.color }}>⚠</span> Risks
            </div>
            <div className="space-y-2">
              {sortedProblems.map((prob, i) => {
                const icon = prob.severity === "critical" ? "🔴" : prob.severity === "high" ? "🟠" : "🟡";
                return (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold">{icon}</span>
                    <span>{prob.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 3: Recommendation (Visually Split) */}
          <div className="space-y-4">
            <div className="text-xs tracking-widest text-slate-400 font-bold uppercase mb-1">
              Recommendation
            </div>
            
            {/* Recommended block */}
            <div className="space-y-1.5 p-3 rounded-lg" style={{ background: "rgba(0,255,136,0.02)", border: "1px solid rgba(0,255,136,0.08)" }}>
              <div className="text-xs font-bold text-green-400 flex items-center gap-1.5 mb-1">
                <span>✓</span> Recommended For
              </div>
              <ul className="text-[11px] space-y-1 text-slate-300 pl-4 list-disc">
                {recommendedUses.map((use, i) => (
                  <li key={i}>{use}</li>
                ))}
              </ul>
            </div>

            {/* Not Recommended block */}
            <div className="space-y-1.5 p-3 rounded-lg" style={{ background: "rgba(255,68,68,0.02)", border: "1px solid rgba(255,68,68,0.08)" }}>
              <div className="text-xs font-bold text-red-400 flex items-center gap-1.5 mb-1">
                <span>✕</span> Not Recommended
              </div>
              <ul className="text-[11px] space-y-1 text-slate-300 pl-4 list-disc">
                {notRecommendedUses.map((use, i) => (
                  <li key={i}>{use}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Separator: Repository Timeline */}
        <div className="h-[1px] my-6" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.06), transparent)" }} />
        
        <div className="space-y-4">
          <div className="text-xs tracking-widest text-slate-400 font-bold uppercase">
            📅 REPOSITORY TIMELINE
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
            {/* Horizontal line for connecting dots (hidden on mobile) */}
            <div className="hidden sm:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-slate-800 z-0" />
            
            {timelineEvents.map((ev, i) => (
              <div key={i} className="flex flex-col items-center text-center relative z-10 p-3 rounded-xl" style={{
                background: "rgba(0,0,0,0.2)",
                border: "1px solid rgba(255,255,255,0.03)",
              }}>
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">
                  {ev.dateStr}
                </div>
                
                {/* Timeline node icon */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center mb-2 font-bold" style={{
                  background: ev.icon === "🔴" ? "rgba(255,68,68,0.15)" : ev.icon === "🟠" ? "rgba(255,107,53,0.15)" : ev.icon === "🟢" || ev.icon === "✓" ? "rgba(0,255,136,0.15)" : "rgba(0,245,255,0.15)",
                  border: `1px solid ${ev.icon === "🔴" ? "#ff4444" : ev.icon === "🟠" ? "var(--orange)" : ev.icon === "🟢" || ev.icon === "✓" ? "var(--green)" : "var(--cyan)"}`,
                  color: ev.icon === "🔴" ? "#ff4444" : ev.icon === "🟠" ? "var(--orange)" : ev.icon === "🟢" || ev.icon === "✓" ? "var(--green)" : "var(--cyan)",
                  boxShadow: `0 0 10px ${ev.icon === "🔴" ? "rgba(255,68,68,0.2)" : ev.icon === "🟠" ? "rgba(255,107,53,0.2)" : ev.icon === "🟢" || ev.icon === "✓" ? "rgba(0,255,136,0.2)" : "rgba(0,245,255,0.2)"}`,
                }}>
                  {ev.icon}
                </div>

                <div className="text-[10px] text-slate-200 font-semibold leading-relaxed">
                  {ev.label}
                </div>
                
                {ev.bar && (
                  <div className="text-[9px] font-mono mt-1" style={{ color: "var(--cyan)" }}>
                    {ev.bar}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Separator 3: Next Actions */}
        {nextActions.length > 0 && (
          <>
            <div className="h-[1px] my-6" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.06), transparent)" }} />
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left/Center: Actions list */}
              <div className="md:col-span-8 space-y-3">
                <div className="text-xs tracking-widest text-slate-400 font-bold uppercase mb-1">
                  NEXT ACTIONS
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                  {nextActions.map((act, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <span className="font-bold text-green-400" style={{ color: "var(--green)" }}>✓</span>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Estimated Health Increase */}
              <div className="md:col-span-4 p-4 rounded-xl flex items-center justify-between" style={{
                background: "rgba(0,245,255,0.03)",
                border: "1px solid rgba(0,245,255,0.08)",
              }}>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
                    Estimated Health Increase
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-xl font-bold text-slate-400">{score}</span>
                    <span className="text-slate-600 text-xs">→</span>
                    <span className="text-2xl font-black" style={{ color: "var(--green)", textShadow: "0 0 10px rgba(0,255,136,0.4)" }}>
                      {targetScore}
                    </span>
                  </div>
                </div>
                
                {/* Visual change indicator */}
                <div className="text-xs font-bold font-mono text-right" style={{ color: "var(--green)" }}>
                  <div>Potential +{targetScore - score} pts</div>
                  <div className="text-[9px] text-slate-500 font-normal">if recommendations are followed</div>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

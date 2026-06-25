"use client";

import { useState } from "react";
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
  const [showConfidenceDetail, setShowConfidenceDetail] = useState(false);

  if (!data) return null;

  const busFactor = data.busFactor;
  const healthScore = data.healthScore;
  const releaseCadence = data.releaseCadence;
  const commitActivity = data.commitActivity ?? [];
  const recentCommits = commitActivity.slice(-4).reduce((s, w) => s + w.total, 0);

  // 1. Dynamic Overall Health Label Color
  const score = healthScore.total;

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
  const severityRank: { [key: string]: number } = { critical: 4, high: 3, medium: 2, low: 1 };
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

  // 3.5 Interactive Risk Anchoring Navigation
  const handleRiskClick = (probId: string) => {
    let targetId = "";
    if (probId.includes("BUS") || probId.includes("MAINTAINER") || probId.includes("CONCENTRATION")) {
      targetId = "survival-analysis-card";
      if (!document.getElementById(targetId)) {
        targetId = "contributors";
      }
    } else if (probId.includes("RELEASE")) {
      targetId = "releases";
    } else if (probId.includes("ACTIVITY") || probId.includes("DEVELOPMENT")) {
      targetId = "activity-trend-card";
      if (!document.getElementById(targetId)) {
        targetId = "commits";
      }
    } else if (probId.includes("PR") || probId.includes("ISSUES") || probId.includes("WORKFLOW")) {
      targetId = "pullrequests";
    } else if (probId.includes("LICENSE") || probId.includes("DOCUMENTATION")) {
      targetId = "health-score-card";
      if (!document.getElementById(targetId)) {
        targetId = "health";
      }
    } else if (probId.includes("TECH")) {
      targetId = "languages";
    }
    
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        const originalStyle = el.getAttribute("style") || "";
        
        // Dynamic cyan neon pulse ring focus flash
        el.style.transition = "outline 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease";
        el.style.outline = "2.5px solid var(--cyan)";
        el.style.boxShadow = "0 0 35px rgba(0, 245, 255, 0.55)";
        el.style.transform = "scale(1.025)";
        
        setTimeout(() => {
          el.style.outline = "none";
          el.style.transform = "none";
          el.setAttribute("style", originalStyle);
        }, 1500);
      }
    }
  };

  // 3.6 Confidence Reason Matrix
  const getConfidenceFactors = () => {
    const basedOn: string[] = ["Repository metadata"];
    const missing: string[] = [];

    if (commitActivity.length > 0) {
      basedOn.push("Commit history");
    } else {
      missing.push("Commit history");
    }

    if (data.contributors.length > 0) {
      basedOn.push("Contributor graph");
    } else {
      missing.push("Contributor graph");
    }

    if (releaseCadence.totalReleases > 0) {
      basedOn.push("Release history");
    } else {
      missing.push("Release history");
    }

    if (data.prStats && data.prStats.total > 0) {
      basedOn.push("Pull Requests");
    } else {
      missing.push("Pull Requests");
    }

    if (data.issueStats && data.issueStats.total > 0) {
      basedOn.push("Issue discussions");
    } else {
      missing.push("Issue discussions");
    }

    const hasDocker = data.languageBreakdown?.some(l => l.name === "Dockerfile" || l.name === "Docker") ?? false;
    if (hasDocker || releaseCadence.totalReleases > 0) {
      basedOn.push("CI/CD configuration");
    } else {
      missing.push("CI/CD configuration");
    }

    return { basedOn, missing };
  };

  // 3.7 Top Positive Signal Section
  const getTopPositiveSignal = () => {
    const signals = [];
    
    if (releaseCadence.totalReleases > 10) {
      signals.push({
        title: "Strong Release Cadence",
        desc: `The repository has ${releaseCadence.totalReleases} releases published, demonstrating active versioning and tag lifecycle operations.`,
        icon: "📦"
      });
    }
    
    if (data.contributors.length >= 8 && busFactor.busFactor >= 3) {
      signals.push({
        title: "Distributed Contributor Ownership",
        desc: `Backed by ${data.contributors.length} active contributors with a healthy Bus Factor of ${busFactor.busFactor}, reducing key-person exposure.`,
        icon: "👥"
      });
    }
    
    if (data.prStats && data.prStats.merged > 10 && data.prStats.avgMergeTimeDays < 4) {
      signals.push({
        title: "Responsive Pull Requests",
        desc: `Merged ${data.prStats.merged} pull requests recently with an average review cycle of only ${data.prStats.avgMergeTimeDays.toFixed(1)} days.`,
        icon: "⚡"
      });
    }
    
    if (recentCommits >= 20) {
      signals.push({
        title: "High Commit Velocity",
        desc: `Extremely active developer momentum with ${recentCommits} commits submitted over the past 30 days.`,
        icon: "🔥"
      });
    }
    
    if (data.meta.stars >= 50) {
      signals.push({
        title: "Active Developer Interest",
        desc: `Acquired interest from ${data.meta.stars} stargazers, indicating a valuable and recognized open-source codebase.`,
        icon: "⭐"
      });
    }
    
    if (healthScore.breakdown.maintenanceScore >= 16) {
      signals.push({
        title: "Pristine Documentation",
        desc: "Maintains a clean and structured layout with comprehensive documentation and responsive pull request gates.",
        icon: "🛡️"
      });
    }

    if (signals.length === 0) {
      signals.push({
        title: "Public Open-Source Access",
        desc: "The codebase is public, standard-structured, and available for developer exploration, cloning, or customization.",
        icon: "📖"
      });
    }

    return signals[0];
  };

  // 3.8 Suitability Scoreboard
  const getSuitabilityRatings = () => {
    const learning = score >= 40 ? 5 : score >= 20 ? 4 : 3;
    
    let openSource = 3;
    if (data.prStats && data.prStats.total > 0 && data.contributors.length >= 5) openSource = 5;
    else if (data.contributors.length >= 3) openSource = 4;
    else if (data.contributors.length === 1) openSource = 2;
    
    let internalTool = 4;
    if (busFactor.riskLevel === "CRITICAL") internalTool = 2;
    else if (busFactor.riskLevel === "HIGH") internalTool = 3;
    else if (score > 75) internalTool = 5;

    let production = 4;
    if (busFactor.riskLevel === "CRITICAL") production = 1;
    else if (busFactor.riskLevel === "HIGH") production = 2;
    else if (busFactor.riskLevel === "MEDIUM") production = 3;
    else if (score < 50) production = 2;

    let missionCritical = 3;
    if (busFactor.riskLevel === "CRITICAL" || busFactor.riskLevel === "HIGH") missionCritical = 1;
    else if (busFactor.riskLevel === "MEDIUM") missionCritical = 2;
    else if (score > 80 && busFactor.riskLevel === "LOW") missionCritical = 5;
    else if (score > 60) missionCritical = 4;

    return [
      { name: "Learning & Exploration", rating: learning },
      { name: "Open Source Contribution", rating: openSource },
      { name: "Internal Tooling", rating: internalTool },
      { name: "Production Dependency", rating: production },
      { name: "Mission-Critical Systems", rating: missionCritical },
    ];
  };

  // 3.9 Expected Effort Estimation & Typewriter Shaded Progress
  const getEstimatedEffort = () => {
    const actionsStr = nextActions.join(" ");
    if (actionsStr.includes("maintainer") || actionsStr.includes("Bus Factor")) {
      return "≈ 2–4 weeks (Developer onboarding & training)";
    }
    if (actionsStr.includes("releases") || actionsStr.includes("workflow") || actionsStr.includes("Issues")) {
      return "≈ 1–2 weeks (CI/CD and workflow deployment)";
    }
    return "≈ 1–3 days (Configuration tweaks & documentation)";
  };

  const getProgressBar = (current: number, target: number) => {
    const segments = 10;
    const currentFilled = Math.min(segments, Math.max(0, Math.round((current / 100) * segments)));
    const targetFilled = Math.min(segments, Math.max(0, Math.round((target / 100) * segments)));
    
    let barStr = "";
    for (let i = 0; i < segments; i++) {
      if (i < currentFilled) {
        barStr += "█";
      } else if (i < targetFilled) {
        barStr += "▒";
      } else {
        barStr += "░";
      }
    }
    return `[${barStr}]`;
  };

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
    const events: Array<{ date: Date; dateStr: string; label: string; icon: string; bar?: string }> = [];

    // Created event
    const createdDate = new Date(data.meta.createdAt);
    const createdMonthStr = createdDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    events.push({
      date: createdDate,
      dateStr: createdMonthStr,
      label: "Repository Created",
      icon: "🌱",
    });

    // Releases Check
    if (data.releases && data.releases.length > 0) {
      const firstRelease = data.releases[data.releases.length - 1];
      const firstRelDate = new Date(firstRelease.publishedAt);
      events.push({
        date: firstRelDate,
        dateStr: firstRelDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        label: `First Release: ${firstRelease.tag}`,
        icon: "📦",
      });

      if (data.releases.length > 1) {
        const latestRelease = data.releases[0];
        const latestRelDate = new Date(latestRelease.publishedAt);
        if (latestRelDate.getTime() - firstRelDate.getTime() > 30 * 24 * 3600 * 1000) {
          events.push({
            date: latestRelDate,
            dateStr: latestRelDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
            label: `Latest Release: ${latestRelease.tag}`,
            icon: "🚀",
          });
        }
      }
    }

    // Peak commit activity
    const monthlyCommits: { [key: string]: { total: number; weeks: Array<{ week: number; days: number[]; total: number }>; date: Date } } = {};
    for (const week of commitActivity) {
      const date = new Date(week.week * 1000);
      const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      if (!monthlyCommits[monthKey]) {
        monthlyCommits[monthKey] = { total: 0, weeks: [], date };
      }
      monthlyCommits[monthKey].total += week.total;
      monthlyCommits[monthKey].weeks.push(week);
    }

    const monthKeys = Object.keys(monthlyCommits);
    let peakMonthKey = "";
    let peakCount = 0;
    for (const mKey of monthKeys) {
      if (monthlyCommits[mKey].total > peakCount) {
        peakCount = monthlyCommits[mKey].total;
        peakMonthKey = mKey;
      }
    }

    if (peakMonthKey && peakCount > 0) {
      const barLength = Math.min(10, Math.max(2, Math.round((peakCount / 150) * 10)));
      events.push({
        date: monthlyCommits[peakMonthKey].date,
        dateStr: peakMonthKey,
        label: `Peak Commit Activity`,
        icon: "⚡",
        bar: "█".repeat(barLength) + "░".repeat(10 - barLength),
      });
    }

    // Community / Stars Milestone
    const midTime = new Date((createdDate.getTime() + Date.now()) / 2);
    if (data.meta.stars >= 50) {
      events.push({
        date: midTime,
        dateStr: "Growth",
        label: `Passed ${data.meta.stars} Stars`,
        icon: "⭐",
      });
    } else if (data.contributors.length >= 5) {
      events.push({
        date: midTime,
        dateStr: "Team",
        label: `Grew to ${data.contributors.length} Authors`,
        icon: "👥",
      });
    }

    // Current State
    events.push({
      date: new Date(),
      dateStr: "Current",
      label: busFactor.riskLevel === "CRITICAL"
        ? "Critical Maintainer Risk"
        : busFactor.riskLevel === "HIGH"
        ? "High Contributor Concentration"
        : busFactor.riskLevel === "MEDIUM"
        ? "Moderate Maintenance Exposure"
        : "Healthy Distributed Ownership",
      icon: busFactor.riskLevel === "CRITICAL" || busFactor.riskLevel === "HIGH" ? "🔴" : busFactor.riskLevel === "MEDIUM" ? "🟠" : "🟢",
    });

    // Dedup events, sort chronologically
    const seen = new Set();
    const uniqueEvents = [];
    const sorted = events.sort((a, b) => a.date.getTime() - b.date.getTime());
    for (const ev of sorted) {
      const key = ev.dateStr + "_" + ev.label.slice(0, 8);
      if (!seen.has(key)) {
        seen.add(key);
        uniqueEvents.push(ev);
      }
    }

    return uniqueEvents.slice(0, 5);
  };
  const timelineEvents = getTimelineEvents();
  const confidence = Math.min(99, 88 + (data.contributors.length > 5 ? 4 : 1) + (releaseCadence.totalReleases > 0 ? 4 : 1) + (recentCommits > 10 ? 3 : 1));
  const confidenceFactors = getConfidenceFactors();
  const suitabilityRatings = getSuitabilityRatings();
  const bestSignal = getTopPositiveSignal();
  const estimatedEffort = getEstimatedEffort();

  const renderStars = (rating: number) => {
    return (
      <span className="text-sm tracking-widest select-none" style={{ color: "var(--yellow)", textShadow: "0 0 5px rgba(255,215,0,0.3)" }}>
        {"★".repeat(rating)}
        <span className="text-slate-800">{"☆".repeat(5 - rating)}</span>
      </span>
    );
  };

  return (
    <div
      id="verdict"
      className="relative overflow-hidden w-full animate-fade-in-up mt-8"
      style={{
        background: "rgba(6, 8, 16, 0.96)",
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

      <div className="p-8 font-mono relative">
        
        {/* Document Header Line */}
        <div style={{ borderTop: "3px double rgba(255,255,255,0.12)", margin: "0 0 20px 0" }} />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <h2 className="text-xl font-black tracking-tight" style={{
              color: "var(--cyan)",
              textShadow: "0 0 15px rgba(0,245,255,0.25)",
              fontFamily: "JetBrains Mono, monospace",
            }}>
              ⚙️ REPOSITORY ASSESSMENT REPORT
            </h2>
            <div className="text-[9px] tracking-[0.25em] font-bold text-slate-500 uppercase mt-1">
              AUDIT REF: {data.meta.name.toUpperCase()}-{data.meta.createdAt.slice(0, 4)}-VERDICT
            </div>
          </div>

          {/* Typewriter metadata blocks */}
          <div className="flex flex-wrap items-center gap-6 text-xs">
            <div className="flex items-center gap-2 p-1.5 rounded border border-slate-900 bg-slate-950/60">
              <span className="text-slate-500">STATUS:</span>
              <span style={{ color: cfg.color }} className="font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="animate-pulse">{busFactor.riskLevel === "CRITICAL" || busFactor.riskLevel === "HIGH" ? "🔴" : busFactor.riskLevel === "MEDIUM" ? "🟠" : "🟢"}</span>
                {busFactor.riskLevel} RISK
              </span>
            </div>

            {/* Clickable/Hoverable Confidence Cell */}
            <div 
              className="relative flex items-center gap-2 p-1.5 rounded border border-slate-900 bg-slate-950/60 cursor-help transition-all hover:border-slate-800"
              onClick={() => setShowConfidenceDetail(!showConfidenceDetail)}
              onMouseEnter={() => setShowConfidenceDetail(true)}
              onMouseLeave={() => setShowConfidenceDetail(false)}
            >
              <span className="text-slate-500">CONFIDENCE:</span>
              <span className="font-bold text-cyan-400 text-shadow-cyan">{confidence}%</span>
              
              {/* Confidence Details Matrix Popover */}
              {showConfidenceDetail && (
                <div className="absolute right-0 top-full mt-2.5 z-50 p-4 rounded-xl text-left bg-slate-950/98 border border-slate-800 shadow-2xl font-mono text-xs w-[280px]">
                  <div className="font-bold text-cyan-400 mb-2 flex items-center gap-1.5">
                    <span>🔬</span>
                    <span>Confidence Score Matrix</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-[9px] text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-1 mb-1 font-semibold">Verified Telemetry</div>
                      {confidenceFactors.basedOn.map((f, idx) => (
                        <div key={idx} className="text-emerald-400 flex items-center gap-1.5 py-0.5">
                          <span className="font-bold">✓</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                    {confidenceFactors.missing.length > 0 && (
                      <div>
                        <div className="text-[9px] text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-1 mb-1 font-semibold">Missing Checkpoints</div>
                        {confidenceFactors.missing.map((f, idx) => (
                          <div key={idx} className="text-slate-500 flex items-center gap-1.5 py-0.5">
                            <span className="font-semibold">•</span>
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ borderTop: "3px double rgba(255,255,255,0.12)", margin: "0 0 24px 0" }} />

        {/* 2-Column Grid splitting Summary & Evaluation metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Left Column: Summary + Best Signal (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="text-[10px] tracking-widest text-slate-500 uppercase mb-2">
                Executive Summary
              </div>
              <div className="text-slate-300 leading-relaxed text-sm space-y-3 font-sans">
                {getVerdictSummaryParagraphs().map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>

            {/* Standout Positive Signal block */}
            <div className="p-4 rounded-xl border border-yellow-500/15" style={{ background: "rgba(255,215,0,0.02)" }}>
              <div className="flex items-center gap-2 text-xs font-bold text-yellow-400 uppercase tracking-widest mb-1.5">
                <span>🏆</span>
                <span>Standout Signal: {bestSignal.title}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{bestSignal.desc}</p>
            </div>
          </div>

          {/* Right Column: Would I Use This Ratings (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Rating Board */}
            <div className="p-5 rounded-xl border border-slate-900 bg-slate-950/40">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-900 pb-2">
                👥 RepoRadar Recommendation Ratings
              </div>
              <div className="space-y-3 font-sans">
                {suitabilityRatings.map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{r.name}</span>
                    <div className="flex items-center gap-2">
                      {renderStars(r.rating)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Separator 3 */}
        <div className="h-[1px] mb-6" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.06), transparent)" }} />

        {/* 3-Column Content Block (Strengths, Risks, Target Settings) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Strengths */}
          <div className="space-y-3">
            <div className="text-xs tracking-widest text-slate-400 font-bold uppercase mb-1 flex items-center gap-1.5">
              <span style={{ color: "var(--green)" }}>✓</span> Strengths
            </div>
            <div className="space-y-2">
              {strengths.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed font-sans">
                  <span className="font-bold" style={{ color: "var(--green)" }}>✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risks (Sorted by Severity, interactive scroll clicks) */}
          <div className="space-y-3">
            <div className="text-xs tracking-widest text-slate-400 font-bold uppercase mb-1 flex items-center gap-1.5">
              <span style={{ color: cfg.color }}>⚠</span> Risks
            </div>
            <div className="space-y-2">
              {sortedProblems.map((prob, i) => {
                const icon = prob.severity === "critical" ? "🔴" : prob.severity === "high" ? "🟠" : prob.severity === "medium" ? "🟡" : "🔵";
                return (
                  <div 
                    key={i} 
                    onClick={() => handleRiskClick(prob.id)}
                    title="Click to locate on dashboard"
                    className="flex items-center justify-between p-1.5 rounded hover:bg-slate-900/60 cursor-pointer transition-all group font-sans"
                  >
                    <div className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                      <span>{icon}</span>
                      <span className="group-hover:text-cyan transition-colors">{prob.label}</span>
                    </div>
                    <span 
                      className="text-[8px] uppercase px-1 py-0.5 rounded font-bold tracking-widest select-none ml-2 shrink-0 border"
                      style={{
                        background: prob.severity === "critical" ? "rgba(255,68,68,0.06)" : prob.severity === "high" ? "rgba(255,107,53,0.06)" : prob.severity === "medium" ? "rgba(255,215,0,0.06)" : "rgba(0,245,255,0.06)",
                        color: prob.severity === "critical" ? "#ff4444" : prob.severity === "high" ? "var(--orange)" : prob.severity === "medium" ? "var(--yellow)" : "var(--cyan)",
                        borderColor: prob.severity === "critical" ? "rgba(255,68,68,0.2)" : prob.severity === "high" ? "rgba(255,107,53,0.2)" : prob.severity === "medium" ? "rgba(255,215,0,0.2)" : "rgba(0,245,255,0.2)"
                      }}
                    >
                      {prob.severity}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendations split list */}
          <div className="space-y-4">
            <div className="text-xs tracking-widest text-slate-400 font-bold uppercase mb-1">
              Environment Exclusions
            </div>
            
            {/* Recommended block */}
            <div className="space-y-1.5 p-3 rounded-lg" style={{ background: "rgba(0,255,136,0.02)", border: "1px solid rgba(0,255,136,0.08)" }}>
              <div className="text-[10px] font-bold text-green-400 flex items-center gap-1.5 mb-1 uppercase tracking-wider">
                <span>✓</span> Recommended Environment
              </div>
              <ul className="text-[11px] space-y-1 text-slate-300 pl-4 list-disc font-sans">
                {recommendedUses.map((use, i) => (
                  <li key={i}>{use}</li>
                ))}
              </ul>
            </div>

            {/* Not Recommended block */}
            <div className="space-y-1.5 p-3 rounded-lg" style={{ background: "rgba(255,68,68,0.02)", border: "1px solid rgba(255,68,68,0.08)" }}>
              <div className="text-[10px] font-bold text-red-400 flex items-center gap-1.5 mb-1 uppercase tracking-wider">
                <span>✕</span> Excluded Environment
              </div>
              <ul className="text-[11px] space-y-1 text-slate-300 pl-4 list-disc font-sans">
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
            📅 DYNAMIC REPOSITORY TIMELINE
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
            <div className="hidden sm:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-slate-800 z-0" />
            
            {timelineEvents.map((ev, i) => (
              <div key={i} className="flex flex-col items-center text-center relative z-10 p-3 rounded-xl" style={{
                background: "rgba(0,0,0,0.25)",
                border: "1px solid rgba(255,255,255,0.03)",
              }}>
                <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">
                  {ev.dateStr}
                </div>
                
                {/* Timeline node icon */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center mb-2 font-bold" style={{
                  background: ev.icon === "🔴" ? "rgba(255,68,68,0.12)" : ev.icon === "🟠" ? "rgba(255,107,53,0.12)" : ev.icon === "🟢" || ev.icon === "✓" ? "rgba(0,255,136,0.12)" : "rgba(0,245,255,0.12)",
                  border: `1px solid ${ev.icon === "🔴" ? "#ff4444" : ev.icon === "🟠" ? "var(--orange)" : ev.icon === "🟢" || ev.icon === "✓" ? "var(--green)" : "var(--cyan)"}`,
                  color: ev.icon === "🔴" ? "#ff4444" : ev.icon === "🟠" ? "var(--orange)" : ev.icon === "🟢" || ev.icon === "✓" ? "var(--green)" : "var(--cyan)",
                  boxShadow: `0 0 10px ${ev.icon === "🔴" ? "rgba(255,68,68,0.2)" : ev.icon === "🟠" ? "rgba(255,107,53,0.2)" : ev.icon === "🟢" || ev.icon === "✓" ? "rgba(0,255,136,0.2)" : "rgba(0,245,255,0.2)"}`,
                }}>
                  {ev.icon}
                </div>

                <div className="text-[10px] text-slate-200 font-semibold leading-relaxed font-sans">
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

        {/* Separator 4: Next Actions */}
        {nextActions.length > 0 && (
          <>
            <div className="h-[1px] my-6" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.06), transparent)" }} />
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left/Center: Actions list */}
              <div className="md:col-span-7 space-y-3">
                <div className="text-xs tracking-widest text-slate-400 font-bold uppercase mb-1">
                  NEXT ACTIONS
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 font-sans">
                  {nextActions.map((act, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <span className="font-bold text-green-400" style={{ color: "var(--green)" }}>✓</span>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Richer expected improvements & progress slider */}
              <div className="md:col-span-5 p-4 rounded-xl flex flex-col gap-3" style={{
                background: "rgba(0,245,255,0.03)",
                border: "1px solid rgba(0,245,255,0.08)",
              }}>
                <div className="flex items-center justify-between">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                    Expected Improvement
                  </div>
                  <div className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded font-sans">
                    Potential +{targetScore - score} pts
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-400">{score}</span>
                    <span className="text-slate-600 text-xs">→</span>
                    <span className="text-lg font-black text-green-400" style={{ textShadow: "0 0 10px rgba(0,255,136,0.3)" }}>
                      {targetScore}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-cyan-400 tracking-wider">
                    {getProgressBar(score, targetScore)}
                  </div>
                </div>

                <div className="border-t border-slate-900 pt-2 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 uppercase tracking-wider font-semibold">Estimated Effort:</span>
                  <span className="text-slate-300 font-medium">{estimatedEffort}</span>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

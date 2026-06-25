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

  // 1. Synthesize Verdict statement
  const getVerdictStatement = () => {
    const activityText = recentCommits >= 15 
      ? "demonstrates strong, active maintenance" 
      : recentCommits >= 5 
      ? "shows moderate development activity" 
      : "shows very low recent commit activity";
    
    const communityText = busFactor.busFactor === 1 
      ? "but suffers from extreme single-contributor reliance (Bus Factor = 1)" 
      : busFactor.busFactor <= 2 
      ? "but has a highly concentrated contributor base" 
      : "and benefits from a healthy, distributed contributor team";
      
    return `This repository ${activityText} ${communityText}.`;
  };

  // 2. Synthesize Recommendation statement
  const getRecommendation = () => {
    if (busFactor.riskLevel === "CRITICAL") {
      return "Suitable only for non-critical tools or learning. Avoid direct production dependency unless your team is ready to fork and maintain it internally.";
    }
    if (busFactor.riskLevel === "HIGH") {
      return "Exercise caution before wide production deployment. Recommended to establish internal familiarity with the codebase or increase contributor diversity first.";
    }
    if (busFactor.riskLevel === "MEDIUM") {
      return "Generally suitable for production. We advise monitoring release cycles and contributor activity trends periodically.";
    }
    return "Fully recommended for mission-critical production. The codebase demonstrates strong resilience, community activity, and stable delivery.";
  };

  // 3. Dynamic Strengths & Risks
  const strengths: string[] = [];
  const risks: string[] = [];

  if (recentCommits >= 15) {
    strengths.push("Frequent commits");
  } else if (recentCommits > 0) {
    strengths.push("Steady commit frequency");
  }
  
  if (healthScore.breakdown.activityScore >= 15) {
    strengths.push("Healthy recent activity");
  }
  if (busFactor.busFactor >= 3) {
    strengths.push("Low contributor dependency");
  }
  if (data.contributors.length >= 8) {
    strengths.push("Healthy community size");
  }
  if (releaseCadence.totalReleases > 0) {
    strengths.push("Regular releases documented");
  }
  if (healthScore.breakdown.maintenanceScore >= 18) {
    strengths.push("Fast issue and PR response");
  }
  // Fallbacks if empty
  if (strengths.length < 2) {
    strengths.push("Publicly accessible codebase");
    strengths.push("Standard open-source structure");
  }

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
  if (healthScore.total < 40) {
    risks.push("Critical overall health metrics");
  }

  // 4. Dynamic Confidence Score
  const confidence = Math.min(99, 88 + (data.contributors.length > 5 ? 4 : 1) + (releaseCadence.totalReleases > 0 ? 4 : 1) + (recentCommits > 10 ? 3 : 1));

  // Risk configuration for UI themes
  const riskConfig = {
    LOW: { color: "var(--green)", glow: "rgba(0,255,136,0.35)", bg: "rgba(0,255,136,0.02)", border: "rgba(0,255,136,0.2)" },
    MEDIUM: { color: "var(--yellow)", glow: "rgba(255,215,0,0.25)", bg: "rgba(255,215,0,0.02)", border: "rgba(255,215,0,0.2)" },
    HIGH: { color: "var(--orange)", glow: "rgba(255,107,53,0.3)", bg: "rgba(255,107,53,0.02)", border: "rgba(255,107,53,0.2)" },
    CRITICAL: { color: "#ff4444", glow: "rgba(255,68,68,0.35)", bg: "rgba(255,68,68,0.02)", border: "rgba(255,68,68,0.2)" },
  };

  const cfg = riskConfig[busFactor.riskLevel];

  return (
    <div
      id="verdict"
      className="relative overflow-hidden w-full animate-fade-in-up mt-8"
      style={{
        background: "rgba(6, 8, 16, 0.95)",
        border: `1px solid ${cfg.border}`,
        borderRadius: "16px",
        boxShadow: `0 0 35px ${cfg.glow}, inset 0 0 30px rgba(0,0,0,0.8)`,
      }}
    >
      {/* Top running light neon bar */}
      <div style={{
        height: "3px",
        background: `linear-gradient(90deg, transparent, ${cfg.color}, ${cfg.color}, transparent)`,
        boxShadow: `0 0 15px ${cfg.color}`,
      }} />

      <div className="p-8">
        {/* Header with bot avatar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            {/* Animated AI Bot Icon */}
            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl border" style={{
              borderColor: `${cfg.color}40`,
              background: `${cfg.color}05`,
              boxShadow: `0 0 20px ${cfg.color}15`,
            }}>
              <span className="text-3xl animate-bounce-slow">🤖</span>
              {/* Outer pulsing glow */}
              <div className="absolute inset-0 rounded-2xl animate-pulse" style={{
                border: `2px solid ${cfg.color}20`,
              }} />
            </div>
            <div>
              <div className="text-[10px] tracking-[0.25em] font-bold text-slate-500 uppercase font-mono mb-1">
                RADAR INTELLIGENCE ENGINE
              </div>
              <h2 className="text-2xl font-black font-mono tracking-tight" style={{
                color: cfg.color,
                textShadow: `0 0 20px ${cfg.color}40`
              }}>
                🤖 AI VERDICT
              </h2>
            </div>
          </div>

          {/* Badge */}
          <div className="px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider" style={{
            background: `${cfg.color}10`,
            border: `1px solid ${cfg.color}30`,
            color: cfg.color,
            textShadow: `0 0 8px ${cfg.color}50`,
          }}>
            RELIABILITY STATUS: {busFactor.riskLevel}
          </div>
        </div>

        {/* Dynamic overall verdict statement */}
        <div className="text-lg font-medium text-slate-200 mb-6 leading-relaxed border-l-2 pl-4" style={{ borderColor: cfg.color }}>
          {getVerdictStatement()}
        </div>

        {/* Strengths & Risks + Confidence */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          
          {/* Column 1: Strengths */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-mono tracking-widest text-slate-400 font-bold uppercase mb-2 flex items-center gap-1.5">
              <span style={{ color: "var(--green)" }}>✓</span> STRENGTHS
            </div>
            <div className="space-y-2">
              {strengths.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <span className="text-green-400 font-bold" style={{ color: "var(--green)" }}>✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Risks */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-mono tracking-widest text-slate-400 font-bold uppercase mb-2 flex items-center gap-1.5">
              <span style={{ color: cfg.color }}>⚠</span> RISKS
            </div>
            <div className="space-y-2">
              {risks.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <span className="text-orange-400 font-bold" style={{ color: cfg.color }}>⚠</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Recommendations & Confidence */}
          <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-2xl" style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.03)",
          }}>
            <div className="space-y-3">
              <div className="text-xs font-mono tracking-widest text-slate-400 font-bold uppercase">
                RECOMMENDATION
              </div>
              <p className="text-xs leading-relaxed text-slate-300 font-mono">
                {getRecommendation()}
              </p>
            </div>

            <div className="mt-5 pt-4 flex items-center justify-between border-t border-slate-900">
              <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                ANALYSIS CONFIDENCE
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono" style={{ color: "var(--cyan)", textShadow: "0 0 10px rgba(0,245,255,0.5)" }}>
                  {confidence}%
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

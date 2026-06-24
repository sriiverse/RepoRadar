"use client";

import { useRepoStore } from "@/store/repoStore";

export default function RiskAssessmentCard() {
  const { data } = useRepoStore();
  if (!data) return null;
  const { busFactor } = data;

  const risk = busFactor.riskLevel;

  const riskConfig = {
    LOW: {
      label: "LOW RISK",
      color: "var(--green)",
      glow: "rgba(0,255,136,0.3)",
      bg: "rgba(0,255,136,0.08)",
      border: "rgba(0,255,136,0.25)",
      icon: "🛡️",
      verdict: "Safe to adopt",
      description: "Repository is actively maintained with healthy contributor distribution and fast response times.",
    },
    MEDIUM: {
      label: "MEDIUM RISK",
      color: "var(--yellow)",
      glow: "rgba(255,215,0,0.3)",
      bg: "rgba(255,215,0,0.08)",
      border: "rgba(255,215,0,0.25)",
      icon: "⚠️",
      verdict: "Use with caution",
      description: "Some concentration risk detected. Monitor contributor activity before production use.",
    },
    HIGH: {
      label: "HIGH RISK",
      color: "var(--orange)",
      glow: "rgba(255,107,53,0.3)",
      bg: "rgba(255,107,53,0.08)",
      border: "rgba(255,107,53,0.25)",
      icon: "🔴",
      verdict: "Significant exposure",
      description: "Contributor concentration is dangerously high. Few individuals control most of the codebase.",
    },
    CRITICAL: {
      label: "CRITICAL RISK",
      color: "#ff4444",
      glow: "rgba(255,68,68,0.3)",
      bg: "rgba(255,68,68,0.08)",
      border: "rgba(255,68,68,0.3)",
      icon: "☠️",
      verdict: "Avoid for production",
      description: "Single contributor dominates. If they stop contributing, this project is effectively abandoned.",
    },
  };

  const cfg = riskConfig[risk];

  return (
    <div
      className="glass-card bounce-card p-5 flex-1"
      style={{
        boxShadow: `0 0 20px ${cfg.glow}, inset 0 0 15px ${cfg.glow.replace("0.3", "0.04")}`,
        borderColor: cfg.border,
      }}
    >
      <div className="cyber-label" style={{ color: cfg.color }}>◆ RISK ASSESSMENT</div>

      {/* Icon + verdict */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="p-3 rounded-xl flex-shrink-0"
          style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
        >
          <span style={{ fontSize: "1.6rem" }}>{cfg.icon}</span>
        </div>
        <div>
          <div
            className="text-xl font-black"
            style={{ color: cfg.color, fontFamily: "JetBrains Mono, monospace", textShadow: `0 0 15px ${cfg.color}` }}
          >
            {cfg.label}
          </div>
          <div
            className="text-xs font-semibold"
            style={{ color: cfg.color + "aa", fontFamily: "JetBrains Mono, monospace" }}
          >
            {cfg.verdict}
          </div>
        </div>
      </div>

      <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {cfg.description}
      </p>
    </div>
  );
}

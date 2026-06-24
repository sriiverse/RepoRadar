"use client";

import { useRepoStore } from "@/store/repoStore";

export default function ContributorConcentrationCard() {
  const { data } = useRepoStore();
  if (!data) return null;
  const { busFactor } = data;

  const topPct = busFactor.topContributorPercentage;
  const circumference = 2 * Math.PI * 44;
  const offset = circumference - (topPct / 100) * circumference;

  const isScary = topPct >= 60;
  const isWarning = topPct >= 40;

  const color = isScary ? "#ff4444" : isWarning ? "var(--orange)" : "var(--cyan)";
  const glow = isScary ? "rgba(255,68,68,0.4)" : isWarning ? "rgba(255,107,53,0.35)" : "rgba(0,245,255,0.3)";

  return (
    <div
      className="glass-card bounce-card p-5"
      style={{
        boxShadow: isScary ? `0 0 20px ${glow}, inset 0 0 15px rgba(255,68,68,0.04)` : undefined,
        borderColor: isScary ? "rgba(255,68,68,0.3)" : undefined,
      }}
    >
      <div className="cyber-label" style={{ color }}>◆ CONTRIBUTOR CONCENTRATION</div>

      {/* Warning banner for scary values */}
      {isScary && (
        <div
          className="mb-3 px-3 py-2 rounded-lg flex items-center gap-2 text-xs font-bold"
          style={{
            background: "rgba(255,68,68,0.12)",
            border: "1px solid rgba(255,68,68,0.3)",
            color: "#ff4444",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          <span>⚠</span>
          <span>WARNING: EXTREME CONCENTRATION</span>
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Donut */}
        <div className="relative flex-shrink-0">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
            <circle
              cx="50" cy="50" r="44"
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 50 50)"
              style={{
                transition: "stroke-dashoffset 1.5s cubic-bezier(0.22,1,0.36,1)",
                filter: `drop-shadow(0 0 8px ${color})`,
              }}
            />
            <text x="50" y="54" textAnchor="middle" fill={color} fontSize="18" fontWeight="900" fontFamily="Inter"
              style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
              {topPct}%
            </text>
          </svg>
        </div>

        <div className="flex-1">
          <div className="text-sm font-bold mb-1" style={{ color }}>
            {isScary ? "⚠ CRITICAL OWNERSHIP" : isWarning ? "⚠ HIGH OWNERSHIP" : "Contributor share"}
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {isScary
              ? `Top contributor owns ${topPct}% of all repository knowledge. If they leave, the project loses its core maintainer.`
              : `Top contributor owns ${topPct}% of commits.`}
          </p>
          {busFactor.contributors[0] && (
            <div
              className="mt-2 px-2 py-1 rounded text-xs inline-block"
              style={{
                background: `${color}15`,
                border: `1px solid ${color}30`,
                color,
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              @{busFactor.contributors[0].login}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

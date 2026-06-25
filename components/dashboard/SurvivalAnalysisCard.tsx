"use client";

import { useEffect, useState } from "react";
import { useRepoStore } from "@/store/repoStore";

function computeCollapseProbability(busFactorNum: number, topContributorPct: number): number {
  // Bus factor contribution (0–60): lower = more dangerous
  const busPart = Math.max(0, (5 - busFactorNum) / 4) * 60;
  // Concentration contribution (0–40): higher = more dangerous
  const concPart = (topContributorPct / 100) * 40;
  return Math.min(99, Math.round(busPart + concPart));
}

function AnimatedBar({ targetPct, color }: { targetPct: number; color: string }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(targetPct), 300);
    return () => clearTimeout(t);
  }, [targetPct]);

  const filledBlocks = Math.round((width / 100) * 10);

  return (
    <div>
      {/* Segmented block bar */}
      <div className="flex gap-1 mb-1.5">
        {Array.from({ length: 10 }).map((_, i) => {
          const filled = i < filledBlocks;
          const intensity = (i + 1) / 10; // later blocks = more intense color
          const segColor = i >= 7 ? "#ff4444" : i >= 4 ? "#ff6b35" : color;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: "14px",
                borderRadius: "2px",
                background: filled ? segColor : "rgba(255,255,255,0.04)",
                boxShadow: filled ? `0 0 ${6 + i}px ${segColor}80` : "none",
                transition: `background 0.35s ease ${i * 0.05}s, box-shadow 0.35s ease ${i * 0.05}s`,
                border: `1px solid ${filled ? segColor + "50" : "rgba(255,255,255,0.04)"}`,
                opacity: filled ? 0.7 + intensity * 0.3 : 1,
              }}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-xs" style={{
        fontFamily: "JetBrains Mono, monospace",
        color: "rgba(255,255,255,0.2)",
        fontSize: "0.58rem",
      }}>
        <span style={{ color: color }}>SAFE</span>
        <span style={{ color: "#ff6b35" }}>RISKY</span>
        <span style={{ color: "#ff4444" }}>CRITICAL</span>
      </div>
    </div>
  );
}

export default function SurvivalAnalysisCard() {
  const { data } = useRepoStore();
  if (!data) return null;
  const { busFactor } = data;

  const collapsePct = computeCollapseProbability(
    busFactor.busFactor,
    busFactor.topContributorPercentage
  );

  const riskConfig = {
    LOW: { color: "var(--green)", glow: "rgba(0,255,136,0.3)", border: "rgba(0,255,136,0.3)" },
    MEDIUM: { color: "var(--yellow)", glow: "rgba(255,215,0,0.3)", border: "rgba(255,215,0,0.3)" },
    HIGH: { color: "var(--orange)", glow: "rgba(255,107,53,0.35)", border: "rgba(255,107,53,0.35)" },
    CRITICAL: { color: "#ff4444", glow: "rgba(255,68,68,0.45)", border: "rgba(255,68,68,0.4)" },
  };
  const cfg = riskConfig[busFactor.riskLevel];

  return (
    <div
      className="glass-card bounce-card p-6 h-full"
      style={{
        boxShadow: `0 0 35px ${cfg.glow}, inset 0 0 25px ${cfg.glow.replace("0.35","0.05").replace("0.3","0.04").replace("0.45","0.06")}`,
        borderColor: cfg.border,
      }}
    >
      {/* Top accent */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "2px",
        background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)`,
        boxShadow: `0 0 12px ${cfg.color}`, borderRadius: "14px 14px 0 0",
      }} />

      <div className="cyber-label mb-3" style={{ color: cfg.color }}>◆ SURVIVAL ANALYSIS</div>

      {/* Main metric row */}
      <div className="flex items-center justify-between mb-5">
        {/* Bus Factor */}
        <div className="text-center">
          <div className="text-xs mb-1" style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
            CONTRIBUTORS<br />REQUIRED
          </div>
          <div style={{
            fontSize: "4.5rem",
            fontWeight: "900",
            color: cfg.color,
            fontFamily: "JetBrains Mono, monospace",
            textShadow: `0 0 30px ${cfg.color}, 0 0 60px ${cfg.glow}`,
            lineHeight: 1,
          }}>
            {busFactor.busFactor}
          </div>
          <div className="text-xs mt-1" style={{
            color: cfg.color + "aa",
            fontFamily: "JetBrains Mono, monospace",
            fontWeight: "600",
          }}>
            {busFactor.riskLevel} RISK
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: "1px", height: "80px", background: `linear-gradient(180deg, transparent, ${cfg.color}40, transparent)` }} />

        {/* Knowledge Concentration */}
        <div className="text-center">
          <div className="text-xs mb-1" style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
            KNOWLEDGE<br />CONCENTRATION
          </div>
          <div style={{
            fontSize: "4.5rem",
            fontWeight: "900",
            color: cfg.color,
            fontFamily: "JetBrains Mono, monospace",
            textShadow: `0 0 30px ${cfg.color}, 0 0 60px ${cfg.glow}`,
            lineHeight: 1,
          }}>
            {busFactor.topContributorPercentage}%
          </div>
          <div className="text-xs mt-1" style={{
            color: "var(--text-muted)",
            fontFamily: "JetBrains Mono, monospace",
          }}>
            Top contributor
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${cfg.border}, transparent)`, marginBottom: "16px" }} />

      {/* Project Collapse Probability */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs font-bold tracking-widest" style={{
            color: cfg.color, fontFamily: "JetBrains Mono, monospace",
          }}>
            PROJECT COLLAPSE PROBABILITY
          </div>
          <div style={{
            fontSize: "1.4rem",
            fontWeight: "900",
            color: collapsePct >= 70 ? "#ff4444" : cfg.color,
            fontFamily: "JetBrains Mono, monospace",
            textShadow: `0 0 15px ${collapsePct >= 70 ? "#ff4444" : cfg.color}`,
          }}>
            {collapsePct}%
          </div>
        </div>
        <AnimatedBar targetPct={collapsePct} color={cfg.color} />
        <div className="mt-3 text-[11px] leading-relaxed text-slate-500 font-mono text-center">
          Estimated repository continuity if the primary maintainer becomes inactive.
        </div>
      </div>

      {/* Warning label */}
      {collapsePct >= 70 && (
        <div className="mt-3 px-3 py-2 rounded-lg text-xs flex items-center gap-2" style={{
          background: "rgba(255,68,68,0.1)",
          border: "1px solid rgba(255,68,68,0.3)",
          color: "#ff8888",
          fontFamily: "JetBrains Mono, monospace",
        }}>
          <span>⚠</span>
          <span>If top {busFactor.busFactor === 1 ? "contributor leaves" : "contributors leave"}, {collapsePct}% of repository knowledge is lost.</span>
        </div>
      )}
    </div>
  );
}

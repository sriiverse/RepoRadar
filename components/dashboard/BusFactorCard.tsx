"use client";

import { useRepoStore } from "@/store/repoStore";

export default function BusFactorCard() {
  const { data } = useRepoStore();
  if (!data) return null;
  const { busFactor } = data;

  const riskConfig = {
    LOW: { color: "var(--green)", glow: "rgba(0,255,136,0.4)", label: "HEALTHY DISTRIBUTION", desc: "Multiple contributors share ownership. Safe for long-term adoption." },
    MEDIUM: { color: "var(--yellow)", glow: "rgba(255,215,0,0.35)", label: "MODERATE DEPENDENCY", desc: "Some concentration detected. Monitor contributor activity." },
    HIGH: { color: "var(--orange)", glow: "rgba(255,107,53,0.4)", label: "HIGH DEPENDENCY", desc: "Few contributors dominate. Risk of abandonment if they leave." },
    CRITICAL: { color: "#ff4444", glow: "rgba(255,68,68,0.5)", label: "CRITICAL DEPENDENCY", desc: "Single point of failure. Project survival depends on one person." },
  };

  const cfg = riskConfig[busFactor.riskLevel];

  return (
    <div
      className="glass-card bounce-card p-6 flex flex-col"
      style={{
        boxShadow: `0 0 30px ${cfg.glow}, inset 0 0 25px ${cfg.glow.replace("0.4", "0.06")}`,
        borderColor: cfg.color + "40",
        minHeight: "280px",
      }}
    >
      {/* Top accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)`,
          boxShadow: `0 0 10px ${cfg.color}`,
          borderRadius: "12px 12px 0 0",
        }}
      />

      <div className="cyber-label mb-2" style={{ color: cfg.color }}>◆ BUS FACTOR</div>

      {/* HUGE number */}
      <div className="flex items-end gap-4 mb-2">
        <div
          className="font-black leading-none"
          style={{
            fontSize: "6rem",
            color: cfg.color,
            fontFamily: "JetBrains Mono, monospace",
            textShadow: `0 0 30px ${cfg.color}, 0 0 60px ${cfg.glow}`,
            lineHeight: 1,
          }}
        >
          {busFactor.busFactor}
        </div>
        <div className="mb-3">
          <div
            className="text-xs font-black tracking-widest px-2 py-1 rounded mb-1"
            style={{
              color: cfg.color,
              background: `${cfg.color}18`,
              border: `1px solid ${cfg.color}40`,
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            {cfg.label}
          </div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>
            contributor{busFactor.busFactor !== 1 ? "s" : ""} control 50%+ of codebase
          </div>
        </div>
      </div>

      <p className="text-xs mb-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {cfg.desc}
      </p>

      {/* Risk percentage bar */}
      <div className="mt-auto">
        <div className="flex justify-between text-xs mb-1.5" style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--text-muted)" }}>
          <span>CODEBASE AT RISK IF TOP {busFactor.busFactor} LEAVE</span>
          <span style={{ color: cfg.color, fontWeight: "700" }}>{busFactor.riskPercentage}%</span>
        </div>
        <div className="cyber-bar" style={{ height: "8px" }}>
          <div
            className="cyber-bar-fill"
            style={{
              width: `${busFactor.riskPercentage}%`,
              background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}88)`,
              boxShadow: `0 0 10px ${cfg.color}`,
              height: "8px",
            }}
          />
        </div>

        {/* Top contributors mini list */}
        <div className="mt-3 space-y-1">
          {busFactor.contributors.slice(0, 3).map((c, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: i === 0 ? cfg.color : `${cfg.color}60`,
                  }}
                />
                <span className="text-xs" style={{ color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace" }}>
                  {c.login}
                </span>
              </div>
              <span className="text-xs font-bold" style={{ color: i === 0 ? cfg.color : "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
                {Math.round(c.percentage)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRepoStore } from "@/store/repoStore";
import { useEffect, useState, useRef } from "react";

// Typewriter hook — cycles through messages with typing + pause + erase
function useTypewriter(messages: string[], typingSpeed = 38, pauseMs = 1800) {
  const [displayed, setDisplayed] = useState("");
  const [msgIdx, setMsgIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [erasing, setErasing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const current = messages[msgIdx] ?? "";
    if (!erasing) {
      if (charIdx < current.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(current.slice(0, charIdx + 1));
          setCharIdx((c) => c + 1);
        }, typingSpeed);
      } else {
        timeoutRef.current = setTimeout(() => setErasing(true), pauseMs);
      }
    } else {
      if (charIdx > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(current.slice(0, charIdx - 1));
          setCharIdx((c) => c - 1);
        }, typingSpeed / 2);
      } else {
        setErasing(false);
        setMsgIdx((m) => (m + 1) % messages.length);
      }
    }
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [charIdx, erasing, msgIdx, messages, typingSpeed, pauseMs]);

  return displayed;
}

function computeThreatLevel(
  busFactorNum: number,
  topContributorPct: number,
  recentCommits: number,
  healthScore: number
): number {
  // Each factor contributes to threat (0-10 scale)
  // Bus factor score (0-4): lower bus factor = higher threat
  const busScore = busFactorNum === 1 ? 4 : busFactorNum === 2 ? 3 : busFactorNum <= 4 ? 1.5 : 0.5;
  // Concentration score (0-3): higher concentration = higher threat
  const concScore = topContributorPct > 80 ? 3 : topContributorPct > 60 ? 2 : topContributorPct > 40 ? 1 : 0.3;
  // Activity score (0-2): stale = threat
  const actScore = recentCommits < 3 ? 2 : recentCommits < 10 ? 1.2 : recentCommits < 30 ? 0.5 : 0;
  // Health penalty (0-1)
  const healthPenalty = (100 - healthScore) / 100;

  const raw = busScore + concScore + actScore + healthPenalty;
  return Math.min(10, Math.max(0.5, Math.round(raw * 10) / 10));
}

function getVerdictConfig(riskLevel: string, healthScore: number) {
  if (riskLevel === "CRITICAL" || healthScore < 25) {
    return {
      status: "CRITICAL RISK",
      color: "#ff4444",
      glow: "rgba(255,68,68,0.3)",
      border: "rgba(255,68,68,0.4)",
      bg: "rgba(255,68,68,0.05)",
      bgStrong: "rgba(255,68,68,0.12)",
      icon: "☠",
      recommendation: "Avoid using this as a dependency in mission-critical systems. Single point of failure detected.",
    };
  }
  if (riskLevel === "HIGH" || healthScore < 45) {
    return {
      status: "HIGH RISK",
      color: "var(--orange)",
      glow: "rgba(255,107,53,0.3)",
      border: "rgba(255,107,53,0.4)",
      bg: "rgba(255,107,53,0.05)",
      bgStrong: "rgba(255,107,53,0.12)",
      icon: "⚠",
      recommendation: "Use with caution. Contributor concentration is high. Fork or audit before production use.",
    };
  }
  if (riskLevel === "MEDIUM" || healthScore < 65) {
    return {
      status: "MODERATE RISK",
      color: "var(--yellow)",
      glow: "rgba(255,215,0,0.25)",
      border: "rgba(255,215,0,0.35)",
      bg: "rgba(255,215,0,0.04)",
      bgStrong: "rgba(255,215,0,0.1)",
      icon: "◈",
      recommendation: "Generally safe. Monitor contributor activity and watch for stale issues before long-term adoption.",
    };
  }
  return {
    status: "LOW RISK",
    color: "var(--green)",
    glow: "rgba(0,255,136,0.25)",
    border: "rgba(0,255,136,0.35)",
    bg: "rgba(0,255,136,0.04)",
    bgStrong: "rgba(0,255,136,0.1)",
    icon: "✓",
    recommendation: "Safe for production. Healthy contributor distribution, active maintenance, and strong community.",
  };
}



export default function VerdictPanel() {
  const { data } = useRepoStore();

  // Compute everything before hooks (hooks must be unconditional)
  const busFactor = data?.busFactor;
  const healthScore = data?.healthScore;
  const releaseCadence = data?.releaseCadence;
  const commitActivity = data?.commitActivity ?? [];
  const recentCommits = commitActivity.slice(-4).reduce((s, w) => s + w.total, 0);

  const typewriterMessages = data ? [
    "Analyzing repository resilience...",
    busFactor!.busFactor === 1
      ? "Single point of failure detected."
      : `${busFactor!.busFactor} contributors required for 50%+ codebase coverage.`,
    `Top contributor owns ${busFactor!.topContributorPercentage}% of all commits.`,
    recentCommits < 5
      ? "Development activity has stalled."
      : `${recentCommits} commits recorded in the last 4 weeks.`,
    `Repository health rated ${healthScore!.label} (${healthScore!.total}/100).`,
    "Intelligence analysis complete.",
  ] : ["Initializing..."];

  // Hooks must be called unconditionally — before any early return
  const typewriterText = useTypewriter(typewriterMessages, 36, 2000);

  if (!data) return null;

  const cfg = getVerdictConfig(busFactor!.riskLevel, healthScore!.total);
  const threatLevel = computeThreatLevel(
    busFactor!.busFactor,
    busFactor!.topContributorPercentage,
    recentCommits,
    healthScore!.total
  );

  const highlights = [
    `Bus factor is ${busFactor!.riskLevel.toLowerCase()} (${busFactor!.busFactor} contributor${busFactor!.busFactor !== 1 ? "s" : ""} control 50%+ of codebase)`,
    `Top contributor owns ${busFactor!.topContributorPercentage}% of all commits`,
    recentCommits < 10
      ? `Activity has stalled — only ${recentCommits} commits in the last 4 weeks`
      : `Actively maintained — ${recentCommits} commits in last 4 weeks`,
    releaseCadence!.totalReleases === 0
      ? "No releases found — project maturity unclear"
      : `${releaseCadence!.totalReleases} releases · Last shipped: ${releaseCadence!.lastReleaseAgo}`,
    `Health score: ${healthScore!.total}/100 — ${healthScore!.label}`,
  ];

  return (
    <div
      id="verdict"
      className="relative overflow-hidden mb-5 animate-fade-in-up"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: "16px",
        boxShadow: `0 0 50px ${cfg.glow}, inset 0 0 40px ${cfg.glow.replace("0.3","0.04")}`,
      }}
    >
      {/* Top accent line */}
      <div style={{
        height: "3px",
        background: `linear-gradient(90deg, transparent, ${cfg.color}, ${cfg.color}, transparent)`,
        boxShadow: `0 0 15px ${cfg.color}`,
      }} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="text-xs mb-2 tracking-widest" style={{
              color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace"
            }}>
              ◆ REPOSITORY RISK REPORT · {data.meta.full_name.toUpperCase()}
            </div>
            <div className="flex items-center gap-4">
              <span style={{ fontSize: "2.5rem" }}>{cfg.icon}</span>
              <div>
                <div className="text-4xl font-black tracking-tight" style={{
                  color: cfg.color,
                  fontFamily: "JetBrains Mono, monospace",
                  textShadow: `0 0 25px ${cfg.color}`,
                }}>
                  STATUS: {cfg.status}
                </div>
                {/* TYPEWRITER */}
                <div className="mt-1.5 text-xs flex items-center gap-1.5" style={{
                  color: cfg.color + "aa",
                  fontFamily: "JetBrains Mono, monospace",
                  minHeight: "18px",
                }}>
                  <span className="animate-pulse-glow" style={{ color: cfg.color }}>▶</span>
                  <span>{typewriterText}</span>
                  <span className="animate-blink" style={{ color: cfg.color }}>_</span>
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                  {cfg.recommendation}
                </div>
              </div>
            </div>
          </div>

          {/* Health badge */}
          <div className="flex-shrink-0 text-center px-6 py-4 rounded-xl" style={{
            background: cfg.bgStrong, border: `1px solid ${cfg.border}`,
          }}>
            <div className="text-5xl font-black" style={{
              color: cfg.color,
              fontFamily: "JetBrains Mono, monospace",
              textShadow: `0 0 20px ${cfg.color}`,
            }}>
              {healthScore!.total}
            </div>
            <div className="text-xs mt-1" style={{
              color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace"
            }}>
              /100 HEALTH
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: `linear-gradient(90deg, ${cfg.border}, transparent)`, marginBottom: "20px" }} />

        {/* Two column: metrics + threat meter */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Key metrics + Intelligence summary */}
          <div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "BUS FACTOR", val: String(busFactor!.busFactor), sub: `${busFactor!.riskLevel} RISK` },
                { label: "TOP OWNERSHIP", val: `${busFactor!.topContributorPercentage}%`, sub: "Top contributor" },
                { label: "RECENT COMMITS", val: String(recentCommits), sub: "Last 4 weeks" },
              ].map((m) => (
                <div key={m.label}>
                  <div className="text-xs mb-1" style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
                    {m.label}
                  </div>
                  <div className="text-2xl font-black" style={{ color: cfg.color, fontFamily: "JetBrains Mono, monospace" }}>
                    {m.val}
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>{m.sub}</div>
                </div>
              ))}
            </div>

            {/* Intelligence Summary */}
            <div className="rounded-xl p-4" style={{
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}>
              <div className="text-xs mb-2.5 font-bold tracking-widest" style={{
                color: cfg.color, fontFamily: "JetBrains Mono, monospace",
              }}>
                ◆ INTELLIGENCE SUMMARY
              </div>
              <div className="space-y-1.5">
                {highlights.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                    <span style={{ color: cfg.color, flexShrink: 0, marginTop: "1px" }}>•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: THREAT LEVEL METER */}
          <div className="flex flex-col justify-center">
            <div className="rounded-xl p-5" style={{
              background: "rgba(0,0,0,0.35)",
              border: `1px solid ${cfg.color}20`,
            }}>
              <div className="text-xs font-bold tracking-widest mb-1" style={{
                color: cfg.color, fontFamily: "JetBrains Mono, monospace",
              }}>
                ◆ THREAT LEVEL METER
              </div>
              <div className="text-xs mb-4" style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
                Composite risk score based on bus factor,<br/>contributor concentration &amp; activity
              </div>

              {/* Big threat number */}
              <div className="flex items-end gap-2 mb-3">
                <div style={{
                  fontSize: "4rem",
                  fontWeight: "900",
                  color: cfg.color,
                  fontFamily: "JetBrains Mono, monospace",
                  textShadow: `0 0 30px ${cfg.color}`,
                  lineHeight: 1,
                }}>
                  {threatLevel}
                </div>
                <div className="mb-2" style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace", fontSize: "1.2rem" }}>
                  / 10
                </div>
              </div>

              {/* Segmented threat bar */}
              <div className="flex gap-1 mb-2">
                {Array.from({ length: 10 }).map((_, i) => {
                  const filled = i < Math.round(threatLevel);
                  const segColor = i >= 7 ? "#ff4444" : i >= 4 ? "#ff6b35" : "#ffd700";
                  return (
                    <div key={i} style={{
                      flex: 1,
                      height: "20px",
                      borderRadius: "3px",
                      background: filled ? segColor : "rgba(255,255,255,0.04)",
                      boxShadow: filled ? `0 0 10px ${segColor}90` : "none",
                      transition: `background 0.4s ease ${i * 0.07}s, box-shadow 0.4s ease ${i * 0.07}s`,
                      border: `1px solid ${filled ? segColor + "50" : "rgba(255,255,255,0.04)"}`,
                    }} />
                  );
                })}
              </div>

              {/* Scale labels */}
              <div className="flex justify-between" style={{
                color: "rgba(255,255,255,0.2)",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.58rem",
                letterSpacing: "0.05em",
              }}>
                <span style={{ color: "#ffd700" }}>LOW</span>
                <span style={{ color: "#ff6b35" }}>MEDIUM</span>
                <span style={{ color: "#ff4444" }}>HIGH</span>
                <span style={{ color: "#ff4444" }}>CRITICAL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

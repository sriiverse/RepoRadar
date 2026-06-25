"use client";

import { useEffect, useState } from "react";
import { useRepoStore } from "@/store/repoStore";

function AnimatedNumber({ value }: { value: number }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const duration = 1800;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(value * ease));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <>{current}</>;
}

export default function HealthScoreCard() {
  const { data } = useRepoStore();
  const score = data?.healthScore.total ?? 0;

  const r = 72;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  const [dashOffset, setDashOffset] = useState(circumference);

  useEffect(() => {
    // Trigger transition from empty to target percentage after mount
    setDashOffset(offset);
  }, [offset]);

  if (!data) return null;
  const { healthScore } = data;

  // Spinning decoration ring — slightly larger
  const rDeco = 82;
  const circumDeco = 2 * Math.PI * rDeco;

  const scoreColor =
    score >= 80 ? "#00ff88" :
    score >= 60 ? "#00f5ff" :
    score >= 40 ? "#ffd700" :
    score >= 20 ? "#ff6b35" : "#ff4444";

  const glowColor = scoreColor + "60";

  const breakdown = [
    { label: "Activity", value: healthScore.breakdown.activityScore, max: 25 },
    { label: "Maintenance", value: healthScore.breakdown.maintenanceScore, max: 25 },
    { label: "Community", value: healthScore.breakdown.communityScore, max: 25 },
    { label: "Stability", value: healthScore.breakdown.stabilityScore, max: 25 },
  ];

  return (
    <div
      id="health"
      className="glass-card bounce-card p-6 flex flex-col items-center h-full"
      style={{
        boxShadow: `0 0 40px ${glowColor}, inset 0 0 30px ${scoreColor}08`,
        borderColor: `${scoreColor}35`,
      }}
    >
      <div className="cyber-label self-start mb-2" style={{ color: scoreColor }}>◆ HEALTH SCORE</div>

      {/* Ring gauge */}
      <div className="relative flex items-center justify-center my-2">
        <svg width="200" height="200" viewBox="0 0 200 200" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="score-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={scoreColor} />
              <stop offset="100%" stopColor={scoreColor + "88"} />
            </linearGradient>
            <filter id="glow-filter">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Outermost decorative dashed ring */}
          <circle cx="100" cy="100" r={rDeco} fill="none"
            stroke={`${scoreColor}20`} strokeWidth="1" strokeDasharray="4 6" />

          {/* Spinning decoration arc */}
          <circle cx="100" cy="100" r={rDeco} fill="none"
            stroke={`${scoreColor}40`} strokeWidth="1.5"
            strokeDasharray={`${circumDeco * 0.25} ${circumDeco * 0.75}`}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
            style={{ animation: "spin-slow 8s linear infinite" }}
          />
          <circle cx="100" cy="100" r={rDeco} fill="none"
            stroke={`${scoreColor}40`} strokeWidth="1.5"
            strokeDasharray={`${circumDeco * 0.15} ${circumDeco * 0.85}`}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
            style={{ animation: "spin-reverse 6s linear infinite" }}
          />

          {/* Background track */}
          <circle cx="100" cy="100" r={r} fill="none"
            stroke="rgba(255,255,255,0.04)" strokeWidth="12" />

          {/* Score arc — thick, glowing */}
          <circle cx="100" cy="100" r={r}
            fill="none"
            stroke="url(#score-grad)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 100 100)"
            filter="url(#glow-filter)"
            style={{
              transition: "stroke-dashoffset 1.8s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />

          {/* Inner fill */}
          <circle cx="100" cy="100" r={r - 8} fill={`${scoreColor}06`} />

          {/* Score number — MASSIVE */}
          <text x="100" y="92" textAnchor="middle"
            fill={scoreColor} fontSize="52" fontWeight="900"
            fontFamily="Inter, sans-serif"
            style={{ filter: `drop-shadow(0 0 12px ${scoreColor})` }}
          >
            <AnimatedNumber value={score} />
          </text>

          {/* Label INSIDE the ring */}
          <text x="100" y="115" textAnchor="middle"
            fill={`${scoreColor}cc`} fontSize="13" fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
            letterSpacing="3"
          >
            {healthScore.label}
          </text>
        </svg>
      </div>

      {/* Breakdown bars */}
      <div className="w-full space-y-2 mt-1">
        {breakdown.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-xs mb-0.5"
              style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
              <span>{item.label}</span>
              <span style={{ color: scoreColor }}>{item.value}/{item.max}</span>
            </div>
            <div className="cyber-bar">
              <div className="cyber-bar-fill" style={{
                width: `${(item.value / item.max) * 100}%`,
                background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}66)`,
                boxShadow: `0 0 8px ${scoreColor}80`,
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

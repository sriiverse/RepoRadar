"use client";

import { useRepoStore } from "@/store/repoStore";

function MetricCard({
  icon,
  label,
  value,
  sub,
  color = "var(--cyan)",
  children,
}: {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  color?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="glass-card bounce-card p-4 col-span-1">
      <div className="cyber-label" style={{ color }}>
        {icon} {label}
      </div>
      <div
        className="text-3xl font-black mb-1"
        style={{ color, fontFamily: "JetBrains Mono, monospace", textShadow: `0 0 10px ${color}50` }}
      >
        {value}
      </div>
      {sub && (
        <div className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
          {sub}
        </div>
      )}
      {children}
    </div>
  );
}

export default function PRMetricsCards() {
  const { data } = useRepoStore();
  if (!data) return null;
  const { prStats } = data;

  return (
    <>
      <MetricCard
        icon="↑"
        label="PULL REQUESTS"
        value={prStats.total.toLocaleString()}
        sub="Total PRs"
        color="var(--magenta)"
      >
        <div className="flex gap-4 mt-2 text-xs" style={{ fontFamily: "JetBrains Mono, monospace" }}>
          <div>
            <div style={{ color: "var(--green)" }}>{prStats.merged.toLocaleString()}</div>
            <div style={{ color: "var(--text-muted)" }}>Merged</div>
          </div>
          <div>
            <div style={{ color: "var(--text-secondary)" }}>{prStats.closed.toLocaleString()}</div>
            <div style={{ color: "var(--text-muted)" }}>Closed</div>
          </div>
          <div>
            <div style={{ color: "var(--cyan)" }}>{prStats.open.toLocaleString()}</div>
            <div style={{ color: "var(--text-muted)" }}>Open</div>
          </div>
        </div>
      </MetricCard>

      <MetricCard
        icon="⏱"
        label="PR MERGE TIME"
        value={`${prStats.avgMergeTimeDays}`}
        sub="Average time to merge (days)"
        color="var(--cyan)"
      >
        <div className="text-lg font-bold neon-text-cyan" style={{ fontFamily: "JetBrains Mono, monospace" }}>
          days
        </div>
      </MetricCard>
    </>
  );
}

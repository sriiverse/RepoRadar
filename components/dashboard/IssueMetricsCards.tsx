"use client";

import { useRepoStore } from "@/store/repoStore";

export default function IssueMetricsCards() {
  const { data } = useRepoStore();
  if (!data) return null;
  const { issueStats, releaseCadence, repoAge } = data;

  return (
    <>
      {/* Issues */}
      {issueStats.total === 0 ? (
        <>
          <div className="glass-card bounce-card p-4 col-span-1">
            <div className="cyber-label" style={{ color: "var(--yellow)" }}>◎ ISSUES</div>
            <div className="text-sm font-semibold text-slate-500 font-mono py-2 leading-relaxed">
              Repository does not<br />use GitHub Issues.
            </div>
          </div>

          <div className="glass-card bounce-card p-4 col-span-1">
            <div className="cyber-label" style={{ color: "var(--orange)" }}>💬 ISSUE RESPONSE TIME</div>
            <div className="text-sm font-semibold text-slate-500 font-mono py-2 leading-relaxed">
              No issue response<br />history available.
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="glass-card bounce-card p-4 col-span-1">
            <div className="cyber-label" style={{ color: "var(--yellow)" }}>◎ ISSUES</div>
            <div
              className="text-3xl font-black mb-1"
              style={{ color: "var(--yellow)", fontFamily: "JetBrains Mono, monospace", textShadow: "0 0 10px rgba(255,215,0,0.5)" }}
            >
              {issueStats.total.toLocaleString()}
            </div>
            <div className="text-xs mb-2" style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
              Total Issues
            </div>
            <div className="flex gap-4 text-xs" style={{ fontFamily: "JetBrains Mono, monospace" }}>
              <div>
                <div style={{ color: "var(--green)" }}>{issueStats.closed}</div>
                <div style={{ color: "var(--text-muted)" }}>Closed</div>
              </div>
              <div>
                <div style={{ color: "var(--cyan)" }}>{issueStats.open}</div>
                <div style={{ color: "var(--text-muted)" }}>Open</div>
              </div>
              <div>
                <div style={{ color: "var(--orange)" }}>{issueStats.stale}</div>
                <div style={{ color: "var(--text-muted)" }}>Stale (&gt;90d)</div>
              </div>
            </div>
          </div>

          {/* Issue Response Time */}
          <div className="glass-card bounce-card p-4 col-span-1">
            <div className="cyber-label" style={{ color: "var(--orange)" }}>💬 ISSUE RESPONSE TIME</div>
            <div
              className="text-3xl font-black"
              style={{ color: "var(--orange)", fontFamily: "JetBrains Mono, monospace", textShadow: "0 0 10px rgba(255,107,53,0.5)" }}
            >
              {issueStats.avgResponseTimeDays}
            </div>
            <div className="text-lg font-bold" style={{ color: "var(--orange)", fontFamily: "JetBrains Mono, monospace" }}>
              days
            </div>
            <div className="text-xs mt-1" style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
              Average time to first response
            </div>
          </div>
        </>
      )}

      {/* Release Cadence */}
      <div className="glass-card bounce-card p-4 col-span-1">
        <div className="cyber-label" style={{ color: "var(--magenta)" }}>🚀 RELEASE CADENCE</div>
        <div
          className="text-3xl font-black"
          style={{ color: "var(--magenta)", fontFamily: "JetBrains Mono, monospace", textShadow: "0 0 10px rgba(255,0,255,0.5)" }}
        >
          {releaseCadence.totalReleases}
        </div>
        <div className="text-xs font-mono mt-1" style={{ color: "var(--text-muted)" }}>
          releases
        </div>
        <div className="text-xs mt-1" style={{ color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace" }}>
          Last release {releaseCadence.lastReleaseAgo}
        </div>
      </div>

      {/* Repo Age */}
      <div className="glass-card bounce-card p-4 col-span-1">
        <div className="cyber-label" style={{ color: "var(--purple)" }}>⌛ REPO AGE</div>
        <div
          className="text-3xl font-black"
          style={{ color: "#a78bfa", fontFamily: "JetBrains Mono, monospace", textShadow: "0 0 10px rgba(124,58,237,0.5)" }}
        >
          {repoAge.years > 0 ? repoAge.years : repoAge.months}
        </div>
        <div className="text-xs font-mono mt-1" style={{ color: "#a78bfa" }}>
          {repoAge.years > 0 ? "years" : "months"}
        </div>
        <div className="text-xs mt-1" style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
          Created on {repoAge.createdOn}
        </div>
      </div>
    </>
  );
}

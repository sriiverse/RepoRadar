"use client";

import { useRepoStore } from "@/store/repoStore";

const NAV_ITEMS = [
  { icon: "⊞", label: "DASHBOARD", id: "dashboard" },
  { icon: "◈", label: "OVERVIEW", id: "overview" },
  { icon: "👥", label: "CONTRIBUTORS", id: "contributors" },
  { icon: "⊙", label: "COMMITS", id: "commits" },
  { icon: "↑", label: "PULL REQUESTS", id: "pullrequests" },
  { icon: "◎", label: "ISSUES", id: "issues" },
  { icon: "🚀", label: "RELEASES", id: "releases" },
  { icon: "◐", label: "LANGUAGES", id: "languages" },
  { icon: "⬒", label: "EXPORT REPORT", id: "export" },
];

export default function Sidebar({ activeSection }: { activeSection: string }) {
  const { data, reset } = useRepoStore();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-56 flex flex-col z-30"
      style={{
        background: "rgba(7, 7, 26, 0.95)",
        borderRight: "1px solid rgba(0,245,255,0.1)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Logo */}
      <div className="p-5 pb-4" style={{ borderBottom: "1px solid rgba(0,245,255,0.08)" }}>
        <button onClick={reset} className="text-left w-full group">
          <div className="text-xl font-black tracking-wider">
            <span className="neon-text-cyan">REPO</span>
            <span style={{ color: "var(--text-primary)" }}>RADAR</span>
          </div>
          <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
            GITHUB REPOSITORY INTELLIGENCE
          </div>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className={`nav-item w-full text-left ${activeSection === item.id ? "active" : ""}`}
          >
            <span style={{ fontSize: "0.85rem", width: "16px", display: "inline-block" }}>
              {item.icon}
            </span>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", letterSpacing: "0.05em" }}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* System Status */}
      {data && (
        <div className="p-4" style={{ borderTop: "1px solid rgba(0,245,255,0.08)" }}>
          <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.1em" }}>
            SYSTEM STATUS
          </div>
          <div className="space-y-2 text-xs" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>API</span>
              <span className="neon-text-green font-semibold">STABLE</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>RATE LIMIT</span>
              <span style={{ color: "var(--cyan)" }}>
                {data.rateLimit.remaining}/{data.rateLimit.limit}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>CACHE</span>
              <span style={{ color: data.cached ? "var(--green)" : "var(--cyan)" }}>
                {data.cached ? "HIT" : "FRESH"}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>UPDATED</span>
              <span style={{ color: "var(--text-secondary)" }}>
                {new Date(data.analyzedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>

          {/* Intelligence Engine indicator */}
          <div
            className="mt-4 p-3 rounded-lg text-center"
            style={{
              background: "rgba(0,245,255,0.05)",
              border: "1px solid rgba(0,245,255,0.15)",
            }}
          >
            <div className="text-xs mb-2" style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
              INTELLIGENCE ENGINE
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="status-dot green" />
              <span className="text-xs neon-text-green font-semibold" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                ACTIVE
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

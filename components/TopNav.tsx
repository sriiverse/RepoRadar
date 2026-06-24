"use client";

import { useRepoStore } from "@/store/repoStore";

export default function TopNav() {
  const { data, reset } = useRepoStore();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const NAV_LINKS = [
    { label: "VERDICT", id: "verdict" },
    { label: "HEALTH", id: "health" },
    { label: "COMMITS", id: "commits" },
    { label: "CONTRIBUTORS", id: "contributors" },
    { label: "PULL REQUESTS", id: "pullrequests" },
    { label: "LANGUAGES", id: "languages" },
    { label: "EXPORT", id: "export" },
  ];

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-3"
      style={{
        background: "rgba(7, 7, 26, 0.92)",
        borderBottom: "1px solid rgba(0,245,255,0.12)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Logo */}
      <button onClick={reset} className="flex items-center gap-3 group">
        <div
          className="w-7 h-7 rounded flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(0,245,255,0.2), rgba(255,0,255,0.2))",
            border: "1px solid rgba(0,245,255,0.3)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="#00f5ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <span className="text-base font-black tracking-wider neon-text-cyan">REPO</span>
          <span className="text-base font-black tracking-wider" style={{ color: "var(--text-primary)" }}>RADAR</span>
          <span className="text-xs ml-1.5" style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>v2.0</span>
        </div>
      </button>

      {/* Nav links */}
      {data && (
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="px-3 py-1.5 rounded text-xs font-semibold transition-all duration-200"
              style={{
                color: "var(--text-muted)",
                fontFamily: "JetBrains Mono, monospace",
                letterSpacing: "0.08em",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--cyan)";
                (e.currentTarget as HTMLElement).style.background = "rgba(0,245,255,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}

      {/* Right side */}
      <div className="flex items-center gap-3">
        {data && (
          <>
            {/* Rate limit indicator */}
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded"
              style={{
                background: "rgba(0,245,255,0.05)",
                border: "1px solid rgba(0,245,255,0.12)",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.65rem",
                color: "var(--text-muted)",
              }}
            >
              <span className="status-dot green" style={{ width: "6px", height: "6px" }} />
              <span style={{ color: "var(--cyan)" }}>{data.rateLimit.remaining}</span>
              <span>/5000 API</span>
            </div>
            <button onClick={reset} className="btn-cyber btn-cyan" style={{ padding: "6px 14px", fontSize: "0.65rem" }}>
              ◆ NEW SCAN
            </button>
          </>
        )}
        {!data && (
          <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontFamily: "JetBrains Mono, monospace" }}>
            INTELLIGENCE ENGINE <span className="neon-text-green">● ACTIVE</span>
          </div>
        )}
      </div>
    </nav>
  );
}

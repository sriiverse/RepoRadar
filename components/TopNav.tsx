"use client";

import { useRepoStore } from "@/store/repoStore";
import { useEffect, useState, useRef } from "react";

const NAV_LINKS = [
  { label: "VERDICT", id: "verdict" },
  { label: "HEALTH", id: "health" },
  { label: "COMMITS", id: "commits" },
  { label: "CONTRIBUTORS", id: "contributors" },
  { label: "PULL REQUESTS", id: "pullrequests" },
  { label: "LANGUAGES", id: "languages" },
  { label: "EXPORT", id: "export" },
];

export default function TopNav() {
  const { data, reset } = useRepoStore();
  const [activeId, setActiveId] = useState("health");
  const [underlineStyle, setUnderlineStyle] = useState<React.CSSProperties>({ left: 0, width: 0, opacity: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // ScrollSpy: Update active navigation tab based on viewport scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "-25% 0px -40% 0px"
      }
    );

    NAV_LINKS.forEach((link) => {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Update sliding underline position dynamically on tab change and window resize
  useEffect(() => {
    const updateUnderline = () => {
      if (!containerRef.current) return;
      const activeBtn = containerRef.current.querySelector(`[data-nav-id="${activeId}"]`) as HTMLButtonElement;
      if (activeBtn) {
        setUnderlineStyle({
          left: activeBtn.offsetLeft,
          width: activeBtn.offsetWidth,
          opacity: 1,
        });
      }
    };

    updateUnderline();
    window.addEventListener("resize", updateUnderline);
    return () => window.removeEventListener("resize", updateUnderline);
  }, [activeId]);

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

      {/* Nav links with animated sliding underline */}
      {data && (
        <div ref={containerRef} className="hidden md:flex items-center gap-1 relative py-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              data-nav-id={link.id}
              onClick={() => {
                setActiveId(link.id);
                scrollTo(link.id);
              }}
              className="px-3 py-1.5 rounded text-xs font-semibold transition-all duration-200 relative"
              style={{
                color: activeId === link.id ? "var(--cyan)" : "var(--text-muted)",
                fontFamily: "JetBrains Mono, monospace",
                letterSpacing: "0.08em",
                textShadow: activeId === link.id ? "0 0 8px rgba(0,245,255,0.5)" : "none",
              }}
              onMouseEnter={(e) => {
                if (activeId !== link.id) {
                  e.currentTarget.style.color = "var(--cyan)";
                  e.currentTarget.style.background = "rgba(0,245,255,0.04)";
                  e.currentTarget.style.textShadow = "0 0 8px rgba(0,245,255,0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeId !== link.id) {
                  e.currentTarget.style.color = "var(--text-muted)";
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.textShadow = "none";
                }
              }}
            >
              {link.label}
            </button>
          ))}

          {/* Animated underline */}
          <div
            className="absolute bottom-0 h-[2px] transition-all duration-300 ease-out"
            style={{
              background: "linear-gradient(90deg, transparent, var(--cyan), transparent)",
              boxShadow: "0 0 10px var(--cyan)",
              ...underlineStyle,
            }}
          />
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

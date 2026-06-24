"use client";

import { useRepoStore } from "@/store/repoStore";

function StatBadge({ icon, value }: { icon: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm"
      style={{
        background: "rgba(0,245,255,0.06)",
        border: "1px solid rgba(0,245,255,0.15)",
        color: "var(--text-secondary)",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "0.75rem",
        transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,245,255,0.4)";
        (e.currentTarget as HTMLElement).style.color = "var(--cyan)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px) scale(1.05)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,245,255,0.15)";
        (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
        (e.currentTarget as HTMLElement).style.transform = "none";
      }}
    >
      {icon} {value}
    </span>
  );
}

function RadarSweep() {
  return (
    <div className="relative flex-shrink-0" style={{ width: "76px", height: "76px" }}>
      {/* Outer pulse glow */}
      <div className="absolute inset-0 rounded-full animate-pulse-glow" style={{
        background: "radial-gradient(circle, rgba(0,245,255,0.12) 0%, transparent 70%)",
        transform: "scale(1.5)",
      }} />

      <svg width="76" height="76" viewBox="0 0 76 76" style={{ overflow: "visible" }}>
        <defs>
          {/* Radar sweep gradient — fades from bright leading edge to transparent */}
          <radialGradient id="sweep-grad" cx="38" cy="38" r="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(0,245,255,0)" />
            <stop offset="85%" stopColor="rgba(0,245,255,0.18)" />
            <stop offset="100%" stopColor="rgba(0,245,255,0)" />
          </radialGradient>
          <linearGradient id="sweep-line" x1="38" y1="38" x2="38" y2="6" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(0,245,255,0.9)" />
            <stop offset="100%" stopColor="rgba(0,245,255,0)" />
          </linearGradient>
        </defs>

        {/* Dark background circle */}
        <circle cx="38" cy="38" r="35" fill="rgba(7,10,26,0.9)" />

        {/* Concentric rings */}
        {[10, 20, 30].map((r) => (
          <circle key={r} cx="38" cy="38" r={r}
            fill="none" stroke="rgba(0,245,255,0.08)" strokeWidth="0.75" />
        ))}

        {/* Cross-hair lines */}
        <line x1="38" y1="8" x2="38" y2="68" stroke="rgba(0,245,255,0.06)" strokeWidth="0.75" />
        <line x1="8" y1="38" x2="68" y2="38" stroke="rgba(0,245,255,0.06)" strokeWidth="0.75" />

        {/* Outer ring */}
        <circle cx="38" cy="38" r="35" fill="none" stroke="rgba(0,245,255,0.2)" strokeWidth="1" />

        {/* === RADAR SWEEP === */}
        <g style={{ transformOrigin: "38px 38px", animation: "spin-slow 3s linear infinite" }}>
          {/* Sweep sector */}
          <path
            d="M 38 38 L 38 6 A 32 32 0 0 1 68 32 Z"
            fill="url(#sweep-grad)"
          />
          {/* Sweep leading edge line */}
          <line x1="38" y1="38" x2="38" y2="6"
            stroke="rgba(0,245,255,0.9)" strokeWidth="1.5" strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 4px #00f5ff)" }}
          />
          {/* Bright dot at tip */}
          <circle cx="38" cy="8" r="2"
            fill="#00f5ff"
            style={{ filter: "drop-shadow(0 0 4px #00f5ff)" }}
          />
        </g>

        {/* Center dot — static */}
        <circle cx="38" cy="38" r="3" fill="#00f5ff"
          style={{ filter: "drop-shadow(0 0 6px #00f5ff)" }} />
        <circle cx="38" cy="38" r="1.5" fill="white" />

        {/* Blip dots — simulated detected objects */}
        <circle cx="52" cy="24" r="2" fill="#ff00ff"
          style={{ filter: "drop-shadow(0 0 4px #ff00ff)", animation: "pulse-glow 2s 0.4s ease-in-out infinite" }} />
        <circle cx="22" cy="48" r="1.5" fill="#00f5ff"
          style={{ filter: "drop-shadow(0 0 3px #00f5ff)", animation: "pulse-glow 2s 1.1s ease-in-out infinite" }} />
        <circle cx="46" cy="54" r="1.2" fill="#ffd700"
          style={{ filter: "drop-shadow(0 0 3px #ffd700)", animation: "pulse-glow 2s 0.7s ease-in-out infinite" }} />
      </svg>
    </div>
  );
}


export default function RepoHeader() {
  const { data, reset } = useRepoStore();
  if (!data) return null;
  const { meta, analyzedAt } = data;

  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0)}k` : String(n);

  return (
    <div className="glass-card p-5 flex items-center justify-between"
      style={{ minHeight: "100px" }}>

      {/* Left: holographic orb + repo info */}
      <div className="flex items-center gap-5">
        <RadarSweep />
        <div>
          <div className="cyber-label">TARGET REPOSITORY</div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              {meta.owner} / <span className="neon-text-cyan">{meta.name}</span>
            </h1>
            <span className="text-xs px-2 py-0.5 rounded" style={{
              background: "rgba(0,245,255,0.1)",
              border: "1px solid rgba(0,245,255,0.3)",
              color: "var(--cyan)",
              fontFamily: "JetBrains Mono, monospace",
            }}>
              Public
            </span>
          </div>
          {meta.description && (
            <p className="text-sm mb-3" style={{ color: "var(--text-secondary)", maxWidth: "500px" }}>
              {meta.description}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <StatBadge icon="⭐" value={fmt(meta.stars)} />
            <StatBadge icon="🍴" value={fmt(meta.forks)} />
            {meta.language && <StatBadge icon="◈" value={meta.language} />}
            {meta.license && <StatBadge icon="⚖" value={meta.license} />}
          </div>
        </div>
      </div>

      {/* Right: timestamp + scan button */}
      <div className="text-right flex-shrink-0">
        <div className="cyber-label justify-end">ANALYSIS TIMESTAMP</div>
        <div className="text-sm mb-4" style={{
          color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace",
        }}>
          {new Date(analyzedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          {" "}·{" "}
          {new Date(analyzedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
        </div>
        <button onClick={reset} className="btn-cyber">
          ◆ SCAN NEW REPOSITORY
        </button>
      </div>
    </div>
  );
}

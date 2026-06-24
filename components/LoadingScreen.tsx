"use client";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,245,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Scanning animation */}
      <div className="relative mb-8">
        {/* Outer ring */}
        <svg
          width="160"
          height="160"
          viewBox="0 0 160 160"
          className="animate-spin-slow"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <circle
            cx="80"
            cy="80"
            r="75"
            fill="none"
            stroke="rgba(0,245,255,0.15)"
            strokeWidth="1"
          />
          <circle
            cx="80"
            cy="80"
            r="75"
            fill="none"
            stroke="url(#spin-grad)"
            strokeWidth="2"
            strokeDasharray="60 412"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="spin-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,245,255,0)" />
              <stop offset="100%" stopColor="#00f5ff" />
            </linearGradient>
          </defs>
        </svg>

        {/* Inner ring */}
        <svg
          width="160"
          height="160"
          viewBox="0 0 160 160"
          className="animate-spin-reverse"
        >
          <circle
            cx="80"
            cy="80"
            r="55"
            fill="none"
            stroke="rgba(255,0,255,0.2)"
            strokeWidth="1"
          />
          <circle
            cx="80"
            cy="80"
            r="55"
            fill="none"
            stroke="url(#spin-grad-2)"
            strokeWidth="2"
            strokeDasharray="40 305"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="spin-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,0,255,0)" />
              <stop offset="100%" stopColor="#ff00ff" />
            </linearGradient>
          </defs>
        </svg>

        {/* GitHub icon center */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            top: "35px",
            left: "35px",
            width: "90px",
            height: "90px",
          }}
        >
          <div
            className="animate-pulse-glow"
            style={{
              width: "50px",
              height: "50px",
              background: "rgba(0,245,255,0.1)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(0,245,255,0.3)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                stroke="#00f5ff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Status messages */}
      <div className="text-center">
        <div className="text-xl font-bold mb-2 neon-text-cyan font-mono">SCANNING REPOSITORY</div>
        <div
          className="text-sm animate-pulse-glow"
          style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}
        >
          Fetching commits · contributors · PRs · issues · releases
          <span className="animate-blink">_</span>
        </div>

        {/* Progress bars */}
        <div className="mt-8 w-64 space-y-2">
          {[
            { label: "Repository Metadata", delay: "0s", w: "95%" },
            { label: "Commit Activity", delay: "0.3s", w: "80%" },
            { label: "Contributors", delay: "0.6s", w: "70%" },
            { label: "Pull Requests", delay: "0.9s", w: "60%" },
            { label: "Computing Metrics", delay: "1.2s", w: "45%" },
          ].map((item, i) => (
            <div key={i} style={{ animationDelay: item.delay }}>
              <div className="flex justify-between text-xs mb-1" style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
                <span>{item.label}</span>
              </div>
              <div className="cyber-bar">
                <div
                  className="cyber-bar-fill"
                  style={{
                    width: item.w,
                    transition: `width 2s ${item.delay} ease-out`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

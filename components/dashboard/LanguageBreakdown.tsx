"use client";

import { useRepoStore } from "@/store/repoStore";

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3776ab",
  Java: "#f89820",
  "C++": "#00599c",
  C: "#555555",
  Rust: "#dea584",
  Go: "#00add8",
  Ruby: "#cc342d",
  PHP: "#777bb4",
  Swift: "#fa7343",
  Kotlin: "#7f52ff",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Shell: "#89e051",
  Vue: "#4dba87",
  Svelte: "#ff3e00",
  Dart: "#00b4ab",
};

export default function LanguageBreakdown() {
  const { data } = useRepoStore();
  if (!data) return null;
  const { languageBreakdown } = data;

  const top = languageBreakdown.slice(0, 6);

  return (
    <div className="glass-card bounce-card p-5">
      <div className="cyber-label">◆ LANGUAGE BREAKDOWN</div>

      {/* Stacked bar */}
      <div className="flex h-2.5 rounded-full overflow-hidden mb-4 gap-px">
        {top.map((lang, i) => (
          <div
            key={i}
            style={{
              width: `${lang.percentage}%`,
              background: LANG_COLORS[lang.name] ?? "#6366f1",
              boxShadow: `0 0 6px ${LANG_COLORS[lang.name] ?? "#6366f1"}80`,
              transition: `width 1s ${i * 0.1}s ease-out`,
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {top.map((lang, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: LANG_COLORS[lang.name] ?? "#6366f1",
                  flexShrink: 0,
                }}
              />
              <span
                className="text-xs"
                style={{ color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace" }}
              >
                {lang.name}
              </span>
            </div>
            <span
              className="text-xs"
              style={{ color: LANG_COLORS[lang.name] ?? "#6366f1", fontFamily: "JetBrains Mono, monospace" }}
            >
              {lang.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

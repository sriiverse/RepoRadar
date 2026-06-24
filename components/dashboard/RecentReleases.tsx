"use client";

import { useRepoStore } from "@/store/repoStore";

export default function RecentReleases() {
  const { data } = useRepoStore();
  if (!data) return null;
  const { releases } = data;

  const top = releases.slice(0, 4);

  const timeAgo = (dateStr: string) => {
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  return (
    <div className="glass-card bounce-card p-5">
      <div className="cyber-label">◆ RECENT RELEASES</div>

      {top.length === 0 ? (
        <div className="text-xs text-center py-4" style={{ color: "var(--text-muted)" }}>
          No releases found
        </div>
      ) : (
        <div className="space-y-3">
          {top.map((release, i) => (
            <a
              key={i}
              href={release.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-2.5 rounded-lg transition-all duration-200 hover:scale-102"
              style={{
                background: "rgba(0,245,255,0.04)",
                border: "1px solid rgba(0,245,255,0.08)",
                transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,245,255,0.3)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px) scale(1.02)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,245,255,0.08)";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >
              <div className="flex justify-between items-start">
                <span
                  className="text-xs font-semibold neon-text-cyan"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  {release.tag}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}
                >
                  {timeAgo(release.publishedAt)}
                </span>
              </div>
              {release.name && release.name !== release.tag && (
                <div
                  className="text-xs mt-0.5 truncate"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {release.name}
                </div>
              )}
            </a>
          ))}
        </div>
      )}

      {releases.length > 4 && (
        <a
          href={`https://github.com/${data.meta.full_name}/releases`}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-3 text-xs text-center"
          style={{ color: "var(--cyan)", fontFamily: "JetBrains Mono, monospace" }}
        >
          View all releases →
        </a>
      )}
    </div>
  );
}

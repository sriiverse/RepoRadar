"use client";

import { useRepoStore } from "@/store/repoStore";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useEffect } from "react";

export default function CommitHeatmap() {
  const { data } = useRepoStore();

  // Force-patch SVG rect fills after render (CSS specificity nuclear option)
  useEffect(() => {
    const patch = () => {
      const heatmap = document.querySelector(".react-calendar-heatmap");
      if (!heatmap) return;
      heatmap.querySelectorAll("rect.color-empty").forEach((el) => {
        (el as SVGElement).style.fill = "#0f1729";
      });
      heatmap.querySelectorAll("rect.color-scale-1").forEach((el) => {
        (el as SVGElement).style.fill = "#0d2845";
      });
      heatmap.querySelectorAll("rect.color-scale-2").forEach((el) => {
        (el as SVGElement).style.fill = "#00a8cc";
        (el as SVGElement).style.filter = "drop-shadow(0 0 3px rgba(0,245,255,0.6))";
      });
      heatmap.querySelectorAll("rect.color-scale-3").forEach((el) => {
        (el as SVGElement).style.fill = "#00f5ff";
        (el as SVGElement).style.filter = "drop-shadow(0 0 5px rgba(0,245,255,0.9))";
      });
      heatmap.querySelectorAll("rect.color-scale-4").forEach((el) => {
        (el as SVGElement).style.fill = "#ff00ff";
        (el as SVGElement).style.filter = "drop-shadow(0 0 7px rgba(255,0,255,1))";
      });
      heatmap.querySelectorAll("text").forEach((el) => {
        (el as SVGElement).style.fill = "#1e3a5f";
      });
    };
    // Run immediately and after short delay for hydration
    patch();
    const t = setTimeout(patch, 300);
    return () => clearTimeout(t);
  }, [data]);

  if (!data) return null;
  const { commitActivity } = data;

  const values: { date: string; count: number }[] = [];
  for (const week of commitActivity) {
    for (let d = 0; d < 7; d++) {
      const date = new Date((week.week + d * 86400) * 1000);
      values.push({
        date: date.toISOString().split("T")[0],
        count: week.days[d] ?? 0,
      });
    }
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  // Dynamic scaling parameters
  const peakCommits = values.reduce((max, v) => Math.max(max, v.count), 0);

  const getScaleBrackets = (max: number) => {
    if (max <= 4) {
      return {
        s1: 1,
        s2: 2,
        s3: 3,
        s4: 4,
        labels: ["0", "1", "2", "3", "4+"]
      };
    }
    const step = max / 4;
    const s1 = Math.max(1, Math.round(step));
    const s2 = Math.max(s1 + 1, Math.round(step * 2));
    const s3 = Math.max(s2 + 1, Math.round(step * 3));
    const s4 = max;

    return {
      s1,
      s2,
      s3,
      s4,
      labels: [
        "0",
        `1-${s1}`,
        `${s1 + 1}-${s2}`,
        `${s2 + 1}-${s3}`,
        `${s3 + 1}+`
      ]
    };
  };

  const scale = getScaleBrackets(peakCommits);

  const getClassForValue = (value: { count: number } | null) => {
    if (!value || value.count === 0) return "color-empty";
    if (value.count <= scale.s1) return "color-scale-1";
    if (value.count <= scale.s2) return "color-scale-2";
    if (value.count <= scale.s3) return "color-scale-3";
    return "color-scale-4";
  };

  const totalCommits = values.reduce((s, v) => s + v.count, 0);
  const activeDays = values.filter((v) => v.count > 0).length;

  // Streaks calculation
  const sortedValues = [...values].sort((a, b) => a.date.localeCompare(b.date));
  let longestStreak = 0;
  let currentStreakVal = 0;
  for (const val of sortedValues) {
    if (val.count > 0) {
      currentStreakVal++;
      if (currentStreakVal > longestStreak) {
        longestStreak = currentStreakVal;
      }
    } else {
      currentStreakVal = 0;
    }
  }

  let activeCurrentStreak = 0;
  const lastIndex = sortedValues.length - 1;
  if (lastIndex >= 0) {
    const todayCommits = sortedValues[lastIndex].count;
    const yesterdayCommits = lastIndex >= 1 ? sortedValues[lastIndex - 1].count : 0;

    if (todayCommits > 0) {
      for (let i = lastIndex; i >= 0; i--) {
        if (sortedValues[i].count > 0) {
          activeCurrentStreak++;
        } else {
          break;
        }
      }
    } else if (yesterdayCommits > 0) {
      for (let i = lastIndex - 1; i >= 0; i--) {
        if (sortedValues[i].count > 0) {
          activeCurrentStreak++;
        } else {
          break;
        }
      }
    } else {
      activeCurrentStreak = 0;
    }
  }

  return (
    <div
      className="glass-card bounce-card p-5 h-full"
      style={{ background: "rgba(7, 10, 20, 0.95)" }}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-1">
        <div className="cyber-label">◆ COMMIT ACTIVITY HEATMAP</div>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs" style={{ fontFamily: "JetBrains Mono, monospace" }}>
          <div>
            <span style={{ color: "var(--cyan)" }}>{totalCommits.toLocaleString()}</span>
            <span style={{ color: "var(--text-muted)" }}> Commits</span>
          </div>
          <div>
            <span style={{ color: "#ff00ff" }}>{activeDays}</span>
            <span style={{ color: "var(--text-muted)" }}> Active Days</span>
          </div>
          <div>
            <span style={{ color: "#00f5ff" }}>Peak Day: {peakCommits} commits</span>
          </div>
          <div>
            <span style={{ color: "#a855f7" }}>Current: {activeCurrentStreak > 0 ? `${activeCurrentStreak}d` : "—"}</span>
            <span className="text-slate-700 px-1.5">|</span>
            <span style={{ color: "#a855f7" }}>Longest: {longestStreak}d</span>
          </div>
        </div>
      </div>
      <div className="text-xs mb-4" style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
        Repository commit history
      </div>

      <div style={{ fontSize: "11px" }}>
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={values}
          classForValue={getClassForValue}
          showWeekdayLabels
          weekdayLabels={["", "Mon", "", "Wed", "", "Fri", ""]}
          tooltipDataAttrs={(value: { date: string; count: number } | null) => {
            if (!value || !value.date) return {};
            return { "data-tip": `${value.date}: ${value.count} commits` };
          }}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
          Daily commits: Low
        </span>
        {[
          { c: "#0f1729", label: scale.labels[0] },
          { c: "#0d2845", label: scale.labels[1] },
          { c: "#00a8cc", label: scale.labels[2] },
          { c: "#00f5ff", label: scale.labels[3] },
          { c: "#ff00ff", label: scale.labels[4] },
        ].map((item, i) => (
          <div
            key={i}
            title={`${item.label} commits`}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "3px",
              background: item.c,
              boxShadow: i >= 2 ? `0 0 5px ${item.c}` : `0 0 0 1px rgba(255,255,255,0.08)`,
              cursor: "default",
            }}
          />
        ))}
        <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
          High
        </span>
      </div>
    </div>
  );
}

"use client";

import { useRepoStore } from "@/store/repoStore";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

export default function ActivityTrend() {
  const { data } = useRepoStore();
  if (!data) return null;
  const { commitActivity } = data;

  const last24Weeks = commitActivity.slice(-24);
  const chartData = last24Weeks.map((w, i) => ({
    week: i + 1,
    commits: w.total,
    label: new Date(w.week * 1000).toLocaleDateString("en-US", { month: "short" }),
  }));

  // Flatten all days in the 24-week period to compute daily stats
  const allDays = last24Weeks.flatMap((w) => w.days);
  const peakDaily = Math.max(...allDays, 0);

  const totalCommits = last24Weeks.reduce((sum, w) => sum + w.total, 0);
  const averageDaily = Math.round((totalCommits / (last24Weeks.length * 7)) * 10) / 10;

  // Weekly commits average for reference line positioning
  const weeklyAvg = Math.round(totalCommits / last24Weeks.length);

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: "rgba(7,7,26,0.98)",
          border: "1px solid rgba(0,245,255,0.4)",
          borderRadius: "8px",
          padding: "8px 12px",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "0.72rem",
          boxShadow: "0 0 15px rgba(0,245,255,0.2)",
        }}>
          <div style={{ color: "var(--text-muted)", marginBottom: "2px" }}>Week {label}</div>
          <div style={{ color: "#00f5ff", fontWeight: "700", fontSize: "1rem" }}>
            {payload[0].value}
            <span style={{ fontSize: "0.65rem", marginLeft: "4px", color: "var(--text-muted)" }}>commits</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="glass-card bounce-card p-5 h-full"
      style={{
        background: "rgba(7, 10, 20, 0.9)",
        boxShadow: "0 0 20px rgba(0,245,255,0.08), inset 0 0 30px rgba(0,0,0,0.4)",
      }}
    >
      <div className="cyber-label mb-1">ACTIVITY TREND</div>
      <div className="text-xs mb-3" style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
        COMMIT FREQUENCY · LAST 24 WEEKS
      </div>

      <ResponsiveContainer width="100%" height={170}>
        <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="ecg-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00f5ff" stopOpacity={0.25} />
              <stop offset="60%" stopColor="#00f5ff" stopOpacity={0.05} />
              <stop offset="100%" stopColor="#00f5ff" stopOpacity={0} />
            </linearGradient>
            <filter id="line-glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Subtle grid lines */}
          <XAxis
            dataKey="label"
            tick={{ fill: "#1e3a5f", fontSize: 8, fontFamily: "JetBrains Mono" }}
            axisLine={{ stroke: "rgba(0,245,255,0.06)" }}
            tickLine={false}
            interval={5}
          />
          <YAxis
            tick={{ fill: "#1e3a5f", fontSize: 8, fontFamily: "JetBrains Mono" }}
            axisLine={false}
            tickLine={false}
          />

          {/* Average reference line */}
          <ReferenceLine
            y={weeklyAvg}
            stroke="rgba(255,215,0,0.2)"
            strokeDasharray="4 4"
            label={{
              value: `weekly avg ${weeklyAvg}`,
              fill: "rgba(255,215,0,0.4)",
              fontSize: 8,
              fontFamily: "JetBrains Mono",
            }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="commits"
            stroke="#00f5ff"
            strokeWidth={2.5}
            fill="url(#ecg-grad)"
            dot={false}
            activeDot={{
              r: 5,
              fill: "#00f5ff",
              stroke: "rgba(0,245,255,0.3)",
              strokeWidth: 6,
              filter: "url(#line-glow)",
            }}
            style={{ filter: "url(#line-glow)" }}
            animationDuration={2000}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Stats strip */}
      <div
        className="flex justify-between mt-2 pt-2 text-[10px]"
        style={{
          borderTop: "1px solid rgba(0,245,255,0.06)",
          fontFamily: "JetBrains Mono, monospace",
          color: "var(--text-muted)",
        }}
      >
        <div>
          PEAK DAILY <span style={{ color: "#ff00ff", fontWeight: "700" }}>{peakDaily}</span>
        </div>
        <div>
          AVERAGE DAILY <span style={{ color: "#00f5ff", fontWeight: "700" }}>{averageDaily}</span>
        </div>
        <div>
          TOTAL COMMITS <span style={{ color: "#00ff88", fontWeight: "700" }}>
            {totalCommits}
          </span>
        </div>
      </div>
    </div>
  );
}

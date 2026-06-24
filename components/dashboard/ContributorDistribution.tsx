"use client";

import { useRepoStore } from "@/store/repoStore";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const CHART_COLORS = [
  "#00f5ff", "#7c3aed", "#ff00ff", "#ff6b35", "#ffd700", "#00ff88", "#3b82f6",
];

export default function ContributorDistribution() {
  const { data } = useRepoStore();
  if (!data) return null;
  const { busFactor } = data;

  const top5 = busFactor.contributors.slice(0, 5);
  const othersTotal = busFactor.contributors
    .slice(5)
    .reduce((s, c) => s + c.percentage, 0);

  const chartData = [
    ...top5.map((c) => ({ name: c.login, value: Math.round(c.percentage * 10) / 10 })),
    ...(othersTotal > 0 ? [{ name: "Others", value: Math.round(othersTotal * 10) / 10 }] : []),
  ];

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "rgba(13,13,43,0.95)",
            border: "1px solid rgba(0,245,255,0.3)",
            borderRadius: "8px",
            padding: "8px 12px",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.75rem",
            color: "var(--text-primary)",
          }}
        >
          <div>{payload[0].name}</div>
          <div style={{ color: "var(--cyan)" }}>{payload[0].value}%</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card bounce-card p-5 h-full">
      <div className="cyber-label">◆ CONTRIBUTOR DISTRIBUTION</div>

      <div className="flex items-center gap-4">
        <ResponsiveContainer width={130} height={130}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={38}
              outerRadius={58}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={1200}
            >
              {chartData.map((_, i) => (
                <Cell
                  key={i}
                  fill={CHART_COLORS[i % CHART_COLORS.length]}
                  style={{
                    filter: `drop-shadow(0 0 4px ${CHART_COLORS[i % CHART_COLORS.length]}80)`,
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex-1 space-y-1.5">
          {chartData.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: CHART_COLORS[i % CHART_COLORS.length],
                    boxShadow: `0 0 4px ${CHART_COLORS[i % CHART_COLORS.length]}`,
                    flexShrink: 0,
                  }}
                />
                <span
                  className="text-xs truncate max-w-[80px]"
                  style={{ color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace" }}
                >
                  {item.name}
                </span>
              </div>
              <span
                className="text-xs"
                style={{ color: CHART_COLORS[i % CHART_COLORS.length], fontFamily: "JetBrains Mono, monospace" }}
              >
                {item.value}%
              </span>
            </div>
          ))}
          <div
            className="text-xs pt-1 mt-2"
            style={{
              color: "var(--text-muted)",
              fontFamily: "JetBrains Mono, monospace",
              borderTop: "1px solid rgba(0,245,255,0.08)",
            }}
          >
            Total {data.contributors.length} contributors
          </div>
        </div>
      </div>
    </div>
  );
}

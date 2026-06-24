"use client";

import { useEffect, useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";

export default function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState("activity");
  const [stars, setStars] = useState(41829);
  const [openIssues, setOpenIssues] = useState(243);

  // Auto-cycle stats slightly to make the dashboard look active
  useEffect(() => {
    const interval = setInterval(() => {
      setStars((prev) => prev + Math.floor(Math.random() * 3));
      if (Math.random() > 0.7) {
        setOpenIssues((prev) => Math.max(235, prev + (Math.random() > 0.5 ? 1 : -1)));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Commit activity data for chart
  const chartData = useMemo(() => [
    { name: "Week 1", commits: 25 },
    { name: "Week 2", commits: 45 },
    { name: "Week 3", commits: 30 },
    { name: "Week 4", commits: 85 },
    { name: "Week 5", commits: 60 },
    { name: "Week 6", commits: 120 },
    { name: "Week 7", commits: 95 },
    { name: "Week 8", commits: 140 },
    { name: "Week 9", commits: 110 },
    { name: "Week 10", commits: 165 },
    { name: "Week 11", commits: 130 },
    { name: "Week 12", commits: 180 },
  ], []);

  // Generate 7 rows of 40 columns for the Git activity heatmap grid
  const heatmapGrid = useMemo(() => {
    return Array.from({ length: 7 }).map((_, rowIndex) =>
      Array.from({ length: 42 }).map((_, colIndex) => {
        // Randomize activity colors: empty (dark), light, medium, intense (cyan/purple)
        const rand = Math.random();
        let color = "#0d1117"; // Empty
        let level = 0;
        if (rand > 0.85) {
          color = "#ff00ff"; // Intense purple
          level = 3;
        } else if (rand > 0.65) {
          color = "#00f5ff"; // Cyan
          level = 2;
        } else if (rand > 0.4) {
          color = "rgba(0, 245, 255, 0.25)"; // Dim cyan
          level = 1;
        }
        return { color, level, delay: (rowIndex * colIndex) * 0.003 };
      })
    );
  }, []);

  return (
    <section className="py-24 max-w-[1200px] mx-auto px-6 relative z-20">
      <div className="text-center mb-16">
        <h2 className="text-[10px] font-bold tracking-[0.25em] text-[#a855f7] uppercase font-mono mb-4">
          INTERACTIVE DEMO
        </h2>
        <p className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
          Experience RepoRadar live
        </p>
        <p className="text-slate-400 max-w-[600px] mx-auto text-sm md:text-base">
          This is a simulated preview of the intelligence dashboard generated instantly for any scanned codebase.
        </p>
      </div>

      {/* Floating Glass Dashboard Container */}
      <div className="w-full rounded-2xl border border-white/[0.08] bg-[#070914]/65 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.04)] overflow-hidden">
        
        {/* Dashboard Header Bar */}
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between flex-wrap gap-4 bg-[#0a0d1a]/50">
          <div className="flex items-center gap-3">
            {/* Red / Yellow / Green simulated OS window pills */}
            <div className="flex items-center gap-1.5 mr-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest text-[#00f5ff] bg-[#00f5ff]/10 px-2 py-0.5 rounded font-mono">
                PUBLIC
              </span>
              <h3 className="text-sm font-black text-white font-mono tracking-tight">
                facebook/react
              </h3>
            </div>
          </div>

          {/* Navigation tabs inside the demo */}
          <div className="flex items-center gap-2 border-l border-white/[0.08] pl-4">
            {["activity", "heatmap", "languages"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase font-mono transition-all ${
                  activeTab === tab
                    ? "bg-[#a855f7]/15 text-[#a855f7] border border-[#a855f7]/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Sub-Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/[0.06] bg-[#060814]/30 divide-x divide-y md:divide-y-0 divide-white/[0.06]">
          <div className="p-6">
            <div className="text-[10px] font-bold tracking-wider text-slate-500 font-mono mb-1">STARS</div>
            <div className="text-xl font-black text-white font-mono">{stars.toLocaleString()}</div>
          </div>
          <div className="p-6">
            <div className="text-[10px] font-bold tracking-wider text-slate-500 font-mono mb-1">OPEN ISSUES</div>
            <div className="text-xl font-black text-white font-mono">{openIssues}</div>
          </div>
          <div className="p-6">
            <div className="text-[10px] font-bold tracking-wider text-slate-500 font-mono mb-1">HEALTH METRIC</div>
            <div className="text-xl font-black text-emerald-400 font-mono flex items-center gap-1">
              94% <span className="text-[10px] font-bold text-emerald-500 uppercase font-mono">(EXCELLENT)</span>
            </div>
          </div>
          <div className="p-6">
            <div className="text-[10px] font-bold tracking-wider text-slate-500 font-mono mb-1">BUS FACTOR RISK</div>
            <div className="text-xl font-black text-amber-400 font-mono flex items-center gap-1.5">
              <span>Medium</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Demo Dynamic Panel Content */}
        <div className="p-8 min-h-[300px] flex items-center justify-center relative">
          
          <AnimatePresence mode="wait">
            
            {/* Tab 1: Commit Velocity Line/Area Chart */}
            {activeTab === "activity" && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#a855f7]" />
                    <h4 className="text-xs font-bold text-white tracking-wider font-mono uppercase">
                      Commit Frequency Trend
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">Last 12 weeks</span>
                </div>
                <div className="w-full h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="demoGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.15)" style={{ fontSize: "9px", fontFamily: "monospace" }} />
                      <YAxis stroke="rgba(255,255,255,0.15)" style={{ fontSize: "9px", fontFamily: "monospace" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(10, 13, 26, 0.95)",
                          borderColor: "rgba(168, 85, 247, 0.3)",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="commits"
                        stroke="#a855f7"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#demoGlow)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* Tab 2: Activity Heatmap grid */}
            {activeTab === "heatmap" && (
              <motion.div
                key="heatmap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col justify-center"
              >
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xs font-bold text-white tracking-wider font-mono uppercase">
                    Interactive Activity Heatmap
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">Last 300 days</span>
                </div>
                
                {/* Heatmap Grid Map */}
                <div className="flex flex-col gap-1.5 overflow-x-auto pb-4 max-w-full">
                  {heatmapGrid.map((row, rIdx) => (
                    <div key={rIdx} className="flex gap-1.5 min-w-max">
                      {row.map((cell, cIdx) => (
                        <motion.div
                          key={cIdx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: cell.delay, duration: 0.4 }}
                          whileHover={{ scale: 1.3, zIndex: 10 }}
                          className="w-4 h-4 rounded-sm transition-shadow hover:shadow-[0_0_8px_rgba(0,245,255,0.6)] cursor-crosshair"
                          style={{
                            background: cell.color,
                            border: cell.level === 0 ? "1px solid rgba(255,255,255,0.03)" : "none",
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-slate-500 font-mono">
                  <span>Less</span>
                  <div className="w-3.5 h-3.5 rounded-sm bg-[#0d1117] border border-white/5" />
                  <div className="w-3.5 h-3.5 rounded-sm bg-cyan-500/25" />
                  <div className="w-3.5 h-3.5 rounded-sm bg-[#00f5ff]" />
                  <div className="w-3.5 h-3.5 rounded-sm bg-[#ff00ff]" />
                  <span>More</span>
                </div>
              </motion.div>
            )}

            {/* Tab 3: Language Composition breakdown bar */}
            {activeTab === "languages" && (
              <motion.div
                key="languages"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white tracking-wider font-mono uppercase">
                    Codebase language analytics
                  </h4>
                  <span className="text-[10px] font-mono text-[#00f5ff]">985,482 bytes</span>
                </div>

                {/* Multilingual breakdown bar */}
                <div className="w-full h-4 rounded-full overflow-hidden flex bg-white/[0.05] p-0.5 border border-white/10">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: "65%" }} />
                  <div className="h-full bg-purple-500 rounded-full -ml-1" style={{ width: "20%" }} />
                  <div className="h-full bg-pink-500 rounded-full -ml-1" style={{ width: "10%" }} />
                  <div className="h-full bg-amber-400 rounded-full -ml-1" style={{ width: "5%" }} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4">
                  {[
                    { lang: "TypeScript", share: "65%", bytes: "640,563 B", color: "bg-cyan-400" },
                    { lang: "JavaScript", share: "20%", bytes: "197,096 B", color: "bg-purple-500" },
                    { lang: "HTML & CSS", share: "10%", bytes: "98,548 B", color: "bg-pink-500" },
                    { lang: "Rust", share: "5%", bytes: "49,274 B", color: "bg-amber-400" },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                        <span className="text-xs font-bold text-white font-mono">{item.lang}</span>
                      </div>
                      <div className="text-lg font-black text-slate-300 font-mono">{item.share}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">{item.bytes}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}

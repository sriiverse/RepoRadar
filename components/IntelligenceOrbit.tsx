"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const HolographicCore = dynamic(() => import("./HolographicCore"), { ssr: false });

interface IntelligenceOrbitProps {
  scanPhase?: string;
}

export default function IntelligenceOrbit({ scanPhase = "idle" }: IntelligenceOrbitProps) {
  const [pulseActive, setPulseActive] = useState(false);

  // Periodically pulse the core to simulate data packets arriving and being digested
  useEffect(() => {
    if (scanPhase !== "idle") return; // Let scan handling manage pulses during scan
    
    const interval = setInterval(() => {
      // 1.5s after packet visual start, trigger the pulse
      setTimeout(() => {
        setPulseActive(true);
        setTimeout(() => setPulseActive(false), 600);
      }, 1500);
    }, 4000);

    return () => clearInterval(interval);
  }, [scanPhase]);

  // Adjust core properties based on scanning phase
  const coreSpeed = 
    scanPhase === "glow" ? 1.5 :
    scanPhase === "travel" ? 2.5 :
    scanPhase === "power-on" ? 5.0 :
    scanPhase === "accelerate" ? 6.0 :
    scanPhase === "modules" ? 2.0 :
    scanPhase === "done" ? 1.0 : 1.0;

  const corePulse = pulseActive || ["power-on", "accelerate"].includes(scanPhase) ? 1.5 : 1.0;

  // Bezier Paths connecting each card's connection point to the Core Center [500, 400]
  const paths = {
    health: "M 270,160 Q 380,160 500,400",
    commits: "M 260,370 Q 380,370 500,400",
    contributors: "M 280,580 Q 380,580 500,400",
    busFactor: "M 730,160 Q 620,160 500,400",
    releases: "M 740,370 Q 620,370 500,400",
    languages: "M 720,580 Q 620,580 500,400"
  };

  return (
    <div className="absolute inset-0 w-[1000px] h-[800px] flex items-center justify-center pointer-events-none z-10">
      
      {/* 1. Curved Connection Lines & Data Packets */}
      <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-10">
        <defs>
          <filter id="neonCyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="neonPurple" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Draw background connecting wires */}
        {Object.entries(paths).map(([key, pathD]) => (
          <path
            key={`bg-${key}`}
            d={pathD}
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1.5"
          />
        ))}

        {/* Draw animated neon packets flowing from modules -> core */}
        {Object.entries(paths).map(([key, pathD]) => {
          const isScanningPhase = scanPhase !== "idle";
          const animDuration = isScanningPhase ? 1.0 : 4.0;
          return (
            <motion.path
              key={`packet-${key}`}
              d={pathD}
              fill="none"
              stroke={key === "health" || key === "languages" || key === "releases" ? "#00f5ff" : "#a855f7"}
              strokeWidth="2"
              strokeDasharray={isScanningPhase ? "15, 60" : "8, 120"}
              filter={key === "health" || key === "languages" || key === "releases" ? "url(#neonCyan)" : "url(#neonPurple)"}
              animate={{
                strokeDashoffset: [0, -300],
              }}
              transition={{
                duration: animDuration,
                repeat: Infinity,
                ease: "linear",
              }}
              opacity={scanPhase === "done" ? 0 : 0.75}
            />
          );
        })}
      </svg>

      {/* 2. Central 3D Core Container */}
      <div className="absolute inset-0 z-20 pointer-events-none w-[1000px] h-[800px] flex items-center justify-center">
        <div className="w-[500px] h-[500px]">
          <HolographicCore speedMultiplier={coreSpeed} pulseIntensity={corePulse} />
        </div>
      </div>

      {/* 3. Floating Modules (Asymmetrical constellation) */}
      
      {/* ── LEFT FLANK ── */}
      <div className="absolute left-[20px] top-[100px] w-[250px] pointer-events-auto z-30">
        <motion.div
          whileHover={{ scale: 1.04, y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="px-6 py-5 rounded-[16px] border border-white/[0.06] bg-[#070914]/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-[#00f5ff]/40 hover:shadow-[0_0_25px_rgba(0,245,255,0.15)] transition-all"
        >
          <div className="text-[9px] font-bold tracking-[0.2em] text-[#00f5ff] mb-2 uppercase font-mono">HEALTH SCORE</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[32px] font-black text-white leading-none">94</div>
              <div className="text-[10px] font-medium text-slate-400 mt-1 uppercase font-mono">Excellent</div>
            </div>
            <div className="w-9 h-9 rounded-full border-2 border-[#00f5ff] flex items-center justify-center shadow-[0_0_15px_rgba(0,245,255,0.3)]">
              <span className="text-[10px] text-[#00f5ff] font-mono">OK</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute left-[10px] top-[310px] w-[250px] pointer-events-auto z-30">
        <motion.div
          whileHover={{ scale: 1.04, y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="px-6 py-5 rounded-[16px] border border-white/[0.06] bg-[#070914]/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-[#a855f7]/40 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)] transition-all"
        >
          <div className="text-[9px] font-bold tracking-[0.2em] text-slate-400 mb-2 uppercase font-mono">COMMITS</div>
          <div>
            <div className="text-[32px] font-black text-[#a855f7] leading-none" style={{ textShadow: "0 0 15px rgba(168,85,247,0.4)" }}>1,240</div>
            <div className="text-[10px] font-bold text-emerald-400 mt-2 uppercase font-mono flex items-center gap-1">
              <span>+18%</span> this month
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute left-[30px] top-[520px] w-[250px] pointer-events-auto z-30">
        <motion.div
          whileHover={{ scale: 1.04, y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="px-6 py-5 rounded-[16px] border border-white/[0.06] bg-[#070914]/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-[#a855f7]/40 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)] transition-all"
        >
          <div className="text-[9px] font-bold tracking-[0.2em] text-slate-400 mb-2 uppercase font-mono">CONTRIBUTORS</div>
          <div>
            <div className="text-[32px] font-black text-white leading-none">14</div>
            <div className="text-[10px] font-bold text-purple-400 mt-2 uppercase font-mono">Active core devs</div>
          </div>
        </motion.div>
      </div>

      {/* ── RIGHT FLANK ── */}
      <div className="absolute right-[20px] top-[100px] w-[250px] pointer-events-auto z-30">
        <motion.div
          whileHover={{ scale: 1.04, y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="px-6 py-5 rounded-[16px] border border-white/[0.06] bg-[#070914]/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-[#a855f7]/40 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)] transition-all"
        >
          <div className="text-[9px] font-bold tracking-[0.2em] text-slate-400 mb-2 uppercase font-mono">BUS FACTOR</div>
          <div>
            <div className="text-[32px] font-black text-white leading-none">2</div>
            <div className="text-[10px] font-bold text-rose-500 mt-2 uppercase font-mono">Medium Risk</div>
          </div>
        </motion.div>
      </div>

      <div className="absolute right-[10px] top-[310px] w-[250px] pointer-events-auto z-30">
        <motion.div
          whileHover={{ scale: 1.04, y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="px-6 py-5 rounded-[16px] border border-white/[0.06] bg-[#070914]/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-[#00f5ff]/40 hover:shadow-[0_0_25px_rgba(0,245,255,0.15)] transition-all"
        >
          <div className="text-[9px] font-bold tracking-[0.2em] text-slate-400 mb-2 uppercase font-mono">RELEASES</div>
          <div>
            <div className="text-[32px] font-black text-white leading-none">v1.4.2</div>
            <div className="text-[10px] font-bold text-[#00f5ff] mt-2 uppercase font-mono">Latest stable</div>
          </div>
        </motion.div>
      </div>

      <div className="absolute right-[30px] top-[520px] w-[250px] pointer-events-auto z-30">
        <motion.div
          whileHover={{ scale: 1.04, y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="px-6 py-5 rounded-[16px] border border-white/[0.06] bg-[#070914]/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-[#00f5ff]/40 hover:shadow-[0_0_25px_rgba(0,245,255,0.15)] transition-all"
        >
          <div className="text-[9px] font-bold tracking-[0.2em] text-slate-400 mb-2 uppercase font-mono">LANGUAGES</div>
          <div>
            <div className="text-[13px] font-bold text-white mb-3 uppercase font-mono">TS • CSS • HTML</div>
            <div className="w-full h-1.5 rounded-full overflow-hidden flex bg-white/[0.08]">
              <div className="h-full bg-[#00f5ff] w-[60%]" />
              <div className="h-full bg-[#a855f7] w-[25%]" />
              <div className="h-full bg-slate-500 w-[15%]" />
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}

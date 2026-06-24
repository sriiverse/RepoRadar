const fs = require('fs');
const path = require('path');

const landingPageContent = `"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRepoStore } from "@/store/repoStore";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, animate } from "framer-motion";

function Counter({ value, duration = 1.8 }: { value: string; duration?: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  
  const parsed = useMemo(() => {
    const numMatch = value.match(/^([\\d.,]+)/);
    if (!numMatch) return { num: 0, suffix: value, decimals: 0 };
    const numStr = numMatch[1].replace(/,/g, '');
    const num = parseFloat(numStr);
    const suffix = value.substring(numMatch[0].length);
    const decMatch = numStr.split('.');
    const decimals = decMatch[1] ? decMatch[1].length : 0;
    return { num, suffix, decimals };
  }, [value]);

  useEffect(() => {
    if (typeof window === "undefined" || !nodeRef.current) return;
    const node = nodeRef.current;
    const controls = animate(0, parsed.num, {
      duration,
      ease: "easeOut",
      onUpdate(latest) {
        node.textContent = latest.toLocaleString('en-US', {
          minimumFractionDigits: parsed.decimals,
          maximumFractionDigits: parsed.decimals,
        }) + parsed.suffix;
      },
    });
    return () => controls.stop();
  }, [parsed, duration]);

  return <span ref={nodeRef}>{value}</span>;
}

const IntelligenceOrbit = dynamic(() => import("./IntelligenceOrbit"), {
  ssr: false,
});

function BackgroundAtmosphere() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-[#03050C]" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: \`
            radial-gradient(circle at 30% 40%, rgba(168,85,247,0.15), transparent 50%),
            radial-gradient(circle at 70% 60%, rgba(0,245,255,0.1), transparent 50%)
          \`,
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: \`
            linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)
          \`,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at 50% 50%, black, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black, transparent 80%)",
        }}
      />
    </div>
  );
}

export default function LandingPage() {
  const [inputValue, setInputValue] = useState("");
  const { analyze, loading, error } = useRepoStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const [scanning, setScanning] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setScanning(true);
      setTimeout(() => {
        setScanning(false);
        analyze(inputValue.trim());
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden select-none bg-[#03050C]">
      <BackgroundAtmosphere />
      
      {/* ── TOP NAV ── */}
      <nav className="relative z-30 flex items-center justify-between px-12 py-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/[0.08]" style={{ background: "rgba(255,255,255,0.03)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </div>
          <div>
            <div className="text-[14px] font-black tracking-widest text-white leading-none mb-1">REPORADAR</div>
            <div className="text-[9px] font-bold tracking-[0.25em] text-[#a855f7] uppercase font-mono">GITHUB REPOSITORY INTELLIGENCE</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-12">
          {["FEATURES", "HOW IT WORKS", "DOCS", "PRICING"].map(link => (
            <a key={link} href="#" className="text-[11px] font-bold tracking-[0.15em] text-slate-400 hover:text-white uppercase font-mono transition-colors">
              {link}
            </a>
          ))}
        </div>

        <div>
          <button className="px-7 py-2.5 rounded-full border border-[#a855f7]/40 text-[#a855f7] text-[10px] font-bold tracking-widest hover:bg-[rgba(168,85,247,0.1)] hover:border-[#a855f7] transition-all font-mono">
            LAUNCH APP &rarr;
          </button>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 w-full max-w-[1400px] mx-auto px-10 flex-1 flex flex-col justify-center pb-8 mt-4">
        
        <div className="flex flex-col lg:flex-row items-center relative z-20 w-full">
          
          {/* Left Column */}
          <div className="flex flex-col w-full lg:w-5/12 z-30">
            <div className="text-[11px] tracking-[0.25em] font-bold text-[#a855f7] mb-8 font-mono">
              ANALYZE. PREDICT. PROTECT.
            </div>
            
            <h1 className="text-[4.5rem] font-black leading-[1.05] tracking-tight mb-8">
              <span className="text-white">SEE THE REAL</span><br/>
              <span className="text-[#a855f7]" style={{ textShadow: "0 0 40px rgba(168,85,247,0.5)" }}>HEALTH</span> <span className="text-white">OF ANY</span><br/>
              <span className="text-[#a855f7]" style={{ textShadow: "0 0 40px rgba(168,85,247,0.5)" }}>GITHUB</span> <span className="text-white">REPO</span>
            </h1>
            
            <p className="text-slate-400 text-lg mb-12 max-w-[450px]">
              Intelligence that helps you build better, safer, and faster.
            </p>

            <form onSubmit={handleSubmit} className="flex items-center rounded-full p-2 w-full max-w-[500px] mb-6 border border-white/[0.1] bg-[#050816]/60 backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.05)]">
              <div className="pl-4 pr-3 text-white">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <input 
                ref={inputRef}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white text-[15px] font-mono" 
                placeholder="owner / repository" 
              />
              <button 
                type="submit"
                className="px-8 py-3.5 rounded-full bg-[#a855f7] text-white text-[11px] font-bold tracking-widest hover:bg-[#b86bf5] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all font-mono"
              >
                SCAN REPOSITORY &rarr;
              </button>
            </form>

            <div className="flex items-center gap-6 text-[11px] text-slate-500 tracking-wider font-mono font-medium">
              <div className="flex items-center gap-2"><span className="text-[#a855f7] text-[14px]">✦</span> No sign up required</div>
              <div className="flex items-center gap-2"><span className="text-[#a855f7] text-[14px]">✦</span> Free to use</div>
              <div className="flex items-center gap-2"><span className="text-[#a855f7] text-[14px]">✦</span> Results in 30 seconds</div>
            </div>
          </div>

          {/* Right Column: Orbit Tower */}
          <div className="absolute right-[-100px] top-1/2 -translate-y-1/2 flex items-center justify-center w-[1000px] h-[800px] pointer-events-none z-10">
            <IntelligenceOrbit isScanning={scanning} />
          </div>

        </div>

        {/* Bottom Stats Row */}
        <div className="w-full max-w-[1200px] mx-auto border border-white/[0.05] rounded-[24px] bg-[#050816]/70 backdrop-blur-xl py-10 px-12 flex items-center justify-between mt-auto mb-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-30">
          
          <div className="flex items-center gap-5 flex-1 border-r border-white/[0.05]">
            <div className="text-[#a855f7]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <div>
              <div className="text-[26px] font-black text-white leading-none mb-1.5"><Counter value="10K+" /></div>
              <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase font-mono leading-tight">REPOSITORIES<br/>ANALYZED</div>
            </div>
          </div>

          <div className="flex items-center gap-5 flex-1 justify-center border-r border-white/[0.05]">
            <div className="text-[#a855f7]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
            </div>
            <div>
              <div className="text-[26px] font-black text-white leading-none mb-1.5"><Counter value="2.5M+" /></div>
              <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase font-mono leading-tight">COMMITS<br/>PROCESSED</div>
            </div>
          </div>

          <div className="flex items-center gap-5 flex-1 justify-center border-r border-white/[0.05]">
            <div className="text-[#a855f7]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div>
              <div className="text-[26px] font-black text-white leading-none mb-1.5"><Counter value="500+" /></div>
              <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase font-mono leading-tight">CONTRIBUTORS<br/>STUDIED</div>
            </div>
          </div>

          <div className="flex items-center gap-5 flex-1 justify-end pr-4">
            <div className="text-[#a855f7]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
            </div>
            <div>
              <div className="text-[26px] font-black text-white leading-none mb-1.5"><Counter value="99.9%" /></div>
              <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase font-mono leading-tight">UPTIME<br/>GUARANTEED</div>
            </div>
          </div>

        </div>
      </section>

      {/* OVERLAYS... */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#03050c]/90 z-50 flex items-center justify-center backdrop-blur-sm"
          >
            <div className="w-[400px] p-8 rounded-2xl border border-[#a855f7]/30 bg-[#050816] shadow-[0_0_50px_rgba(168,85,247,0.2)] text-center">
              <h3 className="font-bold tracking-widest text-[#a855f7] text-sm font-mono mb-4 animate-pulse">
                SCANNING REPOSITORY...
              </h3>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
\`;

const intelligenceOrbitContent = `"use client";

import dynamic from "next/dynamic";

const HolographicCore = dynamic(() => import("./HolographicCore"), { ssr: false });

export default function IntelligenceOrbit({ isScanning }: { isScanning: boolean }) {
  return (
    <div className="absolute inset-0 w-[1000px] h-[800px] flex items-center justify-center pointer-events-none z-10">
      
      {/* Connecting lines SVG */}
      <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-10">
        <defs>
           <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
             <feGaussianBlur stdDeviation="3" result="blur" />
             <feMerge>
               <feMergeNode in="blur" />
               <feMergeNode in="SourceGraphic" />
             </feMerge>
           </filter>
        </defs>

        {/* Card 1: Health Score (top-left) M x,y L x,y L x,y */}
        <path d="M 280,240 L 380,240 L 380,480 L 450,480" fill="none" stroke="#a855f7" strokeWidth="1.5" filter="url(#neonGlow)" opacity="0.5"/>
        <circle cx="280" cy="240" r="3" fill="#a855f7" filter="url(#neonGlow)" />
        <circle cx="450" cy="480" r="3" fill="#a855f7" filter="url(#neonGlow)" />

        {/* Card 2: Commits (middle-left) */}
        <path d="M 280,400 L 360,400 L 360,490 L 450,490" fill="none" stroke="#a855f7" strokeWidth="1.5" filter="url(#neonGlow)" opacity="0.5"/>
        <circle cx="280" cy="400" r="3" fill="#a855f7" filter="url(#neonGlow)" />
        <circle cx="450" cy="490" r="3" fill="#a855f7" filter="url(#neonGlow)" />

        {/* Card 3: Contributors (bottom-left) */}
        <path d="M 280,560 L 380,560 L 380,500 L 450,500" fill="none" stroke="#a855f7" strokeWidth="1.5" filter="url(#neonGlow)" opacity="0.5"/>
        <circle cx="280" cy="560" r="3" fill="#a855f7" filter="url(#neonGlow)" />
        <circle cx="450" cy="500" r="3" fill="#a855f7" filter="url(#neonGlow)" />

        {/* Card 4: Bus Factor (top-right) */}
        <path d="M 720,240 L 620,240 L 620,480 L 550,480" fill="none" stroke="#a855f7" strokeWidth="1.5" filter="url(#neonGlow)" opacity="0.5"/>
        <circle cx="720" cy="240" r="3" fill="#a855f7" filter="url(#neonGlow)" />
        <circle cx="550" cy="480" r="3" fill="#a855f7" filter="url(#neonGlow)" />

        {/* Card 5: Releases (middle-right) */}
        <path d="M 720,400 L 640,400 L 640,490 L 550,490" fill="none" stroke="#a855f7" strokeWidth="1.5" filter="url(#neonGlow)" opacity="0.5"/>
        <circle cx="720" cy="400" r="3" fill="#a855f7" filter="url(#neonGlow)" />
        <circle cx="550" cy="490" r="3" fill="#a855f7" filter="url(#neonGlow)" />

        {/* Card 6: Languages (bottom-right) */}
        <path d="M 720,560 L 620,560 L 620,500 L 550,500" fill="none" stroke="#a855f7" strokeWidth="1.5" filter="url(#neonGlow)" opacity="0.5"/>
        <circle cx="720" cy="560" r="3" fill="#a855f7" filter="url(#neonGlow)" />
        <circle cx="550" cy="500" r="3" fill="#a855f7" filter="url(#neonGlow)" />
      </svg>

      {/* 3D Core */}
      <div className="absolute inset-0 z-20 pointer-events-none w-[1000px] h-[800px] flex items-center justify-center">
        <HolographicCore />
      </div>

      {/* Cards - Left Stack */}
      <div className="absolute left-[30px] top-[180px] w-[250px] flex flex-col gap-10 z-30 pointer-events-auto">
        {/* Health Score */}
        <div className="px-6 py-5 rounded-[16px] border border-[#a855f7]/30 bg-[#070914]/80 backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.15)] relative">
          <div className="text-[10px] font-bold tracking-widest text-slate-400 mb-3 uppercase font-mono">HEALTH SCORE</div>
          <div className="flex items-center gap-6">
            <div>
              <div className="text-[34px] font-black text-white leading-none">94</div>
              <div className="text-[11px] font-bold text-slate-300 mt-1 uppercase font-mono">Excellent</div>
            </div>
            <div className="w-[42px] h-[42px] rounded-full border-[5px] border-[#a855f7] flex-shrink-0 shadow-[0_0_20px_#a855f7]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 80%)" }} />
          </div>
        </div>

        {/* Commits */}
        <div className="px-6 py-5 rounded-[16px] border border-[#a855f7]/20 bg-[#070914]/80 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.05)] relative">
          <div className="text-[10px] font-bold tracking-widest text-slate-400 mb-3 uppercase font-mono">COMMITS</div>
          <div>
            <div className="text-[34px] font-black text-[#a855f7] leading-none" style={{ textShadow: "0 0 20px rgba(168,85,247,0.8)" }}>1,240</div>
            <div className="text-[11px] font-bold text-[#a855f7] mt-2 uppercase font-mono flex items-center gap-1">
              <span>&uarr;</span> 18%
            </div>
          </div>
        </div>

        {/* Contributors */}
        <div className="px-6 py-5 rounded-[16px] border border-[#a855f7]/20 bg-[#070914]/80 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.05)] relative">
          <div className="text-[10px] font-bold tracking-widest text-slate-400 mb-3 uppercase font-mono">CONTRIBUTORS</div>
          <div>
            <div className="text-[34px] font-black text-[#a855f7] leading-none" style={{ textShadow: "0 0 20px rgba(168,85,247,0.8)" }}>14</div>
            <div className="text-[11px] font-bold text-[#00f5ff] mt-2 uppercase font-mono tracking-wider">Active</div>
          </div>
        </div>
      </div>

      {/* Cards - Right Stack */}
      <div className="absolute right-[30px] top-[180px] w-[250px] flex flex-col gap-10 z-30 pointer-events-auto">
        {/* Bus Factor */}
        <div className="px-6 py-5 rounded-[16px] border border-[#a855f7]/30 bg-[#070914]/80 backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.15)] relative">
          <div className="text-[10px] font-bold tracking-widest text-slate-400 mb-3 uppercase font-mono">BUS FACTOR</div>
          <div>
            <div className="text-[34px] font-black text-white leading-none">2</div>
            <div className="text-[11px] font-bold text-[#f43f5e] mt-2 uppercase font-mono tracking-wider">Medium Risk</div>
          </div>
        </div>

        {/* Releases */}
        <div className="px-6 py-5 rounded-[16px] border border-[#a855f7]/20 bg-[#070914]/80 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.05)] relative">
          <div className="text-[10px] font-bold tracking-widest text-slate-400 mb-3 uppercase font-mono">RELEASES</div>
          <div>
            <div className="text-[34px] font-black text-white leading-none">v1.4.2</div>
            <div className="text-[11px] font-bold text-slate-400 mt-2 uppercase font-mono tracking-wider">Latest</div>
          </div>
        </div>

        {/* Languages */}
        <div className="px-6 py-5 rounded-[16px] border border-[#a855f7]/20 bg-[#070914]/80 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.05)] relative">
          <div className="text-[10px] font-bold tracking-widest text-slate-400 mb-3 uppercase font-mono">LANGUAGES</div>
          <div>
            <div className="text-[14px] font-bold text-white mb-3 uppercase font-mono tracking-wider">TS • CSS • HTML</div>
            <div className="w-full h-1.5 rounded-full overflow-hidden flex">
              <div className="h-full bg-[#a855f7] w-1/3 shadow-[0_0_10px_#a855f7]" />
              <div className="h-full bg-[#00f5ff] w-1/3 shadow-[0_0_10px_#00f5ff]" />
              <div className="h-full bg-[#60a5fa] w-1/3" />
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
\`;

const holographicCoreContent = \`"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function CrystalTower() {
  const shards = useMemo(() => {
    return Array.from({ length: 200 }).map((_, i) => {
      // randomly distribute around center, denser in center
      const radius = Math.pow(Math.random(), 2.5) * 3.5;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      // height is higher in the center (up to 8 units high)
      const height = Math.max(0.5, (4 - radius) * (1.5 + Math.random() * 2));
      
      const isPurple = Math.random() > 0.4;
      const color = isPurple ? "#a855f7" : "#00f5ff";
      const opacity = 0.3 + Math.random() * 0.5;
      const width = 0.05 + Math.random() * 0.15;
      const depth = 0.05 + Math.random() * 0.15;
      
      return { x, z, height, color, opacity, width, depth };
    });
  }, []);

  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  const logoTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, 512, 512);
      ctx.fillStyle = "#ffffff"; 
      ctx.save();
      ctx.translate(56, 56);
      ctx.scale(16.66, 16.66);
      const path = new Path2D(
        "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
      );
      ctx.fill(path);
      ctx.restore();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, []);

  return (
    <group ref={groupRef} position={[0, -3, 0]}>
      {/* Base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[4.5, 4.5, 0.2, 64]} />
        <meshBasicMaterial color="#020308" />
      </mesh>
      
      {/* Glow rings */}
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <ringGeometry args={[2.5, 2.55, 64]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <ringGeometry args={[1.5, 1.55, 64]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <ringGeometry args={[0.6, 0.8, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={1.0} />
      </mesh>

      {/* Crystal Shards */}
      {shards.map((s, i) => (
        <mesh key={i} position={[s.x, s.height / 2, s.z]}>
          <boxGeometry args={[s.width, s.height, s.depth]} />
          <meshBasicMaterial 
            color={s.color} 
            transparent 
            opacity={s.opacity} 
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Central Light Beam */}
      <mesh position={[0, 4, 0]}>
         <cylinderGeometry args={[0.3, 0.5, 10, 32]} />
         <meshBasicMaterial color="#a855f7" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[0, 4, 0]}>
         <cylinderGeometry args={[0.1, 0.2, 10, 32]} />
         <meshBasicMaterial color="#ffffff" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Central Core GitHub Logo Container */}
      <mesh position={[0, 3.5, 0]}>
         <sphereGeometry args={[1.2, 32, 32]} />
         <meshBasicMaterial color="#a855f7" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[0, 3.5, 0]}>
         <sphereGeometry args={[0.8, 32, 32]} />
         <meshBasicMaterial color="#a855f7" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[0, 3.5, 0.9]}>
         <planeGeometry args={[1.0, 1.0]} />
         {logoTexture && <meshBasicMaterial map={logoTexture} transparent depthWrite={false} toneMapped={false} />}
      </mesh>
    </group>
  );
}

export default function HolographicCore() {
  return (
    <div className="w-full h-full relative pointer-events-none">
      <Canvas camera={{ position: [0, 2, 10], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <CrystalTower />
        <EffectComposer enableNormalPass={false}>
          <Bloom intensity={3.5} luminanceThreshold={0.1} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
\`;

fs.writeFileSync(path.join(__dirname, '../../components/LandingPage.tsx'), landingPageContent);
fs.writeFileSync(path.join(__dirname, '../../components/IntelligenceOrbit.tsx'), intelligenceOrbitContent);
fs.writeFileSync(path.join(__dirname, '../../components/HolographicCore.tsx'), holographicCoreContent);

console.log("Done");

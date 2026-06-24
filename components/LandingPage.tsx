"use client";

import { useState, useRef, useEffect } from "react";
import { useRepoStore } from "@/store/repoStore";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Heart, Zap } from "lucide-react";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

import BentoFeatures from "./BentoFeatures";
import InteractiveDemo from "./InteractiveDemo";
import HowItWorks from "./HowItWorks";
import FinalCTA from "./FinalCTA";

const IntelligenceOrbit = dynamic(() => import("./IntelligenceOrbit"), {
  ssr: false,
});

// High-performance canvas particle system for Section 1 background
function BackgroundAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track window resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Define particles
    const particleCount = 45;
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      color: string;
      alpha: number;
      alphaSpeed: number;
    }> = [];

    const colors = ["#00f5ff", "#a855f7", "#ffffff"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 1 + Math.random() * 2,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.1 + Math.random() * 0.5,
        alphaSpeed: 0.002 + Math.random() * 0.003,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background grid lines (very subtle)
      ctx.strokeStyle = "rgba(0, 245, 255, 0.015)";
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw drifting particles
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Fade in/out cycle
        p.alpha += p.alphaSpeed;
        if (p.alpha > 0.6 || p.alpha < 0.1) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-[#050816]" />
      
      {/* Large radial ambient lighting glows */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 20%, rgba(0, 245, 255, 0.12), transparent 45%),
            radial-gradient(circle at 85% 75%, rgba(168, 85, 247, 0.15), transparent 45%),
            radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.05), transparent 60%)
          `,
          filter: "blur(80px)",
        }}
      />
      
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}

export default function LandingPage() {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Custom scan phase sequence
  // "idle" -> "glow" -> "travel" -> "power-on" -> "modules" -> "done"
  const [scanPhase, setScanPhase] = useState<string>("idle");
  const [localError, setLocalError] = useState<string | null>(null);

  // Sections scroll targets
  const featuresRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    setLocalError(null);
    const targetUrl = inputValue.trim();

    // Start Phase 1: Glow (Input box lights up)
    setScanPhase("glow");
    
    // In parallel, start the real fetch call
    const fetchPromise = fetch(`/api/analyze?url=${encodeURIComponent(targetUrl)}`);
    
    // Phase 2: Travel (glowing data packet flies to core)
    setTimeout(() => {
      setScanPhase("travel");
    }, 600);

    // Phase 3: Power On (Core spins fast, particles spark)
    setTimeout(() => {
      setScanPhase("power-on");
    }, 1300);

    // Phase 4: Modules calculation
    setTimeout(() => {
      setScanPhase("modules");
    }, 2100);

    try {
      const response = await fetchPromise;
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error ?? "Ingestion failed");
      }

      // Phase 5: Complete & Transition (wait at least 3.2s total so user witnesses full sequence)
      setTimeout(() => {
        setScanPhase("done");
        setTimeout(() => {
          useRepoStore.setState({ data, loading: false });
        }, 600);
      }, 3200);

    } catch (err: unknown) {
      setTimeout(() => {
        setScanPhase("idle");
        const msg = err instanceof Error ? err.message : "Scan failed. Please verify repo accessibility.";
        setLocalError(msg);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden select-none bg-[#050816]">
      <BackgroundAtmosphere />
      
      {/* ── TOP UTILITY BAR ── */}
      <div className="relative z-30 w-full border-b border-white/[0.04] bg-white/[0.01] px-8 md:px-12 py-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <div className="flex items-center gap-2 select-none">
          <span className="status-dot green animate-pulse-glow" style={{ width: "6px", height: "6px" }} />
          <span>BUILT BY <span className="neon-text-cyan font-bold">SUDHANSHU SINHA</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-600">CONTACT INFO</span>
          <div className="flex items-center gap-3">
            <a 
              href="mailto:sudhanshutheking183@gmail.com" 
              title="Email Sudhanshu"
              className="text-slate-500 hover:text-[#00f5ff] transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>
            <a 
              href="https://www.linkedin.com/in/sudhanshu-sinha-4619a429a/" 
              target="_blank" 
              rel="noopener noreferrer"
              title="LinkedIn Profile"
              className="text-slate-500 hover:text-[#a855f7] transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ── TOP NAV ── */}
      <nav className="relative z-30 flex items-center justify-between px-8 md:px-12 py-6 bg-transparent">
        <div className="flex items-center gap-6">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center border border-white/[0.08]" style={{ background: "rgba(255,255,255,0.02)" }}>
            <GithubIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-[12px] font-black tracking-widest text-white leading-none mb-1">REPORADAR</div>
            <div className="text-[8px] font-bold tracking-[0.25em] text-[#a855f7] uppercase font-mono">INTELLIGENCE PLATFORM</div>
          </div>
        </div>

        {/* Minimal Nav list */}
        <div className="hidden md:flex items-center gap-10">
          <button onClick={() => scrollTo(featuresRef)} className="text-[10px] font-bold tracking-[0.25em] text-slate-400 hover:text-white uppercase font-mono transition-colors">
            FEATURES
          </button>
          <button onClick={() => scrollTo(timelineRef)} className="text-[10px] font-bold tracking-[0.25em] text-slate-400 hover:text-white uppercase font-mono transition-colors">
            HOW IT WORKS
          </button>
          <button onClick={() => scrollTo(demoRef)} className="text-[10px] font-bold tracking-[0.25em] text-slate-400 hover:text-white uppercase font-mono transition-colors">
            LIVE DEMO
          </button>
        </div>

        <div>
          <button 
            onClick={() => scrollTo(demoRef)}
            className="px-6 py-2 rounded-full border border-[#a855f7]/40 text-[#a855f7] text-[9px] font-bold tracking-[0.2em] hover:bg-[#a855f7]/10 hover:border-[#a855f7] transition-all font-mono"
          >
            LAUNCH APP &rarr;
          </button>
        </div>
      </nav>

      {/* ── HERO VIEW ── */}
      <main className="relative z-10 w-full max-w-[1350px] mx-auto px-6 md:px-10 flex-1 flex flex-col justify-center min-h-[calc(100vh-80px)]">
        <div className="flex flex-col lg:flex-row items-center justify-between relative z-20 w-full gap-16 py-12">
          
          {/* Left Hero Column */}
          <div className="flex flex-col w-full lg:w-[540px] xl:w-[580px] z-30">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f5ff] animate-ping" />
              <div className="text-[10px] tracking-[0.3em] font-bold text-[#a855f7] font-mono">
                ANALYZE. PREDICT. PROTECT.
              </div>
            </div>
            
            <h1 className="text-4xl md:text-[4.2rem] font-black leading-[1.08] tracking-tight mb-8">
              <span className="text-white">SEE THE REAL</span><br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5ff] to-[#a855f7] filter drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                HEALTH
              </span> <span className="text-white">OF ANY</span><br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5ff] to-[#a855f7] filter drop-shadow-[0_0_20px_rgba(0,245,255,0.3)]">
                GITHUB
              </span> <span className="text-white">REPOSITORY</span>
            </h1>
            
            <p className="text-slate-400 text-base md:text-lg mb-10 max-w-[500px] leading-relaxed">
              Ingest your codebase into a futuristic repository intelligence engine. Detect risks, calculate health, and compile executive-ready insights instantly.
            </p>

            {/* Glassmorphic Search Ingest Bar */}
            <form 
              onSubmit={handleScanSubmit} 
              className={`flex items-center rounded-full p-2.5 w-full max-w-[540px] mb-6 border transition-all duration-300 ${
                scanPhase !== "idle" 
                  ? "border-[#00f5ff] shadow-[0_0_30px_rgba(0,245,255,0.25)] bg-[#070a1a]/85" 
                  : "border-white/[0.08] bg-[#070914]/55 hover:border-white/15"
              }`}
            >
              <div className="pl-4 pr-3 text-slate-400">
                <GithubIcon className="w-5 h-5 text-white/70" />
              </div>
              <input 
                ref={inputRef}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                disabled={scanPhase !== "idle"}
                className="flex-1 bg-transparent outline-none text-white text-[14px] font-mono placeholder-slate-600" 
                placeholder="owner / repository (e.g. facebook/react)" 
              />
              <button 
                type="submit"
                disabled={scanPhase !== "idle"}
                className="px-6 py-3 rounded-full bg-[#a855f7] text-white text-[10px] font-bold tracking-[0.2em] hover:bg-[#b86bf5] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all font-mono flex items-center gap-2"
              >
                {scanPhase === "idle" ? "SCAN REPOSITORY" : "SCANNING"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Error notifications */}
            {localError && (
              <div className="text-xs text-rose-500 font-mono mb-4 flex items-center gap-1.5">
                <span>✕</span> {localError}
              </div>
            )}

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 text-[10px] text-slate-500 tracking-wider font-mono">
              <div className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00f5ff]" /> Security Evaluated
              </div>
              <div className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
                <Zap className="w-3.5 h-3.5 text-[#a855f7]" /> Real-time Ingestion
              </div>
              <div className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
                <Heart className="w-3.5 h-3.5 text-pink-500" /> Free to Analyze
              </div>
            </div>
          </div>

          {/* Right Hero Column: Orbit Core with connected cards */}
          <div className="relative w-full lg:w-[600px] h-[550px] md:h-[650px] flex items-center justify-center z-10 lg:-mr-12">
            <div className="scale-65 md:scale-[0.78] lg:scale-[0.88] w-[1000px] h-[800px] flex items-center justify-center shrink-0">
              <IntelligenceOrbit scanPhase={scanPhase} />
            </div>

            {/* Animated travel packet flying from input coordinates to core center */}
            <AnimatePresence>
              {scanPhase === "travel" && (
                <motion.div
                  initial={{ x: -350, y: 120, scale: 0.5, opacity: 1 }}
                  animate={{ x: 0, y: 0, scale: 1.5, opacity: 1 }}
                  exit={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute w-4 h-4 rounded-full bg-[#00f5ff] shadow-[0_0_20px_#00f5ff] z-40"
                />
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>

      {/* ── BENTO FEATURES GRID ── */}
      <div ref={featuresRef}>
        <BentoFeatures />
      </div>

      {/* ── HOW IT WORKS TIMELINE ── */}
      <div ref={timelineRef}>
        <HowItWorks />
      </div>

      {/* ── INTERACTIVE LIVE DEMO ── */}
      <div ref={demoRef}>
        <InteractiveDemo />
      </div>

      {/* ── FINAL CALL-TO-ACTION ── */}
      <FinalCTA onCtaClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />

      {/* Immersive Scan Overlay sequence */}
      <AnimatePresence>
        {["power-on", "modules"].includes(scanPhase) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#070a1e] z-40 pointer-events-none select-none"
          >
            {/* Pulsating scanned scanline overlay grid */}
            <div 
              className="absolute inset-0 bg-[linear-gradient(rgba(0,245,255,0.06)_1px,transparent_1px)]"
              style={{
                backgroundSize: "100% 4px",
                animation: "scanline 6s linear infinite"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

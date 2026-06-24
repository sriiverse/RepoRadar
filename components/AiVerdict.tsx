"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Terminal, ShieldCheck } from "lucide-react";

interface AiVerdictProps {
  scanPhase?: string;
}

const terminalLogs = [
  "⚡ Ingesting repository parameters...",
  "✓ README content parsed & rated (9.4/10)",
  "✓ Commit history & velocities computed",
  "✓ Contributors demographics mapped",
  "✓ Releases & stability signals verified",
  "⚙ Compiling Adoption Verdict..."
];

export default function AiVerdict({ scanPhase = "idle" }: AiVerdictProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [phase, setPhase] = useState<"typing" | "verdict">("typing");

  // Run typing logs animation
  useEffect(() => {
    if (scanPhase === "idle" || scanPhase === "glow" || scanPhase === "travel") {
      // Re-trigger typing logs
      setLogs([]);
      setPhase("typing");
      
      let currentLogIdx = 0;
      const logTimer = setInterval(() => {
        if (currentLogIdx < terminalLogs.length) {
          setLogs((prev) => [...prev, terminalLogs[currentLogIdx]]);
          currentLogIdx++;
        } else {
          clearInterval(logTimer);
          // Transition to final verdict list
          setTimeout(() => {
            setPhase("verdict");
          }, 800);
        }
      }, 550);

      return () => clearInterval(logTimer);
    } else if (scanPhase === "power-on" || scanPhase === "modules") {
      // Reset to scanning state
      setLogs(["⚡ Compiling new repository metadata...", "⚙ Analyzing codebase structure...", "⚙ running risk assessment..."]);
      setPhase("typing");
    } else if (scanPhase === "done") {
      setPhase("verdict");
    }
  }, [scanPhase]);

  return (
    <section className="py-12 max-w-[1200px] mx-auto px-6 relative z-20">
      <div className="w-full rounded-2xl border border-white/[0.08] bg-[#070914]/65 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.04)] overflow-hidden">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between bg-[#0a0d1a]/50">
          <div className="flex items-center gap-2.5">
            <Bot className="w-5 h-5 text-[#00f5ff] filter drop-shadow-[0_0_10px_rgba(0,245,255,0.4)]" />
            <h3 className="text-xs font-black text-white font-mono tracking-[0.2em] uppercase">
              AI ADOPTION VERDICT
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500 bg-white/[0.02] border border-white/[0.08] px-2.5 py-1 rounded">
            <Terminal className="w-3 h-3 text-[#a855f7]" /> ENGINE V2.4
          </div>
        </div>

        {/* Panel Content */}
        <div className="p-8 min-h-[300px] grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <AnimatePresence mode="wait">
            {phase === "typing" ? (
              
              /* Terminal log compilation mode */
              <motion.div
                key="typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-12 font-mono text-xs text-slate-400 space-y-2.5 bg-black/45 p-6 rounded-xl border border-white/[0.04] shadow-inner"
              >
                {logs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`${
                      log.startsWith("✓") ? "text-[#00f5ff]" : log.startsWith("⚡") ? "text-[#a855f7]" : "text-white"
                    }`}
                  >
                    {log}
                  </motion.div>
                ))}
                <div className="inline-block w-1.5 h-3.5 bg-[#00f5ff] animate-blink ml-1 align-middle" />
              </motion.div>

            ) : (

              /* Final Compiled Verdict List */
              <>
                {/* Left Side: Verdict items checklist */}
                <motion.div
                  key="verdict-checks"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="col-span-12 md:col-span-7 space-y-4 font-mono text-sm"
                >
                  {[
                    { text: "Repository is actively maintained", type: "success" },
                    { text: "Documentation quality is excellent", type: "success" },
                    { text: "Strong development velocity", type: "success" },
                    { text: "Release cadence is healthy", type: "success" },
                    { text: "Contributor concentration is high", type: "warning" },
                    { text: "Suitable for production use", type: "success" },
                  ].map((check, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="flex items-center gap-3 text-slate-300"
                    >
                      {check.type === "success" ? (
                        <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 text-xs">
                          ✓
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 text-xs">
                          !
                        </span>
                      )}
                      <span>{check.text}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Right Side: Score Circle and Recommendation Stamp */}
                <motion.div
                  key="verdict-score"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="col-span-12 md:col-span-5 flex flex-col items-center justify-center p-6 border border-white/[0.04] bg-white/[0.01] rounded-2xl relative overflow-hidden"
                >
                  {/* Decorative background pulse */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00f5ff]/5 to-[#a855f7]/5 opacity-30 blur-2xl" />

                  {/* Confidence metrics */}
                  <div className="text-center z-10">
                    <div className="text-[10px] font-bold tracking-[0.25em] text-slate-500 font-mono mb-2 uppercase">
                      CONFIDENCE INDEX
                    </div>
                    <div className="text-5xl font-black text-white font-mono tracking-tighter mb-1 select-none">
                      96<span className="text-xl text-[#00f5ff] font-bold">%</span>
                    </div>
                  </div>

                  {/* Divider line */}
                  <div className="w-24 h-[1px] bg-white/[0.08] my-5 z-10" />

                  {/* Recommendation badge */}
                  <div className="text-center z-10">
                    <div className="text-[9px] font-bold tracking-[0.25em] text-slate-500 font-mono mb-3 uppercase">
                      ADOPTION VERDICT
                    </div>
                    <motion.div
                      animate={{ boxShadow: ["0 0 15px rgba(16,185,129,0.1)", "0 0 30px rgba(16,185,129,0.35)", "0 0 15px rgba(16,185,129,0.1)"] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="px-8 py-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-bold tracking-[0.3em] font-mono text-sm shadow-[0_0_20px_rgba(16,185,129,0.15)] flex items-center gap-2 select-none uppercase"
                    >
                      <ShieldCheck className="w-4 h-4" /> RECOMMENDED
                    </motion.div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}

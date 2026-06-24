"use client";

import { motion } from "framer-motion";

interface FinalCTAProps {
  onCtaClick?: () => void;
}

export default function FinalCTA({ onCtaClick }: FinalCTAProps) {
  return (
    <section className="py-32 relative overflow-hidden z-20">
      
      {/* Background glowing energy sphere below CTA */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#a855f7]/10 to-[#00f5ff]/10 filter blur-[80px] opacity-60 pointer-events-none" />

      <div className="max-w-[800px] mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-6">
          Ready to understand <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5ff] to-[#a855f7]">
            your repository?
          </span>
        </h2>
        
        <p className="text-slate-400 text-base md:text-lg mb-10 max-w-[500px] mx-auto leading-relaxed">
          Ingest any codebase instantly. Access security insights, health scores, and metrics in less than 30 seconds.
        </p>

        <motion.button
          onClick={onCtaClick}
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 245, 255, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-5 rounded-full border border-[#00f5ff] bg-transparent text-[#00f5ff] text-xs font-bold tracking-[0.2em] uppercase font-mono transition-shadow shadow-[0_0_20px_rgba(0,245,255,0.15)] hover:bg-[#00f5ff]/5"
        >
          LAUNCH REPORADAR &rarr;
        </motion.button>
      </div>
    </section>
  );
}

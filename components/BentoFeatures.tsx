"use client";

import { motion } from "framer-motion";
import { Shield, Users, LineChart, FileText, Globe, Code } from "lucide-react";

export default function BentoFeatures() {
  const features = [
    {
      title: "Automated Health Scoring",
      desc: "Instant assessment of repository vitality based on code churn, open issues, PR merge speeds, and community engagement.",
      icon: Shield,
      accent: "#00f5ff",
      glow: "rgba(0, 245, 255, 0.15)",
      gridClass: "col-span-12 md:col-span-8",
    },
    {
      title: "Bus Factor Risk Analysis",
      desc: "Detect single points of failure. We analyze commit ownership to determine if your project is vulnerable to core developers leaving.",
      icon: Users,
      accent: "#a855f7",
      glow: "rgba(168, 85, 247, 0.15)",
      gridClass: "col-span-12 md:col-span-4",
    },
    {
      title: "Commit Velocity Velocity",
      desc: "Track release cadences, active workdays, and commit counts across months to capture developmental acceleration.",
      icon: LineChart,
      accent: "#ec4899",
      glow: "rgba(236, 72, 153, 0.15)",
      gridClass: "col-span-12 md:col-span-4",
    },
    {
      title: "PDF Intelligence Reports",
      desc: "Compile detailed, executive-ready health, compliance, and risk assessments into clean, downloadable PDFs with a single click.",
      icon: FileText,
      accent: "#3b82f6",
      glow: "rgba(59, 130, 246, 0.15)",
      gridClass: "col-span-12 md:col-span-8",
    },
    {
      title: "Language Demographics",
      desc: "Full byte breakdown of languages, mapping codebases to understand complexity and dependencies.",
      icon: Code,
      accent: "#10b981",
      glow: "rgba(16, 185, 129, 0.15)",
      gridClass: "col-span-12 md:col-span-6",
    },
    {
      title: "Global Repository Coverage",
      desc: "No set-up required. Simply paste the URL of any public GitHub repository to extract immediate deep-dive analytics.",
      icon: Globe,
      accent: "#f59e0b",
      glow: "rgba(245, 158, 11, 0.15)",
      gridClass: "col-span-12 md:col-span-6",
    },
  ];

  return (
    <section className="py-24 max-w-[1200px] mx-auto px-6 relative z-20">
      <div className="text-center mb-16">
        <h2 className="text-[10px] font-bold tracking-[0.25em] text-[#a855f7] uppercase font-mono mb-4">
          CAPABILITIES
        </h2>
        <p className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
          Everything you need to understand <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5ff] to-[#a855f7]">
            any repository health
          </span>
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {features.map((feat, idx) => {
          const IconComp = feat.icon;
          return (
            <motion.div
              key={idx}
              className={`${feat.gridClass} group relative p-8 rounded-2xl border border-white/[0.06] bg-[#070914]/40 backdrop-blur-xl transition-all duration-300 overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.03)]`}
              whileHover={{
                y: -6,
                borderColor: `${feat.accent}40`,
                boxShadow: `0 20px 40px rgba(0, 0, 0, 0.6), 0 0 25px ${feat.glow}, inset 0 1px 1px rgba(255,255,255,0.08)`,
              }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
            >
              {/* Corner Glow Accent */}
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full filter blur-[40px] opacity-10 transition-opacity group-hover:opacity-25"
                style={{ background: feat.accent }}
              />

              <div className="flex items-center justify-between mb-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/[0.08] transition-all"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    boxShadow: `inset 0 0 10px rgba(255,255,255,0.02)`,
                  }}
                >
                  <IconComp className="w-5 h-5 transition-colors" style={{ color: feat.accent }} />
                </div>
                <span className="text-[9px] font-bold tracking-widest text-slate-600 group-hover:text-slate-400 font-mono transition-colors">
                  0{idx + 1}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-3 transition-colors group-hover:text-white">
                {feat.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-[520px]">
                {feat.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

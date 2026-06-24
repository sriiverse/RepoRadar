"use client";

import { motion } from "framer-motion";
import { Link, Search, BrainCircuit, BarChart4, FileDown } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      title: "Paste Repository Link",
      desc: "Input any public GitHub repository link (e.g. facebook/react) into our secure scanning terminal. No authentication needed.",
      icon: Link,
      color: "#00f5ff",
    },
    {
      title: "Trigger Engine Scan",
      desc: "Our high-speed ingestion system connects to the GitHub API, pulling core activity data, pull requests, issues, and metadata.",
      icon: Search,
      color: "#a855f7",
    },
    {
      title: "Calculate Intelligence Indices",
      desc: "Algorithms evaluate code ownership concentration to calculate the Bus Factor, and evaluate code metrics to compile a Health Score.",
      icon: BrainCircuit,
      color: "#ec4899",
    },
    {
      title: "Dynamic Visualizations",
      desc: "We compile complex developer activity walls and weekly commit velocity trends into intuitive, clear dashboard widgets.",
      icon: BarChart4,
      color: "#3b82f6",
    },
    {
      title: "Generate Stakeholder Reports",
      desc: "Export an executive compliance-ready PDF report summarizing risks, contributions, and key performance indicators instantly.",
      icon: FileDown,
      color: "#10b981",
    },
  ];

  return (
    <section className="py-24 max-w-[1000px] mx-auto px-6 relative z-20">
      <div className="text-center mb-20">
        <h2 className="text-[10px] font-bold tracking-[0.25em] text-[#a855f7] uppercase font-mono mb-4">
          WORKFLOW
        </h2>
        <p className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
          How RepoRadar operates
        </p>
      </div>

      <div className="relative">
        {/* Central Vertical Connector Line */}
        <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-[1px] bg-gradient-to-b from-[#00f5ff] via-[#a855f7] to-[#10b981] opacity-20 pointer-events-none" />

        {/* Timeline Steps */}
        <div className="space-y-16">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            const isEven = idx % 2 === 0;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1, type: "spring", stiffness: 100 }}
                className={`flex flex-col md:flex-row items-start md:items-center relative ${
                  isEven ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Visual Connector Dot */}
                <div className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full bg-slate-900 border-2 border-white -translate-x-[5.5px] md:-translate-x-1.5 z-10 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                     style={{ borderColor: step.color }} />

                {/* Left/Right Text Box */}
                <div className="w-full md:w-1/2 pl-14 md:pl-0 md:px-12">
                  <div
                    className={`p-6 rounded-2xl border border-white/[0.05] bg-[#070914]/30 backdrop-blur-xl relative hover:border-white/10 transition-colors ${
                      isEven ? "md:text-right" : "md:text-left"
                    }`}
                  >
                    <div className={`flex items-center gap-3 mb-3 ${isEven ? "md:justify-end" : "md:justify-start"}`}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.03] border border-white/[0.08]">
                        <IconComp className="w-4 h-4" style={{ color: step.color }} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 font-mono tracking-widest">
                        PHASE 0{idx + 1}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>

                {/* Empty buffer for desktop grid alignment */}
                <div className="hidden md:block w-1/2" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

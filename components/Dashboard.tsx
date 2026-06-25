"use client";

import { useRepoStore } from "@/store/repoStore";
import TopNav from "./TopNav";
import RepoHeader from "./dashboard/RepoHeader";
import VerdictPanel from "./dashboard/VerdictPanel";
import HealthScoreCard from "./dashboard/HealthScoreCard";
import RiskAssessmentCard from "./dashboard/RiskAssessmentCard";
import SurvivalAnalysisCard from "./dashboard/SurvivalAnalysisCard";
import CommitHeatmap from "./dashboard/CommitHeatmap";
import ContributorDistribution from "./dashboard/ContributorDistribution";
import ActivityTrend from "./dashboard/ActivityTrend";
import PRMetricsCards from "./dashboard/PRMetricsCards";
import IssueMetricsCards from "./dashboard/IssueMetricsCards";
import LanguageBreakdown from "./dashboard/LanguageBreakdown";
import RecentReleases from "./dashboard/RecentReleases";
import RiskInsights from "./dashboard/RiskInsights";
import ExportCard from "./dashboard/ExportCard";

export default function Dashboard() {
  const { data } = useRepoStore();
  if (!data) return null;

  return (
    <div id="dashboard" className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Top navigation replaces sidebar */}
      <TopNav />

      <main className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Repo Header */}
        <div className="mb-8">
          <RepoHeader />
        </div>

        {/* Row 1: Health Score (large) + Survival Analysis (hero) + Risk Assessment + Risk Insights */}
        <div id="health" className="grid grid-cols-12 gap-4 mb-5">
          {/* Health Score — 3 cols */}
          <div className="col-span-3 h-full">
            <HealthScoreCard />
          </div>
          {/* Survival Analysis — 5 cols — THE HERO CARD */}
          <div className="col-span-5 h-full">
            <SurvivalAnalysisCard />
          </div>
          {/* Risk Assessment + Risk Insights — 4 cols stacked */}
          <div className="col-span-4 flex flex-col gap-4 h-full">
            <RiskAssessmentCard />
            <RiskInsights />
          </div>
        </div>

        {/* Row 2: Heatmap + Contributor Distribution + Activity Trend */}
        <div id="commits" className="grid grid-cols-12 gap-4 mb-5">
          <div className="col-span-6">
            <CommitHeatmap />
          </div>
          <div id="contributors" className="col-span-3">
            <ContributorDistribution />
          </div>
          <div className="col-span-3">
            <ActivityTrend />
          </div>
        </div>

        {/* Row 3: PR + Issue Metrics */}
        <div id="pullrequests" className="grid grid-cols-6 gap-4 mb-5">
          <PRMetricsCards />
          <IssueMetricsCards />
        </div>

        {/* Row 4: Language + Releases + Export */}
        <div id="languages" className="grid grid-cols-3 gap-4">
          <LanguageBreakdown />
          <div id="releases">
            <RecentReleases />
          </div>
          <div id="export">
            <ExportCard />
          </div>
        </div>

        {/* VERDICT PANEL — full width, relocated to the bottom fold */}
        <VerdictPanel />

        {/* Premium Footer */}
        <footer className="mt-16 pt-8 pb-12" style={{ borderTop: "1px solid rgba(0,245,255,0.08)" }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            {/* Column 1: Info */}
            <div className="space-y-1.5 text-center md:text-left">
              <div className="text-base font-black tracking-wider text-slate-200">
                <span className="neon-text-cyan">REPO</span>RADAR
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">
                Repository Intelligence Platform
              </div>
            </div>

            {/* Column 2: Authorship */}
            <div className="space-y-1 text-center">
              <div>
                Built by <span className="neon-text-cyan font-bold">Sudhanshu Sinha</span>
              </div>
              <div className="text-[10px] text-slate-600">
                Open Source · Free · Next.js + GitHub API
              </div>
            </div>

            {/* Column 3: Links & Version */}
            <div className="space-y-2 text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end gap-4">
                <a
                  href="https://github.com/sriiverse/RepoRadar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan transition-colors"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--cyan)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                >
                  GitHub
                </a>
                <span className="text-slate-800">|</span>
                <a
                  href="https://www.linkedin.com/in/sudhanshu-sinha-4619a429a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-magenta transition-colors"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--magenta)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                >
                  LinkedIn
                </a>
                <span className="text-slate-800">|</span>
                <a
                  href="mailto:sudhanshutheking183@gmail.com"
                  className="hover:text-cyan transition-colors"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--cyan)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                >
                  API / Contact
                </a>
              </div>
              <div className="text-[10px] text-slate-600">
                Version 2.0
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

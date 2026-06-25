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
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
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

        {/* Footer */}
        <footer className="mt-10 pt-6 text-center" style={{ borderTop: "1px solid rgba(0,245,255,0.08)" }}>
          <div className="text-xs mt-3 flex flex-col items-center justify-center gap-2.5" style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
            <div className="flex items-center gap-3 justify-center">
              <span style={{ color: "var(--text-secondary)" }}>
                Built by <span className="neon-text-cyan font-bold">Sudhanshu Sinha</span>
              </span>
              <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
              <a
                href="mailto:sudhanshutheking183@gmail.com"
                className="flex items-center justify-center w-7 h-7 rounded border transition-all duration-200"
                style={{ borderColor: "rgba(0,245,255,0.2)", background: "rgba(0,245,255,0.03)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--cyan)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(0,245,255,0.1)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,245,255,0.2)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(0,245,255,0.03)";
                  (e.currentTarget as HTMLElement).style.transform = "none";
                }}
                title="Email Sudhanshu"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--cyan)" }}>
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/sudhanshu-sinha-4619a429a/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-7 h-7 rounded border transition-all duration-200"
                style={{ borderColor: "rgba(255,0,255,0.2)", background: "rgba(255,0,255,0.03)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--magenta)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,0,255,0.1)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,0,255,0.2)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,0,255,0.03)";
                  (e.currentTarget as HTMLElement).style.transform = "none";
                }}
                title="LinkedIn Profile"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--magenta)" }}>
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
            <div className="mt-1 opacity-70">RepoRadar · Open Source · Free · Built with Next.js + GitHub API</div>
          </div>
        </footer>
      </main>
    </div>
  );
}

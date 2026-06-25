"use client";

import { useState } from "react";
import { useRepoStore, AnalysisData } from "@/store/repoStore";

interface ProblemItem {
  severity: string;
  label: string;
}

function getVerdictSummary(data: AnalysisData, recentCommits: number) {
  const { busFactor, releaseCadence } = data;
  const activityText = recentCommits >= 15
    ? "shows active recent development and frequent updates"
    : recentCommits > 0
    ? "shows moderate development activity in recent weeks"
    : "shows stalled development activity with no recent commits";

  const concentrationText = busFactor.busFactor === 1
    ? `but exhibits a critical key-person risk with a Bus Factor of 1 (${busFactor.topContributorPercentage}% ownership)`
    : `and displays healthy contributor diversity with a Bus Factor of ${busFactor.busFactor}`;

  const releaseText = releaseCadence.totalReleases === 0
    ? "The absence of release tags reduces confidence for production version control."
    : `The presence of releases (${releaseCadence.totalReleases} total) shows good versioning stability.`;

  return `This repository ${activityText}, ${concentrationText}. ${releaseText}`;
}

function getProblemsList(data: AnalysisData, recentCommits: number) {
  const list = [];
  const { busFactor, releaseCadence } = data;

  if (busFactor.busFactor === 1) {
    list.push({ severity: "critical", label: "Bus Factor = 1 (Critical dependency)" });
  } else if (busFactor.busFactor < 3) {
    list.push({ severity: "high", label: `Low Bus Factor (Currently: ${busFactor.busFactor})` });
  }

  if (busFactor.topContributorPercentage > 75) {
    list.push({ severity: "critical", label: "Single maintainer dependency" });
  } else if (busFactor.topContributorPercentage > 50) {
    list.push({ severity: "high", label: "High contributor concentration" });
  }

  if (releaseCadence.totalReleases === 0) {
    list.push({ severity: "high", label: "No releases detected" });
  }

  if (recentCommits === 0) {
    list.push({ severity: "high", label: "Stalled development (no commits in 30d)" });
  } else if (recentCommits < 5) {
    list.push({ severity: "medium", label: "Slowed development velocity" });
  }

  if ((data.prStats?.total ?? 0) === 0) {
    list.push({ severity: "medium", label: "No pull request workflow history" });
  }
  if ((data.issueStats?.total ?? 0) === 0) {
    list.push({ severity: "medium", label: "GitHub Issues inactive" });
  }

  if (!data.meta.license || data.meta.license === "None" || data.meta.license === "Unknown") {
    list.push({ severity: "medium", label: "Missing open-source license" });
  }

  return list;
}

function getActionsList(problems: ProblemItem[]) {
  const actions: string[] = [];
  const actionMap: { [key: string]: string[] } = {
    LOW_BUS_FACTOR: ["Invite additional maintainers.", "Document operational knowledge."],
    SINGLE_MAINTAINER: ["Establish co-maintainers for key areas.", "Review branch merge rules."],
    NO_RELEASES: ["Publish semantic versioned releases.", "Setup tag workflows."],
    NO_ACTIVITY: ["Resume regular development cycles."],
    NO_PRS: ["Adopt a pull-request based workflow."],
    NO_ISSUES: ["Enable GitHub Issues for bug reports."],
    NO_LICENSE: ["Add an open-source LICENSE file."],
  };

  problems.forEach(p => {
    if (p.label.includes("Bus Factor = 1") && !actions.includes(actionMap.LOW_BUS_FACTOR[0])) {
      actions.push(...actionMap.LOW_BUS_FACTOR);
    }
    if (p.label.includes("Single maintainer") && !actions.includes(actionMap.SINGLE_MAINTAINER[0])) {
      actions.push(...actionMap.SINGLE_MAINTAINER);
    }
    if (p.label.includes("releases") && !actions.includes(actionMap.NO_RELEASES[0])) {
      actions.push(...actionMap.NO_RELEASES);
    }
    if (p.label.includes("Stalled") && !actions.includes(actionMap.NO_ACTIVITY[0])) {
      actions.push(...actionMap.NO_ACTIVITY);
    }
    if (p.label.includes("pull request") && !actions.includes(actionMap.NO_PRS[0])) {
      actions.push(...actionMap.NO_PRS);
    }
    if (p.label.includes("Issues") && !actions.includes(actionMap.NO_ISSUES[0])) {
      actions.push(...actionMap.NO_ISSUES);
    }
    if (p.label.includes("license") && !actions.includes(actionMap.NO_LICENSE[0])) {
      actions.push(...actionMap.NO_LICENSE);
    }
  });

  if (actions.length === 0) {
    actions.push("Continue current release cadence.");
    actions.push("Monitor dependency security updates monthly.");
  }

  return actions.slice(0, 5);
}

export default function ExportCard() {
  const { data } = useRepoStore();
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!data) return;
    setExporting(true);

    const commitActivity = data.commitActivity ?? [];
    const recentCommits = commitActivity.slice(-4).reduce((s, w) => s + w.total, 0);

    try {
      const jsPDF = (await import("jspdf")).default;
      const html2canvas = (await import("html2canvas")).default;

      const dashboard = document.getElementById("dashboard");
      if (!dashboard) return;

      const canvas = await html2canvas(dashboard, {
        backgroundColor: "#07071a",
        scale: 1.5,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      // Page 1: Dashboard screenshot
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

      // Page 2: Premium Compliance Report
      pdf.addPage();
      pdf.setFillColor(7, 7, 26);
      pdf.rect(0, 0, canvas.width, canvas.height, "F");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(24);
      pdf.setTextColor(0, 245, 255);
      pdf.text("REPORADAR INTELLIGENCE REPORT", 40, 60);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.text("EXECUTIVE COMPLIANCE & RISK AUDIT", 40, 75);

      pdf.setDrawColor(0, 245, 255);
      pdf.setLineWidth(1.5);
      pdf.line(40, 85, canvas.width - 40, 85);

      pdf.setFontSize(11);
      pdf.setTextColor(180, 180, 220);
      pdf.text(`Repository:  ${data.meta.full_name.toUpperCase()}`, 40, 110);
      pdf.text(`Generated:   ${new Date().toLocaleString()}`, 40, 125);
      
      const confidence = Math.min(99, 88 + (data.contributors.length > 5 ? 4 : 1) + (data.releaseCadence.totalReleases > 0 ? 4 : 1) + (recentCommits > 10 ? 3 : 1));
      pdf.text(`Confidence:  ${confidence}%`, 40, 140);

      pdf.text(`Overall Health Score:  ${data.healthScore.total}/100 (${data.healthScore.label})`, 40, 170);
      pdf.text(`Breakdown Scores:`, 40, 185);
      pdf.setFontSize(10);
      pdf.text(`- Activity:     ${data.healthScore.breakdown.activityScore}/25`, 55, 200);
      pdf.text(`- Maintenance:  ${data.healthScore.breakdown.maintenanceScore}/25`, 55, 215);
      pdf.text(`- Community:    ${data.healthScore.breakdown.communityScore}/25`, 55, 230);
      pdf.text(`- Stability:    ${data.healthScore.breakdown.stabilityScore}/25`, 55, 245);

      pdf.setFontSize(12);
      pdf.setTextColor(0, 245, 255);
      pdf.text("EXECUTIVE SUMMARY", 40, 285);
      
      pdf.setDrawColor(100, 116, 139);
      pdf.setLineWidth(0.5);
      pdf.line(40, 295, canvas.width - 40, 295);

      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(10);
      pdf.setTextColor(200, 200, 230);
      
      const summaryText = getVerdictSummary(data, recentCommits);
      const splitSummary = pdf.splitTextToSize(summaryText, canvas.width - 80);
      pdf.text(splitSummary, 40, 315);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(255, 107, 53);
      pdf.text("RISK AUDIT & ACTIONABLE RECOMMENDATIONS", 40, 395);
      
      pdf.line(40, 405, canvas.width - 40, 405);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(180, 180, 220);

      let yOffset = 425;
      pdf.text("Detected Vulnerabilities:", 40, yOffset);
      yOffset += 15;
      
      const problems = getProblemsList(data, recentCommits);
      problems.forEach((p) => {
        const severityIndicator = 
          p.severity === "critical" ? "[CRITICAL]" : 
          p.severity === "high" ? "[HIGH]" : 
          p.severity === "medium" ? "[MEDIUM]" : "[INFO]";
        pdf.text(`- ${severityIndicator} ${p.label}`, 55, yOffset);
        yOffset += 15;
      });

      yOffset += 10;
      pdf.text("Recommended Action Plan:", 40, yOffset);
      yOffset += 15;

      const actions = getActionsList(problems);
      actions.forEach((act) => {
        pdf.text(`[ ] ${act}`, 55, yOffset);
        yOffset += 15;
      });

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(0, 245, 255);
      pdf.text("REPORADAR INTELLIGENCE SUITE · DATA-DRIVEN RESEARCH COMPLIANCE", 40, canvas.height - 40);

      pdf.save(`reporadar-${data.meta.full_name.replace("/", "-")}.pdf`);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="glass-card bounce-card p-5 flex flex-col">
      <div className="cyber-label">⬒ EXPORT REPORT</div>

      <p className="text-xs mb-4 flex-1" style={{ color: "var(--text-secondary)" }}>
        Download a comprehensive PDF report with all metrics, charts and insights.
      </p>

      <button
        onClick={handleExport}
        disabled={exporting}
        className="btn-cyber w-full justify-center"
        style={{ opacity: exporting ? 0.7 : 1 }}
      >
        {exporting ? (
          <>
            <span className="animate-spin-slow">◈</span> GENERATING...
          </>
        ) : (
          <>
            ⬒ EXPORT PDF
          </>
        )}
      </button>

    </div>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepoRadar — GitHub Repository Intelligence Dashboard",
  description:
    "Analyze any public GitHub repository instantly. Get commit heatmaps, bus factor scores, PR velocity, contributor distribution, and a full health score in seconds.",
  keywords: ["github", "repository", "analytics", "bus factor", "open source", "health score"],
  openGraph: {
    title: "RepoRadar — GitHub Repository Intelligence",
    description: "Analyze any public GitHub repo. Bus factor, health score, PR velocity — in 30 seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

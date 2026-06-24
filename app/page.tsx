"use client";

import { useRepoStore } from "@/store/repoStore";
import LandingPage from "@/components/LandingPage";
import Dashboard from "@/components/Dashboard";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  const { data, loading } = useRepoStore();

  if (loading) return <LoadingScreen />;
  if (data) return <Dashboard />;
  return <LandingPage />;
}

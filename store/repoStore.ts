import { create } from "zustand";
import { BusFactorResult } from "@/lib/busFactor";
import { HealthScore, RepoAge, ReleaseCadenceMetric } from "@/lib/metrics";

export interface AnalysisData {
  meta: {
    full_name: string;
    name: string;
    owner: string;
    description: string | null;
    stars: number;
    forks: number;
    language: string | null;
    license: string | null;
    isPrivate: boolean;
    createdAt: string;
    updatedAt: string;
    openIssues: number;
  };
  commitActivity: Array<{ week: number; days: number[]; total: number }>;
  contributors: Array<{ login: string; avatar: string; contributions: number; profileUrl: string }>;
  prStats: { total: number; merged: number; closed: number; open: number; avgMergeTimeDays: number };
  issueStats: { total: number; open: number; closed: number; stale: number; avgResponseTimeDays: number };
  releases: Array<{ tag: string; name: string | null; publishedAt: string; url: string }>;
  languageBreakdown: Array<{ name: string; percentage: number; bytes: number }>;
  busFactor: BusFactorResult;
  healthScore: HealthScore;
  repoAge: RepoAge;
  releaseCadence: ReleaseCadenceMetric;
  rateLimit: { remaining: number; limit: number; resetAt: string };
  analyzedAt: string;
  cached: boolean;
}

interface RepoStore {
  data: AnalysisData | null;
  loading: boolean;
  error: string | null;
  inputUrl: string;
  setInputUrl: (url: string) => void;
  analyze: (url: string) => Promise<void>;
  reset: () => void;
}

export const useRepoStore = create<RepoStore>((set) => ({
  data: null,
  loading: false,
  error: null,
  inputUrl: "",

  setInputUrl: (url) => set({ inputUrl: url }),

  analyze: async (url: string) => {
    set({ loading: true, error: null, data: null });
    try {
      const res = await fetch(`/api/analyze?url=${encodeURIComponent(url)}`);
      const json = await res.json();
      if (!res.ok) {
        set({ error: json.error ?? "Analysis failed", loading: false });
        return;
      }
      set({ data: json, loading: false });
    } catch {
      set({ error: "Network error. Please check your connection.", loading: false });
    }
  },

  reset: () => set({ data: null, error: null, inputUrl: "" }),
}));

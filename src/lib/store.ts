import { useSyncExternalStore } from "react";

export type LeaderboardEntry = {
  id: string;
  name: string;
  points: number;
  badges: string[];
};

const KEY = "asist_leaderboard_v1";
const STUDENT_KEY = "asist_student_id";

const seed: LeaderboardEntry[] = [
  { id: "ASIST-STUDENT-014", name: "Amara K.", points: 140, badges: ["🚦"] },
  { id: "ASIST-STUDENT-007", name: "Brian O.", points: 120, badges: ["🚗"] },
  { id: "ASIST-STUDENT-022", name: "Sumaya N.", points: 95, badges: ["🚦"] },
  { id: "ASIST-STUDENT-031", name: "Joel M.", points: 80, badges: [] },
  { id: "ASIST-STUDENT-009", name: "Patience A.", points: 65, badges: [] },
  { id: "ASIST-STUDENT-001", name: "You", points: 0, badges: [] },
];

function read(): LeaderboardEntry[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed;
    return JSON.parse(raw);
  } catch {
    return seed;
  }
}

let cache: LeaderboardEntry[] = read();
const listeners = new Set<() => void>();

function emit() {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(cache));
  }
  listeners.forEach((l) => l());
}

export function getStudentId(): string {
  if (typeof window === "undefined") return "ASIST-STUDENT-001";
  return localStorage.getItem(STUDENT_KEY) ?? "ASIST-STUDENT-001";
}

export function awardPoints(points: number, badge?: string) {
  const id = getStudentId();
  cache = cache.map((e) =>
    e.id === id
      ? {
          ...e,
          points: e.points + points,
          badges: badge && !e.badges.includes(badge) ? [...e.badges, badge] : e.badges,
        }
      : e,
  );
  emit();
}

export function resetLeaderboard() {
  cache = seed.map((e) => ({ ...e }));
  emit();
}

export function useLeaderboard() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => cache,
    () => seed,
  );
}

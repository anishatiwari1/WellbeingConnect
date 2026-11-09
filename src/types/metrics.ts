export const JOURNAL_STORAGE_KEY = "wellbeingconnect:journal";
export const METRICS_STORAGE_KEY = "wellbeingconnect:metrics";
export const METRICS_LOG_STORAGE_KEY = "wellbeingconnect:metrics:log";
export const METRICS_BROADCAST_CHANNEL = "wellbeingconnect:metrics";
export const MOOD_LOG_STORAGE_KEY = "wellbeingconnect:mood:log";
export const MOOD_BROADCAST_CHANNEL = "wellbeingconnect:mood";

export type DailyMetrics = {
  sleep: number; // 1-5
  stress: number; // 1-5
  energy: number; // 1-5
  focus: number; // 1-5
  lastUpdatedISO: string;
};

export type MetricsEntry = {
  id: string;
  createdAt: string;
  sleep: number;
  stress: number;
  energy: number;
  focus: number;
};

export type WeeklyAverages = {
  sleep: number;
  stress: number;
  energy: number;
  focus: number;
} | null;

export type MoodEntry = {
  id: string;
  createdAt: string; // ISO
  value: number; // 1-10
};



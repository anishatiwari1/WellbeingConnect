import { DailyMetrics, MetricsEntry, WeeklyAverages, MoodEntry } from "@/types/metrics";

export const clampMetric = (n: number) => Math.max(1, Math.min(5, Math.round(n)));

export const toPercent = (n: number | undefined | null) => {
  if (n === undefined || n === null) return 0;
  return Math.round((n / 5) * 100);
};

export const computeWeeklyAverages = (log: MetricsEntry[], now = Date.now()): WeeklyAverages => {
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const recent = log.filter((e) => new Date(e.createdAt).getTime() >= oneWeekAgo);
  if (recent.length === 0) return null;
  const sum = recent.reduce(
    (acc, e) => {
      acc.sleep += e.sleep;
      acc.stress += e.stress;
      acc.energy += e.energy;
      acc.focus += e.focus;
      return acc;
    },
    { sleep: 0, stress: 0, energy: 0, focus: 0 }
  );
  const denom = recent.length || 1;
  return {
    sleep: sum.sleep / denom,
    stress: sum.stress / denom,
    energy: sum.energy / denom,
    focus: sum.focus / denom,
  };
};

export const parseJSON = <T>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export type MoodPoint = { day: string; mood: number };

export const computeWeeklyMoodSeries = (moods: MoodEntry[], now = new Date()): MoodPoint[] => {
  const start = new Date(now);
  // Align to Monday for the week view
  const day = start.getDay();
  const diffToMonday = (day + 6) % 7; // 0=Sun -> 6
  start.setDate(start.getDate() - diffToMonday);
  start.setHours(0, 0, 0, 0);

  const series: MoodPoint[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const label = d.toLocaleDateString(undefined, { weekday: "short" });
    return { day: label, mood: 0 };
  });

  // Track sum and count to compute true daily averages (cumulative mood of the day)
  const sums: number[] = Array(7).fill(0);
  const counts: number[] = Array(7).fill(0);

  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  const weekly = moods.filter((m) => {
    const t = new Date(m.createdAt).getTime();
    return t >= start.getTime() && t < end.getTime();
  });

  weekly.forEach((m) => {
    const d = new Date(m.createdAt);
    const idx = Math.floor((d.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    if (idx >= 0 && idx < 7) {
      sums[idx] += m.value;
      counts[idx] += 1;
    }
  });

  for (let i = 0; i < 7; i++) {
    if (counts[i] > 0) {
      series[i].mood = Math.round((sums[i] / counts[i]) * 10) / 10; // one decimal place
    } else {
      series[i].mood = 0;
    }
  }

  return series;
};



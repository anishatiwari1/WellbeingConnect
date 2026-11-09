import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { JOURNAL_STORAGE_KEY, METRICS_LOG_STORAGE_KEY, MOOD_LOG_STORAGE_KEY, MetricsEntry, MoodEntry } from "@/types/metrics";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Entry {
  id: string;
  createdAt: string;
  text: string;
  score: number;
}

const STORAGE_KEY = JOURNAL_STORAGE_KEY;

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getMonthMatrix(year: number, monthIndex0: number): (Date | null)[] {
  // monthIndex0: 0-11
  const firstDay = new Date(year, monthIndex0, 1);
  const startWeekday = firstDay.getDay(); // 0 Sun - 6 Sat
  const daysInMonth = new Date(year, monthIndex0 + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, monthIndex0, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function sentimentColor(avg: number | null): string {
  if (avg === null) return "bg-secondary text-secondary-foreground";
  if (avg > 2) return "bg-success text-success-foreground";
  if (avg < -2) return "bg-destructive text-destructive-foreground";
  return "bg-muted text-foreground";
}

function moodBadgeColor(avg: number | null): string {
  if (avg === null) return "bg-secondary text-secondary-foreground";
  if (avg >= 7) return "bg-primary text-primary-foreground";
  if (avg >= 4) return "bg-accent text-accent-foreground";
  return "bg-muted-foreground/60 text-background";
}

export default function MyCalendar() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [metricsLogs, setMetricsLogs] = useState<MetricsEntry[]>([]);
  const [moodLogs, setMoodLogs] = useState<MoodEntry[]>([]);
  const [cursor, setCursor] = useState<Date>(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [view, setView] = useState<"month" | "week" | "day">("month");

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setEntries(JSON.parse(raw) as Entry[]); } catch {}
    }
    const rawMetrics = localStorage.getItem(METRICS_LOG_STORAGE_KEY);
    if (rawMetrics) {
      try { setMetricsLogs(JSON.parse(rawMetrics) as MetricsEntry[]); } catch {}
    }
    const rawMood = localStorage.getItem(MOOD_LOG_STORAGE_KEY);
    if (rawMood) {
      try { setMoodLogs(JSON.parse(rawMood) as MoodEntry[]); } catch {}
    }
  }, []);

  const grouped = useMemo(() => {
    type DayData = {
      journal: Entry[];
      metrics: MetricsEntry[];
      moods: MoodEntry[];
      sentimentAvg: number | null;
      moodAvg: number | null;
    };
    const map: Record<string, DayData> = {};

    const ensure = (key: string) => (map[key] ||= { journal: [], metrics: [], moods: [], sentimentAvg: null, moodAvg: null });

    entries.forEach((e) => ensure(e.createdAt.slice(0, 10)).journal.push(e));
    metricsLogs.forEach((m) => ensure(m.createdAt.slice(0, 10)).metrics.push(m));
    moodLogs.forEach((m) => ensure(m.createdAt.slice(0, 10)).moods.push(m));

    for (const key of Object.keys(map)) {
      const day = map[key];
      if (day.journal.length) {
        const sum = day.journal.reduce((acc, it) => acc + (Number(it.score) || 0), 0);
        day.sentimentAvg = sum / day.journal.length;
      }
      if (day.moods.length) {
        const sum = day.moods.reduce((acc, it) => acc + (Number(it.value) || 0), 0);
        day.moodAvg = sum / day.moods.length;
      }
    }
    return map;
  }, [entries, metricsLogs, moodLogs]);

  const year = cursor.getFullYear();
  const monthIndex0 = cursor.getMonth();
  const monthCells = useMemo(() => getMonthMatrix(year, monthIndex0), [year, monthIndex0]);
  const monthLabel = cursor.toLocaleString(undefined, { month: "long", year: "numeric" });

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const selectedDay = selectedDateKey ? grouped[selectedDateKey] : undefined;

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  const setMonth = (m: number) => {
    setSelectedDateKey(null);
    setCursor(new Date(year, m, 1));
  };
  const setYear = (y: number) => {
    setSelectedDateKey(null);
    setCursor(new Date(y, monthIndex0, 1));
  };

  return (
    <div className="container py-6 animate-enter">
      <SEO
        title="My Calendar — Mood and Thought Garden Logs | WellBeingConnect"
        description="View your daily mood averages and thought garden entries on your personal calendar."
        path="/calendar"
      />

      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">My Calendar</h1>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex rounded-md border p-1">
            <Button variant={view === "month" ? "default" : "ghost"} size="sm" onClick={() => setView("month")}>Monthly</Button>
            <Button variant={view === "week" ? "default" : "ghost"} size="sm" onClick={() => setView("week")}>Weekly</Button>
            <Button variant={view === "day" ? "default" : "ghost"} size="sm" onClick={() => { setView("day"); setSelectedDateKey(formatDateKey(cursor)); }}>Daily</Button>
          </div>
          <Button variant="outline" onClick={() => { const now = new Date(); setCursor(now); setSelectedDateKey(formatDateKey(now)); }}>Today</Button>
          <Button variant="secondary" onClick={() => setCursor(new Date(year, monthIndex0 - 1, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Select value={String(monthIndex0)} onValueChange={(v) => setMonth(parseInt(v, 10))}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {monthNames.map((name, idx) => (
                  <SelectItem key={name} value={String(idx)}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(year)} onValueChange={(v) => setYear(parseInt(v, 10))}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="secondary" onClick={() => setCursor(new Date(year, monthIndex0 + 1, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className={`grid gap-6 ${selectedDateKey && view !== "day" ? "lg:grid-cols-3" : "lg:grid-cols-1"} transition-all duration-300`}>
        <Card className={`${selectedDateKey && view !== "day" ? "lg:col-span-2" : "lg:col-span-1"} transition-all duration-300`}>
          <CardHeader>
            <CardTitle>{view === "month" ? "Month Overview" : view === "week" ? "Week Overview" : "Day Overview"}</CardTitle>
          </CardHeader>
          <CardContent>
            {view === "month" && (
              <>
                <div className="grid grid-cols-7 gap-3 text-xs text-muted-foreground mb-3 transition-all duration-300">
              {weekdays.map((w) => (
                <div key={w} className="text-center">{w}</div>
              ))}
            </div>
                <div className="grid grid-cols-7 gap-3">
              {monthCells.map((d, idx) => {
                    if (!d) return <div key={idx} className="h-24 rounded-md border bg-muted/30" />;
                const key = formatDateKey(d);
                const info = grouped[key];
                    const journalCount = info?.journal.length || 0;
                    const metricCount = info?.metrics.length || 0;
                    const moodAvg = info?.moodAvg ?? null;
                    const sentAvg = info?.sentimentAvg ?? null;
                const isSelected = selectedDateKey === key;
                    const handleClick = () => setSelectedDateKey(isSelected ? null : key);
                return (
                  <button
                    key={key}
                        onClick={handleClick}
                        className={`h-32 rounded-md border text-left p-4 hover:shadow-sm transition ${isSelected ? "ring-2 ring-primary" : ""}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium">{d.getDate()}</div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-muted-foreground">Mood</span>
                            <Badge className={moodBadgeColor(moodAvg)}>{moodAvg === null ? "—" : moodAvg.toFixed(1)}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-muted-foreground">Sentiment</span>
                            <Badge className={sentimentColor(sentAvg)}>{sentAvg === null ? "—" : sentAvg.toFixed(1)}</Badge>
                          </div>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-2 whitespace-nowrap overflow-hidden text-ellipsis">{journalCount} thoughts · {metricCount} metrics</div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {view === "week" && (
              <>
                <div className="grid grid-cols-7 gap-3 text-xs text-muted-foreground mb-3">
                  {weekdays.map((w) => (
                    <div key={w} className="text-center">{w}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-3">
                  {Array.from({ length: 7 }, (_, i) => {
                    const day = new Date(cursor);
                    const currentDay = day.getDay();
                    const diffToSunday = currentDay; // 0 Sun
                    day.setDate(cursor.getDate() - diffToSunday + i);
                    const key = formatDateKey(day);
                    const info = grouped[key];
                    const journalCount = info?.journal.length || 0;
                    const metricCount = info?.metrics.length || 0;
                    const moodAvg = info?.moodAvg ?? null;
                    const sentAvg = info?.sentimentAvg ?? null;
                    const isSelected = selectedDateKey === key;
                    const handleClick = () => setSelectedDateKey(isSelected ? null : key);
                    return (
                      <button key={key} onClick={handleClick} className={`h-40 rounded-md border text-left p-4 hover:shadow-sm transition ${isSelected ? "ring-2 ring-primary" : ""}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium">{day.getDate()}</div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-muted-foreground">Mood</span>
                            <Badge className={moodBadgeColor(moodAvg)}>{moodAvg === null ? "—" : moodAvg.toFixed(1)}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-muted-foreground">Sentiment</span>
                            <Badge className={sentimentColor(sentAvg)}>{sentAvg === null ? "—" : sentAvg.toFixed(1)}</Badge>
                          </div>
                    </div>
                        <div className="text-[11px] text-muted-foreground mt-2 whitespace-nowrap overflow-hidden text-ellipsis">{journalCount} thoughts · {metricCount} metrics</div>
                  </button>
                );
              })}
            </div>
              </>
            )}

            {view === "day" && (
              <>
                <div className="text-sm text-muted-foreground mb-3">{formatDateKey(cursor)}</div>
                <div className="grid grid-cols-1 gap-2">
                  {Array.from({ length: 24 }, (_, h) => h).map((h) => {
                    const key = formatDateKey(cursor);
                    const day = grouped[key];
                    const journal = (day?.journal || []).filter((e) => new Date(e.createdAt).getHours() === h);
                    const moods = (day?.moods || []).filter((m) => new Date(m.createdAt).getHours() === h);
                    const metrics = (day?.metrics || []).filter((m) => new Date(m.createdAt).getHours() === h);
                    const sentAvg = journal.length ? journal.reduce((a, b) => a + (Number(b.score) || 0), 0) / journal.length : null;
                    const moodAvg = moods.length ? moods.reduce((a, b) => a + (Number(b.value) || 0), 0) / moods.length : null;
                    return (
                      <div key={h} className="rounded-md border p-3 flex items-center justify-between">
                        <div className="text-sm w-16 tabular-nums">{String(h).padStart(2, '0')}:00</div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-muted-foreground">Mood</span>
                            <Badge className={moodBadgeColor(moodAvg)}>{moodAvg === null ? "—" : moodAvg.toFixed(1)}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-muted-foreground">Sentiment</span>
                            <Badge className={sentimentColor(sentAvg)}>{sentAvg === null ? "—" : sentAvg.toFixed(1)}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-muted-foreground">Metrics</span>
                            <Badge variant="secondary">{metrics.length}</Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {selectedDateKey && view !== "day" ? (
          <Card className="lg:col-span-1 transition-all duration-700 transform motion-reduce:transition-none anim-in-slow">
          <CardHeader>
              <div className="flex items-center justify-between">
            <CardTitle>Day Details</CardTitle>
                <Button variant="ghost" size="icon" aria-label="Close day details" onClick={() => setSelectedDateKey(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
          </CardHeader>
          <CardContent>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${selectedDateKey ? "opacity-100 translate-y-0 scale-100 max-h-[2000px]" : "opacity-0 -translate-y-2 scale-95 max-h-0"}`}>
            {selectedDateKey ? (
                  <div className="space-y-4">
                <div className="text-sm text-muted-foreground">{new Date(selectedDateKey).toLocaleDateString()}</div>
                    {!selectedDay ? (
                  <p className="text-muted-foreground text-sm">No entries.</p>
                    ) : (
                      <>
                        <div>
                          <div className="text-sm font-medium mb-2">Thought Garden Entries</div>
                          {selectedDay.journal.length === 0 ? (
                            <p className="text-muted-foreground text-sm">None</p>
                ) : (
                  <div className="space-y-3">
                              {selectedDay.journal
                      .slice()
                      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
                      .map((e) => (
                        <div key={e.id} className="rounded-md border p-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>{new Date(e.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                                      <Badge className={sentimentColor(e.score)}>{e.score}</Badge>
                          </div>
                          <p className="text-sm leading-6 text-foreground/90 whitespace-pre-wrap break-words">{e.text}</p>
                        </div>
                      ))}
                  </div>
                )}
              </div>

                        <div>
                          <div className="text-sm font-medium mb-2">Mood Logs</div>
                          {selectedDay.moods.length === 0 ? (
                            <p className="text-muted-foreground text-sm">None</p>
                          ) : (
                            <div className="space-y-2">
                              {selectedDay.moods
                                .slice()
                                .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
                                .map((m) => (
                                  <div key={m.id} className="rounded-md border p-2 text-sm flex items-center justify-between">
                                    <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                                    <Badge className={moodBadgeColor(m.value)}>{m.value}/10</Badge>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="text-sm font-medium mb-2">Metric Logs</div>
                          {selectedDay.metrics.length === 0 ? (
                            <p className="text-muted-foreground text-sm">None</p>
                          ) : (
                            <div className="space-y-2">
                              {selectedDay.metrics
                                .slice()
                                .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
                                .map((m) => (
                                  <div key={m.id} className="rounded-md border p-2 text-xs">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-medium">{new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                                      <span className="text-muted-foreground">{new Date(m.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="flex items-center justify-between p-1 rounded border">
                                        <span>Sleep</span>
                                        <span>{m.sleep}/5</span>
                                      </div>
                                      <div className="flex items-center justify-between p-1 rounded border">
                                        <span>Stress</span>
                                        <span>{m.stress}/5</span>
                                      </div>
                                      <div className="flex items-center justify-between p-1 rounded border">
                                        <span>Energy</span>
                                        <span>{m.energy}/5</span>
                                      </div>
                                      <div className="flex items-center justify-between p-1 rounded border">
                                        <span>Focus</span>
                                        <span>{m.focus}/5</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ) : null}
              </div>
          </CardContent>
        </Card>
        ) : null}
      </div>
    </div>
  );
}



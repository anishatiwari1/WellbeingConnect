import { useEffect, useMemo, useRef, useState } from "react";
import Sentiment from "sentiment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import { Mic, Square, Save, Sparkles, Trash2 } from "lucide-react";
import { 
  JOURNAL_STORAGE_KEY, 
  METRICS_BROADCAST_CHANNEL, 
  METRICS_LOG_STORAGE_KEY, 
  METRICS_STORAGE_KEY, 
  DailyMetrics, 
  MetricsEntry, 
  MOOD_LOG_STORAGE_KEY, 
  MOOD_BROADCAST_CHANNEL, 
  MoodEntry 
} from "@/types/metrics";

interface Entry {
  id: string;
  createdAt: string;
  text: string;
  score: number;
}

export default function Journal() {
  // Journal state
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showAllEntries, setShowAllEntries] = useState(false);
  
  // Mood tracking state
  const [moodValue, setMoodValue] = useState<number | null>(null);
  const [moodLogs, setMoodLogs] = useState<MoodEntry[]>(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(MOOD_LOG_STORAGE_KEY) : null;
    if (!raw) return [];
    try { return JSON.parse(raw) as MoodEntry[]; } catch { return []; }
  });
  const [showAllMoods, setShowAllMoods] = useState(false);
  
  // Metrics state
  const [metricsEntries, setMetricsEntries] = useState<MetricsEntry[]>(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(METRICS_LOG_STORAGE_KEY) : null;
    if (raw) {
      try {
        return JSON.parse(raw) as MetricsEntry[];
      } catch {}
    }
    return [];
  });
  const [showAllMetrics, setShowAllMetrics] = useState(false);
  const [pending, setPending] = useState<{ 
    sleep: number | null; 
    stress: number | null; 
    energy: number | null; 
    focus: number | null 
  }>({ sleep: null, stress: null, energy: null, focus: null });
  
  // Refs and utilities
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const sentiment = useMemo(() => new Sentiment(), []);
  const metricsChannelRef = useRef<BroadcastChannel | null>(null);
  const moodChannelRef = useRef<BroadcastChannel | null>(null);
  // Constants
  const supportSTT = typeof window !== "undefined" && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  
  const metricConfigs = [
    { key: "sleep" as const, label: "Sleep Quality", emojis: ["😪", "😴", "🙂", "😌", "🌙"] },
    { key: "stress" as const, label: "Stress Level", emojis: ["🙂", "😐", "😟", "😣", "😫"] },
    { key: "energy" as const, label: "Energy Level", emojis: ["😴", "🙂", "⚡", "🔥", "🚀"] },
    { key: "focus" as const, label: "Focus Level", emojis: ["😕", "🙂", "🧠", "🎯", "🧘‍♂️"] },
  ] as const;

  const analysis = useMemo(() => {
    const res = sentiment.analyze(text || "");
    const score = res.score || 0;
    const label = score > 2 ? "Positive" : score < -2 ? "Negative" : "Neutral";
    return { score, label };
  }, [text, sentiment]);

  // Load initial data
  useEffect(() => {
    const raw = localStorage.getItem(JOURNAL_STORAGE_KEY);
    if (raw) setEntries(JSON.parse(raw));
  }, []);

  // Persist data to localStorage
  useEffect(() => {
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem(METRICS_LOG_STORAGE_KEY, JSON.stringify(metricsEntries));
  }, [metricsEntries]);

  useEffect(() => {
    localStorage.setItem(MOOD_LOG_STORAGE_KEY, JSON.stringify(moodLogs));
  }, [moodLogs]);

  // Setup BroadcastChannel for realtime cross-route/tab updates
  useEffect(() => {
    let metricsCh: BroadcastChannel | null = null;
    let moodCh: BroadcastChannel | null = null;
    
    try {
      metricsCh = new BroadcastChannel(METRICS_BROADCAST_CHANNEL);
      metricsChannelRef.current = metricsCh;
    } catch {
      metricsChannelRef.current = null;
    }
    
    try {
      moodCh = new BroadcastChannel(MOOD_BROADCAST_CHANNEL);
      moodChannelRef.current = moodCh;
    } catch {
      moodChannelRef.current = null;
    }
    
    return () => {
      try { metricsCh?.close?.(); } catch {}
      try { moodCh?.close?.(); } catch {}
    };
  }, []);

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { 
          recognitionRef.current.stop(); 
          recognitionRef.current.abort(); 
        } catch {}
        recognitionRef.current = null;
      }
    };
  }, []);

  // Speech recognition functions
  const startRecording = () => {
    if (!supportSTT) return;
    
    // Stop any existing recording first
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      } catch (error) {
        console.warn("Error stopping existing recognition:", error);
      }
      recognitionRef.current = null;
    }
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (e: any) => {
      const transcript = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join(" ");
      setText(transcript);
    };
    
    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };
    
    recognition.onerror = (event: any) => {
      console.warn("Speech recognition error:", event.error);
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    toast({ title: "Recording started", description: "Speak your thoughts freely." });
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      } catch (error) {
        console.warn("Error stopping speech recognition:", error);
      }
      recognitionRef.current = null;
    }
    setIsRecording(false);
    toast({ title: "Recording stopped" });
  };

  // Journal entry functions
  const saveEntry = () => {
    const newEntry: Entry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      text,
      score: analysis.score,
    };
    setEntries([newEntry, ...entries]);
    setText("");
    toast({ title: "Entry saved", description: "Your thought garden has been updated." });
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
    toast({ title: "Entry deleted" });
  };

  // Sentiment badge component
  const sentimentBadge = (
    <Badge
      className={
        analysis.label === "Positive"
          ? "bg-success text-success-foreground"
          : analysis.label === "Negative"
          ? "bg-destructive text-destructive-foreground"
          : "bg-secondary text-secondary-foreground"
      }
    >
      {analysis.label} ({analysis.score})
    </Badge>
  );

  return (
    <div className="container py-6 animate-enter">
      <SEO
        title="Thought Garden — Speech to Text with Sentiment | WellBeingConnect"
        description="Grow your thoughts with voice journaling and get instant sentiment insights to track your mental health."
        path="/journal"
      />
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Thought Garden</h1>
        <p className="text-muted-foreground mt-1">Speak freely. We transcribe and analyze your mood in real time.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Today’s Entry</CardTitle>
            {sentimentBadge}
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-3">
              {supportSTT ? (
                isRecording ? (
                  <Button variant="destructive" onClick={stopRecording}>
                    <Square /> Stop
                  </Button>
                ) : (
                  <Button variant="hero" onClick={startRecording}>
                    <Mic /> Record
                  </Button>
                )
              ) : (
                <Button variant="outline" disabled>
                  <Mic /> Speech to Text not supported
                </Button>
              )}
              <Button variant="secondary" onClick={saveEntry} disabled={!text.trim()}>
                <Save /> Save
              </Button>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start speaking or type here..."
              className="w-full min-h-[220px] rounded-md border bg-background p-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Instant sentiment powered on‑device.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How it works</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• Tap Record to capture your voice. We transcribe continuously.</p>
            <p>• Sentiment score updates as you speak or type.</p>
            <p>• Save to keep entries privately in your browser for now.</p>
          </CardContent>
        </Card>
      </div>

      <section className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Daily Wellness Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {metricConfigs.map((cfg) => (
                <div key={cfg.key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={cfg.key}>{cfg.label}</Label>
                    <span className="text-sm text-muted-foreground">{(pending[cfg.key] ?? 0) || 0}/5</span>
                  </div>
                  <div className="flex items-end gap-3" role="group" aria-label={`${cfg.label} 1 to 5`}>
                    {cfg.emojis.map((emo, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <span className="text-xs text-muted-foreground">{idx + 1}</span>
                        <Button
                          type="button"
                          variant={pending[cfg.key] === idx + 1 ? "default" : "outline"}
                          size="icon"
                          aria-pressed={pending[cfg.key] === idx + 1}
                          onClick={() => setPending((p) => ({ ...p, [cfg.key]: idx + 1 }))}
                          title={`${idx + 1}/5`}
                        >
                          <span className="text-lg" aria-hidden>
                            {emo}
                          </span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button 
                disabled={pending.sleep === null || pending.stress === null || pending.energy === null || pending.focus === null} 
                onClick={() => {
                  const entry: MetricsEntry = {
                    id: crypto.randomUUID(),
                    createdAt: new Date().toISOString(),
                    sleep: pending.sleep as number,
                    stress: pending.stress as number,
                    energy: pending.energy as number,
                    focus: pending.focus as number,
                  };
                  
                  setMetricsEntries((prev) => [entry, ...prev]);
                  
                  // Save snapshot to localStorage
                  const snapshot: DailyMetrics = { 
                    sleep: pending.sleep as number, 
                    stress: pending.stress as number, 
                    energy: pending.energy as number, 
                    focus: pending.focus as number, 
                    lastUpdatedISO: new Date().toISOString() 
                  };
                  localStorage.setItem(METRICS_STORAGE_KEY, JSON.stringify(snapshot));
                  
                  // Notify other components
                  try { 
                    metricsChannelRef.current?.postMessage({ type: "metrics:log", payload: entry }); 
                  } catch {}
                  try { 
                    window.dispatchEvent(new CustomEvent("metrics:log", { detail: entry })); 
                  } catch {}
                  
                  // Clear pending selections
                  setPending({ sleep: null, stress: null, energy: null, focus: null });
                  toast({ title: "Metrics saved", description: "Metrics logged and sanctuary updated." });
                }}
              >
                Save Metrics
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Daily Mood (1–10)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 flex-wrap">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <Button
                  key={n}
                  type="button"
                  variant={moodValue === n ? "default" : "outline"}
                  size="sm"
                  aria-pressed={moodValue === n}
                  onClick={() => setMoodValue(n)}
                >
                  {n}
                </Button>
              ))}
            </div>
            <div className="mt-4">
              <Button 
                disabled={moodValue === null} 
                onClick={() => {
                  const entry: MoodEntry = { 
                    id: crypto.randomUUID(), 
                    createdAt: new Date().toISOString(), 
                    value: moodValue as number 
                  };
                  
                  setMoodLogs((prev) => [entry, ...prev]);
                  
                  // Notify other components
                  try { 
                    moodChannelRef.current?.postMessage({ type: "mood:log", payload: entry }); 
                  } catch {}
                  try { 
                    window.dispatchEvent(new CustomEvent("mood:log", { detail: entry })); 
                  } catch {}
                  
                  toast({ title: "Mood saved", description: `Logged mood ${moodValue}/10` });
                  setMoodValue(null);
                }}
              >
                Save Mood
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-medium">Mood Logs</h2>
          {moodLogs.length > 4 && (
            <Button variant="ghost" size="sm" onClick={() => setShowAllMoods((v) => !v)}>
              {showAllMoods ? "Show less" : "View all"}
            </Button>
          )}
        </div>
        {moodLogs.length === 0 ? (
          <p className="text-muted-foreground">No mood logs yet. Save your first mood above.</p>
        ) : (
          <div className={showAllMoods ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-4" : "grid grid-flow-col auto-cols-[minmax(200px,1fr)] gap-3 overflow-x-auto"}>
            {(showAllMoods ? moodLogs : moodLogs.slice(0, 4)).map((m) => (
              <Card key={m.id} className="border bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/60 hover:shadow-sm transition-all duration-200 min-w-[200px]">
                <CardHeader className="py-3 px-4 flex flex-row justify-between items-center gap-2">
                  <CardTitle className="text-sm font-medium truncate max-w-[200px]">{new Date(m.createdAt).toLocaleString()}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete mood log"
                    className="h-7 w-7"
                    onClick={() => {
                      const ok = window.confirm("Delete this mood log? This cannot be undone.");
                      if (ok) {
                        setMoodLogs((prev) => prev.filter((x) => x.id !== m.id));
                        
                        // Notify other components
                        try { 
                          moodChannelRef.current?.postMessage({ type: "mood:delete", payload: { id: m.id } }); 
                        } catch {}
                        try { 
                          window.dispatchEvent(new CustomEvent("mood:log", { detail: { id: m.id, deleted: true } })); 
                        } catch {}
                      }
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-0 px-4 pb-4">
                  <div className="flex items-center justify-between text-sm p-2 rounded-lg border bg-muted/30">
                    <span className="text-muted-foreground">Mood</span>
                    <Badge>{m.value}/10</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-medium">Metric Logs</h2>
          {metricsEntries.length > 4 && (
            <Button variant="ghost" size="sm" onClick={() => setShowAllMetrics((v) => !v)}>
              {showAllMetrics ? "Show less" : "View all"}
            </Button>
          )}
        </div>
        {metricsEntries.length === 0 ? (
          <p className="text-muted-foreground">No metric logs yet. Save your first set above.</p>
        ) : (
          <div className={showAllMetrics ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-4" : "grid grid-flow-col auto-cols-[minmax(240px,1fr)] gap-3 overflow-x-auto"}>
            {(showAllMetrics ? metricsEntries : metricsEntries.slice(0, 4)).map((e) => (
              <Card key={e.id} className="border bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/60 hover:shadow-sm transition-all duration-200 min-w-[240px]">
                <CardHeader className="py-3 px-4 flex flex-row justify-between items-center gap-2">
                  <CardTitle className="text-sm font-medium truncate max-w-[200px]">{new Date(e.createdAt).toLocaleString()}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete metric log"
                    className="h-7 w-7"
                    onClick={() => {
                      const ok = window.confirm("Delete this metric log? This cannot be undone.");
                      if (ok) setMetricsEntries((prev) => prev.filter((m) => m.id !== e.id));
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-0 px-4 pb-4">
                  <div className="grid gap-2 text-xs">
                    <div className="p-2 rounded-lg border bg-muted/30">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-muted-foreground">Sleep</span>
                        <span className="font-medium">{e.sleep}/5</span>
                      </div>
                      <Progress value={(e.sleep / 5) * 100} className="h-1.5" />
                    </div>
                    <div className="p-2 rounded-lg border bg-muted/30">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-muted-foreground">Stress</span>
                        <span className="font-medium">{e.stress}/5</span>
                      </div>
                      <Progress value={(e.stress / 5) * 100} className="h-1.5" />
                    </div>
                    <div className="p-2 rounded-lg border bg-muted/30">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-muted-foreground">Energy</span>
                        <span className="font-medium">{e.energy}/5</span>
                      </div>
                      <Progress value={(e.energy / 5) * 100} className="h-1.5" />
                    </div>
                    <div className="p-2 rounded-lg border bg-muted/30">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-muted-foreground">Focus</span>
                        <span className="font-medium">{e.focus}/5</span>
                      </div>
                      <Progress value={(e.focus / 5) * 100} className="h-1.5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-medium">Entries</h2>
          {entries.length > 4 && (
            <Button variant="ghost" size="sm" onClick={() => setShowAllEntries((v) => !v)}>
              {showAllEntries ? "Show less" : "View all"}
            </Button>
          )}
        </div>
        {entries.length === 0 ? (
          <p className="text-muted-foreground">No entries yet. Start with your first voice note.</p>
        ) : (
          <div className={showAllEntries ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-4" : "grid grid-flow-col auto-cols-[minmax(260px,1fr)] gap-3 overflow-x-auto"}>
            {(showAllEntries ? entries : entries.slice(0, 4)).map((e) => (
              <Card key={e.id} className={showAllEntries ? "hover:shadow-md transition-shadow" : "hover:shadow-sm transition-shadow min-w-[260px]"}>
                <CardHeader className={showAllEntries ? "flex flex-row justify-between items-center gap-2" : "py-3 px-4 flex flex-row justify-between items-center gap-2"}>
                  <div className="flex items-center gap-3">
                    <CardTitle className={showAllEntries ? "text-base" : "text-sm"}>{new Date(e.createdAt).toLocaleString()}</CardTitle>
                    <Badge className={
                      e.score > 2
                        ? "bg-success text-success-foreground"
                        : e.score < -2
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }>
                      {e.score > 2 ? "Positive" : e.score < -2 ? "Negative" : "Neutral"} ({e.score})
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size={showAllEntries ? "icon" : "sm"}
                    aria-label="Delete entry"
                    onClick={() => {
                      const ok = window.confirm("Delete this entry? This cannot be undone.");
                      if (ok) deleteEntry(e.id);
                    }}
                  >
                    <Trash2 className={showAllEntries ? "h-4 w-4" : "h-3.5 w-3.5"} />
                  </Button>
                </CardHeader>
                <CardContent className={showAllEntries ? "" : "pt-0 px-4 pb-4"}>
                  <p className={showAllEntries ? "text-sm leading-6 text-foreground/90" : "text-xs leading-5 text-foreground/90 line-clamp-5"}>{e.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

import { Link, useLocation } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { METRICS_LOG_STORAGE_KEY, MetricsEntry, MOOD_LOG_STORAGE_KEY, MoodEntry, MOOD_BROADCAST_CHANNEL } from "@/types/metrics";
import { computeWeeklyAverages, toPercent, computeWeeklyMoodSeries } from "@/lib/metrics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Brain, Moon, Activity, Target, Award, BookOpen, Users } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/context/AuthContext";
import { useLoginQuote } from "@/hooks/use-daily-quote";

const Dashboard = () => {
  const { user } = useAuth();
  const loginQuote = useLoginQuote();
  
  const METRICS_LOG_KEY = METRICS_LOG_STORAGE_KEY;

  // Types now imported

  const [metricsLog, setMetricsLog] = useState<MetricsEntry[]>([]);
  const [moodLog, setMoodLog] = useState<MoodEntry[]>([]);
  const location = useLocation();

  const loadFromStorage = useCallback(() => {
    try {
      const rawLog = localStorage.getItem(METRICS_LOG_KEY);
      setMetricsLog(rawLog ? (JSON.parse(rawLog) as MetricsEntry[]) : []);
    } catch {
      setMetricsLog([]);
    }
    try {
      const rawMood = localStorage.getItem(MOOD_LOG_STORAGE_KEY);
      setMoodLog(rawMood ? (JSON.parse(rawMood) as MoodEntry[]) : []);
    } catch {
      setMoodLog([]);
    }
  }, []);

  useEffect(() => {
    loadFromStorage();
    const onFocus = () => loadFromStorage();
    const onVisibility = () => document.visibilityState === "visible" && loadFromStorage();
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === METRICS_LOG_KEY || e.key === MOOD_LOG_STORAGE_KEY) loadFromStorage();
    };
    // Realtime: BroadcastChannel and CustomEvent fallbacks
    let ch: BroadcastChannel | null = null;
    let moodCh: BroadcastChannel | null = null;
    try {
      ch = new BroadcastChannel("wellbeingconnect:metrics");
      ch.onmessage = () => loadFromStorage();
    } catch {
      ch = null;
    }
    try {
      moodCh = new BroadcastChannel(MOOD_BROADCAST_CHANNEL);
      moodCh.onmessage = () => loadFromStorage();
    } catch {
      moodCh = null;
    }
    const onSnapshot = () => loadFromStorage();
    const onLog = () => loadFromStorage();
    const onMoodLog = () => loadFromStorage();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("storage", onStorage);
    window.addEventListener("metrics:snapshot", onSnapshot as EventListener);
    window.addEventListener("metrics:log", onLog as EventListener);
    window.addEventListener("mood:log", onMoodLog as EventListener);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("metrics:snapshot", onSnapshot as EventListener);
      window.removeEventListener("metrics:log", onLog as EventListener);
      window.removeEventListener("mood:log", onMoodLog as EventListener);
      if (ch) ch.close();
      if (moodCh) moodCh.close();
    };
  }, [loadFromStorage]);

  useEffect(() => {
    // Reload whenever route changes back to dashboard
    loadFromStorage();
  }, [location.pathname, loadFromStorage]);

  const moodSeries = useMemo(() => computeWeeklyMoodSeries(moodLog), [moodLog]);
  const weekAvg = useMemo(() => {
    const vals = moodSeries.map((d) => d.mood).filter((v) => v > 0);
    if (vals.length === 0) return 0;
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
  }, [moodSeries]);

  const metricsToPercent = (n?: number) => toPercent(n);

  const weeklyAverages = useMemo(() => computeWeeklyAverages(metricsLog), [metricsLog]);

  const wellnessMetrics = [
    { title: "Sleep Quality", value: metricsToPercent(weeklyAverages?.sleep), icon: Moon, color: "text-primary", bgColor: "bg-primary/10" },
    { title: "Stress Level", value: metricsToPercent(weeklyAverages?.stress), icon: Brain, color: "text-success", bgColor: "bg-success/10" },
    { title: "Energy Level", value: metricsToPercent(weeklyAverages?.energy), icon: Activity, color: "text-warning", bgColor: "bg-warning/10" },
    { title: "Focus Score", value: metricsToPercent(weeklyAverages?.focus), icon: Target, color: "text-primary", bgColor: "bg-primary/10" },
  ];

  const quickActions = [
    { title: "Start Growing Thoughts", icon: BookOpen, href: "/journal" },
    { title: "Visit Calm Corner", icon: BookOpen, href: "/blog" },
    { title: "Connect with Experts", icon: Users, href: "/psychologists" },
  ];

  const recentActivities = [
    { action: "Completed daily thought garden entry", time: "2 hours ago", type: "journal" },
    { action: "Read article about stress management", time: "1 day ago", type: "reading" },
    { action: "Completed breathing exercise", time: "2 days ago", type: "exercise" },
    { action: "Scheduled therapy session", time: "3 days ago", type: "appointment" },
  ];

  return (
    <main className="container py-8 animate-enter">
      <SEO title="My Sanctuary — WellBeingConnect" description="Your personal mental health sanctuary and overview." />

      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome to Your Sanctuary, {user?.name || 'User'}! 🏡
            </h1>
            <p className="text-muted-foreground mt-2">Your personal space for mental wellness and reflection</p>
          </div>
          <div className="flex items-center gap-4"></div>
        </div>
      </header>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Sanctuary Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {wellnessMetrics.map((metric) => (
            <Card key={metric.title} className="bg-gradient-card hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <Badge variant="secondary" className="bg-gradient-secondary">
                    {metric.value}%
                  </Badge>
                </div>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={metric.value} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="bg-gradient-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Weekly Mood Tracker
              </CardTitle>
              <p className="text-sm text-muted-foreground">Your emotional journey this week</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-32 mb-4">
                {moodSeries.map((day) => (
                  <div key={day.day} className="flex flex-col items-center">
                    <div className="text-xs text-muted-foreground mb-2">{day.day}</div>
                    <div className={`w-8 rounded-t-lg bg-primary transition-all duration-300 hover:scale-110`} style={{ height: `${(day.mood / 10) * 80}px` }} />
                    <div className="text-xs font-medium mt-1">{day.mood}/10</div>
                  </div>
                ))}
              </div>
              {/* Removed summary row */}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-gradient-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action) => (
                <Link key={action.title} to={action.href}>
                  <Button variant="ghost" className="w-full justify-start h-12 text-muted-foreground hover:text-primary-foreground hover:bg-primary transition-all duration-300">
                    <action.icon className="w-4 h-4 mr-3" />
                    {action.title}
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 mt-6 lg:grid-cols-2">
        <Card className="bg-gradient-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-warning" />
              This Week's Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-lg border border-warning/20">
                <div className="w-10 h-10 bg-warning rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-warning-foreground" />
                </div>
                <div>
                  <p className="font-medium">7-Day Thought Garden Streak</p>
                  <p className="text-sm text-muted-foreground">Keep up the great work!</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg border border-success/20">
                <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-success-foreground" />
                </div>
                <div>
                  <p className="font-medium">Mood Improvement</p>
                  <p className="text-sm text-muted-foreground">+15% better than last week</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium">Focus Master</p>
                  <p className="text-sm text-muted-foreground">91% focus score achieved</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 bg-gradient-primary border-0 text-primary-foreground">
        <CardContent className="pt-6">
          <blockquote className="text-center">
            <p className="text-lg italic mb-2">
              "{loginQuote.text}"
            </p>
            <footer className="text-sm opacity-90">— {loginQuote.author}</footer>
          </blockquote>
        </CardContent>
      </Card>
    </main>
  );
};

export default Dashboard;

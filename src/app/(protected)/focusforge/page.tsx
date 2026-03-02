"use client";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useState, useEffect } from "react";
import PomodoroTimer from "@/components/focus/PomodoroTimer";
import { Card } from "@/components/ui";
import { 
  Flame, 
  History, 
  TrendingUp, 
  Calendar, 
  Clock,
  Loader2 
} from "lucide-react";

interface FocusSession {
  id: string;
  duration: number;
  completed: boolean;
  timestamp: string;
}

export default function FocusForgePage() {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/focus");
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (duration: number) => {
    try {
      await fetch("/api/focus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duration, completed: true }),
      });
      fetchSessions();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const totalFocusTime = sessions.reduce((acc, s) => acc + s.duration, 0);
  const totalHours = (totalFocusTime / 3600).toFixed(1);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-accent-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">FocusForge</h1>
        <p className="text-text-secondary">Master deep work with timed focus blocks and intentional breaks.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        {/* Timer Section */}
        <section className="space-y-6">
          <PomodoroTimer onComplete={handleComplete} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="flex items-center gap-4 p-5 bg-accent-primary/5">
              <div className="p-3 rounded-xl bg-accent-primary/10 text-accent-primary">
                <Flame size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Total Focus</p>
                <h3 className="text-xl font-bold text-text-primary">{totalHours} Hours</h3>
              </div>
            </Card>
            <Card className="flex items-center gap-4 p-5 bg-accent-secondary/5">
              <div className="p-3 rounded-xl bg-accent-secondary/10 text-accent-secondary">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Sessions</p>
                <h3 className="text-xl font-bold text-text-primary">{sessions.length} Completed</h3>
              </div>
            </Card>
          </div>
        </section>

        {/* History Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
              <History size={16} className="text-accent-primary" /> Session History
            </h3>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Recent 20</span>
          </div>

          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-text-secondary/5 max-h-[640px] overflow-y-auto custom-scrollbar">
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <div key={session.id} className="p-5 flex items-center justify-between hover:bg-bg-surface/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-xl bg-bg-surface border border-text-secondary/10 text-accent-primary">
                        <Clock size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-primary">
                          {Math.floor(session.duration / 60)} minute session
                        </p>
                        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-tighter flex items-center gap-1.5 mt-0.5">
                          <Calendar size={10} />
                          {new Date(session.timestamp).toLocaleDateString("en-US", { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    {session.completed && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-secondary/10 text-accent-secondary">
                         <div className="w-1 h-1 rounded-full bg-accent-secondary animate-pulse" />
                         <span className="text-[10px] font-extrabold uppercase tracking-widest">Success</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-20 text-center space-y-3">
                  <div className="p-4 rounded-full bg-bg-surface border border-text-secondary/5 inline-block mx-auto">
                    <Clock size={32} className="text-text-secondary opacity-30" />
                  </div>
                  <p className="text-text-secondary text-sm font-medium">No sessions logged yet. Your focus journey begins now.</p>
                </div>
              )}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

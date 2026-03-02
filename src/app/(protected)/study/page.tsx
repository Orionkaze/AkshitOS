"use client";

import { useEffect, useState } from "react";
import StudyLogForm from "@/components/study/StudyLogForm";
import StudyChart from "@/components/study/StudyChart";
import { Card } from "@/components/ui";
import { 
  Loader2, 
  BookOpen, 
  Hourglass, 
  BarChart2, 
  Clock,
  Trash2,
  Trophy,
  Sparkles
} from "lucide-react";

export default function StudyPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/study");
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this log?")) return;
    try {
      await fetch(`/api/study/${id}`, { method: "DELETE" });
      fetchLogs();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const totalHours = logs.reduce((acc, current) => acc + current.hours, 0);
  const avgConfidence = logs.length > 0 
    ? (logs.reduce((acc, current) => acc + current.confidence, 0) / logs.length).toFixed(1)
    : "0";

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
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Study Analyzer</h1>
        <p className="text-text-secondary">Quantify your learning and track subject-wise mastery.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 flex items-center gap-6 bg-accent-secondary/5 border-accent-secondary/10">
              <div className="p-4 rounded-2xl bg-accent-secondary/10 text-accent-secondary">
                <Hourglass size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Total Study Time</p>
                <h3 className="text-3xl font-extrabold text-text-primary mt-1">{totalHours} Hours</h3>
              </div>
            </Card>
            
            <Card className="p-6 flex items-center gap-6 bg-purple-500/5 border-purple-500/10">
              <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400">
                <BarChart2 size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Avg. Confidence</p>
                <h3 className="text-3xl font-extrabold text-text-primary mt-1">{avgConfidence}/5.0</h3>
              </div>
            </Card>
          </div>

          <StudyChart data={logs} />

          <section className="space-y-4">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest flex items-center gap-2 pl-1">
              <Trophy size={16} className="text-accent-secondary" /> Mastery Logs
            </h3>
            <Card className="p-0 overflow-hidden">
              <div className="divide-y divide-text-secondary/5 max-h-[400px] overflow-y-auto custom-scrollbar">
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <div key={log.id} className="p-5 flex items-center justify-between group hover:bg-bg-surface/50 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl border border-text-secondary/10 font-bold text-xs ${log.confidence >= 4 ? 'text-green-400' : log.confidence <= 2 ? 'text-red-400' : 'text-text-secondary'}`}>
                          {log.confidence}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary">{log.subject}</p>
                          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-tighter flex items-center gap-1 mt-0.5">
                            <Clock size={10} />
                            {new Date(log.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-sm font-bold text-text-primary">{log.hours}h</span>
                        <button 
                          onClick={() => handleDelete(log.id)}
                          className="p-2 rounded-lg hover:bg-alert-error/10 text-text-secondary hover:text-alert-error opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center text-text-secondary text-sm font-medium">No study logs yet. Time to hit the books!</div>
                )}
              </div>
            </Card>
          </section>
        </div>

        <div className="space-y-8">
          <StudyLogForm onSuccess={fetchLogs} />
          
          <Card className="p-6 bg-accent-secondary/5 border-accent-secondary/10">
            <h4 className="text-sm font-bold text-accent-secondary uppercase tracking-widest mb-2 flex items-center gap-2">
              <Sparkles size={14} /> Efficiency Tip
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed font-sm">
              Studies show that tracking your confidence levels helps identify "active recall" gaps. Spend more time on subjects with confidence levels below 3.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

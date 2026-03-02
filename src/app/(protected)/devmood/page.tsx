import { useEffect, useState } from "react";
import MoodLogForm from "@/components/devmood/MoodLogForm";
import MoodChart from "@/components/devmood/MoodChart";
import MoodHistory from "@/components/devmood/MoodHistory";
import { Loader2, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui";

export default function DevMoodPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/devmood");
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/devmood/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchEntries();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-accent-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">DevMood Tracking</h1>
          <p className="text-text-secondary">Correlate your mood with deep work hours and energy levels.</p>
        </div>
        <button 
          onClick={() => { setLoading(true); fetchEntries(); }} 
          className="p-2 rounded-lg bg-bg-surface border border-text-secondary/10 text-text-secondary hover:text-accent-primary transition-colors"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <MoodChart data={entries} />
          <MoodHistory data={entries} onDelete={handleDelete} />
        </div>
        
        <div className="space-y-8">
           <section className="space-y-4">
             <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest pl-1">New Session</h3>
             <MoodLogForm onSuccess={fetchEntries} />
           </section>

           <Card className="p-6 bg-accent-primary/5 border-accent-primary/10">
              <h4 className="text-sm font-bold text-accent-primary uppercase tracking-widest mb-2">Pro Tip</h4>
              <p className="text-xs text-text-secondary leading-relaxed font-medium">
                Try logging your mood immediately after a deep work session to capture the most accurate energy and focus data. Consistency is key to long-term trends!
              </p>
           </Card>
        </div>
      </div>
    </div>
  );
}

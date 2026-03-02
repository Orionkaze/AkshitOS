"use client";

import { useState } from "react";
import { Card, Button, Input } from "@/components/ui";
import { 
  Smile, 
  Meh, 
  Frown, 
  Zap, 
  Trophy, 
  Loader2 
} from "lucide-react";

const MOODS = [
  { id: "Focused", icon: Zap, label: "Focused", color: "text-blue-400", bg: "bg-blue-400/10" },
  { id: "Productive", icon: Trophy, label: "Productive", color: "text-green-400", bg: "bg-green-400/10" },
  { id: "Neutral", icon: Meh, label: "Neutral", color: "text-text-secondary", bg: "bg-text-secondary/10" },
  { id: "Distracted", icon: Frown, label: "Distracted", color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { id: "BurnedOut", icon: Smile, label: "Burned Out", color: "text-red-400", bg: "bg-red-400/10" }, // Using Smile for irony or just pick another
];

export default function MoodLogForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState("Focused");
  const [hours, setHours] = useState("1");
  const [energy, setEnergy] = useState("7");
  const [note, setNote] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/devmood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, hours, energy, note }),
      });

      if (res.ok) {
        setNote("");
        onSuccess();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-sm font-bold text-text-primary mb-4 block uppercase tracking-tight">How's the vibe?</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {MOODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMood(m.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-300 ${
                  mood === m.id 
                    ? `border-accent-primary ${m.bg} scale-105` 
                    : "border-text-secondary/5 hover:border-text-secondary/20 bg-bg-primary"
                }`}
              >
                <m.icon size={20} className={mood === m.id ? m.color : "text-text-secondary"} />
                <span className={`text-xs font-bold ${mood === m.id ? "text-text-primary" : "text-text-secondary"}`}>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Hours Logged" 
            type="number" 
            step="0.5" 
            min="0"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            required
          />
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-widest block">Energy Level (1-10)</label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={energy}
              onChange={(e) => setEnergy(e.target.value)}
              className="w-full h-1.5 bg-bg-surface rounded-lg appearance-none cursor-pointer accent-accent-primary border border-text-secondary/5"
            />
            <div className="flex justify-between text-[10px] font-bold text-text-secondary px-1 uppercase tracking-tighter">
              <span>Zombie</span>
              <span className="text-accent-primary">{energy}</span>
              <span>God Mode</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
           <label className="text-xs font-bold text-text-secondary uppercase tracking-widest block">Quick Note</label>
           <textarea 
             className="w-full bg-bg-surface border border-text-secondary/10 rounded-xl p-4 text-sm text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all min-h-[100px] resize-none"
             placeholder="What did you achieve in this block?"
             value={note}
             onChange={(e) => setNote(e.target.value)}
           />
        </div>

        <Button type="submit" className="w-full py-6 group" isLoading={loading}>
          {!loading && <Zap size={18} className="mr-2 group-hover:animate-pulse" />}
          Log Session
        </Button>
      </form>
    </Card>
  );
}

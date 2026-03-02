"use client";

import { useState } from "react";
import { Card, Button, Input } from "@/components/ui";
import { BookOpen, Plus, Sparkles } from "lucide-react";

export default function StudyLogForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [hours, setHours] = useState("");
  const [confidence, setConfidence] = useState("3");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !hours) return;
    
    setLoading(true);

    try {
      const res = await fetch("/api/study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, hours, confidence }),
      });

      if (res.ok) {
        setSubject("");
        setHours("");
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
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
          <BookOpen size={18} className="text-accent-secondary" /> Log Study Session
        </h3>
        
        <div className="space-y-4">
          <Input 
            label="Subject / Topic" 
            placeholder="e.g. Quantum Physics" 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Hours" 
              type="number" 
              step="0.5" 
              min="0"
              placeholder="0.0"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              required
            />
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] block pl-1">Confidence (1-5)</label>
              <select 
                className="w-full bg-bg-primary border border-text-secondary/10 rounded-xl p-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-secondary/20 focus:border-accent-secondary transition-all cursor-pointer"
                value={confidence}
                onChange={(e) => setConfidence(e.target.value)}
              >
                <option value="1">1 - Confused</option>
                <option value="2">2 - Improving</option>
                <option value="3">3 - Solid</option>
                <option value="4">4 - Advanced</option>
                <option value="5">5 - Expert</option>
              </select>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full py-6 group bg-accent-secondary hover:bg-green-600 shadow-lg shadow-accent-secondary/10" isLoading={loading}>
          {!loading && <Sparkles size={18} className="mr-2" />}
          Log Progress
        </Button>
      </form>
    </Card>
  );
}

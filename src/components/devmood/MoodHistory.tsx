"use client";

import { Card } from "@/components/ui";
import { 
  Zap, 
  Trophy, 
  Meh, 
  Frown, 
  Smile, 
  Clock, 
  Battery, 
  Trash2 
} from "lucide-react";

const MOOD_ICONS: any = {
  Focused: { icon: Zap, color: "text-blue-400" },
  Productive: { icon: Trophy, color: "text-green-400" },
  Neutral: { icon: Meh, color: "text-text-secondary" },
  Distracted: { icon: Frown, color: "text-yellow-400" },
  BurnedOut: { icon: Smile, color: "text-red-400" },
};

export default function MoodHistory({ data, onDelete }: { data: any[], onDelete: (id: string) => void }) {
  if (data.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center border-dashed p-10">
        <p className="text-text-secondary text-sm">No history yet.</p>
      </Card>
    );
  }

  return (
    <Card className="p-0 overflow-hidden h-full">
      <div className="p-6 border-b border-text-secondary/5">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest">Recent Logs</h3>
      </div>
      <div className="divide-y divide-text-secondary/5 max-h-[600px] overflow-y-auto custom-scrollbar">
        {data.map((entry) => {
          const MoodInfo = MOOD_ICONS[entry.mood] || { icon: Meh, color: "text-text-secondary" };
          return (
            <div key={entry.id} className="p-5 flex items-start justify-between group hover:bg-bg-surface/50 transition-colors">
              <div className="flex gap-4">
                <div className={`p-2.5 rounded-xl bg-bg-surface border border-text-secondary/10 ${MoodInfo.color}`}>
                  <MoodInfo.icon size={18} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-text-primary">{entry.mood}</span>
                    <span className="w-1 h-1 rounded-full bg-text-secondary/30" />
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-tighter">
                      {new Date(entry.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {entry.note && <p className="text-xs text-text-secondary line-clamp-2 max-w-sm">{entry.note}</p>}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                      <Clock size={12} className="text-accent-secondary" /> {entry.hours}h
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                      <Battery size={12} className="text-accent-primary" /> {entry.energy}/10
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => onDelete(entry.id)}
                className="p-2 rounded-lg hover:bg-alert-error/10 hover:text-alert-error text-text-secondary transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

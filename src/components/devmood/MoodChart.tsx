"use client";

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Dot
} from "recharts";
import { Card } from "@/components/ui";

export default function MoodChart({ data }: { data: any[] }) {
  const chartData = [...data].reverse().map(entry => ({
    date: new Date(entry.date).toLocaleDateString("en-US", { weekday: 'short' }),
    energy: entry.energy || 0,
    hours: entry.hours || 0,
    mood: entry.mood,
  }));

  if (chartData.length === 0) {
    return (
      <Card className="h-[400px] flex items-center justify-center border-dashed">
        <p className="text-text-secondary text-sm">No data logged yet. Start logging to see trends.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest">Productivity Trend</h3>
        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-tight">
          <div className="flex items-center gap-1.5 text-accent-primary">
            <span className="w-2 h-2 rounded-full bg-accent-primary" /> Energy
          </div>
          <div className="flex items-center gap-1.5 text-accent-secondary">
            <span className="w-2 h-2 rounded-full bg-accent-secondary" /> Hours
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1f2937', borderRadius: '12px', fontSize: '12px' }}
            itemStyle={{ fontWeight: 600 }}
          />
          <Area 
            type="monotone" 
            dataKey="energy" 
            stroke="#4F46E5" 
            fillOpacity={1} 
            fill="url(#colorEnergy)" 
            strokeWidth={3}
            animationDuration={1500}
          />
          <Area 
            type="monotone" 
            dataKey="hours" 
            stroke="#10B981" 
            fillOpacity={1} 
            fill="url(#colorHours)" 
            strokeWidth={3}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

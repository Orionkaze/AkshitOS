"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";
import { Card } from "@/components/ui";

const COLORS = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444"];

export default function StudyChart({ data }: { data: any[] }) {
  // Aggregate hours by subject
  const subjectData = data.reduce((acc: any[], log) => {
    const existing = acc.find(item => item.subject === log.subject);
    if (existing) {
      existing.hours += log.hours;
      existing.confidence = Math.max(existing.confidence, log.confidence);
    } else {
      acc.push({ subject: log.subject, hours: log.hours, confidence: log.confidence });
    }
    return acc;
  }, []);

  if (subjectData.length === 0) {
    return (
      <Card className="h-[400px] flex items-center justify-center border-dashed">
        <p className="text-text-secondary text-sm">No study logs yet.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 h-[400px] flex flex-col">
      <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-6">Subject Distribution (Hours)</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={subjectData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} stroke="#1f2937" vertical={false} />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="subject" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }}
              width={100}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1f2937', borderRadius: '12px', fontSize: '12px' }}
              itemStyle={{ fontWeight: 600, color: '#f8fafc' }}
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            />
            <Bar dataKey="hours" radius={[0, 4, 4, 0]} barSize={20}>
              {subjectData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

"use client";

import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from "recharts";
import { Card } from "@/components/ui";

const COLORS = [
  "#4F46E5", // indigo
  "#10B981", // emerald
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#6B7280", // gray
];

export default function CategoryPieChart({ data }: { data: any[] }) {
  const categoryData = data.reduce((acc: any[], entry) => {
    const existing = acc.find(item => item.name === entry.category);
    if (existing) {
      existing.value += entry.amount;
    } else {
      acc.push({ name: entry.category, value: entry.amount });
    }
    return acc;
  }, []);

  if (categoryData.length === 0) {
    return (
      <Card className="h-[400px] flex items-center justify-center border-dashed">
        <p className="text-text-secondary text-sm">No expense data logged yet.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 h-[400px] flex flex-col">
      <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-6">Spending by Category</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              animationDuration={1000}
            >
              {categoryData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1f2937', borderRadius: '12px', fontSize: '12px' }}
              itemStyle={{ fontWeight: 600, color: '#f8fafc' }}
              formatter={(value: any) => value ? `$${(Number(value)).toFixed(2)}` : "$0.00"}
            />
            <Legend 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
              wrapperStyle={{ fontSize: '10px', fontWeight: 700, paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

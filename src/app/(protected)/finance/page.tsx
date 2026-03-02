"use client";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useEffect, useState } from "react";
import ExpenseLogForm from "@/components/finance/ExpenseLogForm";
import CategoryPieChart from "@/components/finance/CategoryPieChart";
import { Card } from "@/components/ui";
import { 
  Loader2, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Trash2,
  Receipt
} from "lucide-react";

export default function FinancePage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/finance");
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
    if (!confirm("Delete this entry?")) return;
    try {
      await fetch(`/api/finance/${id}`, { method: "DELETE" });
      fetchEntries();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const totalSpent = entries.reduce((acc, current) => acc + current.amount, 0);

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
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Personal Finance</h1>
        <p className="text-text-secondary">Track your spending and optimize your budget.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 flex items-center gap-6 bg-accent-primary/5 hover:border-accent-primary/20 transition-all">
              <div className="p-4 rounded-2xl bg-accent-primary/10 text-accent-primary shadow-inner">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Total Expenses</p>
                <h3 className="text-3xl font-extrabold text-text-primary mt-1">${totalSpent.toFixed(2)}</h3>
              </div>
            </Card>
            
            <Card className="p-6 flex items-center gap-6 bg-accent-secondary/5">
              <div className="p-4 rounded-2xl bg-accent-secondary/10 text-accent-secondary">
                <TrendingDown size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Current Burn Rate</p>
                <h3 className="text-3xl font-extrabold text-text-primary mt-1">High</h3>
              </div>
            </Card>
          </div>

          <CategoryPieChart data={entries} />

          <section className="space-y-4">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest flex items-center gap-2 pl-1">
              <Receipt size={16} className="text-accent-primary" /> Recent Transactions
            </h3>
            <Card className="p-0 overflow-hidden">
              <div className="divide-y divide-text-secondary/5 max-h-[400px] overflow-y-auto custom-scrollbar">
                {entries.length > 0 ? (
                  entries.map((entry) => (
                    <div key={entry.id} className="p-5 flex items-center justify-between group hover:bg-bg-surface/50 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-bg-surface border border-text-secondary/10 text-text-primary font-bold text-xs">
                          {entry.category[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary">{entry.category}</p>
                          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-tighter flex items-center gap-1 mt-0.5">
                            <Calendar size={10} />
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-sm font-bold text-text-primary">-${entry.amount.toFixed(2)}</span>
                        <button 
                          onClick={() => handleDelete(entry.id)}
                          className="p-2 rounded-lg hover:bg-alert-error/10 text-text-secondary hover:text-alert-error opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center text-text-secondary text-sm">No transactions yet.</div>
                )}
              </div>
            </Card>
          </section>
        </div>

        <div className="space-y-8">
          <ExpenseLogForm onSuccess={fetchEntries} />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Card, Button, Input } from "@/components/ui";
import { Wallet, Plus, Loader2 } from "lucide-react";

const CATEGORIES = [
  "Food & Drink",
  "Transport",
  "Entertainment",
  "Shopping",
  "Health",
  "Bills",
  "Other"
];

export default function ExpenseLogForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount))) return;
    
    setLoading(true);

    try {
      const res = await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, amount }),
      });

      if (res.ok) {
        setAmount("");
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
          <Wallet size={18} className="text-accent-primary" /> Log Expense
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] block pl-1">Category</label>
            <select 
              className="w-full bg-bg-primary border border-text-secondary/10 rounded-xl p-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <Input 
            label="Amount ($)" 
            type="number" 
            step="0.01" 
            min="0"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full py-6 group shadow-lg shadow-accent-primary/10" isLoading={loading}>
          {!loading && <Plus size={18} className="mr-2" />}
          Add Expense
        </Button>
      </form>
    </Card>
  );
}

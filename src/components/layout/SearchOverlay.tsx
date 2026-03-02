"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  X, 
  Command, 
  TrendingUp, 
  History, 
  Settings,
  LayoutDashboard,
  Brain,
  Timer,
  Code2,
  Wallet,
  BookOpen,
  FileSearch,
  Type,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, color: "text-accent-primary" },
  { label: "DevMood", href: "/devmood", icon: Brain, color: "text-accent-primary" },
  { label: "FocusForge", href: "/focus", icon: Timer, color: "text-accent-secondary" },
  { label: "Snippet Vault", href: "/snippets", icon: Code2, color: "text-purple-400" },
  { label: "Finance", href: "/finance", icon: Wallet, color: "text-red-400" },
  { label: "Study Analyzer", href: "/study", icon: BookOpen, color: "text-green-400" },
  { label: "Resume Ranker", href: "/resume", icon: FileSearch, color: "text-accent-primary" },
  { label: "Text Classifier", href: "/classifier", icon: Type, color: "text-accent-primary" },
];

export default function SearchOverlay({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredItems = NAV_ITEMS.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-bg-primary/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-bg-surface border border-text-secondary/10 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-text-secondary/5 flex items-center gap-4">
          <Search size={20} className="text-text-secondary" />
          <input 
            autoFocus
            className="flex-1 bg-transparent border-none text-lg text-text-primary placeholder:text-text-secondary/30 focus:outline-none"
            placeholder="Search AkshitOS..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-bg-primary border border-text-secondary/10 text-[10px] font-bold text-text-secondary uppercase">
            Esc
          </div>
          <button onClick={onClose} className="p-2 hover:bg-bg-primary rounded-xl text-text-secondary transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            <h4 className="px-4 text-[10px] font-extrabold text-text-secondary uppercase tracking-[0.2em] mb-4">Navigations</h4>
            {filteredItems.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                    router.push(item.href);
                    onClose();
                }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-bg-primary group transition-all text-left"
              >
                <div className={`p-2 rounded-xl bg-bg-surface border border-text-secondary/5 group-hover:border-accent-primary/20 ${item.color}`}>
                    <item.icon size={18} />
                </div>
                <span className="text-sm font-bold text-text-primary group-hover:text-accent-primary transition-all">{item.label}</span>
                <TrendingUp size={14} className="ml-auto text-text-secondary opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            ))}
            {filteredItems.length === 0 && (
              <div className="py-12 text-center space-y-2">
                <Command size={24} className="mx-auto text-text-secondary/20" />
                <p className="text-sm text-text-secondary">No results found for "{query}"</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-bg-primary/50 border-t border-text-secondary/5 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                    <div className="px-1.5 py-0.5 rounded-md bg-bg-surface border border-text-secondary/10">↑↓</div> Select
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                    <div className="px-1.5 py-0.5 rounded-md bg-bg-surface border border-text-secondary/10">Enter</div> Open
                </div>
            </div>
            <div className="text-[10px] font-bold text-accent-primary uppercase tracking-widest flex items-center gap-2">
                AkshitOS v1.0 <Zap size={10} />
            </div>
        </div>
      </div>
    </div>
  );
}

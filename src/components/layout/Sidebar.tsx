"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Timer, 
  Code2, 
  Wallet, 
  BookOpen, 
  FileText, 
  Search, 
  LayoutDashboard,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "DevMood", icon: BarChart3, href: "/devmood" },
  { label: "FocusForge", icon: Timer, href: "/focusforge" },
  { label: "Snippet Vault", icon: Code2, href: "/snippets" },
  { label: "Finance", icon: Wallet, href: "/finance" },
  { label: "Study Analyzer", icon: BookOpen, href: "/study" },
  { label: "Resume Ranker", icon: FileText, href: "/resume" },
  { label: "Text Classifier", icon: Search, href: "/classifier" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-bg-surface border-r border-text-secondary/10 transition-all duration-300 z-50 ${
        collapsed ? "w-[72px]" : "w-[240px]"
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-[60px] flex items-center justify-between px-6 border-bottom border-text-secondary/10">
        {!collapsed && <span className="text-accent-primary font-bold text-xl tracking-tight">AkshitOS</span>}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-bg-primary rounded-md text-text-secondary hover:text-text-primary transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="mt-4 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-all group ${
                isActive 
                  ? "bg-accent-primary/10 text-accent-primary border-l-2 border-accent-primary" 
                  : "text-text-secondary hover:bg-bg-primary hover:text-text-primary"
              }`}
            >
              <item.icon size={22} className={isActive ? "text-accent-primary" : "group-hover:text-text-primary"} />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

"use client";

import { useSession, signOut } from "next-auth/react";
import { User, LogOut, Search as SearchIcon } from "lucide-react";
import { useState } from "react";
import SearchOverlay from "./SearchOverlay";

export default function Header() {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="h-[60px] bg-bg-surface border-b border-text-secondary/10 flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-md bg-opacity-80">
        <div className="flex-1 flex items-center max-w-xl">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="w-full relative group cursor-text"
          >
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary group-hover:text-accent-primary transition-colors" size={18} />
            <div className="w-full bg-bg-primary border border-text-secondary/20 rounded-xl py-2 pl-10 pr-4 text-sm text-text-secondary/50 text-left flex items-center justify-between group-hover:border-accent-primary/20 transition-all">
              <span>Search productivity logs...</span>
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-bg-surface border border-text-secondary/10 text-[10px] font-bold text-text-secondary uppercase">
                <span className="text-[14px]">⌘</span> K
              </div>
            </div>
          </button>
        </div>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <div className="flex items-center gap-4 relative">
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-3 hover:bg-bg-primary p-2 rounded-lg transition-colors"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-text-primary capitalize">{session?.user?.name || "Guest User"}</p>
            <p className="text-xs text-text-secondary">{session?.user?.email || "Not signed in"}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-accent-primary flex items-center justify-center text-white overflow-hidden border-2 border-accent-primary/20">
            {session?.user?.image ? (
              <img src={session.user.image} alt="User" />
            ) : (
              <User size={20} />
            )}
          </div>
        </button>

        {showDropdown && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-bg-surface border border-text-secondary/20 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="p-3 border-b border-text-secondary/10 sm:hidden">
              <p className="text-sm font-medium text-text-primary">{session?.user?.name}</p>
              <p className="text-xs text-text-secondary">{session?.user?.email}</p>
            </div>
            <button 
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-alert-error hover:bg-bg-primary transition-colors text-left"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  </>
  );
}

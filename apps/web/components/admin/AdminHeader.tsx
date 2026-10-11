"use client";

import React, { useState, useEffect } from "react";
import { Search, Sparkles, Command, ShieldCheck, Download, LogOut } from "lucide-react";
import { useAuth } from "../../context/auth-context";

interface AdminHeaderProps {
  onSearchChange?: (q: string) => void;
}

export function AdminHeader({ onSearchChange }: AdminHeaderProps) {
  const { user, logout, switchUserQuick } = useAuth();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="h-16 border-b border-surface-border glass-panel px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Global Command Search */}
      <div className="relative w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchVal}
          onChange={(e) => {
            setSearchVal(e.target.value);
            if (onSearchChange) onSearchChange(e.target.value);
          }}
          placeholder="Ask AI or search (Ctrl + K)..."
          className="w-full bg-surface-50 border border-surface-border rounded-xl pl-10 pr-16 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-primary transition"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-slate-400">
          <Command className="w-2.5 h-2.5" /> K
        </div>
      </div>

      {/* Right User & Actions */}
      <div className="flex items-center space-x-4">
        {/* Quick CSV Export */}
        <a
          href="http://localhost:4000/api/v1/admin/export/providers.csv"
          download
          className="py-1.5 px-3 rounded-lg bg-surface-50 hover:bg-surface-100 border border-white/5 text-slate-300 text-xs font-semibold transition flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Providers</span>
        </a>

        {/* User Pill */}
        <div className="flex items-center space-x-2 pl-3 border-l border-white/10">
          <div className="w-7 h-7 rounded-lg bg-accent-violet/20 border border-accent-violet/40 text-accent-violet flex items-center justify-center font-bold text-xs">
            {user?.fullName ? user.fullName[0] : "A"}
          </div>
          <div>
            <div className="text-xs font-bold text-white leading-none">{user?.fullName || "Super Admin"}</div>
            <div className="text-[10px] text-accent-cyan font-mono leading-none mt-1">SUPER_ADMIN</div>
          </div>
          <button
            onClick={() => logout()}
            title="Sign out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition ml-2"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

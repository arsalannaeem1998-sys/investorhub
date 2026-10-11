"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldCheck,
  MessageSquare,
  FileText,
  Clock,
  Download,
  Settings,
  Sparkles,
  ExternalLink,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Command Center", href: "/admin", icon: LayoutDashboard },
  { label: "Providers Queue", href: "/admin/providers", icon: Building2 },
  { label: "Leads Central", href: "/admin/leads", icon: Users },
  { label: "Review Moderation", href: "/admin/reviews", icon: MessageSquare },
  { label: "Market Insights CMS", href: "/admin/content", icon: FileText },
  { label: "Compliance Audit Log", href: "/admin/audit-log", icon: Clock },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 glass-panel bg-[#050A1A] border-r border-surface-border flex flex-col justify-between p-4 shrink-0 h-screen sticky top-0">
      <div>
        {/* Brand header */}
        <Link href="/" className="flex items-center space-x-2.5 px-2 py-3 mb-6 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-violet to-primary flex items-center justify-center shadow-ai-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white">
              INVESTOR<span className="text-accent-cyan">HUB</span>
            </div>
            <div className="text-[9px] font-mono tracking-widest text-accent-violet">SUPER CRM</div>
          </div>
        </Link>

        {/* Section title */}
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
          Platform Workspace
        </div>

        {/* Nav Items */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-accent-violet text-white shadow-ai-glow"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Switcher */}
      <div className="pt-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/5 transition"
        >
          <span>Open Marketplace</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
        <div className="p-3 bg-surface-50 rounded-xl border border-white/5 text-[10px] text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-verified shrink-0" />
          <span>AFSL Audit Guard Active</span>
        </div>
      </div>
    </aside>
  );
}

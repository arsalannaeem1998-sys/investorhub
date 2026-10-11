"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/auth-context";
import {
  Sparkles,
  ShieldCheck,
  Search,
  User,
  LogOut,
  LayoutDashboard,
  Settings,
  Menu,
  X,
  Scale,
} from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Trust Banner */}
      <div className="bg-[#050914] border-b border-white/5 py-1.5 px-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-verified" />
        <span>Investor confidence starts with verification. Explore trusted Australian providers.</span>
        <span className="hidden md:inline text-slate-600">|</span>
        <span className="hidden md:inline text-slate-400">Strict ASIC Regulatory Guide 234 Compliance</span>
      </div>

      {/* Main Glass Navigation Bar */}
      <div className="glass-panel border-b border-surface-border backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent-cyan flex items-center justify-center shadow-ai-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white leading-none">
                INVESTOR<span className="text-accent-cyan">HUB</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-widest font-mono">AUSTRALIA</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-slate-300">
            <Link href="/providers" className="hover:text-accent-cyan transition">
              Providers
            </Link>
            <Link href="/categories" className="hover:text-accent-cyan transition">
              Categories
            </Link>
            <Link href="/match" className="flex items-center gap-1.5 text-accent-cyan hover:text-white transition">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Matcher</span>
            </Link>
            <Link href="/compare" className="flex items-center gap-1.5 hover:text-accent-cyan transition">
              <Scale className="w-3.5 h-3.5 text-slate-400" />
              <span>Compare</span>
            </Link>
            <Link href="/insights" className="hover:text-accent-cyan transition">
              Insights
            </Link>
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {user.role === "SUPER_ADMIN" || user.role === "ADMIN" ? (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-accent-violet/20 border border-accent-violet/40 text-accent-violet hover:bg-accent-violet/30 transition"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Admin CRM</span>
                  </Link>
                ) : user.role === "PROVIDER" ? (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-verified/20 border border-verified/40 text-verified hover:bg-verified/30 transition"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Provider CRM</span>
                  </Link>
                ) : (
                  <Link
                    href="/account"
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/20 border border-primary/40 text-primary-light hover:bg-primary/30 transition"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Account</span>
                  </Link>
                )}

                <div className="flex items-center space-x-2 pl-2 border-l border-white/10">
                  <span className="text-xs text-slate-300 font-medium">{user.fullName}</span>
                  <button
                    onClick={() => logout()}
                    title="Sign Out"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 transition"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 transition"
                >
                  Join Free
                </Link>
                <Link
                  href="/become-a-provider"
                  className="text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-verified to-emerald-600 hover:brightness-110 text-white shadow-verified-glow transition flex items-center gap-1.5"
                >
                  <span>List Your Practice</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-surface-border px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/providers"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-300 hover:text-white py-1"
          >
            Providers
          </Link>
          <Link
            href="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-300 hover:text-white py-1"
          >
            Categories
          </Link>
          <Link
            href="/match"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-accent-cyan py-1"
          >
            AI Matcher
          </Link>
          <Link
            href="/compare"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-300 hover:text-white py-1"
          >
            Compare
          </Link>
          <Link
            href="/insights"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-300 hover:text-white py-1"
          >
            Insights
          </Link>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {user ? (
              <>
                <div className="text-xs text-slate-400">Signed in as {user.fullName}</div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-left text-xs text-rose-400 py-1"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs rounded-lg bg-white/10 text-white"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs rounded-lg bg-primary text-white"
                >
                  Join Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

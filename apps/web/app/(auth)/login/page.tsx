"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/auth-context";
import { ShieldCheck, Sparkles, ArrowRight, Lock, Mail, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, switchUserQuick } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") {
        router.push("/admin");
      } else if (user.role === "PROVIDER") {
        router.push("/dashboard");
      } else {
        router.push("/account");
      }
    } catch (err: any) {
      setError(err?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070D1F] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient AI glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-primary/20 via-accent-violet/20 to-accent-cyan/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link href="/" className="inline-flex items-center space-x-2 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent-cyan flex items-center justify-center shadow-ai-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            INVESTOR<span className="text-accent-cyan">HUB</span>
            <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-medium">AUSTRALIA</span>
          </span>
        </Link>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          Access Your Portal
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Sign in to your Investor, Provider, or Admin CRM account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Instant Demo Role Switcher Card */}
        <div className="glass-panel rounded-2xl p-4 mb-5 border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent-cyan flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 1-Click Demo Login
            </span>
            <span className="text-[11px] text-slate-400">Pre-seeded accounts</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => switchUserQuick("SUPER_ADMIN")}
              type="button"
              className="text-left p-2 rounded-lg bg-surface-100 hover:bg-surface-200 border border-white/5 hover:border-accent-violet/40 transition text-xs"
            >
              <div className="font-semibold text-white flex items-center gap-1">
                ⚡ Super Admin
              </div>
              <div className="text-[10px] text-slate-400">Full CRM Command</div>
            </button>
            <button
              onClick={() => switchUserQuick("ADMIN")}
              type="button"
              className="text-left p-2 rounded-lg bg-surface-100 hover:bg-surface-200 border border-white/5 hover:border-accent-cyan/40 transition text-xs"
            >
              <div className="font-semibold text-white flex items-center gap-1">
                🛡️ Compliance Officer
              </div>
              <div className="text-[10px] text-slate-400">Verification & Audit</div>
            </button>
            <button
              onClick={() => switchUserQuick("PROVIDER")}
              type="button"
              className="text-left p-2 rounded-lg bg-surface-100 hover:bg-surface-200 border border-white/5 hover:border-verified/40 transition text-xs"
            >
              <div className="font-semibold text-white flex items-center gap-1">
                💼 Verified Provider
              </div>
              <div className="text-[10px] text-slate-400">Leads CRM Pipeline</div>
            </button>
            <button
              onClick={() => switchUserQuick("INVESTOR")}
              type="button"
              className="text-left p-2 rounded-lg bg-surface-100 hover:bg-surface-200 border border-white/5 hover:border-primary/40 transition text-xs"
            >
              <div className="font-semibold text-white flex items-center gap-1">
                🔍 Retail Investor
              </div>
              <div className="text-[10px] text-slate-400">Shortlists & Inquiries</div>
            </button>
          </div>
        </div>

        {/* Regular Login Form */}
        <div className="glass-panel py-8 px-6 shadow-ai-card rounded-2xl border border-surface-border">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com.au"
                  className="w-full bg-surface-50 border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-xs text-primary-light hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-surface-50 border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-accent-violet hover:from-primary-hover hover:to-primary text-white font-medium text-sm shadow-ai-glow transition flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? (
                "Authenticating..."
              ) : (
                <>
                  Sign In to Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account yet?{" "}
            <Link href="/register" className="text-accent-cyan font-medium hover:underline">
              Register now
            </Link>
          </div>
        </div>

        {/* Security / Compliance note */}
        <div className="mt-6 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-verified" />
          <span>ASIC & Australian Privacy Principles Compliant Infrastructure</span>
        </div>
      </div>
    </div>
  );
}

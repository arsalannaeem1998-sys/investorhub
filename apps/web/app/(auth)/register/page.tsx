"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/auth-context";
import { Sparkles, ArrowRight, User, Building2, Mail, Lock, Phone } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [role, setRole] = useState<"INVESTOR" | "PROVIDER">("INVESTOR");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await register({
        fullName,
        email,
        phone,
        password,
        role,
      });

      if (user.role === "PROVIDER") {
        router.push("/dashboard");
      } else {
        router.push("/account");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to create account");
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
          Create an Account
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Join Australia's verified investment ecosystem
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        <div className="glass-panel py-8 px-6 shadow-ai-card rounded-2xl border border-surface-border">
          {/* Role selector tab */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-1.5 bg-surface-50 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setRole("INVESTOR")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition ${
                role === "INVESTOR"
                  ? "bg-gradient-to-r from-primary to-accent-violet text-white shadow-ai-glow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Individual Investor</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("PROVIDER")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition ${
                role === "PROVIDER"
                  ? "bg-gradient-to-r from-primary to-accent-violet text-white shadow-ai-glow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Investment Provider</span>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                {role === "PROVIDER" ? "Company / Firm Name" : "Full Name"}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={role === "PROVIDER" ? "Sydney Alpha Capital Pty Ltd" : "Lachlan Evans"}
                  className="w-full bg-surface-50 border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                />
              </div>
            </div>

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
                  placeholder="contact@example.com.au"
                  className="w-full bg-surface-50 border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                Contact Phone (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+61 400 000 000"
                  className="w-full bg-surface-50 border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                Create Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-surface-50 border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-400 pt-2">
              By creating an account, you agree to our Terms of Service, Privacy Policy, and understand InvestorHub does not offer direct financial advice.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-accent-violet hover:from-primary-hover hover:to-primary text-white font-medium text-sm shadow-ai-glow transition flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? (
                "Creating Account..."
              ) : (
                <>
                  Register as {role === "PROVIDER" ? "Provider" : "Investor"}{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already registered?{" "}
            <Link href="/login" className="text-accent-cyan font-medium hover:underline">
              Log in to your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

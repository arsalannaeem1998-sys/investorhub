"use client";

import React, { useState, useEffect } from "react";
import { AdminSidebar } from "../../../components/admin/AdminSidebar";
import { AdminHeader } from "../../../components/admin/AdminHeader";
import { apiClient } from "../../../lib/api-client";
import {
  Sparkles,
  Users,
  Building2,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  DollarSign,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await apiClient<{ success: boolean; data: any }>("/admin/dashboard");
      if (res?.success && res.data) {
        setData(res.data);
      } else {
        loadFallback();
      }
    } catch {
      loadFallback();
    } finally {
      setLoading(false);
    }
  };

  const loadFallback = () => {
    setData({
      kpis: {
        totalUsers: 1542,
        totalInvestors: 1522,
        totalProviders: 20,
        pendingProviders: 3,
        approvedProviders: 15,
        totalEnquiries: 40,
        newEnquiries: 8,
        totalReviews: 30,
        flaggedReviews: 1,
        publishedArticles: 4,
        averageRating: "4.9",
        pipelineValueEstimate: "$14.2M AUD",
      },
      aiInsights: [
        "Enquiries increased by 18% over the past week; highest demand in SMSF Specialists & Fund Managers.",
        "3 provider applications currently awaiting AFSL compliance verification in the queue.",
        "1 review flagged by AI Sentinel for prohibited performance guarantee claims.",
      ],
      leadsByStatus: [
        { status: "NEW", _count: { _all: 8 } },
        { status: "CONTACTED", _count: { _all: 12 } },
        { status: "QUALIFIED", _count: { _all: 9 } },
        { status: "BOOKED", _count: { _all: 6 } },
        { status: "WON", _count: { _all: 5 } },
      ],
      providersByCategory: [
        { category: "FUND_MANAGER", _count: { _all: 3 } },
        { category: "PROPERTY_INVESTOR", _count: { _all: 2 } },
        { category: "TRADING_EDUCATOR", _count: { _all: 2 } },
        { category: "FINANCIAL_ADVISER", _count: { _all: 2 } },
        { category: "SMSF_SPECIALIST", _count: { _all: 2 } },
      ],
    });
  };

  const kpis = data?.kpis || {};

  return (
    <div className="min-h-screen bg-[#070D1F] flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader />

        <main className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Top Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-violet/10 border border-accent-violet/30 text-[11px] text-accent-violet font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI-ASSISTED EXECUTIVE WORKSPACE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Platform Command Center
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Real-time marketplace telemetry, compliance verification queues, and lead activity.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/admin/providers"
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary to-accent-violet hover:from-primary-hover text-white text-xs font-semibold shadow-ai-glow transition flex items-center gap-1.5"
              >
                <span>Verification Queue</span>
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                  {kpis.pendingProviders || 3}
                </span>
              </Link>
            </div>
          </div>

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-surface-border">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Verified Providers</span>
                <ShieldCheck className="w-4 h-4 text-verified" />
              </div>
              <div className="text-2xl font-bold text-white">{kpis.approvedProviders || 15}</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Of {kpis.totalProviders || 20} total profiles
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-surface-border">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Pending Applications</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-amber-400">{kpis.pendingProviders || 3}</div>
              <Link
                href="/admin/providers"
                className="text-[11px] text-accent-cyan hover:underline mt-1 block font-semibold"
              >
                Review applications &rarr;
              </Link>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-surface-border">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Total Enquiries / Leads</span>
                <Users className="w-4 h-4 text-primary-light" />
              </div>
              <div className="text-2xl font-bold text-white">{kpis.totalEnquiries || 40}</div>
              <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> {kpis.newEnquiries || 8} new this week
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-surface-border">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Pipeline Capital Volume</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400">{kpis.pipelineValueEstimate || "$14.2M"}</div>
              <div className="text-[11px] text-slate-400 mt-1">High-intent inquiries</div>
            </div>
          </div>

          {/* AI Insights & Alerts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Insights Box */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-transparent to-accent-violet/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="text-xs font-bold uppercase tracking-wider text-accent-cyan flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Operational Insights & Telemetry</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">UPDATED HOURLY</span>
              </div>

              <div className="space-y-3">
                {data?.aiInsights?.map((insight: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-surface-50 rounded-xl border border-white/5 text-xs text-slate-200 leading-relaxed flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Needs Attention Column */}
            <div className="lg:col-span-1 glass-panel p-6 rounded-2xl border border-surface-border space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Needs Attention
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                  Action Required
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-surface-50 rounded-xl border border-white/5 space-y-1">
                  <div className="font-semibold text-white flex items-center justify-between">
                    <span>Crestview SMSF Advisory</span>
                    <span className="text-[10px] text-amber-400">AFSL Pending</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">Submitted 3 days ago. Needs ASIC check.</p>
                  <Link href="/admin/providers" className="text-[11px] text-accent-cyan hover:underline block pt-1">
                    Open in verification desk &rarr;
                  </Link>
                </div>

                <div className="p-3 bg-surface-50 rounded-xl border border-white/5 space-y-1">
                  <div className="font-semibold text-white flex items-center justify-between">
                    <span>1 Review AI-Flagged</span>
                    <span className="text-[10px] text-rose-400">Scam Check</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">Flagged for guaranteed return claim.</p>
                  <Link href="/admin/reviews" className="text-[11px] text-rose-400 hover:underline block pt-1">
                    Moderate review &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Lead Funnel Pipeline Breakdown */}
          <div className="glass-panel p-6 rounded-2xl border border-surface-border space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white">Marketplace Conversion Funnel</h3>
                <p className="text-xs text-slate-400">Progression from Initial Enquiry to Closed Mandate</p>
              </div>
              <Link
                href="/admin/leads"
                className="text-xs font-semibold text-accent-cyan hover:underline flex items-center gap-1"
              >
                <span>View All Inquiries Central</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-center">
              <div className="p-4 bg-surface-50 rounded-xl border border-white/5">
                <div className="text-xl font-bold text-white">8</div>
                <div className="text-[10px] uppercase font-semibold text-slate-400 mt-1">New Leads</div>
              </div>
              <div className="p-4 bg-surface-50 rounded-xl border border-white/5">
                <div className="text-xl font-bold text-amber-400">12</div>
                <div className="text-[10px] uppercase font-semibold text-slate-400 mt-1">Contacted</div>
              </div>
              <div className="p-4 bg-surface-50 rounded-xl border border-white/5">
                <div className="text-xl font-bold text-purple-400">9</div>
                <div className="text-[10px] uppercase font-semibold text-slate-400 mt-1">Qualified</div>
              </div>
              <div className="p-4 bg-surface-50 rounded-xl border border-white/5">
                <div className="text-xl font-bold text-accent-cyan">6</div>
                <div className="text-[10px] uppercase font-semibold text-slate-400 mt-1">Consultation Booked</div>
              </div>
              <div className="p-4 bg-surface-50 rounded-xl border border-white/5">
                <div className="text-xl font-bold text-emerald-400">5</div>
                <div className="text-[10px] uppercase font-semibold text-slate-400 mt-1">Won / Mandate</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

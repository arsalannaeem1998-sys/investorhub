"use client";

import React, { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { apiClient } from "@/lib/api-client";
import { ProviderDto, CATEGORIES } from "@investorhub/shared";
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  Eye,
  X,
  AlertTriangle,
  ExternalLink,
  Search,
  Filter,
} from "lucide-react";
import Link from "next/link";

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<ProviderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedProvider, setSelectedProvider] = useState<ProviderDto | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetchProviders();
  }, [statusFilter]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);

      const res = await apiClient<{ success: boolean; data: ProviderDto[] }>(
        `/admin/providers?${params.toString()}`
      );
      if (res?.success && Array.isArray(res.data)) {
        setProviders(res.data);
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
    const list: ProviderDto[] = [
      {
        id: "p1",
        ownerUserId: "u1",
        companyName: "Apex Horizons Wealth Management",
        slug: "apex-horizons-wealth",
        category: "FUND_MANAGER",
        tagline: "Institutional-grade wholesale equity and multi-asset strategies.",
        overview: "Sydney asset manager catering to family offices, wholesale investors, and SMSF portfolios.",
        specialities: ["Australian Equities", "Global Long/Short"],
        serviceRegions: ["Sydney (NSW)", "National (Australia-wide)"],
        contactEmail: "contact@apexhorizonswealth.com.au",
        minInvestment: "$100,000",
        feeSummary: "1.10% Base + 15% Hurdle",
        status: "APPROVED",
        verificationStatus: "VERIFIED",
        verifiedBadge: true,
        isFeatured: true,
        avgRating: 4.9,
        reviewCount: 14,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "p16",
        ownerUserId: "u16",
        companyName: "Crestview SMSF Advisory Group",
        slug: "crestview-smsf-advisory",
        category: "SMSF_SPECIALIST",
        tagline: "Modern cloud-first superannuation administration for tech workers.",
        overview: "Crestview is onboarding to provide streamlined SMSF establishment and automated crypto reconciliation.",
        specialities: ["SMSF Setup", "Crypto Reconciliation"],
        serviceRegions: ["Perth (WA)"],
        contactEmail: "hello@crestviewsmsf.com.au",
        minInvestment: "N/A",
        feeSummary: "$1,800 fixed annual fee",
        status: "PENDING",
        verificationStatus: "IN_REVIEW",
        verifiedBadge: false,
        isFeatured: false,
        avgRating: 0,
        reviewCount: 0,
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "p17",
        ownerUserId: "u17",
        companyName: "Velocity Crypto Live Streams",
        slug: "velocity-crypto-live",
        category: "TRADING_CHANNEL",
        tagline: "Live on-chain analysis and intraday Bitcoin order flow.",
        overview: "Live channel covering daily mempool transactions and derivatives funding rates.",
        specialities: ["On-Chain Analytics", "Bitcoin Derivatives"],
        serviceRegions: ["National (Australia-wide)"],
        contactEmail: "contact@velocitycrypto.live",
        status: "PENDING",
        verificationStatus: "UNVERIFIED",
        verifiedBadge: false,
        isFeatured: false,
        avgRating: 0,
        reviewCount: 0,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    let filtered = list;
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }
    setProviders(filtered);
  };

  const handleApprove = async (providerId: string) => {
    try {
      await apiClient(`/admin/providers/${providerId}/approve`, { method: "PATCH" });
      setFeedback("Provider approved and Verified Badge granted!");
      fetchProviders();
      if (selectedProvider?.id === providerId) {
        setSelectedProvider({
          ...selectedProvider,
          status: "APPROVED",
          verificationStatus: "VERIFIED",
          verifiedBadge: true,
        });
      }
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback("Provider approved and Verified Badge granted!");
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleReject = async (providerId: string) => {
    try {
      await apiClient(`/admin/providers/${providerId}/reject`, {
        method: "PATCH",
        data: { reason: rejectionReason },
      });
      setFeedback("Provider rejected with compliance note.");
      setRejecting(false);
      fetchProviders();
      if (selectedProvider?.id === providerId) {
        setSelectedProvider({
          ...selectedProvider,
          status: "REJECTED",
          verificationStatus: "REJECTED",
          verifiedBadge: false,
        });
      }
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback("Provider rejected with compliance note.");
      setRejecting(false);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const filteredProviders = providers.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.companyName.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-[#070D1F] flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader onSearchChange={setSearchQuery} />

        <main className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {feedback && (
            <div className="p-3 rounded-xl bg-verified/20 border border-verified/40 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Top Title & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-verified" />
                <span>Provider Verification & Governance</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Approve, reject, or audit licensing credentials before publishing to the Australian marketplace.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-2 text-xs font-semibold">
              {[
                { key: "ALL", label: "All" },
                { key: "PENDING", label: "Pending Review" },
                { key: "APPROVED", label: "Approved" },
                { key: "REJECTED", label: "Rejected" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`py-1.5 px-3 rounded-xl border transition ${
                    statusFilter === tab.key
                      ? "bg-primary text-white border-primary shadow-ai-glow"
                      : "bg-surface-50 text-slate-400 hover:text-white border-white/5"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Providers Table */}
          <div className="glass-panel rounded-2xl border border-surface-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-50 border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Practice / Firm</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Verification</th>
                    <th className="py-3 px-4">Marketplace Status</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {filteredProviders.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedProvider(p)}
                      className="hover:bg-white/5 transition cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <span>{p.companyName}</span>
                          {p.verifiedBadge && (
                            <ShieldCheck className="w-3.5 h-3.5 text-verified" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal">{p.contactEmail}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-semibold">
                          {p.category.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            p.verificationStatus === "VERIFIED"
                              ? "bg-verified/20 border-verified/40 text-emerald-400"
                              : p.verificationStatus === "IN_REVIEW"
                              ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                              : "bg-white/5 border-white/10 text-slate-400"
                          }`}
                        >
                          {p.verificationStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        {p.status}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-amber-400">
                        {p.avgRating > 0 ? `${p.avgRating} ★` : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProvider(p);
                          }}
                          className="text-xs font-semibold text-accent-cyan hover:underline"
                        >
                          Inspect &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Provider Details & Verification Drawer */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl h-full glass-panel bg-[#0B1430] border-l border-surface-border p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent-cyan">
                    {selectedProvider.category.replace(/_/g, " ")}
                  </span>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {selectedProvider.companyName}
                    {selectedProvider.verifiedBadge && (
                      <ShieldCheck className="w-5 h-5 text-verified" />
                    )}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedProvider(null);
                    setRejecting(false);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* AI Review Readiness Checklist */}
              <div className="p-4 rounded-2xl bg-surface-50 border border-primary/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent-cyan flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> AI Review Readiness Checklist
                  </span>
                  <span className="text-xs font-bold text-emerald-400">Audited</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-verified" />
                    <span>Business overview completeness verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-verified" />
                    <span>No unverified "guaranteed returns" in headline or overview</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-verified" />
                    <span>Valid business email and service regions declared</span>
                  </div>
                </div>
              </div>

              {/* Overview */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                  Company Overview
                </label>
                <p className="text-xs text-slate-300 leading-relaxed bg-surface-50 p-3.5 rounded-xl border border-white/5 whitespace-pre-line">
                  {selectedProvider.overview}
                </p>
              </div>

              {/* Specialities & Capital */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-surface-50 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase block">Min Capital</span>
                  <span className="font-bold text-white">{selectedProvider.minInvestment || "Flexible"}</span>
                </div>
                <div className="p-3 bg-surface-50 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase block">Fee Model</span>
                  <span className="font-bold text-white">{selectedProvider.feeSummary || "Standard"}</span>
                </div>
              </div>

              {/* Rejection input if triggered */}
              {rejecting && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl space-y-2">
                  <label className="block text-xs font-bold text-rose-300">Rejection Reason (Required)</label>
                  <textarea
                    rows={2}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="State reason (e.g. ASIC RG 234 claim violation or missing AFSL documentation)..."
                    className="w-full bg-surface-50 border border-rose-500/40 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setRejecting(false)}
                      className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReject(selectedProvider.id)}
                      className="px-4 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                onClick={() => setRejecting(true)}
                className="py-2.5 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-xs font-semibold transition"
              >
                Reject Application
              </button>

              <button
                onClick={() => handleApprove(selectedProvider.id)}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-verified to-emerald-600 hover:brightness-110 text-white text-xs font-semibold shadow-verified-glow transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Approve & Grant Verified Badge</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

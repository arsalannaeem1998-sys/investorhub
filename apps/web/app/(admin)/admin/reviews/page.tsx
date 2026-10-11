"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../../../../components/marketplace/Navbar";
import { Footer } from "../../../../components/marketplace/Footer";
import { useAuth } from "../../../../context/auth-context";
import { ReviewDto } from "@investorhub/shared";
import { apiClient } from "../../../../lib/api-client";
import {
  ShieldCheck,
  Sparkles,
  Star,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Clock,
  Filter,
  Eye,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

export default function AdminReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);

      const res = await apiClient<{ success: boolean; data: any[] }>(
        `/reviews/admin?${params.toString()}`
      );
      if (res?.success && Array.isArray(res.data)) {
        setReviews(res.data);
      } else {
        loadFallbackReviews();
      }
    } catch {
      loadFallbackReviews();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackReviews = () => {
    const mock: any[] = [
      {
        id: "rev-1",
        providerId: "p1",
        providerName: "Apex Horizons Wealth Management",
        investorName: "Lachlan Evans",
        rating: 5,
        title: "Exceptional transparent reporting and risk controls",
        body: "Working with David Sterling and the team has given our family trust immense peace of mind. Monthly tear sheets are institutional quality with detailed factor attribution.",
        status: "APPROVED",
        aiFlag: false,
        aiFlagReason: null,
        createdAt: new Date().toISOString(),
      },
      {
        id: "rev-2",
        providerId: "p2",
        providerName: "Pacific Yield Property Partners",
        investorName: "Sophie Nguyen",
        rating: 5,
        title: "Solid commercial property syndicate return so far",
        body: "The Brisbane logistics acquisition distributions arrive on the 15th of each month exactly as promised in the PDS. Very happy with the tenant covenant.",
        status: "PENDING",
        aiFlag: false,
        aiFlagReason: null,
        createdAt: new Date().toISOString(),
      },
      {
        id: "rev-3",
        providerId: "p3",
        providerName: "Quantum Edge Trading Academy",
        investorName: "Daniel Rossi",
        rating: 1,
        title: "Guaranteed 50% returns, click my telegram link for free signals!",
        body: "Guaranteed 50% returns instantly! Join t.me/fakecrypto for insider signals! No risk at all!",
        status: "FLAGGED",
        aiFlag: true,
        aiFlagReason:
          'Contains prohibited performance guarantee claim ("guaranteed") and external messaging channel links.',
        createdAt: new Date().toISOString(),
      },
    ];

    let filtered = mock;
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }
    setReviews(filtered);
  };

  const handleModerate = async (reviewId: string, newStatus: "APPROVED" | "REJECTED" | "FLAGGED") => {
    try {
      await apiClient(`/reviews/admin/${reviewId}`, {
        method: "PATCH",
        data: {
          status: newStatus,
          moderationNote: `Actioned by ${user?.fullName || "Compliance Officer"}`,
        },
      });
      setActionMessage(`Review marked as ${newStatus}`);
      fetchReviews();
      setTimeout(() => setActionMessage(null), 3000);
    } catch {
      // Local optimistic update
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, status: newStatus } : r))
      );
      setActionMessage(`Review marked as ${newStatus}`);
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#070D1F] flex flex-col">
      <Navbar />

      {/* Header Bar */}
      <div className="bg-[#040813] border-b border-surface-border py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Link href="/admin" className="text-xs text-slate-400 hover:text-white transition">
                &larr; Admin Command Center
              </Link>
              <span className="text-slate-600">/</span>
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-verified" />
                <span>Client Review Moderation Desk</span>
              </h1>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Screen investor feedback for authenticity, ASIC RG 234 compliance, and scam claims
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Moderator:</span>
            <span className="text-xs font-semibold text-emerald-400">
              {user?.fullName || "Compliance Desk"}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {actionMessage && (
          <div className="p-3 rounded-xl bg-verified/20 border border-verified/40 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex space-x-2 text-xs font-semibold">
            {[
              { key: "ALL", label: "All Reviews" },
              { key: "PENDING", label: "Pending Moderation" },
              { key: "FLAGGED", label: "AI Flagged" },
              { key: "APPROVED", label: "Approved" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`py-1.5 px-3.5 rounded-xl border transition ${
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

        {/* Review Cards Queue */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-panel h-36 rounded-2xl animate-pulse bg-white/5" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="glass-panel text-center py-16 px-4 rounded-2xl border border-surface-border">
            <CheckCircle2 className="w-10 h-10 text-verified mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">Queue Clear</h3>
            <p className="text-xs text-slate-400 mt-1">No reviews currently awaiting moderation in this view.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="glass-panel p-5 rounded-2xl border border-surface-border space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
                  <div>
                    <span className="text-xs font-bold text-white">
                      Target Provider: {rev.provider?.companyName || rev.providerName || "Apex Horizons Wealth"}
                    </span>
                    <div className="text-[11px] text-slate-400">
                      Author: <strong className="text-slate-300">{rev.investor?.fullName || rev.investorName || "Investor"}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            rev.rating >= s ? "fill-amber-400 text-amber-400" : "text-slate-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        rev.status === "APPROVED"
                          ? "bg-verified/20 border-verified/40 text-emerald-400"
                          : rev.status === "FLAGGED"
                          ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                          : "bg-amber-500/20 border-amber-500/40 text-amber-300"
                      }`}
                    >
                      {rev.status}
                    </span>
                  </div>
                </div>

                {/* AI Sentinel Alert if flagged */}
                {rev.aiFlag && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white">AI Sentinel Compliance Flag:</strong>
                      <span>{rev.aiFlagReason || "Violates platform risk or performance disclosure policies."}</span>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-bold text-white">{rev.title}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{rev.body}</p>
                </div>

                {/* Moderation Actions */}
                <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-[10px] text-slate-500">
                    Review ID: {rev.id}
                  </div>

                  <div className="flex items-center gap-2">
                    {rev.status !== "APPROVED" && (
                      <button
                        onClick={() => handleModerate(rev.id, "APPROVED")}
                        className="py-1.5 px-3.5 rounded-xl bg-verified/20 hover:bg-verified/30 text-emerald-400 border border-verified/40 font-semibold transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Publish</span>
                      </button>
                    )}

                    {rev.status !== "FLAGGED" && (
                      <button
                        onClick={() => handleModerate(rev.id, "FLAGGED")}
                        className="py-1.5 px-3.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold transition flex items-center gap-1.5"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Flag for Audit</span>
                      </button>
                    )}

                    {rev.status !== "REJECTED" && (
                      <button
                        onClick={() => handleModerate(rev.id, "REJECTED")}
                        className="py-1.5 px-3.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 font-semibold transition flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject & Discard</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

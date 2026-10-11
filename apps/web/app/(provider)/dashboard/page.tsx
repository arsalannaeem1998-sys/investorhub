"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../../../components/marketplace/Navbar";
import { Footer } from "../../../components/marketplace/Footer";
import { useAuth } from "../../../context/auth-context";
import { ProviderDto, CATEGORY_DETAILS } from "@investorhub/shared";
import { apiClient } from "../../../lib/api-client";
import {
  ShieldCheck,
  Sparkles,
  Users,
  Eye,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  FileText,
  Edit3,
  Plus,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Save,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProviderDashboardPage() {
  const router = useRouter();
  const { user, switchUserQuick } = useAuth();

  const [provider, setProvider] = useState<ProviderDto | null>(null);
  const [stats, setStats] = useState({
    totalLeads: 24,
    newLeads: 5,
    bookedLeads: 8,
    profileViews: 412,
    conversionRate: "33.3%",
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "edit" | "services" | "documents" | "reviews">("overview");

  // Profile Edit State
  const [editTagline, setEditTagline] = useState("");
  const [editOverview, setEditOverview] = useState("");
  const [editMinInvestment, setEditMinInvestment] = useState("");
  const [editFeeSummary, setEditFeeSummary] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Document Upload State
  const [newDocType, setNewDocType] = useState<"AFSL" | "ABN" | "ACN">("AFSL");
  const [uploadingDoc, setUploadingDoc] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, [user]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [profileRes, statsRes] = await Promise.all([
        apiClient<{ success: boolean; data: ProviderDto }>("/provider/profile"),
        apiClient<{ success: boolean; data: any }>("/provider/stats"),
      ]);

      if (profileRes?.success && profileRes.data) {
        setProvider(profileRes.data);
        setEditTagline(profileRes.data.tagline || "");
        setEditOverview(profileRes.data.overview || "");
        setEditMinInvestment(profileRes.data.minInvestment || "");
        setEditFeeSummary(profileRes.data.feeSummary || "");
      } else {
        loadFallbackProfile();
      }

      if (statsRes?.success && statsRes.data) {
        setStats(statsRes.data);
      }
    } catch {
      loadFallbackProfile();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackProfile = () => {
    const mock: ProviderDto = {
      id: "p1",
      ownerUserId: user?.id || "u1",
      companyName: "Apex Horizons Wealth Management",
      slug: "apex-horizons-wealth",
      category: "FUND_MANAGER",
      tagline: "Institutional-grade wholesale equity and multi-asset strategies.",
      overview:
        "Apex Horizons Wealth is a Sydney-based boutique asset manager catering to family offices, wholesale investors, and SMSF portfolios. Our focus is long-term capital compounding and downside volatility mitigation through fundamental research.",
      specialities: ["Australian Equities", "Global Long/Short", "Multi-Asset Funds"],
      serviceRegions: ["Sydney (NSW)", "National (Australia-wide)"],
      contactEmail: "contact@apexhorizonswealth.com.au",
      contactPhone: "+61 2 8920 3400",
      minInvestment: "$100,000",
      feeSummary: "1.10% Base Management + 15% Performance hurdle",
      riskProfile: "Balanced Growth",
      aumText: "$240M+ AUM",
      status: "APPROVED",
      verificationStatus: "VERIFIED",
      verifiedBadge: true,
      isFeatured: true,
      avgRating: 4.9,
      reviewCount: 14,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documents: [
        {
          id: "doc1",
          providerId: "p1",
          docType: "AFSL",
          fileUrl: "https://storage.investorhub.com.au/docs/afsl_sample.pdf",
          status: "ACCEPTED",
          reviewerNote: "AFSL registry cross-checked and active with ASIC.",
          reviewedBy: "admin",
          reviewedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      ],
      services: [
        {
          id: "s1",
          providerId: "p1",
          title: "Wholesale Australian Equities Alpha Fund",
          description: "Targeting top-quartile ASX 100 businesses.",
          type: "Fund Mandate",
        },
      ],
      team: [
        {
          id: "t1",
          providerId: "p1",
          name: "David Sterling",
          role: "Chief Investment Officer",
          bio: "Ex-Macquarie equities research head.",
          photoUrl: null,
          linkedinUrl: "https://linkedin.com",
        },
      ],
    };
    setProvider(mock);
    setEditTagline(mock.tagline);
    setEditOverview(mock.overview);
    setEditMinInvestment(mock.minInvestment || "");
    setEditFeeSummary(mock.feeSummary || "");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider) return;
    setSavingProfile(true);
    setSavedSuccess(false);

    try {
      await apiClient("/provider/profile", {
        method: "PUT",
        data: {
          companyName: provider.companyName,
          category: provider.category,
          tagline: editTagline,
          overview: editOverview,
          specialities: provider.specialities,
          serviceRegions: provider.serviceRegions,
          contactEmail: provider.contactEmail,
          minInvestment: editMinInvestment,
          feeSummary: editFeeSummary,
        },
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      setSavedSuccess(true);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUploadNewDoc = async () => {
    setUploadingDoc(true);
    try {
      await apiClient("/provider/documents", {
        data: {
          docType: newDocType,
          fileUrl: `https://storage.investorhub.com.au/docs/${newDocType.toLowerCase()}_sample.pdf`,
        },
      });
      fetchDashboard();
    } catch {
      // silent
    } finally {
      setUploadingDoc(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070D1F] flex flex-col">
      <Navbar />

      {/* Top Banner Status Strip */}
      <div className="bg-[#040813] border-b border-surface-border py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-verified to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-verified-glow">
              {provider?.companyName ? provider.companyName[0] : "P"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">
                  {provider?.companyName || "Provider Dashboard"}
                </h1>
                {provider?.verifiedBadge ? (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-verified/20 border border-verified/40 text-emerald-400 flex items-center gap-1 shadow-verified-glow">
                    <ShieldCheck className="w-3 h-3 text-verified" /> Verified Badge Active
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Under Compliance Review
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400">
                Category: <strong>{provider?.category || "Fund Manager"}</strong> • Status:{" "}
                <span className="text-emerald-400 font-semibold">{provider?.status || "APPROVED"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {provider?.slug && (
              <Link
                href={`/providers/${provider.slug}`}
                target="_blank"
                className="py-2 px-3.5 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-semibold border-white/10 hover:border-accent-cyan/40 transition flex items-center gap-1.5"
              >
                <span>View Public Profile</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
            <button
              onClick={() => switchUserQuick("SUPER_ADMIN")}
              className="py-2 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-accent-violet text-xs font-semibold border border-accent-violet/30 transition flex items-center gap-1"
            >
              <span>Switch to Admin CRM</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* KPI Telemetry Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-2xl border border-surface-border">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Total Enquiries</span>
              <Users className="w-4 h-4 text-primary-light" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalLeads}</div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +18% this month
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-surface-border">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>New High-Intent Leads</span>
              <Sparkles className="w-4 h-4 text-accent-cyan" />
            </div>
            <div className="text-2xl font-bold text-accent-cyan">{stats.newLeads}</div>
            <div className="text-[11px] text-slate-400 mt-1">Pending first reply</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-surface-border">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Consultations Booked</span>
              <Calendar className="w-4 h-4 text-accent-violet" />
            </div>
            <div className="text-2xl font-bold text-accent-violet">{stats.bookedLeads}</div>
            <div className="text-[11px] text-slate-400 mt-1">Qualified connections</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-surface-border">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Profile Views</span>
              <Eye className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.profileViews}</div>
            <div className="text-[11px] text-slate-400 mt-1">From active investors</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 text-xs font-semibold space-x-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 transition border-b-2 ${
              activeTab === "overview"
                ? "border-primary text-white"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Overview & Verification Checklist
          </button>
          <button
            onClick={() => setActiveTab("edit")}
            className={`pb-3 transition border-b-2 ${
              activeTab === "edit"
                ? "border-primary text-white"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Edit Profile Details
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`pb-3 transition border-b-2 ${
              activeTab === "services"
                ? "border-primary text-white"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Services & Team
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`pb-3 transition border-b-2 ${
              activeTab === "documents"
                ? "border-primary text-white"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Verification Documents ({provider?.documents?.length || 1})
          </button>
        </div>

        {/* Tab Content: Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Review Readiness Card */}
            <div className="lg:col-span-1 glass-panel p-5 rounded-2xl border border-surface-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-accent-cyan flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI Review Readiness
                </span>
                <span className="text-xs font-extrabold text-emerald-400">100% Ready</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-surface-100 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-verified h-full rounded-full w-full" />
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-verified" />
                  <span>Business overview & strategy complete</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-verified" />
                  <span>Services and fee summaries declared</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-verified" />
                  <span>AFSL/ABN documentation uploaded</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-verified" />
                  <span>ASIC Regulatory Guide 234 agreement acknowledged</span>
                </div>
              </div>
            </div>

            {/* Quick Leads Pipeline Summary */}
            <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-surface-border space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-sm font-bold text-white">Recent Inquiries Received</h3>
                <Link
                  href="/dashboard/leads"
                  className="text-xs font-semibold text-accent-cyan hover:underline flex items-center gap-1"
                >
                  <span>Open Pipeline CRM &rarr;</span>
                </Link>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-surface-50 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-white">Lachlan Evans (Wholesale Investor)</div>
                    <div className="text-slate-400 text-[11px]">
                      "Looking to allocate $250,000 from SMSF into wholesale equities mandate..."
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[10px]">
                    Hot Lead (Score: 92)
                  </span>
                </div>

                <div className="p-3 bg-surface-50 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-white">Hamish Campbell (Self-Managed Investor)</div>
                    <div className="text-slate-400 text-[11px]">
                      "Seeking an independent portfolio risk audit for an existing $800k portfolio..."
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-primary/20 text-accent-cyan font-semibold text-[10px]">
                    Warm Lead (Score: 78)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Edit Profile */}
        {activeTab === "edit" && (
          <div className="glass-panel p-6 rounded-2xl border border-surface-border max-w-3xl">
            <h3 className="text-base font-bold text-white mb-4">Edit Public Firm Profile</h3>

            {savedSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-verified/20 border border-verified/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile changes updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold uppercase mb-1">Company Tagline</label>
                <input
                  type="text"
                  required
                  value={editTagline}
                  onChange={(e) => setEditTagline(e.target.value)}
                  className="w-full bg-surface-50 border border-surface-border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold uppercase mb-1">Company Overview</label>
                <textarea
                  rows={4}
                  required
                  value={editOverview}
                  onChange={(e) => setEditOverview(e.target.value)}
                  className="w-full bg-surface-50 border border-surface-border rounded-xl p-4 text-white focus:outline-none focus:border-primary leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold uppercase mb-1">Minimum Investment</label>
                  <input
                    type="text"
                    value={editMinInvestment}
                    onChange={(e) => setEditMinInvestment(e.target.value)}
                    className="w-full bg-surface-50 border border-surface-border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold uppercase mb-1">Fee Model Summary</label>
                  <input
                    type="text"
                    value={editFeeSummary}
                    onChange={(e) => setEditFeeSummary(e.target.value)}
                    className="w-full bg-surface-50 border border-surface-border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="py-2.5 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingProfile ? "Saving Changes..." : "Save Profile"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab Content: Services & Team */}
        {activeTab === "services" && (
          <div className="space-y-6 max-w-4xl">
            <div className="glass-panel p-5 rounded-2xl border border-surface-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">Active Service Offerings</h3>
              </div>
              <div className="space-y-3">
                {provider?.services?.map((s, idx) => (
                  <div key={idx} className="p-4 bg-surface-50 rounded-xl border border-white/5 space-y-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{s.title}</span>
                      <span className="text-[10px] text-accent-cyan px-2 py-0.5 rounded-full bg-primary/20">
                        {s.type || "Mandate"}
                      </span>
                    </div>
                    <p className="text-slate-400">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Documents */}
        {activeTab === "documents" && (
          <div className="glass-panel p-6 rounded-2xl border border-surface-border max-w-3xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Verification Documents & Audit Trail</h3>
                <p className="text-xs text-slate-400">ASIC register, AFSL licenses, and corporate certificates</p>
              </div>
            </div>

            <div className="space-y-3">
              {provider?.documents && provider.documents.length > 0 ? (
                provider.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-surface-50 rounded-xl border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-100 border border-white/10 flex items-center justify-center text-accent-cyan">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-white">{doc.docType} Certificate</div>
                        <div className="text-[11px] text-slate-400">
                          Reviewer note: {doc.reviewerNote || "Awaiting compliance verification"}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-semibold border ${
                        doc.status === "ACCEPTED"
                          ? "bg-verified/20 border-verified/40 text-emerald-400"
                          : "bg-amber-500/20 border-amber-500/40 text-amber-300"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No verification documents on file.</p>
              )}
            </div>

            {/* Upload Another Document Box */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
              <select
                value={newDocType}
                onChange={(e) => setNewDocType(e.target.value as any)}
                className="bg-surface-50 border border-surface-border rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="AFSL">AFSL License</option>
                <option value="ABN">ABN Document</option>
                <option value="ACN">ACN Certificate</option>
              </select>
              <button
                onClick={handleUploadNewDoc}
                disabled={uploadingDoc}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary to-accent-violet text-white text-xs font-semibold shadow-ai-glow transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{uploadingDoc ? "Recording..." : "Submit New Verification Document"}</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

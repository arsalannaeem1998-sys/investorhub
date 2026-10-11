"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Navbar } from "../../components/marketplace/Navbar";
import { Footer } from "../../components/marketplace/Footer";
import { ProviderDto, CATEGORY_DETAILS } from "@investorhub/shared";
import { apiClient } from "../../lib/api-client";
import { useSearchParams } from "next/navigation";
import {
  Scale,
  Sparkles,
  ShieldCheck,
  Star,
  CheckCircle2,
  X,
  ExternalLink,
  ArrowRight,
  MapPin,
  Coins,
  FileCheck,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

const CATEGORY_IMAGES: Record<string, string> = {
  FUND_MANAGER:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80",
  PROPERTY_INVESTOR:
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=500&q=80",
  TRADING_EDUCATOR:
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=500&q=80",
  TRADING_CHANNEL:
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=500&q=80",
  FINANCIAL_ADVISER:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500&q=80",
  PORTFOLIO_ANALYST:
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=500&q=80",
  TAX_SPECIALIST:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=80",
  MORTGAGE_BROKER:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500&q=80",
  SMSF_SPECIALIST:
    "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=500&q=80",
  INVESTOR_COMMUNITY:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&q=80",
  MARKET_ANALYST:
    "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=500&q=80",
};

function CompareProvidersPageContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids") || "";

  const [providers, setProviders] = useState<ProviderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState<string[] | null>(null);
  const [generatingAi, setGeneratingAi] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, [idsParam]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const res = await apiClient<{ success: boolean; data: ProviderDto[] }>("/providers?limit=4");
      if (res?.success && Array.isArray(res.data)) {
        setProviders(res.data.slice(0, 3));
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
    setProviders([
      {
        id: "p1",
        ownerUserId: "u1",
        companyName: "Apex Horizons Wealth Management",
        slug: "apex-horizons-wealth",
        category: "FUND_MANAGER",
        tagline: "Institutional-grade wholesale equity and multi-asset strategies.",
        overview: "Sydney asset manager catering to family offices, wholesale investors, and SMSF portfolios.",
        specialities: ["Australian Equities", "Global Long/Short", "Multi-Asset Funds"],
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
        id: "p2",
        ownerUserId: "u2",
        companyName: "Pacific Yield Property Partners",
        slug: "pacific-yield-property",
        category: "PROPERTY_INVESTOR",
        tagline: "Commercial logistics and healthcare property syndication across QLD & NSW.",
        overview: "Institutional commercial property syndicates with monthly cash distributions.",
        specialities: ["Industrial Logistics", "Healthcare Centers"],
        serviceRegions: ["Brisbane (QLD)", "Sydney (NSW)"],
        contactEmail: "syndicates@pacificyield.com.au",
        minInvestment: "$50,000",
        feeSummary: "1% Management",
        status: "APPROVED",
        verificationStatus: "VERIFIED",
        verifiedBadge: true,
        isFeatured: true,
        avgRating: 4.8,
        reviewCount: 9,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "p4",
        ownerUserId: "u4",
        companyName: "Beacon Financial & Wealth Advisory",
        slug: "beacon-financial-advisory",
        category: "FINANCIAL_ADVISER",
        tagline: "Independent, fee-for-service financial planning and estate architecture.",
        overview: "Fiduciary, fee-only financial advisory firm helping professionals and business owners.",
        specialities: ["Retirement Planning", "Wealth Transition", "SMSF Structuring"],
        serviceRegions: ["Adelaide (SA)", "Melbourne (VIC)"],
        contactEmail: "advice@beaconwealth.com.au",
        minInvestment: "$250,000 Portfolio",
        feeSummary: "Flat fee from $4,400 p.a.",
        status: "APPROVED",
        verificationStatus: "VERIFIED",
        verifiedBadge: true,
        isFeatured: true,
        avgRating: 5.0,
        reviewCount: 11,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  };

  const handleGenerateSummary = async () => {
    setGeneratingAi(true);
    try {
      const res = await apiClient<{ success: boolean; data: any }>("/ai/compare-summary", {
        data: { providerIds: providers.map((p) => p.id) },
      });
      if (res?.success && res.data?.summaryBullets) {
        setAiSummary(res.data.summaryBullets);
      } else {
        fallbackSummary();
      }
    } catch {
      fallbackSummary();
    } finally {
      setGeneratingAi(false);
    }
  };

  const fallbackSummary = () => {
    setAiSummary([
      "Discipline Diversity: Apex Horizons manages active equity funds, Pacific Yield operates commercial real estate syndicates, while Beacon Financial provides comprehensive fee-for-service financial architecture.",
      "Capital Thresholds: Pacific Yield has the lowest entry hurdle ($50,000) for commercial property, whereas Beacon Financial requires a $250k portfolio minimum.",
      "Licensing: All 3 compared providers hold active, verified Australian Financial Services Licences (AFSL) verified by the InvestorHub compliance team.",
    ]);
  };

  const removeProvider = (id: string) => {
    setProviders(providers.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#070D1F] flex flex-col text-slate-100 selection:bg-primary selection:text-white">
      <Navbar />

      <section className="relative py-14 px-4 sm:px-6 lg:px-8 border-b border-surface-border overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-xs text-accent-cyan font-semibold mb-3 backdrop-blur-md">
              <Scale className="w-4 h-4 text-accent-cyan" />
              <span>OBJECTIVE HEAD-TO-HEAD MATRIX</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Compare Shortlisted <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-accent-cyan via-primary-light to-accent-violet bg-clip-text text-transparent">
                Australian Providers
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
              Side-by-side evaluation of credentials, fee structures, minimum capital thresholds, and client ratings with neutral AI summary insights.
            </p>
          </div>

          <button
            onClick={handleGenerateSummary}
            disabled={generatingAi || providers.length < 2}
            className="py-3 px-6 rounded-xl bg-gradient-to-r from-primary to-accent-violet hover:from-primary-hover text-white text-xs font-bold shadow-ai-glow transition flex items-center gap-2 disabled:opacity-50 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-accent-cyan" />
            <span>{generatingAi ? "Generating Summary..." : "AI Summarise Differences"}</span>
          </button>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-6">
        {/* AI Comparison Summary Card */}
        {aiSummary && (
          <div className="glass-panel p-6 rounded-2xl border border-accent-cyan/30 bg-gradient-to-br from-primary/15 via-transparent to-accent-violet/10 space-y-3 animate-fade-in shadow-glow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-cyan flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> AI Neutral Comparison Insights
              </span>
              <span className="text-[10px] text-slate-400">Strictly neutral profile analysis</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-200 leading-relaxed">
              {aiSummary.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Comparison Matrix Table */}
        {providers.length === 0 ? (
          <div className="glass-panel text-center py-20 px-4 rounded-3xl border border-surface-border">
            <Scale className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white">No Providers Shortlisted</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Select providers from the directory by clicking the compare button to evaluate them side by side.
            </p>
            <Link
              href="/providers"
              className="mt-5 inline-block px-6 py-3 rounded-xl bg-primary text-white text-xs font-semibold shadow-ai-glow"
            >
              Browse Provider Directory
            </Link>
          </div>
        ) : (
          <div className="glass-panel rounded-3xl border border-surface-border overflow-x-auto shadow-2xl">
            <table className="w-full text-left text-xs min-w-[760px]">
              <thead className="bg-[#050914] border-b border-white/10">
                <tr>
                  <th className="py-6 px-6 w-52 text-slate-400 uppercase text-[10px] tracking-wider align-bottom">
                    Comparison Metric
                  </th>
                  {providers.map((p) => {
                    const cover =
                      CATEGORY_IMAGES[p.category] ||
                      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80";

                    return (
                      <th key={p.id} className="py-4 px-6 font-bold text-white text-sm align-top">
                        <div className="space-y-3">
                          {/* Photo banner */}
                          <div className="relative h-24 w-full rounded-2xl overflow-hidden border border-white/10">
                            <img
                              src={cover}
                              alt={p.companyName}
                              className="w-full h-full object-cover opacity-60"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#091129] via-transparent to-transparent" />
                            <button
                              onClick={() => removeProvider(p.id)}
                              className="absolute top-2 right-2 p-1 rounded-lg bg-[#070D1F]/80 text-slate-400 hover:text-rose-400 border border-white/10 transition"
                              title="Remove from comparison"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-accent-cyan block mb-1">
                              {p.category.replace(/_/g, " ")}
                            </span>
                            <div className="font-extrabold text-sm text-white line-clamp-1">
                              {p.companyName}
                            </div>
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="py-4 px-6 font-bold text-slate-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-accent-cyan" />
                    <span>Licensing Status</span>
                  </td>
                  {providers.map((p) => (
                    <td key={p.id} className="py-4 px-6">
                      {p.verifiedBadge ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5" /> Verified ASIC/AFSL
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Standard Listing</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-slate-400 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span>Average Rating</span>
                  </td>
                  {providers.map((p) => (
                    <td key={p.id} className="py-4 px-6 font-bold text-amber-400">
                      ★ {p.avgRating > 0 ? p.avgRating.toFixed(1) : "5.0"}
                      <span className="text-slate-400 font-normal text-xs ml-1">
                        ({p.reviewCount} reviews)
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-slate-400 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-emerald-400" />
                    <span>Min Investment Threshold</span>
                  </td>
                  {providers.map((p) => (
                    <td key={p.id} className="py-4 px-6 font-semibold text-white">
                      {p.minInvestment || "Flexible / Advisory"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-slate-400 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-sky-400" />
                    <span>Fee Framework</span>
                  </td>
                  {providers.map((p) => (
                    <td key={p.id} className="py-4 px-6 text-slate-200">
                      {p.feeSummary || "Disclosed in PDS"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-slate-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent-violet" />
                    <span>Service Jurisdiction</span>
                  </td>
                  {providers.map((p) => (
                    <td key={p.id} className="py-4 px-6 text-slate-300">
                      {p.serviceRegions.join(", ")}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-slate-400 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-accent-cyan" />
                    <span>Core Specialities</span>
                  </td>
                  {providers.map((p) => (
                    <td key={p.id} className="py-4 px-6">
                      <div className="flex flex-wrap gap-1.5">
                        {p.specialities.map((s, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-slate-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-5 px-6 font-bold text-slate-400">Direct Actions</td>
                  {providers.map((p) => (
                    <td key={p.id} className="py-5 px-6">
                      <Link
                        href={`/providers/${p.slug}`}
                        className="py-2 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-ai-glow transition"
                      >
                        <span>View Verified Profile</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function CompareProvidersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
          Loading comparison…
        </div>
      }
    >
      <CompareProvidersPageContent />
    </Suspense>
  );
}

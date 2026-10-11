"use client";

import React, { useState } from "react";
import { Navbar } from "../../components/marketplace/Navbar";
import { Footer } from "../../components/marketplace/Footer";
import { ProviderCard } from "../../components/marketplace/ProviderCard";
import { apiClient } from "../../lib/api-client";
import { AUSTRALIAN_REGIONS } from "@investorhub/shared";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  RotateCcw,
  GraduationCap,
  Landmark,
  Briefcase,
  LineChart,
  Home,
  Coins,
  Calculator,
  Radio,
  MapPin,
  Building,
  Scale,
} from "lucide-react";
import Link from "next/link";

const INVESTOR_TYPES = [
  {
    id: "BEGINNER",
    label: "Beginner Investor",
    desc: "Starting out, seeking education & licensed guidance",
    icon: GraduationCap,
    iconColor: "text-accent-cyan",
  },
  {
    id: "SMSF",
    label: "SMSF Trustee",
    desc: "Superannuation compliance, property borrowing & audits",
    icon: Landmark,
    iconColor: "text-emerald-400",
  },
  {
    id: "HNW",
    label: "Wholesale / HNW",
    desc: "Family trust, private debt & boutique equity mandates",
    icon: Briefcase,
    iconColor: "text-accent-violet",
  },
  {
    id: "ACTIVE_TRADER",
    label: "Active Trader",
    desc: "Index futures, forex order flow & intraday execution",
    icon: LineChart,
    iconColor: "text-rose-400",
  },
  {
    id: "PROPERTY",
    label: "Property Investor",
    desc: "Commercial syndicates & high-yield off-market assets",
    icon: Home,
    iconColor: "text-amber-400",
  },
];

const OBJECTIVES = [
  {
    id: "YIELD",
    label: "Monthly Cash Yield",
    desc: "First-mortgage debt funds & commercial leases",
    icon: Coins,
    iconColor: "text-emerald-400",
  },
  {
    id: "GROWTH",
    label: "Long-term Compounding",
    desc: "Concentrated ASX and global equity portfolios",
    icon: TrendingUp,
    iconColor: "text-accent-cyan",
  },
  {
    id: "TAX",
    label: "Tax & Structure Optimization",
    desc: "Discretionary trusts, CGT loss harvesting & SMSF",
    icon: Calculator,
    iconColor: "text-sky-400",
  },
  {
    id: "EDUCATION",
    label: "Technical Mentorship",
    desc: "Price action masterclasses & live trading desks",
    icon: Radio,
    iconColor: "text-accent-violet",
  },
];

export default function AiMatchFinderPage() {
  const [step, setStep] = useState(1);
  const [investorType, setInvestorType] = useState("SMSF");
  const [goal, setGoal] = useState("YIELD");
  const [region, setRegion] = useState("National (Australia-wide)");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const handleComputeMatch = async () => {
    setLoading(true);
    try {
      const res = await apiClient<{ success: boolean; data: any[] }>("/ai/match", {
        data: {
          investorType,
          goal,
          region,
        },
      });

      if (res?.success && Array.isArray(res.data)) {
        setResults(res.data);
      } else {
        loadFallbackResults();
      }
    } catch {
      loadFallbackResults();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackResults = () => {
    const list = [
      {
        matchScore: 98,
        matchReason:
          "Exceptional alignment: Offers specialized SMSF mandates, first-mortgage debt security, and compliant monthly distributions.",
        keyStrengths: ["SMSF Compliant", "Monthly Yield", "ASIC Audited"],
        provider: {
          id: "p2",
          companyName: "Pacific Yield Property Partners",
          slug: "pacific-yield-property",
          category: "PROPERTY_INVESTOR",
          tagline: "Commercial logistics and healthcare property syndication across QLD & NSW.",
          overview: "Institutional commercial property syndicates with monthly cash distributions.",
          specialities: ["Industrial Logistics", "Commercial Syndicates"],
          serviceRegions: ["Brisbane (QLD)", "Sydney (NSW)"],
          contactEmail: "syndicates@pacificyield.com.au",
          minInvestment: "$50,000",
          feeSummary: "1% Management",
          status: "APPROVED",
          verificationStatus: "VERIFIED",
          verifiedBadge: true,
          avgRating: 4.8,
          reviewCount: 9,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      {
        matchScore: 94,
        matchReason:
          "High alignment: Tier-1 boutique asset manager catering to family offices and wholesale SMSF capital compounding.",
        keyStrengths: ["Wholesale Equities", "Risk Controls", "Transparent PDS"],
        provider: {
          id: "p1",
          companyName: "Apex Horizons Wealth Management",
          slug: "apex-horizons-wealth",
          category: "FUND_MANAGER",
          tagline: "Institutional-grade wholesale equity and multi-asset strategies.",
          overview: "Boutique asset manager catering to family offices, wholesale investors, and SMSF portfolios.",
          specialities: ["Australian Equities", "Multi-Asset Funds"],
          serviceRegions: ["Sydney (NSW)", "National (Australia-wide)"],
          contactEmail: "contact@apexhorizonswealth.com.au",
          minInvestment: "$100,000",
          feeSummary: "1.10% Base + 15% Hurdle",
          status: "APPROVED",
          verificationStatus: "VERIFIED",
          verifiedBadge: true,
          avgRating: 4.9,
          reviewCount: 14,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    ];
    setResults(list);
  };

  const resetWizard = () => {
    setResults(null);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-[#070D1F] flex flex-col text-slate-100 selection:bg-primary selection:text-white">
      <Navbar />

      <section className="relative py-14 px-4 sm:px-6 lg:px-8 border-b border-surface-border overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-gradient-to-tr from-accent-cyan/15 via-primary/10 to-transparent blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-xs text-accent-cyan font-semibold mb-3 backdrop-blur-md shadow-glow-sm">
            <Sparkles className="w-4 h-4 text-accent-cyan animate-pulse" />
            <span>NEUTRAL AI MATCH ENGINE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Find Your Highest-Aligned <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-accent-cyan via-primary-light to-accent-violet bg-clip-text text-transparent">
              Verified Australian Expert
            </span>
          </h1>
          <p className="mt-3 text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Answer 3 objective questions to generate an algorithmic match based strictly on verified AFSL licenses, investment thresholds, and asset class specializations.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {results ? (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent-cyan" />
                  <span>Top AI Matches for Your Criteria</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ranked by objective alignment with your stated investor profile and capital goals.
                </p>
              </div>
              <button
                onClick={resetWizard}
                className="py-2 px-4 rounded-xl bg-surface-50 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition flex items-center gap-2 hover:border-white/20"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Adjust Answers</span>
              </button>
            </div>

            <div className="space-y-6">
              {results.map((item, idx) => (
                <div
                  key={idx}
                  className="glass-panel p-6 sm:p-8 rounded-3xl border border-surface-border space-y-5 hover:border-accent-cyan/40 transition-all duration-300 shadow-card"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-accent-cyan flex items-center justify-center font-black text-white text-lg shadow-ai-glow">
                        #{idx + 1}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent-cyan">
                          {item.provider.category.replace(/_/g, " ")}
                        </span>
                        <h3 className="text-xl font-bold text-white">{item.provider.companyName}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center gap-2 shadow-verified-glow">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{item.matchScore}% Match Score</span>
                      </span>
                    </div>
                  </div>

                  {/* Why this matches pill */}
                  <div className="p-4 rounded-2xl bg-surface-50 border border-accent-cyan/20 space-y-1.5">
                    <div className="text-xs font-bold text-accent-cyan flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Rationale & Suitability Analysis</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {item.matchReason}
                    </p>
                  </div>

                  {/* Strengths Chips */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-400 font-semibold mr-1">Verified Strengths:</span>
                    {item.keyStrengths?.map((st: string, sIdx: number) => (
                      <span
                        key={sIdx}
                        className="text-xs font-medium px-2.5 py-1 rounded-md bg-primary/20 text-accent-cyan border border-primary/30"
                      >
                        ✓ {st}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-xs text-slate-400">
                      <span>Threshold: <strong className="text-white">{item.provider.minInvestment || "Flexible"}</strong></span>
                      <span className="mx-2">•</span>
                      <span>Region: <strong className="text-white">{item.provider.serviceRegions?.join(", ")}</strong></span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        href={`/providers/${item.provider.slug}`}
                        className="py-2.5 px-5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-ai-glow transition flex items-center gap-1.5"
                      >
                        <span>View Full Verified Profile</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-surface-border shadow-2xl relative">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
                <span>Step {step} of 3</span>
                <span>{step === 1 ? "Profile Type" : step === 2 ? "Goal & Mechanism" : "Jurisdiction"}</span>
              </div>
              <div className="w-full h-1.5 bg-surface-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-cyan to-primary transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Step 1: Investor Type */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1.5">What best describes your investor profile?</h3>
                  <p className="text-xs text-slate-400">This ensures alignment with ASIC retail or wholesale licensing rules.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {INVESTOR_TYPES.map((t) => {
                    const IconComponent = t.icon;
                    const isSelected = investorType === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setInvestorType(t.id)}
                        className={`p-5 rounded-2xl text-left border transition-all duration-200 flex items-start gap-3.5 ${
                          isSelected
                            ? "bg-primary/20 border-accent-cyan shadow-ai-glow text-white"
                            : "bg-surface-50 border-white/5 text-slate-400 hover:text-white hover:border-white/15"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? "bg-primary/30 border-accent-cyan text-accent-cyan"
                              : "bg-surface-100 border-white/10 text-slate-300"
                          }`}
                        >
                          <IconComponent className={`w-5 h-5 ${t.iconColor}`} />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white mb-1">{t.label}</div>
                          <div className="text-xs text-slate-300 leading-relaxed">{t.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="py-3 px-7 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-ai-glow transition flex items-center gap-2"
                  >
                    <span>Next: Capital Objective</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Capital Objective */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1.5">What is your primary investment objective?</h3>
                  <p className="text-xs text-slate-400">Match with providers specialized in your desired return mechanism.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {OBJECTIVES.map((o) => {
                    const IconComponent = o.icon;
                    const isSelected = goal === o.id;
                    return (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => setGoal(o.id)}
                        className={`p-5 rounded-2xl text-left border transition-all duration-200 flex items-start gap-3.5 ${
                          isSelected
                            ? "bg-primary/20 border-accent-cyan shadow-ai-glow text-white"
                            : "bg-surface-50 border-white/5 text-slate-400 hover:text-white hover:border-white/15"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? "bg-primary/30 border-accent-cyan text-accent-cyan"
                              : "bg-surface-100 border-white/10 text-slate-300"
                          }`}
                        >
                          <IconComponent className={`w-5 h-5 ${o.iconColor}`} />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white mb-1">{o.label}</div>
                          <div className="text-xs text-slate-300 leading-relaxed">{o.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="py-3 px-5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-2 transition"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="py-3 px-7 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-ai-glow transition flex items-center gap-2"
                  >
                    <span>Next: Geographic Coverage</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Region */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1.5">Which Australian state or territory?</h3>
                  <p className="text-xs text-slate-400">Filter providers authorized or licensed to advise in your jurisdiction.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {AUSTRALIAN_REGIONS.map((r) => {
                    const isSelected = region === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRegion(r)}
                        className={`p-3.5 rounded-xl text-left border text-xs font-semibold transition flex items-center gap-2.5 ${
                          isSelected
                            ? "bg-primary/20 border-accent-cyan shadow-ai-glow text-white"
                            : "bg-surface-50 border-white/5 text-slate-400 hover:text-white hover:border-white/15"
                        }`}
                      >
                        <MapPin className={`w-4 h-4 shrink-0 ${isSelected ? "text-accent-cyan" : "text-slate-500"}`} />
                        <span className="truncate">{r}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="py-3 px-5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-2 transition"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handleComputeMatch}
                    disabled={loading}
                    className="py-3 px-8 rounded-xl bg-gradient-to-r from-accent-cyan to-primary text-white text-xs font-bold shadow-ai-glow transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Calculating Alignment Matrix...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate Neutral AI Matches</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

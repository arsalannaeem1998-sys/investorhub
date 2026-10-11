"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Navbar } from "../../components/marketplace/Navbar";
import { Footer } from "../../components/marketplace/Footer";
import { ProviderCard } from "../../components/marketplace/ProviderCard";
import { ProviderDto, CATEGORIES, AUSTRALIAN_REGIONS, CATEGORY_DETAILS } from "@investorhub/shared";
import { apiClient } from "../../lib/api-client";
import {
  Search,
  SlidersHorizontal,
  ShieldCheck,
  Scale,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ProvidersDirectoryPageContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [providers, setProviders] = useState<ProviderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("featured");

  // Comparison State
  const [comparedIds, setComparedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchProviders();
  }, [selectedCategory, selectedRegion, verifiedOnly, minRating, sortBy]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedRegion && selectedRegion !== "All") params.set("region", selectedRegion);
      if (verifiedOnly) params.set("verified", "true");
      if (minRating > 0) params.set("minRating", minRating.toString());
      params.set("sort", sortBy);

      const res = await apiClient<{ success: boolean; data: ProviderDto[] }>(
        `/providers?${params.toString()}`
      );
      if (res?.success && Array.isArray(res.data)) {
        setProviders(res.data);
      } else {
        // Fallback demo dataset if API isn't live yet
        loadDemoProviders();
      }
    } catch {
      loadDemoProviders();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoProviders = () => {
    // High-fidelity fallback dataset
    const demo: ProviderDto[] = [
      {
        id: "p1",
        ownerUserId: "u1",
        companyName: "Apex Horizons Wealth Management",
        slug: "apex-horizons-wealth",
        category: "FUND_MANAGER",
        tagline: "Institutional-grade wholesale equity and multi-asset strategies.",
        overview: "Boutique asset manager catering to family offices, wholesale investors, and SMSF portfolios.",
        specialities: ["Australian Equities", "Global Long/Short", "Multi-Asset Funds"],
        serviceRegions: ["Sydney (NSW)", "National (Australia-wide)"],
        contactEmail: "contact@apexhorizonswealth.com.au",
        minInvestment: "$100,000",
        feeSummary: "1.10% Base + 15% Hurdle",
        aumText: "$240M+ AUM",
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
        overview: "Institutional commercial property syndicates for private investors with monthly cash distributions.",
        specialities: ["Industrial Logistics", "Healthcare Centers", "Commercial Syndicates"],
        serviceRegions: ["Brisbane (QLD)", "Sydney (NSW)"],
        contactEmail: "syndicates@pacificyield.com.au",
        minInvestment: "$50,000",
        feeSummary: "1% Management",
        aumText: "$180M Assets",
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
        id: "p3",
        ownerUserId: "u3",
        companyName: "Quantum Edge Trading Academy",
        slug: "quantum-edge-trading",
        category: "TRADING_EDUCATOR",
        tagline: "Professional price action and order flow education for retail traders.",
        overview: "Systematic education covering liquidity analysis, risk mitigation, and algorithmic execution.",
        specialities: ["Price Action", "Futures & Options", "Order Flow Analysis"],
        serviceRegions: ["Melbourne (VIC)", "National (Australia-wide)"],
        contactEmail: "learn@quantumedge.com.au",
        minInvestment: "N/A (Education)",
        feeSummary: "Courses from $1,200",
        aumText: null,
        status: "APPROVED",
        verificationStatus: "VERIFIED",
        verifiedBadge: true,
        isFeatured: true,
        avgRating: 4.9,
        reviewCount: 18,
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
        specialities: ["Retirement Planning", "Wealth Transition", "Superannuation Structuring"],
        serviceRegions: ["Adelaide (SA)", "Melbourne (VIC)"],
        contactEmail: "advice@beaconwealth.com.au",
        minInvestment: "$250,000 Portfolio",
        feeSummary: "Flat fee from $4,400",
        aumText: null,
        status: "APPROVED",
        verificationStatus: "VERIFIED",
        verifiedBadge: true,
        isFeatured: true,
        avgRating: 5.0,
        reviewCount: 11,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "p5",
        ownerUserId: "u5",
        companyName: "Aegis SMSF Solutions Australia",
        slug: "aegis-smsf-solutions",
        category: "SMSF_SPECIALIST",
        tagline: "Turnkey SMSF setup, administration, annual compliance, and audit.",
        overview: "End-to-end administration for self-managed super funds ensuring ATO and ASIC compliance.",
        specialities: ["SMSF Setup", "Annual Compliance", "Property in Super"],
        serviceRegions: ["Brisbane (QLD)", "National (Australia-wide)"],
        contactEmail: "admin@aegissmsf.com.au",
        minInvestment: "N/A",
        feeSummary: "$1,650 Annual Fee",
        aumText: null,
        status: "APPROVED",
        verificationStatus: "VERIFIED",
        verifiedBadge: true,
        isFeatured: false,
        avgRating: 4.9,
        reviewCount: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "p6",
        ownerUserId: "u6",
        companyName: "Vanguardian Risk & Portfolio Analytics",
        slug: "vanguardian-risk-analytics",
        category: "PORTFOLIO_ANALYST",
        tagline: "Objective portfolio health audits and quantitative stress testing.",
        overview: "Unbiased analytical reviews evaluating hidden correlations and fee drag.",
        specialities: ["Portfolio Stress Testing", "Asset Allocation Audit", "Fee Drag Analysis"],
        serviceRegions: ["Perth (WA)", "National (Australia-wide)"],
        contactEmail: "audit@vanguardiananalytics.com.au",
        minInvestment: "N/A",
        feeSummary: "$1,850 per Audit",
        aumText: null,
        status: "APPROVED",
        verificationStatus: "VERIFIED",
        verifiedBadge: true,
        isFeatured: false,
        avgRating: 4.8,
        reviewCount: 6,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "p7",
        ownerUserId: "u7",
        companyName: "Meridian Capital Taxation Specialists",
        slug: "meridian-capital-tax",
        category: "TAX_SPECIALIST",
        tagline: "Strategic tax planning for active investors, property developers, and family trusts.",
        overview: "Capital gains tax concessions, discretionary trust distributions, and digital asset tax compliance.",
        specialities: ["CGT Strategies", "Trust Structuring", "Crypto Asset Taxation"],
        serviceRegions: ["Sydney (NSW)", "National (Australia-wide)"],
        contactEmail: "tax@meridiantax.com.au",
        minInvestment: "N/A",
        feeSummary: "Hourly or Fixed Mandate",
        aumText: null,
        status: "APPROVED",
        verificationStatus: "VERIFIED",
        verifiedBadge: true,
        isFeatured: false,
        avgRating: 4.9,
        reviewCount: 8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "p8",
        ownerUserId: "u8",
        companyName: "Keystone Investment Lending & Advisory",
        slug: "keystone-investment-lending",
        category: "MORTGAGE_BROKER",
        tagline: "Tailored debt structuring for residential syndicates and commercial investors.",
        overview: "Sophisticated debt facilities across non-bank and major Australian lenders.",
        specialities: ["Commercial Mortgages", "SMSF Lending", "Equity Release"],
        serviceRegions: ["Melbourne (VIC)", "Sydney (NSW)"],
        contactEmail: "loans@keystoneinvest.com.au",
        minInvestment: "N/A",
        feeSummary: "Lender Funded",
        aumText: null,
        status: "APPROVED",
        verificationStatus: "VERIFIED",
        verifiedBadge: true,
        isFeatured: false,
        avgRating: 4.8,
        reviewCount: 15,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    let filtered = demo;
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    if (selectedRegion && selectedRegion !== "All") {
      filtered = filtered.filter((p) =>
        p.serviceRegions.some((r) => r.includes(selectedRegion))
      );
    }
    if (verifiedOnly) {
      filtered = filtered.filter((p) => p.verifiedBadge);
    }
    if (minRating > 0) {
      filtered = filtered.filter((p) => p.avgRating >= minRating);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.companyName.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.specialities.some((s) => s.toLowerCase().includes(q))
      );
    }

    setProviders(filtered);
  };

  const handleCompareToggle = (id: string) => {
    if (comparedIds.includes(id)) {
      setComparedIds(comparedIds.filter((item) => item !== id));
    } else {
      if (comparedIds.length >= 4) {
        alert("You can compare up to 4 providers at a time.");
        return;
      }
      setComparedIds([...comparedIds, id]);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedRegion("All");
    setVerifiedOnly(false);
    setMinRating(0);
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen bg-[#070D1F] flex flex-col">
      <Navbar />

      {/* Directory Hero Header */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 border-b border-surface-border overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-gradient-to-bl from-primary/15 via-accent-violet/10 to-transparent blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-accent-cyan font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Australia's Verified Directory</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Discover Verified Investment Professionals
              </h1>
              <p className="mt-2 text-sm text-slate-400 max-w-2xl">
                Filter by verified AFSL credentials, specialty disciplines, investment thresholds, and client ratings.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 glass-panel p-2.5 rounded-2xl border-white/5">
              <div className="text-center px-3 border-r border-white/10">
                <div className="text-base font-bold text-white">1,250+</div>
                <div className="text-[10px] text-slate-400 uppercase">Profiles</div>
              </div>
              <div className="text-center px-3 border-r border-white/10">
                <div className="text-base font-bold text-emerald-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100%
                </div>
                <div className="text-[10px] text-slate-400 uppercase">Vetted</div>
              </div>
              <div className="text-center px-3">
                <div className="text-base font-bold text-amber-400">4.9/5</div>
                <div className="text-[10px] text-slate-400 uppercase">Avg Rating</div>
              </div>
            </div>
          </div>

          {/* Search bar & filter trigger */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchProviders()}
                placeholder="Search by firm name, investment strategy, or specialty (e.g. 'SMSF commercial property' or 'ASX equities')..."
                className="w-full bg-surface-50 border border-surface-border rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-ai-card transition"
              />
            </div>
            <button
              onClick={fetchProviders}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-accent-violet hover:from-primary-hover hover:to-primary text-white text-sm font-semibold shadow-ai-glow transition flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Filter Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel p-5 rounded-2xl border border-surface-border">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-accent-cyan" /> Filters
                </span>
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Category Filter */}
              <div className="space-y-2 mb-5">
                <label className="text-xs font-semibold text-slate-300 block">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-surface-50 border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary transition"
                >
                  <option value="">All Categories (11)</option>
                  {Object.entries(CATEGORIES).map(([key, val]) => (
                    <option key={key} value={val}>
                      {CATEGORY_DETAILS[val as keyof typeof CATEGORY_DETAILS]?.label || key}
                    </option>
                  ))}
                </select>
              </div>

              {/* Region Filter */}
              <div className="space-y-2 mb-5">
                <label className="text-xs font-semibold text-slate-300 block">Australian Region</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full bg-surface-50 border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary transition"
                >
                  <option value="All">All Australia</option>
                  {AUSTRALIAN_REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              {/* Verified Badge Filter */}
              <div className="mb-5 p-3 rounded-xl bg-surface-50 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-verified" />
                  <div>
                    <div className="text-xs font-semibold text-white">Verified Only</div>
                    <div className="text-[10px] text-slate-400">AFSL / ABN vetted</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-verified focus:ring-verified accent-verified cursor-pointer"
                />
              </div>

              {/* Min Rating Filter */}
              <div className="space-y-2 mb-5">
                <label className="text-xs font-semibold text-slate-300 block">Minimum Rating</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 4.0, 4.5, 4.8].map((val) => (
                    <button
                      key={val}
                      onClick={() => setMinRating(val)}
                      className={`py-1.5 rounded-lg text-xs font-medium transition ${
                        minRating === val
                          ? "bg-primary text-white"
                          : "bg-surface-50 text-slate-400 hover:text-white"
                      }`}
                    >
                      {val === 0 ? "Any" : `${val}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Matcher Banner in sidebar */}
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-primary/20 via-accent-violet/20 to-transparent border border-primary/30 text-xs">
                <div className="font-bold text-white flex items-center gap-1 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-accent-cyan" /> Unsure who to pick?
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed mb-3">
                  Answer 4 quick questions and our AI Matcher finds your highest-aligned verified expert.
                </p>
                <Link
                  href="/match"
                  className="block text-center py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-accent-cyan font-semibold transition"
                >
                  Start Match Wizard &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Right Provider Grid */}
          <div className="lg:col-span-3 space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-3.5 rounded-2xl border-surface-border">
              <div className="text-xs text-slate-400 font-medium">
                Showing <strong className="text-white">{providers.length}</strong> verified investment providers
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-surface-50 border border-surface-border rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary transition"
                >
                  <option value="featured">Featured First</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Recently Joined</option>
                  <option value="name">Company Name (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Providers Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="glass-panel h-64 rounded-2xl animate-pulse bg-white/5" />
                ))}
              </div>
            ) : providers.length === 0 ? (
              <div className="glass-panel text-center py-16 px-4 rounded-2xl border border-surface-border space-y-4">
                <div className="w-12 h-12 rounded-full bg-white/5 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">No providers match your criteria</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try adjusting your search keywords, region selection, or clearing filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {providers.map((p) => (
                  <ProviderCard
                    key={p.id}
                    provider={p}
                    onCompareToggle={handleCompareToggle}
                    isCompared={comparedIds.includes(p.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Compare Drawer when items are selected */}
      {comparedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-xl glass-panel bg-[#0B1533]/90 border border-accent-cyan/40 p-4 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center justify-between gap-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-cyan/20 text-accent-cyan flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                {comparedIds.length} Provider{comparedIds.length > 1 ? "s" : ""} selected for comparison
              </div>
              <div className="text-[10px] text-slate-400">Max 4 providers side-by-side</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setComparedIds([])}
              className="text-xs text-slate-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>
            <Link
              href={`/compare?ids=${comparedIds.join(",")}`}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-primary to-accent-cyan text-white text-xs font-semibold shadow-ai-glow transition flex items-center gap-1.5"
            >
              <span>Compare Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function ProvidersDirectoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
          Loading providers…
        </div>
      }
    >
      <ProvidersDirectoryPageContent />
    </Suspense>
  );
}

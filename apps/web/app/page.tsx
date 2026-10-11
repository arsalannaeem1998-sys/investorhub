"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "../components/marketplace/Navbar";
import { Footer } from "../components/marketplace/Footer";
import { ProviderCard } from "../components/marketplace/ProviderCard";
import { ProviderDto, CATEGORIES, CATEGORY_DETAILS } from "@investorhub/shared";
import { apiClient } from "../lib/api-client";
import {
  Sparkles,
  ShieldCheck,
  Search,
  ArrowRight,
  Star,
  Users,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  Building,
  BarChart3,
  Calendar,
  Lock,
  Layers,
  ArrowUpRight,
  Award,
  Globe,
  Radio,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Real investor avatar photos for hero social proof
const INVESTOR_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
];

// Curated Category imagery
const CATEGORY_VISUALS: Record<string, { image: string; gradient: string }> = {
  FUND_MANAGER: {
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80",
    gradient: "from-blue-600/30 to-indigo-900/40",
  },
  PROPERTY_INVESTOR: {
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=500&q=80",
    gradient: "from-emerald-600/30 to-teal-900/40",
  },
  TRADING_EDUCATOR: {
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=500&q=80",
    gradient: "from-purple-600/30 to-violet-900/40",
  },
  TRADING_CHANNEL: {
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=500&q=80",
    gradient: "from-rose-600/30 to-pink-900/40",
  },
  FINANCIAL_ADVISER: {
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500&q=80",
    gradient: "from-cyan-600/30 to-blue-900/40",
  },
  PORTFOLIO_ANALYST: {
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=500&q=80",
    gradient: "from-amber-600/30 to-orange-900/40",
  },
  TAX_SPECIALIST: {
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=80",
    gradient: "from-sky-600/30 to-indigo-900/40",
  },
  SMSF_SPECIALIST: {
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=500&q=80",
    gradient: "from-emerald-600/30 to-green-900/40",
  },
};

export default function HomePage() {
  const router = useRouter();
  const [featuredProviders, setFeaturedProviders] = useState<ProviderDto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const res = await apiClient<{ success: boolean; data: any }>("/home");
      if (res?.success && res.data?.featuredProviders) {
        setFeaturedProviders(res.data.featuredProviders);
      } else {
        loadFallbackFeatured();
      }
    } catch {
      loadFallbackFeatured();
    }
  };

  const loadFallbackFeatured = () => {
    const fallback: ProviderDto[] = [
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
        overview: "Institutional commercial property syndicates with monthly cash distributions.",
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
    ];
    setFeaturedProviders(fallback);
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    router.push(`/providers?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#070D1F] flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-surface-border">
        {/* Futuristic AI Ambient background glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-tr from-primary/25 via-accent-violet/20 to-accent-cyan/15 blur-[150px] pointer-events-none rounded-full" />
        
        {/* Subtle geometric grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-accent-cyan font-semibold shadow-inner">
                <span className="w-2 h-2 rounded-full bg-verified animate-ping" />
                <span>AUSTRALIA'S TRUSTED INVESTOR MARKETPLACE</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                Make confident <br />
                <span className="ai-gradient-text">investment decisions</span> <br />
                with verified experts.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover, compare and connect with fund managers, property specialists, trading educators, financial advisers, and investor communities in one transparent platform.
              </p>

              {/* Social Proof Avatars Stack */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
                <div className="flex -space-x-2">
                  {INVESTOR_AVATARS.map((avatar, i) => (
                    <img
                      key={i}
                      src={avatar}
                      alt="Investor"
                      className="w-8 h-8 rounded-full border-2 border-[#070D1F] object-cover"
                    />
                  ))}
                  <div className="w-8 h-8 rounded-full bg-surface-100 border-2 border-[#070D1F] flex items-center justify-center text-[10px] font-bold text-accent-cyan">
                    +15k
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  Trusted by over <strong className="text-white">15,000+</strong> Australian SMSF & wholesale investors
                </div>
              </div>

              {/* Interactive Search Bar */}
              <form
                onSubmit={handleHeroSearch}
                className="glass-panel p-2 rounded-2xl border-white/15 shadow-ai-card flex flex-col sm:flex-row gap-2 max-w-xl mx-auto lg:mx-0"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search providers, services or investment strategies..."
                    className="w-full bg-surface-50 border border-transparent rounded-xl pl-10 pr-3 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-primary transition"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-surface-50 border border-transparent rounded-xl px-3 py-3 text-xs text-slate-300 focus:outline-none focus:border-primary transition"
                >
                  <option value="">All categories</option>
                  {Object.entries(CATEGORIES).map(([key, val]) => (
                    <option key={key} value={val}>
                      {CATEGORY_DETAILS[val as keyof typeof CATEGORY_DETAILS]?.label || key}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="py-3 px-5 rounded-xl bg-gradient-to-r from-primary to-accent-violet hover:from-primary-hover hover:to-primary text-white text-xs font-semibold shadow-ai-glow transition shrink-0"
                >
                  Search
                </button>
              </form>

              {/* Popular tags */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Popular:</span>
                <Link
                  href="/providers?category=FUND_MANAGER"
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition"
                >
                  Fund managers
                </Link>
                <Link
                  href="/providers?category=PROPERTY_INVESTOR"
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition"
                >
                  Property investment
                </Link>
                <Link
                  href="/providers?category=TRADING_EDUCATOR"
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition"
                >
                  Trading education
                </Link>
                <Link
                  href="/providers?category=SMSF_SPECIALIST"
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition"
                >
                  SMSF experts
                </Link>
              </div>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link
                  href="/providers"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent-violet hover:from-primary-hover text-white text-xs font-semibold shadow-ai-glow transition text-center"
                >
                  Explore verified providers
                </Link>
                <Link
                  href="/match"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface-100 hover:bg-surface-200 text-accent-cyan border border-accent-cyan/30 text-xs font-semibold transition text-center flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Try AI Match Finder</span>
                </Link>
              </div>
            </div>

            {/* Right Interactive AI Glass Telemetry Card with Glowing Chart */}
            <div className="lg:col-span-5 relative">
              <div className="glass-panel rounded-3xl p-6 border-white/15 shadow-2xl relative overflow-hidden backdrop-blur-2xl space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-verified animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Marketplace Telemetry
                    </span>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-verified/20 text-emerald-400 font-semibold border border-verified/30 flex items-center gap-1 shadow-verified-glow">
                    <ShieldCheck className="w-3 h-3 text-verified" /> ASIC Audit Active
                  </span>
                </div>

                {/* Big Metric Display */}
                <div>
                  <div className="text-4xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
                    <span>1,250+</span>
                    <span className="text-xs text-emerald-400 font-semibold flex items-center">
                      <TrendingUp className="w-3.5 h-3.5" /> +24% YoY
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Verified investment specialists across Australia</div>
                </div>

                {/* Simulated Glowing AI Chart Visual */}
                <div className="p-4 rounded-2xl bg-[#050C1F] border border-white/5 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Simulated Compound Alpha Yield</span>
                    <span className="text-emerald-400 font-bold font-mono">+18.4% p.a.</span>
                  </div>

                  {/* SVG Wave Line */}
                  <div className="h-16 w-full flex items-end">
                    <svg viewBox="0 0 300 70" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#1F5FFF" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0 60 Q 50 45, 100 50 T 200 25 T 300 8 L 300 70 L 0 70 Z"
                        fill="url(#chartGrad)"
                      />
                      <path
                        d="M0 60 Q 50 45, 100 50 T 200 25 T 300 8"
                        fill="none"
                        stroke="#22D3EE"
                        strokeWidth="2.5"
                      />
                      <circle cx="300" cy="8" r="4" fill="#22D3EE" className="animate-ping" />
                      <circle cx="300" cy="8" r="4" fill="#FFFFFF" />
                    </svg>
                  </div>
                </div>

                {/* 3 Metric Pills */}
                <div className="grid grid-cols-3 gap-2.5 pt-2 text-center">
                  <div className="p-3 bg-surface-50 rounded-xl border border-white/5">
                    <div className="text-sm font-bold text-white">15,000+</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Investors</div>
                  </div>
                  <div className="p-3 bg-surface-50 rounded-xl border border-white/5">
                    <div className="text-sm font-bold text-accent-cyan">4,860</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Consultations</div>
                  </div>
                  <div className="p-3 bg-surface-50 rounded-xl border border-white/5">
                    <div className="text-sm font-bold text-amber-400">4.9/5</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Counters Strip */}
      <section className="py-8 bg-[#040813] border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 flex items-center justify-center gap-1">
                <Star className="w-6 h-6 fill-amber-400" /> 4.9/5
              </div>
              <div className="text-xs text-slate-400 mt-1">Average marketplace rating</div>
            </div>
            <div className="p-4 border-l border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-6 h-6" /> 1,250+
              </div>
              <div className="text-xs text-slate-400 mt-1">Verified provider profiles</div>
            </div>
            <div className="p-4 border-l border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-1">
                <Users className="w-6 h-6 text-primary-light" /> 15,000+
              </div>
              <div className="text-xs text-slate-400 mt-1">Active investor members</div>
            </div>
            <div className="p-4 border-l border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-accent-cyan">
                300+
              </div>
              <div className="text-xs text-slate-400 mt-1">Courses & webinars</div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Expertise by Category with High-Res Image Badges */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-surface-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-accent-cyan mb-1">
                EXPLORE THE MARKETPLACE
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Find expertise for every investment goal.
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Browse focused categories, review verified business profiles, and connect directly with providers that match your risk profile and objectives.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Object.entries(CATEGORIES).slice(0, 8).map(([key, val]) => {
              const details = CATEGORY_DETAILS[val as keyof typeof CATEGORY_DETAILS];
              const visual = CATEGORY_VISUALS[val] || {
                image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80",
                gradient: "from-blue-600/30 to-indigo-900/40",
              };

              return (
                <Link
                  key={key}
                  href={`/providers?category=${val}`}
                  className="glass-panel glass-panel-hover rounded-3xl overflow-hidden border border-surface-border transition group flex flex-col justify-between hover:border-accent-cyan/40"
                >
                  {/* Category Image Header */}
                  <div className="relative h-28 w-full overflow-hidden bg-surface-100">
                    <img
                      src={visual.image}
                      alt={details?.label || key}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#091129] via-[#091129]/50 to-transparent" />
                    <div className="absolute bottom-2.5 left-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-slate-200">
                        Verified Australian Specialists
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 pt-3">
                    <h3 className="text-base font-bold text-white group-hover:text-accent-cyan transition">
                      {details?.label || key}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {details?.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-xs font-semibold text-primary-light group-hover:text-accent-cyan transition">
                      <span>Explore vertical</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-xs font-semibold text-accent-cyan hover:underline"
            >
              <span>View all 11 investment categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Providers Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-surface-border bg-[#050A19]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-verified mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> ASIC AUDITED ENTITIES
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Featured Verified Providers
              </h2>
            </div>
            <Link
              href="/providers"
              className="text-xs font-semibold text-primary-light hover:text-white flex items-center gap-1"
            >
              <span>Browse all providers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works (Trust & Process) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-surface-border">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-accent-cyan mb-2">
              SEAMLESS & AUDITED ENGAGEMENT
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              How InvestorHub Works
            </h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto mt-2">
              A structured commercial foundation ensuring transparent information, qualified connections, and verified credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-6 rounded-3xl border border-surface-border text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 text-accent-cyan flex items-center justify-center mx-auto shadow-ai-glow">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">1. Discover & Compare</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter through verified Australian providers by strategy, location, minimum capital, and client ratings.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-surface-border text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-verified/20 text-emerald-400 flex items-center justify-center mx-auto shadow-verified-glow">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">2. Check Verification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Review verified AFSL credentials, track records, fee structures, and moderated client reviews.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-surface-border text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-accent-violet/20 text-accent-violet flex items-center justify-center mx-auto shadow-ai-glow">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">3. Connect Confidentiality</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Book free introductory consultations and send direct enquiries with guaranteed 1-day response SLAs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Provider Call to Action Banner */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-surface-100 via-surface-50 to-surface-100 border-b border-surface-border">
        <div className="max-w-5xl mx-auto glass-panel p-8 sm:p-12 rounded-3xl border border-primary/30 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden">
          <div className="space-y-3 relative z-10 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-verified flex items-center justify-center md:justify-start gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Grow Your Qualified Client Pipeline
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Are you an Australian investment professional?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Showcase your practice to over 15,000 active Australian investors. Get your Verified Provider Badge, manage high-intent leads, and publish insights.
            </p>
          </div>
          <div className="relative z-10 shrink-0">
            <Link
              href="/become-a-provider"
              className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-verified to-emerald-600 hover:brightness-110 text-white text-xs font-semibold shadow-verified-glow transition flex items-center gap-2"
            >
              <span>List Your Practice</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

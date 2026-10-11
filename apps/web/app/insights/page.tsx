"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../../components/marketplace/Navbar";
import { Footer } from "../../components/marketplace/Footer";
import { apiClient } from "../../lib/api-client";
import {
  Sparkles,
  Calendar,
  ArrowRight,
  BookOpen,
  Clock,
  TrendingUp,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";

interface InsightArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  authorName: string;
  authorAvatar?: string;
  publishedAt: string;
  readTime?: string;
  image: string;
  tags: string[];
}

const DEFAULT_ARTICLES: InsightArticle[] = [
  {
    id: "art-1",
    slug: "rba-rate-cycle-investor-playbook-2026",
    title: "Navigating the RBA Rate Trajectory: A 2026 Australian Investor Playbook",
    excerpt:
      "How monetary policy shifts are reshaping yields across commercial property, dividend equities, and wholesale fixed income mandates.",
    authorName: "Marcus Vance",
    authorAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    publishedAt: new Date().toISOString(),
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
    tags: ["RBA", "Fixed Income", "ASX 200", "Macro"],
  },
  {
    id: "art-2",
    slug: "property-syndicates-vs-reits-australia",
    title: "Unlisted Property Syndicates vs ASX REITs: Risk, Liquidity, and Yield",
    excerpt:
      "Comparing unlisted commercial property syndicates with listed real estate investment trusts for wholesale and SMSF trustees seeking defensive income.",
    authorName: "Elena Rostova",
    authorAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    tags: ["Commercial Property", "REITs", "Yield", "Private Syndicates"],
  },
  {
    id: "art-3",
    slug: "smsf-property-borrowing-lrba-guide",
    title: "The Ultimate Guide to Limited Recourse Borrowing (LRBA) in Your SMSF",
    excerpt:
      "Everything trustees need to know about purchasing residential and commercial property through superannuation legally under ATO and SIS Act rules.",
    authorName: "James MacIntyre, CFP",
    authorAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
    tags: ["SMSF", "LRBA", "Compliance", "ASIC"],
  },
  {
    id: "art-4",
    slug: "elliott-wave-price-action-for-asx-traders",
    title: "Elliott Wave & Institutional Order Flow in Modern ASX 200 Trading",
    excerpt:
      "How professional traders combine market structure geometry with volume profile and liquidity sweeps to navigate intraday index volatility.",
    authorName: "Tyler Harrison",
    authorAvatar:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80",
    publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
    tags: ["Elliott Wave", "Trading", "ASX 200", "Technical Analysis"],
  },
];

export default function InsightsPage() {
  const [articles, setArticles] = useState<InsightArticle[]>(DEFAULT_ARTICLES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await apiClient<{ success: boolean; data: any[] }>("/articles");
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        // Enrich server articles with visual fallbacks
        const enriched = res.data.map((art, index) => ({
          ...art,
          authorAvatar:
            DEFAULT_ARTICLES[index % DEFAULT_ARTICLES.length].authorAvatar,
          readTime: DEFAULT_ARTICLES[index % DEFAULT_ARTICLES.length].readTime,
          image: DEFAULT_ARTICLES[index % DEFAULT_ARTICLES.length].image,
        }));
        setArticles(enriched);
      }
    } catch {
      // Fallback already in initial state
    }
  };

  return (
    <div className="min-h-screen bg-[#070D1F] flex flex-col text-slate-100 selection:bg-primary selection:text-white">
      <Navbar />

      {/* Header Banner */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-b border-surface-border overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-gradient-to-tr from-primary/20 via-accent-violet/15 to-transparent blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-xs text-accent-cyan font-semibold mb-4 backdrop-blur-md shadow-glow-sm">
            <BookOpen className="w-4 h-4 text-accent-cyan" />
            <span>INSTITUTIONAL RESEARCH & MARKET EDUCATION</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
            Market Insights & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-accent-cyan via-primary-light to-accent-violet bg-clip-text text-transparent">
              Strategic Research
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            In-depth macroeconomic analysis, property syndicate breakdowns, and quantitative trading frameworks written by verified Australian fund managers and licensed practitioners.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((art) => (
            <Link
              key={art.id}
              href={`/insights/${art.slug}`}
              className="group rounded-3xl overflow-hidden border border-surface-border bg-surface/50 backdrop-blur-md hover:border-accent-cyan/40 hover:shadow-ai-card transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Visual Image Header */}
                <div className="relative h-56 w-full overflow-hidden bg-surface-100">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091129] via-[#091129]/40 to-transparent" />

                  {/* Reading Time and Tag Overlay */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#070D1F]/80 backdrop-blur-md text-accent-cyan border border-white/10 shadow-sm flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {art.readTime || "5 min read"}
                    </span>

                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#070D1F]/80 backdrop-blur-md text-slate-300 border border-white/10 shadow-sm">
                      {art.tags?.[0] || "RESEARCH"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7">
                  {/* Author Row */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={
                        art.authorAvatar ||
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                      }
                      alt={art.authorName}
                      className="w-8 h-8 rounded-full object-cover border border-white/20 shadow-sm"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-white block">
                        {art.authorName}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(art.publishedAt).toLocaleDateString("en-AU", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-accent-cyan transition leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {art.tags?.map((t: string, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2.5 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/5"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-7 pb-7 pt-0">
                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-primary-light group-hover:text-accent-cyan transition">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
                    Read full analysis & AI summary
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "../../../components/marketplace/Navbar";
import { Footer } from "../../../components/marketplace/Footer";
import { apiClient } from "../../../lib/api-client";
import {
  Calendar,
  User,
  ArrowLeft,
  Share2,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Clock,
  ShieldCheck,
  Bookmark,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

const ARTICLE_IMAGES: Record<string, string> = {
  "rba-rate-cycle-investor-playbook-2026":
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80",
  "property-syndicates-vs-reits-australia":
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
  "smsf-property-borrowing-lrba-guide":
    "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
  "elliott-wave-price-action-for-asx-traders":
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
};

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (slug) fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const res = await apiClient<{ success: boolean; data: any }>(`/articles/${slug}`);
      if (res?.success && res.data) {
        setArticle(res.data);
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
    setArticle({
      id: "art-1",
      slug,
      title: "Navigating the RBA Rate Trajectory: A 2026 Australian Investor Playbook",
      excerpt:
        "How monetary policy shifts are reshaping yields across commercial property, dividend equities, and wholesale fixed income.",
      body: `The Reserve Bank of Australia continues to calibrate monetary policy amid evolving global inflation dynamics and domestic economic indicators. For Australian wholesale, SMSF, and retail investors, understanding these macro shifts is critical to preserving capital and optimizing net yield.

### 1. The Shifting Landscape in Commercial Real Estate
Unlisted commercial property syndicates—particularly within cold storage logistics and modern healthcare infrastructure—continue to demonstrate robust pricing power. Long-term leases featuring CPI-linked rental review clauses offer natural inflation mitigation compared to traditional residential holdings.

### 2. Wholesale Fixed Income & Private Credit Mandates
As institutional banks re-align balance sheets, private debt funds secured by first-registered mortgages on commercial assets have emerged as compelling yield alternatives. Targeting 8.5% to 10.5% p.a., these senior-secured debt instruments provide conservative income distribution with lower duration risk.

### 3. SMSF Allocation Considerations
Trustees must ensure asset diversification aligns with their written investment strategy under Superannuation Industry (Supervision) Act regulations. Incorporating non-correlated alternative assets helps safeguard retirement balances against equity drawdowns.

### 4. Summary & Action Steps
Investors should consult with licensed financial planners and accredited AFSL fund managers before rebalancing portfolios, ensuring their liquidity targets match the investment horizon.`,
      authorName: "Marcus Vance, Chief Macro Strategist",
      authorAvatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      publishedAt: new Date().toISOString(),
      tags: ["RBA", "Fixed Income", "ASX 200", "Macro"],
      relatedArticles: [
        {
          id: "art-2",
          slug: "property-syndicates-vs-reits-australia",
          title: "Unlisted Property Syndicates vs ASX REITs: Risk, Liquidity, and Yield",
        },
      ],
    });
  };

  const coverImage =
    ARTICLE_IMAGES[slug] ||
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070D1F] flex flex-col">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-24 text-center flex-1">
          <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-xs text-slate-400">Loading analysis report...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="min-h-screen bg-[#070D1F] flex flex-col text-slate-100 selection:bg-primary selection:text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        <div className="flex items-center justify-between">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Insights Hub</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSaved(!saved)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                saved
                  ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                  : "bg-surface-50 border-white/10 text-slate-300 hover:text-white"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{saved ? "Saved" : "Save Article"}</span>
            </button>
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Article link copied to clipboard!");
                }
              }}
              className="p-2 rounded-xl bg-surface-50 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Cinematic Header Image */}
        <div className="relative h-64 sm:h-96 w-full rounded-3xl overflow-hidden border border-surface-border shadow-2xl">
          <img
            src={coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070D1F] via-[#070D1F]/40 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {article.tags?.map((t: string, i: number) => (
                <span
                  key={i}
                  className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#070D1F]/80 backdrop-blur-md text-accent-cyan border border-white/10 shadow-sm"
                >
                  #{t}
                </span>
              ))}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
              {article.title}
            </h1>
          </div>
        </div>

        {/* Author & Meta Row */}
        <div className="flex items-center justify-between border-y border-white/10 py-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <img
              src={
                article.authorAvatar ||
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
              }
              alt={article.authorName}
              className="w-9 h-9 rounded-full object-cover border border-white/20"
            />
            <div>
              <span className="font-semibold text-white block">{article.authorName}</span>
              <span className="text-[11px] text-slate-400">
                Published {new Date(article.publishedAt).toLocaleDateString("en-AU", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-accent-cyan" /> 5 min read
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Peer Reviewed
            </span>
          </div>
        </div>

        {/* AI 30-Second Summary Pill */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-surface-50 to-surface-100 border border-accent-cyan/30 space-y-2 shadow-glow-sm">
          <div className="text-xs font-bold text-accent-cyan flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent-cyan" />
            <span>AI Executive Summary (30-second read)</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
            {article.excerpt}
          </p>
        </div>

        {/* Article Body */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-surface-border text-slate-200 text-sm sm:text-base leading-relaxed space-y-6 whitespace-pre-line shadow-card">
          {article.body}
        </div>

        {/* Mandatory Risk Disclaimer (ASIC RG 234) */}
        <div className="p-5 rounded-2xl bg-surface-50 border border-white/10 flex items-start gap-4">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-white block mb-1">MANDATORY ASIC REGULATORY GUIDE 234 NOTICE:</strong>
            This publication is strictly provided for general educational and informational purposes. It does not constitute personal financial product advice and does not take into account the objectives, financial situation, or needs of any individual. Before acting on any information, consider its appropriateness in light of your personal circumstances.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

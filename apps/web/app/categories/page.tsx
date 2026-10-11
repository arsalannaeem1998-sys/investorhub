"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "../../components/marketplace/Navbar";
import { Footer } from "../../components/marketplace/Footer";
import { CATEGORIES, CATEGORY_DETAILS } from "@investorhub/shared";
import { apiClient } from "../../lib/api-client";
import {
  Briefcase,
  Home,
  GraduationCap,
  Radio,
  ShieldCheck,
  BarChart3,
  Calculator,
  CreditCard,
  Landmark,
  Users,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
} from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  Briefcase: <Briefcase className="w-5 h-5 text-primary-light" />,
  Home: <Home className="w-5 h-5 text-accent-cyan" />,
  GraduationCap: <GraduationCap className="w-5 h-5 text-accent-violet" />,
  Radio: <Radio className="w-5 h-5 text-rose-400" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-verified" />,
  BarChart3: <BarChart3 className="w-5 h-5 text-amber-400" />,
  Calculator: <Calculator className="w-5 h-5 text-sky-400" />,
  CreditCard: <CreditCard className="w-5 h-5 text-indigo-400" />,
  Landmark: <Landmark className="w-5 h-5 text-emerald-400" />,
  Users: <Users className="w-5 h-5 text-purple-400" />,
  TrendingUp: <TrendingUp className="w-5 h-5 text-accent-cyan" />,
};

// High-resolution photography for all 11 verticals
const CATEGORY_IMAGES: Record<string, string> = {
  FUND_MANAGER:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=80",
  PROPERTY_INVESTOR:
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=700&q=80",
  TRADING_EDUCATOR:
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=700&q=80",
  TRADING_CHANNEL:
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=700&q=80",
  FINANCIAL_ADVISER:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=700&q=80",
  PORTFOLIO_ANALYST:
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=700&q=80",
  TAX_SPECIALIST:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=700&q=80",
  MORTGAGE_BROKER:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=700&q=80",
  SMSF_SPECIALIST:
    "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=700&q=80",
  INVESTOR_COMMUNITY:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=700&q=80",
  MARKET_ANALYST:
    "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=700&q=80",
};

export default function CategoriesIndexPage() {
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await apiClient<{ success: boolean; data: any[] }>("/categories");
      if (res?.success && Array.isArray(res.data)) {
        setCategoriesData(res.data);
      } else {
        loadStaticCategories();
      }
    } catch {
      loadStaticCategories();
    } finally {
      setLoading(false);
    }
  };

  const loadStaticCategories = () => {
    const list = Object.entries(CATEGORIES).map(([key, val]) => {
      const details = CATEGORY_DETAILS[val as keyof typeof CATEGORY_DETAILS];
      return {
        key: val,
        label: details?.label || key,
        description: details?.description || "",
        icon: details?.icon || "Briefcase",
        popularTags: details?.popularTags || [],
        slug: val.toLowerCase().replace(/_/g, "-"),
        count: 12,
      };
    });
    setCategoriesData(list);
  };

  return (
    <div className="min-h-screen bg-[#070D1F] flex flex-col text-slate-100 selection:bg-primary selection:text-white">
      <Navbar />

      {/* Header Banner */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-b border-surface-border overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[600px] h-[350px] bg-gradient-to-tr from-primary/20 via-accent-cyan/15 to-transparent blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute -bottom-10 right-10 w-[400px] h-[300px] bg-accent-violet/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-xs text-accent-cyan font-semibold mb-4 backdrop-blur-md shadow-glow-sm">
            <Sparkles className="w-4 h-4 text-accent-cyan animate-pulse" />
            <span>11 STRUCTURED FINANCIAL VERTICALS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
            Explore Institutional & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-accent-cyan via-primary-light to-accent-violet bg-clip-text text-transparent">
              Licensed Expertise
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            From wholesale fund managers and commercial syndicates to SMSF specialists and quantitative analysts. Browse verified Australian professionals with complete fee and AFSL transparency.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ASIC RG 234 Compliant
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-accent-cyan" /> Verified AFSL Credentials
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-accent-violet" /> 100% Fee Transparency
            </span>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {categoriesData.map((cat) => {
            const coverImage =
              CATEGORY_IMAGES[cat.key] ||
              "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=80";

            return (
              <Link
                key={cat.key}
                href={`/providers?category=${cat.key}`}
                className="group rounded-3xl overflow-hidden border border-surface-border bg-surface/50 backdrop-blur-md hover:border-accent-cyan/40 hover:shadow-ai-card transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Banner with Gradient Overlay */}
                  <div className="relative h-40 w-full overflow-hidden bg-surface-100">
                    <img
                      src={coverImage}
                      alt={cat.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-65"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#091129] via-[#091129]/60 to-transparent" />

                    {/* Category Icon & Provider Count Badge */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#070D1F]/80 backdrop-blur-md border border-white/15 flex items-center justify-center shadow-lg">
                        {ICON_MAP[cat.icon] || <Briefcase className="w-5 h-5 text-primary-light" />}
                      </div>

                      <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-[#070D1F]/80 backdrop-blur-md text-slate-200 border border-white/10 shadow-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        {cat.count || 12} Verified
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white group-hover:text-accent-cyan transition flex items-center justify-between">
                      <span>{cat.label}</span>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-accent-cyan group-hover:translate-x-1 transition" />
                    </h3>
                    <p className="text-xs text-slate-400 mt-2.5 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>

                    {/* Tag Pills */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {cat.popularTags?.slice(0, 3).map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium px-2.5 py-1 rounded-md bg-surface-50 border border-white/5 text-slate-300 group-hover:border-white/15 transition"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-primary-light group-hover:text-accent-cyan transition">
                    <span>Browse vertical directory</span>
                    <span className="text-slate-500 group-hover:text-accent-cyan">→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

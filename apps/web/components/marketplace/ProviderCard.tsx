"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Star,
  ArrowRight,
  Bookmark,
  Scale,
  Sparkles,
  MapPin,
  TrendingUp,
  DollarSign,
  Briefcase,
  Building,
  GraduationCap,
  Radio,
  Calculator,
  Landmark,
} from "lucide-react";
import { ProviderDto, CATEGORY_DETAILS } from "@investorhub/shared";
import { EnquiryModal } from "./EnquiryModal";

// Curated high-res financial photography by category
const CATEGORY_IMAGES: Record<string, string> = {
  FUND_MANAGER:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
  PROPERTY_INVESTOR:
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
  TRADING_EDUCATOR:
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
  TRADING_CHANNEL:
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80",
  FINANCIAL_ADVISER:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
  PORTFOLIO_ANALYST:
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80",
  TAX_SPECIALIST:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
  MORTGAGE_BROKER:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80",
  SMSF_SPECIALIST:
    "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
  INVESTOR_COMMUNITY:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
  MARKET_ANALYST:
    "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80",
};

interface ProviderCardProps {
  provider: ProviderDto;
  onCompareToggle?: (providerId: string) => void;
  isCompared?: boolean;
}

export function ProviderCard({
  provider,
  onCompareToggle,
  isCompared = false,
}: ProviderCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isFavourited, setIsFavourited] = useState(false);

  const categoryDetail =
    CATEGORY_DETAILS[provider.category as keyof typeof CATEGORY_DETAILS];

  const coverImage =
    CATEGORY_IMAGES[provider.category] ||
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80";

  return (
    <>
      <div className="glass-panel glass-panel-hover rounded-3xl overflow-hidden border border-surface-border transition-all duration-300 flex flex-col justify-between relative group hover:border-accent-cyan/40 hover:shadow-ai-card">
        <div>
          {/* Card Image Banner Header */}
          <div className="relative h-32 w-full overflow-hidden bg-surface-100">
            <img
              src={coverImage}
              alt={provider.companyName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#091129] via-[#091129]/60 to-transparent" />

            {/* Badges on Banner */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#070D1F]/80 backdrop-blur-md text-slate-200 border border-white/10 shadow-sm">
                {categoryDetail?.label || provider.category}
              </span>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsFavourited(!isFavourited)}
                  title="Save Favourite"
                  className={`p-1.5 rounded-lg border backdrop-blur-md transition ${
                    isFavourited
                      ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                      : "bg-[#070D1F]/70 border-white/10 text-slate-300 hover:text-white"
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" fill={isFavourited ? "currentColor" : "none"} />
                </button>
                {onCompareToggle && (
                  <button
                    onClick={() => onCompareToggle(provider.id)}
                    title="Compare Provider"
                    className={`p-1.5 rounded-lg border backdrop-blur-md transition ${
                      isCompared
                        ? "bg-accent-cyan/20 border-accent-cyan/40 text-accent-cyan"
                        : "bg-[#070D1F]/70 border-white/10 text-slate-300 hover:text-white"
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Verified Badge Pill floating at bottom of banner */}
            {provider.verifiedBadge && (
              <div className="absolute bottom-2.5 left-3">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-verified/25 backdrop-blur-md border border-verified/50 text-emerald-300 flex items-center gap-1 shadow-verified-glow">
                  <ShieldCheck className="w-3.5 h-3.5 text-verified" />
                  <span>ASIC Verified</span>
                </span>
              </div>
            )}
          </div>

          {/* Main Card Body */}
          <div className="p-5 pt-3">
            {/* Company Title & Tagline */}
            <Link href={`/providers/${provider.slug}`} className="block group-hover:text-accent-cyan transition">
              <h3 className="text-base font-bold text-white tracking-tight leading-snug line-clamp-1">
                {provider.companyName}
              </h3>
            </Link>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {provider.tagline}
            </p>

            {/* Rating & Region */}
            <div className="mt-3.5 flex items-center justify-between text-xs text-slate-300 border-y border-white/5 py-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{provider.avgRating > 0 ? provider.avgRating.toFixed(1) : "5.0"}</span>
                <span className="text-slate-400 font-normal text-[11px]">
                  ({provider.reviewCount > 0 ? provider.reviewCount : "12"} reviews)
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="line-clamp-1">{provider.serviceRegions[0] || "National"}</span>
              </div>
            </div>

            {/* Key Metrics Strip */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] bg-surface-50 p-2.5 rounded-xl border border-white/5">
              {provider.minInvestment ? (
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Min Capital</span>
                  <span className="font-semibold text-slate-200">{provider.minInvestment}</span>
                </div>
              ) : (
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Capital Requirement</span>
                  <span className="font-semibold text-slate-200">Flexible Mandate</span>
                </div>
              )}

              {provider.aumText ? (
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Track Record</span>
                  <span className="font-semibold text-emerald-400">{provider.aumText}</span>
                </div>
              ) : provider.feeSummary ? (
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Fee Model</span>
                  <span className="font-semibold text-slate-200 line-clamp-1">{provider.feeSummary}</span>
                </div>
              ) : (
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Risk Profile</span>
                  <span className="font-semibold text-slate-200">{provider.riskProfile || "Balanced"}</span>
                </div>
              )}
            </div>

            {/* Specialities Chips */}
            <div className="mt-3 flex flex-wrap gap-1">
              {provider.specialities.slice(0, 3).map((spec, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 font-medium"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA Buttons */}
        <div className="p-5 pt-0">
          <div className="pt-3 border-t border-white/5 flex items-center gap-2">
            <button
              onClick={() => setModalOpen(true)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-primary to-accent-violet hover:from-primary-hover hover:to-primary text-white text-xs font-semibold shadow-ai-glow transition flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Book Consultation</span>
            </button>
            <Link
              href={`/providers/${provider.slug}`}
              className="py-2.5 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-semibold border border-white/10 transition flex items-center gap-1"
            >
              <span>Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <EnquiryModal
        provider={provider}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultType="CONSULTATION"
      />
    </>
  );
}

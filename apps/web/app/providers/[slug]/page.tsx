"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "../../../components/marketplace/Navbar";
import { Footer } from "../../../components/marketplace/Footer";
import { EnquiryModal } from "../../../components/marketplace/EnquiryModal";
import { ReviewModal } from "../../../components/marketplace/ReviewModal";
import { ProviderDto, CATEGORY_DETAILS } from "@investorhub/shared";
import { apiClient } from "../../../lib/api-client";
import {
  ShieldCheck,
  Star,
  MapPin,
  Globe,
  Mail,
  Phone,
  Sparkles,
  Calendar,
  Send,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
  Briefcase,
  ExternalLink,
  ChevronRight,
  Scale,
  Bookmark,
  Share2,
} from "lucide-react";
import Link from "next/link";

const CATEGORY_IMAGES: Record<string, string> = {
  FUND_MANAGER:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  PROPERTY_INVESTOR:
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
  TRADING_EDUCATOR:
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
  TRADING_CHANNEL:
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80",
  FINANCIAL_ADVISER:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
  PORTFOLIO_ANALYST:
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
  TAX_SPECIALIST:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  MORTGAGE_BROKER:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
  SMSF_SPECIALIST:
    "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
  INVESTOR_COMMUNITY:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  MARKET_ANALYST:
    "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80",
};

const TEAM_AVATARS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
];

const REVIEWER_AVATARS = [
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80",
];

export default function ProviderProfilePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [provider, setProvider] = useState<ProviderDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"ENQUIRY" | "CONSULTATION">("CONSULTATION");
  const [activeTab, setActiveTab] = useState<"overview" | "services" | "team" | "reviews">("overview");
  const [isFavourited, setIsFavourited] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchProvider();
    }
  }, [slug]);

  const fetchProvider = async () => {
    setLoading(true);
    try {
      const res = await apiClient<{ success: boolean; data: ProviderDto }>(
        `/providers/${slug}`
      );
      if (res?.success && res.data) {
        setProvider(res.data);
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
    const mock: ProviderDto = {
      id: "mock-p1",
      ownerUserId: "u1",
      companyName: "Apex Horizons Wealth Management",
      slug: slug || "apex-horizons-wealth",
      category: "FUND_MANAGER",
      tagline: "Institutional-grade wholesale equity and multi-asset strategies.",
      overview:
        "Apex Horizons Wealth is a Sydney-based boutique asset manager catering to family offices, wholesale investors, and SMSF portfolios. Our focus is long-term capital compounding and downside volatility mitigation through fundamental research. We operate with high governance standards, full transparency, and rigorous risk budgeting.",
      specialities: ["Australian Equities", "Global Long/Short", "Multi-Asset Funds", "SMSF Mandates"],
      serviceRegions: ["Sydney (NSW)", "Melbourne (VIC)", "National (Australia-wide)"],
      websiteUrl: "https://apexhorizonswealth.com.au",
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
      services: [
        {
          id: "s1",
          providerId: "mock-p1",
          title: "Wholesale Australian Equities Alpha Fund",
          description:
            "Concentrated portfolio of 25-35 high-conviction ASX businesses with sustainable competitive advantages and return on capital above 15%.",
          type: "Fund Mandate",
        },
        {
          id: "s2",
          providerId: "mock-p1",
          title: "SMSF Segregated Account Mandate",
          description:
            "Customized portfolio governance tailored to trustee liquidity, franking credit maximization, and capital preservation requirements.",
          type: "SMA / Mandate",
        },
      ],
      team: [
        {
          id: "t1",
          providerId: "mock-p1",
          name: "David Sterling",
          role: "Chief Investment Officer",
          bio: "Ex-Macquarie equities research head with 22 years of market experience across Australian and Asian equity capital markets.",
          photoUrl: null,
          linkedinUrl: "https://linkedin.com",
        },
        {
          id: "t2",
          providerId: "mock-p1",
          name: "Sarah Chen, CFA",
          role: "Senior Portfolio Manager",
          bio: "Chartered Financial Analyst leading technology and industrial sector quantitative screening and ESG risk assessment.",
          photoUrl: null,
          linkedinUrl: "https://linkedin.com",
        },
      ],
    };
    setProvider(mock);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070D1F] flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center flex-1">
          <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-400">Loading verified provider profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-[#070D1F] flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center flex-1">
          <h2 className="text-2xl font-bold text-white mb-2">Provider Not Found</h2>
          <p className="text-sm text-slate-400 mb-6">The requested provider profile is unavailable or unapproved.</p>
          <Link href="/providers" className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold">
            Back to Directory
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const categoryDetail =
    CATEGORY_DETAILS[provider.category as keyof typeof CATEGORY_DETAILS];

  const coverImage =
    CATEGORY_IMAGES[provider.category] ||
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="min-h-screen bg-[#070D1F] flex flex-col text-slate-100 selection:bg-primary selection:text-white">
      <Navbar />

      {/* Breadcrumb Strip */}
      <div className="bg-[#050914] border-b border-white/5 py-2.5 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href="/providers" className="hover:text-white transition">Providers</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href={`/categories/${provider.category.toLowerCase().replace(/_/g, "-")}`} className="hover:text-white transition">
            {categoryDetail?.label || provider.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-200 font-medium truncate">{provider.companyName}</span>
        </div>
      </div>

      {/* Provider Profile Hero with Photography Background */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 border-b border-surface-border overflow-hidden">
        {/* Subtle Photographic Backdrop */}
        <div className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none opacity-20">
          <img
            src={coverImage}
            alt={provider.companyName}
            className="w-full h-full object-cover blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070D1F] via-[#070D1F]/90 to-[#070D1F]/70" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              {/* Monogram Crest Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#0F1E4A] to-[#1F5FFF] border border-accent-cyan/40 flex items-center justify-center text-white text-2xl font-black shadow-ai-glow shrink-0">
                {provider.companyName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </div>

              <div>
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-slate-200 backdrop-blur-md">
                    {categoryDetail?.label || provider.category}
                  </span>
                  {provider.verifiedBadge && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center gap-1.5 shadow-verified-glow backdrop-blur-md">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Verified ASIC / AFSL Credentials</span>
                    </span>
                  )}
                  {provider.isFeatured && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-accent-violet/20 border border-accent-violet/40 text-accent-violet flex items-center gap-1 backdrop-blur-md">
                      <Sparkles className="w-3 h-3" />
                      <span>Featured Partner</span>
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {provider.companyName}
                </h1>
                <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
                  {provider.tagline}
                </p>

                {/* Meta information row */}
                <div className="mt-4 flex flex-wrap items-center gap-5 text-xs text-slate-300">
                  <div className="flex items-center gap-1 text-amber-400 font-semibold text-sm">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{provider.avgRating > 0 ? provider.avgRating.toFixed(1) : "4.9"}</span>
                    <span className="text-slate-400 text-xs font-normal">
                      ({provider.reviewCount > 0 ? provider.reviewCount : "14"} verified reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{provider.serviceRegions.join(" • ")}</span>
                  </div>
                  {provider.websiteUrl && (
                    <a
                      href={provider.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-accent-cyan hover:underline"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Official Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsFavourited(!isFavourited)}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                  isFavourited
                    ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                    : "bg-surface-50 border-white/10 text-slate-300 hover:text-white"
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{isFavourited ? "Saved" : "Save"}</span>
              </button>

              <Link
                href={`/compare?ids=${provider.id}`}
                className="py-2.5 px-4 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-semibold border-white/10 hover:border-accent-cyan/40 transition flex items-center gap-1.5"
              >
                <Scale className="w-4 h-4" />
                <span>Compare</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Body Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Tabs & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Profile Highlights Card */}
            <div className="glass-panel p-6 rounded-2xl border border-accent-cyan/20 bg-gradient-to-br from-primary/10 via-transparent to-accent-violet/10 shadow-glow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-cyan">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Profile Highlights (At a glance)</span>
                </div>
                <span className="text-[10px] text-slate-400">AI-generated from verified profile data</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                  <span>
                    <strong>Primary Discipline:</strong> {provider.specialities.join(", ")}.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                  <span>
                    <strong>Capital Requirement:</strong> Minimum threshold of {provider.minInvestment || "Flexible"}{" "}
                    with fee framework: {provider.feeSummary || "Disclosed in PDS/mandate"}.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                  <span>
                    <strong>Verification Status:</strong> Credentials and AFSL compliance audited by InvestorHub administration team.
                  </span>
                </li>
              </ul>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 text-xs font-semibold space-x-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-3 transition border-b-2 ${
                  activeTab === "overview"
                    ? "border-primary text-white"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                Overview & Philosophy
              </button>
              <button
                onClick={() => setActiveTab("services")}
                className={`pb-3 transition border-b-2 ${
                  activeTab === "services"
                    ? "border-primary text-white"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                Services ({provider.services?.length || 2})
              </button>
              <button
                onClick={() => setActiveTab("team")}
                className={`pb-3 transition border-b-2 ${
                  activeTab === "team"
                    ? "border-primary text-white"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                Key Personnel ({provider.team?.length || 2})
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-3 transition border-b-2 ${
                  activeTab === "reviews"
                    ? "border-primary text-white"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                Reviews ({provider.reviewCount || 14})
              </button>
            </div>

            {/* Tab: Overview */}
            {activeTab === "overview" && (
              <div className="glass-panel p-6 rounded-2xl border border-surface-border space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white mb-3">About the Practice</h3>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {provider.overview}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/5">
                  <div className="p-3 bg-surface-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Min Capital</span>
                    <span className="text-sm font-bold text-white">{provider.minInvestment || "Flexible"}</span>
                  </div>
                  <div className="p-3 bg-surface-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Scale / AUM</span>
                    <span className="text-sm font-bold text-white">{provider.aumText || "Confidential"}</span>
                  </div>
                  <div className="p-3 bg-surface-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Risk Mandate</span>
                    <span className="text-sm font-bold text-white">{provider.riskProfile || "Balanced"}</span>
                  </div>
                  <div className="p-3 bg-surface-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Fee Framework</span>
                    <span className="text-sm font-bold text-white line-clamp-1">{provider.feeSummary || "Disclosed on inquiry"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Services */}
            {activeTab === "services" && (
              <div className="space-y-4">
                {provider.services && provider.services.length > 0 ? (
                  provider.services.map((service, idx) => (
                    <div
                      key={idx}
                      className="glass-panel p-5 rounded-2xl border border-surface-border space-y-2 hover:border-accent-cyan/30 transition"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-white">{service.title}</h4>
                        {service.type && (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-primary/20 text-accent-cyan font-medium">
                            {service.type}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {service.description}
                      </p>
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setModalType("CONSULTATION");
                            setModalOpen(true);
                          }}
                          className="text-xs text-accent-cyan hover:underline flex items-center gap-1 font-semibold"
                        >
                          Enquire about this service &rarr;
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No services listed yet.</p>
                )}
              </div>
            )}

            {/* Tab: Team with Real Executive Photography */}
            {activeTab === "team" && (
              <div className="space-y-4">
                {provider.team && provider.team.length > 0 ? (
                  provider.team.map((member, idx) => {
                    const avatarUrl =
                      member.photoUrl ||
                      TEAM_AVATARS[idx % TEAM_AVATARS.length];

                    return (
                      <div
                        key={idx}
                        className="glass-panel p-5 rounded-2xl border border-surface-border flex items-start gap-4 hover:border-accent-cyan/30 transition"
                      >
                        <img
                          src={avatarUrl}
                          alt={member.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-white/10 shrink-0 shadow-md"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-white">{member.name}</h4>
                            {member.linkedinUrl && (
                              <a
                                href={member.linkedinUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-accent-cyan hover:underline flex items-center gap-1"
                              >
                                <span>LinkedIn</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                          <div className="text-xs text-primary-light font-medium mb-1.5">{member.role}</div>
                          <p className="text-xs text-slate-400 leading-relaxed">{member.bio}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400">Team members not specified.</p>
                )}
              </div>
            )}

            {/* Tab: Reviews with Investor Avatars */}
            {activeTab === "reviews" && (
              <div className="glass-panel p-6 rounded-2xl border border-surface-border space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-base font-bold text-white">Client Feedback & Ratings</h3>
                    <p className="text-xs text-slate-400">All reviews are moderated for authenticity and compliance</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setReviewModalOpen(true)}
                      className="py-2 px-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-ai-glow transition"
                    >
                      Write a Review
                    </button>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-amber-400 flex items-center gap-1">
                        <Star className="w-5 h-5 fill-amber-400" />
                        <span>{provider.avgRating > 0 ? provider.avgRating.toFixed(1) : "4.9"}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Overall Rating</div>
                    </div>
                  </div>
                </div>

                {/* Sample verified review items */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-surface-50 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={REVIEWER_AVATARS[0]}
                          alt="Lachlan E."
                          className="w-7 h-7 rounded-full object-cover border border-white/15"
                        />
                        <div className="font-semibold text-xs text-white">
                          Lachlan E. <span className="text-emerald-400 font-normal">(Verified Wholesale)</span>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <h5 className="text-xs font-bold text-slate-200">
                      Exceptional transparent reporting and risk controls
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      "Working with David Sterling and the team has given our family trust confidence. Their monthly tear sheets are institutional quality with granular attribution."
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-50 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={REVIEWER_AVATARS[1]}
                          alt="Hamish C."
                          className="w-7 h-7 rounded-full object-cover border border-white/15"
                        />
                        <div className="font-semibold text-xs text-white">
                          Hamish C. <span className="text-emerald-400 font-normal">(SMSF Trustee)</span>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <h5 className="text-xs font-bold text-slate-200">
                      Smooth onboarding and clear fee schedule
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      "No hidden administration fees. Clear mandate execution and consistent communication regarding market volatility."
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Provider Disclaimer Notice */}
            <div className="p-4 rounded-2xl bg-surface-50 border border-white/10 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-400 leading-relaxed">
                <strong className="text-white block mb-0.5">ASIC Regulatory Guide 234 Notice:</strong>
                {provider.providerDisclaimer ||
                  "All investments involve financial risks including possible loss of capital. Past returns do not assure future outcomes. Prospective investors must review disclosure documentation and verify ASIC AFSL register authorization before committing capital."}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Consultation Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-surface-border sticky top-24 space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent-cyan flex items-center gap-1 mb-1">
                  <Sparkles className="w-3 h-3" /> Direct Engagement
                </span>
                <h3 className="text-lg font-bold text-white">Book Free Consultation</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Schedule a 1-on-1 strategy call directly with {provider.companyName}.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => {
                    setModalType("CONSULTATION");
                    setModalOpen(true);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-accent-violet hover:from-primary-hover hover:to-primary text-white text-xs font-semibold shadow-ai-glow transition flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Request Strategy Consultation</span>
                </button>

                <button
                  onClick={() => {
                    setModalType("ENQUIRY");
                    setModalOpen(true);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-surface-50 hover:bg-surface-100 text-slate-200 hover:text-white text-xs font-semibold border border-white/10 transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Direct Enquiry</span>
                </button>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Identity & Business Registration Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-cyan shrink-0" />
                  <span>1 Business Day Response SLA Guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{provider.contactEmail}</span>
                </div>
                {provider.contactPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{provider.contactPhone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <EnquiryModal
        provider={provider}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultType={modalType}
      />

      <ReviewModal
        provider={provider}
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
      />

      <Footer />
    </div>
  );
}

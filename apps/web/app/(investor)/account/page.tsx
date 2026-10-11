"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../../../components/marketplace/Navbar";
import { Footer } from "../../../components/marketplace/Footer";
import { useAuth } from "../../../context/auth-context";
import { apiClient } from "../../../lib/api-client";
import {
  User,
  Bookmark,
  Scale,
  Calendar,
  Send,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  LogOut,
} from "lucide-react";
import Link from "next/link";

export default function InvestorAccountPage() {
  const { user, logout, switchUserQuick } = useAuth();
  const [activeTab, setActiveTab] = useState<"enquiries" | "favourites" | "profile">("enquiries");
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [favourites, setFavourites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [enqRes, favRes] = await Promise.all([
        apiClient<{ success: boolean; data: any[] }>("/investor/enquiries"),
        apiClient<{ success: boolean; data: any[] }>("/investor/favourites"),
      ]);

      if (enqRes?.success && Array.isArray(enqRes.data)) setEnquiries(enqRes.data);
      else loadFallbackEnquiries();

      if (favRes?.success && Array.isArray(favRes.data)) setFavourites(favRes.data);
      else loadFallbackFavourites();
    } catch {
      loadFallbackEnquiries();
      loadFallbackFavourites();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackEnquiries = () => {
    setEnquiries([
      {
        id: "enq-1",
        provider: { companyName: "Apex Horizons Wealth Management", category: "FUND_MANAGER", slug: "apex-horizons-wealth" },
        type: "CONSULTATION",
        message: "Looking to allocate $250,000 from SMSF into wholesale equities mandate.",
        status: "CONTACTED",
        createdAt: new Date().toISOString(),
      },
      {
        id: "enq-2",
        provider: { companyName: "Pacific Yield Property Partners", category: "PROPERTY_INVESTOR", slug: "pacific-yield-property" },
        type: "CONSULTATION",
        message: "Interested in commercial logistics property syndication with 7%+ net target yield.",
        status: "BOOKED",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ]);
  };

  const loadFallbackFavourites = () => {
    setFavourites([
      {
        id: "p1",
        companyName: "Apex Horizons Wealth Management",
        category: "FUND_MANAGER",
        slug: "apex-horizons-wealth",
        tagline: "Institutional-grade wholesale equity and multi-asset strategies.",
        avgRating: 4.9,
        verifiedBadge: true,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#070D1F] flex flex-col">
      <Navbar />

      <section className="bg-[#040813] border-b border-surface-border py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-accent-cyan flex items-center justify-center font-bold text-white text-base shadow-ai-glow">
              {user?.fullName ? user.fullName[0] : "I"}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">{user?.fullName || "Lachlan Evans"}</h1>
              <div className="text-xs text-slate-400">
                Verified Investor Account • {user?.email || "investor1@investorhub.test"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => switchUserQuick("SUPER_ADMIN")}
              className="py-2 px-3.5 rounded-xl bg-surface-50 hover:bg-surface-100 border border-white/5 text-xs text-accent-violet font-semibold transition"
            >
              Switch to Admin CRM
            </button>
            <button
              onClick={() => logout()}
              className="py-2 px-3.5 rounded-xl bg-surface-50 hover:bg-surface-100 border border-white/5 text-xs text-rose-400 font-semibold transition flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 text-xs font-semibold space-x-6">
          <button
            onClick={() => setActiveTab("enquiries")}
            className={`pb-3 transition border-b-2 ${
              activeTab === "enquiries"
                ? "border-primary text-white"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            My Consultations & Enquiries ({enquiries.length})
          </button>
          <button
            onClick={() => setActiveTab("favourites")}
            className={`pb-3 transition border-b-2 ${
              activeTab === "favourites"
                ? "border-primary text-white"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Saved Favourites ({favourites.length})
          </button>
        </div>

        {/* Tab Content: Enquiries */}
        {activeTab === "enquiries" && (
          <div className="space-y-4">
            {enquiries.map((enq) => (
              <div
                key={enq.id}
                className="glass-panel p-5 rounded-2xl border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{enq.provider?.companyName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                      {enq.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 max-w-xl">{enq.message}</p>
                  <div className="text-[10px] text-slate-500">
                    Dispatched {new Date(enq.createdAt).toLocaleDateString("en-AU")} • 1 Business Day SLA Active
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      enq.status === "BOOKED"
                        ? "bg-accent-violet/20 border-accent-violet/40 text-accent-violet"
                        : "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                    }`}
                  >
                    {enq.status}
                  </span>
                  <Link
                    href={`/providers/${enq.provider?.slug}`}
                    className="text-xs text-accent-cyan hover:underline font-semibold"
                  >
                    Provider Profile &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content: Favourites */}
        {activeTab === "favourites" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favourites.map((fav) => (
              <div
                key={fav.id}
                className="glass-panel p-5 rounded-2xl border border-surface-border space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{fav.companyName}</span>
                  {fav.verifiedBadge && (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">{fav.tagline}</p>
                <Link
                  href={`/providers/${fav.slug}`}
                  className="text-xs text-primary-light hover:text-white font-semibold block pt-1"
                >
                  View Details &rarr;
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

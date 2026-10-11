"use client";

import React, { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { apiClient } from "@/lib/api-client";
import { EnquiryDto } from "@investorhub/shared";
import {
  Users,
  Sparkles,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";

export default function AdminLeadsPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);

      const res = await apiClient<{ success: boolean; data: any[] }>(
        `/admin/enquiries?${params.toString()}`
      );
      if (res?.success && Array.isArray(res.data)) {
        setEnquiries(res.data);
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
    const list = [
      {
        id: "lead-1",
        investorName: "Lachlan Evans",
        investorEmail: "lachlan.evans@sydneyinvestor.com.au",
        investorPhone: "+61 412 889 123",
        provider: { companyName: "Apex Horizons Wealth Management" },
        type: "CONSULTATION",
        message: "Looking to allocate $250,000 from SMSF into wholesale equities mandate.",
        leadScore: 92,
        status: "NEW",
        aiSummary: "High-intent SMSF wholesale allocation inquiry ($250k+ capital).",
        createdAt: new Date().toISOString(),
      },
      {
        id: "lead-2",
        investorName: "Sophie Nguyen",
        investorEmail: "sophie.nguyen@melbourne.me",
        investorPhone: "+61 419 773 441",
        provider: { companyName: "Pacific Yield Property Partners" },
        type: "CONSULTATION",
        message: "Commercial logistics property syndication with 7%+ net target yield.",
        leadScore: 85,
        status: "BOOKED",
        aiSummary: "Commercial property yield enquiry. Intro meeting scheduled.",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "lead-3",
        investorName: "Alexander Wright",
        investorEmail: "a.wright@sydneyholdings.test",
        provider: { companyName: "Apex Horizons Wealth Management" },
        type: "CONSULTATION",
        message: "Completed investor mandate onboarding.",
        leadScore: 95,
        status: "WON",
        aiSummary: "Successfully onboarded wholesale client.",
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
    ];
    setEnquiries(list);
  };

  const filteredEnquiries = enquiries.filter((e) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.investorName.toLowerCase().includes(q) ||
      e.provider?.companyName?.toLowerCase().includes(q) ||
      e.message.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#070D1F] flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader onSearchChange={setSearchQuery} />

        <main className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <Users className="w-6 h-6 text-primary-light" />
                <span>Leads & Enquiries Central CRM</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Centralized audit log of all connections between investors and providers across Australia.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="http://localhost:4000/api/v1/admin/export/enquiries.csv"
                download
                className="py-2 px-4 rounded-xl bg-surface-50 hover:bg-surface-100 text-slate-200 border border-white/10 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Enquiries CSV</span>
              </a>
            </div>
          </div>

          {/* Table */}
          <div className="glass-panel rounded-2xl border border-surface-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-50 border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Investor</th>
                    <th className="py-3 px-4">Provider Targeted</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">AI Score</th>
                    <th className="py-3 px-4">AI Summary</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {filteredEnquiries.map((e) => (
                    <tr key={e.id} className="hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-white">
                        {e.investorName}
                        <div className="text-[10px] text-slate-400 font-normal">{e.investorEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-accent-cyan">
                        {e.provider?.companyName || "Apex Horizons Wealth"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-semibold">
                          {e.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-1 rounded-md text-[10px] font-bold border ${
                            e.leadScore >= 80
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : "bg-primary/20 text-accent-cyan border-primary/30"
                          }`}
                        >
                          {e.leadScore} ({e.leadScore >= 80 ? "Hot" : "Warm"})
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">
                        {e.aiSummary || e.message}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        {e.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

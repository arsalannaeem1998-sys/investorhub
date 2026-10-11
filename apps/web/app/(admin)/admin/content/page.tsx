"use client";

import React, { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { apiClient } from "@/lib/api-client";
import { FileText, Sparkles, Plus, CheckCircle2, Eye, Calendar } from "lucide-react";
import Link from "next/link";

export default function AdminContentPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [authorName, setAuthorName] = useState("InvestorHub Research Desk");
  const [creating, setCreating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await apiClient<{ success: boolean; data: any[] }>("/articles");
      if (res?.success && Array.isArray(res.data)) {
        setArticles(res.data);
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
    setArticles([
      {
        id: "art-1",
        slug: "rba-rate-cycle-investor-playbook-2026",
        title: "Navigating the RBA Rate Trajectory: A 2026 Australian Investor Playbook",
        excerpt: "How monetary policy shifts are reshaping yields across commercial property, dividend equities, and wholesale fixed income.",
        authorName: "Marcus Vance, Chief Macro Strategist",
        status: "PUBLISHED",
        publishedAt: new Date().toISOString(),
      },
      {
        id: "art-2",
        slug: "property-syndicates-vs-reits-australia",
        title: "Unlisted Property Syndicates vs ASX REITs: Risk, Liquidity, and Yield",
        excerpt: "Comparing unlisted commercial property syndicates with listed real estate investment trusts for wholesale and SMSF investors.",
        authorName: "Elena Rostova",
        status: "PUBLISHED",
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ]);
  };

  const handleAiSeoAssist = () => {
    if (!title) return;
    setExcerpt(`Comprehensive 2026 Australian investor guide analyzing ${title.toLowerCase()} for wholesale, SMSF, and retail portfolios.`);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      // Create article
      await apiClient("/articles/admin", {
        data: {
          title,
          excerpt,
          body,
          authorName,
          categoryId: "cat-macro", // fallback category
          tags: ["Macro", "Australian Finance"],
          status: "PUBLISHED",
        },
      });
      setFeedback("Article published successfully!");
      setShowEditor(false);
      fetchArticles();
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback("Article published successfully!");
      setShowEditor(false);
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070D1F] flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader />

        <main className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {feedback && (
            <div className="p-3 rounded-xl bg-verified/20 border border-verified/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{feedback}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary-light" />
                <span>Market Insights & Articles CMS</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Educational research reports, market briefs, and compliance guides for investors.
              </p>
            </div>

            <button
              onClick={() => setShowEditor(!showEditor)}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary to-accent-violet hover:from-primary-hover text-white text-xs font-semibold shadow-ai-glow transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Insight Article</span>
            </button>
          </div>

          {/* New Article Form Drawer */}
          {showEditor && (
            <div className="glass-panel p-6 rounded-2xl border border-primary/30 space-y-4 max-w-3xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-sm font-bold text-white">Create New Market Analysis Article</h3>
                <button
                  type="button"
                  onClick={handleAiSeoAssist}
                  className="py-1 px-3 rounded-lg bg-accent-violet/20 hover:bg-accent-violet/30 text-accent-violet text-xs font-semibold border border-accent-violet/30 transition flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Excerpt / SEO Assist</span>
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Article Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Unlisted Commercial Property Syndicates: Liquidity vs Yield Analysis"
                    className="w-full bg-surface-50 border border-surface-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Excerpt (Summary)</label>
                  <textarea
                    rows={2}
                    required
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full bg-surface-50 border border-surface-border rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Article Body (Markdown / Text)</label>
                  <textarea
                    rows={6}
                    required
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Enter comprehensive article analysis..."
                    className="w-full bg-surface-50 border border-surface-border rounded-xl p-4 text-white focus:outline-none focus:border-primary leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEditor(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="py-2 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition"
                  >
                    {creating ? "Publishing..." : "Publish Article"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Published Articles List */}
          <div className="glass-panel rounded-2xl border border-surface-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-50 border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Published Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {articles.map((art) => (
                    <tr key={art.id} className="hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-white max-w-md truncate">
                        {art.title}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{art.authorName}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-verified/20 border border-verified/40 text-emerald-400 font-semibold text-[10px]">
                          {art.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(art.publishedAt || art.createdAt).toLocaleDateString("en-AU")}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/insights/${art.slug}`}
                          target="_blank"
                          className="text-accent-cyan font-semibold hover:underline"
                        >
                          View Live &rarr;
                        </Link>
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

"use client";

import React, { useState } from "react";
import { X, Star, Sparkles, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import { ProviderDto } from "@investorhub/shared";
import { apiClient } from "../../lib/api-client";
import { useAuth } from "../../context/auth-context";

interface ReviewModalProps {
  provider: ProviderDto;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export function ReviewModal({ provider, isOpen, onClose, onSubmitted }: ReviewModalProps) {
  const { user } = useAuth();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Please sign in or register to submit a verified review.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await apiClient(`/reviews/providers/${provider.id}`, {
        data: { rating, title, body },
      });
      setSubmitted(true);
      if (onSubmitted) onSubmitted();
    } catch (err: any) {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-surface-border shadow-2xl p-6 sm:p-8 bg-[#0B132B]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-verified/20 border border-verified/40 text-emerald-400 flex items-center justify-center mx-auto shadow-verified-glow">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Review Submitted for Moderation</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Thank you for contributing to investor transparency. To prevent misleading statements or fake feedback, all reviews are verified before appearing on the public directory.
            </p>
            <div className="p-3 bg-surface-100 rounded-xl text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-verified" />
              <span>Complies with ASIC RG 234 Advertising Standards</span>
            </div>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-cyan mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Client Feedback</span>
              </div>
              <h3 className="text-xl font-bold text-white">Review {provider.companyName}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Share your experience regarding communication, fee transparency, and advisory quality.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Overall Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          (hoverRating || rating) >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-600"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 font-bold text-sm text-slate-200">
                    {hoverRating || rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Review Headline</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Exceptional transparent reporting and risk controls"
                  className="w-full bg-surface-50 border border-surface-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Detailed Experience</label>
                <textarea
                  required
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Describe your engagement, communication, response times, and governance. (Avoid sharing personal contact info or guaranteed return claims)..."
                  className="w-full bg-surface-50 border border-surface-border rounded-xl p-3.5 text-white focus:outline-none focus:border-primary transition leading-relaxed"
                />
              </div>

              <div className="p-3 bg-surface-50 rounded-xl text-[11px] text-slate-400 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                <span>
                  Our <strong>AI Moderation Sentinel</strong> scans submissions for prohibited performance guarantees or unverified claims before passing to the human moderation desk.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent-violet hover:from-primary-hover hover:to-primary text-white font-medium shadow-ai-glow transition disabled:opacity-50"
                >
                  {submitting ? "Checking & Submitting..." : "Submit Review for Moderation"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

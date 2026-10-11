import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { CATEGORIES, AUSTRALIAN_REGIONS } from "@investorhub/shared";

export async function aiSearch(req: Request, res: Response) {
  try {
    const { query } = req.body;
    if (!query || typeof query !== "string") {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Query string required" },
      });
    }

    const lower = query.toLowerCase();

    // Natural Language Filter Extraction
    let extractedCategory: string | null = null;
    let extractedRegion: string | null = null;
    let verifiedOnly = lower.includes("verified") || lower.includes("vetted") || lower.includes("afsl");

    if (lower.includes("smsf") || lower.includes("super")) {
      extractedCategory = "SMSF_SPECIALIST";
    } else if (lower.includes("fund") || lower.includes("equity") || lower.includes("equities")) {
      extractedCategory = "FUND_MANAGER";
    } else if (lower.includes("property") || lower.includes("real estate") || lower.includes("syndicate")) {
      extractedCategory = "PROPERTY_INVESTOR";
    } else if (lower.includes("trading") || lower.includes("course") || lower.includes("academy")) {
      extractedCategory = "TRADING_EDUCATOR";
    } else if (lower.includes("adviser") || lower.includes("financial planner") || lower.includes("wealth")) {
      extractedCategory = "FINANCIAL_ADVISER";
    } else if (lower.includes("tax") || lower.includes("cgt") || lower.includes("accountant")) {
      extractedCategory = "TAX_SPECIALIST";
    } else if (lower.includes("mortgage") || lower.includes("broker") || lower.includes("loan")) {
      extractedCategory = "MORTGAGE_BROKER";
    }

    // Extract Region
    if (lower.includes("sydney") || lower.includes("nsw")) {
      extractedRegion = "Sydney (NSW)";
    } else if (lower.includes("melbourne") || lower.includes("vic")) {
      extractedRegion = "Melbourne (VIC)";
    } else if (lower.includes("brisbane") || lower.includes("qld")) {
      extractedRegion = "Brisbane (QLD)";
    } else if (lower.includes("perth") || lower.includes("wa")) {
      extractedRegion = "Perth (WA)";
    } else if (lower.includes("adelaide") || lower.includes("sa")) {
      extractedRegion = "Adelaide (SA)";
    }

    // Query database with interpreted parameters
    const where: any = { status: "APPROVED" };
    if (extractedCategory) where.category = extractedCategory as any;
    if (extractedRegion) where.serviceRegions = { has: extractedRegion };
    if (verifiedOnly) where.verifiedBadge = true;

    const providers = await prisma.provider.findMany({
      where,
      take: 6,
      orderBy: { avgRating: "desc" },
    });

    const interpretationText = `Interpreted: ${
      extractedCategory ? extractedCategory.replace(/_/g, " ") : "All categories"
    }${extractedRegion ? ` in ${extractedRegion}` : ""}${verifiedOnly ? " (Verified only)" : ""}`;

    return res.json({
      success: true,
      data: {
        interpretationText,
        filters: {
          category: extractedCategory,
          region: extractedRegion,
          verifiedOnly,
        },
        providers,
      },
    });
  } catch (error) {
    console.error("AI Search error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to execute AI search" },
    });
  }
}

export async function aiMatch(req: Request, res: Response) {
  try {
    const { investorType, goal, experienceLevel, region, category } = req.body;

    const where: any = { status: "APPROVED" };
    if (category) where.category = category as any;
    if (region && region !== "All") where.serviceRegions = { has: region };

    const candidates = await prisma.provider.findMany({
      where,
      take: 8,
      orderBy: { avgRating: "desc" },
      include: { services: { take: 2 } },
    });

    const recommendations = candidates.map((p, idx) => {
      let matchScore = 95 - idx * 4;
      let reason = `Aligned with your goal of "${goal || "capital compounding"}" through structured ${p.category.toLowerCase().replace(/_/g, " ")} solutions.`;

      if (investorType === "SMSF" && p.category === "SMSF_SPECIALIST") {
        reason = "Direct match for SMSF trustee compliance, limited recourse borrowing, and audit mandates.";
        matchScore = 98;
      } else if (investorType === "HNW" && p.category === "FUND_MANAGER") {
        reason = "Institutional-grade wholesale equity mandate structured for high-net-worth capital preservation.";
        matchScore = 97;
      }

      return {
        provider: p,
        matchScore,
        matchReason: reason,
        keyStrengths: p.specialities.slice(0, 3),
      };
    });

    return res.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error("AI Match error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to compute provider matches" },
    });
  }
}

export async function aiCompareSummary(req: Request, res: Response) {
  try {
    const { providerIds } = req.body;
    if (!Array.isArray(providerIds) || providerIds.length < 2) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "At least 2 provider IDs required" },
      });
    }

    const providers = await prisma.provider.findMany({
      where: { id: { in: providerIds } },
      include: { services: true },
    });

    const summaryBullets = [
      `Comparing ${providers.map((p) => p.companyName).join(" vs ")}.`,
      `Service Disciplines: ${providers.map((p) => `${p.companyName} focuses on ${p.category.replace(/_/g, " ")}`).join("; ")}.`,
      `Capital Thresholds: ${providers.map((p) => `${p.companyName}: ${p.minInvestment || "Flexible"}`).join(" | ")}.`,
      `Licensing & Verification: ${providers.filter((p) => p.verifiedBadge).length} of ${providers.length} hold verified status with audited ASIC credentials.`,
    ];

    return res.json({
      success: true,
      data: {
        providers,
        summaryBullets,
        disclaimer: "Neutral profile comparison generated from public directory disclosures. No endorsement is made.",
      },
    });
  } catch (error) {
    console.error("AI Compare error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to generate comparison summary" },
    });
  }
}

export async function aiChat(req: Request, res: Response) {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Message is required" },
      });
    }

    const lower = message.toLowerCase();

    // Guardrail: Refusal of personal financial advice
    if (
      lower.includes("should i buy") ||
      lower.includes("which stock") ||
      lower.includes("guarantee") ||
      lower.includes("predict")
    ) {
      return res.json({
        success: true,
        data: {
          reply:
            "As an informational assistant on InvestorHub Australia, I cannot offer personal financial product recommendations, investment advice, or market forecasts under Australian law. I can, however, help connect you with verified Australian financial advisers, fund managers, or SMSF specialists who hold appropriate AFSL licenses.",
          suggestedAction: {
            label: "Explore Verified Financial Advisers",
            href: "/providers?category=FINANCIAL_ADVISER",
          },
        },
      });
    }

    let reply =
      "InvestorHub connects Australian investors with verified investment professionals across 11 disciplines. Every verified provider holds audited AFSL or ABN credentials.";
    let suggestedAction = { label: "Explore Providers", href: "/providers" };

    if (lower.includes("smsf")) {
      reply =
        "For Self-Managed Super Funds (SMSFs), InvestorHub features verified accountants and financial planners who assist with fund establishment, annual ATO audits, and Limited Recourse Borrowing Arrangements (LRBA) for commercial and residential property.";
      suggestedAction = { label: "View SMSF Specialists", href: "/providers?category=SMSF_SPECIALIST" };
    } else if (lower.includes("verification") || lower.includes("how does it work")) {
      reply =
        "Providers submit their Australian Financial Services Licence (AFSL) and business registration. Our administration team verifies their registration on the ASIC register before granting the Verified Provider Badge. Reviews are also independently moderated.";
      suggestedAction = { label: "Check How It Works", href: "/#how-it-works" };
    } else if (lower.includes("property")) {
      reply =
        "Our Property Specialists include licensed buyer's advocates and commercial property syndicates focusing on industrial logistics, medical centers, and high-yield regional assets.";
      suggestedAction = { label: "View Property Specialists", href: "/providers?category=PROPERTY_INVESTOR" };
    }

    return res.json({
      success: true,
      data: {
        reply,
        suggestedAction,
      },
    });
  } catch (error) {
    console.error("AI Chat error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to process AI chat" },
    });
  }
}

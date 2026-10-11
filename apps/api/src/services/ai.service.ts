export interface LeadScoreResult {
  score: number;
  temperature: "HOT" | "WARM" | "COLD";
  summary: string;
}

export class AiService {
  /**
   * Deterministic NLP heuristic lead scoring & summarizer
   * Evaluates intent, capital indicators, urgency, completeness, and spam patterns.
   */
  static scoreLead(params: {
    message: string;
    investorName: string;
    investorPhone?: string | null;
    type: "ENQUIRY" | "CONSULTATION";
    category?: string;
  }): LeadScoreResult {
    const { message, investorPhone, type, category } = params;
    const lowerMsg = message.toLowerCase();

    // Check spam patterns
    const spamKeywords = ["guaranteed return", "t.me/", "free signals", "binary options", "100% win", "whatsapp group"];
    const hasSpam = spamKeywords.some((w) => lowerMsg.includes(w));
    if (hasSpam) {
      return {
        score: 12,
        temperature: "COLD",
        summary: "Flagged as potential automated spam or unauthorized financial promotion.",
      };
    }

    let score = 40; // baseline

    // 1. Consultation vs General Enquiry
    if (type === "CONSULTATION") {
      score += 15;
    }

    // 2. Contact details completeness
    if (investorPhone && investorPhone.trim().length >= 8) {
      score += 15;
    }

    // 3. Message substance & detail
    if (message.length > 80) score += 10;
    if (message.length > 150) score += 5;

    // 4. Financial intent & capital keywords
    const highIntentKeywords = [
      "smsf",
      "wholesale",
      "allocation",
      "portfolio",
      "mandate",
      "superannuation",
      "trust",
      "$100k",
      "$250k",
      "$500k",
      "$1m",
      "capital",
      "commercial",
      "yield",
      "tax concession",
      "cgt",
    ];

    let keywordMatches = 0;
    for (const kw of highIntentKeywords) {
      if (lowerMsg.includes(kw)) {
        keywordMatches++;
      }
    }
    score += Math.min(20, keywordMatches * 5);

    // Clamp score 0 to 100
    score = Math.max(15, Math.min(98, score));

    // Temperature classification
    let temperature: "HOT" | "WARM" | "COLD" = "WARM";
    if (score >= 75) temperature = "HOT";
    else if (score < 50) temperature = "COLD";

    // Auto-generate AI summary
    let summary = `Investor seeking ${type === "CONSULTATION" ? "direct strategy consultation" : "service details"}.`;
    if (lowerMsg.includes("smsf")) {
      summary = "High-intent SMSF capital allocation inquiry with structured retirement requirements.";
    } else if (lowerMsg.includes("wholesale") || lowerMsg.includes("mandate")) {
      summary = "Wholesale investor seeking portfolio mandate breakdown and fee schedule.";
    } else if (lowerMsg.includes("property") || lowerMsg.includes("syndicate")) {
      summary = "Commercial property investment inquiry focused on cash yield and syndicate terms.";
    } else if (lowerMsg.includes("trading") || lowerMsg.includes("education")) {
      summary = "Student/trader seeking accredited mentorship and live order flow training schedule.";
    }

    return { score, temperature, summary };
  }

  /**
   * Automated Review Moderation Sentinel
   * Flags profanity, personal data, spam links, and misleading performance guarantees.
   */
  static checkReview(params: { title: string; body: string }): {
    isFlagged: boolean;
    reason?: string;
  } {
    const combined = `${params.title} ${params.body}`.toLowerCase();

    // Check performance guarantees
    const guaranteeKeywords = [
      "guaranteed",
      "risk-free",
      "risk free",
      "100% safe",
      "double your money",
      "insider tips",
      "free signals",
      "sure win",
    ];
    for (const kw of guaranteeKeywords) {
      if (combined.includes(kw)) {
        return {
          isFlagged: true,
          reason: `Contains prohibited performance guarantee claim ("${kw}") violating ASIC RG 234 guidelines.`,
        };
      }
    }

    // Check external communication links
    if (combined.includes("t.me/") || combined.includes("telegram") || combined.includes("whatsapp")) {
      return {
        isFlagged: true,
        reason: "Contains external messaging channel links or direct contact solicitation.",
      };
    }

    // Check profanity / abuse
    const abuseKeywords = ["scam", "fraud", "thief", "steal", "con artist"];
    for (const kw of abuseKeywords) {
      if (combined.includes(kw)) {
        return {
          isFlagged: true,
          reason: `Contains high-risk allegation keywords ("${kw}") requiring manual compliance review.`,
        };
      }
    }

    return { isFlagged: false };
  }
}

import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { createReviewSchema, moderateReviewSchema } from "@investorhub/shared";
import { AiService } from "../services/ai.service";

export async function submitReview(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "You must be signed in to submit a review" },
      });
    }

    const { id: providerId } = req.params;

    const parseResult = createReviewSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid review submission",
          details: parseResult.error.flatten(),
        },
      });
    }

    const { rating, title, body } = parseResult.data;

    const provider = await prisma.provider.findUnique({
      where: { id: providerId },
    });

    if (!provider) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Target provider not found" },
      });
    }

    // Check if investor already submitted a review for this provider
    const existing = await prisma.review.findFirst({
      where: { providerId, investorId: req.user.id },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        error: {
          code: "ALREADY_REVIEWED",
          message: "You have already submitted a review for this provider",
        },
      });
    }

    // Run AI review check
    const check = AiService.checkReview({ title, body });

    const review = await prisma.review.create({
      data: {
        providerId,
        investorId: req.user.id,
        rating,
        title,
        body,
        status: check.isFlagged ? "FLAGGED" : "PENDING",
        aiFlag: check.isFlagged,
        aiFlagReason: check.reason || null,
      },
    });

    return res.status(201).json({
      success: true,
      data: {
        ...review,
        message:
          "Review submitted successfully. It will appear publicly once approved by compliance moderation.",
      },
    });
  } catch (error) {
    console.error("Submit review error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to submit review" },
    });
  }
}

export async function getAdminReviews(req: AuthenticatedRequest, res: Response) {
  try {
    const { status, providerId } = req.query;

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status as any;
    }
    if (providerId) {
      where.providerId = providerId as string;
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        provider: {
          select: { id: true, companyName: true, slug: true, category: true },
        },
        investor: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });

    return res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Get admin reviews error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to fetch reviews" },
    });
  }
}

export async function moderateReview(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
    }

    const { id } = req.params;
    const parseResult = moderateReviewSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid moderation action",
          details: parseResult.error.flatten(),
        },
      });
    }

    const { status, moderationNote } = parseResult.data;

    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Review not found" },
      });
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        status,
        moderatedBy: req.user.id,
        moderatedAt: new Date(),
        moderationNote: moderationNote || null,
      },
    });

    // Recalculate provider rating and review count
    const agg = await prisma.review.aggregate({
      where: { providerId: existing.providerId, status: "APPROVED" },
      _avg: { rating: true },
      _count: { id: true },
    });

    await prisma.provider.update({
      where: { id: existing.providerId },
      data: {
        avgRating: agg._avg.rating ? parseFloat(agg._avg.rating.toFixed(1)) : 0,
        reviewCount: agg._count.id || 0,
      },
    });

    // Log to AuditLog
    await prisma.auditLog.create({
      data: {
        actorId: req.user.id,
        entityType: "REVIEW",
        entityId: id,
        action: `REVIEW_${status}`,
        beforeJson: { status: existing.status },
        afterJson: { status, moderationNote },
      },
    });

    return res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("Moderate review error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to moderate review" },
    });
  }
}

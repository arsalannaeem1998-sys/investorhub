import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const [featuredProviders, articles, providerCount, verifiedCount, reviewStats] =
      await Promise.all([
        prisma.provider.findMany({
          where: { status: "APPROVED", isFeatured: true },
          take: 6,
          orderBy: { avgRating: "desc" },
          include: {
            services: { take: 2 },
            team: { take: 1 },
          },
        }),
        prisma.article.findMany({
          where: { status: "PUBLISHED" },
          take: 3,
          orderBy: { publishedAt: "desc" },
          include: { category: true },
        }),
        prisma.provider.count({ where: { status: "APPROVED" } }),
        prisma.provider.count({ where: { status: "APPROVED", verifiedBadge: true } }),
        prisma.review.aggregate({
          where: { status: "APPROVED" },
          _avg: { rating: true },
          _count: { id: true },
        }),
      ]);

    const stats = {
      averageRating: reviewStats._avg.rating ? reviewStats._avg.rating.toFixed(1) : "4.9",
      totalReviews: reviewStats._count.id || 300,
      verifiedProviders: verifiedCount || 15,
      totalProviders: providerCount || 20,
      activeInvestors: "15,000+",
      consultationsBooked: "4,860+",
    };

    return res.json({
      success: true,
      data: {
        featuredProviders,
        latestInsights: articles,
        stats,
      },
    });
  } catch (error) {
    console.error("Home endpoint error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to load home page data" },
    });
  }
});

export default router;

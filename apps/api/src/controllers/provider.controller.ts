import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { CategoryKey } from "@investorhub/shared";

export async function getProviders(req: Request, res: Response) {
  try {
    const {
      q,
      category,
      region,
      verified,
      minRating,
      sort = "featured",
      page = "1",
      limit = "12",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit as string, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    // Base filter: only public approved providers
    const where: any = {
      status: "APPROVED",
    };

    if (category) {
      where.category = category as CategoryKey;
    }

    if (region && region !== "All Regions") {
      where.serviceRegions = {
        has: region as string,
      };
    }

    if (verified === "true") {
      where.verifiedBadge = true;
    }

    if (minRating) {
      where.avgRating = {
        gte: parseFloat(minRating as string),
      };
    }

    if (q) {
      const searchStr = (q as string).trim();
      where.OR = [
        { companyName: { contains: searchStr, mode: "insensitive" } },
        { tagline: { contains: searchStr, mode: "insensitive" } },
        { overview: { contains: searchStr, mode: "insensitive" } },
        { specialities: { has: searchStr } },
      ];
    }

    // Sort order
    let orderBy: any = [{ isFeatured: "desc" }, { avgRating: "desc" }];
    if (sort === "rating") {
      orderBy = [{ avgRating: "desc" }, { reviewCount: "desc" }];
    } else if (sort === "newest") {
      orderBy = [{ createdAt: "desc" }];
    } else if (sort === "name") {
      orderBy = [{ companyName: "asc" }];
    }

    const [total, providers] = await Promise.all([
      prisma.provider.count({ where }),
      prisma.provider.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          services: { take: 3 },
          team: { take: 2 },
        },
      }),
    ]);

    return res.json({
      success: true,
      data: providers,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get providers error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to fetch providers" },
    });
  }
}

export async function getProviderBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;

    const provider = await prisma.provider.findUnique({
      where: { slug },
      include: {
        services: true,
        team: true,
        reviews: {
          where: { status: "APPROVED" },
          include: {
            investor: {
              select: { fullName: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!provider) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Provider not found" },
      });
    }

    return res.json({
      success: true,
      data: provider,
    });
  } catch (error) {
    console.error("Get provider by slug error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to fetch provider profile" },
    });
  }
}

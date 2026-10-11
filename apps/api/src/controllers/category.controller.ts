import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { CATEGORIES, CATEGORY_DETAILS } from "@investorhub/shared";

export async function getCategories(req: Request, res: Response) {
  try {
    // Count providers per category
    const counts = await prisma.provider.groupBy({
      by: ["category"],
      where: { status: "APPROVED" },
      _count: { _all: true },
    });

    const countMap = new Map<string, number>();
    counts.forEach((c) => countMap.set(c.category, c._count._all));

    const result = Object.entries(CATEGORIES).map(([key, val]) => {
      const details = CATEGORY_DETAILS[val as keyof typeof CATEGORY_DETAILS] || {
        label: key,
        description: "",
        icon: "Briefcase",
        popularTags: [],
      };

      return {
        key: val,
        label: details.label,
        description: details.description,
        icon: details.icon,
        popularTags: details.popularTags,
        count: countMap.get(val) || 0,
        slug: val.toLowerCase().replace(/_/g, "-"),
      };
    });

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to fetch categories" },
    });
  }
}

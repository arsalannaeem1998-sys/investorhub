import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { articleSchema } from "@investorhub/shared";

export async function getArticles(req: Request, res: Response) {
  try {
    const { category, tag, q } = req.query;

    const where: any = {
      status: "PUBLISHED",
    };

    if (category) {
      where.category = { slug: category as string };
    }

    if (tag) {
      where.tags = { has: tag as string };
    }

    if (q) {
      where.OR = [
        { title: { contains: q as string, mode: "insensitive" } },
        { excerpt: { contains: q as string, mode: "insensitive" } },
      ];
    }

    const articles = await prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      include: { category: true },
    });

    return res.json({
      success: true,
      data: articles,
    });
  } catch (error) {
    console.error("Get articles error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to fetch articles" },
    });
  }
}

export async function getArticleBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;

    const article = await prisma.article.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Article not found" },
      });
    }

    // Also fetch 2 related articles
    const related = await prisma.article.findMany({
      where: {
        categoryId: article.categoryId,
        id: { not: article.id },
        status: "PUBLISHED",
      },
      take: 2,
    });

    return res.json({
      success: true,
      data: {
        ...article,
        relatedArticles: related,
      },
    });
  } catch (error) {
    console.error("Get article by slug error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to fetch article details" },
    });
  }
}

export async function createArticle(req: AuthenticatedRequest, res: Response) {
  try {
    const parseResult = articleSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Invalid article data" },
      });
    }

    const data = parseResult.data;
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const article = await prisma.article.create({
      data: {
        slug,
        title: data.title,
        excerpt: data.excerpt,
        body: data.body,
        categoryId: data.categoryId,
        authorName: data.authorName,
        tags: data.tags,
        status: data.status,
        coverImageUrl: data.coverImageUrl || null,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      },
    });

    return res.status(201).json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("Create article error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to create article" },
    });
  }
}

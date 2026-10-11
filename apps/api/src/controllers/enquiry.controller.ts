import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { createEnquirySchema, updateEnquiryStatusSchema } from "@investorhub/shared";
import { AiService } from "../services/ai.service";

export async function createEnquiry(req: AuthenticatedRequest, res: Response) {
  try {
    const parseResult = createEnquirySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid enquiry submission",
          details: parseResult.error.flatten(),
        },
      });
    }

    const data = parseResult.data;

    // Check if provider exists
    const provider = await prisma.provider.findUnique({
      where: { id: data.providerId },
    });

    if (!provider) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Target provider not found" },
      });
    }

    // AI Lead Scoring & Summarization
    const aiResult = AiService.scoreLead({
      message: data.message,
      investorName: data.investorName,
      investorPhone: data.investorPhone,
      type: data.type,
      category: provider.category,
    });

    const enquiry = await prisma.enquiry.create({
      data: {
        investorId: req.user?.id || null,
        providerId: data.providerId,
        type: data.type,
        message: data.message,
        investorName: data.investorName,
        investorEmail: data.investorEmail,
        investorPhone: data.investorPhone || null,
        preferredContactMethod: data.preferredContactMethod || "EMAIL",
        preferredTime: data.preferredTime || null,
        source: data.source || "MARKETPLACE_MODAL",
        status: "NEW",
        leadScore: aiResult.score,
        aiSummary: aiResult.summary,
      },
    });

    // Record activity audit trail
    await prisma.enquiryActivity.create({
      data: {
        enquiryId: enquiry.id,
        actorId: req.user?.id || null,
        action: "ENQUIRY_CREATED",
        fromStatus: "INITIAL",
        toStatus: "NEW",
        note: `Enquiry submitted with AI score ${aiResult.score} (${aiResult.temperature}).`,
      },
    });

    return res.status(201).json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    console.error("Create enquiry error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to submit enquiry" },
    });
  }
}

export async function getProviderEnquiries(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
    }

    const provider = await prisma.provider.findFirst({
      where: { ownerUserId: req.user.id },
    });

    if (!provider) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Provider profile not found" },
      });
    }

    const { status, q, sort = "newest" } = req.query;

    const where: any = {
      providerId: provider.id,
    };

    if (status && status !== "ALL") {
      where.status = status as any;
    }

    if (q) {
      const search = (q as string).trim();
      where.OR = [
        { investorName: { contains: search, mode: "insensitive" } },
        { investorEmail: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "score") {
      orderBy = { leadScore: "desc" };
    }

    const enquiries = await prisma.enquiry.findMany({
      where,
      orderBy,
      include: {
        activities: { orderBy: { createdAt: "desc" }, take: 5 },
      },
    });

    return res.json({
      success: true,
      data: enquiries,
    });
  } catch (error) {
    console.error("Get provider enquiries error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to retrieve enquiries" },
    });
  }
}

export async function updateProviderEnquiry(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
    }

    const { id } = req.params;
    const { status, internalNotes } = req.body;

    const provider = await prisma.provider.findFirst({
      where: { ownerUserId: req.user.id },
    });

    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
    });

    if (!enquiry || (provider && enquiry.providerId !== provider.id && req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN")) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Enquiry not found or access denied" },
      });
    }

    const updated = await prisma.enquiry.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(internalNotes ? { internalNotes } : {}),
        statusUpdatedAt: new Date(),
      },
    });

    // Record activity
    await prisma.enquiryActivity.create({
      data: {
        enquiryId: id,
        actorId: req.user.id,
        action: "STATUS_UPDATED",
        fromStatus: enquiry.status,
        toStatus: status || enquiry.status,
        note: internalNotes || `Status updated to ${status}`,
      },
    });

    return res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("Update enquiry error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to update enquiry status" },
    });
  }
}

export async function getAdminEnquiries(req: AuthenticatedRequest, res: Response) {
  try {
    const { status, providerId, minScore } = req.query;

    const where: any = {};
    if (status && status !== "ALL") where.status = status as any;
    if (providerId) where.providerId = providerId as string;
    if (minScore) where.leadScore = { gte: parseInt(minScore as string, 10) };

    const enquiries = await prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        provider: {
          select: { companyName: true, category: true, slug: true },
        },
        activities: { take: 3, orderBy: { createdAt: "desc" } },
      },
    });

    return res.json({
      success: true,
      data: enquiries,
    });
  } catch (error) {
    console.error("Admin get enquiries error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to fetch central enquiry records" },
    });
  }
}

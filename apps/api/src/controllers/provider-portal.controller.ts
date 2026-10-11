import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { providerApplySchema, USER_ROLES } from "@investorhub/shared";

export async function getProviderProfile(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
    }

    const provider = await prisma.provider.findFirst({
      where: { ownerUserId: req.user.id },
      include: {
        services: true,
        team: true,
        documents: { orderBy: { createdAt: "desc" } },
        reviews: { where: { status: "APPROVED" } },
      },
    });

    if (!provider) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "No provider profile associated with this account" },
      });
    }

    return res.json({
      success: true,
      data: provider,
    });
  } catch (error) {
    console.error("Get provider profile error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to fetch provider profile" },
    });
  }
}

export async function applyOrUpdateProvider(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
    }

    const parseResult = providerApplySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid provider submission data",
          details: parseResult.error.flatten(),
        },
      });
    }

    const data = parseResult.data;
    let provider = await prisma.provider.findFirst({
      where: { ownerUserId: req.user.id },
    });

    const slug =
      provider?.slug ||
      data.companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") + `-${Math.floor(1000 + Math.random() * 9000)}`;

    if (provider) {
      provider = await prisma.provider.update({
        where: { id: provider.id },
        data: {
          companyName: data.companyName,
          category: data.category as any,
          tagline: data.tagline,
          overview: data.overview,
          specialities: data.specialities,
          serviceRegions: data.serviceRegions,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone || null,
          websiteUrl: data.websiteUrl || null,
          minInvestment: data.minInvestment || null,
          feeSummary: data.feeSummary || null,
          aumText: data.aumText || null,
          riskProfile: data.riskProfile || null,
          status: "PENDING", // submitted for admin review
          verificationStatus: "IN_REVIEW",
          submittedAt: new Date(),
        },
      });
    } else {
      provider = await prisma.provider.create({
        data: {
          ownerUserId: req.user.id,
          companyName: data.companyName,
          slug,
          category: data.category as any,
          tagline: data.tagline,
          overview: data.overview,
          specialities: data.specialities,
          serviceRegions: data.serviceRegions,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone || null,
          websiteUrl: data.websiteUrl || null,
          minInvestment: data.minInvestment || null,
          feeSummary: data.feeSummary || null,
          aumText: data.aumText || null,
          riskProfile: data.riskProfile || null,
          status: "PENDING",
          verificationStatus: "IN_REVIEW",
          submittedAt: new Date(),
        },
      });
    }

    // Write audit log
    await prisma.auditLog.create({
      data: {
        actorId: req.user.id,
        entityType: "PROVIDER",
        entityId: provider.id,
        action: "PROVIDER_SUBMITTED_FOR_REVIEW",
        afterJson: { companyName: provider.companyName, category: provider.category },
      },
    });

    return res.json({
      success: true,
      data: provider,
    });
  } catch (error) {
    console.error("Apply provider error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to submit provider application" },
    });
  }
}

export async function uploadDocument(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
    }

    const { docType, fileUrl } = req.body;
    if (!docType || !fileUrl) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "docType and fileUrl are required" },
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

    const document = await prisma.verificationDocument.create({
      data: {
        providerId: provider.id,
        docType: docType as any,
        fileUrl,
        status: "PENDING",
      },
    });

    // Update provider status to IN_REVIEW if UNVERIFIED
    if (provider.verificationStatus === "UNVERIFIED") {
      await prisma.provider.update({
        where: { id: provider.id },
        data: { verificationStatus: "IN_REVIEW" },
      });
    }

    // Write audit log
    await prisma.auditLog.create({
      data: {
        actorId: req.user.id,
        entityType: "VERIFICATION_DOCUMENT",
        entityId: document.id,
        action: "DOCUMENT_UPLOADED",
        afterJson: { docType, fileUrl },
      },
    });

    return res.status(201).json({
      success: true,
      data: document,
    });
  } catch (error) {
    console.error("Upload document error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to record verification document" },
    });
  }
}

export async function getProviderStats(req: AuthenticatedRequest, res: Response) {
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

    const [totalLeads, newLeads, bookedLeads, wonLeads] = await Promise.all([
      prisma.enquiry.count({ where: { providerId: provider.id } }),
      prisma.enquiry.count({ where: { providerId: provider.id, status: "NEW" } }),
      prisma.enquiry.count({ where: { providerId: provider.id, status: "BOOKED" } }),
      prisma.enquiry.count({ where: { providerId: provider.id, status: "WON" } }),
    ]);

    return res.json({
      success: true,
      data: {
        totalLeads,
        newLeads,
        bookedLeads,
        wonLeads,
        profileViews: 342,
        conversionRate: totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) + "%" : "0%",
        avgRating: provider.avgRating,
        reviewCount: provider.reviewCount,
      },
    });
  } catch (error) {
    console.error("Get provider stats error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to fetch provider metrics" },
    });
  }
}

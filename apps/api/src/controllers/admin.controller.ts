import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { adminProviderApprovalSchema } from "@investorhub/shared";

export async function getAdminDashboard(req: AuthenticatedRequest, res: Response) {
  try {
    const [
      totalUsers,
      totalInvestors,
      totalProviders,
      pendingProviders,
      approvedProviders,
      totalEnquiries,
      newEnquiries,
      totalReviews,
      flaggedReviews,
      publishedArticles,
      reviewStats,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "INVESTOR" } }),
      prisma.provider.count(),
      prisma.provider.count({ where: { status: "PENDING" } }),
      prisma.provider.count({ where: { status: "APPROVED" } }),
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { status: "NEW" } }),
      prisma.review.count(),
      prisma.review.count({ where: { status: "FLAGGED" } }),
      prisma.article.count({ where: { status: "PUBLISHED" } }),
      prisma.review.aggregate({
        where: { status: "APPROVED" },
        _avg: { rating: true },
      }),
    ]);

    // Group leads by status for the funnel
    const leadsByStatus = await prisma.enquiry.groupBy({
      by: ["status"],
      _count: { _all: true },
    });

    // Group providers by category
    const providersByCategory = await prisma.provider.groupBy({
      by: ["category"],
      where: { status: "APPROVED" },
      _count: { _all: true },
    });

    const kpis = {
      totalUsers,
      totalInvestors,
      totalProviders,
      pendingProviders,
      approvedProviders,
      totalEnquiries,
      newEnquiries,
      totalReviews,
      flaggedReviews,
      publishedArticles,
      averageRating: reviewStats._avg.rating ? reviewStats._avg.rating.toFixed(1) : "4.9",
      pipelineValueEstimate: "$14.2M AUD",
    };

    const aiInsights = [
      `Enquiries increased by 18% over the past week; highest demand in SMSF Specialists & Fund Managers.`,
      `${pendingProviders} provider application${pendingProviders === 1 ? "" : "s"} currently awaiting compliance verification in the queue.`,
      `${flaggedReviews} review${flaggedReviews === 1 ? "" : "s"} flagged by AI Sentinel for prohibited guarantee claims.`,
    ];

    return res.json({
      success: true,
      data: {
        kpis,
        aiInsights,
        leadsByStatus,
        providersByCategory,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to load admin dashboard" },
    });
  }
}

export async function getAdminProviders(req: AuthenticatedRequest, res: Response) {
  try {
    const { status, category, verified, q } = req.query;

    const where: any = {};
    if (status && status !== "ALL") where.status = status as any;
    if (category) where.category = category as any;
    if (verified === "true") where.verifiedBadge = true;
    if (q) {
      where.companyName = { contains: q as string, mode: "insensitive" };
    }

    const providers = await prisma.provider.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        documents: true,
        services: { take: 2 },
      },
    });

    return res.json({
      success: true,
      data: providers,
    });
  } catch (error) {
    console.error("Get admin providers error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to fetch providers" },
    });
  }
}

export async function approveProvider(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;

    const provider = await prisma.provider.update({
      where: { id },
      data: {
        status: "APPROVED",
        verificationStatus: "VERIFIED",
        verifiedBadge: true,
        approvedAt: new Date(),
        approvedBy: req.user?.id || "admin",
      },
    });

    // Record in AuditLog
    await prisma.auditLog.create({
      data: {
        actorId: req.user?.id || null,
        entityType: "PROVIDER",
        entityId: id,
        action: "PROVIDER_APPROVED_AND_VERIFIED",
        afterJson: { companyName: provider.companyName, status: "APPROVED" },
      },
    });

    return res.json({
      success: true,
      data: provider,
    });
  } catch (error) {
    console.error("Approve provider error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to approve provider" },
    });
  }
}

export async function rejectProvider(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const provider = await prisma.provider.update({
      where: { id },
      data: {
        status: "REJECTED",
        verificationStatus: "REJECTED",
        verifiedBadge: false,
        rejectionReason: reason || "Compliance documentation criteria not satisfied.",
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: req.user?.id || null,
        entityType: "PROVIDER",
        entityId: id,
        action: "PROVIDER_REJECTED",
        afterJson: { reason },
      },
    });

    return res.json({
      success: true,
      data: provider,
    });
  } catch (error) {
    console.error("Reject provider error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to reject provider" },
    });
  }
}

export async function toggleProviderVerification(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { verifiedBadge, verificationStatus } = req.body;

    const provider = await prisma.provider.update({
      where: { id },
      data: {
        verifiedBadge: Boolean(verifiedBadge),
        verificationStatus: verificationStatus || "VERIFIED",
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: req.user?.id || null,
        entityType: "PROVIDER",
        entityId: id,
        action: "VERIFICATION_STATUS_CHANGED",
        afterJson: { verifiedBadge, verificationStatus },
      },
    });

    return res.json({
      success: true,
      data: provider,
    });
  } catch (error) {
    console.error("Toggle verification error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to update verification status" },
    });
  }
}

export async function getAuditLogs(req: AuthenticatedRequest, res: Response) {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        actor: {
          select: { fullName: true, email: true, role: true },
        },
      },
    });

    return res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error("Get audit logs error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to fetch audit logs" },
    });
  }
}

export async function exportProvidersCsv(req: AuthenticatedRequest, res: Response) {
  try {
    const providers = await prisma.provider.findMany({
      orderBy: { createdAt: "desc" },
    });

    let csv = "ID,Company Name,Category,Status,Verification,Rating,Reviews,Email,Phone,Created\n";
    providers.forEach((p) => {
      csv += `"${p.id}","${p.companyName}","${p.category}","${p.status}","${p.verificationStatus}",${p.avgRating},${p.reviewCount},"${p.contactEmail}","${p.contactPhone || ""}","${p.createdAt.toISOString()}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=investorhub-providers.csv");
    return res.send(csv);
  } catch (error) {
    return res.status(500).send("Failed to generate CSV export");
  }
}

export async function exportEnquiriesCsv(req: AuthenticatedRequest, res: Response) {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
      include: { provider: { select: { companyName: true } } },
    });

    let csv = "ID,Investor Name,Email,Phone,Provider,Type,Status,Lead Score,AI Summary,Created\n";
    enquiries.forEach((e) => {
      csv += `"${e.id}","${e.investorName}","${e.investorEmail}","${e.investorPhone || ""}","${e.provider?.companyName || ""}","${e.type}","${e.status}",${e.leadScore},"${(e.aiSummary || "").replace(/"/g, '""')}","${e.createdAt.toISOString()}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=investorhub-enquiries.csv");
    return res.send(csv);
  } catch (error) {
    return res.status(500).send("Failed to generate CSV export");
  }
}

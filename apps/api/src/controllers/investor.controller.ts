import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../middleware/auth";

export async function addFavourite(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Auth required" } });
    const { providerId } = req.params;

    const fav = await prisma.favourite.upsert({
      where: { investorId_providerId: { investorId: req.user.id, providerId } },
      create: { investorId: req.user.id, providerId },
      update: {},
    });

    return res.json({ success: true, data: fav });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Failed to save favourite" } });
  }
}

export async function removeFavourite(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Auth required" } });
    const { providerId } = req.params;

    await prisma.favourite.deleteMany({
      where: { investorId: req.user.id, providerId },
    });

    return res.json({ success: true, message: "Favourite removed" });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Failed to remove favourite" } });
  }
}

export async function getFavourites(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Auth required" } });

    const favs = await prisma.favourite.findMany({
      where: { investorId: req.user.id },
      include: { provider: true },
    });

    return res.json({ success: true, data: favs.map((f) => f.provider) });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Failed to get favourites" } });
  }
}

export async function getInvestorEnquiries(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Auth required" } });

    const enquiries = await prisma.enquiry.findMany({
      where: {
        OR: [{ investorId: req.user.id }, { investorEmail: req.user.email }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        provider: { select: { companyName: true, category: true, slug: true } },
      },
    });

    return res.json({ success: true, data: enquiries });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Failed to get enquiries" } });
  }
}

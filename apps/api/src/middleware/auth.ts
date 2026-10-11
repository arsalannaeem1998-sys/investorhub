import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, TokenPayload } from "../utils/jwt";
import { prisma } from "../lib/prisma";
import { UserRole } from "@investorhub/shared";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    fullName: string;
  };
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  let token = req.cookies?.access_token;

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Authentication required" },
    });
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    return res.status(401).json({
      success: false,
      error: { code: "TOKEN_EXPIRED", message: "Invalid or expired session token" },
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, fullName: true, status: true },
    });

    if (!user || user.status === "SUSPENDED") {
      return res.status(403).json({
        success: false,
        error: { code: "FORBIDDEN", message: "Account is inactive or suspended" },
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
      fullName: user.fullName,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Internal authentication error" },
    });
  }
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: `Forbidden: requires one of roles [${allowedRoles.join(", ")}]`,
        },
      });
    }

    next();
  };
}

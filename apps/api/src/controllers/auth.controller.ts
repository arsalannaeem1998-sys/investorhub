import { Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import {
  registerSchema,
  loginSchema,
  UserRole,
  USER_ROLES,
} from "@investorhub/shared";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { AuthenticatedRequest } from "../middleware/auth";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export async function register(req: AuthenticatedRequest, res: Response) {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid registration payload",
          details: parseResult.error.flatten(),
        },
      });
    }

    const { email, password, fullName, phone, role } = parseResult.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: { code: "EMAIL_TAKEN", message: "An account with this email already exists" },
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        phone,
        role: role as any,
        status: "ACTIVE",
        emailVerifiedAt: new Date(),
        ...(role === USER_ROLES.INVESTOR
          ? {
              investorProfile: {
                create: {
                  interests: [],
                  riskProfile: "BALANCED",
                },
              },
            }
          : {}),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    // If registered as Provider, create a starter draft Provider record
    if (role === USER_ROLES.PROVIDER) {
      const baseSlug = fullName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      const slug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

      await prisma.provider.create({
        data: {
          ownerUserId: newUser.id,
          companyName: fullName,
          slug,
          category: "FUND_MANAGER",
          tagline: "Professional Investment Services",
          overview: "Provider profile under onboarding.",
          specialities: ["General Investment"],
          serviceRegions: ["National (Australia-wide)"],
          contactEmail: email,
          status: "DRAFT",
          verificationStatus: "UNVERIFIED",
        },
      });
    }

    const tokenPayload = {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role as UserRole,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.cookie("access_token", accessToken, COOKIE_OPTIONS);
    res.cookie("refresh_token", refreshToken, COOKIE_OPTIONS);

    return res.status(201).json({
      success: true,
      data: {
        user: newUser,
        accessToken,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to complete registration" },
    });
  }
}

export async function login(req: AuthenticatedRequest, res: Response) {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid login credentials",
          details: parseResult.error.flatten(),
        },
      });
    }

    const { email, password } = parseResult.data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        investorProfile: true,
        provider: {
          select: {
            id: true,
            companyName: true,
            slug: true,
            status: true,
            verificationStatus: true,
            verifiedBadge: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" },
      });
    }

    if (user.status === "SUSPENDED") {
      return res.status(403).json({
        success: false,
        error: { code: "SUSPENDED", message: "This account has been suspended" },
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" },
      });
    }

    // Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.cookie("access_token", accessToken, COOKIE_OPTIONS);
    res.cookie("refresh_token", refreshToken, COOKIE_OPTIONS);

    const { passwordHash: _, ...userSafe } = user;

    return res.json({
      success: true,
      data: {
        user: userSafe,
        accessToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Login processing failed" },
    });
  }
}

export async function logout(req: AuthenticatedRequest, res: Response) {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  return res.json({
    success: true,
    data: { message: "Logged out successfully" },
  });
}

export async function getMe(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Not authenticated" },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        investorProfile: true,
        provider: {
          select: {
            id: true,
            companyName: true,
            slug: true,
            status: true,
            verificationStatus: true,
            verifiedBadge: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "User not found" },
      });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to retrieve user profile" },
    });
  }
}

export async function refresh(req: AuthenticatedRequest, res: Response) {
  const refreshToken = req.cookies?.refresh_token;
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      error: { code: "NO_REFRESH_TOKEN", message: "Refresh token missing" },
    });
  }

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    return res.status(401).json({
      success: false,
      error: { code: "INVALID_REFRESH_TOKEN", message: "Invalid or expired refresh token" },
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user || user.status === "SUSPENDED") {
    return res.status(403).json({
      success: false,
      error: { code: "FORBIDDEN", message: "User not found or suspended" },
    });
  }

  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role as UserRole,
  };

  const newAccessToken = generateAccessToken(tokenPayload);
  res.cookie("access_token", newAccessToken, COOKIE_OPTIONS);

  return res.json({
    success: true,
    data: { accessToken: newAccessToken },
  });
}

import jwt from "jsonwebtoken";
import { config } from "../config";
import { UserRole } from "@investorhub/shared";

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "15m" });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, config.jwtSecret) as TokenPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, config.jwtRefreshSecret) as TokenPayload;
  } catch {
    return null;
  }
}

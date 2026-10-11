import { config } from "./config";

/** Origins allowed for browser requests with credentials (cookies). */
export function getCorsOrigins(): string[] {
  const origins = new Set<string>([
    config.frontendUrl,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ]);

  if (process.env.VERCEL_URL) {
    origins.add(`https://${process.env.VERCEL_URL}`);
  }

  const extra = process.env.CORS_ORIGINS?.split(",") ?? [];
  for (const origin of extra) {
    const trimmed = origin.trim();
    if (trimmed) origins.add(trimmed);
  }

  return [...origins];
}

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Prefer public DATABASE_URL (proxy) for broader compatibility on Railway
// Some environments cannot reach postgres.railway.internal during build/runtime
const datasourceUrl = process.env.DATABASE_URL || process.env.DATABASE_INTERNAL_URL;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: datasourceUrl ? { db: { url: datasourceUrl } } : undefined,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

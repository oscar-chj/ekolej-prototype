import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: Pool;
};

const dbUrl = process.env.DATABASE_URL || "";
const isAccelerate =
  dbUrl.startsWith("prisma://") || dbUrl.startsWith("prisma+postgres://");

let prismaInstance: PrismaClient;

if (isAccelerate) {
  prismaInstance =
    globalForPrisma.prisma ?? new PrismaClient({ accelerateUrl: dbUrl });
} else {
  const pool = globalForPrisma.pgPool ?? new Pool({ connectionString: dbUrl });
  prismaInstance =
    globalForPrisma.prisma ??
    (() => {
      const adapter = new PrismaPg(pool);
      return new PrismaClient({ adapter });
    })();

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pgPool = pool;
  }
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismaInstance;
}

export const prisma = prismaInstance;

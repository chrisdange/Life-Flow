import { PrismaClient } from "../../../node_modules/.prisma/client/index.js";

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
    datasources: {
      db: {
        url: "postgresql://postgres.ocuddmoanmoeggzvbajr:tSql8RmG95uakuOj@aws-0-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Helper function to handle Prisma errors
export function handlePrismaError(error) {
  console.error("Prisma Error:", error);

  if (error.code === "P2002") {
    return { error: "A record with this information already exists." };
  }

  if (error.code === "P2025") {
    return { error: "Record not found." };
  }

  if (error.code === "P2003") {
    return { error: "Invalid reference to related record." };
  }

  return { error: "Database operation failed. Please try again." };
}

// Test database connection
export async function testConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}

// Graceful shutdown
export async function disconnect() {
  await prisma.$disconnect();
}

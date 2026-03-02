import { PrismaClient } from '@prisma/client';
import "dotenv/config";

async function main() {
  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: "postgresql://postgres:password@localhost:5432/postgres",
        },
      },
    });
    console.log("PrismaClient initialized with datasourceUrl");
    await prisma.$connect();
    console.log("Connected successfully");
    await prisma.$disconnect();
  } catch (error) {
    console.error("Failed to initialize or connect:", error);
    process.exit(1);
  }
}

main();

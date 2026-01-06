import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const adapter = new PrismaPg({
  connectionString: process.env.NEXT_DATABASE_URL,
});

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function addReminder(
  userPhone: string,
  title: string,
  scheduledAt: string
) {
  return await prisma.reminder.create({
    data: {
      userPhone,
      title,
      scheduledAt: new Date(scheduledAt),
    },
  });
}

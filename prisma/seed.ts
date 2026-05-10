import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@gasagency.local";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, name: "Agency Admin", passwordHash: await bcrypt.hash(password, 12) }
  });
}

main().finally(async () => prisma.$disconnect());

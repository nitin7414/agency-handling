import { config } from "dotenv";
config({ path: ".env" });

import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@gasagency.local";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";

  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Agency Admin",
      passwordHash: await bcrypt.hash(password, 12),
    },
  });

  console.log("✅ Admin seeded");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
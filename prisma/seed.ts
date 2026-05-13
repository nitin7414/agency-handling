import { config } from "dotenv";
config({ path: ".env.local" });
config(); // Fallback to .env

import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "Admin@gas.local").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "Admin@123";

  const passwordHash = await bcrypt.hash(password, 12);
  
  await prisma.admin.upsert({
    where: { email },
    update: {
      passwordHash, // Allows updating password via seed if env var changes
    },
    create: {
      email,
      name: "Agency Admin",
      passwordHash,
    },
  });

  console.log("✅ Admin seeded");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
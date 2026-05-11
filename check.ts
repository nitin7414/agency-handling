import { config } from "dotenv";
config({ path: ".env" });  // explicitly point to .env

console.log("DATABASE_URL:", process.env.DATABASE_URL);

import { prisma } from "./lib/prisma";

async function main() {
  const admins = await prisma.admin.findMany();
  console.log("Admins:", admins);
}

main().finally(() => prisma.$disconnect());
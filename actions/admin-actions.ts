"use server";

import { prisma } from "@/lib/prisma";
import { adminSchema } from "./schemas";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function updateAdminProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const data = Object.fromEntries(formData.entries());
  const parsed = adminSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password } = parsed.data;

  const updateData: any = { name, email };
  if (password) {
    updateData.passwordHash = await bcrypt.hash(password, 10);
  }

  try {
    await prisma.admin.update({
      where: { email: session.user.email },
      data: updateData,
    });
    revalidatePath("/settings");
    return { success: true };
  } catch (error: any) {
    return { error: "Failed to update profile. Email might be already in use." };
  }
}

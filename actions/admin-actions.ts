"use server";

import { prisma } from "@/lib/prisma";
import { adminSchema } from "./schemas";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function updateAdminProfile(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return { error: "Unauthorized: Admin access required" };
    }

    const data = Object.fromEntries(formData.entries());
    const parsed = adminSchema.safeParse(data);

    if (!parsed.success) {
      return { error: "Invalid input data provided" };
    }

    const { name, email, password } = parsed.data;

    const updateData: any = { name, email };
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    await prisma.admin.update({
      where: { id: session.user.id },
      data: updateData,
    });
    revalidatePath("/settings");
    return { success: true };
  } catch (error: any) {
    console.error("Admin action error:", error);
    if (error.code === 'P2002') {
      return { error: "This email is already in use by another administrator." };
    }
    return { error: "Failed to update profile. Please ensure you are logged in correctly." };
  }
}

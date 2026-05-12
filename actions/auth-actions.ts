"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function signUpAdmin(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const parsed = signUpSchema.safeParse(data);

    if (!parsed.success) {
      return { error: "Invalid input data provided" };
    }

    const { name, email, password } = parsed.data;

    // Check if user already exists
    const existing = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existing) {
      return { error: "An administrator with this email already exists." };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.admin.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Failed to create administrator account." };
  }
}

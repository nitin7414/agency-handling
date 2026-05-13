import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 }, // 7 days
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Admin credentials",
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const admin = await prisma.admin.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
        if (!admin) return null;
        const valid = await bcrypt.compare(parsed.data.password, admin.passwordHash);
        if (!valid) return null;
        return { 
          id: admin.id, 
          name: admin.name, 
          email: admin.email, 
          role: "admin",
          sessionVersion: admin.sessionVersion 
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as any).role;
        token.sessionVersion = (user as any).sessionVersion;
      }

      // To implement "industry standard" session invalidation, we check the database
      // if this is not the initial login (i.e., user is not present in the callback)
      if (!user && token.sub) {
        const admin = await prisma.admin.findUnique({
          where: { id: token.sub as string },
          select: { sessionVersion: true }
        });

        // If admin not found or version mismatch, invalidate the token
        if (!admin || admin.sessionVersion !== token.sessionVersion) {
          return {} as any; // Return empty to effectively invalidate
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub as string;
        (session.user as any).role = token.role;
        (session.user as any).sessionVersion = token.sessionVersion;
      }

      // If token is empty (invalidated in jwt callback), session should be null
      if (!token.sub) {
        return null as any;
      }

      return session;
    }
  }
};

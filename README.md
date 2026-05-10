# GasPro Agency Management

Production-ready mobile-first Gas Agency Management System built with Next.js App Router, TypeScript, Prisma ORM, Neon PostgreSQL, NextAuth credentials authentication, Tailwind CSS, shadcn-style primitives, React Hook Form/Zod-ready server validation, Recharts analytics, and installable PWA support.

## Quick start

1. Copy `.env.example` to `.env` and add a Neon PostgreSQL `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and initial admin credentials.
2. Install dependencies: `npm install`.
3. Generate the Prisma client and push the schema: `npm run db:push`.
4. Seed the admin user: `npm run db:seed`.
5. Start development: `npm run dev`.

## Android delivery

The app is installable as a PWA via `public/manifest.webmanifest`. For APK distribution, use PWABuilder against the deployed HTTPS URL or initialize Capacitor with `capacitor.config.ts` after building/exporting the web assets.

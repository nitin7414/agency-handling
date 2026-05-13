import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    sessionVersion: number;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: string;
      sessionVersion: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string;
    role: string;
    sessionVersion: number;
  }
}

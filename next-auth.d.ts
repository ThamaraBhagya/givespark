// next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

// 1. Define the custom type for the Role (must match your Prisma enum)
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string; // <-- Add custom ID
      role: 'USER' | 'CREATOR'; // <-- Add custom Role
    } & DefaultSession["user"];
  }

  /**
   * The type of user object passed to the `jwt` callback
   */
  interface User {
    id: string; // <-- Add custom ID
    role: 'USER' | 'CREATOR'; // <-- Add custom Role
  }
}

// 2. Extend the JWT token structure
declare module "next-auth/jwt" {
  /**
   * Returned by the `jwt` callback
   */
  interface JWT {
    id: string; // <-- Add custom ID
    role: 'USER' | 'CREATOR'; // <-- Add custom Role
  }
}
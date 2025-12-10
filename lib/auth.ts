// lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// NOTE: This file assumes you've completed Step 5 successfully

/**
 * Gets the current session and user object on the server.
 */
export async function getAuthSession() {
  const session = await getServerSession(authOptions);
  return session;
}

/**
 * Checks if the user is a CREATOR.
 */
export async function isCreator() {
  const session = await getAuthSession();
  // This is a simplified check. Your actual session object must include the role.
  // (Requires extending NextAuth types later)
  return session?.user?.role === 'CREATOR';
}
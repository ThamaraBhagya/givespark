// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma"; // Imports the Prisma client instance
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from 'bcryptjs'; // To compare hashed passwords

export const authOptions = {
    // Uses the Prisma client to connect NextAuth sessions/accounts to the DB
    adapter: PrismaAdapter(prisma), 
    
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            
            // This is the custom function that runs when a user attempts to sign in
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }

                // 1. Find the user by email
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) {
                    // User not found or no password (e.g., if they signed up via social login later)
                    return null; 
                }

                // 2. Verify the password
                // Compares the provided password with the hashed password stored in the DB
                const isValid = await bcrypt.compare(credentials.password, user.password);
                
                if (!isValid) {
                    return null; // Invalid password
                }
                
                // 3. Return the user object
                // The fields returned here are stored in the JWT token (after serialization)
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role, // Crucial: Pass the role through
                    stripeAccountId: user.stripeAccountId,
                };
            }
        })
    ],
    
    session: {
        strategy: "jwt" as const,
    },

    // Callbacks are necessary to persist the custom 'role' field onto the session
    callbacks: {
        // Step 1: Add custom fields (like role) to the JWT token
        async jwt({ token, user,trigger, session }: any) {
            if (trigger === "update" && session) {
                token.name = session.name;
                token.image = session.image;
                }
            if (user) {
                // 'user' is the object returned from the 'authorize' function above
                token.role = user.role;
                token.id = user.id;
                token.image = user.image;
                token.stripeAccountId = user.stripeAccountId;
            }
            return token;
        },
        // Step 2: Add custom fields (like role) to the session object accessible in the client
        async session({ session, token }: any) {
            if (session.user) {
                session.user.role = token.role;
                session.user.id = token.id;
                session.user.image = token.image;
                session.user.stripeAccountId = token.stripeAccountId;
            }
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
    // Define the custom sign-in page URL
    pages: {
        signIn: '/auth/signin', 
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
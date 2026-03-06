// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma"; 
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from 'bcryptjs'; 

export const authOptions = {
    // Uses the Prisma client to connect NextAuth sessions/accounts to the DB
    adapter: PrismaAdapter(prisma) as any, 
    
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

                // Find the user by email
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) {
                    
                    return null; 
                }

                
                const isValid = await bcrypt.compare(credentials.password, user.password);
                
                if (!isValid) {
                    return null; 
                }
                
                // Return the user object
                // The fields returned here are stored in the JWT token (after serialization)
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role, 
                    stripeAccountId: user.stripeAccountId,
                };
            }
        })
    ],
    
    session: {
        strategy: "jwt" as const,
    },

    
    callbacks: {
        
        async jwt({ token, user,trigger, session }: any) {
            if (trigger === "update" && session) {
                token.name = session.name;
                token.image = session.image;
                }
            if (user) {
                
                token.role = user.role;
                token.id = user.id;
                token.image = user.image;
                token.stripeAccountId = user.stripeAccountId;
            }
            return token;
        },
        
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
    
    pages: {
        signIn: '/auth/signin', 
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
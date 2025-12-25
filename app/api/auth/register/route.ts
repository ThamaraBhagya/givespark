// app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { name, email, password, role ,image } = await req.json();

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists with this email." }, { status: 409 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'USER', 
                image: image || null,
            }
        });

        // If the user is a CREATOR, create their initial Wallet
        if (newUser.role === 'CREATOR') {
            await prisma.wallet.create({
                data: {
                    userId: newUser.id,
                    balance: 0,
                    totalReceived: 0,
                    withdrawnAmount: 0,
                }
            });
        }

        return NextResponse.json({ success: true, user: newUser }, { status: 201 });

    } catch (e: any) {
        console.error("Registration Error:", e);
        return NextResponse.json(
            { error: "Failed to process registration.", details: e.message },
            { status: 500 }
        );
    }
}
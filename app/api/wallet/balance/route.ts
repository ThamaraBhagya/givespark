// app/api/wallet/balance/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; 

export async function GET() {
    const session = await getServerSession(authOptions);
    
    // Check Authentication and Role
    if (!session?.user || session.user.role !== 'CREATOR') {
        return NextResponse.json({ error: "Access denied. Creator role required." }, { status: 403 });
    }
    
    const creatorId = session.user.id;

    try {
        //  Fetch Wallet data, including all transactions
        const wallet = await prisma.wallet.findUnique({
            where: { userId: creatorId },
            include: {
                transactions: {
                    orderBy: { createdAt: 'desc' }, // Show newest transactions first
                    select: { amount: true, type: true, createdAt: true }
                }
            }
        });

        if (!wallet) {
            
            return NextResponse.json({ error: "Creator wallet not found." }, { status: 404 });
        }

        // Return the comprehensive wallet data
        return NextResponse.json({ success: true, wallet }, { status: 200 });

    } catch (e) {
        console.error("Error fetching wallet:", e);
        return NextResponse.json(
            { error: "Failed to fetch wallet data.", details: e },
            { status: 500 }
        );
    }
}
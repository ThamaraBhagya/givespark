// app/api/campaign/my/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
    const session = await getServerSession(authOptions);
    
    // 1. Check Authentication and Role
    if (!session?.user || session.user.role !== 'CREATOR') {
        return NextResponse.json({ error: "Access denied. Creator role required." }, { status: 403 });
    }
    
    const creatorId = session.user.id;

    try {
        // 2. Fetch all campaigns created by this user
        const myCampaigns = await prisma.campaign.findMany({
            where: { creatorId: creatorId },
            orderBy: { createdAt: 'desc' },
            // Include only essential fields for a dashboard list
            select: {
                id: true,
                title: true,
                currentAmount: true,
                goalAmount: true,
                createdAt: true,
                // Add any other fields you need for the list
            }
        });

        // 3. Return the list of campaigns
        return NextResponse.json({ success: true, campaigns: myCampaigns }, { status: 200 });

    } catch (e) {
        console.error("Error fetching creator campaigns:", e);
        return NextResponse.json(
            { error: "Failed to fetch creator campaigns.", details: e },
            { status: 500 }
        );
    }
}
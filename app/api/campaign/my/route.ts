
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
    const session = await getServerSession(authOptions);
   
    if (!session?.user || session.user.role !== 'CREATOR') {
        return NextResponse.json({ error: "Access denied. Creator role required." }, { status: 403 });
    }
    
    const creatorId = session.user.id;

    try {
        
        const myCampaigns = await prisma.campaign.findMany({
            where: { creatorId: creatorId },
            orderBy: { createdAt: 'desc' },
            
            select: {
                id: true,
                title: true,
                currentAmount: true,
                goalAmount: true,
                createdAt: true,
                
            }
        });

        return NextResponse.json({ success: true, campaigns: myCampaigns }, { status: 200 });

    } catch (e) {
        console.error("Error fetching creator campaigns:", e);
        return NextResponse.json(
            { error: "Failed to fetch creator campaigns.", details: e },
            { status: 500 }
        );
    }
}
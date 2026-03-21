
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


const FEATURED_LIMIT = 6;

export async function GET() {
    try {
        const campaigns = await prisma.campaign.findMany({
            take: FEATURED_LIMIT,
            orderBy: { 
                createdAt: "desc" 
            }, 
            select: {
                id: true,
                title: true,
                shortDesc: true,
                featuredImage: true,
                currentAmount: true,
                goalAmount: true,
            },
        });

        return NextResponse.json({ campaigns }, { status: 200 });
        
    } catch (e) {
        console.error("Error fetching featured campaigns:", e);
        return NextResponse.json(
            { error: "Failed to fetch featured campaigns data." },
            { status: 500 }
        );
    }
}
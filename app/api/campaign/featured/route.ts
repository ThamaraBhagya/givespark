// /app/api/campaign/featured/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Define the number of campaigns to display as featured
const FEATURED_LIMIT = 6;

export async function GET() {
    try {
        const campaigns = await prisma.campaign.findMany({
            // 1. Limit the results to 6 (matching the frontend grid layout)
            take: FEATURED_LIMIT,
            
            // 2. Order by newest first
            orderBy: { 
                createdAt: "desc" 
            }, 

            // 3. Select only the fields needed by the CampaignCard component
            select: {
                id: true,
                title: true,
                shortDesc: true,
                featuredImage: true,
                currentAmount: true,
                goalAmount: true,
                // Do NOT include sensitive or unnecessary heavy data here (like full descriptions)
            },
        });

        // Return the list of campaigns
        return NextResponse.json({ campaigns }, { status: 200 });
        
    } catch (e) {
        // Log the error for server debugging
        console.error("Error fetching featured campaigns:", e);
        
        // Return a generic 500 error to the client
        return NextResponse.json(
            { error: "Failed to fetch featured campaigns data." },
            { status: 500 }
        );
    }
}
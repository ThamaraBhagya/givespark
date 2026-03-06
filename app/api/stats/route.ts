import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    
    const campaignCount = await prisma.campaign.count();

    
    const aggregateFunds = await prisma.campaign.aggregate({
      _sum: {
        currentAmount: true,
      },
    });

    
    const backerCount = await prisma.donation.count();

    return NextResponse.json({
      totalCampaigns: campaignCount,
      totalFunds: aggregateFunds._sum.currentAmount || 0,
      totalBackers: backerCount,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
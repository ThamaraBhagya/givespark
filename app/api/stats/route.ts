import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Get total number of campaigns
    const campaignCount = await prisma.campaign.count();

    // 2. Get total funds raised (sum of all currentAmount)
    const aggregateFunds = await prisma.campaign.aggregate({
      _sum: {
        currentAmount: true,
      },
    });

    // 3. Get total unique backers (donors)
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
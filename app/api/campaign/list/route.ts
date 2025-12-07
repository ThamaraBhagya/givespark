// app/api/campaign/list/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      // Since we removed the status/approval, we just fetch all campaigns
      orderBy: { createdAt: "desc" } 
    }); //[cite: 105]

    return NextResponse.json({ campaigns }); //[cite: 106]
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch campaigns", details: e },
      { status: 500 }
    ); //[cite: 107]
  }
}
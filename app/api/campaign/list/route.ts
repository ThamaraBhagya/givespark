// app/api/campaign/list/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      select: {
        id: true,
        title: true,
        shortDesc: true,
        featuredImage: true,
        currentAmount: true,
        goalAmount: true,
        category: true,
      },
      orderBy: { createdAt: "desc" } 
    });

    return NextResponse.json({ campaigns });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch campaigns", details: e },
      { status: 500 }
    );
  }
}
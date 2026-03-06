// app/api/campaign/create/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth"; 
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 }); 
  }

  try {
    const body = await req.json();
    const {
      title, shortDesc, description, goalAmount, deadline, images, featuredImage, category
    } = body; 

    const deadlineDate = new Date(deadline);
      if (isNaN(deadlineDate.getTime())) {
        return NextResponse.json({ error: "Invalid deadline date provided." }, { status: 400 });
      }

    const creatorId = (session.user as any).id;

    const campaign = await prisma.campaign.create({
      data: {
        title,
        shortDesc,
        description,
        goalAmount,
        deadline: deadlineDate,
        images: images || [],
        featuredImage,
        category,
        creatorId: creatorId, 
      }
    });

    return NextResponse.json({ success: true, campaign });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to create campaign", details: e },
      { status: 500 }
    ); 
  }
}
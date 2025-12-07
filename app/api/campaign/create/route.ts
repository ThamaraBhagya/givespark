// app/api/campaign/create/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth"; // Used for authentication [cite: 74]

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 }); //[cite: 76]
  }

  try {
    const body = await req.json();
    const {
      title, shortDesc, description, goalAmount, deadline, images, featuredImage, category
    } = body; // Destructure all mandatory fields [cite: 77]

    const campaign = await prisma.campaign.create({
      data: {
        title,
        shortDesc,
        description,
        goalAmount,
        deadline: new Date(deadline),
        images,
        featuredImage,
        category,
        creatorId: session.user.id // Link to the logged-in creator [cite: 78]
      }
    });

    return NextResponse.json({ success: true, campaign });// [cite: 79]
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to create campaign", details: e },
      { status: 500 }
    ); //[cite: 80]
  }
}
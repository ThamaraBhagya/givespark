// app/api/donation/create/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth"; // To get donorId

export async function POST(req: Request) {
  const session = await getServerSession();
  // Donor ID can be null if the donation is anonymous (which we allow)
  const donorId = session?.user?.id || null; 

  try {
    const body = await req.json();
    const { campaignId, amount, message, anonymous } = body;

    // Input validation (simplified)
    if (!campaignId || amount <= 0) {
        return NextResponse.json({ error: "Invalid campaign or amount." }, { status: 400 });
    }

    // --- 1. Get the Campaign and its Creator ---
    const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId }
    });

    if (!campaign) {
        return NextResponse.json({ error: "Campaign not found." }, { status: 404 });
    }

    // --- 2. Perform the Transaction (Mock Payment Logic) ---
    // We use prisma.$transaction to ensure all updates succeed or fail together.
    const [donation, updatedCampaign, updatedWallet] = await prisma.$transaction([

        // 2a. Create donation record
        prisma.donation.create({
            data: {
                campaignId,
                donorId,
                amount,
                message,
                anonymous
            }
        }),

        // 2b. Update campaign's currentAmount (Real-Time Update simulation)
        prisma.campaign.update({
            where: { id: campaignId },
            data: {
                currentAmount: {
                    increment: amount
                }
            }
        }),

        // 2c. Update Creator's Wallet (Deposit)
        prisma.wallet.update({
            where: { userId: campaign.creatorId },
            data: {
                balance: { increment: amount }, // Funds available for withdrawal
                totalReceived: { increment: amount }, // Lifetime total
                transactions: {
                    create: {
                        amount,
                        type: "DEPOSIT"
                    }
                }
            }
        })
    ]);

    return NextResponse.json({ success: true, donation, campaign: updatedCampaign }, { status: 200 });

  } catch (e) {
    return NextResponse.json(
      { error: "Donation failed due to server error.", details: e },
      { status: 500 }
    );
  }
}
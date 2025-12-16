// /app/api/donation/confirm-payment/route.ts (Logic moved from old /create route)

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const donorId = session?.user?.id; // Donor ID is optional if donor is logged out/anonymous

    try {
        // Extract data sent from the client's successful payment confirmation
        const { campaignId, amount, message, anonymous, intentId } = await req.json();
        
        // --- Input Validation ---
        if (!campaignId || !intentId || amount <= 0) {
            return NextResponse.json({ error: "Missing campaign, intent ID, or amount." }, { status: 400 });
        }


        // 💡 CRITICAL: Verify the Payment Intent status with Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(intentId);

        if (paymentIntent.status !== 'succeeded') {
            return NextResponse.json({ 
                error: `Payment not succeeded. Current status: ${paymentIntent.status}` 
            }, { status: 400 });
        }
        
        // --- 1. Fetch Campaign and Creator (CORRECTION APPLIED HERE) ---
        const campaign = await prisma.campaign.findUnique({
             where: { id: campaignId },
             select: { id: true, creatorId: true, title: true }
        });
        
        if (!campaign) { 
            return NextResponse.json({ error: "Campaign not found." }, { status: 404 });
        }

        // 💡 OPTIONAL BUT RECOMMENDED: Re-add Creator Self-Donation Check
        if (donorId && campaign.creatorId === donorId) {
            // Note: In a real system, you would refund this via Stripe, 
            // but for now, we just reject the database write.
            return NextResponse.json({ 
                error: "Creator cannot donate to their own campaign" 
            }, { status: 403 });
        }


        // --- 2. Perform the Transaction (Only if payment is successful) ---
        const [donation, updatedCampaign, updatedWallet] = await prisma.$transaction([

            // 2a. Create donation record
            prisma.donation.create({
                data: {
                    campaignId,
                    donorId,
                    amount,
                    message,
                    anonymous,
                    stripePaymentIntentId: intentId, // Save the verified Stripe ID
                }
            }),

            // 2b. Update campaign's currentAmount (As before)
            prisma.campaign.update({
                where: { id: campaignId },
                data: { currentAmount: { increment: amount } }
            }),

            // 2c. Update Creator's Wallet (Deposit)
            prisma.wallet.update({
                where: { userId: campaign.creatorId },
                data: {
                    balance: { increment: amount }, 
                    totalReceived: { increment: amount }, 
                    transactions: {
                        create: {
                            amount,
                            type: "DEPOSIT", 
                            sourceId: intentId, // Link to the Stripe ID
                        }
                    }
                }
            })
        ]);

        return NextResponse.json({ success: true, donation, campaign: updatedCampaign }, { status: 200 });

    } catch (e: any) {
        console.error("Stripe/DB Transaction Error:", e);
        return NextResponse.json({ error: "Donation processing failed on server.", details: e.message }, { status: 500 });
    }
}
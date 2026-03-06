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
    const donorId = session?.user?.id;

    try {
        const { campaignId, amount, message, anonymous, intentId } = await req.json();
        
        if (!campaignId || !intentId) {
            return NextResponse.json({ error: "Missing campaign or intent ID." }, { status: 400 });
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(intentId);

        if (paymentIntent.status !== 'succeeded') {
            return NextResponse.json({ 
                error: `Payment not succeeded. Current status: ${paymentIntent.status}` 
            }, { status: 400 });
        }

        const verifiedAmount = paymentIntent.amount / 100;
        
        const campaign = await prisma.campaign.findUnique({
             where: { id: campaignId },
             select: { id: true, creatorId: true, title: true }
        });
        
        if (!campaign) { 
            return NextResponse.json({ error: "Campaign not found." }, { status: 404 });
        }

        if (donorId && campaign.creatorId === donorId) {
            return NextResponse.json({ 
                error: "Creator cannot donate to their own campaign" 
            }, { status: 403 });
        }

        const [donation, updatedCampaign, updatedWallet] = await prisma.$transaction([

            prisma.donation.create({
                data: {
                    campaignId,
                    donorId,
                    amount: verifiedAmount,
                    message,
                    anonymous,
                    stripePaymentIntentId: intentId,
                }
            }),

            prisma.campaign.update({
                where: { id: campaignId },
                data: { currentAmount: { increment: verifiedAmount } }
            }),

            prisma.wallet.update({
                where: { userId: campaign.creatorId },
                data: {
                    balance: { increment: verifiedAmount }, 
                    totalReceived: { increment: verifiedAmount }, 
                    transactions: {
                        create: {
                            amount: verifiedAmount,
                            type: "DEPOSIT", 
                            sourceId: intentId,
                            sourceType: "STRIPE_PAYMENT",
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

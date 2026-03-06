// /app/api/donation/create-intent/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
  try {
    const { amount, campaignId } = await req.json();

    if (!amount || amount <= 0 || !campaignId) {
      return NextResponse.json({ error: 'Invalid amount or missing campaign ID.' }, { status: 400 });
    }
    
    const amountInCents = Math.round(parseFloat(amount) * 100);

    if (amountInCents < 50) {
        return NextResponse.json({ error: 'Donation must be at least $0.50.' }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { 
        campaignId: campaignId,
        platform_fee: '0',
      },
    });

    return NextResponse.json({ 
        success: true,
        clientSecret: paymentIntent.client_secret, 
        intentId: paymentIntent.id 
    });

  } catch (error) {
    console.error('Stripe Intent Creation Error:', error);
    return NextResponse.json({ error: 'Failed to create payment intent.' }, { status: 500 });
  }
}
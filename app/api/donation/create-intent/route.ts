// /app/api/donation/create-intent/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your Secret Key from environment variables
// This initialization is outside the handler for efficiency
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // Use the latest stable API version
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
  try {
    // 1. Extract the required data from the client request
    const { amount, campaignId } = await req.json();

    // 2. Validate input and convert amount to cents (Stripe requirement)
    if (!amount || amount <= 0 || !campaignId) {
      return NextResponse.json({ error: 'Invalid amount or missing campaign ID.' }, { status: 400 });
    }
    
    // Stripe charges are handled in the smallest currency unit (e.g., cents)
    const amountInCents = Math.round(parseFloat(amount) * 100);

    // Enforce Stripe's minimum charge limit (usually 50 cents)
    if (amountInCents < 50) {
        return NextResponse.json({ error: 'Donation must be at least $0.50.' }, { status: 400 });
    }

    // 3. Create the Payment Intent via the Stripe API
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd', // Use USD (adjust if your app uses other currencies)
      automatic_payment_methods: { enabled: true },
      
      // Add custom metadata for auditing and linking back to your DB records
      metadata: { 
        campaignId: campaignId,
        platform_fee: '0', // Placeholder for future fee logic
      },
    });

    // 4. Return the client secret and intent ID to the frontend
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
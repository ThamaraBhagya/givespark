// app/api/wallet/withdraw/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  // Ensure the user is authenticated and is a Creator
  if (!session?.user || session.user.role !== 'CREATOR') {
      return NextResponse.json({ error: "Access denied or not a creator." }, { status: 403 });
  }

  const creatorId = session.user.id;

  try {
    const { amount } = await req.json();
    const numericAmount = Number(amount);

    // Input validation
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return NextResponse.json({ error: "Invalid withdrawal amount." }, { status: 400 });
    }

    // Check current balance
    const wallet = await prisma.wallet.findUnique({
        where: { userId: creatorId }
    });

    if (!wallet || wallet.balance < numericAmount) {
        return NextResponse.json({ error: "Insufficient balance in virtual wallet." }, { status: 400 });
    }

    // Update wallet (mock withdrawal - just DB update, no real transfer)
    const updatedWallet = await prisma.wallet.update({
        where: { userId: creatorId },
        data: {
            balance: { decrement: numericAmount },
            withdrawnAmount: { increment: numericAmount },
            transactions: {
                create: {
                    amount: numericAmount,
                    type: "WITHDRAW",
                }
            }
        }
    });

    return NextResponse.json({ 
        success: true, 
        message: "Withdrawal processed successfully (mock mode).",
        wallet: updatedWallet 
    }, { status: 200 });

  } catch (e: any) {
    console.error("Withdrawal Error:", e);
    return NextResponse.json(
      { error: "Withdrawal failed.", details: e.message },
      { status: 500 }
    );
  }
}
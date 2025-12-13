// app/api/wallet/withdraw/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth"; // To identify the creator
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

    // Input validation
    if (amount <= 0) {
        return NextResponse.json({ error: "Invalid withdrawal amount." }, { status: 400 });
    }

    // 1. Check current balance
    const wallet = await prisma.wallet.findUnique({
        where: { userId: creatorId }
    });

    if (!wallet || wallet.balance < amount) {
        return NextResponse.json({ error: "Insufficient balance in virtual wallet." }, { status: 400 });
    }

    // 2. Update Wallet (Deduct balance and log withdrawal)
    const updatedWallet = await prisma.wallet.update({
        where: { userId: creatorId },
        data: {
            balance: { decrement: amount }, // Deduct the available balance
            withdrawnAmount: { increment: amount }, // Log lifetime withdrawn total
            transactions: {
                create: {
                    amount,
                    type: "WITHDRAW" // Log as a withdrawal transaction
                }
            }
        }
    });

    // Mock success message (This is where a real app would interface with a bank)
    return NextResponse.json({ 
        success: true, 
        message: "Mock withdrawal successful. Funds disbursed.", 
        wallet: updatedWallet 
    }, { status: 200 });

  } catch (e) {
    return NextResponse.json(
      { error: "Withdrawal failed.", details: e },
      { status: 500 }
    );
  }
}
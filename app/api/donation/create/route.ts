// // app/api/donation/create/route.ts

// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { getServerSession } from "next-auth"; 
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";// To get donorId

// export async function POST(req: Request) {
//   const session = await getServerSession(authOptions);
//   // Donor ID can be null if the donation is anonymous (which we allow)

//   if (!session?.user?.id) {
//     return NextResponse.json({ 
//       error: "You must be logged in to make a donation" 
//     }, { status: 401 });
//   }
//   const donorId = session.user.id; 

//   try {
//     const body = await req.json();
//     const { campaignId, amount, message, anonymous } = body;

//     // Input validation (simplified)
//     if (!campaignId || amount <= 0) {
//         return NextResponse.json({ error: "Invalid campaign or amount." }, { status: 400 });
//     }

//     // --- 1. Get the Campaign and its Creator ---
//     const campaign = await prisma.campaign.findUnique({
//       where: { id: campaignId },
//       select: { 
//         id: true, 
//         creatorId: true,
//         title: true 
//       }
//     });

//     if (!campaign) {
//         return NextResponse.json({ error: "Campaign not found." }, { status: 404 });
//     }
//     // Prevent creators from donating to their own campaigns
//     if (campaign.creatorId === donorId) {
//       return NextResponse.json({ 
//         error: "Creators cannot donate to their own campaigns" 
//       }, { status: 403 });
//     }

//     const donor = await prisma.user.findUnique({
//       where: { id: donorId },
//       select: { role: true }
//     });

//     if (!donor) {
//       return NextResponse.json({ error: "User not found." }, { status: 404 });
//     }

//     // --- 2. Perform the Transaction (Mock Payment Logic) ---
//     // We use prisma.$transaction to ensure all updates succeed or fail together.
//     const [donation, updatedCampaign, updatedWallet] = await prisma.$transaction([

//         // 2a. Create donation record
//         prisma.donation.create({
//             data: {
//                 campaignId,
//                 donorId,
//                 amount,
//                 message,
//                 anonymous
//             }
//         }),

//         // 2b. Update campaign's currentAmount (Real-Time Update simulation)
//         prisma.campaign.update({
//             where: { id: campaignId },
//             data: {
//                 currentAmount: {
//                     increment: amount
//                 }
//             }
//         }),

//         // 2c. Update Creator's Wallet (Deposit)
//         prisma.wallet.update({
//             where: { userId: campaign.creatorId },
//             data: {
//                 balance: { increment: amount }, // Funds available for withdrawal
//                 totalReceived: { increment: amount }, // Lifetime total
//                 transactions: {
//                     create: {
//                         amount,
//                         type: "DEPOSIT"
//                     }
//                 }
//             }
//         })
//     ]);

//     return NextResponse.json({ success: true, donation, campaign: updatedCampaign }, { status: 200 });

//   } catch (e) {
//     return NextResponse.json(
//       { error: "Donation failed due to server error.", details: e },
//       { status: 500 }
//     );
//   }
// }
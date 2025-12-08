// app/campaign/[id]/page.tsx
import prisma from '@/lib/prisma';
import DonationModal from '@/components/DonationModal';
// Import your server-side auth helper if needed to check creator access
import { notFound } from 'next/navigation'; 
import CampaignDetailClient from './CampaignDetailClient'; // Client wrapper for the modal


interface CampaignDetailPageProps {
  params: { id: string };
}

// Server Component to fetch immutable data
async function getCampaignData(id: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: { 
      creator: { select: { name: true } }, // Include creator name
      donations: { orderBy: { createdAt: 'desc' }, take: 10 } // Get recent donations
    }
  });
  return campaign;
}

export default async function CampaignDetailsPage({ params }: CampaignDetailPageProps) {
  const campaign = await getCampaignData(params.id);

  if (!campaign) {
    notFound();
  }

  const fundedPercentage = Math.min(100, (campaign.currentAmount / campaign.goalAmount) * 100);

  // Pass the initial server-fetched data to a client component
  // This ensures the client component can re-fetch updated data after a donation.
  return (
    <CampaignDetailClient 
        campaignId={campaign.id} 
        initialCampaignData={JSON.parse(JSON.stringify(campaign))} 
        fundedPercentage={fundedPercentage}
    />
  );
}
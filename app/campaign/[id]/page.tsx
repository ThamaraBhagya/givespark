// app/campaign/[id]/page.tsx
import prisma from '@/lib/prisma';
import DonationModal from '@/components/DonationModal';

import { notFound } from 'next/navigation'; 
import CampaignDetailClient from './CampaignDetailClient';


interface CampaignDetailPageProps {
  params: Promise<{ id: string }>;
}

// Server Component to fetch immutable data
async function getCampaignData(id: string) {
  const campaign = await prisma.campaign.findUnique({
   where: { id },
  include: {
    creator: true,
    donations: {
      orderBy: { createdAt: 'desc' },
      include: {
        donor: { 
          select: { name: true, image: true }
        }
      }
    }
  }
  });
  return campaign;
}

export default async function CampaignDetailsPage({ params }: CampaignDetailPageProps) {
  const{ id } = await params;
  const campaign = await getCampaignData(id);

  if (!campaign) {
    notFound();
  }

  const fundedPercentage = Math.min(100, (campaign.currentAmount / campaign.goalAmount) * 100);

  
  return (
    <CampaignDetailClient 
        campaignId={campaign.id} 
        initialCampaignData={JSON.parse(JSON.stringify(campaign))} 
        fundedPercentage={fundedPercentage}
    />
  );
}
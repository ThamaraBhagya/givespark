// app/campaign/[id]/CampaignDetailClient.tsx
"use client";

import { useState, useCallback } from 'react';
import DonationModal from '@/components/DonationModal';
import Image from 'next/image';
// Import any other necessary components like ModalContainer

// Define the type for the campaign data structure
interface CampaignDataType {
  id: string;
  title: string;
  description: string;
  featuredImage: string;
  currentAmount: number;
  goalAmount: number;
  creator: { name: string };
  // Include other necessary fields
}

interface ClientProps {
    campaignId: string;
    initialCampaignData: CampaignDataType;
    fundedPercentage: number;
}

export default function CampaignDetailClient({ campaignId, initialCampaignData, fundedPercentage }: ClientProps) {
  const [campaignData, setCampaignData] = useState<CampaignDataType>(initialCampaignData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPercentage, setCurrentPercentage] = useState(fundedPercentage);

  // Function to re-fetch data after a successful donation
  const refreshCampaignData = useCallback(async (donatedAmount: number) => {
    // In a real app, this would be an API call to /api/campaign/[id]
    // For simplicity, we mock the update instantly on the client for demo effect:
    //const newDonationAmount = 500; // Assume a default donation

    const newAmount = campaignData.currentAmount + donatedAmount;
    const newPercent = Math.min(100, (newAmount / campaignData.goalAmount) * 100);

    setCampaignData(prev => ({ 
        ...prev, 
        currentAmount: newAmount,
        // You would also fetch and append the new donation to a list here
    }));
    setCurrentPercentage(newPercent);
    setIsModalOpen(false);
    // NOTE: For a multi-user demo, you would need WebSockets or server re-fetching here.
  }, [campaignData.currentAmount, campaignData.goalAmount]);

  return (
    <div className="max-w-6xl mx-auto p-8">

      {/* Campaign Header & Image */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-extrabold text-gray-900">{campaignData.title}</h1>
          <p className="text-lg text-gray-600 mt-2">By {campaignData.creator.name}</p>

          <div className="relative h-96 w-full mt-6 rounded-xl overflow-hidden">
            <Image src={campaignData.featuredImage || '/placeholder.jpg'} alt={campaignData.title} layout="fill" objectFit="cover" />
          </div>

          <h2 className="text-2xl font-bold mt-8">The Story</h2>
          <p className="mt-4 text-gray-700 whitespace-pre-wrap">{campaignData.description}</p>
        </div>

        {/* Sidebar: Funding Status & Donate Button */}
        <div className="lg:col-span-1 space-y-6">

          {/* Funding Box */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-200">
            <p className="text-3xl font-bold text-gray-900">
              ${campaignData.currentAmount.toFixed(2)}
            </p>
            <p className="text-gray-500 mt-1">
              raised of ${campaignData.goalAmount.toFixed(2)} goal
            </p>

            {/* Progress Bar */}
            <div className="h-3 bg-gray-200 rounded-full mt-4">
              <div 
                className="h-3 rounded-full bg-teal-500 transition-all duration-500" 
                style={{ width: `${currentPercentage}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-teal-600 font-semibold">{currentPercentage.toFixed(1)}% Funded</p>

            {/* Donate Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
            >
              Donate Now
            </button>
          </div>

          {/* Creator Info / Deadline, etc. */}
          {/* ... */}
        </div>
      </div>

      {/* Modal Container (Simple placeholder for modal display) */}
      {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl max-w-lg w-full">
                  <DonationModal 
                      campaignId={campaignId} 
                      campaignTitle={campaignData.title}
                      onClose={() => setIsModalOpen(false)} 
                      onSuccess={refreshCampaignData}
                  />
              </div>
          </div>
      )}
    </div>
  );
}
"use client";

import { useState, useCallback } from 'react';
import DonationModal from '@/components/DonationModal';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ClockIcon, HeartIcon, TrophyIcon, UserIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Donation {
  id: string;
  amount: number;
  createdAt: string;
  donor: { name: string; image?: string };
}

interface CampaignDataType {
  id: string;
  title: string;
  description: string;
  featuredImage: string;
  currentAmount: number;
  goalAmount: number;
  creator: { name: string, id: string; };
  donations: Donation[];
}

interface ClientProps {
    campaignId: string;
    initialCampaignData: CampaignDataType;
    fundedPercentage: number;
}

export default function CampaignDetailClient({ campaignId, initialCampaignData, fundedPercentage }: ClientProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [campaignData, setCampaignData] = useState<CampaignDataType>(initialCampaignData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPercentage, setCurrentPercentage] = useState(fundedPercentage);

  const refreshCampaignData = useCallback(async (donatedAmount: number, newDonation?: Donation) => {
    const newAmount = campaignData.currentAmount + donatedAmount;
    const newPercent = Math.min(100, (newAmount / campaignData.goalAmount) * 100);

    setCampaignData(prev => ({ 
        ...prev, 
        currentAmount: newAmount,
        donations: newDonation ? [newDonation, ...prev.donations] : prev.donations
    }));
    setCurrentPercentage(newPercent);
    setIsModalOpen(false);
  }, [campaignData.currentAmount, campaignData.goalAmount]);

  const handleDonateClick = () => {
    if (status === 'loading') return;
    if (!session) {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/campaign/${campaignId}`)}`);
      return;
    }
    if (session.user?.role === 'CREATOR' && session.user?.id === initialCampaignData.creator?.id) {
      alert("Creators cannot donate to their own campaigns");
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Campaign Content */}
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-extrabold text-gray-900">{campaignData.title}</h1>
          <p className="text-lg text-gray-600 mt-2">By {campaignData.creator.name}</p>

          <div className="relative h-96 w-full mt-6 rounded-xl overflow-hidden shadow-lg">
            <Image src={campaignData.featuredImage || '/placeholder.jpg'} alt={campaignData.title} fill className="object-cover" />
          </div>

          <h2 className="text-2xl font-bold mt-8">The Story</h2>
          <p className="mt-4 text-gray-700 whitespace-pre-wrap leading-relaxed">{campaignData.description}</p>
        </div>

        {/* RIGHT COLUMN: Sidebar (Funding & Donations) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 sticky top-24">
            <p className="text-3xl font-bold text-gray-900">
              ${campaignData.currentAmount.toLocaleString()}
            </p>
            <p className="text-gray-500 mt-1 text-sm">
              raised of ${campaignData.goalAmount.toLocaleString()} goal
            </p>

            {/* Progress Bar */}
            <div className="h-3 bg-gray-100 rounded-full mt-4 overflow-hidden">
              <div 
                className="h-3 rounded-full bg-teal-500 transition-all duration-700 ease-out" 
                style={{ width: `${currentPercentage}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-teal-600 font-semibold">{currentPercentage.toFixed(1)}% Funded</p>

            {/* Donate Button */}
            <button
              onClick={handleDonateClick}
              className="w-full mt-6 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md active:scale-[0.98]"
            >
              Donate Now
            </button>

            {!session && status !== 'loading' && (
              <p className="mt-2 text-xs text-gray-500 text-center">Please sign in to donate</p>
            )}

            {/* 💡 RECENT DONATIONS LIST (Now inside the Sidebar) */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-md font-bold text-gray-900 flex items-center mb-4">
                <HeartIcon className="w-4 h-4 mr-2 text-red-500 fill-red-500" />
                Recent Donors ({campaignData.donations.length})
              </h3>

              <div className="space-y-5 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                {campaignData.donations.length > 0 ? (
                  campaignData.donations.map((donation, index) => (
                    <div key={donation.id} className="flex items-start space-x-3 animate-fadeIn">
                      <div className="relative shrink-0">
                        <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden">
                          {donation.donor?.image ? (
                            <img src={donation.donor.image} className="h-full w-full object-cover" alt="" />
                          ) : (
                            <UserIcon className="w-4 h-4 text-indigo-300" />
                          )}
                        </div>
                        {/* 1st Donor Badge (Last item in array usually) */}
                        {index === campaignData.donations.length - 1 && (
                            <TrophyIcon className="w-3.5 h-3.5 text-yellow-500 absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                           <p className="text-sm font-bold text-gray-900 truncate mr-2">
                             {donation.donor?.name || "Kind Soul"}
                           </p>
                           <p className="text-sm font-black text-gray-900 shrink-0">${donation.amount}</p>
                        </div>
                        <p className="text-[10px] text-gray-400 flex items-center mt-0.5">
                          <ClockIcon className="w-3 h-3 mr-1" />
                          {formatDistanceToNow(new Date(donation.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm italic text-center py-4">Be the first to donate!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      {isModalOpen && session && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
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
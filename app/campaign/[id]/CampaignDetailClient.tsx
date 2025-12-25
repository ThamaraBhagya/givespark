"use client";

import { useState, useCallback } from 'react';
import DonationModal from '@/components/DonationModal';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ClockIcon, HeartIcon, TrophyIcon, UserIcon, ShieldCheckIcon, Share2Icon } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0a0f1d] text-white pb-20">
      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT COLUMN: Campaign Content */}
          <div className="lg:col-span-2 space-y-12">
            <header className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-widest">
                <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                Active Campaign
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                {campaignData.title}
              </h1>

              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-teal-500 p-[1px]">
                  <div className="h-full w-full rounded-2xl bg-[#0a0f1d] flex items-center justify-center font-bold text-white">
                    {campaignData.creator.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-teal-400 uppercase font-black tracking-[0.2em]">Project Lead</p>
                  <p className="text-white text-lg font-bold">{campaignData.creator.name}</p>
                </div>
              </div>
            </header>

            {/* Main Image Card */}
            <div className="group relative aspect-video w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shadow-black">
              <Image 
                src={campaignData.featuredImage || '/placeholder.jpg'} 
                alt={campaignData.title} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-transparent to-transparent opacity-40" />
            </div>

            <section className="bg-white/5 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/10">
              <h2 className="text-3xl font-black text-white flex items-center mb-8">
                <span className="w-1.5 h-8 bg-gradient-to-b from-teal-400 to-indigo-600 mr-4 rounded-full" />
                The Story
              </h2>
              <p className="text-xl text-gray-400 whitespace-pre-wrap leading-relaxed font-light italic">
                {campaignData.description}
              </p>
            </section>
          </div>

          {/* RIGHT COLUMN: Sidebar (Funding & Donations) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-8">
              
              {/* Funding Card */}
              <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-indigo-600" />
                
                <div className="space-y-8">
                  <div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-6xl font-black text-white tracking-tighter">${campaignData.currentAmount.toLocaleString()}</span>
                    </div>
                    <p className="text-gray-400 mt-2 font-medium">
                      pledged of <span className="text-white font-bold">${campaignData.goalAmount.toLocaleString()}</span> goal
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-4">
                    <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-teal-400 to-indigo-500 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(45,212,191,0.3)]" 
                        style={{ width: `${currentPercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-teal-400 font-black text-xs tracking-widest uppercase">
                        {currentPercentage.toFixed(1)}% Funded
                      </span>
                      <div className="flex items-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2 animate-pulse" />
                        Live
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleDonateClick}
                    className="w-full py-5 bg-teal-400 text-[#0a0f1d] font-black text-xl rounded-2xl hover:bg-teal-300 transition-all shadow-xl shadow-teal-500/20 active:scale-[0.97] flex items-center justify-center space-x-3"
                  >
                    <HeartIcon className="w-6 h-6 fill-[#0a0f1d]" />
                    <span>Back this project</span>
                  </button>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <ShieldCheckIcon className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Secure Payment</span>
                    </div>
                    <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                      <Share2Icon className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* RECENT DONATIONS LIST */}
              <div className="bg-white/5 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/10">
                <h3 className="text-xl font-black text-white flex items-center mb-8">
                  <HeartIcon className="w-5 h-5 mr-3 text-teal-400 fill-teal-400/20" />
                  Recent Backers
                </h3>

                <div className="space-y-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {campaignData.donations.length > 0 ? (
                    campaignData.donations.map((donation, index) => (
                      <div key={donation.id} className="flex items-center space-x-4 group">
                        <div className="relative shrink-0">
                          <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110">
                            {/* 💡 Fixed: Optional Chaining to prevent TypeError */}
                            {donation.donor?.image ? (
                              <img src={donation.donor.image} className="h-full w-full object-cover" alt="" />
                            ) : (
                              <UserIcon className="w-6 h-6 text-gray-600" />
                            )}
                          </div>
                          {index === 0 && (
                            <div className="absolute -top-2 -left-2 bg-gradient-to-br from-yellow-400 to-amber-600 text-white p-1 rounded-lg shadow-lg">
                              <TrophyIcon className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                             <p className="text-sm font-bold text-white truncate pr-2">
                               {donation.donor?.name || "Anonymous Backer"}
                             </p>
                             <p className="text-sm font-black text-teal-400">
                               ${donation.amount}
                             </p>
                          </div>
                          <p className="text-[10px] text-gray-500 flex items-center mt-1 font-black uppercase tracking-widest">
                            <ClockIcon className="w-3 h-3 mr-1" />
                            {formatDistanceToNow(new Date(donation.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 opacity-30">
                      <p className="text-gray-400 text-sm italic uppercase tracking-widest font-black">Waiting for first spark</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Modal Overlay */}
      {isModalOpen && session && (
        <div className="fixed inset-0 bg-[#0a0f1d]/80 backdrop-blur-xl flex items-center justify-center z-[100] p-4 transition-all duration-300">
          <div className="bg-white rounded-[3rem] max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
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
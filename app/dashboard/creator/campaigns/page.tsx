"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRightIcon, 
  PlusCircleIcon, 
  ChartBarIcon, 
  CalendarIcon, 
  RocketLaunchIcon,
  ArrowTrendingUpIcon 
} from '@heroicons/react/24/outline';

type CampaignSummary = {
    id: string;
    title: string;
    currentAmount: number;
    goalAmount: number;
    createdAt: string;
};

export default function MyCampaignsPage() {
    const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchMyCampaigns = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/campaign/my');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch your campaigns.');
            }
            const data = await response.json();
            setCampaigns(data.campaigns || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyCampaigns();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500 font-black tracking-widest uppercase text-xs">Fetching Your Spark List...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 bg-[#0a0f1d] min-h-screen text-white p-3">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <RocketLaunchIcon className="w-3 h-3" />
                        <span>Campaign Management</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                        My Campaigns <span className="text-gray-600 ml-2">({campaigns.length})</span>
                    </h1>
                </div>
                
                <Link
                    href="/campaign/new"
                    className="group relative flex items-center space-x-3 px-8 py-4 bg-teal-400 text-[#0a0f1d] font-black rounded-2xl shadow-xl shadow-teal-500/20 hover:bg-teal-300 transition-all active:scale-95"
                >
                    <PlusCircleIcon className="w-6 h-6 transition-transform group-hover:rotate-90" />
                    <span>Launch New Spark</span>
                </Link>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl animate-in fade-in">
                    {error}
                </div>
            )}

            {/* --- CAMPAIGN FEED --- */}
            {campaigns.length === 0 ? (
                <div className="text-center py-24 bg-white/[0.02] border-2 border-dashed border-white/10 rounded-[2.5rem] backdrop-blur-md">
                    <ChartBarIcon className="w-20 h-20 text-gray-800 mx-auto mb-6" />
                    <p className="text-2xl font-black text-white mb-2">No active sparks found.</p>
                    <p className="text-gray-500 font-medium mb-10">Your journey to change starts with a single campaign.</p>
                    <Link 
                        href="/campaign/new"
                        className="inline-flex items-center space-x-3 text-teal-400 hover:text-teal-300 font-black uppercase tracking-widest text-xs transition-all group"
                    >
                        <span>Ignite your first campaign</span>
                        <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {campaigns.map((campaign) => {
                        const fundedPercentage = Math.min(100, (campaign.currentAmount / campaign.goalAmount) * 100);
                        
                        return (
                            <div 
                                key={campaign.id} 
                                className="group relative bg-white/[0.03] border border-white/5 p-8 rounded-[2rem] backdrop-blur-xl flex flex-col lg:flex-row lg:items-center justify-between transition-all duration-500 hover:bg-white/[0.06] hover:border-teal-500/30"
                            >
                                {/* Title & Meta */}
                                <div className="flex-1 lg:max-w-md">
                                    <Link href={`/campaign/${campaign.id}`} className="block">
                                        <h3 className="text-2xl font-black text-white group-hover:text-teal-400 transition-colors line-clamp-1 tracking-tight">
                                            {campaign.title}
                                        </h3>
                                    </Link>
                                    <div className="flex items-center mt-3 text-gray-500 space-x-4">
                                        <div className="flex items-center text-[10px] font-black uppercase tracking-widest">
                                            <CalendarIcon className="w-4 h-4 mr-2 text-indigo-500" />
                                            {new Date(campaign.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="h-1 w-1 bg-gray-800 rounded-full" />
                                        <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-teal-500">
                                            <ArrowTrendingUpIcon className="w-4 h-4 mr-2" />
                                            Active
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Mid Section: Progress */}
                                <div className="flex-1 max-w-sm my-8 lg:my-0 lg:mx-12">
                                    <div className="flex justify-between items-end mb-2">
                                        <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest">
                                            {fundedPercentage.toFixed(1)}% Funded
                                        </p>
                                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                                            Target Reach
                                        </p>
                                    </div>
                                    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <div 
                                            className="h-full rounded-full bg-gradient-to-r from-teal-400 to-indigo-600 transition-all duration-1000 shadow-[0_0_15px_rgba(45,212,191,0.3)]" 
                                            style={{ width: `${fundedPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Right Section: Stats & Action */}
                                <div className="flex items-center justify-between lg:justify-end lg:space-x-12">
                                    <div className="text-left lg:text-right">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Pledged</p>
                                        <p className="text-2xl font-black text-white tracking-tighter">
                                            ${campaign.currentAmount.toLocaleString()}
                                            <span className="text-xs text-gray-600 ml-1 font-bold">/ ${campaign.goalAmount.toLocaleString()}</span>
                                        </p>
                                    </div>
                                    <Link 
                                        href={`/campaign/${campaign.id}`}
                                        className="p-4 bg-white/5 rounded-2xl text-gray-400 group-hover:text-teal-400 group-hover:bg-teal-400/10 transition-all"
                                    >
                                        <ArrowRightIcon className="w-6 h-6" />
                                    </Link>
                                </div>

                                {/* Subtle Signature Accent Line */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-teal-400 to-indigo-600 transition-all duration-500 group-hover:w-full rounded-b-[2rem]" />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
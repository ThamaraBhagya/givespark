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
            <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white dark:bg-[#0a0f1d]">
                <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-600 dark:text-gray-500 font-black tracking-widest uppercase text-xs">Fetching Your Spark List...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 md:space-y-10 bg-white dark:bg-[#0a0f1d] min-h-screen text-slate-900 dark:text-white p-4 sm:p-6 md:p-8">
            {/* --- HEADER --- */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
                <div className="flex-1">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <RocketLaunchIcon className="w-3 h-3" />
                        <span>Campaign Management</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                        My Campaigns <span className="text-slate-600 dark:text-gray-600 ml-2">({campaigns.length})</span>
                    </h1>
                </div>
                
                <Link
                    href="/campaign/new"
                    className="group relative flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-indigo-600 text-white dark:bg-teal-400 dark:text-[#0a0f1d] font-black rounded-xl sm:rounded-2xl shadow-xl shadow-indigo-500/20 dark:shadow-teal-500/20 hover:bg-indigo-500 dark:hover:bg-teal-300 transition-all active:scale-95 text-sm sm:text-base"
                >
                    <PlusCircleIcon className="w-5 sm:w-6 h-5 sm:h-6 transition-transform group-hover:rotate-90 flex-shrink-0" />
                    <span>Launch New Spark</span>
                </Link>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 rounded-2xl animate-in fade-in">
                    {error}
                </div>
            )}

            {/* --- CAMPAIGN FEED --- */}
            {campaigns.length === 0 ? (
                <div className="text-center py-16 sm:py-20 md:py-24 bg-white border-2 border-dashed border-indigo-200 dark:bg-white/2 dark:border-white/10 rounded-2xl sm:rounded-4xl backdrop-blur-md px-4 sm:px-6">
                    <ChartBarIcon className="w-16 sm:w-20 h-16 sm:h-20 text-slate-400 dark:text-white/30 mx-auto mb-4 sm:mb-6" />
                    <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">No active sparks found.</p>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-gray-500 font-medium mb-8 sm:mb-10">Your journey to change starts with a single campaign.</p>
                    <Link 
                        href="/campaign/new"
                        className="inline-flex items-center space-x-2 sm:space-x-3 text-indigo-600 hover:text-indigo-500 dark:text-teal-400 dark:hover:text-teal-300 font-black uppercase tracking-widest text-xs sm:text-sm transition-all group"
                    >
                        <span>Ignite your first campaign</span>
                        <ArrowRightIcon className="w-3 sm:w-4 h-3 sm:h-4 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    {campaigns.map((campaign) => {
                        const fundedPercentage = Math.min(100, (campaign.currentAmount / campaign.goalAmount) * 100);
                        
                        return (
                            <div 
                                key={campaign.id} 
                                className="group relative bg-white border border-slate-200 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-4xl shadow-sm dark:shadow-none dark:bg-white/3 dark:border-white/5 backdrop-blur-xl flex flex-col gap-6 md:gap-0 md:flex-row md:items-center justify-between transition-all duration-500 hover:bg-slate-50 dark:hover:bg-white/6 hover:border-indigo-300 dark:hover:border-teal-500/30"
                            >
                                {/* Title & Meta */}
                                <div className="flex-1 md:max-w-md">
                                    <Link href={`/campaign/${campaign.id}`} className="block">
                                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1 tracking-tight">
                                            {campaign.title}
                                        </h3>
                                    </Link>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center mt-3 text-slate-600 dark:text-gray-500 space-y-2 sm:space-y-0 sm:space-x-4">
                                        <div className="flex items-center text-[10px] font-black uppercase tracking-widest">
                                            <CalendarIcon className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                                            {new Date(campaign.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="hidden sm:block h-1 w-1 bg-slate-300 dark:bg-gray-800 rounded-full" />
                                        <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-teal-500">
                                            <ArrowTrendingUpIcon className="w-4 h-4 mr-2" />
                                            Active
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Mid Section: Progress */}
                                <div className="w-full md:flex-1 md:max-w-sm md:mx-12">
                                    <div className="flex justify-between items-end mb-2">
                                        <p className="text-[10px] font-black text-indigo-600 dark:text-teal-400 uppercase tracking-widest">
                                            {fundedPercentage.toFixed(1)}% Funded
                                        </p>
                                        <p className="text-[10px] text-slate-600 dark:text-gray-600 font-bold uppercase tracking-widest">
                                            Target Reach
                                        </p>
                                    </div>
                                    <div className="h-2.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
                                        <div 
                                            className="h-full rounded-full bg-linear-to-r from-indigo-600 to-teal-500 dark:from-teal-400 dark:to-indigo-600 transition-all duration-1000 shadow-[0_0_15px_rgba(45,212,191,0.3)]" 
                                            style={{ width: `${fundedPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Right Section: Stats & Action */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:gap-0 md:justify-end md:space-x-8 lg:space-x-12 w-full md:w-auto">
                                    <div className="text-left sm:text-left flex-1 sm:flex-none">
                                        <p className="text-[10px] font-black text-slate-600 dark:text-gray-500 uppercase tracking-widest mb-1">Total Pledged</p>
                                        <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                                            ${campaign.currentAmount.toLocaleString()}
                                            <span className="text-xs text-slate-600 dark:text-gray-600 ml-1 font-bold">/ ${campaign.goalAmount.toLocaleString()}</span>
                                        </p>
                                    </div>
                                    <Link 
                                        href={`/campaign/${campaign.id}`}
                                        className="p-3 sm:p-4 bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-slate-600 hover:text-indigo-600 hover:bg-slate-50 dark:bg-white/5 dark:border-white/5 dark:text-gray-400 dark:hover:text-teal-400 dark:hover:bg-teal-400/10 transition-all flex-shrink-0"
                                    >
                                        <ArrowRightIcon className="w-5 sm:w-6 h-5 sm:h-6" />
                                    </Link>
                                </div>

                                {/* Subtle Signature Accent Line */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-linear-to-r from-indigo-600 to-teal-500 dark:from-teal-400 dark:to-indigo-600 transition-all duration-500 group-hover:w-full rounded-b-2xl sm:rounded-b-4xl" />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
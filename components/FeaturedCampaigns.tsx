"use client";

import { useState, useEffect } from 'react';
import CampaignCard from '@/components/CampaignCard';
import Link from 'next/link';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';

interface CampaignData {
  id: string;
  title: string;
  shortDesc: string;
  featuredImage: string;
  currentAmount: number;
  goalAmount: number;
}

export default function FeaturedCampaigns() {
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const response = await fetch('/api/campaign/featured');
        if (!response.ok) throw new Error('Failed to fetch featured campaigns');
        const data = await response.json();
        setCampaigns(data.campaigns || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  if (loading) return (
    <div className="bg-white dark:bg-[#0a0f1d] py-32 text-center">
      <div className="inline-block w-8 h-8 border-4 border-indigo-200 dark:border-indigo-500/20 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-600 dark:text-gray-500 font-medium tracking-widest uppercase text-xs">Loading Featured Projects</p>
    </div>
  );

  if (error) return (
    <div className="bg-white dark:bg-[#0a0f1d] py-32 text-center text-red-600 dark:text-red-400 font-mono text-sm">
      Error: {error}
    </div>
  );

  return (
    <section className="relative py-24 sm:py-32 bg-white dark:bg-[#0a0f1d] overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/15 dark:bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/20 dark:bg-teal-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-sm font-black text-teal-600 dark:text-teal-400 tracking-[0.3em] uppercase mb-4 text-center md:text-left">
              Featured Campaigns
            </h2>
            <p className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight text-center md:text-left">
              Projects Changing the <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-indigo-600 dark:from-teal-400 dark:to-indigo-400">World Now</span>
            </p>
          </div>
          <Link 
            href="/campaign/list" 
            className="hidden md:flex items-center space-x-2 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors font-bold group"
          >
            <span>Explore all projects</span>
            <ArrowUpRightIcon className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>

        {/* Campaign Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="group relative">
               {/* 💡 The same subtle bottom action line for card consistency */}
               <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-indigo-600 to-teal-600 dark:from-teal-400 dark:to-indigo-500 transition-all duration-500 group-hover:w-full z-20 rounded-full"></div>
               
               {/* Note: Ensure CampaignCard internal UI is updated to dark mode/glassmorphism if possible */}
               <CampaignCard campaign={campaign} />
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-16 text-center md:hidden">
          <Link 
            href="/campaign/list" 
            className="inline-flex items-center space-x-2 px-8 py-3 bg-indigo-600 dark:bg-white/5 border border-indigo-200 dark:border-white/10 text-white font-bold rounded-full hover:bg-indigo-700 dark:hover:bg-white/10 transition-all"
          >
            <span>View All Campaigns</span>
            <ArrowUpRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
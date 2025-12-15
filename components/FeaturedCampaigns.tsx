// components/FeaturedCampaigns.tsx
"use client"; // This component needs to fetch data on the client

import { useState, useEffect } from 'react';
import CampaignCard from '@/components/CampaignCard';
import Link from 'next/link';

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
        if (!response.ok) {
          throw new Error('Failed to fetch featured campaigns');
        }
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

  if (loading) {
    return <div className="text-center py-20">Loading featured campaigns...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">Error loading campaigns: {error}</div>;
  }

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Featured Campaigns</h2>
          <p className="mt-2 text-4xl font-extrabold text-gray-900">
            Projects Changing the World Now
          </p>
        </div>

        {/* Campaign Grid (6 Campaigns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>

        {/* CTA to All Campaigns */}
        <div className="mt-12 text-center">
          <Link 
            href="/campaign/list" 
            className="px-8 py-3 border border-indigo-600 text-lg font-medium rounded-lg text-indigo-600 hover:bg-indigo-50 transition duration-300"
          >
            View All Campaigns →
          </Link>
        </div>

      </div>
    </section>
  );
}
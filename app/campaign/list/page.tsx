// app/campaign/list/page.tsx
"use client";

import { useState, useEffect } from 'react';
import CampaignCard from '@/components/CampaignCard'; // Reuse your card component
import { FunnelIcon } from '@heroicons/react/24/outline';

// Define the campaign data structure
interface CampaignData {
    id: string;
    title: string;
    shortDesc: string;
    featuredImage: string;
    currentAmount: number;
    goalAmount: number;
}

export default function AllCampaignsPage() {
    const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchAllCampaigns() {
            try {
                const response = await fetch('/api/campaign/list');
                if (!response.ok) {
                    throw new Error('Failed to fetch all campaigns');
                }
                const data = await response.json();
                setCampaigns(data.campaigns || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchAllCampaigns();
    }, []);

    if (loading) {
        return <div className="text-center py-20">Loading campaigns feed...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">Error loading campaigns: {error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-white">Explore All Campaigns</h1>

            {/* Optional: Filter/Sort Bar */}
            <div className="flex justify-between items-center mb-8 p-4 bg-gray-50 rounded-lg border">
                <p className="text-gray-700 font-medium">{campaigns.length} active campaigns found.</p>
                <button className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800">
                     <FunnelIcon className="w-5 h-5" />
                     <span>Filter</span>
                </button>
            </div>

            {/* Campaign Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {campaigns.map((campaign) => (
                    // CampaignCard component handles the link to /campaign/[id]
                    <CampaignCard key={campaign.id} campaign={campaign} /> 
                ))}
            </div>
        </div>
    );
}
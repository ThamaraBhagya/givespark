// app/dashboard/creator/campaigns/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRightIcon, PlusCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline';

// Define types based on the data fetched from the /api/campaign/my route
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
                // If 403 (Forbidden), the layout should have redirected, 
                // but this handles other errors (e.g., 500 server error).
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
        return <div className="p-8 text-center text-gray-600">Loading your campaigns...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">My Campaigns ({campaigns.length})</h1>
                <Link
                    href="/campaign/new"
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition"
                >
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>Create New Campaign</span>
                </Link>
            </div>

            {error && <p className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</p>}

            {/* Campaign List/Grid */}
            {campaigns.length === 0 ? (
                <div className="text-center p-10 border-2 border-dashed border-gray-300 rounded-xl bg-white">
                    <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-600">You haven't launched any campaigns yet.</p>
                    <Link 
                        href="/campaign/new"
                        className="mt-4 inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        <span>Start your first campaign</span>
                        <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {campaigns.map((campaign) => {
                        const fundedPercentage = Math.min(100, (campaign.currentAmount / campaign.goalAmount) * 100);
                        
                        return (
                            <div 
                                key={campaign.id} 
                                className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center hover:shadow-lg transition"
                            >
                                <div className="flex-1 min-w-0">
                                    <Link href={`/campaign/${campaign.id}`} className="text-xl font-bold text-gray-900 hover:text-indigo-600 truncate">
                                        {campaign.title}
                                    </Link>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Launched: {new Date(campaign.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                
                                <div className="w-1/3 min-w-[200px] mx-8">
                                    {/* Progress Bar */}
                                    <div className="h-2 bg-gray-200 rounded-full">
                                        <div 
                                            className="h-2 rounded-full bg-teal-500 transition-all duration-500" 
                                            style={{ width: `${fundedPercentage}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{fundedPercentage.toFixed(1)}% Funded</p>
                                </div>

                                <div className="text-right">
                                    <p className="text-lg font-semibold text-gray-900">${campaign.currentAmount.toFixed(2)}</p>
                                    <p className="text-sm text-gray-500">Goal: ${campaign.goalAmount.toFixed(2)}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
// app/campaign/list/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import CampaignCard from '@/components/CampaignCard'; // Reuse your card component
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Define the campaign data structure
interface CampaignData {
    id: string;
    title: string;
    shortDesc: string;
    featuredImage: string;
    currentAmount: number;
    goalAmount: number;
    category: string;
}
const CATEGORIES = ["ALL", "EDUCATION", "MEDICAL", "TECHNOLOGY", "COMMUNITY", "OTHER"];

export default function AllCampaignsPage() {
    const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 💡 Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'FUNDED'>('ALL');

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

    // 💡 Live Filtering Logic
    const filteredCampaigns = useMemo(() => {
        return campaigns.filter((c) => {
            // 1. Search Logic
            const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 c.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
            
            // 2. Category Logic
                 const campaignCategory = c.category?.toUpperCase() || 'OTHER';
            const selectedCat = selectedCategory.toUpperCase();
            const matchesCategory = selectedCat === 'ALL' || campaignCategory === selectedCat;
            
            // 3. Status Logic (Goal reached or not)
            const isFunded = c.currentAmount >= c.goalAmount;
            const matchesStatus = statusFilter === 'ALL' || 
                                 (statusFilter === 'FUNDED' && isFunded) || 
                                 (statusFilter === 'ACTIVE' && !isFunded);

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [campaigns, searchQuery, selectedCategory, statusFilter]);

    if (loading) {
        return <div className="text-center py-20">Loading campaigns feed...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">Error loading campaigns: {error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-white">Explore All Campaigns</h1>

            {/* 🛠️ FILTER BAR */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-6 bg-white rounded-xl shadow-sm border">
                
                {/* Search */}
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Search title..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Category Dropdown */}
                <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700 font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>
                            {cat === "ALL" ? "All Categories" : cat.charAt(0) + cat.slice(1).toLowerCase()}
                        </option>
                    ))}
                </select>

                {/* Status Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                    {(['ALL', 'ACTIVE', 'FUNDED'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                                statusFilter === status 
                                ? 'bg-white text-indigo-600 shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>
            {/* 💡 Result Counter */}
            <p className="text-gray-400 mb-6 font-medium">
                Showing {filteredCampaigns.length} {filteredCampaigns.length === 1 ? 'campaign' : 'campaigns'}
            </p>
            

            {/* 💡 Conditional Grid Rendering */}
            {filteredCampaigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {/* 💡 Using the filtered list here */}
                    {filteredCampaigns.map((campaign) => (
                        <CampaignCard key={campaign.id} campaign={campaign} /> 
                    ))}
                </div>
            ) : (
                /* 💡 Empty State */
                <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-dashed border-gray-600">
                    <FunnelIcon className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                    <h3 className="text-lg font-medium text-white">No campaigns found</h3>
                    <p className="text-gray-400 mt-1">Try adjusting your filters or search terms.</p>
                </div>
            )}
        </div>
    );
}
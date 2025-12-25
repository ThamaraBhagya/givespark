"use client";

import { useState, useEffect, useMemo } from 'react';
import CampaignCard from '@/components/CampaignCard';
import { FunnelIcon, MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline';

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

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'FUNDED'>('ALL');

    useEffect(() => {
        async function fetchAllCampaigns() {
            try {
                const response = await fetch('/api/campaign/list');
                if (!response.ok) throw new Error('Failed to fetch all campaigns');
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

    const filteredCampaigns = useMemo(() => {
        return campaigns.filter((c) => {
            const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 c.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
            
            const campaignCategory = c.category?.toUpperCase() || 'OTHER';
            const selectedCat = selectedCategory.toUpperCase();
            const matchesCategory = selectedCat === 'ALL' || campaignCategory === selectedCat;
            
            const isFunded = c.currentAmount >= c.goalAmount;
            const matchesStatus = statusFilter === 'ALL' || 
                                 (statusFilter === 'FUNDED' && isFunded) || 
                                 (statusFilter === 'ACTIVE' && !isFunded);

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [campaigns, searchQuery, selectedCategory, statusFilter]);

    if (loading) return (
        <div className="min-h-screen bg-[#0a0f1d] flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500 font-black uppercase tracking-widest text-xs">Syncing Feed...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0f1d] text-white pb-20 relative overflow-hidden">
            {/* Background Decorative Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 relative z-10">
                <header className="mb-12">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">
                        <SparklesIcon className="w-4 h-4" />
                        <span>Discover Impact</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                        Explore All Projects
                    </h1>
                </header>

                {/* 🛠️ FILTER BAR (Glassmorphism) */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12 p-8 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl">
                    
                    {/* Search */}
                    <div className="lg:col-span-2 relative group">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-teal-400 transition-colors" />
                        <input 
                            type="text"
                            placeholder="Search by title or story..."
                            className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500/50 outline-none text-white placeholder-gray-600 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Category Dropdown */}
                    <div className="relative">
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-6 py-4 bg-[#111827] border border-white/10 rounded-2xl text-gray-300 font-bold outline-none focus:ring-2 focus:ring-teal-500/50 appearance-none cursor-pointer"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat} className="bg-[#111827]">
                                    {cat === "ALL" ? "All Categories" : cat.charAt(0) + cat.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>
                        <FunnelIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                    </div>

                    {/* Status Toggle */}
                    <div className="flex bg-[#0a0f1d] p-1.5 rounded-2xl border border-white/5">
                        {(['ALL', 'ACTIVE', 'FUNDED'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`flex-1 py-2.5 text-[10px] font-black tracking-widest rounded-xl transition-all ${
                                    statusFilter === status 
                                    ? 'bg-teal-400 text-gray-950 shadow-lg' 
                                    : 'text-gray-500 hover:text-white'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 💡 Result Counter */}
                <div className="flex items-center justify-between mb-8 px-2">
                    <p className="text-gray-500 text-sm font-black uppercase tracking-widest">
                        Showing <span className="text-white">{filteredCampaigns.length}</span> {filteredCampaigns.length === 1 ? 'project' : 'projects'}
                    </p>
                    <div className="h-px flex-1 bg-white/5 mx-6 hidden md:block" />
                </div>
                
                {/* 💡 Conditional Grid Rendering */}
                {filteredCampaigns.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                        {filteredCampaigns.map((campaign) => (
                            <div key={campaign.id} className="group relative">
                                {/* Subtle bottom glow for consistency */}
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-teal-400 to-indigo-500 transition-all duration-500 group-hover:w-full z-20 rounded-full"></div>
                                <CampaignCard campaign={campaign} /> 
                            </div>
                        ))}
                    </div>
                ) : (
                    /* 💡 Empty State */
                    <div className="text-center py-32 bg-white/5 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-white/10">
                        <FunnelIcon className="mx-auto h-16 w-16 text-gray-700 mb-6" />
                        <h3 className="text-2xl font-black text-white">No projects found</h3>
                        <p className="text-gray-500 mt-2 font-light">Try adjusting your filters to find more sparks.</p>
                        <button 
                            onClick={() => {setSearchQuery(''); setSelectedCategory('ALL'); setStatusFilter('ALL');}}
                            className="mt-8 text-teal-400 font-black uppercase text-xs tracking-[0.2em] hover:text-teal-300 transition-colors"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
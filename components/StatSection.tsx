"use client";

import { useState, useEffect } from 'react';
import { HandRaisedIcon, RocketLaunchIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function StatsSection() {
  const [statsData, setStatsData] = useState({
    totalCampaigns: 0,
    totalFunds: 0,
    totalBackers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setStatsData({
          totalCampaigns: data.totalCampaigns,
          totalFunds: data.totalFunds,
          totalBackers: data.totalBackers,
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const stats = [
    {
      id: 1,
      name: 'Campaigns Launched',
      value: (statsData?.totalCampaigns ?? 0).toString() + '+',
      icon: RocketLaunchIcon,
      accent: 'from-indigo-500 to-indigo-700',
      description: 'Ideas successfully transitioned from concept to active funding.'
    },
    {
      id: 2,
      name: 'Total Funds Raised',
      value: `$${formatNumber(statsData?.totalFunds ?? 0)}`,
      icon: HandRaisedIcon,
      accent: 'from-teal-400 to-teal-600',
      description: 'Total contributions provided by our global community.'
    },
    {
      id: 3,
      name: 'Active Backers',
      value: (statsData?.totalBackers ?? 0).toString() + '+',
      icon: UserGroupIcon,
      accent: 'from-indigo-400 to-teal-400',
      description: 'The growing number of people supporting change.'
    },
  ];

  if (loading) return (
    <div className="bg-[#0a0f1d] py-24 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-500 font-medium tracking-widest uppercase text-xs">Syncing Global Impact</p>
    </div>
  );

  return (
    <div className="bg-[#0a0f1d] py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-sm font-black text-teal-400 tracking-[0.3em] uppercase mb-4">Our Worldwide Reach</h2>
          <p className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Realizing Goals, <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-400">One Spark</span> at a Time.
          </p>
        </div>

        <dl className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {stats.map((stat) => (
            <div 
              key={stat.id} 
              className="group relative p-1 rounded-3xl transition-all duration-500 hover:scale-[1.02]"
            >
              {/* Card Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl opacity-50"></div>
              
              <div className="relative h-full bg-[#111827]/80 backdrop-blur-xl p-10 rounded-[calc(1.5rem-1px)] border border-white/5 flex flex-col items-center text-center">
                {/* Animated Icon Container */}
                <div className={`mb-6 p-4 rounded-2xl bg-gradient-to-br ${stat.accent} shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-8 w-8 text-white" aria-hidden="true" />
                </div>

                <dd className="text-5xl font-black text-white mb-2 tracking-tighter">
                  {stat.value}
                </dd>
                
                <dt className="text-lg font-bold text-gray-300 mb-4">
                  {stat.name}
                </dt>
                
                <p className="text-sm text-gray-500 leading-relaxed font-light">
                  {stat.description}
                </p>
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r ${stat.accent} transition-all duration-500 group-hover:w-full rounded-b-3xl`}></div>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
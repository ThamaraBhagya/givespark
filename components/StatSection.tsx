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

  // Helper function to format large numbers
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
      description: 'Ideas successfully transitioned from concept to active funding.'
    },
    {
      id: 2,
      name: 'Total Funds Raised',
      value: `$${formatNumber(statsData?.totalFunds ?? 0)}`,
      icon: HandRaisedIcon,
      description: 'Total contributions provided by our global community.'
    },
    {
      id: 3,
      name: 'Active Backers',
      value: (statsData?.totalBackers ?? 0).toString() + '+',
      icon: UserGroupIcon,
      description: 'The growing number of people supporting change.'
    },
  ];

  if (loading) return <div className="py-24 text-center text-gray-400">Updating Impact Stats...</div>;

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Our Impact</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Realizing Goals, One Campaign at a Time.
          </p>
        </div>

        <dl className="grid grid-cols-1 gap-12 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col text-center p-8 bg-gray-50 rounded-xl shadow-lg border-t-4 border-indigo-500/50">
              <div className="mx-auto mb-4 p-3 rounded-full bg-indigo-600 shadow-lg">
                <stat.icon className="h-8 w-8 text-white" aria-hidden="true" />
              </div>
              <dd className="order-first text-5xl font-extrabold text-gray-900">
                {stat.value}
              </dd>
              <dt className="mt-2 text-lg font-medium text-gray-600">
                {stat.name}
              </dt>
              <p className="mt-4 text-sm text-gray-500">
                {stat.description}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
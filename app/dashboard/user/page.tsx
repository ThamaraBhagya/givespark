import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { format } from "date-fns";
import Link from "next/link";
import { Heart, Globe, Calendar, ArrowUpRight } from "lucide-react";

export default async function UserDashboard() {
  const session = await getServerSession(authOptions);

  const donations = await prisma.donation.findMany({
    where: { donorId: session?.user?.id },
    include: { campaign: true },
    orderBy: { createdAt: "desc" },
  });

  const totalDonated = donations.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white p-2 space-y-12">
      {/* --- DASHBOARD HEADER --- */}
      <header className="relative py-6">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Impact Dashboard
          </h1>
          <p className="text-gray-500 mt-2 font-light text-lg">
            Track your contributions and the global difference you make.
          </p>
        </div>
      </header>

      {/* --- IMPACT METRICS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Total Contributed Card */}
        <div className="relative group bg-white/5 p-8 rounded-[2.5rem] border border-white/10 transition-all hover:border-indigo-500/30 overflow-hidden">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-indigo-500 blur-md opacity-50 group-hover:opacity-100 transition-opacity" />
          <Heart className="absolute top-6 right-8 text-white/5 w-12 h-12" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Total Contributed</p>
          <p className="text-5xl font-black text-white tracking-tighter">
            ${totalDonated.toLocaleString()}
          </p>
        </div>

        {/* Projects Supported Card */}
        <div className="relative group bg-white/5 p-8 rounded-[2.5rem] border border-white/10 transition-all hover:border-teal-500/30 overflow-hidden">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-teal-500 blur-md opacity-50 group-hover:opacity-100 transition-opacity" />
          <Globe className="absolute top-6 right-8 text-white/5 w-12 h-12" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Projects Supported</p>
          <p className="text-5xl font-black text-white tracking-tighter">
            {donations.length}
          </p>
        </div>
      </div>

      {/* --- DONATION HISTORY LEDGER --- */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black text-white flex items-center">
            <Calendar className="w-6 h-6 mr-3 text-indigo-400" />
            Contribution Ledger
          </h2>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
            Verified Transactions
          </span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Campaign</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Date</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {donations.map((donation) => (
                  <tr key={donation.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <Link 
                        href={`/campaign/${donation.campaignId}`}
                        className="flex items-center group/link"
                      >
                        <span className="font-black text-white group-hover/link:text-indigo-400 transition-colors text-lg tracking-tight">
                          {donation.campaign.title}
                        </span>
                        <ArrowUpRight className="w-4 h-4 ml-2 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-all text-indigo-400" />
                      </Link>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-medium text-gray-400">
                        {format(new Date(donation.createdAt), "MMM dd, yyyy")}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-xl font-black text-indigo-400 bg-indigo-500/10 px-4 py-1.5 rounded-xl border border-indigo-500/20">
                        ${donation.amount.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
                {donations.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-8 py-20 text-center">
                      <p className="text-gray-500 font-black uppercase tracking-widest text-xs">
                        No sparks ignited yet.
                      </p>
                      <Link href="/campaign/list" className="mt-4 inline-block text-indigo-400 hover:text-white transition-colors text-sm font-bold">
                        Browse Campaigns
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
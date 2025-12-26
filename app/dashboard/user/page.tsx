import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { format } from "date-fns";
import Link from "next/link";
import { Heart, Globe, Calendar, ArrowUpRight } from "lucide-react";

export default async function UserDashboard() {
  const session = (await getServerSession(authOptions as any)) as any;

  const donations = await prisma.donation.findMany({
    where: { donorId: session?.user?.id },
    include: { campaign: true },
    orderBy: { createdAt: "desc" },
  });

  const totalDonated = donations.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0f1d] text-slate-900 dark:text-white p-2 space-y-12">
      {/* --- DASHBOARD HEADER --- */}
      <header className="relative py-6">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600 dark:from-white dark:to-gray-400">
            Impact Dashboard
          </h1>
          <p className="text-slate-600 dark:text-gray-500 mt-2 font-light text-lg">
            Track your contributions and the global difference you make.
          </p>
        </div>
      </header>

      {/* --- IMPACT METRICS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Total Contributed Card */}
        <div className="relative group bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 p-8 rounded-5xl transition-all hover:border-indigo-300 dark:hover:border-indigo-500/30 overflow-hidden shadow-sm dark:shadow-none">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-indigo-600/60 dark:bg-indigo-500 blur-md opacity-50 group-hover:opacity-100 transition-opacity" />
          <Heart className="absolute top-6 right-8 text-slate-300/30 dark:text-white/5 w-12 h-12" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-gray-500 mb-2">Total Contributed</p>
          <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            ${totalDonated.toLocaleString()}
          </p>
        </div>

        {/* Projects Supported Card */}
        <div className="relative group bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 p-8 rounded-5xl transition-all hover:border-teal-300 dark:hover:border-teal-500/30 overflow-hidden shadow-sm dark:shadow-none">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-teal-600/60 dark:bg-teal-500 blur-md opacity-50 group-hover:opacity-100 transition-opacity" />
          <Globe className="absolute top-6 right-8 text-slate-300/30 dark:text-white/5 w-12 h-12" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-gray-500 mb-2">Projects Supported</p>
          <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            {donations.length}
          </p>
        </div>
      </div>

      {/* --- DONATION HISTORY LEDGER --- */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center">
            <Calendar className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-400" />
            Contribution Ledger
          </h2>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-gray-500">
            Verified Transactions
          </span>
        </div>

        <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-5xl overflow-hidden backdrop-blur-xl shadow-sm dark:shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/5">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-gray-500">Campaign</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-gray-500">Date</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {donations.map((donation) => (
                  <tr key={donation.id} className="group hover:bg-slate-50 dark:hover:bg-white/2 transition-colors">
                    <td className="px-8 py-6">
                      <Link 
                        href={`/campaign/${donation.campaignId}`}
                        className="flex items-center group/link"
                      >
                        <span className="font-black text-slate-900 dark:text-white group-hover/link:text-indigo-600 dark:group-hover/link:text-indigo-400 transition-colors text-lg tracking-tight">
                          {donation.campaign.title}
                        </span>
                        <ArrowUpRight className="w-4 h-4 ml-2 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-all text-indigo-400" />
                      </Link>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-medium text-slate-600 dark:text-gray-400">
                        {format(new Date(donation.createdAt), "MMM dd, yyyy")}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-xl font-black text-indigo-700 bg-indigo-50 border border-indigo-200 dark:text-indigo-400 dark:bg-indigo-500/10 dark:border-indigo-500/20 px-4 py-1.5 rounded-xl">
                        ${donation.amount.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
                {donations.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-8 py-20 text-center">
                      <p className="text-slate-600 dark:text-gray-500 font-black uppercase tracking-widest text-xs">
                        No sparks ignited yet.
                      </p>
                      <Link href="/campaign/list" className="mt-4 inline-block text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-white transition-colors text-sm font-bold">
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
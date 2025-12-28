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
    <div className="min-h-screen bg-white dark:bg-[#0a0f1d] text-slate-900 dark:text-white p-4 sm:p-6 md:p-8 space-y-8 sm:space-y-10 md:space-y-12">
      {/* --- DASHBOARD HEADER --- */}
      <header className="relative py-4 sm:py-5 md:py-6">
        <div className="absolute -top-10 -left-10 w-48 sm:w-56 md:w-64 h-48 sm:h-56 md:h-64 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600 dark:from-white dark:to-gray-400">
            Impact Dashboard
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-gray-500 mt-2 font-light">
            Track your contributions and the global difference you make.
          </p>
        </div>
      </header>

      {/* --- IMPACT METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-8">
        {/* Total Contributed Card */}
        <div className="relative group bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-4xl md:rounded-5xl transition-all hover:border-indigo-300 dark:hover:border-indigo-500/30 overflow-hidden shadow-sm dark:shadow-none">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-indigo-600/60 dark:bg-indigo-500 blur-md opacity-50 group-hover:opacity-100 transition-opacity" />
          <Heart className="absolute top-4 sm:top-5 md:top-6 right-4 sm:right-6 md:right-8 text-slate-300/30 dark:text-white/5 w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12" />
          <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-gray-500 mb-2">Total Contributed</p>
          <p className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            ${totalDonated.toLocaleString()}
          </p>
        </div>

        {/* Projects Supported Card */}
        <div className="relative group bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-4xl md:rounded-5xl transition-all hover:border-teal-300 dark:hover:border-teal-500/30 overflow-hidden shadow-sm dark:shadow-none">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-teal-600/60 dark:bg-teal-500 blur-md opacity-50 group-hover:opacity-100 transition-opacity" />
          <Globe className="absolute top-4 sm:top-5 md:top-6 right-4 sm:right-6 md:right-8 text-slate-300/30 dark:text-white/5 w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12" />
          <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-gray-500 mb-2">Projects Supported</p>
          <p className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            {donations.length}
          </p>
        </div>
      </div>

      {/* --- DONATION HISTORY LEDGER --- */}
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 px-2 sm:px-0">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center">
            <Calendar className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3 text-indigo-600 dark:text-indigo-400" />
            Contribution Ledger
          </h2>
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-gray-500">
            Verified Transactions
          </span>
        </div>

        <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-2xl sm:rounded-4xl md:rounded-5xl overflow-hidden backdrop-blur-xl shadow-sm dark:shadow-none">
          {/* Mobile: Card View */}
          <div className="md:hidden space-y-3 p-4 sm:p-5">
            {donations.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <p className="text-slate-600 dark:text-gray-500 font-black uppercase tracking-widest text-xs mb-4">
                  No sparks ignited yet.
                </p>
                <Link href="/campaign/list" className="inline-block text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-white transition-colors text-sm font-bold">
                  Browse Campaigns
                </Link>
              </div>
            ) : (
              donations.map((donation) => (
                <div key={donation.id} className="p-3 sm:p-4 border border-slate-200 dark:border-white/5 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-white/2 hover:bg-slate-100 dark:hover:bg-white/4 transition-colors">
                  <Link 
                    href={`/campaign/${donation.campaignId}`}
                    className="flex items-center justify-between group/link mb-3"
                  >
                    <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover/link:text-indigo-600 dark:group-hover/link:text-indigo-400 transition-colors tracking-tight line-clamp-2 flex-1">
                      {donation.campaign.title}
                    </span>
                    <ArrowUpRight className="w-3 sm:w-4 h-3 sm:h-4 ml-2 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-all text-indigo-400 flex-shrink-0" />
                  </Link>
                  <div className="flex justify-between items-center">
                    <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-gray-400">
                      {format(new Date(donation.createdAt), "MMM dd, yyyy")}
                    </p>
                    <span className="text-sm sm:text-base font-black text-indigo-700 bg-indigo-50 border border-indigo-200 dark:text-indigo-400 dark:bg-indigo-500/10 dark:border-indigo-500/20 px-3 py-1 rounded-lg">
                      ${donation.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop: Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/5">
                  <th className="px-6 md:px-8 py-5 md:py-6 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-gray-500">Campaign</th>
                  <th className="px-6 md:px-8 py-5 md:py-6 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-gray-500">Date</th>
                  <th className="px-6 md:px-8 py-5 md:py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {donations.map((donation) => (
                  <tr key={donation.id} className="group hover:bg-slate-50 dark:hover:bg-white/2 transition-colors">
                    <td className="px-6 md:px-8 py-5 md:py-6">
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
                    <td className="px-6 md:px-8 py-5 md:py-6">
                      <p className="text-sm font-medium text-slate-600 dark:text-gray-400">
                        {format(new Date(donation.createdAt), "MMM dd, yyyy")}
                      </p>
                    </td>
                    <td className="px-6 md:px-8 py-5 md:py-6 text-right">
                      <span className="text-xl font-black text-indigo-700 bg-indigo-50 border border-indigo-200 dark:text-indigo-400 dark:bg-indigo-500/10 dark:border-indigo-500/20 px-4 py-1.5 rounded-xl">
                        ${donation.amount.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
                {donations.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-8 py-20 text-center">
                      <p className="text-slate-600 dark:text-gray-500 font-black uppercase tracking-widest text-xs mb-4">
                        No sparks ignited yet.
                      </p>
                      <Link href="/campaign/list" className="inline-block text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-white transition-colors text-sm font-bold">
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
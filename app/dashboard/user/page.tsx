

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { format } from "date-fns";

import Link from "next/link";

export default async function UserDashboard() {
  const session = await getServerSession(authOptions);
  

  const donations = await prisma.donation.findMany({
    where: { donorId: session?.user?.id },
    include: { campaign: true },
    orderBy: { createdAt: "desc" },
  });

  const totalDonated = donations.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Impact Dashboard</h1>
        <p className="text-gray-500">Track your contributions and the difference you make.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Total Contributed</p>
          <p className="text-3xl font-black text-indigo-600 mt-1">${totalDonated.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Projects Supported</p>
          <p className="text-3xl font-black text-green-600 mt-1">{donations.length}</p>
        </div>
        {/* <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Rank</p>
          <p className="text-3xl font-black text-amber-500 mt-1">🏅 Gold Donor</p>
        </div> */}
      </div>

      {/* Donation Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">My Donation History</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Campaign</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {donations.map((donation) => (
              <tr key={donation.id} className="relative hover:bg-gray-50 transition-colors" >
                <td className="px-6 py-4 font-bold text-gray-900">
                    <Link 
                    href={`/campaign/${donation.campaignId}`}
                    className="after:absolute after:inset-0 after:z-10 group-hover:text-indigo-600 transition-colors"
                  >
                    {donation.campaign.title}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {format(new Date(donation.createdAt), "MMM dd, yyyy")}
                </td>
                <td className="px-6 py-4 text-right font-black text-indigo-600">
                  ${donation.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
"use client";

import Sidebar from './Sidebar';

export default function DashboardClient({ user, children }: { user: any, children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0f1d]">
      <Sidebar user={user} />
      <main className="flex-1 p-4 sm:p-6 md:p-8 w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
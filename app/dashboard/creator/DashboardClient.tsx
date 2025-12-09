// app/dashboard/creator/DashboardClient.tsx
"use client";

import Sidebar from './Sidebar';

export default function DashboardClient({ user, children }: { user: any, children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <main className="flex-1 p-8 bg-gray-50">
        {children}
      </main>
    </div>
  );
}
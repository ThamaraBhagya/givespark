import Sidebar from "./Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = (await getServerSession(authOptions as any)) as any;

  if (!session || session.user.role !== "USER") {
    redirect("/auth/signin");
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#0a0f1d]">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}
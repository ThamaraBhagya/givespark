"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Heart, Settings, LogOut, User as UserIcon } from "lucide-react";

const navItems = [
  { name: "My Donations", href: "/dashboard/user", icon: Heart },
  { name: "Settings", href: "/dashboard/user/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <aside className="w-72 bg-white dark:bg-[#0a0f1d] text-slate-900 dark:text-white flex flex-col h-screen sticky top-0 border-r border-indigo-200 dark:border-white/5">
      
      {/* Header/Logo Section */}
      <div className="flex flex-col items-center justify-center py-10 border-b border-indigo-200 dark:border-white/5">
        
        <span className="mt-2 text-[15px] font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-teal-500/60">
          Donor Dashboard
        </span>
      </div>

      {/* User Info Section */}
      <div className="p-6">
        <div className="bg-white border border-indigo-200 dark:bg-white/5 dark:border-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center space-x-4">
          <div className="relative shrink-0">
            {/* The "Squircle" Profile Image Container */}
            <div className="w-11 h-11 rounded-xl overflow-hidden bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 shadow-lg flex items-center justify-center">
              {user?.image ? (
                <img src={user.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-6 h-6 text-slate-500 dark:text-gray-500" />
              )}
            </div>
            {/* Status indicator - Indigo for Donors to differentiate from Creator Teal */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full border-2 border-white dark:border-[#0a0f1d]" />
          </div>
          <div className="truncate">
            <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{user?.name || "Guest Donor"}</p>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest mt-0.5">
              Supporter
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 py-4 space-y-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                ${isActive 
                  ? "bg-indigo-600 text-white font-black shadow-[0_0_20px_rgba(79,70,229,0.25)]" 
                  : "text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-transparent dark:hover:border-white/5"
                }
              `}
            >
              <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-indigo-600/70 dark:text-indigo-400/70"}`} />
              <span className="text-sm tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout & Footer Section */}
      <div className="p-6 mt-auto border-t border-indigo-200 dark:border-white/5">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="group flex items-center space-x-3 w-full px-4 py-3 text-slate-600 dark:text-gray-500 hover:text-rose-600 dark:hover:text-red-400 transition-all duration-300 rounded-xl hover:bg-rose-50 dark:hover:bg-red-400/5"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-black uppercase text-[10px] tracking-widest">Terminate Session</span>
        </button>
      </div>
    </aside>
  );
}
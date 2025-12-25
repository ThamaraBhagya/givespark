"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Heart, History, Settings, LogOut, User as UserIcon, Home } from "lucide-react";

const navItems = [
  { name: "My Donations", href: "/dashboard/user", icon: Heart },
 
  { name: "Settings", href: "/dashboard/user/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl text-indigo-600">⚡</span>
          <span className="text-xl font-bold text-gray-900">GiveSpark</span>
        </Link>
      </div>

      <div className="p-4 border-b border-gray-50 bg-gray-50/50">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-indigo-100 border border-indigo-200 overflow-hidden shrink-0">
            {user?.image ? (
              <img src={user.image} alt="" className="h-full w-full object-cover" />
            ) : (
              <UserIcon className="h-full w-full p-2 text-indigo-400" />
            )}
          </div>
          <div className="truncate">
            <p className="font-bold text-sm text-gray-900 truncate">{user?.name}</p>
            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">Donor</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                : "text-gray-500 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center space-x-3 w-full px-4 py-3 text-gray-500 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
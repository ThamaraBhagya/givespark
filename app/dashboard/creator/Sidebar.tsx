"use client";

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Wallet, Megaphone, Settings, User, Rocket } from 'lucide-react';

interface SidebarProps {
  user: {
    name: string;
    role: 'USER' | 'CREATOR';
    image?: string | null;
  };
}

const navItems = [
  { 
    name: 'Virtual Wallet', 
    href: '/dashboard/creator/wallet', 
    icon: Wallet 
  },
  { 
    name: 'My Campaigns', 
    href: '/dashboard/creator/campaigns', 
    icon: Megaphone 
  },
  { 
    name: 'Profile Settings', 
    href: '/dashboard/creator/settings', 
    icon: Settings 
  },
];

export default function Sidebar({ user: initialUser }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user || initialUser;

  return (
    <aside className="w-72 bg-white dark:bg-[#0a0f1d] text-slate-900 dark:text-white flex flex-col h-screen sticky top-0 border-r border-indigo-200 dark:border-white/5">
      
      {/* Header/Logo Section */}
      <div className="flex flex-col items-center justify-center py-10 border-b border-indigo-200 dark:border-white/5">
        {/* <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative h-8 w-8">
              <Image 
                src="/logo-icon.png" 
                alt="Icon" 
                fill 
                className="object-contain transition-transform group-hover:rotate-12" 
              />
            </div>
            <div className="relative h-5 w-28">
              <Image 
                src="/givespark-text.png" 
                alt="GiveSpark" 
                fill 
                className="object-contain dark:brightness-0 dark:invert" 
              />
            </div>
        </Link> */}
        <span className="mt-2 text-[15px] font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-teal-500/60">
          Creator Studio
        </span>
      </div>

      {/* User Info Section */}
      <div className="p-6">
        <div className="bg-indigo-50 dark:bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-indigo-200 dark:border-white/10 flex items-center space-x-4">
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-xl overflow-hidden bg-indigo-100 dark:bg-[#111827] border border-indigo-300 dark:border-white/10 shadow-lg">
              {user.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-full h-full p-2 text-slate-400 dark:text-gray-500" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-600 dark:bg-teal-500 rounded-full border-2 border-white dark:border-[#0a0f1d]" />
          </div>
          <div className="truncate">
            <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{user.name}</p>
            <p className="text-[10px] text-indigo-600 dark:text-teal-400 uppercase font-black tracking-widest mt-0.5">
              {user.role}
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
                  ? 'bg-indigo-600 dark:bg-teal-400 text-white dark:text-gray-950 font-black shadow-[0_0_20px_rgba(99,102,241,0.2)] dark:shadow-[0_0_20px_rgba(45,212,191,0.2)]' 
                  : 'text-slate-600 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-indigo-300 dark:hover:border-white/5'
                }
              `}
            >
              <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white dark:text-gray-950' : 'text-indigo-600 dark:text-teal-500/70'}`} />
              <span className="text-sm tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Launch New Campaign Section */}
      <div className="p-6 mt-auto">
        <Link
          href="/campaign/new"
          className="group relative flex items-center justify-center space-x-3 w-full py-4 bg-indigo-100 dark:bg-white/5 border border-indigo-300 dark:border-white/10 text-slate-900 dark:text-white font-black rounded-2xl overflow-hidden transition-all hover:bg-indigo-200 dark:hover:bg-white/10 hover:border-indigo-500 dark:hover:border-teal-500/50"
        >
          {/* Subtle bottom glow effect */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-indigo-600 dark:bg-teal-400 transition-all duration-500 group-hover:w-full" />
          
          <Rocket className="w-5 h-5 text-indigo-600 dark:text-teal-400 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          <span className="text-sm">Launch New Spark</span>
        </Link>
      </div>
    </aside>
  );
}
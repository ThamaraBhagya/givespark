'use client';
import { useState } from 'react'; // 💡 Added state for menu toggle
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { UserCircleIcon, LogOut, Menu, X } from 'lucide-react'; // 💡 Added Menu and X icons

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 💡 Toggle state
  
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Campaigns', href: '/campaign/list' },
    { name: 'About', href: '/#about' },
    { name: 'How It Works', href: '/#how-it-works' },
  ];

  const isAuthenticated = status === 'authenticated';
  const isCreator = isAuthenticated && session?.user?.role === 'CREATOR';

  return (
    <nav className="bg-[#0a0f1d]/90 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 1. Logo Section */}
          <div className="shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative h-8 w-8 sm:h-10 sm:w-10">
                <Image src="/logo.png" alt="Icon" fill className="object-contain transition-transform group-hover:rotate-12" priority />
              </div>
              <div className="relative h-5 w-28 sm:h-8 sm:w-36">
                <Image src="/givespark.png" alt="GiveSpark" fill className="object-contain brightness-0 invert" priority />
              </div>
            </Link>
          </div>

          {/* 2. Desktop Navigation (Center) */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-400 hover:text-teal-400 text-xs font-black uppercase tracking-widest transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* 3. Desktop Actions (Right) */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href={isCreator ? "/campaign/new" : "/auth/signin"} 
              className="px-5 py-2.5 text-sm font-black rounded-full text-gray-900 bg-teal-400 hover:bg-teal-300 transition-all shadow-lg active:scale-95"
            >
              Start a Campaign
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4 border-l border-white/10 pl-6">
                <Link href={isCreator ? "/dashboard/creator" : "/dashboard/user"} className="flex items-center space-x-3 group">
                  <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-indigo-500/50 bg-[#111827] group-hover:border-teal-400 transition-colors">
                    {session?.user?.image ? (
                      <img src={session.user.image} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <UserCircleIcon className="h-full w-full text-gray-600" />
                    )}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs font-black text-white leading-none">{session?.user?.name?.split(' ')[0]}</p>
                    <p className="text-[10px] text-teal-500 font-black uppercase mt-1">{session?.user?.role}</p>
                  </div>
                </Link>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="text-gray-500 hover:text-red-400">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link href="/auth/signin" className="text-gray-400 hover:text-white text-xs font-black uppercase tracking-widest">Login</Link>
            )}
          </div>

          {/* 4. Mobile Menu Toggle (Hamburger) */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="h-8 w-8 text-teal-400" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#0a0f1d] border-b border-white/5 animate-in slide-in-from-top duration-300">
          <div className="px-6 py-8 space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-2xl font-black text-white uppercase tracking-tighter hover:text-teal-400 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-6 border-t border-white/5 flex flex-col space-y-4">
              <Link 
                href={isCreator ? "/campaign/new" : "/auth/signin"}
                onClick={() => setIsMenuOpen(false)}
                className="w-full py-4 bg-teal-400 text-gray-950 text-center font-black rounded-2xl text-lg"
              >
                Start a Campaign
              </Link>
              {isAuthenticated ? (
                <Link 
                  href={isCreator ? "/dashboard/creator" : "/dashboard/user"}
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full py-4 bg-white/5 border border-white/10 text-white text-center font-black rounded-2xl text-lg"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)} className="text-center text-gray-400 font-black uppercase tracking-widest py-2">Login</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { UserCircleIcon, LogOut, Menu, X, Moon, Sun, Rocket, AlertCircle } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false); // 💡 State to control modal

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Campaigns', href: '/campaign/list' },
    { name: 'About', href: '/#about' },
    { name: 'How It Works', href: '/#how-it-works' },
  ];

  const isAuthenticated = status === 'authenticated';
  const isCreator = isAuthenticated && session?.user?.role === 'CREATOR';

 
  const handleStartCampaign = (e: React.MouseEvent) => {
    if (!isCreator) {
      e.preventDefault();
      setIsCreatorModalOpen(true);
      setIsMenuOpen(false);
      return;
    }
    window.location.href = '/campaign/new';
  };

  const handleCreatorSignIn = async () => {
    setIsCreatorModalOpen(false);
    
    await signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <nav className="bg-white/90 dark:bg-[#0a0f1d]/90 backdrop-blur-md border-b border-indigo-100 dark:border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          
          <div className="shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative h-8 w-8 sm:h-10 sm:w-10">
                <Image src="/logo.png" alt="Icon" fill className="object-contain transition-transform group-hover:rotate-12" priority />
              </div>
              <div className="relative h-5 w-28 sm:h-8 sm:w-36">
                <Image src="/givespark.png" alt="GiveSpark" fill className="object-contain dark:brightness-0 dark:invert" priority />
              </div>
            </Link>
          </div>

          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-slate-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-teal-400 text-xs font-black uppercase tracking-widest transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={handleStartCampaign}
              className="px-5 py-2.5 text-sm font-black rounded-full text-white bg-indigo-600 hover:bg-indigo-700 dark:text-gray-900 dark:bg-teal-400 dark:hover:bg-teal-300 transition-all shadow-lg active:scale-95"
            >
              Start a Campaign
            </button>
            
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl bg-indigo-50 dark:bg-white/5 border border-indigo-200 dark:border-white/10 hover:bg-indigo-100 dark:hover:bg-white/10 transition-all"
              aria-label="Toggle Theme"
            >
              {mounted && (theme === "dark" ? (
                <Sun className="w-5 h-5 text-teal-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              ))}
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4 border-l border-indigo-100 dark:border-white/10 pl-6">
                <Link href={isCreator ? "/dashboard/creator" : "/dashboard/user"} className="flex items-center space-x-3 group">
                  <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-indigo-200 dark:border-indigo-500/50 bg-indigo-50 dark:bg-[#111827] group-hover:border-indigo-600 dark:group-hover:border-teal-400 transition-colors">
                    {session?.user?.image ? (
                      <img src={session.user.image} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <UserCircleIcon className="h-full w-full text-slate-400 dark:text-gray-600" />
                    )}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs font-black text-slate-900 dark:text-white leading-none">{session?.user?.name?.split(' ')[0]}</p>
                    <p className="text-[10px] text-indigo-600 dark:text-teal-500 font-black uppercase mt-1">{session?.user?.role}</p>
                  </div>
                </Link>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="text-slate-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link href="/auth/signin" className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white text-xs font-black uppercase tracking-widest">Login</Link>
            )}
          </div>

          
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="h-8 w-8 text-indigo-600 dark:text-teal-400" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-[#0a0f1d] border-b border-indigo-100 dark:border-white/5 animate-in slide-in-from-top duration-300">
          <div className="px-6 py-8 space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter hover:text-indigo-600 dark:hover:text-teal-400 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-6 border-t border-indigo-100 dark:border-white/5 flex flex-col space-y-4">
              <button 
                onClick={handleStartCampaign}
                className="w-full py-4 bg-indigo-600 dark:bg-teal-400 text-white dark:text-gray-950 text-center font-black rounded-2xl text-lg"
              >
                Start a Campaign
              </button>
              {isAuthenticated ? (
                <>
                  <Link 
                    href={isCreator ? "/dashboard/creator" : "/dashboard/user"}
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-4 bg-indigo-50 dark:bg-white/5 border border-indigo-200 dark:border-white/10 text-slate-900 dark:text-white text-center font-black rounded-2xl text-lg"
                  >
                    Go to Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="w-full py-4 bg-rose-50 dark:bg-red-400/10 border border-rose-200 dark:border-red-400/20 text-rose-600 dark:text-red-400 text-center font-black rounded-2xl text-lg hover:bg-rose-100 dark:hover:bg-red-400/20 transition-colors flex items-center justify-center space-x-2"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)} className="text-center text-slate-600 dark:text-gray-400 font-black uppercase tracking-widest py-2">Login</Link>
              )}
            </div>
          </div>
        </div>
      )}

      
      {isCreatorModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-32 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 text-left">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-2xl border border-indigo-100 dark:border-white/10 overflow-hidden">
            
            <button 
              onClick={() => setIsCreatorModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-10 text-center">
              <div className="mx-auto w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-teal-400/10 flex items-center justify-center mb-6">
                <Rocket className="w-10 h-10 text-indigo-600 dark:text-teal-400" />
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
                Creator Access Required
              </h3>
              
              <p className="text-slate-600 dark:text-gray-400 mb-8 leading-relaxed font-medium">
                To launch and manage campaigns, you must be logged in with a <span className="font-bold text-indigo-600 dark:text-teal-400">Creator Account</span>. 
              </p>

              <div className="space-y-3">
                <Link 
                  href="/auth/signin"
                  onClick={handleCreatorSignIn}
                  className="block w-full py-4 bg-indigo-600 dark:bg-teal-400 text-white dark:text-gray-950 font-black rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-center"
                >
                  Sign In as Creator
                </Link>
                <button 
                  onClick={() => setIsCreatorModalOpen(false)}
                  className="block w-full py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                >
                  Maybe Later
                </button>
              </div>
              
              
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
'use client';

import Link from 'next/link';
import { ArrowTrendingUpIcon, HandRaisedIcon } from '@heroicons/react/24/solid';
import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Rocket, X } from 'lucide-react';

export default function CtaSection() {

 const { data: session, status } = useSession();
   const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);
   const router = useRouter();
 
   const isAuthenticated = status === 'authenticated';
   const isCreator = isAuthenticated && session?.user?.role === 'CREATOR';
 
   const handleStartCampaign = () => {
     if (!isCreator) {
       setIsCreatorModalOpen(true);
       return;
     }
 
     router.push('/campaign/new');
   };
 
   const handleCreatorSignIn = async () => {
     setIsCreatorModalOpen(false);
 
     if (isAuthenticated) {
       await signOut({ callbackUrl: '/auth/signin' });
       return;
     }
 
     router.push('/auth/signin');
   };

  return (
    <section className="relative py-24 bg-white dark:bg-[#0a0f1d]">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="relative group overflow-hidden rounded-[3rem] p-12 md:p-20 text-center border border-indigo-200 dark:border-white/10 shadow-2xl">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-white to-indigo-50 dark:from-indigo-900 dark:via-[#0a0f1d] dark:to-teal-900/30 opacity-90 transition-transform duration-700 group-hover:scale-110"></div>
          
          {/* Decorative Glows */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-600/30 dark:bg-indigo-500/20 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-teal-600/30 dark:bg-teal-500/20 rounded-full blur-[80px]"></div>

          <div className="relative z-10">
            <h2 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-6">
              Ready to <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-slate-900 dark:from-teal-400 dark:to-white">Ignite</span> Your Impact?
            </h2>
            
            <p className="mt-4 text-lg md:text-xl text-slate-600 dark:text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              Whether you're launching the next big thing or backing the change you want to see, your journey starts here.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6">
              <button                 onClick={handleStartCampaign} 
               type='button'
                className="w-full sm:w-auto flex items-center justify-center space-x-3 px-10 py-5 bg-indigo-600 dark:bg-teal-400 text-white dark:text-gray-950 font-black rounded-2xl hover:bg-indigo-700 dark:hover:bg-teal-300 transition-all duration-300 text-lg shadow-xl shadow-indigo-600/20 dark:shadow-teal-500/10"
              >
                <ArrowTrendingUpIcon className="w-6 h-6" />
                <span>Launch Campaign</span>
              </button>

              <Link 
                href="/campaign/list" 
                className="w-full sm:w-auto flex items-center justify-center space-x-3 px-10 py-5 bg-indigo-100 dark:bg-white/5 backdrop-blur-md border border-indigo-300 dark:border-white/20 text-slate-900 dark:text-white font-bold rounded-2xl hover:bg-indigo-200 dark:hover:bg-white/10 transition-all duration-300 text-lg"
              >
                <HandRaisedIcon className="w-6 h-6" />
                <span>Explore Projects</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {isCreatorModalOpen && (
              <div className="fixed inset-0 z-100 flex items-start justify-center p-4 pt-32 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 text-left">
                <div className="relative w-full max-w-md bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-2xl border border-indigo-100 dark:border-white/10 overflow-hidden">
                  <button
                    onClick={() => setIsCreatorModalOpen(false)}
                    className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Close creator access modal"
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
                      <button
                        type="button"
                        onClick={handleCreatorSignIn}
                        className="block w-full py-4 bg-indigo-600 dark:bg-teal-400 text-white dark:text-gray-950 font-black rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-center"
                      >
                        Sign In as Creator
                      </button>
                      <button
                        type="button"
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
    </section>
  );
}
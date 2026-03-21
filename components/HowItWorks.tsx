'use client';

import { LightBulbIcon, PencilSquareIcon, HeartIcon, GiftIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Rocket, X } from 'lucide-react';

const steps = [
  {
    step: 1,
    name: 'Ideate & Plan',
    description: 'A creator identifies a project, sets a clear financial goal, and specifies a deadline for funding.',
    icon: LightBulbIcon,
    color: 'from-teal-400 to-teal-500',
  },
  {
    step: 2,
    name: 'Launch Campaign',
    description: 'The creator uses the GiveSpark dashboard to upload media, write their story, and officially launch the campaign.',
    icon: PencilSquareIcon,
    color: 'from-indigo-400 to-indigo-500',
  },
  {
    step: 3,
    name: 'Inspire Backers',
    description: 'Donors browse active campaigns and contribute funds via our secure mock payment system.',
    icon: HeartIcon,
    color: 'from-teal-400 to-indigo-500',
  },
  {
    step: 4,
    name: 'Withdraw & Deliver',
    description: 'The creator withdraws the funds from their virtual wallet and delivers on their promise to the backers.',
    icon: GiftIcon,
    color: 'from-indigo-500 to-indigo-700',
  },
];

export default function HowItWorks() {
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
    <section id="how-it-works" className="relative py-24 sm:py-32 bg-white dark:bg-[#0a0f1d] overflow-hidden">
      
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/15 dark:bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        
        <div className="text-center mb-20">
          <h2 className="text-sm font-black text-teal-600 dark:text-teal-400 tracking-[0.3em] uppercase mb-4">Simple Process</h2>
          <p className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            How GiveSpark Works in <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-indigo-600 dark:from-teal-400 dark:to-indigo-400">4 Simple Steps</span>
          </p>
        </div>

        
        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-4">
          {steps.map((stepItem) => (
            <div 
              key={stepItem.step} 
              className="group relative flex flex-col items-center p-8 rounded-3xl bg-indigo-50/50 dark:bg-white/[0.03] border border-indigo-200 dark:border-white/30 backdrop-blur-md transition-all duration-500 hover:bg-indigo-100/70 dark:hover:bg-white/[0.06] hover:border-indigo-400 dark:hover:border-indigo-500/30 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            >
              
              <div className="relative mb-8">
                <div className={`w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br ${stepItem.color} shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  <stepItem.icon className="h-10 w-10 text-gray-950" aria-hidden="true" />
                </div>
                
                
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white dark:bg-[#0a0f1d] border border-indigo-200 dark:border-white/20 flex items-center justify-center text-xs font-black text-slate-900 dark:text-white shadow-xl">
                  {stepItem.step}
                </div>
              </div>

              
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-4 group-hover:text-indigo-600 dark:group-hover:text-teal-400 transition-colors">
                {stepItem.name}
              </h3>

              
              <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed font-light text-center">
                {stepItem.description}
              </p>

              
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r ${stepItem.color} transition-all duration-500 group-hover:w-full rounded-b-3xl`}></div>
            </div>
          ))}
        </div>
        
        
        <div className="mt-24 text-center">
          <button
            type="button"
            onClick={handleStartCampaign}
            className="group inline-flex items-center space-x-3 px-10 py-4 bg-indigo-50 dark:bg-white/5 backdrop-blur-md border border-indigo-200 dark:border-white/10 text-slate-900 dark:text-white font-bold rounded-full hover:bg-indigo-100 dark:hover:bg-white/10 hover:border-indigo-400 dark:hover:border-teal-500/50 transition-all duration-300 text-xl"
          >
            <span>Ready to Launch Your Idea?</span>
            <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
          </button>
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
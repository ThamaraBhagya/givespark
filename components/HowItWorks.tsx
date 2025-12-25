import { LightBulbIcon, PencilSquareIcon, HeartIcon, GiftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

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
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32 bg-[#0a0f1d] overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-sm font-black text-teal-400 tracking-[0.3em] uppercase mb-4">Simple Process</h2>
          <p className="text-4xl md:text-5xl font-black text-white tracking-tight">
            How GiveSpark Works in <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-400">4 Simple Steps</span>
          </p>
        </div>

        {/* 4-Step Grid with Card Look */}
        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-4">
          {steps.map((stepItem) => (
            <div 
              key={stepItem.step} 
              className="group relative flex flex-col items-center p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md transition-all duration-500 hover:bg-white/[0.06] hover:border-indigo-500/30 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            >
              {/* Icon and Step Number Container */}
              <div className="relative mb-8">
                <div className={`w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br ${stepItem.color} shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  <stepItem.icon className="h-10 w-10 text-gray-950" aria-hidden="true" />
                </div>
                
                {/* Step Badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#0a0f1d] border border-white/20 flex items-center justify-center text-xs font-black text-white shadow-xl">
                  {stepItem.step}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-extrabold text-white mb-4 group-hover:text-teal-400 transition-colors">
                {stepItem.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-400 leading-relaxed font-light text-center">
                {stepItem.description}
              </p>

              {/* Subtle card bottom accent */}
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r ${stepItem.color} transition-all duration-500 group-hover:w-full rounded-b-3xl`}></div>
            </div>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="mt-24 text-center">
          <Link 
            href="/campaign/new" 
            className="group inline-flex items-center space-x-3 px-10 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold rounded-full hover:bg-white/10 hover:border-teal-500/50 transition-all duration-300 text-xl"
          >
            <span>Ready to Launch Your Idea?</span>
            <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
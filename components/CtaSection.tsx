import Link from 'next/link';
import { ArrowTrendingUpIcon, HandRaisedIcon } from '@heroicons/react/24/solid';

export default function CtaSection() {
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
              <Link 
                href="/campaign/new" 
                className="w-full sm:w-auto flex items-center justify-center space-x-3 px-10 py-5 bg-indigo-600 dark:bg-teal-400 text-white dark:text-gray-950 font-black rounded-2xl hover:bg-indigo-700 dark:hover:bg-teal-300 transition-all duration-300 text-lg shadow-xl shadow-indigo-600/20 dark:shadow-teal-500/10"
              >
                <ArrowTrendingUpIcon className="w-6 h-6" />
                <span>Launch Campaign</span>
              </Link>

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
    </section>
  );
}
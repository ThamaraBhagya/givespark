import Link from 'next/link';
import { ArrowTrendingUpIcon, HandRaisedIcon } from '@heroicons/react/24/solid';

export default function CtaSection() {
  return (
    <section className="relative py-24 bg-[#0a0f1d]">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="relative group overflow-hidden rounded-[3rem] p-12 md:p-20 text-center border border-white/10 shadow-2xl">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-[#0a0f1d] to-teal-900/30 opacity-90 transition-transform duration-700 group-hover:scale-110"></div>
          
          {/* Decorative Glows */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px]"></div>

          <div className="relative z-10">
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter mb-6">
              Ready to <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-white">Ignite</span> Your Impact?
            </h2>
            
            <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              Whether you're launching the next big thing or backing the change you want to see, your journey starts here.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link 
                href="/campaign/new" 
                className="w-full sm:w-auto flex items-center justify-center space-x-3 px-10 py-5 bg-teal-400 text-gray-950 font-black rounded-2xl hover:bg-teal-300 transition-all duration-300 text-lg shadow-xl shadow-teal-500/10"
              >
                <ArrowTrendingUpIcon className="w-6 h-6" />
                <span>Launch Campaign</span>
              </Link>

              <Link 
                href="/campaign/list" 
                className="w-full sm:w-auto flex items-center justify-center space-x-3 px-10 py-5 bg-white/5 backdrop-blur-md border border-white/20 text-white font-bold rounded-2xl hover:bg-white/10 transition-all duration-300 text-lg"
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
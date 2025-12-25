import Link from 'next/link';
import { SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import StatSection from '@/components/StatSection';
import HowItWorks from '@/components/HowItWorks';
import FeaturedCampaigns from '@/components/FeaturedCampaigns';
import TestimonialsSection from '@/components/TestimonialsSection';
import CtaSection from '@/components/CtaSection';

export default function Home() {
  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0f1d]">
        {/* Modern Background: Mesh Gradients & Animated Blobs */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px]"></div>
          {/* Grid Pattern overlay for tech feel */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0f1d]/50 to-[#0a0f1d]"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center px-6 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span>Empowering 1,000+ Active Projects</span>
          </div>

          {/* Main Headline with Gradient Text */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-500">
              Fund Your Dream.
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-500">
              Ignite Change.
            </span>
          </h1>

          {/* Sub-Headline */}
          <p className="text-lg sm:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            The all-in-one platform to launch impactful campaigns, find dedicated backers, and turn innovative ideas into reality.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link 
              href="/campaign/list" 
              className="group relative flex items-center space-x-3 px-10 py-4 bg-teal-400 text-gray-950 font-black rounded-full shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] transition-all duration-300 text-xl"
            >
              <SparklesIcon className="w-6 h-6 transition-transform group-hover:rotate-12" />
              <span>Find a Project</span>
            </Link>

            <a 
              href="#how-it-works" 
              className="flex items-center space-x-2 px-10 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 text-xl"
            >
              <span>See How It Works</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <div className="w-1 h-12 rounded-full bg-gradient-to-b from-teal-400 to-transparent"></div>
        </div>
      </section>

      <StatSection />
      <HowItWorks />
      <FeaturedCampaigns/>
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
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
      <section className="bg-gray-900 text-white min-h-[70vh] flex items-center justify-center relative overflow-hidden">
      
      {/* Background Gradient Effect (Optional but enhances the modern feel) */}
      <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-indigo-900/50 to-gray-900/50 z-0"></div>
      
      <div className="max-w-4xl mx-auto text-center p-8 relative z-10">
        
        {/* Main Headline (Large and Captivating) */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6">
          Fund Your Dream Project. <br className="hidden md:inline"/> Ignite Change.
        </h1>

        {/* Sub-Headline (All-in-one platform...) */}
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
          The all-in-one platform to launch impactful campaigns, find dedicated backers, and turn innovative ideas into reality.
        </p>

        {/* CTA Buttons (Matching the style: Primary Green and Secondary Dark Outline) */}
        <div className="flex justify-center space-x-4">
          
          {/* Primary CTA: Start Funding (Green/Teal Button) */}
          <Link 
            href="/campaign/list" 
            className="flex items-center space-x-2 px-8 py-3 bg-teal-400 text-gray-900 font-bold rounded-lg shadow-xl hover:bg-teal-300 transition duration-300 text-lg"
          >
            <SparklesIcon className="w-6 h-6" />
            <span>Find a Project</span>
          </Link>

          {/* Secondary CTA: See How It Works (Dark Outline Button) */}
          <a 
            href="#how-it-works" 
            className="flex items-center space-x-2 px-8 py-3 border border-white/50 text-white font-medium rounded-lg hover:bg-white/10 transition duration-300 text-lg"
          >
            <ArrowRightIcon className="w-5 h-5" />
            <span>See How It Works</span>
          </a>
        </div>
        
        

      </div>
    </section>
    <StatSection />
    <HowItWorks />
    {/* <FeaturedCampaigns/> */}
    <TestimonialsSection />
    <CtaSection />

    </>
  );
}

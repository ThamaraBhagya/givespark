// components/CtaSection.tsx
import Link from 'next/link';
import { ArrowTrendingUpIcon, HandRaisedIcon } from '@heroicons/react/24/solid'; // Example icons

export default function CtaSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Gradient Banner Container */}
        <div className="p-10 rounded-3xl text-center shadow-2xl 
                        bg-linear-to-r from-indigo-600 to-teal-500">
          
          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white">
            Ready to Make an Impact?
          </h2>
          
          {/* Subtitle */}
          <p className="mt-4 text-xl text-indigo-100 max-w-3xl mx-auto">
            Whether you need backing or want to give it, your journey to change starts here.
          </p>

          {/* Dual CTA Buttons */}
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            
            {/* CTA 1: For Creators */}
            <Link 
              href="/campaign/new" 
              className="flex items-center space-x-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl shadow-lg hover:bg-gray-100 transition duration-300 text-lg"
            >
              <ArrowTrendingUpIcon className="w-6 h-6" />
              <span>Launch Your Campaign</span>
            </Link>

            {/* CTA 2: For Donors */}
            <Link 
              href="/campaigns/list" 
              className="flex items-center space-x-2 px-8 py-4 border border-white text-white font-medium rounded-xl hover:bg-white/10 transition duration-300 text-lg"
            >
              <HandRaisedIcon className="w-6 h-6" />
              <span>Explore Projects to Fund</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
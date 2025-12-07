// components/HowItWorks.tsx
import { LightBulbIcon, PencilSquareIcon, HeartIcon, GiftIcon } from '@heroicons/react/24/outline'; // Example icons
import Link from 'next/link';

const steps = [
  {
    step: 1,
    name: 'Ideate & Plan',
    description: 'A creator identifies a project, sets a clear financial goal, and specifies a deadline for funding.',
    icon: LightBulbIcon,
  },
  {
    step: 2,
    name: 'Launch Campaign',
    description: 'The creator uses the GiveSpark dashboard to upload media, write their story, and officially launch the campaign.',
    icon: PencilSquareIcon,
  },
  {
    step: 3,
    name: 'Inspire Backers',
    description: 'Donors browse active campaigns and contribute funds via our secure mock payment system.',
    icon: HeartIcon,
  },
  {
    step: 4,
    name: 'Withdraw & Deliver',
    description: 'The creator withdraws the funds from their virtual wallet and delivers on their promise to the backers.',
    icon: GiftIcon,
  },
];

export default function HowItWorks() {
  return (
    // Set the anchor tag here for the Navbar link: href="#how-it-works"
    <section id="how-it-works" className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-teal-600 tracking-wide uppercase">Simple Process</h2>
          <p className="mt-2 text-4xl font-extrabold text-gray-900">
            How GiveSpark Works in 4 Steps
          </p>
        </div>

        {/* 4-Step Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
          {steps.map((stepItem) => (
            <div key={stepItem.step} className="text-center p-6 transition duration-300 transform hover:scale-[1.03] hover:shadow-xl rounded-lg bg-white shadow-md">
              
              {/* Icon and Step Number */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 border-4 border-indigo-200 shadow-lg">
                  <stepItem.icon className="h-8 w-8" aria-hidden="true" />
                </div>
                <div className="mt-4 mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Step {stepItem.step}
                </div>
              </div>

              {/* Title */}
              <h3 className="mt-2 text-xl font-bold text-gray-900">
                {stepItem.name}
              </h3>

              {/* Description */}
              <p className="mt-4 text-base text-gray-500">
                {stepItem.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Call to Action Button below the steps */}
        <div className="mt-16 text-center">
             <Link 
              href="/campaign/new" 
              className="px-8 py-3 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300"
            >
              Ready to Launch Your Idea? Start Now →
            </Link>
        </div>

      </div>
    </section>
  );
}
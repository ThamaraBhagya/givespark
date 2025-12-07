// components/StatsSection.tsx
import { HandRaisedIcon, RocketLaunchIcon, UserGroupIcon } from '@heroicons/react/24/outline'; // Example icons

const stats = [
  {
    id: 1,
    name: 'Campaigns Launched',
    value: '120+',
    icon: RocketLaunchIcon,
    description: 'Ideas successfully transitioned from concept to active funding.'
  },
  {
    id: 2,
    name: 'Total Funds Raised',
    value: '$5.3M',
    icon: HandRaisedIcon,
    description: 'Millions contributed by a global community of generous backers.'
  },
  {
    id: 3,
    name: 'Active Backers',
    value: '8,000+',
    icon: UserGroupIcon,
    description: 'Our growing community committed to supporting innovation and change.'
  },
];

export default function StatsSection() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header (Optional) */}
        <div className="text-center mb-12">
          <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Our Impact</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Realizing Goals, One Campaign at a Time.
          </p>
        </div>

        {/* Stats Grid */}
        <dl className="grid grid-cols-1 gap-12 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col text-center p-8 bg-gray-50 rounded-xl shadow-lg border-t-4 border-indigo-500/50">
              
              {/* Icon with Gradient Effect */}
              <div className="mx-auto mb-4 p-3 rounded-full bg-linear-to-r from-indigo-500 to-teal-400 shadow-lg">
                <stat.icon className="h-8 w-8 text-white" aria-hidden="true" />
              </div>

              {/* Value (The Big Number) */}
              <dd className="order-first text-5xl font-extrabold text-gray-900">
                {stat.value}
              </dd>

              {/* Name/Label */}
              <dt className="mt-2 text-lg font-medium text-gray-600">
                {stat.name}
              </dt>
              
              {/* Description */}
              <p className="mt-4 text-sm text-gray-500">
                {stat.description}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
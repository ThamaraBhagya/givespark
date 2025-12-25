// components/CampaignCard.tsx
import Link from 'next/link';
import Image from 'next/image';

interface CampaignCardProps {
  campaign: {
    id: string;
    title: string;
    shortDesc: string;
    featuredImage: string;
    currentAmount: number;
    goalAmount: number;
  };
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const fundedPercentage = Math.min(100, (campaign.currentAmount / campaign.goalAmount) * 100);

  return (
    <Link 
      href={`/campaign/${campaign.id}`} 
      className="group block bg-[#111827]/60 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden transition-all duration-500 hover:border-teal-500/30 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
    >
      {/* Featured Image with Overlay */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image 
          src={campaign.featuredImage || '/placeholder.jpg'} 
          alt={campaign.title} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Dark overlay for better text contrast if needed */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent opacity-60" />
        
        {/* Category Badge (Optional/Placeholder) */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-teal-500 text-[10px] font-black uppercase tracking-widest text-gray-950">
          Active
        </div>
      </div>

      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-black text-white line-clamp-1 group-hover:text-teal-400 transition-colors">
          {campaign.title}
        </h3>

        {/* Short Description */}
        <p className="mt-3 text-sm text-gray-400 line-clamp-2 font-light leading-relaxed">
          {campaign.shortDesc}
        </p>

        {/* Progress Bar Section */}
        <div className="mt-6">
          <div className="flex justify-between items-end mb-2">
             <span className="text-xs font-black text-teal-400 uppercase tracking-widest">
               {fundedPercentage.toFixed(0)}% Funded
             </span>
             <span className="text-xs text-gray-500 font-medium">
               Goal: ${campaign.goalAmount.toLocaleString()}
             </span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-teal-400 to-indigo-500 transition-all duration-1000 ease-out" 
              style={{ width: `${fundedPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Funding Stats */}
        <div className="mt-6 pt-5 border-t border-white/5 flex justify-between items-center">
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">Raised</p>
            <p className="text-lg font-black text-white">
              ${campaign.currentAmount.toLocaleString()}
            </p>
          </div>
          
          <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-teal-500 transition-colors duration-300">
             <svg className="w-5 h-5 text-white group-hover:text-gray-950 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="ArrowRightIcon" />
               <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
             </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
// components/CampaignCard.tsx
import Link from 'next/link';
import Image from 'next/image';
// import ProgressBar from './ui/ProgressBar'; // Assume you have a ProgressBar component

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
    <Link href={`/campaign/${campaign.id}`} className="block bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden">

      {/* Featured Image */}
      <div className="relative h-48 w-full">
        <Image 
          src={campaign.featuredImage || '/placeholder.jpg'} 
          alt={campaign.title} 
          layout="fill" 
          objectFit="cover" 
        />
      </div>

      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
          {campaign.title}
        </h3>

        {/* Short Description */}
        <p className="mt-2 text-sm text-gray-500 line-clamp-3">
          {campaign.shortDesc}
        </p>

        {/* Progress Bar (Replace with actual ProgressBar component) */}
        <div className="mt-4">
            {/* <ProgressBar percentage={fundedPercentage} /> */}
            <div className="h-2 bg-gray-200 rounded-full">
                <div 
                    className="h-2 rounded-full bg-teal-500" 
                    style={{ width: `${fundedPercentage}%` }}
                ></div>
            </div>
        </div>

        {/* Funding Stats */}
        <div className="mt-3 flex justify-between text-sm">
          <p className="font-semibold text-gray-900">
            ${campaign.currentAmount.toFixed(0)} 
            <span className="font-normal text-gray-500"> raised</span>
          </p>
          <p className="text-gray-500">Goal: ${campaign.goalAmount.toFixed(0)}</p>
        </div>
      </div>
    </Link>
  );
}
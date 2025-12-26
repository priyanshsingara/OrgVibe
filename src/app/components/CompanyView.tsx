import { PlusCircle } from 'lucide-react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { ScrambleText } from './ScrambleText';
import { Organization, Review } from '../data';
import { ReviewCard } from './ReviewCard';
import { cn } from '../../lib/utils';

interface CompanyViewProps {
  organization: Organization;
  reviews: Review[];
  onAddVibe: () => void;
}

export function CompanyView({ organization, reviews, onAddVibe }: CompanyViewProps) {
  return (
    <div className="flex flex-col w-full h-full p-[48px] pt-[32px] overflow-y-auto">
      {/* Title */}
      <ScrambleText 
        text={organization.name}
        className="font-['Gasoek_One',sans-serif] leading-[1.1] text-[clamp(50px,10vw,120px)] text-white drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] mb-[40px] break-words uppercase"
      />

      {/* Add Button */}
      <button 
        onClick={onAddVibe}
        className="w-full mb-[40px] group focus:outline-none"
      >
        <div className="backdrop-blur-[18px] bg-[rgba(255,255,255,0.1)] relative rounded-[8px] w-full border-2 border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.15)] transition-colors">
          <div className="flex flex-row items-center justify-center p-[16px] gap-[8px]">
            <PlusCircle className="w-6 h-6 text-[#F2F2F7]" />
            <p className="font-['Geist_Mono',monospace] font-black leading-[1.1] text-[16px] text-white tracking-[0.48px] uppercase">
              ADD NEW VIBE
            </p>
          </div>
        </div>
      </button>

      {/* Reviews Grid */}
      <div className="w-full pb-20">
        <ResponsiveMasonry
          columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
        >
          <Masonry gutter="16px">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </div>
  );
}

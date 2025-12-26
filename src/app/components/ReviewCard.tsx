import { Review } from '../data';
import { cn } from '../../lib/utils';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="flex flex-col w-full rounded-[8px] overflow-hidden backdrop-blur-md bg-white/5">
      {/* Header */}
      <div className="w-full bg-[rgba(255,255,255,0.1)] py-[12px] px-[12px] flex items-center border-b border-white/5">
        <p className="font-['Geist_Mono',monospace] font-normal leading-[1.1] text-[12px] text-[rgba(255,255,255,0.3)] tracking-[-0.24px]">
          <span>{review.author} posted </span>
          <span className={cn(
            review.sentiment === 'good' ? "text-[#34c759]" : 
            review.sentiment === 'bad' ? "text-red-500" : "text-white/50"
          )}>
            “{review.sentiment} vibe”
          </span>
          <span> {review.timestamp}</span>
        </p>
      </div>

      {/* Content */}
      <div className="w-full bg-[rgba(255,255,255,0.1)] p-[12px] pt-0 flex flex-col gap-3">
        {/* Title */}
        <div className="pt-[12px]">
            <p className="font-['Geist_Mono',monospace] font-bold leading-[1.5] text-[16px] text-white">
            {review.title}
            </p>
        </div>

        {/* Text */}
        <div className="font-['Geist_Mono',monospace] font-normal leading-[1.5] text-[14px] text-white">
          {review.content.map((line, index) => (
            <p key={index} className="mb-0">{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

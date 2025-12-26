import { Review } from '../data';
import { cn } from '../../lib/utils';

// Fruit/veggie names for anonymous users
const ANONYMOUS_NAMES = [
  'apple', 'banana', 'strawberry', 'mango', 'peach', 'cherry', 'grape', 'lemon', 
  'lime', 'orange', 'kiwi', 'melon', 'papaya', 'coconut', 'avocado', 'carrot', 
  'pepper', 'tomato', 'potato', 'onion', 'broccoli', 'spinach', 'celery', 
  'cucumber', 'radish', 'turnip', 'beet', 'corn', 'pea', 'bean'
];

// Get a deterministic fruit name based on review ID
function getAnonymousName(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % ANONYMOUS_NAMES.length;
  return ANONYMOUS_NAMES[index];
}

// Compact time formatter
function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const years = Math.floor(days / 365);
  
  if (minutes < 1) return '1m ago';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 365) return `${days}d ago`;
  return `${years}y ago`;
}

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const fruitName = getAnonymousName(review.id);
  const timeAgo = formatTimeAgo(review.timestamp);
  
  return (
    <div className="flex flex-col w-full rounded-[8px] overflow-hidden backdrop-blur-md bg-white/5">
      {/* Header */}
      <div className="w-full bg-[rgba(255,255,255,0.1)] py-[12px] px-[12px] flex items-center border-b border-white/5">
        <p className="font-['Geist_Mono',monospace] font-normal leading-[1.1] text-[12px] text-[rgba(255,255,255,0.3)] tracking-[-0.24px]">
          <span>unknown {fruitName} posted </span>
          <span className={cn(
            review.sentiment === 'good' ? "text-[#34c759]" : 
            review.sentiment === 'bad' ? "text-red-500" : "text-white/50"
          )}>
            {review.sentiment} vibes
          </span>
          <span> {timeAgo}</span>
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

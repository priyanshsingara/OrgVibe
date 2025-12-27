import { Review } from '../data';
import { cn } from '../../lib/utils';
import { ArrowFatLinesUp, ArrowFatLinesDown } from '@phosphor-icons/react';

// Sentiment colors (matching NewVibeModal)
const SENTIMENT_COLORS = {
  good: '#34c759',
  neutral: '#FFD700',
  bad: '#FF3B30',
} as const;

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

// Format vote count with leading zero for single digits
function formatVoteCount(count: number): string {
  return count.toString().padStart(2, '0');
}

// Get sentiment label
function getSentimentLabel(sentiment: 'good' | 'bad' | 'neutral'): string {
  if (sentiment === 'good') return 'good vibe';
  if (sentiment === 'neutral') return 'mid vibe';
  return 'bad vibe';
}

interface ReviewCardProps {
  review: Review;
  onVote?: (reviewId: string, voteType: 'up' | 'down') => void;
}

export function ReviewCard({ review, onVote }: ReviewCardProps) {
  const fruitName = getAnonymousName(review.id);
  const timeAgo = formatTimeAgo(review.timestamp);
  const sentimentColor = SENTIMENT_COLORS[review.sentiment];
  const sentimentLabel = getSentimentLabel(review.sentiment);
  
  const handleUpvote = () => {
    onVote?.(review.id, 'up');
  };

  const handleDownvote = () => {
    onVote?.(review.id, 'down');
  };

  return (
    <div className="flex flex-col w-full rounded-[8px] overflow-hidden backdrop-blur-md bg-white/5">
      {/* Header with colored left border */}
      <div className="w-full bg-[rgba(255,255,255,0.1)] py-[12px] flex items-center">
        <div 
          className="flex items-center px-[12px] py-[4px] w-full"
          style={{ borderLeft: `4px solid ${sentimentColor}` }}
        >
          <p className="font-['Geist_Mono',monospace] font-normal leading-[1.1] text-[12px] text-[rgba(255,255,255,0.3)] tracking-[-0.24px]">
            <span>{fruitName} posted </span>
            <span style={{ color: sentimentColor }}>"{sentimentLabel}" </span>
            <span>{timeAgo}</span>
          </p>
        </div>
      </div>

      {/* Title */}
      <div className="w-full bg-[rgba(255,255,255,0.1)] pb-[12px] pt-0 px-[12px]">
        <p className="font-['Geist_Mono',monospace] font-bold leading-[1.5] text-[16px] text-white">
          {review.title}
        </p>
      </div>

      {/* Content */}
      <div className="w-full bg-[rgba(255,255,255,0.1)] pb-[12px] pt-0 px-[12px]">
        <div className="font-['Geist_Mono',monospace] font-normal leading-[1.5] text-[14px] text-white">
          {review.content.map((line, index) => (
            <p key={index} className="mb-0">{line}</p>
          ))}
        </div>
      </div>

      {/* Vote Buttons */}
      <div className="w-full bg-[rgba(255,255,255,0.1)] pb-[12px] pt-0 px-[12px]">
        <div className="flex gap-[8px] items-center">
          {/* Upvote Button */}
          <button
            onClick={handleUpvote}
            className="bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.1)] flex gap-[8px] items-center justify-center px-[10px] py-[6px] rounded-[8px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.1)] hover:bg-[rgba(255,255,255,0.25)] transition-colors cursor-pointer"
          >
            <ArrowFatLinesUp size={16} weight="fill" className="text-white shrink-0" />
            <span 
              className="font-['Audiowide',sans-serif] leading-[1.5] text-[12px] text-white tracking-[0.48px] min-w-[1.5em] text-center"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {formatVoteCount(review.upvotes || 0)}
            </span>
          </button>

          {/* Downvote Button */}
          <button
            onClick={handleDownvote}
            className="bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.1)] flex gap-[8px] items-center justify-center px-[10px] py-[6px] rounded-[8px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.1)] hover:bg-[rgba(255,255,255,0.25)] transition-colors cursor-pointer"
          >
            <ArrowFatLinesDown size={16} weight="fill" className="text-white shrink-0" />
            <span 
              className="font-['Audiowide',sans-serif] leading-[1.5] text-[12px] text-white tracking-[0.48px] min-w-[1.5em] text-center"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {formatVoteCount(review.downvotes || 0)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

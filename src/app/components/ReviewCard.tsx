import { useState, useRef, useCallback } from 'react';
import { Review } from '../data';
import { cn } from '../../lib/utils';
import { ArrowFatLinesUp, ArrowFatLinesDown } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';

// Sentiment colors (matching NewVibeModal)
const SENTIMENT_COLORS = {
  good: '#34c759',
  neutral: '#FFD700',
  bad: '#FF3B30',
} as const;

// Emoji configuration
const VOTE_EMOJIS = {
  up: '🙌',
  down: '🚧',
  burst: '🕊️',
} as const;

// Animation configuration
const ANIMATION_CONFIG = {
  normalCount: 1, // single emoji on normal click
  burstCount: { min: 4, max: 6 }, // reduced for cleaner burst
  burstThreshold: 5, // clicks needed to trigger burst
  burstTimeWindow: 3000, // 3 seconds
  emojiSize: 40, // px - for normal vote emojis
  burstEmojiSize: 60, // px - larger size for burst dove emojis
  duration: { min: 0.8, max: 1.2 },
  riseDistance: { min: 80, max: 120 },
  driftX: { min: -30, max: 30 },
} as const;

// Types for floating emojis
interface FloatingEmoji {
  id: string;
  emoji: string;
  buttonType: 'up' | 'down'; // which button spawned this
  x: number;
  y: number;
  isBurst: boolean;
  angle?: number; // for burst direction
}

// Generate random number in range
const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

// Generate unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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
  
  // Floating emoji state
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  
  // Click tracking for burst detection
  const upvoteClicksRef = useRef<number[]>([]);
  const downvoteClicksRef = useRef<number[]>([]);
  const upvoteButtonRef = useRef<HTMLButtonElement>(null);
  const downvoteButtonRef = useRef<HTMLButtonElement>(null);

  // Check if burst mode should trigger
  const checkBurstMode = useCallback((clicksRef: React.MutableRefObject<number[]>) => {
    const now = Date.now();
    // Filter clicks within time window
    clicksRef.current = clicksRef.current.filter(
      time => now - time < ANIMATION_CONFIG.burstTimeWindow
    );
    clicksRef.current.push(now);
    return clicksRef.current.length >= ANIMATION_CONFIG.burstThreshold;
  }, []);

  // Spawn floating emojis
  const spawnEmojis = useCallback((
    voteType: 'up' | 'down',
    buttonRef: React.RefObject<HTMLButtonElement | null>,
    isBurst: boolean
  ) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    // Spawn at icon position - left aligned, near top of button
    const centerX = 18; // px-[10px] padding + half icon width
    const centerY = -8; // 8px above the button for natural upward emergence
    
    // Use vote emoji for normal click, dove for burst
    const emoji = isBurst ? VOTE_EMOJIS.burst : VOTE_EMOJIS[voteType];

    // Single emoji for normal, multiple for burst
    const count = isBurst
      ? Math.floor(randomInRange(ANIMATION_CONFIG.burstCount.min, ANIMATION_CONFIG.burstCount.max))
      : ANIMATION_CONFIG.normalCount;

    const newEmojis: FloatingEmoji[] = [];

    for (let i = 0; i < count; i++) {
      const angle = isBurst ? (360 / count) * i + randomInRange(-15, 15) : undefined;
      newEmojis.push({
        id: generateId(),
        emoji,
        buttonType: voteType,
        x: centerX,
        y: centerY,
        isBurst,
        angle,
      });
    }

    setFloatingEmojis(prev => [...prev, ...newEmojis]);

    // Clean up emojis after animation
    setTimeout(() => {
      setFloatingEmojis(prev => 
        prev.filter(e => !newEmojis.some(ne => ne.id === e.id))
      );
    }, 1500);
  }, []);

  // Handle vote with animation
  const handleVote = useCallback((
    voteType: 'up' | 'down',
    clicksRef: React.MutableRefObject<number[]>,
    buttonRef: React.RefObject<HTMLButtonElement | null>
  ) => {
    const isBurst = checkBurstMode(clicksRef);
    spawnEmojis(voteType, buttonRef, isBurst);
    
    // Reset clicks after burst
    if (isBurst) {
      clicksRef.current = [];
    }
    
    onVote?.(review.id, voteType);
  }, [checkBurstMode, spawnEmojis, onVote, review.id]);

  const handleUpvote = () => {
    handleVote('up', upvoteClicksRef, upvoteButtonRef);
  };

  const handleDownvote = () => {
    handleVote('down', downvoteClicksRef, downvoteButtonRef);
  };

  return (
    <div className="flex flex-col w-full rounded-[8px] backdrop-blur-md bg-white/5">
      {/* Header with colored left border */}
      <div className="w-full bg-[rgba(255,255,255,0.1)] py-[12px] flex items-center rounded-t-[8px]">
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
      <div className="w-full bg-[rgba(255,255,255,0.1)] pb-[8px] pt-0 px-[12px]">
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
      <div className="w-full bg-[rgba(255,255,255,0.1)] pb-[12px] pt-0 px-[12px] rounded-b-[8px]">
        <div className="flex gap-[8px] items-center">
          {/* Upvote Button */}
          <button
            ref={upvoteButtonRef}
            onClick={handleUpvote}
            className="relative overflow-visible bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.1)] flex gap-[8px] items-center justify-center px-[10px] py-[6px] rounded-[8px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.1)] hover:bg-[rgba(255,255,255,0.25)] transition-colors cursor-pointer"
          >
            <ArrowFatLinesUp size={16} weight="fill" className="text-white shrink-0" />
            <span 
              className="font-['Audiowide',sans-serif] leading-[1.5] text-[12px] text-white tracking-[0.48px] min-w-[1.5em] text-center"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {formatVoteCount(review.upvotes || 0)}
            </span>
            
            {/* Floating Emojis for Upvote */}
            <AnimatePresence>
              {floatingEmojis
                .filter(e => e.buttonType === 'up')
                .map(emoji => (
                  <motion.span
                    key={emoji.id}
                    initial={{ 
                      opacity: 1, 
                      x: 0, 
                      y: 0,
                      scale: 0.5,
                    }}
                    animate={{ 
                      opacity: 0,
                      x: emoji.isBurst && emoji.angle !== undefined
                        ? Math.cos((emoji.angle * Math.PI) / 180) * randomInRange(40, 70)
                        : randomInRange(ANIMATION_CONFIG.driftX.min, ANIMATION_CONFIG.driftX.max),
                      y: emoji.isBurst && emoji.angle !== undefined
                        ? Math.sin((emoji.angle * Math.PI) / 180) * randomInRange(40, 70)
                        : -randomInRange(ANIMATION_CONFIG.riseDistance.min, ANIMATION_CONFIG.riseDistance.max),
                      scale: 1,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: randomInRange(ANIMATION_CONFIG.duration.min, ANIMATION_CONFIG.duration.max),
                      ease: 'easeOut',
                    }}
                    className="absolute pointer-events-none select-none"
                    style={{ 
                      fontSize: emoji.isBurst ? ANIMATION_CONFIG.burstEmojiSize : ANIMATION_CONFIG.emojiSize,
                      left: emoji.x,
                      top: emoji.y,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 50,
                    }}
                  >
                    {emoji.emoji}
                  </motion.span>
                ))}
            </AnimatePresence>
          </button>

          {/* Downvote Button */}
          <button
            ref={downvoteButtonRef}
            onClick={handleDownvote}
            className="relative overflow-visible bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.1)] flex gap-[8px] items-center justify-center px-[10px] py-[6px] rounded-[8px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.1)] hover:bg-[rgba(255,255,255,0.25)] transition-colors cursor-pointer"
          >
            <ArrowFatLinesDown size={16} weight="fill" className="text-white shrink-0" />
            <span 
              className="font-['Audiowide',sans-serif] leading-[1.5] text-[12px] text-white tracking-[0.48px] min-w-[1.5em] text-center"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {formatVoteCount(review.downvotes || 0)}
            </span>
            
            {/* Floating Emojis for Downvote */}
            <AnimatePresence>
              {floatingEmojis
                .filter(e => e.buttonType === 'down')
                .map(emoji => (
                  <motion.span
                    key={emoji.id}
                    initial={{ 
                      opacity: 1, 
                      x: 0, 
                      y: 0,
                      scale: 0.5,
                    }}
                    animate={{ 
                      opacity: 0,
                      x: emoji.isBurst && emoji.angle !== undefined
                        ? Math.cos((emoji.angle * Math.PI) / 180) * randomInRange(40, 70)
                        : randomInRange(ANIMATION_CONFIG.driftX.min, ANIMATION_CONFIG.driftX.max),
                      y: emoji.isBurst && emoji.angle !== undefined
                        ? Math.sin((emoji.angle * Math.PI) / 180) * randomInRange(40, 70)
                        : -randomInRange(ANIMATION_CONFIG.riseDistance.min, ANIMATION_CONFIG.riseDistance.max),
                      scale: 1,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: randomInRange(ANIMATION_CONFIG.duration.min, ANIMATION_CONFIG.duration.max),
                      ease: 'easeOut',
                    }}
                    className="absolute pointer-events-none select-none"
                    style={{ 
                      fontSize: emoji.isBurst ? ANIMATION_CONFIG.burstEmojiSize : ANIMATION_CONFIG.emojiSize,
                      left: emoji.x,
                      top: emoji.y,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 50,
                    }}
                  >
                    {emoji.emoji}
                  </motion.span>
                ))}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </div>
  );
}

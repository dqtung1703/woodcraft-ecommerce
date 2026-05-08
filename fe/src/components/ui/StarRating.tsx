import { Star } from 'lucide-react';

type Props = {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export default function StarRating({ rating, maxStars = 5, size = 'md', className = '' }: Props) {
  const s = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' }[size];
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: maxStars }).map((_, i) => (
        <Star
          key={i}
          className={`${s} ${i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
      <span className="text-xs text-on-surface-variant ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

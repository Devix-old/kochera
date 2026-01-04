'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export default function Rating({ 
  rating, 
  count, 
  size = 'md', 
  showCount = true,
  className 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Star
          key={i}
          className={cn(sizeClasses[size], 'fill-amber-400 text-amber-400')}
        />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative">
          <Star className={cn(sizeClasses[size], 'text-gray-300')} />
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star className={cn(sizeClasses[size], 'fill-amber-400 text-amber-400')} />
          </div>
        </div>
      );
    } else {
      stars.push(
        <Star
          key={i}
          className={cn(sizeClasses[size], 'text-gray-300')}
        />
      );
    }
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex gap-0.5">{stars}</div>
      {showCount && count > 0 && (
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
          ({count})
        </span>
      )}
    </div>
  );
}


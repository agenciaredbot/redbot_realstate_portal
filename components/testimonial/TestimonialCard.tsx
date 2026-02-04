'use client';

import Image from 'next/image';
import { Star, Quote } from 'lucide-react';
import type { Testimonial } from '@/types';
import { cn } from '@/lib/utils';

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
  variant?: 'default' | 'dark';
}

export function TestimonialCard({
  testimonial,
  className,
  variant = 'default',
}: TestimonialCardProps) {
  const isDark = variant === 'dark';

  return (
    <div
      className={cn(
        'rounded-xl p-6 md:p-8 h-full',
        isDark
          ? 'bg-white/5 backdrop-blur-sm'
          : 'bg-white shadow-luxus',
        className
      )}
    >
      {/* Quote Icon */}
      <Quote
        className={cn(
          'w-10 h-10 mb-4',
          isDark ? 'text-luxus-gold/30' : 'text-luxus-gold/20'
        )}
      />

      {/* Content */}
      <p
        className={cn(
          'mb-6 leading-relaxed',
          isDark ? 'text-gray-300' : 'text-luxus-gray'
        )}
      >
        "{testimonial.content}"
      </p>

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'w-4 h-4',
              i < testimonial.rating
                ? 'text-yellow-500 fill-yellow-500'
                : isDark
                ? 'text-gray-600'
                : 'text-gray-300'
            )}
          />
        ))}
      </div>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-full overflow-hidden">
          <Image
            src={testimonial.photo_url || '/images/avatar-placeholder.jpg'}
            alt={testimonial.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p
            className={cn(
              'font-semibold',
              isDark ? 'text-white' : 'text-luxus-dark'
            )}
          >
            {testimonial.name}
          </p>
          <p
            className={cn(
              'text-sm',
              isDark ? 'text-gray-400' : 'text-luxus-gray'
            )}
          >
            {testimonial.role}
            {testimonial.company && ` - ${testimonial.company}`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;

'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PropertyDescriptionProps {
  description: string;
  className?: string;
}

export function PropertyDescription({
  description,
  className,
}: PropertyDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if description is long enough to need truncation
  const isLongDescription = description.length > 500;
  const shouldTruncate = isLongDescription && !isExpanded;

  return (
    <div className={cn('bg-white rounded-xl p-6 shadow-luxus', className)}>
      <h2 className="text-xl font-semibold text-luxus-dark mb-6 font-heading flex items-center gap-2">
        <span className="w-8 h-1 bg-luxus-gold rounded-full" />
        Descripción
      </h2>

      <div className="relative">
        <div
          className={cn(
            'text-luxus-gray leading-relaxed whitespace-pre-line',
            shouldTruncate && 'max-h-40 overflow-hidden'
          )}
        >
          {description}
        </div>

        {/* Gradient overlay when truncated */}
        {shouldTruncate && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>

      {isLongDescription && (
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-luxus-gold hover:text-luxus-gold-dark hover:bg-luxus-cream/50"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Ver menos
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              Ver más
            </>
          )}
        </Button>
      )}
    </div>
  );
}

export default PropertyDescription;

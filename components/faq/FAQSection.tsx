'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  title?: string;
  subtitle?: string;
  className?: string;
  variant?: 'default' | 'accordion';
}

export function FAQSection({
  faqs,
  title = 'Preguntas Frecuentes',
  subtitle,
  className,
  variant = 'default',
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (variant === 'accordion') {
    return (
      <div className={className}>
        {(title || subtitle) && (
          <div className="text-center mb-8">
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold text-luxus-dark font-serif mb-2">
                {title}
              </h2>
            )}
            {subtitle && <p className="text-luxus-gray">{subtitle}</p>}
          </div>
        )}

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-luxus overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-luxus-dark pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-luxus-gold flex-shrink-0 transition-transform',
                    openIndex === index && 'rotate-180'
                  )}
                />
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5 pt-0">
                  <p className="text-luxus-gray">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default variant - simple cards
  return (
    <div className={className}>
      {(title || subtitle) && (
        <div className="text-center mb-8">
          <p className="text-luxus-gold font-medium uppercase tracking-wider text-sm mb-2">
            {subtitle || '¿Tienes Dudas?'}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-luxus-dark font-serif">
            {title}
          </h2>
        </div>
      )}

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-luxus-cream rounded-xl p-6">
            <h3 className="text-lg font-semibold text-luxus-dark mb-2">
              {faq.question}
            </h3>
            <p className="text-luxus-gray">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQSection;

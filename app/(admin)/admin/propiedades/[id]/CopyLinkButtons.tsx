'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link2, Link2Off, Check } from 'lucide-react';

interface CopyLinkButtonsProps {
  slug: string;
}

export function CopyLinkButtons({ slug }: CopyLinkButtonsProps) {
  const [copiedNormal, setCopiedNormal] = useState(false);
  const [copiedGeneric, setCopiedGeneric] = useState(false);

  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  };

  const copyToClipboard = async (path: string, type: 'normal' | 'generic') => {
    const fullUrl = `${getBaseUrl()}${path}`;

    try {
      await navigator.clipboard.writeText(fullUrl);

      if (type === 'normal') {
        setCopiedNormal(true);
        setTimeout(() => setCopiedNormal(false), 2000);
      } else {
        setCopiedGeneric(true);
        setTimeout(() => setCopiedGeneric(false), 2000);
      }
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {/* Link Normal */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => copyToClipboard(`/propiedades/${slug}`, 'normal')}
        className="flex items-center gap-2"
      >
        {copiedNormal ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Link2 className="h-4 w-4" />
        )}
        <span>{copiedNormal ? 'Copiado!' : 'Copiar Link'}</span>
      </Button>

      {/* Link Genérico (Sin Branding) */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => copyToClipboard(`/p/${slug}`, 'generic')}
        className="flex items-center gap-2"
        title="Link sin header, footer ni información de contacto"
      >
        {copiedGeneric ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Link2Off className="h-4 w-4" />
        )}
        <span>{copiedGeneric ? 'Copiado!' : 'Link Genérico'}</span>
      </Button>
    </div>
  );
}

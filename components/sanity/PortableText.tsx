'use client';

import { PortableText as PortableTextRenderer, type PortableTextComponents } from '@portabletext/react';
import { urlFor } from '@/lib/sanity/client';
import Image from 'next/image';

// Define custom components for rendering Portable Text blocks
const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mt-5 mb-2 text-gray-800">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold mt-4 mb-2 text-gray-800">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-gray-600">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="ml-2">{children}</li>,
    number: ({ children }) => <li className="ml-2">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    code: ({ children }) => (
      <code className="bg-gray-100 rounded px-1.5 py-0.5 text-sm font-mono text-red-600">
        {children}
      </code>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null;
      return (
        <div className="my-6 rounded-lg overflow-hidden">
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt || 'Imagen del artículo'}
            width={800}
            height={450}
            className="w-full h-auto object-cover"
          />
          {value.caption && (
            <p className="text-sm text-gray-500 mt-2 text-center">{value.caption}</p>
          )}
        </div>
      );
    },
  },
};

interface PortableTextProps {
  value: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  className?: string;
}

export default function PortableText({ value, className }: PortableTextProps) {
  if (!value) return null;

  return (
    <div className={className || 'prose prose-gray max-w-none'}>
      <PortableTextRenderer value={value} components={components} />
    </div>
  );
}

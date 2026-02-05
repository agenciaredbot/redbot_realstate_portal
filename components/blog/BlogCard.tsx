'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { BlogPost } from '@/types';
import { cn } from '@/lib/utils';

interface BlogCardProps {
  post: BlogPost;
  className?: string;
  variant?: 'default' | 'featured';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function BlogCard({ post, className, variant = 'default' }: BlogCardProps) {
  if (variant === 'featured') {
    return (
      <article
        className={cn(
          'group relative overflow-hidden rounded-xl bg-white shadow-luxus',
          className
        )}
      >
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative w-full md:w-1/2 aspect-video md:aspect-auto">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <Badge className="absolute top-4 left-4 bg-luxus-gold text-white border-0">
              {post.category}
            </Badge>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-4 text-sm text-luxus-gray mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.published_at)}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.author_name}
              </span>
            </div>

            <Link href={`/blog/${post.slug}`}>
              <h3 className="text-xl md:text-2xl font-bold text-luxus-dark font-heading mb-3 group-hover:text-luxus-gold transition-colors">
                {post.title}
              </h3>
            </Link>

            <p className="text-luxus-gray mb-4 line-clamp-3">
              {post.excerpt}
            </p>

            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 text-luxus-gold font-medium hover:gap-3 transition-all"
            >
              Leer Mas
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        'group bg-white rounded-xl overflow-hidden shadow-luxus hover:shadow-xl transition-all duration-300',
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={post.featured_image}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <Badge className="absolute top-4 left-4 bg-luxus-gold text-white border-0">
          {post.category}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Meta */}
        <div className="flex items-center gap-3 text-sm text-luxus-gray mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(post.published_at)}
          </span>
        </div>

        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-lg font-semibold text-luxus-dark font-heading mb-2 line-clamp-2 group-hover:text-luxus-gold transition-colors">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-luxus-gray mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        {/* Author & Read More */}
        <div className="flex items-center justify-between pt-4 border-t border-luxus-gray-light">
          <div className="flex items-center gap-2">
            {post.author_avatar && (
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={post.author_avatar}
                  alt={post.author_name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <span className="text-sm text-luxus-gray">{post.author_name}</span>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="text-sm font-medium text-luxus-gold hover:text-luxus-gold-dark flex items-center gap-1"
          >
            Leer
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default BlogCard;

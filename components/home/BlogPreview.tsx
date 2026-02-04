'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogCard } from '@/components/blog/BlogCard';

interface BlogPreviewProps {
  posts: any[];
}

export function BlogPreview({ posts }: BlogPreviewProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <p className="text-luxus-gold font-medium uppercase tracking-wider text-sm mb-2">
              Nuestro Blog
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-luxus-dark font-serif mb-2">
              Noticias y Consejos
            </h2>
            <p className="text-luxus-gray max-w-xl">
              Mantente informado con las ultimas tendencias del mercado inmobiliario
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="mt-4 md:mt-0 border-luxus-gold text-luxus-gold hover:bg-luxus-gold hover:text-white"
          >
            <Link href="/blog">
              Ver Todos los Articulos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default BlogPreview;

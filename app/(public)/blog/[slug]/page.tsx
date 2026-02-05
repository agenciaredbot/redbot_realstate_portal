import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Tag,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BlogCard } from '@/components/blog/BlogCard';
import { getBlogPostBySlug, getRelatedBlogPosts, getAllBlogPostSlugs } from '@/lib/supabase/queries';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function estimateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Articulo no encontrado | Redbot Real Estate',
    };
  }

  return {
    title: `${post.title} | Blog Redbot Real Estate`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featured_image ? [post.featured_image] : [],
      type: 'article',
      publishedTime: post.published_at,
      authors: post.author_name ? [post.author_name] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const readTime = estimateReadTime(post.content);

  // Get related posts (same category, excluding current post)
  const relatedPosts = post.category
    ? await getRelatedBlogPosts(post.category, post.slug, 3)
    : [];

  return (
    <div className="min-h-screen bg-luxus-cream pt-20">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-luxus-gray hover:text-luxus-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al blog</span>
        </Link>
      </div>

      {/* Article Header */}
      <article className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Category & Meta */}
          <div className="mb-6">
            <Badge className="bg-luxus-gold text-white border-0 mb-4">
              {post.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-luxus-dark font-heading mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-luxus-gray">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.published_at)}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.author_name}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {readTime} min de lectura
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-luxus p-6 md:p-10 mb-8">
            <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-luxus-dark prose-p:text-luxus-gray prose-a:text-luxus-gold prose-strong:text-luxus-dark">
              {/* Render markdown content as HTML - in production, use a proper markdown parser */}
              {post.content.split('\n').map((line: string, index: number) => {
                // Simple markdown parsing
                if (line.startsWith('# ')) {
                  return (
                    <h1 key={index} className="text-3xl font-bold mt-8 mb-4">
                      {line.replace('# ', '')}
                    </h1>
                  );
                }
                if (line.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-2xl font-bold mt-6 mb-3">
                      {line.replace('## ', '')}
                    </h2>
                  );
                }
                if (line.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-xl font-bold mt-4 mb-2">
                      {line.replace('### ', '')}
                    </h3>
                  );
                }
                if (line.startsWith('- ')) {
                  return (
                    <li key={index} className="ml-4">
                      {line.replace('- ', '')}
                    </li>
                  );
                }
                if (line.startsWith('|')) {
                  // Skip table formatting for now
                  return null;
                }
                if (line.trim() === '') {
                  return <br key={index} />;
                }
                return (
                  <p key={index} className="mb-4">
                    {line}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="bg-white rounded-xl shadow-luxus p-6 mb-8">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-luxus-gray" />
                <span className="text-sm font-medium text-luxus-dark mr-2">
                  Tags:
                </span>
                {post.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="px-3 py-1 bg-luxus-cream text-luxus-gray text-sm rounded-full hover:bg-luxus-gold hover:text-white transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="bg-white rounded-xl shadow-luxus p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm font-medium text-luxus-dark">
                Compartir este articulo:
              </span>
              <div className="flex gap-2">
                <button className="w-10 h-10 bg-[#1877F2] text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-[#1DA1F2] text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-[#0A66C2] text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
                  <Linkedin className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-luxus-gray text-white rounded-full flex items-center justify-center hover:bg-luxus-gold transition-colors">
                  <LinkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Author Box */}
          <div className="bg-white rounded-xl shadow-luxus p-6 mb-8">
            <div className="flex items-start gap-4">
              {post.author_avatar && (
                <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={post.author_avatar}
                    alt={post.author_name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="text-sm text-luxus-gray mb-1">Escrito por</p>
                <h3 className="text-lg font-semibold text-luxus-dark">
                  {post.author_name}
                </h3>
                <p className="text-sm text-luxus-gray mt-2">
                  Experto en el mercado inmobiliario colombiano con anos de
                  experiencia ayudando a clientes a encontrar su hogar ideal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="max-w-6xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-luxus-dark font-heading mb-6">
              Articulos Relacionados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="max-w-4xl mx-auto mt-16 bg-luxus-dark rounded-xl p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4">
            ¿Necesitas Asesoria Inmobiliaria?
          </h2>
          <p className="text-gray-300 mb-6">
            Nuestro equipo de expertos esta listo para ayudarte a encontrar la
            propiedad perfecta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-luxus-gold hover:bg-luxus-gold-dark text-white"
            >
              <Link href="/propiedades">Ver Propiedades</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-luxus-dark"
            >
              <Link href="/contacto">Contactar Ahora</Link>
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = await getAllBlogPostSlugs();
  return slugs.map((p) => ({
    slug: p.slug,
  }));
}

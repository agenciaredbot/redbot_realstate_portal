import { Metadata } from 'next';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BlogCard } from '@/components/blog/BlogCard';
import { getBlogPosts, getBlogCategories } from '@/lib/supabase/queries';

export const metadata: Metadata = {
  title: 'Blog | Redbot Real Estate',
  description:
    'Noticias, consejos y guias del mercado inmobiliario colombiano. Mantente informado con Redbot Real Estate.',
};

export default async function BlogPage() {
  const [sortedPosts, categories] = await Promise.all([
    getBlogPosts(100),
    getBlogCategories(),
  ]);

  const featuredPost = sortedPosts[0];
  const otherPosts = sortedPosts.slice(1);

  return (
    <div className="min-h-screen bg-luxus-cream pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <p className="text-luxus-gold font-medium uppercase tracking-wider text-sm mb-2">
            Nuestro Blog
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-luxus-dark font-heading mb-4">
            Noticias y Consejos
          </h1>
          <p className="text-luxus-gray max-w-2xl mx-auto">
            Mantente informado con las ultimas tendencias, guias y consejos del
            mercado inmobiliario colombiano.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl shadow-luxus p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxus-gray" />
              <Input
                placeholder="Buscar articulos..."
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-luxus-gray" />
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-luxus-dark mb-4">
              Articulo Destacado
            </h2>
            <BlogCard post={featuredPost} variant="featured" />
          </div>
        )}

        {/* Other Posts Grid */}
        {otherPosts.length > 0 && (
          <>
            <h2 className="text-lg font-semibold text-luxus-dark mb-4">
              Mas Articulos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {sortedPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-luxus-gray">
              No hay articulos disponibles en este momento.
            </p>
          </div>
        )}

        {/* Pagination (simplified for now) */}
        {sortedPosts.length > 6 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 rounded-lg border border-luxus-gray-light text-luxus-gray hover:border-luxus-gold hover:text-luxus-gold transition-colors">
                Anterior
              </button>
              <button className="px-4 py-2 rounded-lg bg-luxus-gold text-white">
                1
              </button>
              <button className="px-4 py-2 rounded-lg border border-luxus-gray-light text-luxus-gray hover:border-luxus-gold hover:text-luxus-gold transition-colors">
                2
              </button>
              <button className="px-4 py-2 rounded-lg border border-luxus-gray-light text-luxus-gray hover:border-luxus-gold hover:text-luxus-gold transition-colors">
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Newsletter Section */}
        <section className="mt-16 bg-luxus-dark rounded-xl p-8 md:p-12 text-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4">
              Suscribete a Nuestro Newsletter
            </h2>
            <p className="text-gray-300 mb-6">
              Recibe las ultimas noticias, guias y ofertas exclusivas directamente
              en tu correo.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Tu correo electronico"
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-luxus-gold hover:bg-luxus-gold-dark text-white rounded-lg transition-colors font-medium"
              >
                Suscribirse
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

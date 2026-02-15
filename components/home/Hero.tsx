'use client';

import { SearchBar } from '@/components/search/SearchBar';
import type { Tenant } from '@/types/tenant';

interface HeroProps {
  tenant?: Tenant;
}

export function Hero({ tenant }: HeroProps) {
  // Get tenant-specific content or fallback to defaults
  const heroTitle = tenant?.hero_title || 'Encuentra Tu Propiedad Ideal';
  const heroSubtitle = tenant?.hero_subtitle ||
    'Explora nuestra amplia selección de propiedades y encuentra el lugar perfecto que se ajuste a tus necesidades y estilo de vida.';
  const heroImage = tenant?.hero_image_url ||
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80';

  // Get stats from tenant about_stats or use defaults
  // Also replace "0" values with defaults since they're not meaningful
  const defaultStats = {
    properties: '250+',
    clients: '500+',
    years: '10+',
    agents: '15+',
  };
  const rawStats = tenant?.about_stats || defaultStats;
  const stats = {
    properties: rawStats.properties && rawStats.properties !== '0' ? rawStats.properties : defaultStats.properties,
    clients: rawStats.clients && rawStats.clients !== '0' ? rawStats.clients : defaultStats.clients,
    years: rawStats.years && rawStats.years !== '0' ? rawStats.years : defaultStats.years,
    agents: rawStats.agents && rawStats.agents !== '0' ? rawStats.agents : defaultStats.agents,
  };

  // Get tenant colors for accent
  const primaryColor = tenant?.primary_color || '#C9A962';

  // Parse hero title - support *word* or **word** syntax to highlight a word
  // Example: "Encuentra Tu Propiedad *Ideal*" will highlight "Ideal"
  const renderHeroTitle = () => {
    // Check for markdown-style highlight syntax: *word* or **word**
    const highlightMatch = heroTitle.match(/\*{1,2}([^*]+)\*{1,2}/);

    if (highlightMatch) {
      const highlightedWord = highlightMatch[1];
      const parts = heroTitle.split(/\*{1,2}[^*]+\*{1,2}/);
      return (
        <>
          {parts[0]}
          <span style={{ color: primaryColor }} className="drop-shadow-lg">
            {highlightedWord}
          </span>
          {parts[1] || ''}
        </>
      );
    }

    // No highlight syntax - just show title with all words
    return <>{heroTitle}</>;
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{
          backgroundImage: `url('${heroImage}')`,
        }}
      >
        {/* Dark overlay for better text contrast */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: 'rgba(26, 26, 46, 0.65)'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-24 pb-16 text-center">
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 font-heading leading-tight tracking-tight animate-fade-in">
          {renderHeroTitle()}
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10 animate-fade-in stagger-1">
          {heroSubtitle}
        </p>

        {/* Search Bar */}
        <SearchBar className="max-w-5xl mx-auto animate-fade-in-up stagger-2" variant="hero" />

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stats.properties}</div>
            <div className="text-sm text-white/70">Propiedades</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stats.agents}</div>
            <div className="text-sm text-white/70">Agentes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stats.clients}</div>
            <div className="text-sm text-white/70">Clientes Felices</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stats.years}</div>
            <div className="text-sm text-white/70">Años de Experiencia</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

export default Hero;

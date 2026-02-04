'use client';

import { SearchBar } from '@/components/search/SearchBar';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80')`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-luxus-dark/60 via-luxus-dark/40 to-luxus-dark/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-24 pb-16 text-center">
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-serif leading-tight">
          Encuentra Tu Propiedad
          <br />
          <span className="text-luxus-gold">Ideal</span> en Colombia.
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10">
          Explora nuestra amplia seleccion de propiedades y encuentra el lugar
          perfecto que se ajuste a tus necesidades y estilo de vida.
        </p>

        {/* Search Bar */}
        <SearchBar className="max-w-5xl mx-auto" variant="hero" />

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">250+</div>
            <div className="text-sm text-white/70">Propiedades</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">15+</div>
            <div className="text-sm text-white/70">Agentes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">500+</div>
            <div className="text-sm text-white/70">Clientes Felices</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">10+</div>
            <div className="text-sm text-white/70">Ciudades</div>
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

'use client';

import Link from 'next/link';
import { Building2, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const benefits = [
  'Portal web profesional',
  'Panel de administración',
  'Gestión de propiedades',
  'Leads directos',
];

export function CTAInmobiliarias() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-luxus-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-luxus-gold/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-luxus-gold/10 text-luxus-gold px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Para Inmobiliarias
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            ¿Eres una Inmobiliaria?
            <br />
            <span className="text-luxus-gold">Crea tu Portal Profesional</span>
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Únete a Redbot y obtén tu propio portal inmobiliario con subdominio
            personalizado. Gestiona propiedades, recibe leads y haz crecer tu
            negocio.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full"
              >
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-white text-sm">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/registro-inmobiliaria">
              <Button
                size="lg"
                className="bg-luxus-gold hover:bg-luxus-gold/90 text-white px-8 py-6 text-lg font-semibold group"
              >
                <Building2 className="h-5 w-5 mr-2" />
                Crear mi Inmobiliaria Gratis
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="text-sm text-gray-400">
              14 días de prueba gratis • Sin tarjeta de crédito
            </p>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-sm text-gray-500 mb-4">
              Inmobiliarias que confían en Redbot
            </p>
            <div className="flex items-center justify-center gap-8 opacity-50">
              {/* Placeholder logos - en producción usar logos reales */}
              <div className="text-white font-semibold">InmoPremium</div>
              <div className="text-white font-semibold">CasaLux</div>
              <div className="text-white font-semibold">PropiedadesTop</div>
              <div className="text-white font-semibold">InverHome</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

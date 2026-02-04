'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
}

function AnimatedCounter({ end, duration = 2000, suffix = '' }: CounterProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <div ref={ref}>
      {count}
      {suffix}
    </div>
  );
}

export function AboutSection() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Images Column */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-luxus-lg">
              <Image
                src="https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800"
                alt="Equipo de agentes inmobiliarios"
                width={500}
                height={400}
                className="object-cover w-full h-80"
              />
            </div>

            {/* Secondary Image - Offset */}
            <div className="absolute -bottom-8 -right-8 z-20 w-2/3 rounded-2xl overflow-hidden shadow-luxus-lg border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600"
                alt="Propiedades de lujo"
                width={400}
                height={300}
                className="object-cover w-full h-48"
              />
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-luxus-cream rounded-full opacity-50" />
            <div className="absolute bottom-20 -left-8 w-16 h-16 bg-luxus-gold/20 rounded-full" />
          </div>

          {/* Content Column */}
          <div className="lg:pl-8">
            {/* Section Label */}
            <span className="text-luxus-gold font-medium text-sm uppercase tracking-wider">
              Sobre Nosotros
            </span>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold text-luxus-dark mt-2 mb-6 font-serif leading-tight">
              Tu Socio Confiable en el Mercado Inmobiliario
            </h2>

            {/* Description */}
            <p className="text-luxus-gray mb-6 leading-relaxed">
              Con mas de una decada de experiencia en el sector inmobiliario
              colombiano, nos especializamos en conectar a nuestros clientes con
              las propiedades de sus suenos. Nuestro equipo de agentes
              certificados esta comprometido con brindarte un servicio
              excepcional en cada paso del proceso.
            </p>

            <p className="text-luxus-gray mb-8 leading-relaxed">
              Ya sea que busques comprar tu primera vivienda, invertir en bienes
              raices o vender tu propiedad al mejor precio, estamos aqui para
              ayudarte a alcanzar tus objetivos.
            </p>

            {/* CTA Button */}
            <Button
              asChild
              className="bg-luxus-gold hover:bg-luxus-gold-dark text-white group"
            >
              <Link href="/nosotros">
                Conoce Mas
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-luxus-gray-light">
              <div className="text-center md:text-left">
                <div className="text-3xl font-bold text-luxus-dark">
                  <AnimatedCounter end={250} suffix="+" />
                </div>
                <div className="text-sm text-luxus-gray mt-1">Propiedades</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-3xl font-bold text-luxus-dark">
                  <AnimatedCounter end={15} suffix="+" />
                </div>
                <div className="text-sm text-luxus-gray mt-1">Agentes</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-3xl font-bold text-luxus-dark">
                  <AnimatedCounter end={500} suffix="+" />
                </div>
                <div className="text-sm text-luxus-gray mt-1">Clientes</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-3xl font-bold text-luxus-dark">
                  <AnimatedCounter end={10} suffix="+" />
                </div>
                <div className="text-sm text-luxus-gray mt-1">Ciudades</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;

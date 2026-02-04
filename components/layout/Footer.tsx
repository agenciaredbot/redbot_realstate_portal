'use client';

import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SOCIAL_LINKS, CONTACT_INFO } from '@/lib/constants';

const quickLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Propiedades', href: '/propiedades' },
  { label: 'Agentes', href: '/agentes' },
  { label: 'Blog', href: '/blog' },
];

const discoverLinks = [
  { label: 'Casas en Venta', href: '/propiedades?type=Casa&status=Venta' },
  { label: 'Apartamentos en Renta', href: '/propiedades?type=Apartamento&status=Renta' },
  { label: 'Villas de Lujo', href: '/propiedades?type=Villa' },
  { label: 'Proyectos Nuevos', href: '/proyectos' },
];

const socialIcons = [
  { icon: Facebook, href: SOCIAL_LINKS.facebook, label: 'Facebook' },
  { icon: Instagram, href: SOCIAL_LINKS.instagram, label: 'Instagram' },
  { icon: Linkedin, href: SOCIAL_LINKS.linkedin, label: 'LinkedIn' },
  { icon: Twitter, href: SOCIAL_LINKS.twitter, label: 'Twitter' },
  { icon: Youtube, href: SOCIAL_LINKS.youtube, label: 'YouTube' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-luxus-dark text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Logo & About */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-luxus-gold flex items-center justify-center">
                <span className="text-2xl font-bold text-white">R</span>
              </div>
              <div>
                <span className="text-xl font-bold block">REDBOT</span>
                <span className="text-xs text-luxus-gray-light">REAL ESTATE</span>
              </div>
            </Link>
            <p className="text-luxus-gray-light text-sm leading-relaxed">
              Tu socio confiable en el mercado inmobiliario colombiano.
              Encuentra la propiedad de tus suenos con nuestra asesoria experta.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialIcons.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-luxus-gray-dark flex items-center justify-center text-luxus-gray-light hover:bg-luxus-gold hover:border-luxus-gold hover:text-white transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Links Rapidos</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-luxus-gray-light hover:text-luxus-gold transition-colors text-sm flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Discover */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Descubre</h4>
            <ul className="space-y-3">
              {discoverLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-luxus-gray-light hover:text-luxus-gold transition-colors text-sm flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info & Newsletter */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold mb-6">Contacto</h4>

            {/* Contact Details */}
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-luxus-gold flex-shrink-0 mt-0.5" />
                <span className="text-luxus-gray-light text-sm">
                  {CONTACT_INFO.address}
                  <br />
                  {CONTACT_INFO.city}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-luxus-gold flex-shrink-0" />
                <a
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="text-luxus-gray-light text-sm hover:text-luxus-gold transition-colors"
                >
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-luxus-gold flex-shrink-0" />
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-luxus-gray-light text-sm hover:text-luxus-gold transition-colors"
                >
                  {CONTACT_INFO.email}
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="pt-4">
              <h5 className="text-sm font-medium mb-3">Suscribete al Newsletter</h5>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // TODO: Implement newsletter subscription
                }}
                className="flex gap-2"
              >
                <Input
                  type="email"
                  placeholder="Tu email"
                  className="bg-luxus-gray-dark border-luxus-gray-dark text-white placeholder:text-luxus-gray text-sm"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-luxus-gold hover:bg-luxus-gold-dark flex-shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <Separator className="bg-luxus-gray-dark" />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-luxus-gray-light">
          <p>
            &copy; {currentYear} Redbot Real Estate. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacidad" className="hover:text-luxus-gold transition-colors">
              Politica de Privacidad
            </Link>
            <Link href="/terminos" className="hover:text-luxus-gold transition-colors">
              Terminos y Condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

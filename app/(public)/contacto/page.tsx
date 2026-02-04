import { Metadata } from 'next';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
} from 'lucide-react';
import { ContactForm } from '@/components/forms/ContactForm';
import { FAQSection } from '@/components/faq/FAQSection';
import { CONTACT_INFO, SOCIAL_LINKS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contacto | Redbot Real Estate',
  description:
    'Contacta a Redbot Real Estate. Estamos aqui para ayudarte a encontrar la propiedad ideal. Llamanos, escribenos o visitanos.',
};

const contactMethods = [
  {
    icon: Phone,
    title: 'Telefono',
    value: CONTACT_INFO.phone,
    description: 'Lun - Vie: 8am - 6pm',
    action: `tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`,
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    value: CONTACT_INFO.whatsapp,
    description: 'Respuesta inmediata',
    action: `https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, '')}`,
  },
  {
    icon: Mail,
    title: 'Email',
    value: CONTACT_INFO.email,
    description: 'Respondemos en 24h',
    action: `mailto:${CONTACT_INFO.email}`,
  },
  {
    icon: MapPin,
    title: 'Oficina Principal',
    value: CONTACT_INFO.address,
    description: CONTACT_INFO.city,
    action: 'https://maps.google.com/?q=Calle+100+19-61+Bogota',
  },
];

const faqs = [
  {
    question: '¿Cual es el proceso para comprar una propiedad?',
    answer:
      'El proceso incluye: busqueda de propiedad, visita, negociacion, firma de promesa de compraventa, estudio de titulos, solicitud de credito (si aplica), y escrituracion. Te acompanamos en cada paso.',
  },
  {
    question: '¿Ofrecen asesoria para credito hipotecario?',
    answer:
      'Si, tenemos alianzas con los principales bancos del pais y te ayudamos a gestionar tu credito hipotecario con las mejores condiciones del mercado.',
  },
  {
    question: '¿Cuanto cobran por sus servicios?',
    answer:
      'Nuestra comision es del 3% sobre el valor de la venta, pagado al momento del cierre. Para arriendos, un canon mensual. La asesoria inicial es gratuita.',
  },
  {
    question: '¿En que ciudades operan?',
    answer:
      'Tenemos presencia en Bogota, Medellin, Cali, Barranquilla, Cartagena y otras ciudades principales de Colombia.',
  },
];

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-luxus-cream pt-24">
      {/* Header */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-luxus-gold font-medium uppercase tracking-wider text-sm mb-2">
              Contacto
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-luxus-dark font-heading mb-4">
              ¿Como Podemos Ayudarte?
            </h1>
            <p className="text-luxus-gray text-lg">
              Estamos aqui para responder tus preguntas y ayudarte a encontrar
              la propiedad perfecta. Contactanos por el medio que prefieras.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 bg-luxus-cream">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.action}
                target={method.action.startsWith('http') ? '_blank' : undefined}
                rel={method.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="bg-white rounded-xl p-6 shadow-luxus hover:shadow-xl transition-all group"
              >
                <div className="w-12 h-12 bg-luxus-gold/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-luxus-gold group-hover:text-white transition-colors">
                  <method.icon className="w-6 h-6 text-luxus-gold group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-luxus-dark mb-1">
                  {method.title}
                </h3>
                <p className="text-luxus-gold font-medium mb-1">{method.value}</p>
                <p className="text-sm text-luxus-gray">{method.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-luxus p-8">
              <h2 className="text-2xl font-bold text-luxus-dark font-heading mb-2">
                Enviar Mensaje
              </h2>
              <p className="text-luxus-gray mb-6">
                Completa el formulario y nos pondremos en contacto contigo pronto.
              </p>

              <ContactForm />
            </div>

            {/* Map & Info */}
            <div className="space-y-6">
              {/* Map */}
              <div className="bg-white rounded-xl shadow-luxus overflow-hidden">
                <div className="aspect-video bg-luxus-gray-light relative">
                  {/* Placeholder for map - would use Leaflet or Google Maps in production */}
                  <div className="absolute inset-0 flex items-center justify-center text-luxus-gray">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 mx-auto mb-2 text-luxus-gold" />
                      <p className="font-medium">Oficina Principal</p>
                      <p className="text-sm">{CONTACT_INFO.address}</p>
                      <p className="text-sm">{CONTACT_INFO.city}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-white rounded-xl shadow-luxus p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-luxus-gold/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-luxus-gold" />
                  </div>
                  <h3 className="text-lg font-semibold text-luxus-dark">
                    Horario de Atencion
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-luxus-gray">Lunes - Viernes</span>
                    <span className="text-luxus-dark font-medium">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-luxus-gray">Sabados</span>
                    <span className="text-luxus-dark font-medium">9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-luxus-gray">Domingos</span>
                    <span className="text-luxus-dark font-medium">Cerrado</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white rounded-xl shadow-luxus p-6">
                <h3 className="text-lg font-semibold text-luxus-dark mb-4">
                  Siguenos en Redes
                </h3>
                <div className="flex gap-3">
                  {Object.entries(SOCIAL_LINKS).map(([network, url]) => (
                    <a
                      key={network}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-luxus-cream rounded-full flex items-center justify-center hover:bg-luxus-gold hover:text-white transition-colors text-luxus-gray"
                    >
                      {network === 'facebook' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      )}
                      {network === 'instagram' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      )}
                      {network === 'linkedin' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      )}
                      {network === 'twitter' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      )}
                      {network === 'youtube' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <FAQSection
            faqs={faqs}
            title="¿Tienes Dudas?"
            subtitle="Preguntas Frecuentes"
            className="max-w-3xl mx-auto"
          />
        </div>
      </section>
    </div>
  );
}

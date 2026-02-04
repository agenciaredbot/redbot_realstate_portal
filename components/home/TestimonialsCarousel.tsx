'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import { TestimonialCard } from '@/components/testimonial/TestimonialCard';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface TestimonialsCarouselProps {
  testimonials: any[];
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-luxus-dark text-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-luxus-gold font-medium uppercase tracking-wider text-sm mb-2">
            Testimonios
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            La satisfaccion de nuestros clientes es nuestra mayor recompensa
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-5xl mx-auto">
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            spaceBetween={32}
            slidesPerView={1}
            navigation={{
              prevEl: '.testimonials-prev',
              nextEl: '.testimonials-next',
            }}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet !bg-gray-500 !opacity-100',
              bulletActiveClass: '!bg-luxus-gold',
            }}
            autoplay={{
              delay: 6000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 2 },
            }}
            className="pb-12"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} variant="dark" />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button className="testimonials-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-luxus-gold transition-colors hidden lg:flex">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button className="testimonials-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-luxus-gold transition-colors hidden lg:flex">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsCarousel;

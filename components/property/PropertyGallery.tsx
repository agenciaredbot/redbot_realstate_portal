'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PropertyImage } from '@/types';
import { cn } from '@/lib/utils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

interface PropertyGalleryProps {
  images: PropertyImage[];
  title: string;
  className?: string;
}

export function PropertyGallery({ images, title, className }: PropertyGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const mainSwiperRef = useRef<SwiperType | null>(null);

  if (images.length === 0) {
    return (
      <div className={cn('bg-luxus-cream rounded-2xl overflow-hidden', className)}>
        <div className="aspect-video flex items-center justify-center">
          <p className="text-luxus-gray">No hay imagenes disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Gallery */}
      <div className="relative rounded-2xl overflow-hidden bg-luxus-cream">
        <Swiper
          modules={[Navigation, Thumbs, FreeMode]}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          onBeforeInit={(swiper) => {
            mainSwiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          spaceBetween={0}
          slidesPerView={1}
          className="aspect-[16/9] md:aspect-[21/9]"
        >
          {images.map((image, index) => (
            <SwiperSlide key={image.id}>
              <div className="relative w-full h-full">
                <Image
                  src={image.url}
                  alt={image.alt || `${title} - Imagen ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg border-0 hover:bg-white"
          onClick={() => mainSwiperRef.current?.slidePrev()}
        >
          <ChevronLeft className="w-5 h-5 text-luxus-gold" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg border-0 hover:bg-white"
          onClick={() => mainSwiperRef.current?.slideNext()}
        >
          <ChevronRight className="w-5 h-5 text-luxus-gold" />
        </Button>

        {/* Counter Badge */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-luxus-dark/80 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <Swiper
          modules={[FreeMode, Thumbs]}
          onSwiper={setThumbsSwiper}
          spaceBetween={12}
          slidesPerView="auto"
          freeMode={true}
          watchSlidesProgress={true}
          className="thumbs-swiper"
        >
          {images.map((image, index) => (
            <SwiperSlide
              key={image.id}
              className="!w-24 md:!w-32 cursor-pointer"
            >
              <div
                className={cn(
                  'relative aspect-video rounded-lg overflow-hidden border-2 transition-all',
                  activeIndex === index
                    ? 'border-luxus-gold'
                    : 'border-transparent hover:border-luxus-gray-light'
                )}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}

export default PropertyGallery;

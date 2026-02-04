'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  SearchBarExpanded,
  defaultExpandedFilters,
  type ExpandedFilters,
} from './SearchBarExpanded';
import { COLOMBIAN_CITIES, PRICE_RANGES, AREA_RANGE } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  className?: string;
  variant?: 'hero' | 'page';
}

export function SearchBar({ className, variant = 'hero' }: SearchBarProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  // Basic filters
  const [keywords, setKeywords] = useState('');
  const [status, setStatus] = useState<string>('any');
  const [city, setCity] = useState<string>('any');

  // Advanced filters from expanded panel
  const [expandedFilters, setExpandedFilters] =
    useState<ExpandedFilters>(defaultExpandedFilters);

  const handleSearch = () => {
    const params = new URLSearchParams();

    // Basic filters
    if (keywords) params.set('q', keywords);
    if (status && status !== 'any') params.set('status', status);
    if (city && city !== 'any') params.set('city', city);

    // Advanced filters from expanded panel
    if (expandedFilters.propertyType) {
      params.set('type', expandedFilters.propertyType);
    }

    if (expandedFilters.bedrooms && expandedFilters.bedrooms !== 'any') {
      params.set('bedrooms', expandedFilters.bedrooms);
    }

    if (expandedFilters.bathrooms && expandedFilters.bathrooms !== 'any') {
      params.set('bathrooms', expandedFilters.bathrooms);
    }

    // Price range (only if different from defaults)
    if (
      expandedFilters.priceRange[0] !== PRICE_RANGES.sale.default[0] ||
      expandedFilters.priceRange[1] !== PRICE_RANGES.sale.default[1]
    ) {
      params.set('minPrice', expandedFilters.priceRange[0].toString());
      params.set('maxPrice', expandedFilters.priceRange[1].toString());
    }

    // Area range (only if different from defaults)
    if (
      expandedFilters.areaRange[0] !== AREA_RANGE.default[0] ||
      expandedFilters.areaRange[1] !== AREA_RANGE.default[1]
    ) {
      params.set('minArea', expandedFilters.areaRange[0].toString());
      params.set('maxArea', expandedFilters.areaRange[1].toString());
    }

    // Amenities
    if (expandedFilters.amenities.length > 0) {
      params.set('amenities', expandedFilters.amenities.join(','));
    }

    router.push(`/propiedades?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Count active filters
  const activeFiltersCount = [
    expandedFilters.propertyType,
    expandedFilters.bedrooms && expandedFilters.bedrooms !== 'any',
    expandedFilters.bathrooms && expandedFilters.bathrooms !== 'any',
    expandedFilters.priceRange[0] !== PRICE_RANGES.sale.default[0] ||
      expandedFilters.priceRange[1] !== PRICE_RANGES.sale.default[1],
    expandedFilters.areaRange[0] !== AREA_RANGE.default[0] ||
      expandedFilters.areaRange[1] !== AREA_RANGE.default[1],
    expandedFilters.amenities.length > 0,
  ].filter(Boolean).length;

  return (
    <div className={cn('w-full', className)}>
      {/* Main Search Bar */}
      <div
        className={cn(
          'bg-white rounded-xl shadow-luxus-lg p-2',
          variant === 'hero' ? 'max-w-4xl mx-auto' : ''
        )}
      >
        <div className="flex flex-col md:flex-row gap-2">
          {/* Keywords Input */}
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Ingresa palabras clave..."
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-12 border-0 bg-transparent focus-visible:ring-0 text-luxus-dark placeholder:text-luxus-gray"
            />
          </div>

          {/* Divider - Desktop only */}
          <div className="hidden md:block w-px bg-luxus-gray-light self-stretch my-2" />

          {/* Status Select */}
          <div className="md:w-40">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-12 border-0 bg-transparent focus:ring-0">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Todos</SelectItem>
                <SelectItem value="venta">Venta</SelectItem>
                <SelectItem value="arriendo">Arriendo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Divider - Desktop only */}
          <div className="hidden md:block w-px bg-luxus-gray-light self-stretch my-2" />

          {/* City Select */}
          <div className="md:w-44">
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="h-12 border-0 bg-transparent focus:ring-0">
                <SelectValue placeholder="Ciudad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Todas</SelectItem>
                {COLOMBIAN_CITIES.map((cityName) => (
                  <SelectItem key={cityName} value={cityName}>
                    {cityName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {/* Filters Toggle Button */}
            <Button
              type="button"
              variant="outline"
              size="icon"
              className={cn(
                'h-12 w-12 border-luxus-gray-light relative',
                isExpanded && 'bg-luxus-cream border-luxus-gold'
              )}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <SlidersHorizontal
                className={cn(
                  'w-5 h-5',
                  isExpanded ? 'text-luxus-gold' : 'text-luxus-gray'
                )}
              />
              {/* Active filters badge */}
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-luxus-gold text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {activeFiltersCount}
                </span>
              )}
              <span className="sr-only">Filtros avanzados</span>
            </Button>

            {/* Search Button */}
            <Button
              type="button"
              className="h-12 px-6 bg-luxus-gold hover:bg-luxus-gold-dark text-white"
              onClick={handleSearch}
            >
              <Search className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Buscar</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Expanded Filters Panel */}
      {isExpanded && (
        <SearchBarExpanded
          className="mt-4"
          filters={expandedFilters}
          onFiltersChange={setExpandedFilters}
          onSearch={() => {
            handleSearch();
            setIsExpanded(false);
          }}
          onClose={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
}

export default SearchBar;

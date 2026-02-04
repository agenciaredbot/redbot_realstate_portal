'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Grid3X3, List, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PropertyFilters } from '@/components/property/PropertyFilters';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { PropertyPagination } from '@/components/property/PropertyPagination';
import type { PropertyFilters as PropertyFiltersType } from '@/types';

const ITEMS_PER_PAGE = 9;

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'area_asc' | 'area_desc';

interface PropiedadesContentProps {
  initialProperties: any[];
  agentsMap: Record<string, any>;
  availableCities: string[];
}

export function PropiedadesContent({
  initialProperties,
  agentsMap,
  availableCities,
}: PropiedadesContentProps) {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize filters from URL params
  const [filters, setFilters] = useState<PropertyFiltersType>(() => {
    const initialFilters: PropertyFiltersType = {};

    // Basic filters
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const city = searchParams.get('city');
    const q = searchParams.get('q');

    if (status) initialFilters.status = status as PropertyFiltersType['status'];
    if (type) initialFilters.property_type = type as PropertyFiltersType['property_type'];
    if (city) initialFilters.city = city;
    if (q) initialFilters.search = q;

    // Advanced filters from SearchBarExpanded
    const bedrooms = searchParams.get('bedrooms');
    const bathrooms = searchParams.get('bathrooms');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minArea = searchParams.get('minArea');
    const maxArea = searchParams.get('maxArea');
    const amenities = searchParams.get('amenities');

    if (bedrooms && bedrooms !== 'any') {
      const parsed = parseInt(bedrooms, 10);
      if (!isNaN(parsed)) {
        initialFilters.bedrooms = bedrooms === '6+' ? 6 : parsed;
      }
    }
    if (bathrooms && bathrooms !== 'any') {
      const parsed = parseInt(bathrooms, 10);
      if (!isNaN(parsed)) {
        initialFilters.bathrooms = bathrooms === '6+' ? 6 : parsed;
      }
    }
    if (minPrice) {
      const parsed = parseInt(minPrice, 10);
      if (!isNaN(parsed)) initialFilters.min_price = parsed;
    }
    if (maxPrice) {
      const parsed = parseInt(maxPrice, 10);
      if (!isNaN(parsed)) initialFilters.max_price = parsed;
    }
    if (minArea) {
      const parsed = parseInt(minArea, 10);
      if (!isNaN(parsed)) initialFilters.min_area = parsed;
    }
    if (maxArea) {
      const parsed = parseInt(maxArea, 10);
      if (!isNaN(parsed)) initialFilters.max_area = parsed;
    }
    if (amenities) initialFilters.amenities = amenities.split(',') as PropertyFiltersType['amenities'];

    return initialFilters;
  });

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let result = [...initialProperties];

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchLower) ||
          p.description_short?.toLowerCase().includes(searchLower) ||
          p.city?.toLowerCase().includes(searchLower) ||
          p.neighborhood?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      result = result.filter((p) => p.status === filters.status);
    }

    if (filters.property_type) {
      result = result.filter((p) => p.property_type === filters.property_type);
    }

    if (filters.city) {
      result = result.filter((p) => p.city === filters.city);
    }

    if (filters.bedrooms) {
      result = result.filter((p) => (p.bedrooms || 0) >= filters.bedrooms!);
    }

    if (filters.bathrooms) {
      result = result.filter((p) => (p.bathrooms || 0) >= filters.bathrooms!);
    }

    if (filters.min_price) {
      result = result.filter((p) => (p.price || 0) >= filters.min_price!);
    }

    if (filters.max_price) {
      result = result.filter((p) => (p.price || 0) <= filters.max_price!);
    }

    if (filters.min_area) {
      result = result.filter((p) => (p.area_m2 || 0) >= filters.min_area!);
    }

    if (filters.max_area) {
      result = result.filter((p) => (p.area_m2 || 0) <= filters.max_area!);
    }

    // Filter by amenities
    if (filters.amenities && filters.amenities.length > 0) {
      result = result.filter((p) =>
        filters.amenities!.every((amenity) => (p.amenities || []).includes(amenity))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price_desc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'area_asc':
        result.sort((a, b) => (a.area_m2 || 0) - (b.area_m2 || 0));
        break;
      case 'area_desc':
        result.sort((a, b) => (b.area_m2 || 0) - (a.area_m2 || 0));
        break;
      case 'newest':
      default:
        result.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    return result;
  }, [filters, sortBy, initialProperties]);

  // Paginate results
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProperties, currentPage]);

  // Reset to page 1 when filters change
  const handleFiltersChange = (newFilters: PropertyFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-luxus-cream pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-luxus-dark font-serif mb-2">
            Propiedades
          </h1>
          <p className="text-luxus-gray">
            Explora nuestra seleccion de propiedades en Colombia
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <PropertyFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              availableCities={availableCities}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-luxus p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Results Count */}
              <p className="text-sm text-luxus-gray">
                <span className="font-semibold text-luxus-dark">
                  {filteredProperties.length}
                </span>{' '}
                propiedades encontradas
              </p>

              {/* Sort & View */}
              <div className="flex items-center gap-3">
                {/* Sort */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-luxus-gray" />
                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as SortOption)}
                  >
                    <SelectTrigger className="w-[160px] text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Mas recientes</SelectItem>
                      <SelectItem value="price_asc">Precio: menor a mayor</SelectItem>
                      <SelectItem value="price_desc">Precio: mayor a menor</SelectItem>
                      <SelectItem value="area_asc">Area: menor a mayor</SelectItem>
                      <SelectItem value="area_desc">Area: mayor a menor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* View Mode */}
                <div className="hidden sm:flex items-center border rounded-lg overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={viewMode === 'grid' ? 'bg-luxus-cream' : ''}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={viewMode === 'list' ? 'bg-luxus-cream' : ''}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            <PropertyGrid
              properties={paginatedProperties}
              agents={agentsMap}
            />

            {/* Pagination */}
            <PropertyPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredProperties.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
              className="mt-8"
            />
          </main>
        </div>
      </div>
    </div>
  );
}

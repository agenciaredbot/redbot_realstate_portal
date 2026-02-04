'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  PROPERTY_TYPES,
  AMENITIES_LIST,
  ROOM_OPTIONS,
  PRICE_RANGES,
  AREA_RANGE,
} from '@/lib/constants';
import { formatPriceCOP, formatArea } from '@/lib/format';
import { cn } from '@/lib/utils';

export interface ExpandedFilters {
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  priceRange: number[];
  areaRange: number[];
  amenities: string[];
}

interface SearchBarExpandedProps {
  className?: string;
  filters: ExpandedFilters;
  onFiltersChange: (filters: ExpandedFilters) => void;
  onSearch: () => void;
  onClose: () => void;
}

export const defaultExpandedFilters: ExpandedFilters = {
  propertyType: '',
  bedrooms: 'any',
  bathrooms: 'any',
  priceRange: PRICE_RANGES.sale.default,
  areaRange: AREA_RANGE.default,
  amenities: [],
};

export function SearchBarExpanded({
  className,
  filters,
  onFiltersChange,
  onSearch,
  onClose,
}: SearchBarExpandedProps) {
  const updateFilter = <K extends keyof ExpandedFilters>(
    key: K,
    value: ExpandedFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    updateFilter('amenities', newAmenities);
  };

  const handleReset = () => {
    onFiltersChange(defaultExpandedFilters);
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-luxus-lg p-6 animate-in slide-in-from-top-4 duration-300',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-luxus-dark">
          Filtros Avanzados
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-luxus-gray hover:text-luxus-dark"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Property Type Selection */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-luxus-gray mb-3 block">
          Tipo de Propiedad
        </Label>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.slice(0, 6).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() =>
                updateFilter(
                  'propertyType',
                  filters.propertyType === type ? '' : type
                )
              }
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium border transition-all',
                filters.propertyType === type
                  ? 'bg-luxus-gold text-white border-luxus-gold'
                  : 'bg-white text-luxus-dark border-luxus-gray-light hover:border-luxus-gold'
              )}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Numeric Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Bedrooms */}
        <div>
          <Label className="text-sm font-medium text-luxus-gray mb-2 block">
            Habitaciones
          </Label>
          <Select
            value={filters.bedrooms || 'any'}
            onValueChange={(value) => updateFilter('bedrooms', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Cualquiera" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Cualquiera</SelectItem>
              {ROOM_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label} Hab.
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bathrooms */}
        <div>
          <Label className="text-sm font-medium text-luxus-gray mb-2 block">
            Baños
          </Label>
          <Select
            value={filters.bathrooms || 'any'}
            onValueChange={(value) => updateFilter('bathrooms', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Cualquiera" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Cualquiera</SelectItem>
              {ROOM_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label} Baño(s)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium text-luxus-gray mb-2 block">
            Precio
          </Label>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter('priceRange', value)}
              min={PRICE_RANGES.sale.min}
              max={PRICE_RANGES.sale.max}
              step={PRICE_RANGES.sale.step}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-xs text-luxus-gray">
              <span>{formatPriceCOP(filters.priceRange[0], { compact: true })}</span>
              <span>{formatPriceCOP(filters.priceRange[1], { compact: true })}</span>
            </div>
          </div>
        </div>

        {/* Area Range */}
        <div>
          <Label className="text-sm font-medium text-luxus-gray mb-2 block">
            Área
          </Label>
          <div className="px-2">
            <Slider
              value={filters.areaRange}
              onValueChange={(value) => updateFilter('areaRange', value)}
              min={AREA_RANGE.min}
              max={AREA_RANGE.max}
              step={AREA_RANGE.step}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-xs text-luxus-gray">
              <span>{formatArea(filters.areaRange[0])}</span>
              <span>{formatArea(filters.areaRange[1])}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-luxus-gray mb-3 block">
          Amenidades
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {AMENITIES_LIST.slice(0, 12).map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={`amenity-${amenity}`}
                checked={filters.amenities.includes(amenity)}
                onCheckedChange={() => toggleAmenity(amenity)}
                className="border-luxus-gray-light data-[state=checked]:bg-luxus-gold data-[state=checked]:border-luxus-gold"
              />
              <Label
                htmlFor={`amenity-${amenity}`}
                className="text-sm text-luxus-dark cursor-pointer"
              >
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-luxus-gray-light">
        <Button
          variant="ghost"
          onClick={handleReset}
          className="text-luxus-gray hover:text-luxus-dark"
        >
          Limpiar Filtros
        </Button>
        <Button
          onClick={onSearch}
          className="bg-luxus-gold hover:bg-luxus-gold-dark text-white px-8"
        >
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
}

export default SearchBarExpanded;

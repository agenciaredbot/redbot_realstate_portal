'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { PROPERTY_TYPES, COLOMBIAN_CITIES, ROOM_OPTIONS, PRICE_RANGES, AREA_RANGE } from '@/lib/constants';
import { formatPriceCOP, formatArea } from '@/lib/format';
import type { PropertyFilters as PropertyFiltersType } from '@/types';
import { cn } from '@/lib/utils';

interface PropertyFiltersProps {
  filters: PropertyFiltersType;
  onFiltersChange: (filters: PropertyFiltersType) => void;
  className?: string;
  availableCities?: string[];
}

export function PropertyFilters({
  filters,
  onFiltersChange,
  className,
  availableCities,
}: PropertyFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<PropertyFiltersType>(filters);

  const handleFilterChange = <K extends keyof PropertyFiltersType>(
    key: K,
    value: PropertyFiltersType[K]
  ) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    const clearedFilters: PropertyFiltersType = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== '' && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <Label className="text-sm font-medium text-luxus-gray mb-2 block">
          Buscar
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxus-gray" />
          <Input
            type="text"
            placeholder="Palabra clave..."
            value={localFilters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Status */}
      <div>
        <Label className="text-sm font-medium text-luxus-gray mb-2 block">
          Tipo de Operacion
        </Label>
        <Select
          value={localFilters.status || 'all'}
          onValueChange={(value) =>
            handleFilterChange('status', value === 'all' ? undefined : value as PropertyFiltersType['status'])
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="venta">Venta</SelectItem>
            <SelectItem value="arriendo">Arriendo</SelectItem>
            <SelectItem value="venta_arriendo">Venta y Arriendo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Property Type */}
      <div>
        <Label className="text-sm font-medium text-luxus-gray mb-2 block">
          Tipo de Propiedad
        </Label>
        <Select
          value={(localFilters.property_type as string) || 'all'}
          onValueChange={(value) =>
            handleFilterChange('property_type', value === 'all' ? undefined : value as PropertyFiltersType['property_type'])
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos los tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            {PROPERTY_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City */}
      <div>
        <Label className="text-sm font-medium text-luxus-gray mb-2 block">
          Ciudad
        </Label>
        <Select
          value={localFilters.city || 'all'}
          onValueChange={(value) => handleFilterChange('city', value === 'all' ? undefined : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas las ciudades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las ciudades</SelectItem>
            {(availableCities || COLOMBIAN_CITIES).map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bedrooms & Bathrooms */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-luxus-gray mb-2 block">
            Habitaciones
          </Label>
          <Select
            value={localFilters.bedrooms?.toString() || 'any'}
            onValueChange={(value) =>
              handleFilterChange('bedrooms', value === 'any' ? undefined : parseInt(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Cualquiera" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Cualquiera</SelectItem>
              {ROOM_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}+
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm font-medium text-luxus-gray mb-2 block">
            Banos
          </Label>
          <Select
            value={localFilters.bathrooms?.toString() || 'any'}
            onValueChange={(value) =>
              handleFilterChange('bathrooms', value === 'any' ? undefined : parseInt(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Cualquiera" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Cualquiera</SelectItem>
              {ROOM_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}+
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium text-luxus-gray mb-2 block">
          Rango de Precio
        </Label>
        <div className="px-2 pt-2">
          <Slider
            value={[
              localFilters.min_price || PRICE_RANGES.sale.min,
              localFilters.max_price || PRICE_RANGES.sale.max,
            ]}
            onValueChange={([min, max]) => {
              handleFilterChange('min_price', min);
              handleFilterChange('max_price', max);
            }}
            min={PRICE_RANGES.sale.min}
            max={PRICE_RANGES.sale.max}
            step={PRICE_RANGES.sale.step}
          />
          <div className="flex justify-between mt-2 text-xs text-luxus-gray">
            <span>
              {formatPriceCOP(localFilters.min_price || PRICE_RANGES.sale.min, { compact: true })}
            </span>
            <span>
              {formatPriceCOP(localFilters.max_price || PRICE_RANGES.sale.max, { compact: true })}
            </span>
          </div>
        </div>
      </div>

      {/* Area Range */}
      <div>
        <Label className="text-sm font-medium text-luxus-gray mb-2 block">
          Area (m²)
        </Label>
        <div className="px-2 pt-2">
          <Slider
            value={[
              localFilters.min_area || AREA_RANGE.min,
              localFilters.max_area || AREA_RANGE.max,
            ]}
            onValueChange={([min, max]) => {
              handleFilterChange('min_area', min);
              handleFilterChange('max_area', max);
            }}
            min={AREA_RANGE.min}
            max={AREA_RANGE.max}
            step={AREA_RANGE.step}
          />
          <div className="flex justify-between mt-2 text-xs text-luxus-gray">
            <span>{formatArea(localFilters.min_area || AREA_RANGE.min)}</span>
            <span>{formatArea(localFilters.max_area || AREA_RANGE.max)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          variant="outline"
          className="flex-1"
          onClick={clearFilters}
        >
          Limpiar
        </Button>
        <Button
          className="flex-1 bg-luxus-gold hover:bg-luxus-gold-dark text-white"
          onClick={applyFilters}
        >
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );

  return (
    <div className={cn(className)}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-xl shadow-luxus p-6 sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-luxus-dark">Filtros</h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-luxus-gold hover:underline"
              >
                Limpiar todos
              </button>
            )}
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter Button + Sheet */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-luxus-gold text-white rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                <span>Filtros</span>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-luxus-gold hover:underline font-normal"
                  >
                    Limpiar todos
                  </button>
                )}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export default PropertyFilters;

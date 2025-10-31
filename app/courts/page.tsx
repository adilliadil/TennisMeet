'use client';

import { useState, useMemo } from 'react';
import { Container } from '@/components/layout/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { mockCourts } from '@/lib/mockData';
import { CourtManager } from '@/lib/courtManager';
import { Court, CourtFilters, CourtSearchResult, CourtSurface, CourtAmenity, CourtAvailability } from '@/types';
import {
  MapPin,
  Star,
  DollarSign,
  Clock,
  Search,
  Filter,
  Grid3x3,
  List,
  Heart
} from 'lucide-react';
import Link from 'next/link';

// Initialize court manager with mock data
const courtManager = new CourtManager(mockCourts);

const surfaceOptions: { value: CourtSurface; label: string }[] = [
  { value: 'hard', label: 'Hard' },
  { value: 'clay', label: 'Clay' },
  { value: 'grass', label: 'Grass' },
  { value: 'carpet', label: 'Carpet' },
  { value: 'indoor-hard', label: 'Indoor Hard' },
  { value: 'indoor-carpet', label: 'Indoor Carpet' },
];

const amenityOptions: { value: CourtAmenity; label: string }[] = [
  { value: 'lighting', label: 'Lighting' },
  { value: 'parking', label: 'Parking' },
  { value: 'restrooms', label: 'Restrooms' },
  { value: 'water-fountain', label: 'Water Fountain' },
  { value: 'pro-shop', label: 'Pro Shop' },
  { value: 'locker-rooms', label: 'Locker Rooms' },
  { value: 'seating', label: 'Seating' },
  { value: 'ball-machine', label: 'Ball Machine' },
  { value: 'wheelchair-accessible', label: 'Wheelchair Accessible' },
  { value: 'lessons-available', label: 'Lessons Available' },
];

const availabilityOptions: { value: CourtAvailability; label: string }[] = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
  { value: 'members-only', label: 'Members Only' },
  { value: 'reservation-required', label: 'Reservation Required' },
];

export default function CourtsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [filters, setFilters] = useState<CourtFilters>({
    surface: [],
    amenities: [],
    availability: [],
    isIndoor: undefined,
    minRating: undefined,
    searchTerm: '',
  });

  // Search and filter courts
  const searchResults: CourtSearchResult[] = useMemo(() => {
    const searchFilters: CourtFilters = {
      ...filters,
      searchTerm: searchTerm || undefined,
    };
    return courtManager.searchCourts(searchFilters);
  }, [filters, searchTerm]);

  const handleSurfaceToggle = (surface: CourtSurface) => {
    setFilters(prev => {
      const surfaces = prev.surface || [];
      const newSurfaces = surfaces.includes(surface)
        ? surfaces.filter(s => s !== surface)
        : [...surfaces, surface];
      return { ...prev, surface: newSurfaces.length > 0 ? newSurfaces : undefined };
    });
  };

  const handleAmenityToggle = (amenity: CourtAmenity) => {
    setFilters(prev => {
      const amenities = prev.amenities || [];
      const newAmenities = amenities.includes(amenity)
        ? amenities.filter(a => a !== amenity)
        : [...amenities, amenity];
      return { ...prev, amenities: newAmenities.length > 0 ? newAmenities : undefined };
    });
  };

  const handleAvailabilityToggle = (availability: CourtAvailability) => {
    setFilters(prev => {
      const availabilities = prev.availability || [];
      const newAvailabilities = availabilities.includes(availability)
        ? availabilities.filter(a => a !== availability)
        : [...availabilities, availability];
      return { ...prev, availability: newAvailabilities.length > 0 ? newAvailabilities : undefined };
    });
  };

  const clearFilters = () => {
    setFilters({
      surface: [],
      amenities: [],
      availability: [],
      isIndoor: undefined,
      minRating: undefined,
      searchTerm: '',
    });
    setSearchTerm('');
  };

  const hasActiveFilters =
    searchTerm ||
    (filters.surface && filters.surface.length > 0) ||
    (filters.amenities && filters.amenities.length > 0) ||
    (filters.availability && filters.availability.length > 0) ||
    filters.isIndoor !== undefined ||
    filters.minRating !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Container className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tennis Courts</h1>
          <p className="text-gray-600">
            Discover and book tennis courts in the Bay Area
          </p>
        </div>

        {/* Search and View Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, city, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={showFilters ? 'primary' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1">
                  Active
                </Badge>
              )}
            </Button>

            <div className="border rounded-lg p-1 flex gap-1">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                onClick={() => setViewMode('grid')}
                className="px-3"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                onClick={() => setViewMode('list')}
                className="px-3"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Filters</CardTitle>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-xs"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Surface Type */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">
                      Surface Type
                    </Label>
                    <div className="space-y-2">
                      {surfaceOptions.map(({ value, label }) => (
                        <div key={value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`surface-${value}`}
                            checked={filters.surface?.includes(value)}
                            onCheckedChange={() => handleSurfaceToggle(value)}
                          />
                          <label
                            htmlFor={`surface-${value}`}
                            className="text-sm cursor-pointer"
                          >
                            {label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Availability Type */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">
                      Availability
                    </Label>
                    <div className="space-y-2">
                      {availabilityOptions.map(({ value, label }) => (
                        <div key={value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`availability-${value}`}
                            checked={filters.availability?.includes(value)}
                            onCheckedChange={() => handleAvailabilityToggle(value)}
                          />
                          <label
                            htmlFor={`availability-${value}`}
                            className="text-sm cursor-pointer"
                          >
                            {label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Indoor/Outdoor */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">
                      Court Type
                    </Label>
                    <Select
                      value={
                        filters.isIndoor === undefined
                          ? 'all'
                          : filters.isIndoor
                          ? 'indoor'
                          : 'outdoor'
                      }
                      onValueChange={(value) => {
                        setFilters(prev => ({
                          ...prev,
                          isIndoor:
                            value === 'all'
                              ? undefined
                              : value === 'indoor'
                              ? true
                              : false,
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Courts</SelectItem>
                        <SelectItem value="outdoor">Outdoor Only</SelectItem>
                        <SelectItem value="indoor">Indoor Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Minimum Rating */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">
                      Minimum Rating
                    </Label>
                    <Select
                      value={filters.minRating?.toString() || 'all'}
                      onValueChange={(value) => {
                        setFilters(prev => ({
                          ...prev,
                          minRating: value === 'all' ? undefined : parseFloat(value),
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Rating</SelectItem>
                        <SelectItem value="4.5">4.5+ Stars</SelectItem>
                        <SelectItem value="4.0">4.0+ Stars</SelectItem>
                        <SelectItem value="3.5">3.5+ Stars</SelectItem>
                        <SelectItem value="3.0">3.0+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amenities */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">
                      Amenities
                    </Label>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {amenityOptions.map(({ value, label }) => (
                        <div key={value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`amenity-${value}`}
                            checked={filters.amenities?.includes(value)}
                            onCheckedChange={() => handleAmenityToggle(value)}
                          />
                          <label
                            htmlFor={`amenity-${value}`}
                            className="text-sm cursor-pointer"
                          >
                            {label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Courts List */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Found {searchResults.length} court{searchResults.length !== 1 ? 's' : ''}
              </p>
            </div>

            {searchResults.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500 mb-4">
                    No courts found matching your criteria
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                    : 'space-y-4'
                }
              >
                {searchResults.map(({ court, distance }) => (
                  <CourtCard
                    key={court.id}
                    court={court}
                    distance={distance}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

interface CourtCardProps {
  court: Court;
  distance?: number;
  viewMode: 'grid' | 'list';
}

function CourtCard({ court, distance, viewMode }: CourtCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const formatPrice = (rate?: number) => {
    if (!rate || rate === 0) return 'Free';
    return `$${rate}/hr`;
  };

  const getSurfaceBadgeColor = (surface: CourtSurface) => {
    switch (surface) {
      case 'hard':
      case 'indoor-hard':
        return 'bg-blue-100 text-blue-800';
      case 'clay':
        return 'bg-orange-100 text-orange-800';
      case 'grass':
        return 'bg-green-100 text-green-800';
      case 'carpet':
      case 'indoor-carpet':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityBadgeColor = (availability: CourtAvailability) => {
    switch (availability) {
      case 'public':
        return 'bg-green-100 text-green-800';
      case 'private':
        return 'bg-red-100 text-red-800';
      case 'members-only':
        return 'bg-yellow-100 text-yellow-800';
      case 'reservation-required':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex gap-6">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <Link href={`/courts/${court.id}`}>
                    <h3 className="text-xl font-bold hover:text-green-600 transition-colors">
                      {court.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {court.location.city}, {court.location.state}
                    {distance && (
                      <span className="text-gray-400">• {distance.toFixed(1)} km away</span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={isFavorite ? 'text-red-500' : 'text-gray-400'}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
              </div>

              {court.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {court.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className={getSurfaceBadgeColor(court.surface)}>
                  {court.surface.replace('-', ' ')}
                </Badge>
                <Badge className={getAvailabilityBadgeColor(court.availability)}>
                  {court.availability.replace('-', ' ')}
                </Badge>
                {court.isIndoor && (
                  <Badge variant="secondary">Indoor</Badge>
                )}
                <Badge variant="outline">
                  {court.numberOfCourts} {court.numberOfCourts === 1 ? 'Court' : 'Courts'}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm">
                {court.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{court.rating.averageRating}</span>
                    <span className="text-gray-500">({court.rating.totalReviews})</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-green-600 font-semibold">
                  <DollarSign className="h-4 w-4" />
                  {formatPrice(court.pricing?.hourlyRate)}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between items-end">
              <Link href={`/courts/${court.id}`}>
                <Button>View Details</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link href={`/courts/${court.id}`}>
              <CardTitle className="text-lg hover:text-green-600 transition-colors line-clamp-1">
                {court.name}
              </CardTitle>
            </Link>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {court.location.city}, {court.location.state}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFavorite(!isFavorite)}
            className={`${isFavorite ? 'text-red-500' : 'text-gray-400'} -mr-2 -mt-2`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {court.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {court.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={getSurfaceBadgeColor(court.surface)}>
            {court.surface.replace('-', ' ')}
          </Badge>
          <Badge className={getAvailabilityBadgeColor(court.availability)}>
            {court.availability.replace('-', ' ')}
          </Badge>
          {court.isIndoor && (
            <Badge variant="secondary">Indoor</Badge>
          )}
        </div>

        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">
              {court.numberOfCourts} {court.numberOfCourts === 1 ? 'Court' : 'Courts'}
            </span>
          </div>

          {court.rating && (
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{court.rating.averageRating}</span>
              <span className="text-gray-500 text-xs">
                ({court.rating.totalReviews} reviews)
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-green-600 font-semibold">
            <DollarSign className="h-4 w-4" />
            {formatPrice(court.pricing?.hourlyRate)}
          </div>
        </div>

        <div className="mt-auto">
          <Link href={`/courts/${court.id}`}>
            <Button className="w-full">View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

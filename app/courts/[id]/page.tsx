'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { mockCourts } from '@/lib/mockData';
import { CourtSurface, CourtAvailability, DayOfWeek } from '@/types';
import {
  MapPin,
  Star,
  DollarSign,
  Phone,
  Mail,
  Globe,
  Heart,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Users,
  Lightbulb,
  Car,
  Droplet,
  ShoppingBag,
  User,
  Armchair,
  Target,
  Accessibility,
  GraduationCap,
} from 'lucide-react';
import Link from 'next/link';

const amenityIcons: Record<string, any> = {
  lighting: Lightbulb,
  parking: Car,
  restrooms: User,
  'water-fountain': Droplet,
  'pro-shop': ShoppingBag,
  'locker-rooms': Users,
  seating: Armchair,
  'ball-machine': Target,
  'wheelchair-accessible': Accessibility,
  'lessons-available': GraduationCap,
};

export default function CourtDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courtId = params?.id as string;

  const [isFavorite, setIsFavorite] = useState(false);

  const court = mockCourts.find((c) => c.id === courtId);

  if (!court) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Container className="py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl font-bold mb-2">Court Not Found</h2>
              <p className="text-gray-600 mb-4">
                The court you are looking for does not exist.
              </p>
              <Button onClick={() => router.push('/courts')}>
                Back to Courts
              </Button>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

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

  const getDayLabel = (day: DayOfWeek): string => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Container className="py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/courts')}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courts
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-3xl mb-2">{court.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-base">
                      <MapPin className="h-4 w-4" />
                      {court.location.address}, {court.location.city}, {court.location.state}{' '}
                      {court.location.zipCode}
                    </CardDescription>
                  </div>
                  <Button
                    variant={isFavorite ? 'primary' : 'outline'}
                    size="lg"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="gap-2"
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                    {isFavorite ? 'Favorited' : 'Add to Favorites'}
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge className={getSurfaceBadgeColor(court.surface)}>
                    {court.surface.replace('-', ' ')}
                  </Badge>
                  <Badge className={getAvailabilityBadgeColor(court.availability)}>
                    {court.availability.replace('-', ' ')}
                  </Badge>
                  {court.isIndoor && <Badge variant="secondary">Indoor</Badge>}
                  <Badge variant="outline">
                    {court.numberOfCourts} {court.numberOfCourts === 1 ? 'Court' : 'Courts'}
                  </Badge>
                </div>

                {court.rating && (
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl font-bold">
                        {court.rating.averageRating}
                      </span>
                      <span className="text-gray-500">
                        ({court.rating.totalReviews} reviews)
                      </span>
                    </div>
                    <Separator orientation="vertical" className="h-6" />
                    <div className="flex items-center gap-2 text-green-600 font-bold text-xl">
                      <DollarSign className="h-5 w-5" />
                      {formatPrice(court.pricing?.hourlyRate)}
                    </div>
                  </div>
                )}
              </CardHeader>
            </Card>

            {/* Description */}
            {court.description && (
              <Card>
                <CardHeader>
                  <CardTitle>About This Court</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{court.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {court.amenities.map((amenity) => {
                    const Icon = amenityIcons[amenity] || CheckCircle2;
                    return (
                      <div
                        key={amenity}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <Icon className="h-5 w-5 text-green-600" />
                        <span className="capitalize">
                          {amenity.replace('-', ' ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Operating Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {court.operatingHours.map((hours) => (
                    <div
                      key={hours.dayOfWeek}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <span className="font-medium capitalize">
                        {getDayLabel(hours.dayOfWeek)}
                      </span>
                      <span className="text-gray-600">
                        {hours.isClosed
                          ? 'Closed'
                          : `${hours.openTime} - ${hours.closeTime}`}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pricing Details */}
            {court.pricing && (
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Hourly Rate</span>
                      <span className="text-2xl font-bold text-green-600">
                        {formatPrice(court.pricing.hourlyRate)}
                      </span>
                    </div>
                    {court.pricing.notes && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {court.pricing.notes}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/courts/${court.id}/book`} className="block">
                  <Button className="w-full gap-2" size="lg">
                    <Calendar className="h-5 w-5" />
                    Book a Court
                  </Button>
                </Link>
                <Button variant="outline" className="w-full gap-2" size="lg">
                  <MapPin className="h-5 w-5" />
                  View on Map
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {court.contact?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <a
                      href={`tel:${court.contact.phone}`}
                      className="text-green-600 hover:underline"
                    >
                      {court.contact.phone}
                    </a>
                  </div>
                )}
                {court.contact?.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <a
                      href={`mailto:${court.contact.email}`}
                      className="text-green-600 hover:underline break-all"
                    >
                      {court.contact.email}
                    </a>
                  </div>
                )}
                {court.contact?.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <a
                      href={court.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline break-all"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Court Details */}
            <Card>
              <CardHeader>
                <CardTitle>Court Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Surface</span>
                  <span className="font-medium capitalize">
                    {court.surface.replace('-', ' ')}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium">
                    {court.isIndoor ? 'Indoor' : 'Outdoor'}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Number of Courts</span>
                  <span className="font-medium">{court.numberOfCourts}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Availability</span>
                  <span className="font-medium capitalize">
                    {court.availability.replace('-', ' ')}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Map Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">Map view coming soon</p>
                    <p className="text-xs mt-1">
                      Lat: {court.location.latitude.toFixed(4)}, Lng:{' '}
                      {court.location.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

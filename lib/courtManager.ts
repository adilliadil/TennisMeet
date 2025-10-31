import {
  Court,
  CourtFilters,
  CourtSearchResult,
  UserCourtFavorite,
  CourtBooking,
  CourtStatistics,
  CourtSurface,
  CourtAmenity,
  DayOfWeek,
} from '@/types';

// Haversine formula to calculate distance between two coordinates
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Court CRUD Operations

export class CourtManager {
  private courts: Court[] = [];
  private favorites: UserCourtFavorite[] = [];
  private bookings: CourtBooking[] = [];

  constructor(initialCourts: Court[] = []) {
    this.courts = initialCourts;
  }

  // Create a new court
  createCourt(courtData: Omit<Court, 'id' | 'createdAt' | 'updatedAt'>): Court {
    const newCourt: Court = {
      ...courtData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courts.push(newCourt);
    return newCourt;
  }

  // Get court by ID
  getCourtById(courtId: string): Court | undefined {
    return this.courts.find((court) => court.id === courtId);
  }

  // Get all courts
  getAllCourts(): Court[] {
    return [...this.courts];
  }

  // Update court
  updateCourt(courtId: string, updates: Partial<Court>): Court | null {
    const courtIndex = this.courts.findIndex((court) => court.id === courtId);
    if (courtIndex === -1) return null;

    this.courts[courtIndex] = {
      ...this.courts[courtIndex],
      ...updates,
      id: courtId, // Prevent ID changes
      updatedAt: new Date(),
    };
    return this.courts[courtIndex];
  }

  // Delete court
  deleteCourt(courtId: string): boolean {
    const initialLength = this.courts.length;
    this.courts = this.courts.filter((court) => court.id !== courtId);

    // Also remove associated favorites and bookings
    this.favorites = this.favorites.filter((fav) => fav.courtId !== courtId);
    this.bookings = this.bookings.filter((booking) => booking.courtId !== courtId);

    return this.courts.length < initialLength;
  }

  // Search and filter courts
  searchCourts(filters: CourtFilters): CourtSearchResult[] {
    let results: CourtSearchResult[] = this.courts.map((court) => ({
      court,
      distance: undefined,
      matchScore: 0,
    }));

    // Filter by surface type
    if (filters.surface && filters.surface.length > 0) {
      results = results.filter((result) =>
        filters.surface!.includes(result.court.surface)
      );
    }

    // Filter by amenities (court must have all selected amenities)
    if (filters.amenities && filters.amenities.length > 0) {
      results = results.filter((result) =>
        filters.amenities!.every((amenity) =>
          result.court.amenities.includes(amenity)
        )
      );
    }

    // Filter by availability type
    if (filters.availability && filters.availability.length > 0) {
      results = results.filter((result) =>
        filters.availability!.includes(result.court.availability)
      );
    }

    // Filter by indoor/outdoor
    if (filters.isIndoor !== undefined) {
      results = results.filter(
        (result) => result.court.isIndoor === filters.isIndoor
      );
    }

    // Filter by rating
    if (filters.minRating !== undefined) {
      results = results.filter(
        (result) =>
          result.court.rating &&
          result.court.rating.averageRating >= filters.minRating!
      );
    }

    // Filter by price range
    if (filters.priceRange) {
      results = results.filter((result) => {
        const hourlyRate = result.court.pricing?.hourlyRate;
        if (!hourlyRate) return !filters.priceRange?.min; // Include free courts if no min price

        const min = filters.priceRange.min ?? 0;
        const max = filters.priceRange.max ?? Infinity;
        return hourlyRate >= min && hourlyRate <= max;
      });
    }

    // Calculate distance if user location provided
    if (filters.userLocation) {
      results = results.map((result) => ({
        ...result,
        distance: calculateDistance(
          filters.userLocation!.latitude,
          filters.userLocation!.longitude,
          result.court.location.latitude,
          result.court.location.longitude
        ),
      }));

      // Filter by max distance
      if (filters.maxDistance) {
        results = results.filter(
          (result) => result.distance! <= filters.maxDistance!
        );
      }

      // Sort by distance (closest first)
      results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    // Text search (name, city, address)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      results = results.filter((result) => {
        const court = result.court;
        return (
          court.name.toLowerCase().includes(searchLower) ||
          court.location.city.toLowerCase().includes(searchLower) ||
          court.location.address.toLowerCase().includes(searchLower) ||
          court.description?.toLowerCase().includes(searchLower)
        );
      });

      // Calculate match score based on relevance
      results = results.map((result) => {
        let score = 0;
        const court = result.court;
        const searchLower = filters.searchTerm!.toLowerCase();

        if (court.name.toLowerCase().includes(searchLower)) score += 10;
        if (court.location.city.toLowerCase().includes(searchLower)) score += 5;
        if (court.location.address.toLowerCase().includes(searchLower)) score += 3;
        if (court.description?.toLowerCase().includes(searchLower)) score += 2;

        // Exact match bonus
        if (court.name.toLowerCase() === searchLower) score += 20;

        return { ...result, matchScore: score };
      });

      // Sort by match score if no location sorting
      if (!filters.userLocation) {
        results.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      }
    }

    return results;
  }

  // Get courts near a location
  getCourtsNearLocation(
    latitude: number,
    longitude: number,
    maxDistanceKm: number = 10
  ): CourtSearchResult[] {
    return this.searchCourts({
      userLocation: { latitude, longitude },
      maxDistance: maxDistanceKm,
    });
  }

  // Favorite Management

  addFavorite(
    userId: string,
    courtId: string,
    notes?: string
  ): UserCourtFavorite | null {
    // Check if court exists
    if (!this.getCourtById(courtId)) return null;

    // Check if already favorited
    const existing = this.favorites.find(
      (fav) => fav.userId === userId && fav.courtId === courtId
    );
    if (existing) return existing;

    const favorite: UserCourtFavorite = {
      id: this.generateId(),
      userId,
      courtId,
      notes,
      addedAt: new Date(),
    };

    this.favorites.push(favorite);
    return favorite;
  }

  removeFavorite(userId: string, courtId: string): boolean {
    const initialLength = this.favorites.length;
    this.favorites = this.favorites.filter(
      (fav) => !(fav.userId === userId && fav.courtId === courtId)
    );
    return this.favorites.length < initialLength;
  }

  getUserFavorites(userId: string): Court[] {
    const userFavoriteIds = this.favorites
      .filter((fav) => fav.userId === userId)
      .map((fav) => fav.courtId);

    return this.courts.filter((court) => userFavoriteIds.includes(court.id));
  }

  isFavorite(userId: string, courtId: string): boolean {
    return this.favorites.some(
      (fav) => fav.userId === userId && fav.courtId === courtId
    );
  }

  // Booking Management

  createBooking(
    bookingData: Omit<CourtBooking, 'id' | 'createdAt' | 'updatedAt'>
  ): CourtBooking | null {
    // Check if court exists
    if (!this.getCourtById(bookingData.courtId)) return null;

    // Check for booking conflicts
    const hasConflict = this.checkBookingConflict(
      bookingData.courtId,
      bookingData.date,
      bookingData.startTime,
      bookingData.endTime
    );

    if (hasConflict) return null;

    const booking: CourtBooking = {
      ...bookingData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.bookings.push(booking);
    return booking;
  }

  getCourtBookings(
    courtId: string,
    dateFrom?: Date,
    dateTo?: Date
  ): CourtBooking[] {
    let bookings = this.bookings.filter(
      (booking) => booking.courtId === courtId
    );

    if (dateFrom) {
      bookings = bookings.filter((booking) => booking.date >= dateFrom);
    }

    if (dateTo) {
      bookings = bookings.filter((booking) => booking.date <= dateTo);
    }

    return bookings.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  getUserBookings(userId: string): CourtBooking[] {
    return this.bookings
      .filter((booking) => booking.userId === userId)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  cancelBooking(bookingId: string): boolean {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return false;

    booking.status = 'cancelled';
    booking.updatedAt = new Date();
    return true;
  }

  checkBookingConflict(
    courtId: string,
    date: Date,
    startTime: string,
    endTime: string
  ): boolean {
    const dateStr = date.toISOString().split('T')[0];

    return this.bookings.some((booking) => {
      if (
        booking.courtId !== courtId ||
        booking.status === 'cancelled' ||
        booking.status === 'completed'
      ) {
        return false;
      }

      const bookingDateStr = booking.date.toISOString().split('T')[0];
      if (bookingDateStr !== dateStr) return false;

      // Check time overlap
      return this.timeRangesOverlap(
        startTime,
        endTime,
        booking.startTime,
        booking.endTime
      );
    });
  }

  private timeRangesOverlap(
    start1: string,
    end1: string,
    start2: string,
    end2: string
  ): boolean {
    const [start1Hours, start1Minutes] = start1.split(':').map(Number);
    const [end1Hours, end1Minutes] = end1.split(':').map(Number);
    const [start2Hours, start2Minutes] = start2.split(':').map(Number);
    const [end2Hours, end2Minutes] = end2.split(':').map(Number);

    const start1Mins = start1Hours * 60 + start1Minutes;
    const end1Mins = end1Hours * 60 + end1Minutes;
    const start2Mins = start2Hours * 60 + start2Minutes;
    const end2Mins = end2Hours * 60 + end2Minutes;

    return start1Mins < end2Mins && end1Mins > start2Mins;
  }

  // Court Statistics

  getCourtStatistics(courtId: string): CourtStatistics | null {
    const court = this.getCourtById(courtId);
    if (!court) return null;

    const courtBookings = this.bookings.filter((b) => b.courtId === courtId);

    // Calculate total duration
    const totalDuration = courtBookings.reduce((sum, booking) => {
      const [startHours, startMinutes] = booking.startTime.split(':').map(Number);
      const [endHours, endMinutes] = booking.endTime.split(':').map(Number);
      const duration = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
      return sum + duration;
    }, 0);

    // Count matches
    const totalMatches = courtBookings.filter((b) => b.matchId).length;

    // Popular time slots
    const timeSlotMap = new Map<string, number>();
    courtBookings.forEach((booking) => {
      const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
        booking.date.getDay()
      ] as DayOfWeek;
      const hour = parseInt(booking.startTime.split(':')[0]);
      const timeRange = `${hour}:00-${hour + 1}:00`;
      const key = `${dayOfWeek}-${timeRange}`;
      timeSlotMap.set(key, (timeSlotMap.get(key) || 0) + 1);
    });

    const popularTimeSlots = Array.from(timeSlotMap.entries())
      .map(([key, count]) => {
        const [dayOfWeek, timeRange] = key.split('-');
        return {
          dayOfWeek: dayOfWeek as DayOfWeek,
          timeRange,
          bookingCount: count,
        };
      })
      .sort((a, b) => b.bookingCount - a.bookingCount)
      .slice(0, 5);

    // Peak months
    const monthMap = new Map<string, number>();
    courtBookings.forEach((booking) => {
      const key = `${booking.date.getFullYear()}-${booking.date.getMonth()}`;
      monthMap.set(key, (monthMap.get(key) || 0) + 1);
    });

    const peakMonths = Array.from(monthMap.entries())
      .map(([key, count]) => {
        const [year, month] = key.split('-').map(Number);
        return { year, month, bookingCount: count };
      })
      .sort((a, b) => b.bookingCount - a.bookingCount)
      .slice(0, 6);

    return {
      courtId,
      totalBookings: courtBookings.length,
      totalMatches,
      averageBookingDuration: courtBookings.length > 0 ? totalDuration / courtBookings.length : 0,
      popularTimeSlots,
      peakMonths,
    };
  }

  // Utility function to check if court is open at a specific time
  isCourtOpen(courtId: string, date: Date, time: string): boolean {
    const court = this.getCourtById(courtId);
    if (!court) return false;

    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
      date.getDay()
    ] as DayOfWeek;

    const hours = court.operatingHours.find((h) => h.dayOfWeek === dayOfWeek);
    if (!hours || hours.isClosed) return false;

    return time >= hours.openTime && time <= hours.closeTime;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Export/Import for persistence
  exportData() {
    return {
      courts: this.courts,
      favorites: this.favorites,
      bookings: this.bookings,
    };
  }

  importData(data: {
    courts: Court[];
    favorites: UserCourtFavorite[];
    bookings: CourtBooking[];
  }) {
    this.courts = data.courts;
    this.favorites = data.favorites;
    this.bookings = data.bookings;
  }
}

// Singleton instance for app-wide use
let courtManagerInstance: CourtManager | null = null;

export function getCourtManager(): CourtManager {
  if (!courtManagerInstance) {
    courtManagerInstance = new CourtManager();
  }
  return courtManagerInstance;
}

export function setCourtManager(manager: CourtManager) {
  courtManagerInstance = manager;
}

// Global TypeScript types and interfaces
// Add shared types here that are used across multiple components/pages

export type PlayStyle =
  | 'aggressive'
  | 'defensive'
  | 'all-court'
  | 'serve-and-volley'
  | 'baseline';

export type PlayerStats = {
  elo: number;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
};

export type MatchHistoryEntry = {
  id: string;
  date: Date;
  opponent: {
    id: string;
    name: string;
    profileImage?: string;
  };
  result: 'won' | 'lost';
  score: string;
  location: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  location: {
    latitude: number;
    longitude: number;
    city?: string;
    state?: string;
  };
  profileImage?: string;
  bio?: string;
  playStyle?: PlayStyle;
  preferredSurface?: 'hard' | 'clay' | 'grass' | 'any';
  availability?: string[];
  stats?: PlayerStats;
  matchHistory?: MatchHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
};

export type MatchStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export type MatchSet = {
  player1Games: number;
  player2Games: number;
  tiebreak?: {
    player1Points: number;
    player2Points: number;
  };
};

export type MatchScore = {
  sets: MatchSet[];
  winnerId: string;
  duration?: number; // in minutes
};

export type Match = {
  id: string;
  player1Id: string;
  player2Id: string;
  status: MatchStatus;
  scheduledDate?: Date;
  completedDate?: Date;
  location: {
    name: string;
    address?: string;
    city: string;
    state: string;
    latitude?: number;
    longitude?: number;
  };
  surface?: 'hard' | 'clay' | 'grass' | 'carpet';
  score?: MatchScore;
  eloChanges?: {
    player1Change: number;
    player2Change: number;
    player1NewElo: number;
    player2NewElo: number;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type MatchFilters = {
  playerId?: string;
  status?: MatchStatus;
  surface?: string;
  dateFrom?: Date;
  dateTo?: Date;
  result?: 'won' | 'lost' | 'all';
};

export type MatchStatistics = {
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  averageEloChange: number;
  bySurface: {
    hard: { wins: number; losses: number; winRate: number };
    clay: { wins: number; losses: number; winRate: number };
    grass: { wins: number; losses: number; winRate: number };
    carpet: { wins: number; losses: number; winRate: number };
  };
  recentForm: Array<'W' | 'L'>; // Last 10 matches
  longestWinStreak: number;
  longestLossStreak: number;
  currentStreak: number;
  streakType: 'win' | 'loss' | 'none';
};

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  status: number;
};

// Availability Calendar Types

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type TimeBlock = {
  id: string;
  playerId: string;
  date: Date; // Specific date for the time block
  startTime: string; // Format: "HH:mm" (e.g., "09:00")
  endTime: string; // Format: "HH:mm" (e.g., "11:00")
  isRecurring: boolean;
  recurringPattern?: {
    frequency: 'weekly' | 'biweekly' | 'monthly';
    daysOfWeek?: DayOfWeek[]; // For weekly/biweekly patterns
    endDate?: Date; // When recurring pattern ends
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AvailabilitySlot = {
  date: Date;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  isAvailable: boolean;
};

export type CalendarView = 'month' | 'week' | 'day';

export type CalendarDate = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  hasAvailability: boolean;
  timeBlocks: TimeBlock[];
};

export type WeekSchedule = {
  weekStart: Date;
  weekEnd: Date;
  days: CalendarDate[];
};

export type MonthSchedule = {
  month: number;
  year: number;
  weeks: CalendarDate[][];
};

export type CommonAvailability = {
  player1Id: string;
  player2Id: string;
  matchingSlots: AvailabilitySlot[];
};

export type TimeBlockConflict = {
  existingBlock: TimeBlock;
  newBlock: Partial<TimeBlock>;
  conflictType: 'overlap' | 'duplicate' | 'invalid_time';
  message: string;
};

export type AvailabilityFilters = {
  playerId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  dayOfWeek?: DayOfWeek;
  minDuration?: number; // minimum duration in minutes
};

// Court Management Types

export type CourtSurface = 'hard' | 'clay' | 'grass' | 'carpet' | 'indoor-hard' | 'indoor-carpet';

export type CourtAmenity =
  | 'lighting'
  | 'parking'
  | 'restrooms'
  | 'water-fountain'
  | 'pro-shop'
  | 'locker-rooms'
  | 'seating'
  | 'ball-machine'
  | 'wheelchair-accessible'
  | 'lessons-available';

export type CourtAvailability = 'public' | 'private' | 'members-only' | 'reservation-required';

export type CourtOperatingHours = {
  dayOfWeek: DayOfWeek;
  openTime: string; // Format: "HH:mm"
  closeTime: string; // Format: "HH:mm"
  isClosed: boolean;
};

export type CourtLocation = {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
};

export type Court = {
  id: string;
  name: string;
  description?: string;
  location: CourtLocation;
  surface: CourtSurface;
  amenities: CourtAmenity[];
  availability: CourtAvailability;
  operatingHours: CourtOperatingHours[];
  numberOfCourts: number; // Number of courts at this facility
  isIndoor: boolean;
  pricing?: {
    hourlyRate?: number;
    currency: string;
    notes?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  images?: string[]; // URLs to court images
  rating?: {
    averageRating: number; // 1-5 stars
    totalReviews: number;
  };
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string; // User ID who added the court
};

export type CourtFilters = {
  surface?: CourtSurface[];
  amenities?: CourtAmenity[];
  availability?: CourtAvailability[];
  isIndoor?: boolean;
  maxDistance?: number; // in kilometers
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  minRating?: number;
  searchTerm?: string; // Search by name, city, or address
  priceRange?: {
    min?: number;
    max?: number;
  };
};

export type CourtSearchResult = {
  court: Court;
  distance?: number; // distance from user in kilometers
  matchScore?: number; // relevance score for search
};

export type UserCourtFavorite = {
  id: string;
  userId: string;
  courtId: string;
  notes?: string;
  addedAt: Date;
};

export type CourtBooking = {
  id: string;
  courtId: string;
  matchId?: string; // Optional link to a match
  userId: string;
  date: Date;
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CourtStatistics = {
  courtId: string;
  totalBookings: number;
  totalMatches: number;
  averageBookingDuration: number; // in minutes
  popularTimeSlots: {
    dayOfWeek: DayOfWeek;
    timeRange: string;
    bookingCount: number;
  }[];
  peakMonths: {
    month: number;
    year: number;
    bookingCount: number;
  }[];
};

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

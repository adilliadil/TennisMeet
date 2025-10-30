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

export type Match = {
  id: string;
  hostId: string;
  partnerId?: string;
  status: 'open' | 'confirmed' | 'completed' | 'cancelled';
  date: Date;
  time: string;
  location: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  status: number;
};

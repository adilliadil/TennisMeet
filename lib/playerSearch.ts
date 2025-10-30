import { User, PlayStyle } from '@/types';
import { calculateDistance } from './mockData';

export type SearchFilters = {
  skillLevel?: ('beginner' | 'intermediate' | 'advanced' | 'professional')[];
  playStyle?: PlayStyle[];
  preferredSurface?: ('hard' | 'clay' | 'grass' | 'any')[];
  availability?: string[];
  maxDistance?: number; // in miles
  minElo?: number;
  maxElo?: number;
  searchQuery?: string; // name or bio search
};

export type RankingWeights = {
  skillLevelMatch: number;
  eloProximity: number;
  distanceProximity: number;
  playStyleMatch: number;
  surfaceMatch: number;
  availabilityMatch: number;
};

// Default ranking weights (must sum to 1.0)
export const DEFAULT_WEIGHTS: RankingWeights = {
  skillLevelMatch: 0.25,
  eloProximity: 0.20,
  distanceProximity: 0.20,
  playStyleMatch: 0.15,
  surfaceMatch: 0.10,
  availabilityMatch: 0.10,
};

/**
 * Calculate skill level match score
 * Same level = 1.0, Adjacent level = 0.5, Two levels apart = 0.25, etc.
 */
const calculateSkillLevelScore = (
  currentLevel: string,
  targetLevel: string
): number => {
  const levels = ['beginner', 'intermediate', 'advanced', 'professional'];
  const currentIndex = levels.indexOf(currentLevel);
  const targetIndex = levels.indexOf(targetLevel);
  const difference = Math.abs(currentIndex - targetIndex);

  switch (difference) {
    case 0:
      return 1.0;
    case 1:
      return 0.5;
    case 2:
      return 0.25;
    default:
      return 0.1;
  }
};

/**
 * Calculate Elo proximity score
 * Closer Elo ratings = higher score
 */
const calculateEloScore = (currentElo: number, targetElo: number): number => {
  const difference = Math.abs(currentElo - targetElo);

  if (difference <= 100) return 1.0;
  if (difference <= 200) return 0.8;
  if (difference <= 300) return 0.6;
  if (difference <= 400) return 0.4;
  if (difference <= 500) return 0.2;
  return 0.1;
};

/**
 * Calculate distance proximity score
 * Closer distance = higher score
 */
const calculateDistanceScore = (distance: number): number => {
  if (distance <= 5) return 1.0;
  if (distance <= 10) return 0.8;
  if (distance <= 15) return 0.6;
  if (distance <= 20) return 0.4;
  if (distance <= 30) return 0.2;
  return 0.1;
};

/**
 * Calculate play style match score
 * Same style = 1.0, Compatible styles = 0.7, All-court matches everything = 0.8
 */
const calculatePlayStyleScore = (
  currentStyle?: PlayStyle,
  targetStyle?: PlayStyle
): number => {
  if (!currentStyle || !targetStyle) return 0.5;
  if (currentStyle === targetStyle) return 1.0;
  if (currentStyle === 'all-court' || targetStyle === 'all-court') return 0.8;

  // Compatible styles: aggressive vs defensive = interesting match
  const compatiblePairs = [
    ['aggressive', 'defensive'],
    ['serve-and-volley', 'baseline'],
  ];

  const isCompatible = compatiblePairs.some(
    pair =>
      (pair[0] === currentStyle && pair[1] === targetStyle) ||
      (pair[1] === currentStyle && pair[0] === targetStyle)
  );

  return isCompatible ? 0.7 : 0.5;
};

/**
 * Calculate surface match score
 */
const calculateSurfaceScore = (
  currentSurface?: string,
  targetSurface?: string
): number => {
  if (!currentSurface || !targetSurface) return 0.5;
  if (currentSurface === 'any' || targetSurface === 'any') return 0.8;
  if (currentSurface === targetSurface) return 1.0;
  return 0.3;
};

/**
 * Calculate availability match score
 */
const calculateAvailabilityScore = (
  currentAvailability?: string[],
  targetAvailability?: string[]
): number => {
  if (!currentAvailability?.length || !targetAvailability?.length) return 0.5;

  const matches = currentAvailability.filter(slot =>
    targetAvailability.includes(slot)
  );

  if (matches.length === 0) return 0.2;
  if (matches.length >= 3) return 1.0;
  if (matches.length >= 2) return 0.8;
  return 0.5;
};

/**
 * Calculate overall ranking score for a player
 */
export const calculatePlayerScore = (
  currentUser: User,
  targetPlayer: User,
  weights: RankingWeights = DEFAULT_WEIGHTS
): number => {
  const distance = calculateDistance(
    currentUser.location.latitude,
    currentUser.location.longitude,
    targetPlayer.location.latitude,
    targetPlayer.location.longitude
  );

  const skillScore = calculateSkillLevelScore(
    currentUser.skillLevel,
    targetPlayer.skillLevel
  );
  const eloScore = calculateEloScore(
    currentUser.stats?.elo || 1200,
    targetPlayer.stats?.elo || 1200
  );
  const distanceScore = calculateDistanceScore(distance);
  const playStyleScore = calculatePlayStyleScore(
    currentUser.playStyle,
    targetPlayer.playStyle
  );
  const surfaceScore = calculateSurfaceScore(
    currentUser.preferredSurface,
    targetPlayer.preferredSurface
  );
  const availabilityScore = calculateAvailabilityScore(
    currentUser.availability,
    targetPlayer.availability
  );

  const totalScore =
    skillScore * weights.skillLevelMatch +
    eloScore * weights.eloProximity +
    distanceScore * weights.distanceProximity +
    playStyleScore * weights.playStyleMatch +
    surfaceScore * weights.surfaceMatch +
    availabilityScore * weights.availabilityMatch;

  return Math.round(totalScore * 100);
};

/**
 * Filter and rank players based on search criteria
 */
export const searchPlayers = (
  currentUser: User,
  allPlayers: User[],
  filters: SearchFilters = {},
  weights: RankingWeights = DEFAULT_WEIGHTS
): Array<User & { matchScore: number; distance: number }> => {
  // Filter out current user
  let results = allPlayers.filter(player => player.id !== currentUser.id);

  // Apply skill level filter
  if (filters.skillLevel?.length) {
    results = results.filter(player =>
      filters.skillLevel!.includes(player.skillLevel)
    );
  }

  // Apply play style filter
  if (filters.playStyle?.length) {
    results = results.filter(
      player => player.playStyle && filters.playStyle!.includes(player.playStyle)
    );
  }

  // Apply surface filter
  if (filters.preferredSurface?.length) {
    results = results.filter(
      player =>
        player.preferredSurface &&
        (filters.preferredSurface!.includes(player.preferredSurface) ||
          player.preferredSurface === 'any')
    );
  }

  // Apply availability filter
  if (filters.availability?.length) {
    results = results.filter(player => {
      if (!player.availability?.length) return false;
      return filters.availability!.some(slot =>
        player.availability!.includes(slot)
      );
    });
  }

  // Apply Elo filters
  if (filters.minElo !== undefined) {
    results = results.filter(
      player => (player.stats?.elo || 0) >= filters.minElo!
    );
  }
  if (filters.maxElo !== undefined) {
    results = results.filter(
      player => (player.stats?.elo || 0) <= filters.maxElo!
    );
  }

  // Apply search query (name or bio)
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    results = results.filter(
      player =>
        player.name.toLowerCase().includes(query) ||
        player.bio?.toLowerCase().includes(query)
    );
  }

  // Calculate distance and filter by max distance
  const resultsWithDistance = results.map(player => {
    const distance = calculateDistance(
      currentUser.location.latitude,
      currentUser.location.longitude,
      player.location.latitude,
      player.location.longitude
    );
    return { ...player, distance };
  });

  let filteredByDistance = resultsWithDistance;
  if (filters.maxDistance) {
    filteredByDistance = resultsWithDistance.filter(
      player => player.distance <= filters.maxDistance!
    );
  }

  // Calculate match scores and sort
  const rankedResults = filteredByDistance.map(player => ({
    ...player,
    matchScore: calculatePlayerScore(currentUser, player, weights),
  }));

  // Sort by match score (highest first), then by distance (closest first)
  return rankedResults.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return a.distance - b.distance;
  });
};

/**
 * Get recommended players (top matches without explicit filters)
 */
export const getRecommendedPlayers = (
  currentUser: User,
  allPlayers: User[],
  limit: number = 10
): Array<User & { matchScore: number; distance: number }> => {
  const results = searchPlayers(currentUser, allPlayers);
  return results.slice(0, limit);
};

/**
 * Get players by location proximity
 */
export const getNearbyPlayers = (
  currentUser: User,
  allPlayers: User[],
  maxDistance: number = 15,
  limit?: number
): Array<User & { matchScore: number; distance: number }> => {
  const results = searchPlayers(currentUser, allPlayers, { maxDistance });
  return limit ? results.slice(0, limit) : results;
};

/**
 * Get players by similar skill level
 */
export const getSimilarSkillPlayers = (
  currentUser: User,
  allPlayers: User[],
  limit?: number
): Array<User & { matchScore: number; distance: number }> => {
  // Include current level and adjacent levels
  const levels = ['beginner', 'intermediate', 'advanced', 'professional'];
  const currentIndex = levels.indexOf(currentUser.skillLevel);
  const skillLevel = [
    levels[Math.max(0, currentIndex - 1)],
    currentUser.skillLevel,
    levels[Math.min(levels.length - 1, currentIndex + 1)],
  ].filter(Boolean) as SearchFilters['skillLevel'];

  const results = searchPlayers(currentUser, allPlayers, { skillLevel });
  return limit ? results.slice(0, limit) : results;
};

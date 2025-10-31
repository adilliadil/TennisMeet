/**
 * Match Management & Statistics
 * Handles match CRUD operations, scoring validation, and statistics calculation
 */

import {
  Match,
  MatchSet,
  MatchScore,
  MatchFilters,
  MatchStatistics,
  User,
} from '@/types';
import { calculateEloChange, validateElo } from './eloCalculator';

/**
 * Validate tennis match score
 * Ensures sets are valid according to tennis rules
 */
export function validateMatchScore(sets: MatchSet[]): {
  valid: boolean;
  error?: string;
} {
  // Must have at least 2 sets (best of 3) or 3 sets (best of 5)
  if (sets.length < 2) {
    return { valid: false, error: 'Match must have at least 2 sets' };
  }

  if (sets.length > 5) {
    return { valid: false, error: 'Match cannot have more than 5 sets' };
  }

  // Validate each set
  for (let i = 0; i < sets.length; i++) {
    const set = sets[i]!;
    const p1Games = set.player1Games;
    const p2Games = set.player2Games;

    // Basic validation
    if (p1Games < 0 || p2Games < 0) {
      return {
        valid: false,
        error: `Set ${i + 1}: Games cannot be negative`,
      };
    }

    // Set must be won (6-0, 6-1, 6-2, 6-3, 6-4, 7-5, 7-6)
    const maxGames = Math.max(p1Games, p2Games);
    const minGames = Math.min(p1Games, p2Games);

    if (maxGames < 6) {
      return {
        valid: false,
        error: `Set ${i + 1}: Winner must have at least 6 games`,
      };
    }

    // Standard set (win by 2): 6-0, 6-1, 6-2, 6-3, 6-4
    if (maxGames === 6) {
      if (minGames > 4) {
        return {
          valid: false,
          error: `Set ${i + 1}: Invalid score ${maxGames}-${minGames}`,
        };
      }
    }

    // Extended set: 7-5
    if (maxGames === 7) {
      if (minGames !== 5 && minGames !== 6) {
        return {
          valid: false,
          error: `Set ${i + 1}: Invalid score ${maxGames}-${minGames}`,
        };
      }

      // 7-6 must have tiebreak
      if (minGames === 6 && !set.tiebreak) {
        return {
          valid: false,
          error: `Set ${i + 1}: 7-6 score requires tiebreak details`,
        };
      }
    }

    if (maxGames > 7) {
      return {
        valid: false,
        error: `Set ${i + 1}: Games cannot exceed 7 (use tiebreak)`,
      };
    }

    // Validate tiebreak if present
    if (set.tiebreak) {
      const tbMax = Math.max(
        set.tiebreak.player1Points,
        set.tiebreak.player2Points
      );
      const tbMin = Math.min(
        set.tiebreak.player1Points,
        set.tiebreak.player2Points
      );

      if (tbMax < 7) {
        return {
          valid: false,
          error: `Set ${i + 1}: Tiebreak winner must have at least 7 points`,
        };
      }

      if (tbMax - tbMin < 2) {
        return {
          valid: false,
          error: `Set ${i + 1}: Tiebreak must be won by 2 points`,
        };
      }
    }
  }

  // Validate overall match winner
  let player1SetsWon = 0;
  let player2SetsWon = 0;

  sets.forEach((set) => {
    if (set.player1Games > set.player2Games) {
      player1SetsWon++;
    } else {
      player2SetsWon++;
    }
  });

  const maxSets = Math.max(player1SetsWon, player2SetsWon);

  // Best of 3: need 2 sets to win
  if (sets.length <= 3 && maxSets < 2) {
    return {
      valid: false,
      error: 'Match incomplete: No player won 2 sets (best of 3)',
    };
  }

  // Best of 5: need 3 sets to win
  if (sets.length > 3 && maxSets < 3) {
    return {
      valid: false,
      error: 'Match incomplete: No player won 3 sets (best of 5)',
    };
  }

  return { valid: true };
}

/**
 * Determine match winner from score
 */
export function determineWinner(
  sets: MatchSet[],
  player1Id: string,
  player2Id: string
): string {
  let player1SetsWon = 0;
  let player2SetsWon = 0;

  sets.forEach((set) => {
    if (set.player1Games > set.player2Games) {
      player1SetsWon++;
    } else {
      player2SetsWon++;
    }
  });

  return player1SetsWon > player2SetsWon ? player1Id : player2Id;
}

/**
 * Format score for display (e.g., "6-4, 6-3")
 */
export function formatMatchScore(sets: MatchSet[]): string {
  return sets
    .map((set) => {
      let scoreStr = `${set.player1Games}-${set.player2Games}`;
      if (set.tiebreak) {
        const tbWinner =
          set.player1Games > set.player2Games
            ? set.tiebreak.player1Points
            : set.tiebreak.player2Points;
        scoreStr += `(${tbWinner})`;
      }
      return scoreStr;
    })
    .join(', ');
}

/**
 * Create a new match record
 */
export function createMatch(
  player1: User,
  player2: User,
  score: MatchScore,
  location: Match['location'],
  surface?: Match['surface'],
  notes?: string
): Match {
  const now = new Date();

  // Validate score
  const validation = validateMatchScore(score.sets);
  if (!validation.valid) {
    throw new Error(`Invalid match score: ${validation.error}`);
  }

  // Determine winner
  const winnerId = determineWinner(score.sets, player1.id, player2.id);

  // Calculate Elo changes
  const winnerElo = player1.id === winnerId ? player1.stats!.elo : player2.stats!.elo;
  const loserElo = player1.id === winnerId ? player2.stats!.elo : player1.stats!.elo;
  const winnerMatches =
    player1.id === winnerId
      ? player1.stats!.matchesPlayed
      : player2.stats!.matchesPlayed;
  const loserMatches =
    player1.id === winnerId
      ? player2.stats!.matchesPlayed
      : player1.stats!.matchesPlayed;

  const eloResult = calculateEloChange(
    winnerElo,
    loserElo,
    winnerMatches,
    loserMatches
  );

  const eloChanges = {
    player1Change: player1.id === winnerId ? eloResult.winner.change : eloResult.loser.change,
    player2Change: player2.id === winnerId ? eloResult.winner.change : eloResult.loser.change,
    player1NewElo: validateElo(
      player1.id === winnerId ? eloResult.winner.newElo : eloResult.loser.newElo
    ),
    player2NewElo: validateElo(
      player2.id === winnerId ? eloResult.winner.newElo : eloResult.loser.newElo
    ),
  };

  const match: Match = {
    id: `match-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    player1Id: player1.id,
    player2Id: player2.id,
    status: 'completed',
    completedDate: now,
    location,
    surface,
    score: { ...score, winnerId },
    eloChanges,
    notes,
    createdAt: now,
    updatedAt: now,
  };

  return match;
}

/**
 * Filter matches based on criteria
 */
export function filterMatches(
  matches: Match[],
  filters: MatchFilters
): Match[] {
  return matches.filter((match) => {
    // Filter by player
    if (
      filters.playerId &&
      match.player1Id !== filters.playerId &&
      match.player2Id !== filters.playerId
    ) {
      return false;
    }

    // Filter by status
    if (filters.status && match.status !== filters.status) {
      return false;
    }

    // Filter by surface
    if (filters.surface && match.surface !== filters.surface) {
      return false;
    }

    // Filter by date range
    if (filters.dateFrom && match.completedDate) {
      if (match.completedDate < filters.dateFrom) {
        return false;
      }
    }

    if (filters.dateTo && match.completedDate) {
      if (match.completedDate > filters.dateTo) {
        return false;
      }
    }

    // Filter by result (won/lost)
    if (filters.result && filters.result !== 'all' && filters.playerId) {
      if (!match.score) return false;

      const isWinner = match.score.winnerId === filters.playerId;
      if (filters.result === 'won' && !isWinner) return false;
      if (filters.result === 'lost' && isWinner) return false;
    }

    return true;
  });
}

/**
 * Calculate comprehensive match statistics for a player
 */
export function calculateMatchStatistics(
  matches: Match[],
  playerId: string
): MatchStatistics {
  const playerMatches = matches.filter(
    (m) =>
      (m.player1Id === playerId || m.player2Id === playerId) &&
      m.status === 'completed' &&
      m.score
  );

  if (playerMatches.length === 0) {
    return {
      totalMatches: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      averageEloChange: 0,
      bySurface: {
        hard: { wins: 0, losses: 0, winRate: 0 },
        clay: { wins: 0, losses: 0, winRate: 0 },
        grass: { wins: 0, losses: 0, winRate: 0 },
        carpet: { wins: 0, losses: 0, winRate: 0 },
      },
      recentForm: [],
      longestWinStreak: 0,
      longestLossStreak: 0,
      currentStreak: 0,
      streakType: 'none',
    };
  }

  let wins = 0;
  let losses = 0;
  let totalEloChange = 0;

  const surfaceStats = {
    hard: { wins: 0, losses: 0 },
    clay: { wins: 0, losses: 0 },
    grass: { wins: 0, losses: 0 },
    carpet: { wins: 0, losses: 0 },
  };

  const results: Array<'W' | 'L'> = [];

  // Sort matches by date (newest first for stats)
  const sortedMatches = [...playerMatches].sort(
    (a, b) =>
      (b.completedDate?.getTime() || 0) - (a.completedDate?.getTime() || 0)
  );

  sortedMatches.forEach((match) => {
    const isWinner = match.score!.winnerId === playerId;
    const result = isWinner ? 'W' : 'L';

    if (isWinner) {
      wins++;
    } else {
      losses++;
    }

    results.push(result);

    // Surface-specific stats
    if (match.surface) {
      if (isWinner) {
        surfaceStats[match.surface].wins++;
      } else {
        surfaceStats[match.surface].losses++;
      }
    }

    // Elo change
    if (match.eloChanges) {
      const eloChange =
        match.player1Id === playerId
          ? match.eloChanges.player1Change
          : match.eloChanges.player2Change;
      totalEloChange += eloChange;
    }
  });

  // Calculate win rate
  const winRate = playerMatches.length > 0 ? (wins / playerMatches.length) * 100 : 0;
  const averageEloChange =
    playerMatches.length > 0 ? totalEloChange / playerMatches.length : 0;

  // Calculate surface-specific win rates
  const bySurface = {
    hard: {
      ...surfaceStats.hard,
      winRate:
        surfaceStats.hard.wins + surfaceStats.hard.losses > 0
          ? (surfaceStats.hard.wins /
              (surfaceStats.hard.wins + surfaceStats.hard.losses)) *
            100
          : 0,
    },
    clay: {
      ...surfaceStats.clay,
      winRate:
        surfaceStats.clay.wins + surfaceStats.clay.losses > 0
          ? (surfaceStats.clay.wins /
              (surfaceStats.clay.wins + surfaceStats.clay.losses)) *
            100
          : 0,
    },
    grass: {
      ...surfaceStats.grass,
      winRate:
        surfaceStats.grass.wins + surfaceStats.grass.losses > 0
          ? (surfaceStats.grass.wins /
              (surfaceStats.grass.wins + surfaceStats.grass.losses)) *
            100
          : 0,
    },
    carpet: {
      ...surfaceStats.carpet,
      winRate:
        surfaceStats.carpet.wins + surfaceStats.carpet.losses > 0
          ? (surfaceStats.carpet.wins /
              (surfaceStats.carpet.wins + surfaceStats.carpet.losses)) *
            100
          : 0,
    },
  };

  // Calculate streaks
  let longestWinStreak = 0;
  let longestLossStreak = 0;
  let currentStreak = 0;
  let currentStreakType: 'win' | 'loss' | 'none' = 'none';

  let tempWinStreak = 0;
  let tempLossStreak = 0;

  // Reverse to calculate from oldest to newest for streaks
  [...results].reverse().forEach((result, index) => {
    if (result === 'W') {
      tempWinStreak++;
      tempLossStreak = 0;
      if (tempWinStreak > longestWinStreak) {
        longestWinStreak = tempWinStreak;
      }
    } else {
      tempLossStreak++;
      tempWinStreak = 0;
      if (tempLossStreak > longestLossStreak) {
        longestLossStreak = tempLossStreak;
      }
    }

    // Current streak is the last continuous run
    if (index === results.length - 1) {
      if (tempWinStreak > 0) {
        currentStreak = tempWinStreak;
        currentStreakType = 'win';
      } else if (tempLossStreak > 0) {
        currentStreak = tempLossStreak;
        currentStreakType = 'loss';
      }
    }
  });

  // Recent form (last 10 matches)
  const recentForm = results.slice(0, 10);

  return {
    totalMatches: playerMatches.length,
    wins,
    losses,
    winRate: Math.round(winRate * 10) / 10,
    averageEloChange: Math.round(averageEloChange * 10) / 10,
    bySurface,
    recentForm,
    longestWinStreak,
    longestLossStreak,
    currentStreak,
    streakType: currentStreakType,
  };
}

/**
 * Sort matches by various criteria
 */
export function sortMatches(
  matches: Match[],
  sortBy: 'date' | 'location' | 'surface',
  order: 'asc' | 'desc' = 'desc'
): Match[] {
  const sorted = [...matches].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        const dateA = a.completedDate?.getTime() || a.createdAt.getTime();
        const dateB = b.completedDate?.getTime() || b.createdAt.getTime();
        comparison = dateA - dateB;
        break;

      case 'location':
        comparison = a.location.city.localeCompare(b.location.city);
        break;

      case 'surface':
        const surfaceA = a.surface || 'hard';
        const surfaceB = b.surface || 'hard';
        comparison = surfaceA.localeCompare(surfaceB);
        break;
    }

    return order === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

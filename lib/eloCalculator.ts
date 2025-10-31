/**
 * Elo Rating System Implementation
 * Based on simplified chess Elo formula with adaptive K-factor
 *
 * Formula: NewRating = OldRating + K * (ActualScore - ExpectedScore)
 * Where:
 * - K is the K-factor (determines rating volatility)
 * - ActualScore is 1 for win, 0 for loss
 * - ExpectedScore is calculated probability of winning
 */

export type EloResult = {
  winner: {
    oldElo: number;
    newElo: number;
    change: number;
  };
  loser: {
    oldElo: number;
    newElo: number;
    change: number;
  };
};

/**
 * Calculate K-factor based on player rating and experience
 * Higher K-factor = more volatile ratings (for new/learning players)
 * Lower K-factor = more stable ratings (for established players)
 */
function getKFactor(elo: number, matchesPlayed: number): number {
  // New players (< 30 matches): Higher volatility
  if (matchesPlayed < 30) {
    return 40;
  }

  // Below 2100: Standard volatility
  if (elo < 2100) {
    return 32;
  }

  // Above 2400: Lower volatility for top players
  if (elo >= 2400) {
    return 16;
  }

  // 2100-2400: Medium volatility
  return 24;
}

/**
 * Calculate expected score (probability of winning)
 * Using standard chess Elo formula: E = 1 / (1 + 10^((Rb - Ra) / 400))
 * Where Ra is player's rating, Rb is opponent's rating
 */
function calculateExpectedScore(playerElo: number, opponentElo: number): number {
  return 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
}

/**
 * Calculate new Elo ratings after a match
 *
 * @param winnerElo - Current Elo rating of the winner
 * @param loserElo - Current Elo rating of the loser
 * @param winnerMatches - Total matches played by winner (for K-factor)
 * @param loserMatches - Total matches played by loser (for K-factor)
 * @returns Object containing old/new Elo and changes for both players
 */
export function calculateEloChange(
  winnerElo: number,
  loserElo: number,
  winnerMatches: number = 0,
  loserMatches: number = 0
): EloResult {
  // Calculate K-factors for both players
  const winnerKFactor = getKFactor(winnerElo, winnerMatches);
  const loserKFactor = getKFactor(loserElo, loserMatches);

  // Calculate expected scores
  const winnerExpected = calculateExpectedScore(winnerElo, loserElo);
  const loserExpected = calculateExpectedScore(loserElo, winnerElo);

  // Calculate rating changes
  // Winner: actualScore = 1, loser: actualScore = 0
  const winnerChange = Math.round(winnerKFactor * (1 - winnerExpected));
  const loserChange = Math.round(loserKFactor * (0 - loserExpected));

  // Calculate new ratings
  const winnerNewElo = winnerElo + winnerChange;
  const loserNewElo = loserElo + loserChange;

  return {
    winner: {
      oldElo: winnerElo,
      newElo: winnerNewElo,
      change: winnerChange,
    },
    loser: {
      oldElo: loserElo,
      newElo: loserNewElo,
      change: loserChange,
    },
  };
}

/**
 * Calculate win probability between two players
 * Useful for match prediction and display
 *
 * @param playerElo - Player's current Elo
 * @param opponentElo - Opponent's current Elo
 * @returns Probability of player winning (0-1)
 */
export function calculateWinProbability(
  playerElo: number,
  opponentElo: number
): number {
  return calculateExpectedScore(playerElo, opponentElo);
}

/**
 * Get human-readable description of Elo rating
 */
export function getEloDescription(elo: number): string {
  if (elo >= 2400) return 'Elite Professional';
  if (elo >= 2200) return 'Professional';
  if (elo >= 2000) return 'Expert';
  if (elo >= 1800) return 'Advanced';
  if (elo >= 1600) return 'Intermediate+';
  if (elo >= 1400) return 'Intermediate';
  if (elo >= 1200) return 'Beginner+';
  if (elo >= 1000) return 'Beginner';
  return 'Novice';
}

/**
 * Calculate rating difference in descriptive terms
 */
export function getEloDifferenceDescription(difference: number): string {
  const absDiff = Math.abs(difference);

  if (absDiff < 50) return 'Evenly matched';
  if (absDiff < 100) return 'Slight advantage';
  if (absDiff < 200) return 'Clear advantage';
  if (absDiff < 300) return 'Strong advantage';
  return 'Overwhelming advantage';
}

/**
 * Validate Elo rating is within acceptable bounds
 * Prevents rating inflation/deflation edge cases
 */
export function validateElo(elo: number): number {
  const MIN_ELO = 100;
  const MAX_ELO = 3000;

  if (elo < MIN_ELO) return MIN_ELO;
  if (elo > MAX_ELO) return MAX_ELO;
  return Math.round(elo);
}

/**
 * Calculate expected point differential based on Elo difference
 * Useful for match prediction visualization
 */
export function calculateExpectedPointDifferential(eloDifference: number): string {
  const absDiff = Math.abs(eloDifference);

  if (absDiff < 50) return '±1-2 games per set';
  if (absDiff < 100) return '±2-3 games per set';
  if (absDiff < 200) return '±3-4 games per set';
  if (absDiff < 300) return '±4-5 games per set';
  return '±5+ games per set';
}

/**
 * Get color class for Elo change display
 */
export function getEloChangeColor(change: number): string {
  if (change > 0) return 'text-green-600';
  if (change < 0) return 'text-red-600';
  return 'text-gray-600';
}

/**
 * Format Elo change with sign for display
 */
export function formatEloChange(change: number): string {
  if (change > 0) return `+${change}`;
  return `${change}`;
}

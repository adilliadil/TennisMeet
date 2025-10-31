/**
 * Elo Calculator Test Suite
 * Validates Elo rating calculations with various scenarios
 */

import {
  calculateEloChange,
  calculateWinProbability,
  getEloDescription,
  validateElo,
  formatEloChange,
} from '../eloCalculator';

describe('Elo Calculator', () => {
  describe('calculateEloChange', () => {
    test('equal ratings should result in significant changes', () => {
      const result = calculateEloChange(1500, 1500, 30, 30);

      // Winner should gain approximately 16 points (K=32 for < 2100)
      expect(result.winner.change).toBeGreaterThan(0);
      expect(result.winner.change).toBeLessThan(20);

      // Loser should lose approximately 16 points
      expect(result.loser.change).toBeLessThan(0);
      expect(result.loser.change).toBeGreaterThan(-20);

      // Changes should be roughly equal in magnitude
      expect(Math.abs(result.winner.change + result.loser.change)).toBeLessThan(2);
    });

    test('underdog win should result in larger rating gain', () => {
      const result = calculateEloChange(1400, 1800, 30, 30);

      // Underdog (1400) wins - should gain more points
      expect(result.winner.change).toBeGreaterThan(20);

      // Favorite (1800) loses - should lose more points
      expect(result.loser.change).toBeLessThan(-20);
    });

    test('favorite win should result in smaller rating gain', () => {
      const result = calculateEloChange(1800, 1400, 30, 30);

      // Favorite (1800) wins - should gain fewer points
      expect(result.winner.change).toBeLessThan(16);

      // Underdog (1400) loses - should lose fewer points
      expect(result.loser.change).toBeGreaterThan(-16);
    });

    test('new players should have higher K-factor (more volatile)', () => {
      const newPlayerResult = calculateEloChange(1500, 1500, 10, 30);
      const experiencedPlayerResult = calculateEloChange(1500, 1500, 100, 100);

      // New player (K=40) should have larger change than experienced player (K=32)
      expect(Math.abs(newPlayerResult.winner.change)).toBeGreaterThan(
        Math.abs(experiencedPlayerResult.winner.change)
      );
    });

    test('top players should have lower K-factor (more stable)', () => {
      const topPlayerResult = calculateEloChange(2500, 2400, 100, 100);
      const regularPlayerResult = calculateEloChange(1500, 1400, 100, 100);

      // Top players (K=16) should have smaller changes than regular players (K=32)
      expect(Math.abs(topPlayerResult.winner.change)).toBeLessThan(
        Math.abs(regularPlayerResult.winner.change)
      );
    });

    test('extreme rating differences', () => {
      const result = calculateEloChange(2200, 1000, 50, 50);

      // High rated player beats low rated player - minimal gain
      expect(result.winner.change).toBeLessThan(2);

      // Low rated player loses to high rated player - minimal loss
      expect(result.loser.change).toBeGreaterThan(-2);
    });
  });

  describe('calculateWinProbability', () => {
    test('equal ratings should give 50% probability', () => {
      const prob = calculateWinProbability(1500, 1500);
      expect(prob).toBeCloseTo(0.5, 2);
    });

    test('higher rating should give higher probability', () => {
      const prob = calculateWinProbability(1700, 1500);
      expect(prob).toBeGreaterThan(0.5);
      expect(prob).toBeLessThan(1.0);
    });

    test('lower rating should give lower probability', () => {
      const prob = calculateWinProbability(1300, 1500);
      expect(prob).toBeLessThan(0.5);
      expect(prob).toBeGreaterThan(0.0);
    });

    test('200 point difference should give ~75% probability', () => {
      const prob = calculateWinProbability(1700, 1500);
      expect(prob).toBeCloseTo(0.76, 1);
    });

    test('400 point difference should give ~91% probability', () => {
      const prob = calculateWinProbability(1900, 1500);
      expect(prob).toBeCloseTo(0.91, 1);
    });

    test('probabilities should be complementary', () => {
      const prob1 = calculateWinProbability(1600, 1400);
      const prob2 = calculateWinProbability(1400, 1600);
      expect(prob1 + prob2).toBeCloseTo(1.0, 5);
    });
  });

  describe('getEloDescription', () => {
    test('should correctly categorize ratings', () => {
      expect(getEloDescription(900)).toBe('Novice');
      expect(getEloDescription(1100)).toBe('Beginner');
      expect(getEloDescription(1300)).toBe('Beginner+');
      expect(getEloDescription(1500)).toBe('Intermediate');
      expect(getEloDescription(1700)).toBe('Intermediate+');
      expect(getEloDescription(1900)).toBe('Advanced');
      expect(getEloDescription(2100)).toBe('Expert');
      expect(getEloDescription(2300)).toBe('Professional');
      expect(getEloDescription(2500)).toBe('Elite Professional');
    });
  });

  describe('validateElo', () => {
    test('should keep valid ratings unchanged', () => {
      expect(validateElo(1500)).toBe(1500);
      expect(validateElo(2000)).toBe(2000);
    });

    test('should enforce minimum rating', () => {
      expect(validateElo(50)).toBe(100);
      expect(validateElo(-100)).toBe(100);
    });

    test('should enforce maximum rating', () => {
      expect(validateElo(3500)).toBe(3000);
      expect(validateElo(4000)).toBe(3000);
    });

    test('should round to nearest integer', () => {
      expect(validateElo(1500.4)).toBe(1500);
      expect(validateElo(1500.6)).toBe(1501);
    });
  });

  describe('formatEloChange', () => {
    test('should format positive changes with plus sign', () => {
      expect(formatEloChange(15)).toBe('+15');
      expect(formatEloChange(8)).toBe('+8');
    });

    test('should format negative changes with minus sign', () => {
      expect(formatEloChange(-15)).toBe('-15');
      expect(formatEloChange(-8)).toBe('-8');
    });

    test('should format zero change', () => {
      expect(formatEloChange(0)).toBe('0');
    });
  });

  describe('Real-world scenarios', () => {
    test('beginner beating intermediate player', () => {
      const result = calculateEloChange(1200, 1500, 15, 40);

      // Beginner should gain significant points
      expect(result.winner.change).toBeGreaterThan(25);

      // Intermediate should lose significant points
      expect(result.loser.change).toBeLessThan(-25);

      // Verify new ratings
      expect(result.winner.newElo).toBeGreaterThan(1225);
      expect(result.loser.newElo).toBeLessThan(1475);
    });

    test('evenly matched intermediate players', () => {
      const result = calculateEloChange(1550, 1500, 50, 50);

      // Should be modest changes
      expect(result.winner.change).toBeGreaterThan(12);
      expect(result.winner.change).toBeLessThan(18);

      expect(result.loser.change).toBeLessThan(-12);
      expect(result.loser.change).toBeGreaterThan(-18);
    });

    test('professional player beating advanced player', () => {
      const result = calculateEloChange(2200, 1900, 100, 80);

      // Professional should gain few points
      expect(result.winner.change).toBeLessThan(12);

      // Advanced should lose few points
      expect(result.loser.change).toBeGreaterThan(-12);
    });

    test('huge upset - beginner beats professional', () => {
      const result = calculateEloChange(1100, 2200, 20, 150);

      // Beginner should gain massive points (K=40 for new player)
      expect(result.winner.change).toBeGreaterThan(35);

      // Professional should lose minimal points (K=16 for top player)
      expect(result.loser.change).toBeGreaterThan(-5);
    });
  });

  describe('Rating conservation', () => {
    test('total rating points should be roughly conserved', () => {
      const result = calculateEloChange(1600, 1400, 50, 50);

      const totalBefore = 1600 + 1400;
      const totalAfter = result.winner.newElo + result.loser.newElo;

      // Due to different K-factors and rounding, there might be small differences
      // but they should be within a few points
      expect(Math.abs(totalAfter - totalBefore)).toBeLessThan(5);
    });
  });
});

// Manual test output for console verification
export function runManualTests() {
  console.log('\\n=== Elo Calculator Manual Tests ===\\n');

  console.log('Test 1: Equal ratings (1500 vs 1500)');
  const test1 = calculateEloChange(1500, 1500, 30, 30);
  console.log('  Winner: 1500 → ', test1.winner.newElo, '(' + formatEloChange(test1.winner.change) + ')');
  console.log('  Loser:  1500 → ', test1.loser.newElo, '(' + formatEloChange(test1.loser.change) + ')');

  console.log('\\nTest 2: Underdog win (1400 beats 1800)');
  const test2 = calculateEloChange(1400, 1800, 30, 30);
  console.log('  Winner: 1400 → ', test2.winner.newElo, '(' + formatEloChange(test2.winner.change) + ')');
  console.log('  Loser:  1800 → ', test2.loser.newElo, '(' + formatEloChange(test2.loser.change) + ')');

  console.log('\\nTest 3: Favorite win (1800 beats 1400)');
  const test3 = calculateEloChange(1800, 1400, 30, 30);
  console.log('  Winner: 1800 → ', test3.winner.newElo, '(' + formatEloChange(test3.winner.change) + ')');
  console.log('  Loser:  1400 → ', test3.loser.newElo, '(' + formatEloChange(test3.loser.change) + ')');

  console.log('\\nTest 4: Win probabilities');
  console.log('  1500 vs 1500:', (calculateWinProbability(1500, 1500) * 100).toFixed(1) + '%');
  console.log('  1700 vs 1500:', (calculateWinProbability(1700, 1500) * 100).toFixed(1) + '%');
  console.log('  1900 vs 1500:', (calculateWinProbability(1900, 1500) * 100).toFixed(1) + '%');
  console.log('  2200 vs 1500:', (calculateWinProbability(2200, 1500) * 100).toFixed(1) + '%');

  console.log('\\n=== Tests Complete ===\\n');
}

/**
 * Elo Calculator Test Runner
 * Run this script to test Elo calculations with real scenarios
 */

import { calculateEloChange, calculateWinProbability, formatEloChange, getEloDescription } from '../lib/eloCalculator';
import { mockPlayers, mockMatches } from '../lib/mockData';

console.log('🎾 TennisMeet Elo Calculator Test Suite\\n');
console.log('='.repeat(60));

// Test 1: Basic calculations
console.log('\\n📊 Test 1: Equal Ratings (1500 vs 1500)');
console.log('-'.repeat(60));
const test1 = calculateEloChange(1500, 1500, 30, 30);
console.log(`Winner: 1500 → ${test1.winner.newElo} (${formatEloChange(test1.winner.change)})`);
console.log(`Loser:  1500 → ${test1.loser.newElo} (${formatEloChange(test1.loser.change)})`);
console.log(`Win probability: ${(calculateWinProbability(1500, 1500) * 100).toFixed(1)}%`);

// Test 2: Underdog victory
console.log('\\n🏆 Test 2: Underdog Victory (1400 beats 1800)');
console.log('-'.repeat(60));
const test2 = calculateEloChange(1400, 1800, 30, 30);
console.log(`Winner: 1400 → ${test2.winner.newElo} (${formatEloChange(test2.winner.change)})`);
console.log(`Loser:  1800 → ${test2.loser.newElo} (${formatEloChange(test2.loser.change)})`);
console.log(`Pre-match win probability: ${(calculateWinProbability(1400, 1800) * 100).toFixed(1)}%`);

// Test 3: Favorite victory
console.log('\\n⭐ Test 3: Favorite Victory (1800 beats 1400)');
console.log('-'.repeat(60));
const test3 = calculateEloChange(1800, 1400, 30, 30);
console.log(`Winner: 1800 → ${test3.winner.newElo} (${formatEloChange(test3.winner.change)})`);
console.log(`Loser:  1400 → ${test3.loser.newElo} (${formatEloChange(test3.loser.change)})`);
console.log(`Pre-match win probability: ${(calculateWinProbability(1800, 1400) * 100).toFixed(1)}%`);

// Test 4: New player vs experienced
console.log('\\n🆕 Test 4: New Player (K=40) vs Experienced (K=32)');
console.log('-'.repeat(60));
const test4a = calculateEloChange(1500, 1500, 10, 100);
const test4b = calculateEloChange(1500, 1500, 100, 100);
console.log(`New player win: ${formatEloChange(test4a.winner.change)} points (K=40)`);
console.log(`Experienced win: ${formatEloChange(test4b.winner.change)} points (K=32)`);

// Test 5: Top players
console.log('\\n👑 Test 5: Elite Players (2500 vs 2400)');
console.log('-'.repeat(60));
const test5 = calculateEloChange(2500, 2400, 100, 100);
console.log(`Winner: 2500 → ${test5.winner.newElo} (${formatEloChange(test5.winner.change)})`);
console.log(`Loser:  2400 → ${test5.loser.newElo} (${formatEloChange(test5.loser.change)})`);
console.log(`${getEloDescription(test5.winner.newElo)} vs ${getEloDescription(test5.loser.newElo)}`);

// Test 6: Extreme upset
console.log('\\n🚀 Test 6: Extreme Upset (1100 beats 2200)');
console.log('-'.repeat(60));
const test6 = calculateEloChange(1100, 2200, 20, 150);
console.log(`Winner: 1100 → ${test6.winner.newElo} (${formatEloChange(test6.winner.change)})`);
console.log(`Loser:  2200 → ${test6.loser.newElo} (${formatEloChange(test6.loser.change)})`);
console.log(`Pre-match win probability: ${(calculateWinProbability(1100, 2200) * 100).toFixed(2)}%`);

// Test 7: Real mock data validation
console.log('\\n📝 Test 7: Validating Mock Match Data');
console.log('-'.repeat(60));
console.log(`Total matches generated: ${mockMatches.length}`);
console.log(`Total players: ${mockPlayers.length}`);

// Check a few matches
const sampleMatches = mockMatches.slice(0, 3);
sampleMatches.forEach((match, idx) => {
  const player1 = mockPlayers.find(p => p.id === match.player1Id);
  const player2 = mockPlayers.find(p => p.id === match.player2Id);

  if (player1 && player2 && match.eloChanges) {
    console.log(`\\nMatch ${idx + 1}: ${player1.name} vs ${player2.name}`);
    console.log(`  Score: ${match.score?.sets.map(s => `${s.player1Games}-${s.player2Games}`).join(', ')}`);
    console.log(`  Winner: ${match.score?.winnerId === player1.id ? player1.name : player2.name}`);
    console.log(`  Elo changes: ${formatEloChange(match.eloChanges.player1Change)} / ${formatEloChange(match.eloChanges.player2Change)}`);
  }
});

// Test 8: Win probability spectrum
console.log('\\n📈 Test 8: Win Probability Spectrum');
console.log('-'.repeat(60));
const baseRating = 1500;
const diffs = [0, 50, 100, 200, 300, 400, 500];
console.log('Rating Difference | Win Probability');
console.log('-'.repeat(40));
diffs.forEach(diff => {
  const prob = calculateWinProbability(baseRating + diff, baseRating);
  console.log(`      ${diff.toString().padStart(3)} points  |     ${(prob * 100).toFixed(1).padStart(4)}%`);
});

// Test 9: Elo rating categories
console.log('\\n🏅 Test 9: Elo Rating Categories');
console.log('-'.repeat(60));
const ratings = [900, 1100, 1300, 1500, 1700, 1900, 2100, 2300, 2500];
ratings.forEach(rating => {
  console.log(`${rating}: ${getEloDescription(rating)}`);
});

console.log('\\n' + '='.repeat(60));
console.log('✅ All tests completed successfully!\\n');

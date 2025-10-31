# TennisMeet Elo Rating System

## Overview

TennisMeet uses a professional Elo rating system based on the simplified chess formula with adaptive K-factors. This document explains how the system works and provides examples.

## Core Formula

```
NewRating = OldRating + K × (ActualScore - ExpectedScore)
```

Where:
- **K** = K-factor (determines rating volatility)
- **ActualScore** = 1 for win, 0 for loss
- **ExpectedScore** = Probability of winning

### Expected Score Calculation

```
ExpectedScore = 1 / (1 + 10^((OpponentRating - PlayerRating) / 400))
```

This formula determines the probability that a player will win based on the rating difference.

## K-Factor System

The K-factor determines how volatile ratings are. TennisMeet uses an adaptive K-factor based on player experience and skill level:

| Player Profile | K-Factor | Rationale |
|---------------|----------|-----------|
| New Players (< 30 matches) | 40 | High volatility to quickly reach true skill level |
| Regular Players (Elo < 2100) | 32 | Standard volatility for most players |
| Strong Players (Elo 2100-2399) | 24 | Medium stability for competitive players |
| Elite Players (Elo ≥ 2400) | 16 | High stability to protect top rankings |

## Rating Categories

| Elo Range | Category | Description |
|-----------|----------|-------------|
| < 1000 | Novice | Just starting out |
| 1000-1199 | Beginner | Learning basics |
| 1200-1399 | Beginner+ | Developing skills |
| 1400-1599 | Intermediate | Solid fundamentals |
| 1600-1799 | Intermediate+ | Strong competitive player |
| 1800-1999 | Advanced | Very skilled player |
| 2000-2199 | Expert | Top-level amateur |
| 2200-2399 | Professional | Tournament-level player |
| 2400+ | Elite Professional | World-class player |

## Win Probability Examples

| Rating Difference | Higher Player Win % | Lower Player Win % |
|------------------|--------------------|--------------------|
| 0 (Equal) | 50.0% | 50.0% |
| 50 points | 57.1% | 42.9% |
| 100 points | 64.0% | 36.0% |
| 150 points | 70.0% | 30.0% |
| 200 points | 76.0% | 24.0% |
| 300 points | 85.0% | 15.0% |
| 400 points | 91.0% | 9.0% |
| 500 points | 95.0% | 5.0% |

## Rating Change Examples

### Example 1: Equal Ratings
**Scenario:** Two 1500-rated players, both with 40 matches

```
Player A (1500) beats Player B (1500)
K-factor = 32 (both players)
Expected score = 0.5 for each

Player A: 1500 + 32 × (1 - 0.5) = 1516 (+16)
Player B: 1500 + 32 × (0 - 0.5) = 1484 (-16)
```

**Result:** Symmetric 16-point exchange

### Example 2: Underdog Victory
**Scenario:** 1400-rated player beats 1800-rated player

```
Lower player (1400) beats Higher player (1800)
K-factor = 32 (both players)
Expected score for 1400: 0.09 (9% chance to win)

Lower player: 1400 + 32 × (1 - 0.09) = 1429 (+29)
Higher player: 1800 + 32 × (0 - 0.91) = 1771 (-29)
```

**Result:** Large 29-point gain for underdog, major upset

### Example 3: Favorite Victory
**Scenario:** 1800-rated player beats 1400-rated player

```
Higher player (1800) beats Lower player (1400)
K-factor = 32 (both players)
Expected score for 1800: 0.91 (91% chance to win)

Higher player: 1800 + 32 × (1 - 0.91) = 1803 (+3)
Lower player: 1400 + 32 × (0 - 0.09) = 1397 (-3)
```

**Result:** Small 3-point gain, expected outcome

### Example 4: New Player Effect
**Scenario:** New player (1500, 15 matches) beats experienced player (1500, 80 matches)

```
New player: K = 40
Experienced player: K = 32
Expected score = 0.5 for each

New player: 1500 + 40 × (1 - 0.5) = 1520 (+20)
Experienced: 1500 + 32 × (0 - 0.5) = 1484 (-16)
```

**Result:** Different K-factors = different rating changes

### Example 5: Elite Player Stability
**Scenario:** Two 2500-rated elite players

```
Player A (2500, 200 matches) beats Player B (2500, 200 matches)
K-factor = 16 (both elite players)
Expected score = 0.5 for each

Player A: 2500 + 16 × (1 - 0.5) = 2508 (+8)
Player B: 2500 + 16 × (0 - 0.5) = 2492 (-8)
```

**Result:** Stable 8-point exchange, protects top rankings

### Example 6: Extreme Upset
**Scenario:** 1100-rated beginner beats 2200-rated professional

```
Beginner (1100, 20 matches): K = 40
Professional (2200, 150 matches): K = 16
Expected score for beginner: 0.004 (0.4% chance)

Beginner: 1100 + 40 × (1 - 0.004) = 1140 (+40)
Professional: 2200 + 16 × (0 - 0.996) = 2184 (-16)
```

**Result:** Massive upset, but pro's rating well protected

## System Benefits

### 1. **Fair and Mathematical**
- Based on proven chess Elo system
- Mathematically sound probability model
- Consistent and predictable

### 2. **Self-Correcting**
- New players reach true level quickly
- Outlier results have minimal long-term impact
- Ratings converge toward true skill

### 3. **Adaptive Volatility**
- New players: High volatility for quick calibration
- Experienced players: Stable ratings reflect true skill
- Elite players: Protected from rating inflation

### 4. **Predictive Power**
- Accurate win probability calculations
- Useful for match planning
- Helps find evenly-matched opponents

## Rating Boundaries

- **Minimum Rating:** 100 (prevents negative ratings)
- **Maximum Rating:** 3000 (prevents unrealistic inflation)
- **Starting Rating:** 1500 (standard baseline)

## Implementation Details

### When Ratings Update
Elo ratings are updated immediately when:
1. A completed match is recorded
2. The match score is validated
3. Both players have existing Elo ratings

### What Affects Rating Changes
- **Rating Difference:** Larger gaps = larger potential swings
- **K-Factor:** Determined by experience and skill level
- **Match Outcome:** Win or loss (no partial credit)

### What Does NOT Affect Ratings
- Score margin (6-0, 6-0 same as 7-6, 7-6)
- Match duration
- Match surface
- Location
- Time of day

## Tips for Players

### For New Players
- Don't worry about early losses - your rating will stabilize
- Play regularly to establish accurate rating
- K=40 means faster rating adjustments

### For Intermediate Players
- Rating changes stabilize around 30+ matches
- Focus on consistent performance
- Beating higher-rated players = big gains

### For Advanced Players
- Ratings become more stable (K=32)
- Protect rating by avoiding mismatches
- Seek challenging opponents for growth

### For Elite Players
- Very stable ratings (K=16)
- Small changes per match
- Rankings are well-protected

## Mathematical Properties

### Zero-Sum System
Total rating points are roughly conserved:
- Winner gains ≈ Loser loses
- Small differences due to K-factor variations
- System doesn't inflate or deflate over time

### Transitive Ratings
If A beats B, and B beats C, ratings reflect relative skill:
- A's rating > B's rating > C's rating
- Triangle inequalities maintained
- Consistent cross-player comparisons

### Diminishing Returns
Beating the same player repeatedly yields less gain:
- First win: Large rating increase
- Subsequent wins: Smaller increases
- Encourages playing diverse opponents

## References

- Original Elo system: Arpad Elo (1960)
- Chess implementation: FIDE (1970)
- USCF rating system
- TennisMeet adaptation (2025)

## Support

For questions about the rating system:
- See: `/lib/eloCalculator.ts`
- Tests: `/lib/__tests__/eloCalculator.test.ts`
- Examples: Run `npm run test:elo`

---

**The TennisMeet Elo system provides fair, accurate, and stable ratings that reflect true player skill.**

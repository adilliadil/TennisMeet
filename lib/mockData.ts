import { User, MatchHistoryEntry, Match, MatchSet, TimeBlock } from '@/types';
import { createMatch } from './matchManager';

// San Francisco Bay Area locations for realistic mock data
const bayAreaLocations = [
  { city: 'San Francisco', state: 'CA', lat: 37.7749, lng: -122.4194 },
  { city: 'Oakland', state: 'CA', lat: 37.8044, lng: -122.2712 },
  { city: 'San Jose', state: 'CA', lat: 37.3382, lng: -121.8863 },
  { city: 'Berkeley', state: 'CA', lat: 37.8715, lng: -122.2730 },
  { city: 'Palo Alto', state: 'CA', lat: 37.4419, lng: -122.1430 },
  { city: 'Mountain View', state: 'CA', lat: 37.3861, lng: -122.0839 },
  { city: 'Sunnyvale', state: 'CA', lat: 37.3688, lng: -122.0363 },
  { city: 'Fremont', state: 'CA', lat: 37.5483, lng: -121.9886 },
  { city: 'Hayward', state: 'CA', lat: 37.6688, lng: -122.0808 },
  { city: 'Santa Clara', state: 'CA', lat: 37.3541, lng: -121.9552 },
];

// Generate realistic match history
const generateMatchHistory = (playerId: string, wins: number, losses: number): MatchHistoryEntry[] => {
  const history: MatchHistoryEntry[] = [];
  const totalMatches = wins + losses;
  const results: ('won' | 'lost')[] = [
    ...Array(wins).fill('won'),
    ...Array(losses).fill('lost'),
  ];

  // Shuffle results for realistic pattern
  for (let i = results.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = results[i]!;
    results[i] = results[j]!;
    results[j] = temp;
  }

  const opponentNames = [
    'Alex Chen', 'Maria Rodriguez', 'David Kim', 'Sarah Johnson',
    'Michael Brown', 'Emily Davis', 'James Wilson', 'Lisa Anderson',
    'Robert Taylor', 'Jennifer Martinez', 'Chris Lee', 'Amanda White',
  ];

  for (let i = 0; i < Math.min(totalMatches, 10); i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    const result = results[i]!;
    const score = result === 'won'
      ? ['6-4, 6-3', '7-5, 6-4', '6-2, 6-3', '7-6, 6-4', '6-3, 6-2'][Math.floor(Math.random() * 5)]!
      : ['4-6, 3-6', '5-7, 4-6', '2-6, 3-6', '6-7, 4-6', '3-6, 2-6'][Math.floor(Math.random() * 5)]!;

    history.push({
      id: `match-${playerId}-${i}`,
      date,
      opponent: {
        id: `opponent-${i}`,
        name: opponentNames[i % opponentNames.length]!,
        profileImage: `https://i.pravatar.cc/150?u=opponent${i}`,
      },
      result,
      score,
      location: bayAreaLocations[Math.floor(Math.random() * bayAreaLocations.length)]!.city,
    });
  }

  return history.sort((a, b) => b.date.getTime() - a.date.getTime());
};

// Generate mock players with realistic data
export const mockPlayers: User[] = [
  {
    id: '1',
    email: 'alex.thompson@example.com',
    name: 'Alex Thompson',
    skillLevel: 'advanced',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      city: 'San Francisco',
      state: 'CA',
    },
    profileImage: 'https://i.pravatar.cc/300?u=alex.thompson',
    bio: 'Competitive player with 10+ years experience. Love playing early mornings at Golden Gate Park.',
    playStyle: 'aggressive',
    preferredSurface: 'hard',
    availability: ['weekday-morning', 'weekend-all'],
    stats: {
      elo: 1850,
      matchesPlayed: 87,
      matchesWon: 54,
      matchesLost: 33,
      winRate: 62.1,
      currentStreak: 3,
      bestStreak: 8,
    },
    matchHistory: generateMatchHistory('1', 54, 33),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2025-10-25'),
  },
  {
    id: '2',
    email: 'sophia.martinez@example.com',
    name: 'Sophia Martinez',
    skillLevel: 'intermediate',
    location: {
      latitude: 37.8044,
      longitude: -122.2712,
      city: 'Oakland',
      state: 'CA',
    },
    profileImage: 'https://i.pravatar.cc/300?u=sophia.martinez',
    bio: 'Weekend warrior looking to improve my game. Prefer doubles but open to singles.',
    playStyle: 'all-court',
    preferredSurface: 'clay',
    availability: ['weekend-morning', 'weekend-afternoon'],
    stats: {
      elo: 1450,
      matchesPlayed: 42,
      matchesWon: 21,
      matchesLost: 21,
      winRate: 50.0,
      currentStreak: -1,
      bestStreak: 5,
    },
    matchHistory: generateMatchHistory('2', 21, 21),
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2025-10-28'),
  },
  {
    id: '3',
    email: 'marcus.johnson@example.com',
    name: 'Marcus Johnson',
    skillLevel: 'professional',
    location: {
      latitude: 37.3382,
      longitude: -121.8863,
      city: 'San Jose',
      state: 'CA',
    },
    profileImage: 'https://i.pravatar.cc/300?u=marcus.johnson',
    bio: 'Former college player, now coaching and playing competitively. Looking for challenging matches.',
    playStyle: 'serve-and-volley',
    preferredSurface: 'grass',
    availability: ['weekday-afternoon', 'weekend-morning'],
    stats: {
      elo: 2200,
      matchesPlayed: 156,
      matchesWon: 118,
      matchesLost: 38,
      winRate: 75.6,
      currentStreak: 7,
      bestStreak: 15,
    },
    matchHistory: generateMatchHistory('3', 118, 38),
    createdAt: new Date('2023-11-10'),
    updatedAt: new Date('2025-10-29'),
  },
  {
    id: '4',
    email: 'emma.chen@example.com',
    name: 'Emma Chen',
    skillLevel: 'beginner',
    location: {
      latitude: 37.8715,
      longitude: -122.2730,
      city: 'Berkeley',
      state: 'CA',
    },
    profileImage: 'https://i.pravatar.cc/300?u=emma.chen',
    bio: 'New to tennis! Looking for patient players to learn and have fun with.',
    playStyle: 'baseline',
    preferredSurface: 'any',
    availability: ['weekday-evening', 'weekend-afternoon'],
    stats: {
      elo: 1100,
      matchesPlayed: 12,
      matchesWon: 3,
      matchesLost: 9,
      winRate: 25.0,
      currentStreak: -2,
      bestStreak: 2,
    },
    matchHistory: generateMatchHistory('4', 3, 9),
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-10-27'),
  },
  {
    id: '5',
    email: 'ryan.williams@example.com',
    name: 'Ryan Williams',
    skillLevel: 'advanced',
    location: {
      latitude: 37.4419,
      longitude: -122.1430,
      city: 'Palo Alto',
      state: 'CA',
    },
    profileImage: 'https://i.pravatar.cc/300?u=ryan.williams',
    bio: 'Tech professional who plays tennis to de-stress. Competitive but friendly!',
    playStyle: 'baseline',
    preferredSurface: 'hard',
    availability: ['weekday-evening', 'weekend-all'],
    stats: {
      elo: 1750,
      matchesPlayed: 68,
      matchesWon: 41,
      matchesLost: 27,
      winRate: 60.3,
      currentStreak: 2,
      bestStreak: 6,
    },
    matchHistory: generateMatchHistory('5', 41, 27),
    createdAt: new Date('2024-02-14'),
    updatedAt: new Date('2025-10-26'),
  },
  {
    id: '6',
    email: 'olivia.davis@example.com',
    name: 'Olivia Davis',
    skillLevel: 'intermediate',
    location: {
      latitude: 37.3861,
      longitude: -122.0839,
      city: 'Mountain View',
      state: 'CA',
    },
    profileImage: 'https://i.pravatar.cc/300?u=olivia.davis',
    bio: 'Playing since high school. Love long rallies and consistent opponents.',
    playStyle: 'defensive',
    preferredSurface: 'clay',
    availability: ['weekend-morning', 'weekend-afternoon'],
    stats: {
      elo: 1520,
      matchesPlayed: 55,
      matchesWon: 28,
      matchesLost: 27,
      winRate: 50.9,
      currentStreak: 1,
      bestStreak: 4,
    },
    matchHistory: generateMatchHistory('6', 28, 27),
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date('2025-10-28'),
  },
  {
    id: '7',
    email: 'james.taylor@example.com',
    name: 'James Taylor',
    skillLevel: 'intermediate',
    location: {
      latitude: 37.3688,
      longitude: -122.0363,
      city: 'Sunnyvale',
      state: 'CA',
    },
    profileImage: 'https://i.pravatar.cc/300?u=james.taylor',
    bio: 'Casual player looking to improve. Open to tips and friendly competition.',
    playStyle: 'all-court',
    preferredSurface: 'hard',
    availability: ['weekday-evening', 'weekend-morning'],
    stats: {
      elo: 1380,
      matchesPlayed: 38,
      matchesWon: 17,
      matchesLost: 21,
      winRate: 44.7,
      currentStreak: -1,
      bestStreak: 3,
    },
    matchHistory: generateMatchHistory('7', 17, 21),
    createdAt: new Date('2024-05-22'),
    updatedAt: new Date('2025-10-25'),
  },
  {
    id: '8',
    email: 'natalie.brown@example.com',
    name: 'Natalie Brown',
    skillLevel: 'advanced',
    location: {
      latitude: 37.5483,
      longitude: -121.9886,
      city: 'Fremont',
      state: 'CA',
    },
    profileImage: 'https://i.pravatar.cc/300?u=natalie.brown',
    bio: 'Aggressive baseliner who loves a good challenge. Let\'s rally!',
    playStyle: 'aggressive',
    preferredSurface: 'hard',
    availability: ['weekday-morning', 'weekend-all'],
    stats: {
      elo: 1820,
      matchesPlayed: 73,
      matchesWon: 47,
      matchesLost: 26,
      winRate: 64.4,
      currentStreak: 4,
      bestStreak: 9,
    },
    matchHistory: generateMatchHistory('8', 47, 26),
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2025-10-29'),
  },
  {
    id: '9',
    email: 'kevin.anderson@example.com',
    name: 'Kevin Anderson',
    skillLevel: 'beginner',
    location: {
      latitude: 37.6688,
      longitude: -122.0808,
      city: 'Hayward',
      state: 'CA',
    },
    profileImage: 'https://i.pravatar.cc/300?u=kevin.anderson',
    bio: 'Just started playing 6 months ago. Looking for other beginners to practice with!',
    playStyle: 'baseline',
    preferredSurface: 'any',
    availability: ['weekend-afternoon', 'weekend-evening'],
    stats: {
      elo: 1050,
      matchesPlayed: 8,
      matchesWon: 2,
      matchesLost: 6,
      winRate: 25.0,
      currentStreak: -3,
      bestStreak: 1,
    },
    matchHistory: generateMatchHistory('9', 2, 6),
    createdAt: new Date('2025-05-15'),
    updatedAt: new Date('2025-10-20'),
  },
  {
    id: '10',
    email: 'rachel.kim@example.com',
    name: 'Rachel Kim',
    skillLevel: 'professional',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      city: 'San Francisco',
      state: 'CA',
    },
    profileImage: 'https://i.pravatar.cc/300?u=rachel.kim',
    bio: 'Tournament player and coach. Always looking for high-level practice matches.',
    playStyle: 'serve-and-volley',
    preferredSurface: 'grass',
    availability: ['weekday-morning', 'weekday-afternoon'],
    stats: {
      elo: 2150,
      matchesPlayed: 142,
      matchesWon: 105,
      matchesLost: 37,
      winRate: 73.9,
      currentStreak: 5,
      bestStreak: 12,
    },
    matchHistory: generateMatchHistory('10', 105, 37),
    createdAt: new Date('2023-09-18'),
    updatedAt: new Date('2025-10-30'),
  },
  {
    id: '11',
    email: 'daniel.garcia@example.com',
    name: 'Daniel Garcia',
    skillLevel: 'intermediate',
    location: {
      latitude: 37.3541,
      longitude: -121.9552,
      city: 'Santa Clara',
      state: 'CA',
    },
    profileImage: 'https://i.pravatar.cc/300?u=daniel.garcia',
    bio: 'Enjoy playing on weekends. Prefer baseline rallies and consistent play.',
    playStyle: 'baseline',
    preferredSurface: 'clay',
    availability: ['weekend-morning', 'weekend-afternoon'],
    stats: {
      elo: 1480,
      matchesPlayed: 47,
      matchesWon: 23,
      matchesLost: 24,
      winRate: 48.9,
      currentStreak: 2,
      bestStreak: 4,
    },
    matchHistory: generateMatchHistory('11', 23, 24),
    createdAt: new Date('2024-06-08'),
    updatedAt: new Date('2025-10-27'),
  },
  {
    id: '12',
    email: 'mia.wilson@example.com',
    name: 'Mia Wilson',
    skillLevel: 'advanced',
    location: {
      latitude: 37.8044,
      longitude: -122.2712,
      city: 'Oakland',
      state: 'CA',
    },
    profileImage: 'https://i.pravatar.cc/300?u=mia.wilson',
    bio: 'Competitive singles player. Love fast-paced matches on hard courts.',
    playStyle: 'aggressive',
    preferredSurface: 'hard',
    availability: ['weekday-evening', 'weekend-all'],
    stats: {
      elo: 1780,
      matchesPlayed: 64,
      matchesWon: 39,
      matchesLost: 25,
      winRate: 60.9,
      currentStreak: 3,
      bestStreak: 7,
    },
    matchHistory: generateMatchHistory('12', 39, 25),
    createdAt: new Date('2024-02-28'),
    updatedAt: new Date('2025-10-28'),
  },
  {
    id: '13',
    email: 'lucas.miller@example.com',
    name: 'Lucas Miller',
    skillLevel: 'beginner',
    location: {
      latitude: 37.4419,
      longitude: -122.1430,
      city: 'Palo Alto',
      state: 'CA',
    },
    profileImage: 'https://i.pravatar.cc/300?u=lucas.miller',
    bio: 'Learning tennis as a new hobby. Looking for friendly matches and practice partners.',
    playStyle: 'baseline',
    preferredSurface: 'any',
    availability: ['weekday-evening', 'weekend-afternoon'],
    stats: {
      elo: 1120,
      matchesPlayed: 15,
      matchesWon: 5,
      matchesLost: 10,
      winRate: 33.3,
      currentStreak: 1,
      bestStreak: 2,
    },
    matchHistory: generateMatchHistory('13', 5, 10),
    createdAt: new Date('2025-07-10'),
    updatedAt: new Date('2025-10-26'),
  },
  {
    id: '14',
    email: 'isabella.lee@example.com',
    name: 'Isabella Lee',
    skillLevel: 'intermediate',
    location: {
      latitude: 37.3382,
      longitude: -121.8863,
      city: 'San Jose',
      state: 'CA',
    },
    profileImage: 'https://i.pravatar.cc/300?u=isabella.lee',
    bio: 'Doubles specialist, but enjoy singles too. Prefer morning matches.',
    playStyle: 'all-court',
    preferredSurface: 'hard',
    availability: ['weekday-morning', 'weekend-morning'],
    stats: {
      elo: 1510,
      matchesPlayed: 51,
      matchesWon: 27,
      matchesLost: 24,
      winRate: 52.9,
      currentStreak: -1,
      bestStreak: 5,
    },
    matchHistory: generateMatchHistory('14', 27, 24),
    createdAt: new Date('2024-04-15'),
    updatedAt: new Date('2025-10-25'),
  },
  {
    id: '15',
    email: 'ethan.moore@example.com',
    name: 'Ethan Moore',
    skillLevel: 'advanced',
    location: {
      latitude: 37.8715,
      longitude: -122.2730,
      city: 'Berkeley',
      state: 'CA',
    },
    profileImage: 'https://i.pravatar.cc/300?u=ethan.moore',
    bio: 'University player looking for competitive matches. Love clay court tennis.',
    playStyle: 'defensive',
    preferredSurface: 'clay',
    availability: ['weekday-afternoon', 'weekend-all'],
    stats: {
      elo: 1880,
      matchesPlayed: 91,
      matchesWon: 58,
      matchesLost: 33,
      winRate: 63.7,
      currentStreak: 6,
      bestStreak: 10,
    },
    matchHistory: generateMatchHistory('15', 58, 33),
    createdAt: new Date('2023-12-05'),
    updatedAt: new Date('2025-10-29'),
  },
  {
    id: '16',
    email: 'ava.jackson@example.com',
    name: 'Ava Jackson',
    skillLevel: 'intermediate',
    location: {
      latitude: 37.3861,
      longitude: -122.0839,
      city: 'Mountain View',
      state: 'CA',
    },
    profileImage: 'https://i.pravatar.cc/300?u=ava.jackson',
    bio: 'Social player who enjoys the sport. Open to all skill levels!',
    playStyle: 'all-court',
    preferredSurface: 'any',
    availability: ['weekend-morning', 'weekend-afternoon'],
    stats: {
      elo: 1420,
      matchesPlayed: 44,
      matchesWon: 20,
      matchesLost: 24,
      winRate: 45.5,
      currentStreak: -2,
      bestStreak: 4,
    },
    matchHistory: generateMatchHistory('16', 20, 24),
    createdAt: new Date('2024-05-30'),
    updatedAt: new Date('2025-10-27'),
  },
  {
    id: '17',
    email: 'noah.white@example.com',
    name: 'Noah White',
    skillLevel: 'professional',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      city: 'San Francisco',
      state: 'CA',
    },
    profileImage: 'https://i.pravatar.cc/300?u=noah.white',
    bio: 'ATP Challenger circuit player training in Bay Area. Looking for high-level sparring.',
    playStyle: 'aggressive',
    preferredSurface: 'hard',
    availability: ['weekday-morning', 'weekday-afternoon'],
    stats: {
      elo: 2280,
      matchesPlayed: 168,
      matchesWon: 132,
      matchesLost: 36,
      winRate: 78.6,
      currentStreak: 9,
      bestStreak: 18,
    },
    matchHistory: generateMatchHistory('17', 132, 36),
    createdAt: new Date('2023-08-22'),
    updatedAt: new Date('2025-10-30'),
  },
  {
    id: '18',
    email: 'sophia.harris@example.com',
    name: 'Sophia Harris',
    skillLevel: 'beginner',
    location: {
      latitude: 37.3688,
      longitude: -122.0363,
      city: 'Sunnyvale',
      state: 'CA',
    },
    profileImage: 'https://i.pravatar.cc/300?u=sophia.harris',
    bio: 'Complete beginner, started lessons last month. Looking for fun, casual matches.',
    playStyle: 'baseline',
    preferredSurface: 'any',
    availability: ['weekend-afternoon', 'weekend-evening'],
    stats: {
      elo: 1000,
      matchesPlayed: 5,
      matchesWon: 1,
      matchesLost: 4,
      winRate: 20.0,
      currentStreak: -1,
      bestStreak: 1,
    },
    matchHistory: generateMatchHistory('18', 1, 4),
    createdAt: new Date('2025-09-05'),
    updatedAt: new Date('2025-10-22'),
  },
  {
    id: '19',
    email: 'liam.thomas@example.com',
    name: 'Liam Thomas',
    skillLevel: 'advanced',
    location: {
      latitude: 37.5483,
      longitude: -121.9886,
      city: 'Fremont',
      state: 'CA',
    },
    profileImage: 'https://i.pravatar.cc/300?u=liam.thomas',
    bio: 'Serve and volley specialist. Love playing aggressive tennis at the net.',
    playStyle: 'serve-and-volley',
    preferredSurface: 'grass',
    availability: ['weekday-evening', 'weekend-morning'],
    stats: {
      elo: 1830,
      matchesPlayed: 79,
      matchesWon: 50,
      matchesLost: 29,
      winRate: 63.3,
      currentStreak: 4,
      bestStreak: 8,
    },
    matchHistory: generateMatchHistory('19', 50, 29),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2025-10-28'),
  },
  {
    id: '20',
    email: 'charlotte.clark@example.com',
    name: 'Charlotte Clark',
    skillLevel: 'intermediate',
    location: {
      latitude: 37.6688,
      longitude: -122.0808,
      city: 'Hayward',
      state: 'CA',
    },
    profileImage: 'https://i.pravatar.cc/300?u=charlotte.clark',
    bio: 'Steady player who values consistency over power. Looking for regular hitting partners.',
    playStyle: 'defensive',
    preferredSurface: 'clay',
    availability: ['weekday-evening', 'weekend-afternoon'],
    stats: {
      elo: 1460,
      matchesPlayed: 49,
      matchesWon: 24,
      matchesLost: 25,
      winRate: 49.0,
      currentStreak: 1,
      bestStreak: 4,
    },
    matchHistory: generateMatchHistory('20', 24, 25),
    createdAt: new Date('2024-03-18'),
    updatedAt: new Date('2025-10-26'),
  },
  {
    id: '21',
    email: 'mason.rodriguez@example.com',
    name: 'Mason Rodriguez',
    skillLevel: 'intermediate',
    location: {
      latitude: 37.3541,
      longitude: -121.9552,
      city: 'Santa Clara',
      state: 'CA',
    },
    profileImage: 'https://i.pravatar.cc/300?u=mason.rodriguez',
    bio: 'Weekend player with flexible schedule. Open to playing different styles.',
    playStyle: 'all-court',
    preferredSurface: 'hard',
    availability: ['weekend-all'],
    stats: {
      elo: 1490,
      matchesPlayed: 53,
      matchesWon: 27,
      matchesLost: 26,
      winRate: 50.9,
      currentStreak: -1,
      bestStreak: 5,
    },
    matchHistory: generateMatchHistory('21', 27, 26),
    createdAt: new Date('2024-04-25'),
    updatedAt: new Date('2025-10-29'),
  },
  {
    id: '22',
    email: 'amelia.lopez@example.com',
    name: 'Amelia Lopez',
    skillLevel: 'beginner',
    location: {
      latitude: 37.8044,
      longitude: -122.2712,
      city: 'Oakland',
      state: 'CA',
    },
    profileImage: 'https://i.pravatar.cc/300?u=amelia.lopez',
    bio: 'Picking up tennis after many years. Taking it slow and enjoying the journey!',
    playStyle: 'baseline',
    preferredSurface: 'any',
    availability: ['weekend-morning', 'weekend-afternoon'],
    stats: {
      elo: 1080,
      matchesPlayed: 10,
      matchesWon: 3,
      matchesLost: 7,
      winRate: 30.0,
      currentStreak: -1,
      bestStreak: 2,
    },
    matchHistory: generateMatchHistory('22', 3, 7),
    createdAt: new Date('2025-06-12'),
    updatedAt: new Date('2025-10-24'),
  },
  {
    id: '23',
    email: 'william.martinez@example.com',
    name: 'William Martinez',
    skillLevel: 'advanced',
    location: {
      latitude: 37.4419,
      longitude: -122.1430,
      city: 'Palo Alto',
      state: 'CA',
    },
    profileImage: 'https://i.pravatar.cc/300?u=william.martinez',
    bio: 'Former division 1 player. Still competitive but play for fun now.',
    playStyle: 'baseline',
    preferredSurface: 'hard',
    availability: ['weekday-afternoon', 'weekend-all'],
    stats: {
      elo: 1920,
      matchesPlayed: 98,
      matchesWon: 64,
      matchesLost: 34,
      winRate: 65.3,
      currentStreak: 5,
      bestStreak: 11,
    },
    matchHistory: generateMatchHistory('23', 64, 34),
    createdAt: new Date('2023-10-14'),
    updatedAt: new Date('2025-10-30'),
  },
  {
    id: '24',
    email: 'harper.gonzalez@example.com',
    name: 'Harper Gonzalez',
    skillLevel: 'intermediate',
    location: {
      latitude: 37.3382,
      longitude: -121.8863,
      city: 'San Jose',
      state: 'CA',
    },
    profileImage: 'https://i.pravatar.cc/300?u=harper.gonzalez',
    bio: 'Enthusiastic player looking to play regularly. Prefer early morning matches.',
    playStyle: 'all-court',
    preferredSurface: 'clay',
    availability: ['weekday-morning', 'weekend-morning'],
    stats: {
      elo: 1530,
      matchesPlayed: 58,
      matchesWon: 30,
      matchesLost: 28,
      winRate: 51.7,
      currentStreak: 2,
      bestStreak: 6,
    },
    matchHistory: generateMatchHistory('24', 30, 28),
    createdAt: new Date('2024-02-08'),
    updatedAt: new Date('2025-10-27'),
  },
];

// Helper function to get player by ID
export const getPlayerById = (id: string): User | undefined => {
  return mockPlayers.find(player => player.id === id);
};

// Generate realistic match data between players
function generateMockMatches(): Match[] {
  const matches: Match[] = [];
  const surfaces: Array<'hard' | 'clay' | 'grass' | 'carpet'> = ['hard', 'clay', 'grass', 'carpet'];

  // Sample realistic match scores
  const winningScores: MatchSet[][] = [
    [{ player1Games: 6, player2Games: 4 }, { player1Games: 6, player2Games: 3 }],
    [{ player1Games: 7, player2Games: 5 }, { player1Games: 6, player2Games: 4 }],
    [{ player1Games: 6, player2Games: 2 }, { player1Games: 6, player2Games: 3 }],
    [{ player1Games: 7, player2Games: 6, tiebreak: { player1Points: 7, player2Points: 5 } }, { player1Games: 6, player2Games: 4 }],
    [{ player1Games: 4, player2Games: 6 }, { player1Games: 6, player2Games: 3 }, { player1Games: 6, player2Games: 4 }],
    [{ player1Games: 6, player2Games: 3 }, { player1Games: 6, player2Games: 2 }],
    [{ player1Games: 6, player2Games: 4 }, { player1Games: 4, player2Games: 6 }, { player1Games: 7, player2Games: 5 }],
  ];

  // Generate matches between various players
  const matchups = [
    { player1Id: '1', player2Id: '5', daysAgo: 2 },
    { player1Id: '3', player2Id: '10', daysAgo: 5 },
    { player1Id: '15', player2Id: '8', daysAgo: 7 },
    { player1Id: '23', player2Id: '1', daysAgo: 10 },
    { player1Id: '2', player2Id: '6', daysAgo: 12 },
    { player1Id: '17', player2Id: '3', daysAgo: 15 },
    { player1Id: '5', player2Id: '8', daysAgo: 18 },
    { player1Id: '19', player2Id: '15', daysAgo: 20 },
    { player1Id: '4', player2Id: '9', daysAgo: 22 },
    { player1Id: '13', player2Id: '22', daysAgo: 25 },
    { player1Id: '1', player2Id: '8', daysAgo: 28 },
    { player1Id: '23', player2Id: '17', daysAgo: 30 },
    { player1Id: '6', player2Id: '14', daysAgo: 32 },
    { player1Id: '11', player2Id: '21', daysAgo: 35 },
    { player1Id: '10', player2Id: '15', daysAgo: 40 },
  ];

  matchups.forEach((matchup, index) => {
    const player1 = mockPlayers.find(p => p.id === matchup.player1Id);
    const player2 = mockPlayers.find(p => p.id === matchup.player2Id);

    if (!player1 || !player2) return;

    const location = bayAreaLocations[index % bayAreaLocations.length]!;
    const surface = surfaces[index % surfaces.length];
    const scoreTemplate = winningScores[index % winningScores.length]!;

    const completedDate = new Date();
    completedDate.setDate(completedDate.getDate() - matchup.daysAgo);

    try {
      const match = createMatch(
        player1,
        player2,
        { sets: scoreTemplate, winnerId: player1.id, duration: 90 + Math.floor(Math.random() * 60) },
        {
          name: `${location.city} Tennis Club`,
          city: location.city,
          state: location.state,
          latitude: location.lat,
          longitude: location.lng,
        },
        surface,
        'Great match!'
      );

      // Override completed date
      match.completedDate = completedDate;
      match.createdAt = completedDate;
      match.updatedAt = completedDate;

      matches.push(match);
    } catch (error) {
      console.error('Error generating match:', error);
    }
  });

  return matches.sort((a, b) => {
    const dateA = a.completedDate?.getTime() || 0;
    const dateB = b.completedDate?.getTime() || 0;
    return dateB - dateA;
  });
}

// Export mock matches
export const mockMatches: Match[] = generateMockMatches();

// Helper function to get matches for a player
export const getPlayerMatches = (playerId: string): Match[] => {
  return mockMatches.filter(
    match => match.player1Id === playerId || match.player2Id === playerId
  );
};

// Helper function to get match by ID
export const getMatchById = (matchId: string): Match | undefined => {
  return mockMatches.find(match => match.id === matchId);
};

// Helper function to calculate distance between two coordinates (in miles)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Generate mock availability time blocks
function generateMockTimeBlocks(): TimeBlock[] {
  const blocks: TimeBlock[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Common time slots
  const timeSlots = [
    { start: '06:00', end: '08:00', label: 'Early Morning' },
    { start: '08:00', end: '10:00', label: 'Morning' },
    { start: '10:00', end: '12:00', label: 'Late Morning' },
    { start: '12:00', end: '14:00', label: 'Lunch Time' },
    { start: '14:00', end: '16:00', label: 'Afternoon' },
    { start: '16:00', end: '18:00', label: 'Late Afternoon' },
    { start: '18:00', end: '20:00', label: 'Evening' },
  ];

  // Generate availability for select players over the next 2 weeks
  const playerSchedules = [
    {
      playerId: '1',
      name: 'Alex Thompson',
      pattern: [
        { days: [1, 3, 5], slots: [0, 1] }, // Mon, Wed, Fri - Early/Morning
        { days: [0, 6], slots: [1, 2, 3] }, // Sun, Sat - Morning/Late Morning/Lunch
      ],
    },
    {
      playerId: '2',
      name: 'Sophia Martinez',
      pattern: [
        { days: [0, 6], slots: [1, 2, 4] }, // Sun, Sat - Morning/Late Morning/Afternoon
      ],
    },
    {
      playerId: '3',
      name: 'Marcus Johnson',
      pattern: [
        { days: [1, 2, 3, 4, 5], slots: [4, 5] }, // Weekdays - Afternoon/Late Afternoon
        { days: [0, 6], slots: [1, 2] }, // Weekends - Morning/Late Morning
      ],
    },
    {
      playerId: '5',
      name: 'Ryan Williams',
      pattern: [
        { days: [1, 3], slots: [6] }, // Mon, Wed - Evening
        { days: [0, 6], slots: [2, 3, 4] }, // Weekends - Late Morning/Lunch/Afternoon
      ],
    },
    {
      playerId: '8',
      name: 'Daniel Taylor',
      pattern: [
        { days: [2, 4], slots: [6] }, // Tue, Thu - Evening
        { days: [6], slots: [1, 2, 3, 4] }, // Saturday - All morning/afternoon
      ],
    },
    {
      playerId: '15',
      name: 'Victoria White',
      pattern: [
        { days: [1, 3, 5], slots: [1, 2] }, // Mon, Wed, Fri - Morning/Late Morning
        { days: [0], slots: [3, 4] }, // Sunday - Lunch/Afternoon
      ],
    },
  ];

  let blockIdCounter = 1;

  // Generate blocks for next 14 days
  for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() + dayOffset);
    const dayOfWeek = date.getDay();

    playerSchedules.forEach((schedule) => {
      schedule.pattern.forEach((pattern) => {
        if (pattern.days.includes(dayOfWeek)) {
          pattern.slots.forEach((slotIndex) => {
            const slot = timeSlots[slotIndex];
            if (slot) {
              blocks.push({
                id: `tb_${schedule.playerId}_${blockIdCounter++}`,
                playerId: schedule.playerId,
                date: new Date(date),
                startTime: slot.start,
                endTime: slot.end,
                isRecurring: false,
                notes: `${slot.label} availability`,
                createdAt: new Date(),
                updatedAt: new Date(),
              });
            }
          });
        }
      });
    });
  }

  return blocks.sort((a, b) => {
    const dateCompare = a.date.getTime() - b.date.getTime();
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });
}

// Export mock time blocks
export const mockTimeBlocks: TimeBlock[] = generateMockTimeBlocks();

// Helper function to get time blocks for a player
export const getPlayerTimeBlocks = (playerId: string): TimeBlock[] => {
  return mockTimeBlocks.filter(block => block.playerId === playerId);
};

// Helper function to get time blocks in a date range
export const getTimeBlocksInRange = (
  playerId: string,
  startDate: Date,
  endDate: Date
): TimeBlock[] => {
  return mockTimeBlocks.filter(
    block =>
      block.playerId === playerId &&
      block.date >= startDate &&
      block.date <= endDate
  );
};

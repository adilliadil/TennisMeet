'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { mockPlayers } from '@/lib/mockData';
import { searchPlayers, SearchFilters } from '@/lib/playerSearch';
import { User } from '@/types';
import { MapPin, Trophy, TrendingUp, Target, Filter } from 'lucide-react';
import Link from 'next/link';

// Mock current user for demo (in production, this would come from auth)
const CURRENT_USER: User = mockPlayers[0]!;

export default function FindPlayersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    maxDistance: 30,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Search and rank players
  const searchResults = useMemo(() => {
    return searchPlayers(CURRENT_USER, mockPlayers, {
      ...filters,
      searchQuery: searchQuery || undefined,
    });
  }, [searchQuery, filters]);

  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({ maxDistance: 30 });
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      case 'professional':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Find Tennis Partners</h1>
        <p className="text-gray-600">
          Discover and connect with players that match your skill level and preferences
        </p>
      </div>

      {/* Search and Filter Section */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search by name or bio..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="border-t pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Skill Level Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Skill Level
                    </label>
                    <Select
                      value={filters.skillLevel?.[0] || 'all'}
                      onValueChange={value =>
                        updateFilter(
                          'skillLevel',
                          value === 'all' ? undefined : [value as any]
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All levels</SelectItem>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Play Style Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Play Style
                    </label>
                    <Select
                      value={filters.playStyle?.[0] || 'all'}
                      onValueChange={value =>
                        updateFilter(
                          'playStyle',
                          value === 'all' ? undefined : [value as any]
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All styles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All styles</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                        <SelectItem value="defensive">Defensive</SelectItem>
                        <SelectItem value="all-court">All-Court</SelectItem>
                        <SelectItem value="serve-and-volley">
                          Serve & Volley
                        </SelectItem>
                        <SelectItem value="baseline">Baseline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Surface Preference Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Preferred Surface
                    </label>
                    <Select
                      value={filters.preferredSurface?.[0] || 'all'}
                      onValueChange={value =>
                        updateFilter(
                          'preferredSurface',
                          value === 'all' ? undefined : [value as any]
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All surfaces" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All surfaces</SelectItem>
                        <SelectItem value="hard">Hard Court</SelectItem>
                        <SelectItem value="clay">Clay</SelectItem>
                        <SelectItem value="grass">Grass</SelectItem>
                        <SelectItem value="any">Any</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Distance Slider */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Max Distance: {filters.maxDistance} miles
                  </label>
                  <Slider
                    value={[filters.maxDistance || 30]}
                    onValueChange={([value]) => updateFilter('maxDistance', value)}
                    min={5}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                </div>

                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Found {searchResults.length} players
      </div>

      {/* Player Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResults.map(player => (
          <Link key={player.id} href={`/players/${player.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <img
                    src={player.profileImage || '/placeholder.jpg'}
                    alt={player.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg mb-1">{player.name}</CardTitle>
                    <Badge className={getSkillLevelColor(player.skillLevel)}>
                      {player.skillLevel}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {player.matchScore}%
                    </div>
                    <div className="text-xs text-gray-500">Match</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Location and Distance */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {player.location.city}, {player.location.state}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span>{player.distance.toFixed(1)} mi</span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="flex flex-col items-center">
                      <Trophy className="h-4 w-4 text-yellow-500 mb-1" />
                      <div className="text-sm font-bold">{player.stats?.elo}</div>
                      <div className="text-xs text-gray-500">Elo</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mb-1" />
                      <div className="text-sm font-bold">
                        {player.stats?.winRate.toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-500">Win Rate</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <Target className="h-4 w-4 text-blue-500 mb-1" />
                      <div className="text-sm font-bold">
                        {player.stats?.matchesPlayed}
                      </div>
                      <div className="text-xs text-gray-500">Matches</div>
                    </div>
                  </div>

                  {/* Play Style */}
                  {player.playStyle && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {player.playStyle.replace('-', ' ')}
                      </Badge>
                      {player.preferredSurface && player.preferredSurface !== 'any' && (
                        <Badge variant="outline" className="text-xs">
                          {player.preferredSurface}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Bio Preview */}
                  {player.bio && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {player.bio}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* No Results */}
      {searchResults.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">
              No players found matching your criteria
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockMatches, getPlayerById } from '@/lib/mockData';
import { filterMatches, sortMatches, formatMatchScore } from '@/lib/matchManager';
import { Match, MatchFilters } from '@/types';
import { formatEloChange, getEloChangeColor } from '@/lib/eloCalculator';
import { Plus, Filter, Calendar, MapPin, Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

export default function MatchHistoryPage() {
  // Current user ID (hardcoded for demo - would come from auth)
  const currentUserId = '1';

  // State for filters
  const [filters, setFilters] = useState<MatchFilters>({
    playerId: currentUserId,
    status: 'completed',
    result: 'all',
  });

  const [sortBy, setSortBy] = useState<'date' | 'location' | 'surface'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort matches
  const filteredAndSortedMatches = useMemo(() => {
    const filtered = filterMatches(mockMatches, filters);
    return sortMatches(filtered, sortBy, sortOrder);
  }, [filters, sortBy, sortOrder]);

  // Calculate quick stats
  const stats = useMemo(() => {
    const completedMatches = filteredAndSortedMatches.filter(m => m.status === 'completed');
    const wins = completedMatches.filter(m => m.score?.winnerId === currentUserId).length;
    const losses = completedMatches.length - wins;
    const winRate = completedMatches.length > 0 ? (wins / completedMatches.length) * 100 : 0;

    return { total: completedMatches.length, wins, losses, winRate };
  }, [filteredAndSortedMatches, currentUserId]);

  const getOpponentInfo = (match: Match) => {
    const opponentId = match.player1Id === currentUserId ? match.player2Id : match.player1Id;
    return getPlayerById(opponentId);
  };

  const isWinner = (match: Match) => {
    return match.score?.winnerId === currentUserId;
  };

  const getPlayerEloChange = (match: Match) => {
    if (!match.eloChanges) return null;
    return match.player1Id === currentUserId
      ? match.eloChanges.player1Change
      : match.eloChanges.player2Change;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Match History</h1>
              <p className="text-gray-600 mt-1">
                Track your matches and Elo progression
              </p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Record Match
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Matches</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{stats.wins}</div>
                  <div className="text-sm text-gray-600 mt-1">Wins</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{stats.losses}</div>
                  <div className="text-sm text-gray-600 mt-1">Losses</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {stats.winRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Win Rate</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Filters and Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Filter className="mr-2 h-5 w-5" />
              Filters & Sort
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Result
                </label>
                <Select
                  value={filters.result || 'all'}
                  onValueChange={(value) =>
                    setFilters({ ...filters, result: value as 'won' | 'lost' | 'all' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Matches</SelectItem>
                    <SelectItem value="won">Wins Only</SelectItem>
                    <SelectItem value="lost">Losses Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Surface
                </label>
                <Select
                  value={filters.surface || 'all'}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      surface: value === 'all' ? undefined : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Surfaces</SelectItem>
                    <SelectItem value="hard">Hard Court</SelectItem>
                    <SelectItem value="clay">Clay Court</SelectItem>
                    <SelectItem value="grass">Grass Court</SelectItem>
                    <SelectItem value="carpet">Carpet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Sort By
                </label>
                <Select
                  value={sortBy}
                  onValueChange={(value) =>
                    setSortBy(value as 'date' | 'location' | 'surface')
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                    <SelectItem value="surface">Surface</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Order
                </label>
                <Select
                  value={sortOrder}
                  onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Newest First</SelectItem>
                    <SelectItem value="asc">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Match List */}
        <div className="space-y-4">
          {filteredAndSortedMatches.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No matches found
                </h3>
                <p className="text-gray-600 mb-6">
                  Start recording your matches to build your history!
                </p>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Record Your First Match
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredAndSortedMatches.map((match) => {
              const opponent = getOpponentInfo(match);
              const won = isWinner(match);
              const eloChange = getPlayerEloChange(match);

              return (
                <Link key={match.id} href={`/matches/${match.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Match Result & Opponent */}
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-xl ${
                              won ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          >
                            {won ? 'W' : 'L'}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-lg text-gray-900">
                                vs {opponent?.name || 'Unknown'}
                              </span>
                              <Badge
                                variant={won ? 'success' : 'danger'}
                              >
                                {won ? 'Victory' : 'Defeat'}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {match.completedDate?.toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {match.location.city}
                              </div>
                              {match.surface && (
                                <Badge variant="outline" className="capitalize">
                                  {match.surface}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Score */}
                        <div className="text-center md:text-right">
                          <div className="text-2xl font-bold text-gray-900 mb-1">
                            {match.score && formatMatchScore(match.score.sets)}
                          </div>
                          {match.score?.duration && (
                            <div className="text-sm text-gray-600">
                              {match.score.duration} minutes
                            </div>
                          )}
                        </div>

                        {/* Elo Change */}
                        <div className="flex items-center justify-center md:w-32">
                          <div className="text-center">
                            <div className="text-xs text-gray-600 mb-1">Elo Change</div>
                            <div
                              className={`text-2xl font-bold flex items-center justify-center gap-1 ${
                                eloChange !== null
                                  ? getEloChangeColor(eloChange)
                                  : 'text-gray-400'
                              }`}
                            >
                              {eloChange !== null ? (
                                <>
                                  {eloChange > 0 ? (
                                    <TrendingUp className="h-5 w-5" />
                                  ) : (
                                    <TrendingDown className="h-5 w-5" />
                                  )}
                                  {formatEloChange(eloChange)}
                                </>
                              ) : (
                                'N/A'
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

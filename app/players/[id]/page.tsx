'use client';

import { use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getPlayerById, calculateDistance } from '@/lib/mockData';
import { mockPlayers } from '@/lib/mockData';
import {
  MapPin,
  Trophy,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Medal,
  Flame,
  ArrowLeft,
  MessageCircle,
  UserPlus,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PlayerProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function PlayerProfilePage({ params }: PlayerProfilePageProps) {
  const { id } = use(params);
  const player = getPlayerById(id);

  if (!player) {
    notFound();
  }

  const currentUser = mockPlayers[0];
  if (!currentUser) {
    notFound();
  }

  const distance = calculateDistance(
    currentUser.location.latitude,
    currentUser.location.longitude,
    player.location.latitude,
    player.location.longitude
  );

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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Button */}
      <Link href="/players">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Players
        </Button>
      </Link>

      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <img
              src={player.profileImage || '/placeholder.jpg'}
              alt={player.name}
              className="w-32 h-32 rounded-full object-cover"
            />

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{player.name}</h1>
                  <Badge className={getSkillLevelColor(player.skillLevel)}>
                    {player.skillLevel}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Challenge
                  </Button>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <MapPin className="h-4 w-4" />
                <span>
                  {player.location.city}, {player.location.state}
                </span>
                <span className="text-gray-400">•</span>
                <span>{distance.toFixed(1)} miles away</span>
              </div>

              {/* Bio */}
              {player.bio && (
                <p className="text-gray-700 mb-4">{player.bio}</p>
              )}

              {/* Play Details */}
              <div className="flex flex-wrap gap-2">
                {player.playStyle && (
                  <Badge variant="outline">
                    {player.playStyle.replace('-', ' ')}
                  </Badge>
                )}
                {player.preferredSurface && player.preferredSurface !== 'any' && (
                  <Badge variant="outline">
                    {player.preferredSurface} court
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Player Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                  </div>
                  <div className="text-3xl font-bold">{player.stats?.elo}</div>
                  <div className="text-sm text-gray-500">Elo Rating</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Target className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold">
                    {player.stats?.matchesPlayed}
                  </div>
                  <div className="text-sm text-gray-500">Matches Played</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold">
                    {player.stats?.winRate.toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-500">Win Rate</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Flame className="h-8 w-8 text-orange-500" />
                  </div>
                  <div className="text-3xl font-bold">
                    {player.stats?.currentStreak}
                  </div>
                  <div className="text-sm text-gray-500">Current Streak</div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Matches Won:</span>
                  <span className="font-semibold">{player.stats?.matchesWon}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Matches Lost:</span>
                  <span className="font-semibold">{player.stats?.matchesLost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Streak:</span>
                  <span className="font-semibold">
                    {player.stats?.bestStreak} wins
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since:</span>
                  <span className="font-semibold">
                    {formatDate(player.createdAt)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Match History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Match History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {player.matchHistory?.slice(0, 8).map(match => (
                  <div
                    key={match.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={match.opponent.profileImage || '/placeholder.jpg'}
                        alt={match.opponent.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold">{match.opponent.name}</div>
                        <div className="text-sm text-gray-500">
                          {match.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={
                          match.result === 'won'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {match.result === 'won' ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {match.result}
                      </Badge>
                      <div className="text-sm text-gray-500 mt-1">
                        {match.score}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {formatDate(match.date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Availability */}
          {player.availability && player.availability.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {player.availability.map(slot => {
                    const [day, time] = slot.split('-');
                    return (
                      <div
                        key={slot}
                        className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded"
                      >
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="capitalize">
                          {day} {time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Play Style</div>
                <div className="font-semibold capitalize">
                  {player.playStyle?.replace('-', ' ') || 'Not specified'}
                </div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Preferred Surface
                </div>
                <div className="font-semibold capitalize">
                  {player.preferredSurface || 'Not specified'}
                </div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-gray-600 mb-1">Last Active</div>
                <div className="font-semibold">{formatDate(player.updatedAt)}</div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {player.stats && player.stats.matchesPlayed >= 50 && (
                <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded">
                  <Medal className="h-6 w-6 text-yellow-600" />
                  <div className="text-sm">
                    <div className="font-semibold">Veteran Player</div>
                    <div className="text-gray-500">50+ matches played</div>
                  </div>
                </div>
              )}
              {player.stats && player.stats.winRate >= 60 && (
                <div className="flex items-center gap-3 p-2 bg-green-50 rounded">
                  <Trophy className="h-6 w-6 text-green-600" />
                  <div className="text-sm">
                    <div className="font-semibold">Winner</div>
                    <div className="text-gray-500">60%+ win rate</div>
                  </div>
                </div>
              )}
              {player.stats && player.stats.bestStreak >= 10 && (
                <div className="flex items-center gap-3 p-2 bg-orange-50 rounded">
                  <Flame className="h-6 w-6 text-orange-600" />
                  <div className="text-sm">
                    <div className="font-semibold">On Fire</div>
                    <div className="text-gray-500">10+ win streak</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

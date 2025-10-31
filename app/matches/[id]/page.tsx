'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getMatchById, getPlayerById } from '@/lib/mockData';
import { formatMatchScore } from '@/lib/matchManager';
import {
  formatEloChange,
  getEloChangeColor,
  getEloDescription,
  calculateWinProbability,
} from '@/lib/eloCalculator';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Trophy,
  TrendingUp,
  TrendingDown,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.id as string;

  const match = getMatchById(matchId);

  if (!match) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Match Not Found</h2>
            <p className="text-gray-600 mb-6">
              The match you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button onClick={() => router.push('/matches')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Match History
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const player1 = getPlayerById(match.player1Id);
  const player2 = getPlayerById(match.player2Id);

  if (!player1 || !player2) {
    return <div>Error loading player data</div>;
  }

  const winner = match.score?.winnerId === player1.id ? player1 : player2;
  const loser = match.score?.winnerId === player1.id ? player2 : player1;

  // Calculate pre-match win probabilities
  const player1WinProb = calculateWinProbability(
    (match.eloChanges?.player1NewElo || player1.stats!.elo) -
      (match.eloChanges?.player1Change || 0),
    (match.eloChanges?.player2NewElo || player2.stats!.elo) -
      (match.eloChanges?.player2Change || 0)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/matches')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Matches
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Match Details</h1>
              <div className="flex items-center gap-4 mt-2 text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {match.completedDate?.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                {match.completedDate && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {match.completedDate.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                )}
              </div>
            </div>

            <Badge variant="outline" className="text-lg px-4 py-2">
              {match.status === 'completed' ? 'Completed' : 'In Progress'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Players & Score */}
            <Card>
              <CardHeader>
                <CardTitle>Match Result</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Player 1 */}
                  <div className="flex items-center justify-between">
                    <Link href={`/players/${player1.id}`}>
                      <div className="flex items-center gap-4 cursor-pointer hover:opacity-80">
                        <img
                          src={player1.profileImage}
                          alt={player1.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-gray-900">
                              {player1.name}
                            </span>
                            {match.score?.winnerId === player1.id && (
                              <Trophy className="h-5 w-5 text-yellow-500" />
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            Elo: {match.eloChanges?.player1NewElo || player1.stats!.elo}
                            {match.eloChanges && (
                              <span
                                className={`ml-2 ${getEloChangeColor(
                                  match.eloChanges.player1Change
                                )}`}
                              >
                                ({formatEloChange(match.eloChanges.player1Change)})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>

                    <div className="text-right">
                      {match.score?.sets.map((set, idx) => (
                        <div key={idx} className="text-2xl font-bold text-gray-900">
                          {set.player1Games}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Player 2 */}
                  <div className="flex items-center justify-between">
                    <Link href={`/players/${player2.id}`}>
                      <div className="flex items-center gap-4 cursor-pointer hover:opacity-80">
                        <img
                          src={player2.profileImage}
                          alt={player2.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-gray-900">
                              {player2.name}
                            </span>
                            {match.score?.winnerId === player2.id && (
                              <Trophy className="h-5 w-5 text-yellow-500" />
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            Elo: {match.eloChanges?.player2NewElo || player2.stats!.elo}
                            {match.eloChanges && (
                              <span
                                className={`ml-2 ${getEloChangeColor(
                                  match.eloChanges.player2Change
                                )}`}
                              >
                                ({formatEloChange(match.eloChanges.player2Change)})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>

                    <div className="text-right">
                      {match.score?.sets.map((set, idx) => (
                        <div key={idx} className="text-2xl font-bold text-gray-900">
                          {set.player2Games}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Final Score Summary */}
                  {match.score && (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-sm text-gray-600 mb-1">Final Score</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {formatMatchScore(match.score.sets)}
                      </div>
                      {match.score.duration && (
                        <div className="text-sm text-gray-600 mt-1">
                          Duration: {match.score.duration} minutes
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Elo Changes Visualization */}
            {match.eloChanges && (
              <Card>
                <CardHeader>
                  <CardTitle>Elo Rating Changes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Winner Elo */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">
                          {winner.name} (Winner)
                        </span>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          <span className="text-xl font-bold text-green-600">
                            {formatEloChange(
                              match.score?.winnerId === player1.id
                                ? match.eloChanges.player1Change
                                : match.eloChanges.player2Change
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-gray-200 to-green-500 h-8 rounded-full flex items-center justify-between px-4 text-sm font-medium">
                        <span className="text-gray-700">
                          {match.score?.winnerId === player1.id
                            ? match.eloChanges.player1NewElo -
                              match.eloChanges.player1Change
                            : match.eloChanges.player2NewElo -
                              match.eloChanges.player2Change}
                        </span>
                        <span className="text-white">
                          {match.score?.winnerId === player1.id
                            ? match.eloChanges.player1NewElo
                            : match.eloChanges.player2NewElo}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1 text-right">
                        {getEloDescription(
                          match.score?.winnerId === player1.id
                            ? match.eloChanges.player1NewElo
                            : match.eloChanges.player2NewElo
                        )}
                      </div>
                    </div>

                    {/* Loser Elo */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">
                          {loser.name} (Loser)
                        </span>
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-5 w-5 text-red-600" />
                          <span className="text-xl font-bold text-red-600">
                            {formatEloChange(
                              match.score?.winnerId === player1.id
                                ? match.eloChanges.player2Change
                                : match.eloChanges.player1Change
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-gray-200 to-red-500 h-8 rounded-full flex items-center justify-between px-4 text-sm font-medium">
                        <span className="text-gray-700">
                          {match.score?.winnerId === player1.id
                            ? match.eloChanges.player2NewElo -
                              match.eloChanges.player2Change
                            : match.eloChanges.player1NewElo -
                              match.eloChanges.player1Change}
                        </span>
                        <span className="text-white">
                          {match.score?.winnerId === player1.id
                            ? match.eloChanges.player2NewElo
                            : match.eloChanges.player1NewElo}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1 text-right">
                        {getEloDescription(
                          match.score?.winnerId === player1.id
                            ? match.eloChanges.player2NewElo
                            : match.eloChanges.player1NewElo
                        )}
                      </div>
                    </div>

                    {/* Pre-match prediction */}
                    <div className="bg-blue-50 rounded-lg p-4 mt-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Pre-Match Win Probability
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>{player1.name}</span>
                        <span className="font-bold">
                          {(player1WinProb * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${player1WinProb * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span>{player2.name}</span>
                        <span className="font-bold">
                          {((1 - player1WinProb) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Location Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Match Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <div className="font-semibold text-gray-900">
                    {match.location.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {match.location.city}, {match.location.state}
                  </div>
                </div>

                {match.surface && (
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      Surface
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {match.surface}
                    </Badge>
                  </div>
                )}

                {match.notes && (
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Notes</div>
                    <p className="text-sm text-gray-700">{match.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Set-by-Set Breakdown */}
            {match.score && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Set Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {match.score.sets.map((set, idx) => (
                      <div key={idx}>
                        <div className="text-sm font-medium text-gray-600 mb-1">
                          Set {idx + 1}
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 rounded p-2">
                          <span className="text-sm">
                            {player1.name.split(' ')[0]}
                          </span>
                          <span className="font-bold text-lg">
                            {set.player1Games}
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 rounded p-2 mt-1">
                          <span className="text-sm">
                            {player2.name.split(' ')[0]}
                          </span>
                          <span className="font-bold text-lg">
                            {set.player2Games}
                          </span>
                        </div>
                        {set.tiebreak && (
                          <div className="text-xs text-gray-600 mt-1 text-center">
                            Tiebreak: {set.tiebreak.player1Points}-
                            {set.tiebreak.player2Points}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

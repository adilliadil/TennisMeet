'use client';

import React, { useState, useEffect } from 'react';
import { TimeBlock } from '@/types';
import { mockTimeBlocks, mockPlayers } from '@/lib/mockData';
import { seedTimeBlocks, getAllTimeBlocks } from '@/lib/availabilityManager';
import AvailabilityCalendar from '@/components/calendar/AvailabilityCalendar';
import TimeBlockEditor from '@/components/calendar/TimeBlockEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Clock, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AvailabilityPage() {
  // Initialize with mock data
  useEffect(() => {
    seedTimeBlocks(mockTimeBlocks);
  }, []);

  const [selectedPlayerId, setSelectedPlayerId] = useState('1');
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedBlock, setSelectedBlock] = useState<TimeBlock>();
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Load time blocks when player changes
  useEffect(() => {
    const blocks = getAllTimeBlocks().filter(
      (block) => block.playerId === selectedPlayerId
    );
    setTimeBlocks(blocks);
  }, [selectedPlayerId]);

  const selectedPlayer = mockPlayers.find((p) => p.id === selectedPlayerId);

  const handleAddAvailability = () => {
    setSelectedBlock(undefined);
    setIsEditorOpen(true);
  };

  const handleEditBlock = (block: TimeBlock) => {
    setSelectedBlock(block);
    setIsEditorOpen(true);
  };

  const handleSaveBlock = (block: TimeBlock) => {
    // Refresh time blocks
    const blocks = getAllTimeBlocks().filter(
      (b) => b.playerId === selectedPlayerId
    );
    setTimeBlocks(blocks);
  };

  const handleDeleteBlock = (blockId: string) => {
    // Refresh time blocks
    const blocks = getAllTimeBlocks().filter(
      (b) => b.playerId === selectedPlayerId
    );
    setTimeBlocks(blocks);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Get upcoming availability
  const upcomingBlocks = timeBlocks
    .filter((block) => block.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Availability Calendar</h1>
              <p className="text-muted-foreground mt-2">
                Manage your tennis availability and find players to match with
              </p>
            </div>
            <Button onClick={handleAddAvailability} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Add Availability
            </Button>
          </div>

          {/* Player selector */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                {selectedPlayer && (
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={selectedPlayer.profileImage} alt={selectedPlayer.name} />
                    <AvatarFallback>{selectedPlayer.name[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">
                    Viewing availability for:
                  </label>
                  <Select value={selectedPlayerId} onValueChange={setSelectedPlayerId}>
                    <SelectTrigger className="w-full max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPlayers.slice(0, 10).map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          <div className="flex items-center gap-2">
                            <span>{player.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {player.skillLevel}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar - takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <AvailabilityCalendar
              playerId={selectedPlayerId}
              timeBlocks={timeBlocks}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              onTimeBlockClick={handleEditBlock}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Player stats */}
            {selectedPlayer && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Player Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Skill Level</span>
                      <Badge>{selectedPlayer.skillLevel}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Elo Rating</span>
                      <span className="font-semibold">{selectedPlayer.stats?.elo || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Win Rate</span>
                      <span className="font-semibold">
                        {selectedPlayer.stats?.winRate?.toFixed(1) || '0'}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Matches Played</span>
                      <span className="font-semibold">
                        {selectedPlayer.stats?.matchesPlayed || 0}
                      </span>
                    </div>
                  </div>

                  {selectedPlayer.bio && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground">{selectedPlayer.bio}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Upcoming availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Upcoming Availability
                </CardTitle>
                <CardDescription>Next 5 available time slots</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingBlocks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No upcoming availability</p>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={handleAddAvailability}
                      className="mt-2"
                    >
                      Add some time slots
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingBlocks.map((block) => (
                      <div
                        key={block.id}
                        onClick={() => handleEditBlock(block)}
                        className="p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              {block.date.toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {block.startTime} - {block.endTime}
                            </p>
                          </div>
                          {block.isRecurring && (
                            <Badge variant="secondary" className="text-xs">
                              Recurring
                            </Badge>
                          )}
                        </div>
                        {block.notes && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                            {block.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Availability Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Time Blocks</span>
                  <Badge variant="outline">{timeBlocks.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Upcoming Slots</span>
                  <Badge variant="outline">
                    {timeBlocks.filter((b) => b.date >= new Date()).length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Recurring Blocks</span>
                  <Badge variant="outline">
                    {timeBlocks.filter((b) => b.isRecurring).length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Time Block Editor Dialog */}
      <TimeBlockEditor
        playerId={selectedPlayerId}
        block={selectedBlock}
        initialDate={selectedDate}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedBlock(undefined);
        }}
        onSave={handleSaveBlock}
        onDelete={handleDeleteBlock}
      />
    </div>
  );
}

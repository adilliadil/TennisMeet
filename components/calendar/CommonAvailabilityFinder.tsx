'use client';

import React, { useState, useMemo } from 'react';
import { User, AvailabilitySlot } from '@/types';
import { findCommonAvailability } from '@/lib/availabilityManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, Users, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CommonAvailabilityFinderProps {
  player1: User;
  player2: User;
  onScheduleMatch?: (slot: AvailabilitySlot) => void;
  className?: string;
}

export default function CommonAvailabilityFinder({
  player1,
  player2,
  onScheduleMatch,
  className,
}: CommonAvailabilityFinderProps) {
  const today = new Date();
  const twoWeeksLater = new Date(today);
  twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);

  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: today,
    end: twoWeeksLater,
  });
  const [minDuration, setMinDuration] = useState(60); // minutes

  // Find common availability
  const commonAvailability = useMemo(() => {
    return findCommonAvailability(
      player1.id,
      player2.id,
      dateRange.start,
      dateRange.end,
      minDuration
    );
  }, [player1.id, player2.id, dateRange, minDuration]);

  // Group slots by date
  const slotsByDate = useMemo(() => {
    const grouped = new Map<string, AvailabilitySlot[]>();

    commonAvailability.matchingSlots.forEach((slot) => {
      const dateKey = format(slot.date, 'yyyy-MM-dd');
      const existing = grouped.get(dateKey) || [];
      grouped.set(dateKey, [...existing, slot]);
    });

    return grouped;
  }, [commonAvailability.matchingSlots]);

  const handleDateRangeUpdate = (days: number) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + days);
    setDateRange({ start, end });
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Players header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Find Common Availability
          </CardTitle>
          <CardDescription>
            Find times when both players are available to play
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="w-16 h-16">
                <AvatarImage src={player1.profileImage} alt={player1.name} />
                <AvatarFallback>{player1.name[0]}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="font-medium">{player1.name}</p>
                <p className="text-sm text-muted-foreground">
                  Elo: {player1.stats?.elo || 'N/A'}
                </p>
              </div>
            </div>

            <div className="text-2xl text-muted-foreground">vs</div>

            <div className="flex flex-col items-center gap-2">
              <Avatar className="w-16 h-16">
                <AvatarImage src={player2.profileImage} alt={player2.name} />
                <AvatarFallback>{player2.name[0]}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="font-medium">{player2.name}</p>
                <p className="text-sm text-muted-foreground">
                  Elo: {player2.stats?.elo || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Search Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Time Range</label>
            <div className="flex gap-2">
              <Button
                variant={dateRange.end.getTime() - dateRange.start.getTime() === 7 * 24 * 60 * 60 * 1000 ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDateRangeUpdate(7)}
              >
                Next Week
              </Button>
              <Button
                variant={dateRange.end.getTime() - dateRange.start.getTime() === 14 * 24 * 60 * 60 * 1000 ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDateRangeUpdate(14)}
              >
                Next 2 Weeks
              </Button>
              <Button
                variant={dateRange.end.getTime() - dateRange.start.getTime() === 30 * 24 * 60 * 60 * 1000 ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDateRangeUpdate(30)}
              >
                Next Month
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Minimum Duration</label>
            <div className="flex gap-2">
              <Button
                variant={minDuration === 60 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMinDuration(60)}
              >
                1 hour
              </Button>
              <Button
                variant={minDuration === 90 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMinDuration(90)}
              >
                1.5 hours
              </Button>
              <Button
                variant={minDuration === 120 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMinDuration(120)}
              >
                2 hours
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Available Time Slots
            </span>
            <Badge variant="secondary">
              {commonAvailability.matchingSlots.length} slot{commonAvailability.matchingSlots.length !== 1 ? 's' : ''} found
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {commonAvailability.matchingSlots.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Common Availability</h3>
              <p className="text-muted-foreground max-w-md">
                No matching time slots found in the selected range. Try expanding the date range
                or reducing the minimum duration.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Array.from(slotsByDate.entries()).map(([dateKey, slots]) => (
                <div key={dateKey} className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    {format(new Date(dateKey), 'EEEE, MMMM d, yyyy')}
                  </h3>
                  <div className="grid gap-2">
                    {slots.map((slot, index) => (
                      <AvailabilitySlotCard
                        key={`${dateKey}-${index}`}
                        slot={slot}
                        onSchedule={() => onScheduleMatch?.(slot)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Availability Slot Card
interface AvailabilitySlotCardProps {
  slot: AvailabilitySlot;
  onSchedule?: () => void;
}

function AvailabilitySlotCard({ slot, onSchedule }: AvailabilitySlotCardProps) {
  const durationHours = Math.floor(slot.duration / 60);
  const durationMins = slot.duration % 60;
  const durationText =
    durationHours > 0
      ? `${durationHours}h ${durationMins > 0 ? `${durationMins}m` : ''}`
      : `${durationMins}m`;

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Clock className="w-5 h-5 text-primary" />
          <span>
            {slot.startTime} - {slot.endTime}
          </span>
        </div>
        <Badge variant="outline">{durationText}</Badge>
      </div>

      {onSchedule && (
        <Button onClick={onSchedule} size="sm">
          Schedule Match
        </Button>
      )}
    </div>
  );
}

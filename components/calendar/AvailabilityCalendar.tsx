'use client';

import React, { useState, useMemo } from 'react';
import { CalendarView, TimeBlock, CalendarDate } from '@/types';
import { buildMonthSchedule, buildWeekSchedule } from '@/lib/availabilityManager';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface AvailabilityCalendarProps {
  playerId: string;
  timeBlocks?: TimeBlock[];
  view?: CalendarView;
  onDateSelect?: (date: Date) => void;
  onTimeBlockClick?: (block: TimeBlock) => void;
  selectedDate?: Date;
  className?: string;
}

export default function AvailabilityCalendar({
  playerId,
  timeBlocks: _timeBlocks = [],
  view: initialView = 'month',
  onDateSelect,
  onTimeBlockClick,
  selectedDate,
  className,
}: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>(initialView);

  // Month navigation
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Week navigation
  const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Build schedule data
  const monthSchedule = useMemo(() => {
    if (view !== 'month') return null;
    return buildMonthSchedule(playerId, currentDate.getFullYear(), currentDate.getMonth());
  }, [playerId, currentDate, view]);

  const weekSchedule = useMemo(() => {
    if (view !== 'week') return null;
    return buildWeekSchedule(playerId, getWeekStart(currentDate));
  }, [playerId, currentDate, view]);

  // Format month/year display
  const monthYearDisplay = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const weekDisplay = weekSchedule
    ? `${weekSchedule.weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekSchedule.weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    : '';

  // Handle date click
  const handleDateClick = (date: Date) => {
    onDateSelect?.(date);
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            {view === 'month' ? monthYearDisplay : weekDisplay}
          </CardTitle>
          <Tabs value={view} onValueChange={(v) => setView(v as CalendarView)}>
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={view === 'month' ? goToPreviousMonth : goToPreviousWeek}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={view === 'month' ? goToNextMonth : goToNextWeek}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {view === 'month' && monthSchedule && (
          <MonthView
            schedule={monthSchedule}
            onDateClick={handleDateClick}
            onTimeBlockClick={onTimeBlockClick}
            selectedDate={selectedDate}
          />
        )}

        {view === 'week' && weekSchedule && (
          <WeekView
            schedule={weekSchedule}
            onDateClick={handleDateClick}
            onTimeBlockClick={onTimeBlockClick}
            selectedDate={selectedDate}
          />
        )}
      </CardContent>
    </Card>
  );
}

// Month View Component
interface MonthViewProps {
  schedule: ReturnType<typeof buildMonthSchedule>;
  onDateClick?: (date: Date) => void;
  onTimeBlockClick?: (block: TimeBlock) => void;
  selectedDate?: Date;
}

function MonthView({ schedule, onDateClick, onTimeBlockClick, selectedDate }: MonthViewProps) {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  return (
    <div className="space-y-2">
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="space-y-1">
        {schedule.weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => (
              <CalendarDay
                key={dayIndex}
                day={day}
                isSelected={selectedDate ? isSameDay(day.date, selectedDate) : false}
                onClick={() => onDateClick?.(day.date)}
                onTimeBlockClick={onTimeBlockClick}
                compact={true}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Week View Component
interface WeekViewProps {
  schedule: ReturnType<typeof buildWeekSchedule>;
  onDateClick?: (date: Date) => void;
  onTimeBlockClick?: (block: TimeBlock) => void;
  selectedDate?: Date;
}

function WeekView({ schedule, onDateClick, onTimeBlockClick, selectedDate }: WeekViewProps) {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {schedule.days.map((day, index) => (
        <div key={index} className="space-y-2">
          <div className="text-center">
            <div className="text-sm font-medium text-muted-foreground">{weekDays[index]}</div>
            <div
              className={cn(
                'text-lg font-semibold mt-1',
                day.isToday && 'text-primary',
                !day.isCurrentMonth && 'text-muted-foreground'
              )}
            >
              {day.date.getDate()}
            </div>
          </div>

          <CalendarDay
            day={day}
            isSelected={selectedDate ? isSameDay(day.date, selectedDate) : false}
            onClick={() => onDateClick?.(day.date)}
            onTimeBlockClick={onTimeBlockClick}
            compact={false}
          />
        </div>
      ))}
    </div>
  );
}

// Calendar Day Component
interface CalendarDayProps {
  day: CalendarDate;
  isSelected: boolean;
  onClick?: () => void;
  onTimeBlockClick?: (block: TimeBlock) => void;
  compact: boolean;
}

function CalendarDay({ day, isSelected, onClick, onTimeBlockClick, compact }: CalendarDayProps) {
  const handleBlockClick = (e: React.MouseEvent, block: TimeBlock) => {
    e.stopPropagation();
    onTimeBlockClick?.(block);
  };

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={cn(
          'relative min-h-[80px] p-2 rounded-lg border transition-colors',
          'hover:bg-accent hover:border-primary/50',
          'text-left',
          day.isToday && 'border-primary border-2',
          isSelected && 'bg-primary/10 border-primary',
          !day.isCurrentMonth && 'opacity-40',
          day.isWeekend && 'bg-muted/30'
        )}
      >
        <div
          className={cn(
            'text-sm font-medium mb-1',
            day.isToday && 'text-primary font-bold',
            !day.isCurrentMonth && 'text-muted-foreground'
          )}
        >
          {day.date.getDate()}
        </div>

        {day.hasAvailability && (
          <div className="space-y-1">
            {day.timeBlocks.slice(0, 2).map((block) => (
              <div
                key={block.id}
                onClick={(e) => handleBlockClick(e, block)}
                className="text-xs px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 truncate hover:bg-green-200 dark:hover:bg-green-900/50 cursor-pointer"
              >
                {block.startTime}
              </div>
            ))}
            {day.timeBlocks.length > 2 && (
              <div className="text-xs text-muted-foreground px-1.5">
                +{day.timeBlocks.length - 2} more
              </div>
            )}
          </div>
        )}
      </button>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'min-h-[200px] p-3 rounded-lg border cursor-pointer transition-colors',
        'hover:bg-accent hover:border-primary/50',
        day.isToday && 'border-primary border-2',
        isSelected && 'bg-primary/10 border-primary',
        day.isWeekend && 'bg-muted/20'
      )}
    >
      {day.hasAvailability ? (
        <div className="space-y-1.5">
          {day.timeBlocks.map((block) => (
            <div
              key={block.id}
              onClick={(e) => handleBlockClick(e, block)}
              className="text-xs px-2 py-1.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 cursor-pointer transition-colors"
            >
              <div className="font-medium">
                {block.startTime} - {block.endTime}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
          No availability
        </div>
      )}
    </div>
  );
}

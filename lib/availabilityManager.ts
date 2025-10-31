import {
  TimeBlock,
  AvailabilitySlot,
  CalendarDate,
  WeekSchedule,
  MonthSchedule,
  CommonAvailability,
  TimeBlockConflict,
  AvailabilityFilters,
  DayOfWeek,
} from '@/types';

/**
 * AvailabilityManager - Manages player availability time blocks
 * Provides CRUD operations, conflict detection, and scheduling algorithms
 */

// In-memory storage for time blocks (will be replaced with database)
let timeBlocks: TimeBlock[] = [];

// Helper function to generate unique IDs
const generateId = (): string => {
  return `tb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to parse time string to minutes
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
};

// Helper function to format minutes to time string
const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Helper function to check if two time ranges overlap
const doTimesOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean => {
  const start1Mins = timeToMinutes(start1);
  const end1Mins = timeToMinutes(end1);
  const start2Mins = timeToMinutes(start2);
  const end2Mins = timeToMinutes(end2);

  return start1Mins < end2Mins && end1Mins > start2Mins;
};

// Helper function to check if two dates are the same day
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Helper function to get day of week from date
const getDayOfWeek = (date: Date): DayOfWeek => {
  const days: DayOfWeek[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  return days[date.getDay()] as DayOfWeek;
};

/**
 * Validates a time block for logical consistency
 */
export const validateTimeBlock = (
  block: Partial<TimeBlock>
): { valid: boolean; error?: string } => {
  if (!block.startTime || !block.endTime) {
    return { valid: false, error: 'Start time and end time are required' };
  }

  const startMins = timeToMinutes(block.startTime);
  const endMins = timeToMinutes(block.endTime);

  if (startMins >= endMins) {
    return { valid: false, error: 'End time must be after start time' };
  }

  if (startMins < 0 || endMins > 1440) {
    return { valid: false, error: 'Times must be within 00:00 - 24:00' };
  }

  if (block.date && block.date < new Date()) {
    // Allow past dates within today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (block.date < today) {
      return { valid: false, error: 'Cannot create availability in the past' };
    }
  }

  return { valid: true };
};

/**
 * Detects conflicts between a new time block and existing ones
 */
export const detectConflicts = (
  newBlock: Partial<TimeBlock>,
  playerId: string
): TimeBlockConflict[] => {
  const conflicts: TimeBlockConflict[] = [];

  // Validate the time block first
  const validation = validateTimeBlock(newBlock);
  if (!validation.valid) {
    conflicts.push({
      existingBlock: {} as TimeBlock,
      newBlock,
      conflictType: 'invalid_time',
      message: validation.error || 'Invalid time block',
    });
    return conflicts;
  }

  // Check for conflicts with existing blocks
  const playerBlocks = timeBlocks.filter((block) => block.playerId === playerId);

  for (const existingBlock of playerBlocks) {
    // Skip if checking the same block (for updates)
    if (newBlock.id && existingBlock.id === newBlock.id) {
      continue;
    }

    // Check if dates match
    if (newBlock.date && isSameDay(existingBlock.date, newBlock.date)) {
      // Check for time overlap
      if (
        doTimesOverlap(
          existingBlock.startTime,
          existingBlock.endTime,
          newBlock.startTime!,
          newBlock.endTime!
        )
      ) {
        conflicts.push({
          existingBlock,
          newBlock,
          conflictType: 'overlap',
          message: `Overlaps with existing availability from ${existingBlock.startTime} to ${existingBlock.endTime}`,
        });
      }
    }
  }

  return conflicts;
};

/**
 * Creates a new time block
 */
export const createTimeBlock = (
  blockData: Omit<TimeBlock, 'id' | 'createdAt' | 'updatedAt'>
): { success: boolean; data?: TimeBlock; errors?: TimeBlockConflict[] } => {
  // Check for conflicts
  const conflicts = detectConflicts(blockData, blockData.playerId);
  if (conflicts.length > 0) {
    return { success: false, errors: conflicts };
  }

  const newBlock: TimeBlock = {
    ...blockData,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  timeBlocks.push(newBlock);

  return { success: true, data: newBlock };
};

/**
 * Updates an existing time block
 */
export const updateTimeBlock = (
  id: string,
  updates: Partial<TimeBlock>
): { success: boolean; data?: TimeBlock; errors?: TimeBlockConflict[] } => {
  const index = timeBlocks.findIndex((block) => block.id === id);

  if (index === -1) {
    return {
      success: false,
      errors: [
        {
          existingBlock: {} as TimeBlock,
          newBlock: updates,
          conflictType: 'invalid_time',
          message: 'Time block not found',
        },
      ],
    };
  }

  const existingBlock = timeBlocks[index]!;
  const updatedBlock = { ...existingBlock, ...updates, id };

  // Check for conflicts with the updated data
  const conflicts = detectConflicts(updatedBlock, existingBlock.playerId);
  if (conflicts.length > 0) {
    return { success: false, errors: conflicts };
  }

  updatedBlock.updatedAt = new Date();
  timeBlocks[index] = updatedBlock;

  return { success: true, data: updatedBlock };
};

/**
 * Deletes a time block
 */
export const deleteTimeBlock = (id: string): { success: boolean; error?: string } => {
  const index = timeBlocks.findIndex((block) => block.id === id);

  if (index === -1) {
    return { success: false, error: 'Time block not found' };
  }

  timeBlocks.splice(index, 1);
  return { success: true };
};

/**
 * Gets all time blocks for a player
 */
export const getPlayerTimeBlocks = (playerId: string): TimeBlock[] => {
  return timeBlocks.filter((block) => block.playerId === playerId);
};

/**
 * Gets time blocks within a date range
 */
export const getTimeBlocksInRange = (
  playerId: string,
  startDate: Date,
  endDate: Date
): TimeBlock[] => {
  return timeBlocks.filter((block) => {
    if (block.playerId !== playerId) return false;
    return block.date >= startDate && block.date <= endDate;
  });
};

/**
 * Filters time blocks based on criteria
 */
export const filterTimeBlocks = (filters: AvailabilityFilters): TimeBlock[] => {
  let filtered = timeBlocks;

  if (filters.playerId) {
    filtered = filtered.filter((block) => block.playerId === filters.playerId);
  }

  if (filters.dateFrom) {
    filtered = filtered.filter((block) => block.date >= filters.dateFrom!);
  }

  if (filters.dateTo) {
    filtered = filtered.filter((block) => block.date <= filters.dateTo!);
  }

  if (filters.dayOfWeek) {
    filtered = filtered.filter(
      (block) => getDayOfWeek(block.date) === filters.dayOfWeek
    );
  }

  if (filters.minDuration) {
    filtered = filtered.filter((block) => {
      const duration = timeToMinutes(block.endTime) - timeToMinutes(block.startTime);
      return duration >= filters.minDuration!;
    });
  }

  return filtered;
};

/**
 * Generates recurring time blocks based on pattern
 */
export const generateRecurringBlocks = (
  baseBlock: TimeBlock,
  untilDate: Date
): TimeBlock[] => {
  if (!baseBlock.isRecurring || !baseBlock.recurringPattern) {
    return [baseBlock];
  }

  const generatedBlocks: TimeBlock[] = [];
  const pattern = baseBlock.recurringPattern;
  const endDate = pattern.endDate || untilDate;
  let currentDate = new Date(baseBlock.date);

  while (currentDate <= endDate) {
    // Create block for this date
    const block: TimeBlock = {
      ...baseBlock,
      id: `${baseBlock.id}_${currentDate.getTime()}`,
      date: new Date(currentDate),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    generatedBlocks.push(block);

    // Move to next occurrence
    if (pattern.frequency === 'weekly') {
      currentDate.setDate(currentDate.getDate() + 7);
    } else if (pattern.frequency === 'biweekly') {
      currentDate.setDate(currentDate.getDate() + 14);
    } else if (pattern.frequency === 'monthly') {
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  }

  return generatedBlocks;
};

/**
 * Finds common availability between two players
 */
export const findCommonAvailability = (
  player1Id: string,
  player2Id: string,
  startDate: Date,
  endDate: Date,
  minDuration: number = 60 // minimum 60 minutes
): CommonAvailability => {
  const player1Blocks = getTimeBlocksInRange(player1Id, startDate, endDate);
  const player2Blocks = getTimeBlocksInRange(player2Id, startDate, endDate);

  const matchingSlots: AvailabilitySlot[] = [];

  // Compare each pair of time blocks
  for (const block1 of player1Blocks) {
    for (const block2 of player2Blocks) {
      // Check if on the same day
      if (!isSameDay(block1.date, block2.date)) continue;

      // Find overlap
      const start1 = timeToMinutes(block1.startTime);
      const end1 = timeToMinutes(block1.endTime);
      const start2 = timeToMinutes(block2.startTime);
      const end2 = timeToMinutes(block2.endTime);

      const overlapStart = Math.max(start1, start2);
      const overlapEnd = Math.min(end1, end2);
      const overlapDuration = overlapEnd - overlapStart;

      if (overlapDuration >= minDuration) {
        matchingSlots.push({
          date: new Date(block1.date),
          startTime: minutesToTime(overlapStart),
          endTime: minutesToTime(overlapEnd),
          duration: overlapDuration,
          isAvailable: true,
        });
      }
    }
  }

  // Sort by date and time
  matchingSlots.sort((a, b) => {
    const dateCompare = a.date.getTime() - b.date.getTime();
    if (dateCompare !== 0) return dateCompare;
    return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
  });

  return {
    player1Id,
    player2Id,
    matchingSlots,
  };
};

/**
 * Builds a calendar month view with availability data
 */
export const buildMonthSchedule = (
  playerId: string,
  year: number,
  month: number
): MonthSchedule => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get all time blocks for this month
  const monthBlocks = getTimeBlocksInRange(playerId, firstDay, lastDay);

  // Build calendar grid (weeks)
  const weeks: CalendarDate[][] = [];
  let currentWeek: CalendarDate[] = [];

  // Start from the first day of the week containing the first day of month
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  // Continue until we've covered the entire month
  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

  let current = new Date(startDate);

  while (current <= endDate) {
    const dayBlocks = monthBlocks.filter((block) => isSameDay(block.date, current));

    const calendarDate: CalendarDate = {
      date: new Date(current),
      isCurrentMonth: current.getMonth() === month,
      isToday: isSameDay(current, today),
      isWeekend: current.getDay() === 0 || current.getDay() === 6,
      hasAvailability: dayBlocks.length > 0,
      timeBlocks: dayBlocks,
    };

    currentWeek.push(calendarDate);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    current.setDate(current.getDate() + 1);
  }

  return {
    month,
    year,
    weeks,
  };
};

/**
 * Builds a week schedule view with availability data
 */
export const buildWeekSchedule = (
  playerId: string,
  weekStart: Date
): WeekSchedule => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const weekBlocks = getTimeBlocksInRange(playerId, weekStart, weekEnd);

  const days: CalendarDate[] = [];
  let current = new Date(weekStart);

  for (let i = 0; i < 7; i++) {
    const dayBlocks = weekBlocks.filter((block) => isSameDay(block.date, current));

    days.push({
      date: new Date(current),
      isCurrentMonth: true,
      isToday: isSameDay(current, today),
      isWeekend: current.getDay() === 0 || current.getDay() === 6,
      hasAvailability: dayBlocks.length > 0,
      timeBlocks: dayBlocks,
    });

    current.setDate(current.getDate() + 1);
  }

  return {
    weekStart,
    weekEnd,
    days,
  };
};

/**
 * Gets suggested time slots based on player's typical availability patterns
 */
export const getSuggestedTimeSlots = (
  playerId: string,
  targetDate: Date
): string[] => {
  // Get historical blocks for the same day of week
  const dayOfWeek = getDayOfWeek(targetDate);
  const historicalBlocks = timeBlocks.filter(
    (block) =>
      block.playerId === playerId && getDayOfWeek(block.date) === dayOfWeek
  );

  // Count frequency of time slots
  const timeSlotCounts: { [key: string]: number } = {};

  historicalBlocks.forEach((block) => {
    const key = `${block.startTime}-${block.endTime}`;
    timeSlotCounts[key] = (timeSlotCounts[key] || 0) + 1;
  });

  // Sort by frequency and return top suggestions
  return Object.entries(timeSlotCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([timeSlot]) => timeSlot);
};

/**
 * Clears all time blocks (for testing)
 */
export const clearAllTimeBlocks = (): void => {
  timeBlocks = [];
};

/**
 * Seeds time blocks with mock data (for development)
 */
export const seedTimeBlocks = (blocks: TimeBlock[]): void => {
  timeBlocks = [...blocks];
};

/**
 * Gets all time blocks (for debugging)
 */
export const getAllTimeBlocks = (): TimeBlock[] => {
  return [...timeBlocks];
};

'use client';

import React, { useState, useEffect } from 'react';
import { TimeBlock, DayOfWeek } from '@/types';
import { createTimeBlock, updateTimeBlock, deleteTimeBlock, validateTimeBlock } from '@/lib/availabilityManager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface TimeBlockEditorProps {
  playerId: string;
  block?: TimeBlock;
  initialDate?: Date;
  isOpen: boolean;
  onClose: () => void;
  onSave: (block: TimeBlock) => void;
  onDelete?: (blockId: string) => void;
}

export default function TimeBlockEditor({
  playerId,
  block,
  initialDate,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: TimeBlockEditorProps) {
  const [date, setDate] = useState<Date>(block?.date || initialDate || new Date());
  const [startTime, setStartTime] = useState(block?.startTime || '09:00');
  const [endTime, setEndTime] = useState(block?.endTime || '11:00');
  const [notes, setNotes] = useState(block?.notes || '');
  const [isRecurring, setIsRecurring] = useState(block?.isRecurring || false);
  const [frequency, setFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>(
    block?.recurringPattern?.frequency || 'weekly'
  );
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(
    block?.recurringPattern?.daysOfWeek || []
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    block?.recurringPattern?.endDate
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEditing = !!block;

  // Reset form when block changes
  useEffect(() => {
    if (block) {
      setDate(block.date);
      setStartTime(block.startTime);
      setEndTime(block.endTime);
      setNotes(block.notes || '');
      setIsRecurring(block.isRecurring);
      setFrequency(block.recurringPattern?.frequency || 'weekly');
      setSelectedDays(block.recurringPattern?.daysOfWeek || []);
      setEndDate(block.recurringPattern?.endDate);
    } else if (initialDate) {
      setDate(initialDate);
    }
  }, [block, initialDate]);

  const daysOfWeek: { value: DayOfWeek; label: string }[] = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
  ];

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    setErrors([]);

    const blockData = {
      playerId,
      date,
      startTime,
      endTime,
      isRecurring,
      recurringPattern: isRecurring
        ? {
            frequency,
            daysOfWeek: selectedDays,
            endDate,
          }
        : undefined,
      notes,
    };

    // Validate
    const validation = validateTimeBlock(blockData);
    if (!validation.valid) {
      setErrors([validation.error || 'Invalid time block']);
      return;
    }

    if (isRecurring && selectedDays.length === 0) {
      setErrors(['Please select at least one day for recurring availability']);
      return;
    }

    let result;
    if (isEditing && block) {
      result = updateTimeBlock(block.id, blockData);
    } else {
      result = createTimeBlock({
        ...blockData,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Omit<TimeBlock, 'id'>);
    }

    if (!result.success) {
      setErrors(result.errors?.map((e) => e.message) || ['Failed to save']);
      return;
    }

    if (result.data) {
      onSave(result.data);
      handleClose();
    }
  };

  const handleDelete = () => {
    if (block && onDelete) {
      const result = deleteTimeBlock(block.id);
      if (result.success) {
        onDelete(block.id);
        handleClose();
      } else {
        setErrors([result.error || 'Failed to delete']);
      }
    }
  };

  const handleClose = () => {
    setErrors([]);
    setShowDeleteConfirm(false);
    onClose();
  };

  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      timeOptions.push(timeStr);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Availability' : 'Add Availability'}
          </DialogTitle>
          <DialogDescription>
            Set your available time for tennis matches
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Error display */}
          {errors.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <X className="w-4 h-4 text-destructive mt-0.5" />
                <div className="flex-1">
                  {errors.map((error, index) => (
                    <p key={index} className="text-sm text-destructive">
                      {error}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Date picker */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger id="start-time">
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger id="end-time">
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Recurring toggle */}
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="recurring">Recurring Availability</Label>
              <p className="text-sm text-muted-foreground">
                Repeat this availability on a schedule
              </p>
            </div>
            <Switch
              id="recurring"
              checked={isRecurring}
              onCheckedChange={setIsRecurring}
            />
          </div>

          {/* Recurring options */}
          {isRecurring && (
            <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select value={frequency} onValueChange={(v: any) => setFrequency(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Repeat on</Label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map(({ value, label }) => (
                    <Button
                      key={value}
                      type="button"
                      variant={selectedDays.includes(value) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleDay(value)}
                    >
                      {label.slice(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>End Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !endDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'PPP') : <span>No end date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(d) => d < date}
                    />
                  </PopoverContent>
                </Popover>
                {endDate && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setEndDate(undefined)}
                    className="w-full"
                  >
                    Clear end date
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information about this availability..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {isEditing && !showDeleteConfirm && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              className="sm:mr-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}

          {showDeleteConfirm && (
            <div className="flex gap-2 sm:mr-auto">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                size="sm"
              >
                Confirm Delete
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                size="sm"
              >
                Cancel
              </Button>
            </div>
          )}

          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            {isEditing ? 'Save Changes' : 'Add Availability'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useCallback } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isFuture, getDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HoursInputDialog } from './HoursInputDialog';

interface StudyCalendarProps {
  getHoursForDate: (date: Date) => number;
  getRunningAverageUntil: (date: Date) => number;
  onLogHours: (date: Date, hours: number) => void;
}

function getHeatmapClass(hours: number): string {
  if (hours === 0) return 'bg-heatmap-0';
  if (hours < 2) return 'bg-heatmap-1';
  if (hours < 4) return 'bg-heatmap-2';
  if (hours < 6) return 'bg-heatmap-3';
  if (hours < 8) return 'bg-heatmap-4';
  return 'bg-heatmap-5';
}

function getHeatmapTextClass(hours: number): string {
  if (hours === 0) return 'text-muted-foreground';
  if (hours < 4) return 'text-secondary-foreground';
  return 'text-primary-foreground';
}

export function StudyCalendar({ getHoursForDate, getRunningAverageUntil, onLogHours }: StudyCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
  const startDayOfWeek = getDay(monthStart);
  // Adjust for Monday start (0 = Monday, 6 = Sunday)
  const paddingDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const handlePreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDayClick = useCallback((date: Date) => {
    if (!isFuture(date)) {
      setSelectedDate(date);
    }
  }, []);

  const handleSaveHours = useCallback((hours: number) => {
    if (selectedDate) {
      onLogHours(selectedDate, hours);
      setSelectedDate(null);
    }
  }, [selectedDate, onLogHours]);

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="w-full">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-display font-semibold text-foreground">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePreviousMonth}
            className="h-9 w-9 rounded-lg hover:bg-accent"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            className="h-9 w-9 rounded-lg hover:bg-accent"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Padding for days before month start */}
        {Array.from({ length: paddingDays }).map((_, i) => (
          <div key={`pad-${i}`} className="aspect-square" />
        ))}
        
        {days.map(day => {
          const hours = getHoursForDate(day);
          const isCurrentDay = isToday(day);
          const isFutureDay = isFuture(day);
          const isHovered = hoveredDate && format(hoveredDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
          const runningAverage = getRunningAverageUntil(day);

          return (
            <div
              key={format(day, 'yyyy-MM-dd')}
              className="relative group"
              onMouseEnter={() => setHoveredDate(day)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              <button
                onClick={() => handleDayClick(day)}
                disabled={isFutureDay}
                className={cn(
                  "w-full aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all duration-200",
                  getHeatmapClass(hours),
                  isCurrentDay && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                  isFutureDay && "opacity-40 cursor-not-allowed",
                  !isFutureDay && "hover:scale-105 hover:shadow-md cursor-pointer"
                )}
              >
                <span className={cn(
                  "text-sm font-medium",
                  getHeatmapTextClass(hours)
                )}>
                  {format(day, 'd')}
                </span>
                {hours > 0 && (
                  <span className={cn(
                    "text-xs font-medium",
                    getHeatmapTextClass(hours),
                    "opacity-80"
                  )}>
                    {hours}h
                  </span>
                )}
              </button>

              {/* Tooltip with running average */}
              {isHovered && !isFutureDay && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 animate-fade-in">
                  <div className="bg-card border border-border rounded-lg shadow-elevated px-3 py-2 text-center whitespace-nowrap">
                    <p className="text-xs text-muted-foreground">Avg until this day</p>
                    <p className="text-sm font-semibold text-foreground">
                      {runningAverage.toFixed(2)} hrs/day
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hours Input Dialog */}
      <HoursInputDialog
        open={selectedDate !== null}
        onOpenChange={(open) => !open && setSelectedDate(null)}
        date={selectedDate}
        currentHours={selectedDate ? getHoursForDate(selectedDate) : 0}
        onSave={handleSaveHours}
      />
    </div>
  );
}

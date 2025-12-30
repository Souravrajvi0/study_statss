import { useState, useEffect, useCallback } from 'react';
import { format, differenceInDays, parseISO, startOfWeek, endOfWeek, subWeeks, isWithinInterval, isBefore, isAfter } from 'date-fns';
import { supabase } from '../supabaseClient';

export interface StudyEntry {
  date: string; // YYYY-MM-DD format
  hours: number;
}

export interface WeeklyData {
  week: number;
  weekStart: string;
  average: number;
}

const START_DATE_KEY = 'study-tracker-start-date';

export function useStudyData() {
  const [entries, setEntries] = useState<StudyEntry[]>([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load start date from localStorage
  useEffect(() => {
    const storedStartDate = localStorage.getItem(START_DATE_KEY);
    if (storedStartDate) {
      setStartDate(storedStartDate);
    }
  }, []);

  // Load data from Supabase on mount
  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const { data, error } = await supabase
      .from('study_logs')
      .select('date, hours')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error loading entries:', error);
    } else {
      setEntries(data || []);
    }
    setIsLoaded(true);
  };

  // Save start date to localStorage
  useEffect(() => {
    if (startDate) {
      localStorage.setItem(START_DATE_KEY, startDate);
    }
  }, [startDate]);

  const logHours = useCallback(async (date: Date, additionalHours: number) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Set start date if this is the first entry
    if (!startDate || isBefore(date, parseISO(startDate))) {
      setStartDate(dateStr);
    }

    // Get current hours for this date
    const currentEntry = entries.find(e => e.date === dateStr);
    const currentHours = currentEntry ? currentEntry.hours : 0;
    const newHours = Math.max(0, currentHours + additionalHours); // Prevent negative

    // Update local state
    setEntries(prev => {
      const existingIndex = prev.findIndex(e => e.date === dateStr);
      if (existingIndex >= 0) {
        const updated = [...prev];
        if (newHours === 0) {
          updated.splice(existingIndex, 1); // Remove if 0
        } else {
          updated[existingIndex] = { date: dateStr, hours: newHours };
        }
        return updated;
      } else if (newHours > 0) {
        return [...prev, { date: dateStr, hours: newHours }];
      }
      return prev;
    });

    // Save to Supabase
    if (newHours === 0) {
      // Delete from DB
      await supabase
        .from('study_logs')
        .delete()
        .eq('date', dateStr);
    } else {
      // Upsert
      await supabase
        .from('study_logs')
        .upsert({
          date: dateStr,
          hours: newHours
        });
    }
  }, [startDate, entries]);

  const getHoursForDate = useCallback((date: Date): number => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const entry = entries.find(e => e.date === dateStr);
    return entry?.hours ?? 0;
  }, [entries]);

  // Calculate lifetime average (total hours / total days since start)
  const getLifetimeAverage = useCallback((): number => {
    if (!startDate || entries.length === 0) return 0;
    
    const start = parseISO(startDate);
    const today = new Date();
    const totalDays = differenceInDays(today, start) + 1; // Include start day
    const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
    
    return totalHours / totalDays;
  }, [entries, startDate]);

  // Calculate running average up to a specific date
  const getRunningAverageUntil = useCallback((date: Date): number => {
    if (!startDate) return 0;
    
    const start = parseISO(startDate);
    if (isBefore(date, start)) return 0;
    
    const totalDays = differenceInDays(date, start) + 1;
    const relevantEntries = entries.filter(e => {
      const entryDate = parseISO(e.date);
      return !isBefore(entryDate, start) && !isAfter(entryDate, date);
    });
    
    const totalHours = relevantEntries.reduce((sum, e) => sum + e.hours, 0);
    return totalHours / totalDays;
  }, [entries, startDate]);

  // Get weekly average for a specific week (always divide by 7)
  const getWeeklyAverage = useCallback((weekStart: Date): number => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    
    const weekEntries = entries.filter(e => {
      const entryDate = parseISO(e.date);
      return isWithinInterval(entryDate, { start: weekStart, end: weekEnd });
    });
    
    const totalHours = weekEntries.reduce((sum, e) => sum + e.hours, 0);
    return totalHours / 7; // Always divide by 7
  }, [entries]);

  // Get current week average
  const getCurrentWeekAverage = useCallback((): number => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    return getWeeklyAverage(weekStart);
  }, [getWeeklyAverage]);

  // Get last week average
  const getLastWeekAverage = useCallback((): number => {
    const lastWeekStart = startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 });
    return getWeeklyAverage(lastWeekStart);
  }, [getWeeklyAverage]);

  // Get week over week change percentage
  const getWeekOverWeekChange = useCallback((): number => {
    const current = getCurrentWeekAverage();
    const last = getLastWeekAverage();
    
    if (last === 0) return current > 0 ? 100 : 0;
    return ((current - last) / last) * 100;
  }, [getCurrentWeekAverage, getLastWeekAverage]);

  // Get weekly data for the chart (last 8 weeks)
  const getWeeklyChartData = useCallback((): WeeklyData[] => {
    const weeks: WeeklyData[] = [];
    
    for (let i = 7; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 });
      weeks.push({
        week: 8 - i,
        weekStart: format(weekStart, 'MMM d'),
        average: getWeeklyAverage(weekStart),
      });
    }
    
    return weeks;
  }, [getWeeklyAverage]);

  // Get total days since start
  const getTotalDays = useCallback((): number => {
    if (!startDate) return 0;
    return differenceInDays(new Date(), parseISO(startDate)) + 1;
  }, [startDate]);

  // Get total hours
  const getTotalHours = useCallback((): number => {
    return entries.reduce((sum, e) => sum + e.hours, 0);
  }, [entries]);

  return {
    entries,
    isLoaded,
    startDate,
    logHours,
    getHoursForDate,
    getLifetimeAverage,
    getRunningAverageUntil,
    getCurrentWeekAverage,
    getLastWeekAverage,
    getWeekOverWeekChange,
    getWeeklyChartData,
    getTotalDays,
    getTotalHours,
  };
}

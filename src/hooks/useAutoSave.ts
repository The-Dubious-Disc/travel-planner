import { useEffect, useRef } from 'react';
import { useTripStore } from '@/store/useTripStore';
import { createClient } from '@/lib/supabase/client';

export function useAutoSave() {
  const { 
    currentTripId, 
    tripName, 
    cities, 
    startDate, 
    totalDays, 
    setLastSaved 
  } = useTripStore();
  
  const supabase = createClient();
  const firstRender = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (!currentTripId) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce save (2 seconds)
    timeoutRef.current = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('trips')
          .update({
            name: tripName,
            cities: cities,
            start_date: startDate ? startDate.toISOString() : null,
            total_days: totalDays,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentTripId);

        if (error) throw error;
        
        setLastSaved(new Date());
      } catch (error) {
        console.error('Error auto-saving trip:', error);
      }
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentTripId, tripName, cities, startDate, totalDays, setLastSaved]);
}
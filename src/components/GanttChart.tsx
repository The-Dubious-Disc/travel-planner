'use client';

import { useTripStore } from '@/store/useTripStore';
import { format, addDays } from 'date-fns';

const COLORS = [
  'bg-blue-500 border-blue-600',
  'bg-emerald-500 border-emerald-600',
  'bg-amber-500 border-amber-600',
  'bg-purple-500 border-purple-600',
  'bg-rose-500 border-rose-600',
  'bg-indigo-500 border-indigo-600',
  'bg-cyan-500 border-cyan-600',
  'bg-orange-500 border-orange-600',
];

export default function GanttChart() {
  const { cities, startDate } = useTripStore();

  if (cities.length === 0) {
    return null;
  }

  // Calculate timeline data
  let currentOffset = 0;
  const timelineData = cities.map((city, index) => {
    const startOffset = currentOffset;
    const endOffset = currentOffset + city.days;
    
    // Calculate dates if startDate exists
    const start = startDate ? addDays(startDate, startOffset) : null;
    const end = startDate ? addDays(startDate, endOffset - 1) : null; // Inclusive end date for display
    
    // Update offset for next city
    currentOffset += city.days;

    return {
      ...city,
      start,
      end,
      color: COLORS[index % COLORS.length],
      startDayIdx: startOffset + 1,
      endDayIdx: endOffset
    };
  });

  // Scale: 1 day = X pixels (or percentage). 
  // For scrolling, let's use a fixed min-width per day.
  // Using flex-basis/width relative to total days might be too small for long trips.
  // Let's use a dynamic grid or flex with width styles.
  
  const DAY_WIDTH_PX = 60; // Wide enough for a label if needed, or just visual bulk
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Trip Timeline</h2>
      
      <div className="w-full overflow-x-auto pb-4">
        {/* Container for the chart */}
        <div 
          className="flex h-32 relative min-w-max"
          style={{ width: `${Math.max(100, currentOffset * DAY_WIDTH_PX)}px` }}
        >
          {timelineData.map((item) => (
            <div
              key={item.id}
              className={`relative h-16 mt-8 first:rounded-l-lg last:rounded-r-lg shadow-sm border-b-4 border-r border-white/20 transition-all hover:brightness-110 group ${item.color}`}
              style={{ width: `${item.days * DAY_WIDTH_PX}px` }}
            >
              {/* Label inside bar */}
              <div className="absolute inset-0 flex items-center justify-center p-1">
                <span className="text-white font-medium text-sm truncate px-1 shadow-sm">
                  {item.name}
                </span>
              </div>

              {/* Tooltip / Details on Hover or static below */}
              <div className="absolute -top-7 left-0 text-xs font-semibold text-gray-500 whitespace-nowrap">
                {item.start && item.end ? (
                   format(item.start, 'MMM d')
                ) : (
                  `Day ${item.startDayIdx}`
                )}
              </div>
              
              {/* Duration pill */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {item.days} days
              </div>
            </div>
          ))}
          
          {/* End Date Marker */}
          <div className="absolute -top-7 right-0 translate-x-1/2 text-xs font-semibold text-gray-500">
             {timelineData.length > 0 && (
               timelineData[timelineData.length - 1].end 
                 ? format(addDays(timelineData[timelineData.length - 1].end!, 1), 'MMM d') // The day they leave / trip over
                 : `Day ${currentOffset + 1}`
             )}
          </div>
        </div>
        
        {/* Legend / Info if needed */}
        <div className="mt-6 text-sm text-gray-400 flex gap-4">
           <span>Total: {currentOffset} days</span>
        </div>
      </div>
    </div>
  );
}

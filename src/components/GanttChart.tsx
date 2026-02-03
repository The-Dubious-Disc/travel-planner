'use client';

import { useTripStore } from '@/store/useTripStore';
import { useTranslation } from '@/hooks/useTranslation';
import { format, addDays } from 'date-fns';

interface TimelineItem {
  id: string;
  name: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
  days: number;
  start: Date | null;
  end: Date | null;
  color: string;
  startOffset: number;
  endOffset: number;
}

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
  const { t } = useTranslation();

  if (cities.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center h-64">
        <p className="text-gray-400">{t('gantt.empty')}</p>
      </div>
    );
  }

  // Calculate timeline data
  const { timeline: timelineData, totalDays } = cities.reduce((acc: { timeline: TimelineItem[], currentOffset: number, totalDays: number }, city, index) => {
    const startOffset = acc.currentOffset;
    const endOffset = acc.currentOffset + city.days;
    
    // Calculate dates if startDate exists
    const start = startDate ? addDays(startDate, startOffset) : null;
    const end = startDate ? addDays(startDate, endOffset - 1) : null; 
    
    acc.timeline.push({
      ...city,
      start,
      end,
      color: COLORS[index % COLORS.length],
      startOffset,
      endOffset,
      days: city.days
    });
    
    acc.currentOffset += city.days;
    acc.totalDays = acc.currentOffset;
    return acc;
  }, { timeline: [], currentOffset: 0, totalDays: 0 });

  const DAY_WIDTH_PX = 40; // Narrower since we are stacking
  const ROW_HEIGHT = 48; // Height of each row
  
  const chartWidth = Math.max(800, totalDays * DAY_WIDTH_PX + 100); // Minimum width to look good

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl font-bold text-gray-900">{t('gantt.title')}</h2>
        <div className="text-sm text-gray-500">
           {t('gantt.total')}: <span className="font-semibold text-gray-900">{totalDays} {t('summary.days')}</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto overflow-y-hidden w-full">
        <div className="relative pt-12 pb-8 min-h-[300px]" style={{ minWidth: `${chartWidth}px` }}>
          
          {/* Grid Lines (Optional background) */}
          <div className="absolute inset-0 flex pointer-events-none" style={{ width: `${totalDays * DAY_WIDTH_PX}px`, top: '48px' }}>
            {Array.from({ length: totalDays + 1 }).map((_, i) => (
              <div 
                key={i} 
                className="h-full border-l border-dashed border-gray-100 first:border-solid first:border-gray-200" 
                style={{ left: `${i * DAY_WIDTH_PX}px`, position: 'absolute' }}
              />
            ))}
          </div>

          {/* Waterfall Rows */}
          <div className="space-y-4 pt-2 relative z-10">
            {timelineData.map((item, index) => (
              <div key={item.id} className="relative flex items-center" style={{ height: `${ROW_HEIGHT}px` }}>
                
                {/* Connecting Line from previous (if not first) */}
                {index > 0 && (
                  <div 
                    className="absolute border-l-2 border-b-2 border-gray-300 rounded-bl-lg -z-10"
                    style={{
                      top: `-${ROW_HEIGHT / 2 + 10}px`, 
                      left: `${item.startOffset * DAY_WIDTH_PX}px`,
                      width: '16px', // Small curve hook
                      height: `${ROW_HEIGHT / 2 + 26}px`
                    }}
                  />
                )}

                {/* The Bar */}
                <div
                  className={`relative h-10 rounded-lg shadow-sm border border-white/20 transition-all hover:scale-[1.02] hover:shadow-md group ${item.color} flex items-center px-3 text-white`}
                  style={{ 
                    marginLeft: `${item.startOffset * DAY_WIDTH_PX}px`,
                    width: `${item.days * DAY_WIDTH_PX}px`,
                  }}
                >
                  <span className="font-medium text-sm truncate w-full">{item.name}</span>
                  
                  {/* Tooltip / Info */}
                  <div className="absolute -top-8 left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                    {item.days} {t('summary.days')} • {item.start ? format(item.start, 'MMM d') : `Day ${item.startOffset + 1}`} - {item.end ? format(item.end, 'MMM d') : `Day ${item.endOffset}`}
                  </div>
                </div>

                {/* Date Label on the right of the bar */}
                <span className="ml-3 text-xs font-medium text-gray-400 whitespace-nowrap">
                   {item.start && format(item.start, 'MMM d')}
                </span>

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

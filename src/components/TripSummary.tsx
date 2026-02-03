'use client';

import { useTripStore } from '@/store/useTripStore';
import { format, addDays } from 'date-fns';
import { Calendar as CalendarIcon, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function TripSummary() {
  const { 
    cities, 
    startDate, 
    totalDays: limitDays, 
    setStartDate, 
    setTotalDays 
  } = useTripStore();

  const currentTotalDays = cities.reduce((sum, city) => sum + city.days, 0);
  const cityCount = cities.length;

  const tripEndDate = startDate 
    ? addDays(startDate, currentTotalDays) 
    : null;

  const isOverLimit = limitDays !== null && currentTotalDays > limitDays;
  const remainingDays = limitDays !== null ? limitDays - currentTotalDays : null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Trip Summary</h2>
        <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
          {cityCount} {cityCount === 1 ? 'Destination' : 'Destinations'}
        </div>
      </div>

      {/* Settings: Start Date & Limit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <div className="relative">
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
            />
            <CalendarIcon className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Days (Optional)
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              placeholder="No limit"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={limitDays || ''}
              onChange={(e) => {
                const val = e.target.value ? parseInt(e.target.value) : null;
                setTotalDays(val);
              }}
            />
            <Clock className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>
        </div>
      </div>

      {/* Stats Display */}
      <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Total Duration</p>
          <p className="text-lg font-bold text-gray-900">{currentTotalDays} Days</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">End Date</p>
          <p className="text-lg font-bold text-gray-900">
            {tripEndDate ? format(tripEndDate, 'MMM d, yyyy') : '—'}
          </p>
        </div>
      </div>

      {/* Warning / Status */}
      {limitDays !== null && (
        <div className={`p-4 rounded-lg flex items-start gap-3 border ${
          isOverLimit 
            ? 'bg-red-50 border-red-100 text-red-700' 
            : 'bg-green-50 border-green-100 text-green-700'
        }`}>
          {isOverLimit ? (
            <AlertTriangle className="shrink-0 mt-0.5" size={20} />
          ) : (
            <CheckCircle2 className="shrink-0 mt-0.5" size={20} />
          )}
          <div>
            <p className="font-semibold">
              {isOverLimit ? 'Time Limit Exceeded' : 'Within Budget'}
            </p>
            <p className="text-sm mt-1">
              {isOverLimit 
                ? `You are ${Math.abs(remainingDays!)} days over your ${limitDays}-day limit.`
                : `You have ${remainingDays} days remaining.`
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

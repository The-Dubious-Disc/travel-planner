'use client';

import { useState } from 'react';
import { useTripStore } from '@/store/useTripStore';
import { useTranslation } from '@/hooks/useTranslation';
import { format, addDays } from 'date-fns';
import { Calendar as CalendarIcon, Clock, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Edit3 } from 'lucide-react';

export default function TripSummary() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const { 
    tripName,
    setTripName,
    cities, 
    startDate, 
    totalDays: limitDays, 
    setStartDate, 
    setTotalDays 
  } = useTripStore();

  const { t } = useTranslation();

  const currentTotalDays = cities.reduce((sum, city) => sum + city.days, 0);
  const cityCount = cities.length;

  const tripEndDate = startDate 
    ? addDays(startDate, currentTotalDays) 
    : null;

  const isOverLimit = limitDays !== null && currentTotalDays > limitDays;
  const remainingDays = limitDays !== null ? limitDays - currentTotalDays : null;

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 transition-all">
      <div 
        className="flex items-center justify-between cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <div
                contentEditable
                suppressContentEditableWarning
                className="text-xl font-bold text-gray-900 focus:outline-none border-b border-dashed border-gray-400"
                onBlur={(e) => {
                  setTripName(e.target.innerText);
                  setIsEditingTitle(false);
                }}
              >
                {tripName || t('summary.title')}
              </div>
              <button 
                className="p-1 text-gray-600 hover:text-gray-800 transition-colors" 
                onClick={() => setIsEditingTitle(false)}
              >
                <ChevronDown size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">{tripName || t('summary.title')}</h2>
              <button 
                className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors" 
                onClick={() => setIsEditingTitle(true)}
              >
                <Edit3 size={16} />
              </button>
            </div>
          )}

          {!isExpanded && (
            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
              {currentTotalDays} {t('summary.days')}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {isExpanded && (
            <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hidden sm:block">
              {cityCount} {cityCount === 1 ? t('summary.destination') : t('summary.destinations')}
            </div>
          )}
          <button 
            className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
            aria-label={isExpanded ? "Collapse summary" : "Expand summary"}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-6 mt-6 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Settings: Start Date & Limit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('summary.trip_name') || "Trip Name"}
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold text-gray-900"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="My Awesome Trip"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('summary.start_date')}
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    if (!e.target.value) {
                      setStartDate(null);
                      return;
                    }
                    const [y, m, d] = e.target.value.split('-').map(Number);
                    setStartDate(new Date(y, m - 1, d));
                  }}
                />
                <CalendarIcon className="absolute left-3 top-2.5 text-gray-400" size={16} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('summary.max_days')}
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
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">{t('summary.total_duration')}</p>
              <p className="text-lg font-bold text-gray-900">{currentTotalDays} {t('summary.days')}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">{t('summary.end_date')}</p>
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
                  {isOverLimit ? t('summary.limit_exceeded') : t('summary.within_budget')}
                </p>
                <p className="text-sm mt-1">
                  {isOverLimit 
                    ? `${Math.abs(remainingDays!)} ${t('summary.days_over')}`
                    : `${remainingDays} ${t('summary.days_remaining')}`
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
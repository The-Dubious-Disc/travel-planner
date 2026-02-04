'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import CitySearch from '@/components/CitySearch';
import CityList from '@/components/CityList';
import TripSummary from '@/components/TripSummary';
import GanttChart from '@/components/GanttChart';
import { useTranslation } from '@/hooks/useTranslation';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useTripStore } from '@/store/useTripStore';
import { createClient } from '@/lib/supabase/client';
import { MapPin, Calendar, Layout, Save, Globe } from 'lucide-react';

const TripMap = dynamic(() => import('@/components/TripMap'), {
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
  ssr: false
});

export default function TripPage() {
  const { id } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'timeline' | 'map'>('timeline');
  const { t, language, setLanguage } = useTranslation();
  
  const { 
    cities,
    setTripId, 
    setTripName,
    setCities, 
    setStartDate, 
    setTotalDays,
    setLastSaved,
    isSaving,
    lastSaved
  } = useTripStore();

  const supabase = createClient();

  // Initialize Trip
  useEffect(() => {
    // If id is an array (shouldn't be in this route structure), take the first
    const tripId = Array.isArray(id) ? id[0] : id;
    if (!tripId) return;
    
    const loadTrip = async () => {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single();
        
      if (error) {
        console.error('Error loading trip:', error);
        router.push('/'); 
        return;
      }
      
      if (data) {
        setTripId(data.id);
        setTripName(data.name || 'New Trip');
        setCities(data.cities || []);
        setStartDate(data.start_date ? new Date(data.start_date) : null);
        setTotalDays(data.total_days);
        setLastSaved(new Date(data.updated_at));
      }
    };
    
    loadTrip();
  }, [id, router, setCities, setLastSaved, setStartDate, setTotalDays, setTripId, setTripName, supabase]);

  // Enable Auto-Save
  useAutoSave();

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header with Language Toggle and Save Status */}
        <div className="flex justify-between items-center">
             <div className="flex items-center gap-4">
               <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="text-blue-600" />
                  {t('app.title')}
                </h1>
             </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-12 gap-8 items-start h-auto md:h-[calc(100vh-140px)]">
          {/* Left Column: Trip Builder */}
          <div className="w-full md:col-span-5 lg:col-span-5 space-y-6 md:overflow-y-auto md:h-full md:pr-2">
            <TripSummary />

            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {t('app.subtitle')}
              </h2>
              
              <div className="space-y-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('search.label')}
                  </label>
                  <CitySearch />
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">{t('itinerary.title')}</h2>
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <Calendar size={14} />
                      {t('itinerary.drag')}
                    </span>
                  </div>
                  <CityList />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visualizer (Tabs) */}
          <div className="w-full md:col-span-7 lg:col-span-7 md:h-full flex flex-col">
            {/* Tabs Header */}
            <div className="flex space-x-1 rounded-xl bg-blue-900/5 p-1 mb-4 w-full md:w-fit">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`flex-1 md:w-32 rounded-lg py-3 md:py-2.5 text-sm font-medium leading-5 transition-all
                  ${activeTab === 'timeline'
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Layout size={16} />
                  {t('tab.timeline')}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`flex-1 md:w-32 rounded-lg py-3 md:py-2.5 text-sm font-medium leading-5 transition-all
                  ${activeTab === 'map'
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <MapPin size={16} />
                  {t('tab.map')}
                </div>
              </button>
            </div>

            {/* Tab Panels */}
            <div className="flex-1 min-h-[500px]">
              {activeTab === 'timeline' ? (
                <GanttChart />
              ) : (
                <div className="bg-white h-full rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                   <TripMap cities={cities} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
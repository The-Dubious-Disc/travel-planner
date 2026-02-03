'use client';

import CitySearch from '@/components/CitySearch';
import CityList from '@/components/CityList';
import TripSummary from '@/components/TripSummary';
import GanttChart from '@/components/GanttChart';
import { MapPin, Calendar } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Trip Builder */}
          <div className="lg:col-span-1 space-y-6">
            {/* Trip Summary Component */}
            <TripSummary />

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <MapPin className="text-blue-600" />
                Travel Planner
              </h1>
              <p className="text-gray-500 mb-6">Build your dream itinerary step by step.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add a Destination
                  </label>
                  <CitySearch />
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Itinerary</h2>
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <Calendar size={14} />
                      Drag to reorder
                    </span>
                  </div>
                  <CityList />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Map/Visualizer (Placeholder for MVP) */}
          <div className="lg:col-span-2 hidden lg:block">
            <div className="bg-white h-full min-h-[500px] rounded-xl shadow-sm border border-gray-100 flex items-center justify-center bg-grid-slate-100">
               <div className="text-center text-gray-400">
                 <MapPin size={48} className="mx-auto mb-4 opacity-50" />
                 <p className="text-lg">Map View Coming Soon</p>
                 <p className="text-sm">Select cities to visualize your route</p>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Gantt Chart */}
        <div className="w-full">
          <GanttChart />
        </div>
      </div>
    </main>
  );
}

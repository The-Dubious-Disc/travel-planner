'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Plus, Map, Menu, X, LogOut } from 'lucide-react';
import { useTripStore } from '@/store/useTripStore';

interface TripSummary {
  id: string;
  name: string;
  updated_at: string;
}

export default function AppSidebar() {
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { currentTripId, lastSaved, setTripName } = useTripStore();
  const supabase = createClient();

  useEffect(() => {
    const fetchTrips = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('trips')
        .select('id, name, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching trips:', error);
      } else {
        setTrips(data || []);
      }
    };

    fetchTrips();
  }, [currentTripId, lastSaved, supabase]);

  const createNewTrip = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { data, error } = await supabase
      .from('trips')
      .insert([
        { 
          user_id: user.id, 
          name: 'New Trip', 
          cities: [],
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating trip:', error);
    } else if (data) {
      setTripName(data.name);
      router.push(`/trip/${data.id}`);
      setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-gray-100 transform transition-transform duration-200 ease-in-out
        md:translate-x-0 md:relative md:flex md:flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Map className="w-6 h-6 text-blue-400" />
            <span>TravelPlan</span>
          </h1>
        </div>

        <div className="p-4">
          <button 
            onClick={createNewTrip}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            <Plus size={18} />
            <span>New Trip</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">History</h3>
          <div className="space-y-1">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                href={`/trip/${trip.id}`}
                className={`
                  block px-3 py-2 rounded-md text-sm truncate transition-colors
                  ${params?.id === trip.id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}
                `}
                onClick={() => setIsOpen(false)}
              >
                {trip.name || 'Untitled Trip'}
              </Link>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-800">
           <button 
             onClick={handleLogout}
             className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-full"
           >
             <LogOut size={18} />
             <span>Sign Out</span>
           </button>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

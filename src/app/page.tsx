'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Fetch latest trip
        const { data: latestTrip } = await supabase
          .from('trips')
          .select('id')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();

        if (latestTrip) {
          router.push(`/trip/${latestTrip.id}`);
        } else {
          // Create new trip
          const { data: newTrip } = await supabase
            .from('trips')
            .insert([
              { 
                user_id: user.id, 
                name: 'My First Trip', 
                cities: [],
                updated_at: new Date().toISOString()
              }
            ])
            .select()
            .single();
            
          if (newTrip) {
            router.push(`/trip/${newTrip.id}`);
          }
        }
      } else {
        setIsLoading(false);
      }
    };

    checkUserAndRedirect();
  }, [router, supabase]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="bg-blue-100 p-4 rounded-full">
            <MapPin className="w-12 h-12 text-blue-600" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Plan Your Next Adventure
        </h1>
        
        <p className="text-lg text-gray-600">
          Create detailed itineraries, visualize your timeline, and organize your dream trip in minutes.
        </p>
        
        <div className="flex flex-col gap-4 pt-4">
          <Link 
            href="/login" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Get Started <ArrowRight size={18} />
          </Link>
          
          <p className="text-sm text-gray-500">
            Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

import { create } from 'zustand';

export interface City {
  id: string;
  name: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
  days: number;
}

interface TripState {
  currentTripId: string | null;
  tripName: string;
  cities: City[];
  startDate: Date | null;
  totalDays: number | null;
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  
  // Actions
  setTripId: (id: string) => void;
  setTripName: (name: string) => void;
  setCities: (cities: City[]) => void;
  addCity: (name: string, countryCode?: string, latitude?: number, longitude?: number) => void;
  removeCity: (id: string) => void;
  updateDays: (id: string, days: number) => void;
  reorderCities: (oldIndex: number, newIndex: number) => void;
  setStartDate: (date: Date | null) => void;
  setTotalDays: (days: number | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsSaving: (saving: boolean) => void;
  setLastSaved: (date: Date) => void;
  resetTrip: () => void;
}

export const useTripStore = create<TripState>((set) => ({
  currentTripId: null,
  tripName: 'New Trip',
  cities: [],
  startDate: null,
  totalDays: null,
  isLoading: false,
  isSaving: false,
  lastSaved: null,

  setTripId: (id) => set({ currentTripId: id }),
  setTripName: (name) => set({ tripName: name }),
  setCities: (cities) => set({ cities }),
  
  addCity: (name: string, countryCode?: string, latitude?: number, longitude?: number) => set((state) => ({
    cities: [
      ...state.cities,
      {
        id: crypto.randomUUID(),
        name,
        countryCode,
        latitude,
        longitude,
        days: 3 // Default to 3 days
      }
    ]
  })),

  removeCity: (id: string) => set((state) => ({
    cities: state.cities.filter((city) => city.id !== id)
  })),

  updateDays: (id: string, days: number) => set((state) => ({
    cities: state.cities.map((city) => 
      city.id === id ? { ...city, days: Math.max(1, days) } : city
    )
  })),

  reorderCities: (oldIndex: number, newIndex: number) => set((state) => {
    const newCities = [...state.cities];
    const [movedCity] = newCities.splice(oldIndex, 1);
    newCities.splice(newIndex, 0, movedCity);
    return { cities: newCities };
  }),

  setStartDate: (date: Date | null) => set({ startDate: date }),
  
  setTotalDays: (days: number | null) => set({ totalDays: days }),

  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsSaving: (saving) => set({ isSaving: saving }),
  setLastSaved: (date) => set({ lastSaved: date }),
  
  resetTrip: () => set({
    currentTripId: null,
    tripName: 'New Trip',
    cities: [],
    startDate: null,
    totalDays: null,
    lastSaved: null
  })
}));

import { create } from 'zustand';

export interface City {
  id: string;
  name: string;
  countryCode?: string;
  days: number;
}

interface TripState {
  cities: City[];
  startDate: Date | null;
  totalDays: number | null;
  
  // Actions
  addCity: (name: string, countryCode?: string) => void;
  removeCity: (id: string) => void;
  updateDays: (id: string, days: number) => void;
  reorderCities: (oldIndex: number, newIndex: number) => void;
  setStartDate: (date: Date | null) => void;
  setTotalDays: (days: number | null) => void;
}

export const useTripStore = create<TripState>((set) => ({
  cities: [],
  startDate: null,
  totalDays: null,

  addCity: (name: string, countryCode?: string) => set((state) => ({
    cities: [
      ...state.cities,
      {
        id: crypto.randomUUID(),
        name,
        countryCode,
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
}));

'use client';

import { useState, useRef, useEffect } from 'react';
import { useTripStore } from '@/store/useTripStore';
import { Search, Plus, Loader2 } from 'lucide-react';

import { useTranslation } from '@/hooks/useTranslation';

interface CityResult {
  name: string;
  countryCode?: string;
}

export default function CitySearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredCities, setFilteredCities] = useState<CityResult[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  
  const addCity = useTripStore((state) => state.addCity);
  const { language } = useTranslation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCities = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredCities([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchTerm)}&count=5&language=${language}&format=json`);
      if (res.ok) {
        const data = await res.json();
        const results = data.results || [];
        const cityResults = results.map((city: any) => ({
          name: [city.name, city.admin1, city.country].filter(Boolean).join(', '),
          countryCode: city.country_code
        }));
        setFilteredCities(cityResults);
        setIsOpen(true);
      } else {
        console.error('Failed to fetch cities');
        setFilteredCities([]);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      setFilteredCities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.trim().length > 2) {
      debounceRef.current = setTimeout(() => {
        fetchCities(value);
      }, 300);
    } else {
      setFilteredCities([]);
      setIsOpen(false);
    }
  };

  const handleSelectCity = (city: CityResult) => {
    addCity(city.name, city.countryCode);
    setQuery('');
    setIsOpen(false);
    setFilteredCities([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      if (filteredCities.length > 0) {
        handleSelectCity(filteredCities[0]);
      }
    }
  };

  return (
    <div className="relative w-full max-w-md" ref={wrapperRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
          placeholder="Add a city (e.g. Paris)..."
          value={query}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
        />
      </div>

      {isOpen && filteredCities.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {filteredCities.map((city, index) => (
            <li
              key={index}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 text-gray-900"
              onClick={() => handleSelectCity(city)}
            >
              <div className="flex items-center gap-2">
                {city.countryCode && (
                  <img 
                    src={`https://flagcdn.com/w20/${city.countryCode.toLowerCase()}.png`}
                    alt={city.countryCode}
                    className="w-5 h-auto object-cover rounded-sm"
                  />
                )}
                <span className="font-medium block truncate">{city.name}</span>
              </div>
              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                <Plus className="h-4 w-4" />
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

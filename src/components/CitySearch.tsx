'use client';

import { useState, useRef, useEffect } from 'react';
import { useTripStore } from '@/store/useTripStore';
import { Search, Plus } from 'lucide-react';

const MOCK_CITIES = [
  'Paris, France', 'London, UK', 'Tokyo, Japan', 'New York, USA', 
  'Rome, Italy', 'Barcelona, Spain', 'Amsterdam, Netherlands', 'Berlin, Germany',
  'Prague, Czech Republic', 'Lisbon, Portugal', 'Vienna, Austria', 'Dublin, Ireland',
  'Budapest, Hungary', 'Madrid, Spain', 'Venice, Italy', 'Kyoto, Japan',
  'Osaka, Japan', 'Seoul, South Korea', 'Bangkok, Thailand', 'Singapore',
  'Montevideo, Uruguay', 'Buenos Aires, Argentina', 'Sydney, Australia',
  'Cape Town, South Africa', 'Rio de Janeiro, Brazil'
];

export default function CitySearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const addCity = useTripStore((state) => state.addCity);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim().length > 0) {
      const filtered = MOCK_CITIES.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
      setIsOpen(true);
    } else {
      setFilteredCities([]);
      setIsOpen(false);
    }
  };

  const handleSelectCity = (city: string) => {
    addCity(city);
    setQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      // If valid city in list matches exactly or just add what's typed
      // For now, let's just add what's typed if it's not empty, 
      // or the first match if available.
      if (filteredCities.length > 0) {
        handleSelectCity(filteredCities[0]);
      } else {
         // Optional: allow free text adding?
         // addCity(query);
         // setQuery('');
         // setIsOpen(false);
      }
    }
  };

  return (
    <div className="relative w-full max-w-md" ref={wrapperRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
          placeholder="Add a city (e.g. Paris, Tokyo)..."
          value={query}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim().length > 0) setIsOpen(true);
          }}
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
              <div className="flex items-center">
                <span className="font-medium block truncate">{city}</span>
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

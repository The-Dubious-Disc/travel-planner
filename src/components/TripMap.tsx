'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { City } from '@/store/useTripStore';

// Fix for default marker icons in Next.js/Leaflet
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

interface TripMapProps {
  cities: City[];
}

function MapBounds({ cities }: { cities: City[] }) {
  const map = useMap();

  useEffect(() => {
    if (cities.length === 0) return;

    const bounds = L.latLngBounds(cities.map(c => [c.latitude || 0, c.longitude || 0]));
    const validPoints = cities.filter(c => c.latitude !== undefined && c.longitude !== undefined);
    
    if (validPoints.length > 0) {
        const bounds = L.latLngBounds(validPoints.map(c => [c.latitude!, c.longitude!]));
        map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [cities, map]);

  return null;
}

export default function TripMap({ cities }: TripMapProps) {
  const validCities = cities.filter(c => c.latitude !== undefined && c.longitude !== undefined);

  // Default center (Europe-ish) if no cities
  const defaultCenter: [number, number] = [48.8566, 2.3522];
  const center = validCities.length > 0 
    ? [validCities[0].latitude!, validCities[0].longitude!] as [number, number]
    : defaultCenter;

  const positions = validCities.map(c => [c.latitude!, c.longitude!] as [number, number]);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm z-0">
      <MapContainer 
        center={center} 
        zoom={4} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {validCities.map((city) => (
          <Marker 
            key={city.id} 
            position={[city.latitude!, city.longitude!]}
          >
            <Popup>
              <div className="font-semibold">{city.name}</div>
              <div className="text-sm text-gray-500">{city.days} days</div>
            </Popup>
          </Marker>
        ))}

        {positions.length > 1 && (
          <Polyline 
            positions={positions} 
            color="#3b82f6" 
            weight={3} 
            opacity={0.7} 
            dashArray="10, 10" 
          />
        )}

        <MapBounds cities={validCities} />
      </MapContainer>
    </div>
  );
}

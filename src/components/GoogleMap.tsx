import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    id: string;
    position: { lat: number; lng: number };
    title: string;
    info?: string;
  }>;
  onMarkerClick?: (markerId: string) => void;
  className?: string;
}

const GoogleMap: React.FC<MapProps> = ({
  center,
  zoom = 12,
  markers = [],
  onMarkerClick,
  className = "w-full h-96"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    const initMap = async () => {
      // For demo purposes, we'll create a mock map without requiring API key
      // In production, you would use: const loader = new Loader({ apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY });
      
      if (!mapRef.current) return;

      // Create a simple mock map div for demonstration
      const mockMapElement = document.createElement('div');
      mockMapElement.className = 'w-full h-full bg-gray-200 flex items-center justify-center text-gray-600 rounded-lg border-2 border-dashed border-gray-300';
      mockMapElement.innerHTML = `
        <div class="text-center">
          <div class="text-2xl mb-2">🗺️</div>
          <div class="font-semibold">Interactive Map View</div>
          <div class="text-sm mt-1">${markers.length} locations found</div>
          <div class="text-xs mt-2 text-gray-500">Map integration ready for Google Maps API</div>
        </div>
      `;
      
      mapRef.current.innerHTML = '';
      mapRef.current.appendChild(mockMapElement);
      setIsLoaded(true);
    };

    initMap();
  }, [center, markers.length]);

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      {!isLoaded && (
        <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
          <div className="text-gray-500">Loading map...</div>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;

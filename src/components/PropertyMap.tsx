import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface PropertyMapProps {
  address?: string;
  location: string;
  propertyName: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ address, location, propertyName }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  const initializeMap = (token: string) => {
    if (!mapContainer.current || !token) return;

    try {
      mapboxgl.accessToken = token;
      
      // Default coordinates for Lusaka, Zambia (you can geocode the address for better accuracy)
      const defaultCoordinates: [number, number] = [28.2871, -15.4167];
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: defaultCoordinates,
        zoom: 13,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      // Add a marker for the property
      new mapboxgl.Marker({ color: '#2563eb' })
        .setLngLat(defaultCoordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3 class="font-semibold">${propertyName}</h3><p class="text-sm">${location}</p>`)
        )
        .addTo(map.current);

      setShowTokenInput(false);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const handleSubmitToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken.trim()) {
      initializeMap(mapboxToken);
    }
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (showTokenInput) {
    return (
      <div className="w-full h-[400px] bg-muted/30 rounded-lg border-2 border-dashed border-border flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-4">
          <div className="text-center space-y-2">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-semibold">Enter Mapbox Token</h3>
            <p className="text-sm text-muted-foreground">
              To display the property location on a map, please enter your Mapbox public token.
              Get one free at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
            </p>
          </div>
          <form onSubmit={handleSubmitToken} className="space-y-3">
            <Input
              type="text"
              placeholder="pk.eyJ1Ijoi..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="font-mono text-sm"
            />
            <Button type="submit" className="w-full">
              Load Map
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default PropertyMap;

import React, { useEffect, useRef } from 'react';

interface GoogleMapSectionProps {
  center?: { lat: number; lng: number };
  zoom?: number;
}

const GoogleMapSection: React.FC<GoogleMapSectionProps> = ({ 
  center = { lat: 14.6091, lng: 120.9889 }, // UST coordinates
  zoom = 15 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      // Initialize the map
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry.fill',
            stylers: [{ color: '#2d3748' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [{ color: '#1a365d' }]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#a0aec0' }]
          }
        ]
      });

      // Add UST marker
      new google.maps.Marker({
        position: center,
        map: mapInstanceRef.current,
        title: 'University of Santo Tomas',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#f59e0b" stroke="#1f2937" stroke-width="2"/>
              <text x="16" y="20" text-anchor="middle" fill="#1f2937" font-family="Arial" font-size="12" font-weight="bold">UST</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32)
        }
      });

      // Add weather overlay
      const weatherOverlay = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; background: #1f2937; color: white; border-radius: 8px;">
            <h3 style="margin: 0 0 8px 0; color: #f59e0b;">UST Weather Station</h3>
            <p style="margin: 0; font-size: 14px;">Real-time weather monitoring for the University of Santo Tomas campus area.</p>
          </div>
        `
      });

      // Add click listener to show weather info
      mapInstanceRef.current.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          weatherOverlay.setPosition(event.latLng);
          weatherOverlay.open(mapInstanceRef.current);
        }
      });
    };

    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom]);

  return (
    <div className="bg-gray-800/50 rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-2">UST Campus Area</h3>
        <p className="text-gray-400 text-sm">
          Interactive map showing the University of Santo Tomas campus and surrounding areas.
        </p>
      </div>
      
      <div className="relative">
        <div
          ref={mapRef}
          className="w-full h-64 rounded-lg"
          style={{ minHeight: '256px' }}
        />
        
        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.setZoom((mapInstanceRef.current.getZoom() || 15) + 1);
              }
            }}
            className="w-8 h-8 bg-gray-800 text-white rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.setZoom((mapInstanceRef.current.getZoom() || 15) - 1);
              }
            }}
            className="w-8 h-8 bg-gray-800 text-white rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
            title="Zoom Out"
          >
            -
          </button>
        </div>
      </div>

      {/* Map Info */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-300">
          <p>📍 University of Santo Tomas, Manila</p>
          <p className="text-xs text-gray-400">Click anywhere on the map for weather info</p>
        </div>
        <a
          href={`https://www.google.com/maps?q=${center.lat},${center.lng}&z=${zoom}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors"
        >
          <span className="text-sm font-medium">Open in Google Maps</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default GoogleMapSection;

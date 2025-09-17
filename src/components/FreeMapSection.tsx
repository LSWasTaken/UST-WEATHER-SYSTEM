import React, { useEffect, useRef } from 'react';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';

interface FreeMapSectionProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  editable?: boolean; // allows dragging markers to find correct coords
}

const FreeMapSection: React.FC<FreeMapSectionProps> = ({ 
  center = { lat: 14.609, lng: 120.989 }, // UST approximate center
  zoom = 16,
  editable = true,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isEditMode, setIsEditMode] = React.useState(false);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      // Load Leaflet CSS and JS dynamically
      const loadLeaflet = () => {
        return new Promise((resolve) => {
          // Load CSS
          const cssLink = document.createElement('link');
          cssLink.rel = 'stylesheet';
          cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
          cssLink.crossOrigin = 'anonymous';
          document.head.appendChild(cssLink);

          // Load JS
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
          script.crossOrigin = 'anonymous';
          script.onload = () => resolve(true);
          document.head.appendChild(script);
        });
      };

      loadLeaflet().then(() => {
        if (window.L) {
          // Inject minimal CSS for custom markers (once)
          if (!document.getElementById('leaflet-custom-marker-styles')) {
            const style = document.createElement('style');
            style.id = 'leaflet-custom-marker-styles';
            style.innerHTML = `
              .custom-marker { display:flex; align-items:center; justify-content:center; width:32px; height:32px; border-radius:9999px; box-shadow:0 2px 6px rgba(0,0,0,0.3); border:2px solid #111827; }
              .custom-marker--ust { background:#f59e0b; color:#111827; font-weight:700; font-size:10px; }
              .custom-marker--poi { background:#1f2937; color:#fff; font-size:16px; }
            `;
            document.head.appendChild(style);
          }

          const createEmojiIcon = (html: string, variant: 'ust' | 'poi' = 'poi') =>
            window.L.divIcon({
              html: `<div class="custom-marker ${variant === 'ust' ? 'custom-marker--ust' : 'custom-marker--poi'}">${html}</div>`,
              className: '',
              iconSize: [32, 32],
              iconAnchor: [16, 16],
              popupAnchor: [0, -16],
            });

          // Initialize the map
          mapInstanceRef.current = window.L.map(mapRef.current).setView([center.lat, center.lng], zoom);

          // Add OpenStreetMap tiles
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
          }).addTo(mapInstanceRef.current);

          // Add UST marker (highlighted badge icon)
          const ustMarker = window.L.marker([center.lat, center.lng], {
            icon: createEmojiIcon('UST', 'ust'),
            title: 'University of Santo Tomas',
            riseOnHover: true,
          }).addTo(mapInstanceRef.current);
          ustMarker.bindPopup(`
            <div style="padding: 10px; background: #1f2937; color: white; border-radius: 8px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: #f59e0b;">🏛️ University of Santo Tomas</h3>
              <p style="margin: 0 0 8px 0; font-size: 14px;">Real-time weather monitoring for the UST campus area.</p>
              <div style="font-size: 12px; color: #9ca3af;">
                📍 España Blvd, Sampaloc, Manila, 1008 Metro Manila
              </div>
            </div>
          `);

          // Add weather overlay
          const weatherOverlay = window.L.popup();
          
          // Add click listener to show weather info
          mapInstanceRef.current.on('click', (e: any) => {
            weatherOverlay
              .setLatLng(e.latlng)
              .setContent(`
                <div style="padding: 10px; background: #1f2937; color: white; border-radius: 8px; min-width: 200px;">
                  <h3 style="margin: 0 0 8px 0; color: #f59e0b;">🌤️ Weather Station</h3>
                  <p style="margin: 0; font-size: 14px;">Click on UST marker for detailed weather information.</p>
                  <div style="font-size: 12px; color: #9ca3af; margin-top: 8px;">
                    Coordinates: ${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}
                  </div>
                </div>
              `)
              .openOn(mapInstanceRef.current);
          });

          // Nearby locations (adjust these coords if markers look off)
          const nearbyLocations = [
            { name: 'UST Main Building', lat: 14.60905, lng: 120.98902, icon: '🏛️' },
            { name: 'Quadricentennial Pavilion', lat: 14.61036, lng: 120.98934, icon: '🏟️' },
            { name: 'UST Hospital', lat: 14.60833, lng: 120.99004, icon: '🏥' },
            { name: 'España Boulevard', lat: 14.60902, lng: 120.98750, icon: '🛣️' }
          ];

          const bounds = window.L.latLngBounds([ [center.lat, center.lng] ]);
          markersRef.current = [];
          nearbyLocations.forEach(location => {
            const marker = window.L.marker([location.lat, location.lng], {
              icon: createEmojiIcon(location.icon, 'poi'),
              title: location.name,
              draggable: editable && isEditMode,
            }).addTo(mapInstanceRef.current);
            marker.bindPopup(`
              <div style="padding: 8px; background: #374151; color: white; border-radius: 6px;">
                <div style="font-size: 16px; margin-bottom: 4px;">${location.icon} ${location.name}</div>
                <div style="font-size: 12px; color: #9ca3af;">UST Campus Area</div>
              </div>
            `);
            bounds.extend([location.lat, location.lng]);
            if (editable) {
              marker.on('dragend', (e: any) => {
                const { lat, lng } = e.target.getLatLng();
                console.log(`[Marker] ${location.name}: { lat: ${lat.toFixed(6)}, lng: ${lng.toFixed(6)} }`);
                marker.bindPopup(`
                  <div style="padding: 8px; background: #374151; color: white; border-radius: 6px;">
                    <div style="font-size: 16px; margin-bottom: 4px;">${location.icon} ${location.name}</div>
                    <div style="font-size: 12px; color: #9ca3af;">lat: ${lat.toFixed(6)}, lng: ${lng.toFixed(6)}</div>
                  </div>
                `);
                marker.openPopup();
              });
            }
            markersRef.current.push(marker);
          });

          // Fit map to show all markers nicely (within campus area)
          mapInstanceRef.current.fitBounds(bounds.pad(0.2));
        }
      });
    };

    // Small delay to ensure DOM is ready
    setTimeout(initMap, 100);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
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
          <span className="text-green-400 ml-1">✓ Free OpenStreetMap</span>
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
                mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + 1);
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
                mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() - 1);
              }
            }}
            className="w-8 h-8 bg-gray-800 text-white rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
            title="Zoom Out"
          >
            -
          </button>
          {editable && (
            <button
              onClick={() => {
                setIsEditMode(v => {
                  const next = !v;
                  // Toggle draggable on existing markers
                  markersRef.current.forEach(m => m.dragging && (next ? m.dragging.enable() : m.dragging.disable()));
                  return next;
                });
              }}
              className={`px-2 py-1 rounded-lg text-xs ${
                isEditMode ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
              title="Toggle marker edit mode"
            >
              {isEditMode ? 'Editing…' : 'Edit markers'}
            </button>
          )}
        </div>
      </div>

      {/* Map Info */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-300">
          <p>📍 University of Santo Tomas, Manila</p>
          <p className="text-xs text-gray-400">Click anywhere on the map for weather info</p>
        </div>
        <a
          href={`https://www.openstreetmap.org/?mlat=${center.lat}&mlon=${center.lng}&zoom=${zoom}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span className="text-sm font-medium">Open in OSM</span>
        </a>
      </div>

      {/* Map Features */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-400">
        <div className="flex items-center space-x-1">
          <MapPin className="w-3 h-3" />
          <span>UST Locations</span>
        </div>
        <div className="flex items-center space-x-1">
          <Navigation className="w-3 h-3" />
          <span>Interactive</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-green-400">✓</span>
          <span>Free to use</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-blue-400">🌍</span>
          <span>OpenStreetMap</span>
        </div>
      </div>
    </div>
  );
};

export default FreeMapSection;

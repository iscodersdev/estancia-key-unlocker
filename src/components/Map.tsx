
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Local {
  id: number;
  name: string;
  address: string;
  coordinates: [number, number];
  phone: string;
  hours: string;
}

interface MapProps {
  apiKey: string;
  locales: Local[];
  selectedLocationIndex?: number;
}

export interface MapRef {
  animateToLocation: (coordinates: [number, number]) => void;
}

const Map = forwardRef<MapRef, MapProps>(({ apiKey, locales, selectedLocationIndex = 0 }, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useImperativeHandle(ref, () => ({
    animateToLocation: (coordinates: [number, number]) => {
      if (map.current) {
        map.current.flyTo({
          center: coordinates,
          zoom: 14,
          duration: 1000
        });
      }
    }
  }));

  useEffect(() => {
    if (!mapContainer.current || !apiKey || !locales.length) return;

    // Initialize map
    mapboxgl.accessToken = apiKey;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: locales[0].coordinates,
      zoom: 6,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Add markers for each local
    locales.forEach((local) => {
      if (map.current) {
        // Create custom marker
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.cssText = `
          background-color: #2D3748;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: bold;
        `;
        
        // Add store icon or number
        el.innerHTML = '📍';

        // Create popup with WhatsApp integration
        const cleanPhone = local.phone.replace(/\D/g, '');
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 12px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #2D3748; font-size: 16px;">${local.name}</h3>
            <p style="margin: 0 0 6px 0; font-size: 14px; color: #4A5568;"><strong>📍</strong> ${local.address}</p>
            <p style="margin: 0 0 6px 0; font-size: 14px; color: #4A5568;"><strong>📞</strong> ${local.phone}</p>
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #4A5568;"><strong>🕒</strong> ${local.hours}</p>
            <button 
              onclick="window.open('https://wa.me/${cleanPhone}', '_blank')"
              style="
                background-color: #25D366; 
                color: white; 
                border: none; 
                padding: 8px 12px; 
                border-radius: 6px; 
                cursor: pointer; 
                font-size: 13px;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
              "
              onmouseover="this.style.backgroundColor='#128C7E'"
              onmouseout="this.style.backgroundColor='#25D366'"
            >
              💬 Contactar WhatsApp
            </button>
          </div>
        `);

        // Add marker to map
        new mapboxgl.Marker(el)
          .setLngLat(local.coordinates)
          .setPopup(popup)
          .addTo(map.current);
      }
    });

    // Fit map to show all markers
    if (locales.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      locales.forEach(local => {
        bounds.extend(local.coordinates);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [apiKey, locales]);

  return (
    <div className="relative w-full h-[500px]">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
    </div>
  );
});

Map.displayName = 'Map';

export default Map;

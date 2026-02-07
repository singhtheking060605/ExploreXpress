import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapComponent = ({ locations, center, zoom = 12 }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(center ? center[1] : 2.3522);
    const [lat, setLat] = useState(center ? center[0] : 48.8566);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        if (!mapContainer.current) return;

        const accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
        if (!accessToken) {
            console.error("Mapbox token missing!");
            return;
        }
        mapboxgl.accessToken = accessToken;

        try {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/outdoors-v12',
                center: [lng, lat],
                zoom: zoom
            });

            map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        } catch (error) {
            console.error("Error initializing map:", error);
        }
    }, [zoom]); // Removed lat/lng from dependencies to prevent re-init on state change

    // Update center if props change and map exists
    useEffect(() => {
        if (!map.current) return;
        if (center) {
            map.current.flyTo({
                center: [center[1], center[0]],
                zoom: zoom
            });
        }
    }, [center, zoom]);

    // Add markers
    useEffect(() => {
        if (!map.current || !locations) return;

        const currentMarkers = document.getElementsByClassName('mapboxgl-marker');
        while (currentMarkers.length > 0) {
            currentMarkers[0].remove();
        }

        locations.forEach(loc => {
            const el = document.createElement('div');

            // Base style
            el.className = 'flex items-center justify-center text-white font-bold shadow-lg cursor-pointer transition-transform hover:scale-110';

            if (loc.type === 'hotel') {
                // Hotel: Blue Pin icon
                el.className += ' w-8 h-8 bg-blue-500 rounded-full border-2 border-white';
                el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 22v-6.57"/><path d="M12 11h.01"/><path d="M2 22h20"/><path d="M5 22v-8.57"/><path d="M19 22v-8.57"/><path d="M4 11h16a1 1 0 0 1 1 1v2.57"/><path d="M9 11V7a5 5 0 0 0-10 0v4"/></svg>';
            } else {
                // Activity: Brand Numbered Circle
                el.className += ' w-8 h-8 bg-brand-primary rounded-full border-2 border-white text-sm';
                el.innerText = loc.label || '?';
            }

            const popup = new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                    <div class="p-2 min-w-[150px]">
                        <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                            ${loc.type === 'hotel' ? 'Hotel' : `Day ${loc.label}`}
                        </div>
                        <h3 class="font-bold text-sm text-slate-900 mb-1">${loc.title}</h3>
                        <p class="text-xs text-slate-500 line-clamp-2">${loc.description || ''}</p>
                    </div>
                `);

            new mapboxgl.Marker(el)
                .setLngLat([loc.lng, loc.lat])
                .setPopup(popup)
                .addTo(map.current);
        });

    }, [locations]);

    return (
        <div ref={mapContainer} className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 relative" />
    );
};

export default MapComponent;

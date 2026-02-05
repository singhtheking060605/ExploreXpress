import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTrip } from '../TripContext';

// Start with a default generic view
const DEFAULT_CENTER = [-74.5, 40];
const DEFAULT_ZOOM = 9;

const MapComponent = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const markersRef = useRef([]);
    const { markers, currentStep } = useTrip();

    useEffect(() => {
        if (map.current) return;

        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/navigation-day-v1',
            center: DEFAULT_CENTER,
            zoom: DEFAULT_ZOOM,
            attributionControl: false,
            pitch: 45, // Add some pitch for 3D feel
            bearing: -17.6,
        });

        const m = map.current;

        m.addControl(new mapboxgl.NavigationControl(), 'top-right');

        m.on('load', () => {
            // Add Route Source
            m.addSource('route', {
                'type': 'geojson',
                'lineMetrics': true, // Enable line metrics for gradients if needed
                'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': []
                    }
                }
            });

            // Add Route Layer (Dashed animated style look)
            m.addLayer({
                'id': 'route',
                'type': 'line',
                'source': 'route',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#3b82f6', // brand-primary
                    'line-width': 4,
                    'line-dasharray': [0, 2, 2], // Initial dash
                    'line-opacity': 0.8
                }
            });

            // Pulse Effect Layer (for destination markers)
            // Note: CSS pulse is easier for HTML markers, so we'll stick to CSS in the marker create loop.
        });

    }, []);

    // Update markers and route
    useEffect(() => {
        if (!map.current) return;
        const m = map.current;

        // 1. Manage Markers
        // We only want to add NEW markers or remove old ones efficiently, 
        // but for simplicity and low item count, strictly syncing is fine.

        // Clear existing
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Sort markers: Start first, then destinations by label/index
        const startMarker = markers.find(m => m.type === 'start');
        const destMarkers = markers.filter(m => m.type !== 'start').sort((a, b) => parseInt(a.label || 0) - parseInt(b.label || 0));

        const sortedMarkers = [startMarker, ...destMarkers].filter(Boolean);
        const coordinates = sortedMarkers.map(m => [m.lng, m.lat]);

        sortedMarkers.forEach((markerInfo, index) => {
            const el = document.createElement('div');
            // Base classes
            let className = 'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 border-white cursor-pointer transition-all duration-300 ';

            if (markerInfo.type === 'start') {
                className += 'bg-pink-500 z-20'; // Higher z-index for start
                el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';

                // Add pulse ring for start
                const pulse = document.createElement('div');
                pulse.className = 'absolute -inset-2 rounded-full bg-pink-500 opacity-20 animate-ping';
                el.appendChild(pulse);

            } else {
                className += 'bg-blue-500 z-10 hover:scale-125';
                el.innerHTML = `<span>${markerInfo.label || index}</span>`;

                // Subtle pulse for new destinations too
                const pulse = document.createElement('div');
                pulse.className = 'absolute -inset-1 rounded-full bg-blue-500 opacity-20 animate-ping';
                el.appendChild(pulse);
            }

            el.className = className;

            const marker = new mapboxgl.Marker(el)
                .setLngLat([markerInfo.lng, markerInfo.lat])
                .setPopup(new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`<h3 class="font-bold text-sm px-2 py-1">${markerInfo.name || 'Location'}</h3>`))
                .addTo(m);

            // Open popup on hover
            el.addEventListener('mouseenter', () => marker.togglePopup());
            el.addEventListener('mouseleave', () => marker.togglePopup());

            markersRef.current.push(marker);
        });

        // 2. Update Route Line
        // Only valid if we have at least 2 points
        if (m.getSource('route')) {
            const geojson = {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': coordinates
                }
            };
            m.getSource('route').setData(geojson);
        }

        // 3. Cinematic FlyTo / FitBounds
        if (coordinates.length > 0) {
            // specific behavior: if just 1 point, fly to it.
            // If new point added (length increased), fly to the NEW point first, then maybe fit bounds?
            // Requirement: "zoom and fly to that location with cinematic transitions"

            const lastCoord = coordinates[coordinates.length - 1];

            m.flyTo({
                center: lastCoord,
                zoom: 11,
                speed: 1.2,
                curve: 1.42,
                easing: (t) => t,
                essential: true
            });

            // If user wants to see whole route, they can zoom out, OR we fit bounds after a delay?
            // "Show an animated connected route" -> imply we see connections.
            // Let's stick to flyTo for the "Cinematic" feel on add.
            // But if it's the INITIAL load of many points, fitBounds is better.
            // For now, FlyTo is the requested "Cinematic" effect.
        }

    }, [markers]);

    // 4. Handle Step Transitions (Presentation Mode)
    useEffect(() => {
        if (!map.current || markers.length === 0) return;
        const m = map.current;

        // When moving to Step 2 (Preferences), enter "Trip Summary" mode
        if (currentStep >= 2) {
            const bounds = new mapboxgl.LngLatBounds();
            markers.forEach(m => bounds.extend([m.lng, m.lat]));

            m.fitBounds(bounds, {
                padding: { top: 100, bottom: 200, left: 100, right: 100 },
                pitch: 60,
                bearing: -20,
                duration: 2000,
                essential: true
            });
        }
        else if (currentStep === 1 && markers.length > 0) {
            m.easeTo({
                pitch: 45,
                bearing: -17.6,
                duration: 1500
            });
        }

    }, [currentStep, markers]);

    return (
        <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner bg-slate-100 dark:bg-slate-800 relative">
            <div ref={mapContainer} className="w-full h-full" />

            {/* Legend / Overlay */}
            <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 max-w-xs z-10 transition-all hover:scale-105">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Your Journey</h4>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="relative flex items-center justify-center w-4 h-4">
                            <span className="absolute w-3 h-3 rounded-full bg-pink-500 animate-ping opacity-20"></span>
                            <span className="relative w-2 h-2 rounded-full bg-pink-500"></span>
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Start Point</span>
                    </div>

                    {markers.length > 1 && (
                        <div className="pl-[7px] border-l-2 border-dashed border-slate-300 h-4 my-[-4px]"></div>
                    )}

                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 ml-1" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {markers.filter(m => m.type !== 'start').length} Stop(s)
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapComponent;

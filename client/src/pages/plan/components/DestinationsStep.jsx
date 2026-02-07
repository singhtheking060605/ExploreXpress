import React, { useState, useEffect, useRef } from 'react';
import { useTrip } from '../TripContext';
import { Calendar, MapPin, Plus, X, Search, Clock, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import mapboxgl from 'mapbox-gl';
import MapComponent from './MapComponent';

// Geocoder Component
const GeocoderInput = ({ placeholder, onResult, defaultValue }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Access token must be set
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            types: 'place,locality,neighborhood',
            placeholder: placeholder,
            mapboxgl: mapboxgl
        });

        geocoder.addTo(containerRef.current);

        // Handle result
        geocoder.on('result', (e) => {
            const { result } = e;
            const { center, place_name, text } = result; // center is [lng, lat]
            if (onResult) {
                onResult({
                    lng: center[0],
                    lat: center[1],
                    name: text, // Use short name for marker
                    fullName: place_name
                });
            }
        });

        // Set default value if provided
        if (defaultValue) {
            geocoder.setInput(defaultValue);
        }

        // Cleanup
        return () => {
            geocoder.onRemove();
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="w-full geocoder-wrapper" />
    );
};

const DestinationsStep = () => {
    const {
        startDate, setStartDate,
        fromLocation, setFromLocation,
        destinations, setDestinations,
        completeStep, goToStep,
        addMarker, clearMarkers, removeMarker,
        markers
    } = useTrip();

    const [locationInput, setLocationInput] = useState(null); // Holds object {lng, lat, name}
    const [durationInput, setDurationInput] = useState('3');

    // Custom style for Geocoder to match the theme
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            .geocoder-wrapper .mapboxgl-ctrl-geocoder {
                width: 100%;
                max-width: none;
                box-shadow: none;
                background-color: transparent;
            }
            .geocoder-wrapper .mapboxgl-ctrl-geocoder--input {
                padding: 12px 12px 12px 40px;
                height: auto;
                border-radius: 0.75rem; /* rounded-xl */
                background-color: white; /* or slate-50 based on theme */
                border: 1px solid #e2e8f0; /* slate-200 */
                font-family: inherit;
            }
            .dark .geocoder-wrapper .mapboxgl-ctrl-geocoder--input {
                background-color: #1e293b; /* slate-800 */
                border-color: #334155; /* slate-700 */
                color: white;
            }
            .geocoder-wrapper .mapboxgl-ctrl-geocoder--icon {
                top: 12px;
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    // Check for destination in URL query params
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const destinationParam = params.get('destination');

        if (destinationParam && destinations.length === 0) {

            const geocodeDestination = async () => {
                try {
                    const token = import.meta.env.VITE_MAPBOX_TOKEN;
                    const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destinationParam)}.json?access_token=${token}&limit=1`);
                    const data = await res.json();

                    let lng = 0;
                    let lat = 0;
                    let fullName = destinationParam;

                    if (data.features && data.features.length > 0) {
                        const feature = data.features[0];
                        lng = feature.center[0];
                        lat = feature.center[1];
                        fullName = feature.place_name;
                    }

                    const newDest = {
                        id: Date.now(),
                        city: destinationParam.split(',')[0], // Just city name for display
                        fullName: fullName,
                        duration: '3',
                        lng: lng,
                        lat: lat
                    };

                    setDestinations([newDest]);

                    // Add marker immediately if we have coords
                    if (lng !== 0 && lat !== 0) {
                        addMarker({
                            id: newDest.id,
                            lng: lng,
                            lat: lat,
                            type: 'destination',
                            label: '1',
                            name: newDest.city
                        });
                    }

                } catch (err) {
                    console.error("Failed to geocode initial destination:", err);
                    // Fallback to adding without coords
                    setDestinations([{
                        id: Date.now(),
                        city: destinationParam,
                        fullName: destinationParam,
                        duration: '3',
                        lng: 0,
                        lat: 0
                    }]);
                }
            };

            geocodeDestination();

            // Cleanup param
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }
    }, []);


    const handleAddDestination = () => {
        if (!locationInput) return;

        const newDest = {
            id: Date.now(),
            city: locationInput.name,
            fullName: locationInput.fullName,
            duration: durationInput,
            lng: locationInput.lng,
            lat: locationInput.lat
        };

        setDestinations(prev => [...prev, newDest]);

        // Add marker to map
        addMarker({
            id: newDest.id,
            lng: newDest.lng,
            lat: newDest.lat,
            type: 'destination',
            label: (destinations.length + 1).toString(), // Logic for next number
            name: newDest.city
        });

        setLocationInput(null);
        setDurationInput('3');
        // Clear geocoder input visually? The component re-mounts or we need a ref?
        // Simpler to just let user clear or re-type.
        // For now, the geocoder keeps its state unless we force reset.
        // Let's assume user types new search.
    };

    const handleRemoveDestination = (id) => {
        setDestinations(prev => prev.filter(d => d.id !== id));
        removeMarker(id);
    };

    const handleSetOrigin = (location) => {
        setFromLocation(location.name); // Store string name for form

        // Add start marker
        addMarker({
            id: 'start',
            lng: location.lng,
            lat: location.lat,
            type: 'start',
            name: location.name
        });
    };

    const isValid = destinations.length > 0 && startDate && fromLocation;

    const handleContinueClick = () => {
        if (isValid) {
            completeStep(1);
            goToStep(2);
        }
    };

    return (
        <div className="space-y-8 relative">

            <div className="grid lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
                <div className="space-y-8 overflow-y-auto pr-2 pb-20">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="bg-green-100 p-3 rounded-xl text-green-600">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Destinations</h2>
                            <p className="text-slate-500">Select where your journey begins and where you want to go</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                When does your journey begin?
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3.5 text-slate-400 z-10" size={18} />
                                <input
                                    type="date"
                                    value={startDate || ''}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-primary/50 transition-all outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Where are you starting from?
                            </label>
                            <div className="relative">
                                {/* Wrapper for Geocoder */}
                                <div className="geocoder-origin-wrapper">
                                    <GeocoderInput
                                        placeholder="e.g. Mumbai, India"
                                        onResult={handleSetOrigin}
                                        defaultValue={fromLocation}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-brand-primary mb-4 flex items-center gap-2">
                            <MapPin size={18} /> Your Destinations
                        </h3>

                        <div className="space-y-3">
                            {destinations.map((dest, index) => (
                                <div key={dest.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm group hover:border-brand-primary/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">{dest.city}</p>
                                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                                <Clock size={12} /> {dest.duration} days
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveDestination(dest.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}

                            {/* Add Destination Form */}
                            <div className="p-4 bg-brand-primary/5 rounded-xl border-2 border-dashed border-brand-primary/20">
                                <div className="flex gap-4">
                                    <div className="flex-1 relative">
                                        <GeocoderInput
                                            placeholder="Search for a city..."
                                            onResult={setLocationInput}
                                        />
                                    </div>
                                    <div className="w-24 relative">
                                        <input
                                            type="number"
                                            min="1"
                                            value={durationInput}
                                            onChange={(e) => setDurationInput(e.target.value)}
                                            className="w-full pl-3 pr-8 py-3 rounded-lg border-none bg-white/80 focus:ring-2 focus:ring-brand-primary/20 text-sm text-center"
                                        />
                                        <span className="absolute right-3 top-3.5 text-xs text-slate-400">days</span>
                                    </div>
                                    <button
                                        onClick={handleAddDestination}
                                        disabled={!locationInput}
                                        className="bg-gradient-to-r from-brand-primary to-brand-accent text-white px-6 rounded-lg font-medium shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Column */}
                <div className="hidden lg:block h-full w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700">
                    <MapComponent
                        locations={markers}
                        center={markers.length > 0 ? [markers[markers.length - 1].lat, markers[markers.length - 1].lng] : undefined}
                    />
                </div>
            </div>

            <div className="flex justify-between pt-4">
                {/* Back button hidden on step 1 but layout preserved */}
                <button
                    disabled
                    className="text-slate-300 dark:text-slate-700 font-medium px-4 py-2 cursor-default opacity-0"
                >
                    ← Back
                </button>

                <button
                    onClick={handleContinueClick}
                    disabled={!isValid}
                    className="bg-gradient-to-r from-brand-primary to-brand-accent text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-primary/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    Continue to Preferences
                    <span className="text-white/60">→</span>
                </button>
            </div>
        </div>
    );
};

export default DestinationsStep;

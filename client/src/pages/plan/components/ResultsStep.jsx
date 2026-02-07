import React, { useState, useEffect } from 'react';
import { useTrip } from '../TripContext';
import { MapPin, Calendar, Users, DollarSign, Share2, Download, Heart, CheckCircle, Clock, Star, Info } from 'lucide-react';
import { format } from 'date-fns';
import Sidebar from './Sidebar';
import MapComponent from './MapComponent';

const ResultsStep = () => {
    const {
        destinations,
        startDate,
        travelers,
        travelType,
        maxBudget,
        allocation,
        generatedTrip,
        isGenerating,
        generationError,
        generateTripPlan
    } = useTrip();

    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (!generatedTrip && !isGenerating && !generationError) {
            generateTripPlan();
        }
    }, []);

    const totalDuration = destinations.reduce((acc, dest) => acc + parseInt(dest.duration || 0), 0);
    const endDate = startDate ? new Date(new Date(startDate).getTime() + (totalDuration * 24 * 60 * 60 * 1000)) : new Date();

    if (isGenerating) {
        return (
            <div className="flex flex-col items-center justify-center p-12 h-96">
                <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Generating your perfect trip...</h3>
                <p className="text-slate-500">We are crafting an itinerary based on your preferences. This may take up to a minute.</p>
            </div>
        );
    }

    if (generationError) {
        return (
            <div className="flex flex-col items-center justify-center p-12 h-96">
                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Something went wrong</h3>
                <p className="text-slate-500 mb-6">{generationError}</p>
                <button
                    onClick={() => generateTripPlan(true)}
                    className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // Helper to filter out placeholder strings
    const firstValidImage = (url, fallback) => {
        if (!url || url === 'LEAVE_EMPTY' || url.includes('LEAVE_EMPTY')) return fallback;
        return url;
    };

    // Check if we have valid data
    const itineraryData = generatedTrip?.itinerary || [];
    const tripName = generatedTrip?.trip_name || `Trip to ${destinations[0]?.city}`;
    const hotels = generatedTrip?.hotels || [];
    const flights = generatedTrip?.flights || [];

    // Map Locations
    const mapLocations = [
        ...hotels.map(h => ({
            lat: h.coordinates?.[0] || 48.8566,
            lng: h.coordinates?.[1] || 2.3522,
            title: h.name,
            type: 'hotel',
            description: h.rating,
            label: 'H'
        })),
        ...itineraryData.flatMap(day =>
            (day.activities || []).map(act => ({
                lat: act.coordinates?.[0] || 48.8566,
                lng: act.coordinates?.[1] || 2.3522,
                title: act.activity,
                type: 'activity',
                description: act.description,
                label: day.day // Pass day number
            }))
        )
    ];

    // Fallback if itinerary is empty but successful?
    if (!itineraryData.length && !hotels.length) {
        return (
            <div className="flex flex-col items-center justify-center p-12">
                <p>No itinerary generated. Please try again.</p>
                <button
                    onClick={() => generateTripPlan(true)}
                    className="mt-4 px-6 py-2 bg-brand-primary text-white rounded-lg"
                >
                    Retry
                </button>
            </div>
        )
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Budget</h4>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">₹{maxBudget.toLocaleString('en-IN')}</div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Activities</h4>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{itineraryData.reduce((acc, day) => acc + (day.activities?.length || 0), 0)} Planned</div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hotels</h4>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{hotels.length} Options</div>
                            </div>
                        </div>

                        {/* Destinations Hero */}
                        {destinations.map(dest => (
                            <div key={dest.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                                <div className="h-64 bg-slate-200 dark:bg-slate-700 relative group">
                                    <img
                                        src={`https://source.unsplash.com/1200x600/?${dest.city},landmark`}
                                        alt={dest.city}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80'}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                                    <div className="absolute bottom-0 left-0 right-0 p-8">
                                        <h3 className="text-4xl font-bold text-white mb-2">{dest.city}</h3>
                                        <p className="text-white/90 text-lg">{dest.duration} days of {travelType} adventures</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
                            <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                                <Info size={18} /> Trip Highlights
                            </h4>
                            <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                                This trip is curated for a <strong>{travelType}</strong> experience.
                                You will be spending roughly ₹{Math.round(maxBudget * (allocation.activities / 100)).toLocaleString('en-IN')} on activities
                                and ₹{Math.round(maxBudget * (allocation.food / 100)).toLocaleString('en-IN')} on dining.
                                Prepare for an unforgettable journey through {destinations.map(d => d.city).join(', ')}.
                            </p>
                        </div>
                    </div>
                );

            case 'itinerary':
                return (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {itineraryData.map((dayPlan, dayIndex) => (
                            <div key={dayIndex} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">Day {dayPlan.day}: {dayPlan.theme}</h4>
                                    <span className="text-xs font-mono bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500">
                                        {dayPlan.activities?.length || 0} Stops
                                    </span>
                                </div>
                                <div className="p-0">
                                    {dayPlan.activities?.map((activity, actIndex) => (
                                        <div key={actIndex} className="p-6 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                            <div className="flex flex-col md:flex-row gap-6">
                                                {/* Image */}
                                                <div className="w-full md:w-32 h-32 rounded-xl bg-slate-200 overflow-hidden shadow-sm flex-shrink-0">
                                                    <img
                                                        src={firstValidImage(activity.image_url, `https://source.unsplash.com/200x200/?${activity.activity},${destinations[0].city}`)}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        alt={activity.activity}
                                                        onError={(e) => e.target.src = `https://source.unsplash.com/200x200/?travel`}
                                                    />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h5 className="font-bold text-slate-800 dark:text-white text-lg">{activity.activity}</h5>
                                                        <span className="flex items-center gap-1 text-xs font-medium bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">
                                                            <Clock size={12} /> {activity.time}
                                                        </span>
                                                    </div>

                                                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                                                        {activity.description}
                                                    </p>

                                                    {/* Details Badges */}
                                                    {activity.details && (
                                                        <div className="flex flex-wrap gap-2 mt-3">
                                                            {activity.details.famous_for && (
                                                                <span className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded border border-purple-100 dark:border-purple-800/30">
                                                                    ✨ {activity.details.famous_for}
                                                                </span>
                                                            )}
                                                            {activity.details.best_time_to_visit && (
                                                                <span className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-2 py-1 rounded border border-amber-100 dark:border-amber-800/30">
                                                                    ☀️ Best: {activity.details.best_time_to_visit}
                                                                </span>
                                                            )}
                                                            {activity.details.opening_hours && (
                                                                <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded border border-blue-100 dark:border-blue-800/30">
                                                                    🕒 {activity.details.opening_hours}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                                        <div className="font-bold">₹</div> Est. Cost: {activity.cost_estimate}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'map':
                return (
                    <div className="h-[600px] animate-in fade-in duration-300">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Trip Map</h3>
                        <MapComponent
                            locations={mapLocations}
                            center={destinations[0] ? [destinations[0].lat, destinations[0].lng] : [48.8566, 2.3522]}
                        />
                        {/* TODO: Pass dynamic center from trip data */}
                    </div>
                );

            case 'hotels':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recommended Hotels</h3>
                        <div className="space-y-4">
                            {hotels.map((hotel, index) => (
                                <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row">
                                    <div className="w-full md:w-72 h-48 md:h-auto bg-slate-200 relative shrink-0">
                                        <img
                                            src={hotel.image_url || `https://source.unsplash.com/600x400/?hotel,${destinations[0].city}`}
                                            className="w-full h-full object-cover"
                                            alt={hotel.name}
                                            onError={(e) => e.target.src = `https://source.unsplash.com/600x400/?luxury,hotel`}
                                        />
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-slate-700 flex items-center gap-1 shadow-sm">
                                            <Star size={12} className="text-amber-500 fill-amber-500" /> {hotel.rating}
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-xl text-slate-900 dark:text-white mb-1">{hotel.name}</h4>
                                                <p className="text-sm text-slate-500 flex items-center gap-1">
                                                    <MapPin size={14} /> {hotel.address || `Near City Center, ${destinations[0].city}`}
                                                </p>
                                            </div>
                                            <div className="text-right hidden md:block">
                                                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 block">₹{Number(hotel.price_per_night || 0).toLocaleString('en-IN')}</span>
                                                <span className="text-xs text-slate-400">per night</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-2 mb-auto">
                                            {hotel.features?.map((feature, i) => (
                                                <span key={i} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600">
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center md:justify-end gap-4">
                                            <div className="md:hidden">
                                                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">₹{Number(hotel.price_per_night || 0).toLocaleString('en-IN')}</span>
                                                <span className="text-xs text-slate-400 block">/ night</span>
                                            </div>
                                            <button className="bg-brand-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/20 flex-1 md:flex-none">
                                                View Deal
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'travel':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Flight Options</h3>
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 uppercase font-bold text-xs">
                                        <tr>
                                            <th className="px-6 py-4">Route</th>
                                            <th className="px-6 py-4">Airline</th>
                                            <th className="px-6 py-4">Duration</th>
                                            <th className="px-6 py-4">Est. Price</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {flights.map((flight, index) => (
                                            <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{flight.route}</td>
                                                <td className="px-6 py-4">{flight.airline_options?.join(', ')}</td>
                                                <td className="px-6 py-4">{flight.duration}</td>
                                                <td className="px-6 py-4 text-emerald-600 font-bold">₹{flight.price_estimate}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {flights.length === 0 && (
                                <div className="p-8 text-center text-slate-500">No flight information available.</div>
                            )}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                            <CheckCircle size={12} /> Trip Ready {generatedTrip.source === 'cache' && '(Cached)'}
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        {tripName}
                    </h2>
                    <p className="text-slate-500 flex flex-wrap items-center gap-4 text-sm">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {startDate ? format(new Date(startDate), 'MMM dd') : ''} - {format(endDate, 'MMM dd, yyyy')}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full hidden md:block" />
                        <span className="flex items-center gap-1"><Users size={14} /> {travelers} Travelers</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full hidden md:block" />
                        <span className="flex items-center gap-1"><div className="font-bold">₹</div> {maxBudget.toLocaleString('en-IN')} Budget</span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm transition-colors">
                        <Heart size={20} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-brand-primary bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm transition-colors">
                        <Share2 size={20} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-brand-primary bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm transition-colors">
                        <Download size={20} />
                    </button>
                    <button
                        onClick={() => generateTripPlan(true)}
                        className="p-2 text-slate-400 hover:text-brand-primary bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm transition-colors"
                        title="Regenerate Trip"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="flex-1 w-full space-y-8 min-w-0">
                    {renderContent()}
                </div>
            </div>

            <div className="flex justify-between pt-4 pb-12">
                <button
                    onClick={() => goToStep(3)}
                    className="text-slate-500 hover:text-slate-700 font-medium px-4 py-2 transition-colors border-2 border-transparent hover:border-slate-200 rounded-xl"
                >
                    ← Back to Budget
                </button>
            </div>
        </div>
    );
};

export default ResultsStep;

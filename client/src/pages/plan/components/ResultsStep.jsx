import React, { useState, useEffect } from 'react';
import { useTrip } from '../TripContext';
import { MapPin, Calendar, Users, DollarSign, Share2, Download, Heart, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

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

    // Check if we have valid data
    const itineraryData = generatedTrip?.itinerary || [];
    const tripName = generatedTrip?.trip_name || `Trip to ${destinations[0]?.city}`;

    // Fallback if itinerary is empty but successful?
    if (!itineraryData.length) {
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

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                            <CheckCircle size={12} /> Trip Ready {generatedTrip.source === 'cache' && '(Cached)'}
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        {tripName}
                    </h2>
                    <p className="text-slate-500 flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {startDate ? format(new Date(startDate), 'MMM dd') : ''} - {format(endDate, 'MMM dd, yyyy')}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="flex items-center gap-1"><Users size={14} /> {travelers} Travelers</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="flex items-center gap-1"><DollarSign size={14} /> ${maxBudget.toLocaleString()} Budget</span>
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
                    {/* Regenerate Button */}
                    <button
                        onClick={() => generateTripPlan(true)}
                        className="p-2 text-slate-400 hover:text-brand-primary bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm transition-colors"
                        title="Regenerate Trip"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Itinerary Feed */}
                <div className="lg:col-span-2 space-y-6">
                    {destinations.map((dest, destIndex) => (
                        <div key={dest.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                            <div className="h-48 bg-slate-200 dark:bg-slate-700 relative">
                                <img
                                    src={`https://source.unsplash.com/800x400/?city,${dest.city}`}
                                    alt={dest.city}
                                    className="w-full h-full object-cover"
                                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80'}
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                    <h3 className="text-2xl font-bold text-white">{dest.city}</h3>
                                    <p className="text-white/80 text-sm">{dest.duration} days • {itineraryData.length} Activities planned</p>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Iterate through AI generated days */}
                                {itineraryData.map((dayPlan, dayIndex) => (
                                    <div key={dayIndex} className="relative pl-8 border-l-2 border-slate-200 dark:border-slate-700 pb-6 last:pb-0 font-sans">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-primary border-4 border-white dark:border-slate-800" />
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-2">Day {dayPlan.day}: {dayPlan.theme}</h4>
                                        <div className="space-y-3">
                                            {dayPlan.activities.map((activity, actIndex) => (
                                                <div key={actIndex} className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl flex gap-3 text-sm">
                                                    <div className="w-16 h-16 rounded-lg bg-slate-200 flex-shrink-0 overflow-hidden">
                                                        <img src={`https://source.unsplash.com/100x100/?${activity.activity}`} className="w-full h-full object-cover" alt=""
                                                            onError={(e) => e.target.src = `https://source.unsplash.com/100x100/?travel`}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <div className="font-semibold text-slate-800 dark:text-slate-200">{activity.activity}</div>
                                                            <span className="text-xs font-mono bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">{activity.time}</span>
                                                        </div>
                                                        <p className="text-slate-500 text-xs mt-1">{activity.description}</p>
                                                        <div className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                                            Est. Cost: {activity.cost_estimate}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sticky Summary */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm sticky top-10">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Trip Summary</h3>

                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700/50">
                                <span className="text-slate-500">Total Budget</span>
                                <span className="font-bold text-slate-900 dark:text-white">${maxBudget.toLocaleString()}</span>
                            </div>

                            <div>
                                <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2 text-xs uppercase tracking-wider">Estimated Costs</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">Travel ({allocation.travel}%)</span>
                                        <span className="text-slate-700 dark:text-slate-300 font-medium">${Math.round(maxBudget * (allocation.travel / 100)).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">Accommodation ({allocation.accommodation}%)</span>
                                        <span className="text-slate-700 dark:text-slate-300 font-medium">${Math.round(maxBudget * (allocation.accommodation / 100)).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">Food ({allocation.food}%)</span>
                                        <span className="text-slate-700 dark:text-slate-300 font-medium">${Math.round(maxBudget * (allocation.food / 100)).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">Activities ({allocation.activities}%)</span>
                                        <span className="text-slate-700 dark:text-slate-300 font-medium">${Math.round(maxBudget * (allocation.activities / 100)).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full bg-brand-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:scale-[1.02] transition-all mt-4">
                                Book This Trip
                            </button>
                        </div>
                    </div>
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

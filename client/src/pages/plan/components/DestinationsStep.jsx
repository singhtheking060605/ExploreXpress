import React, { useState } from 'react';
import { useTrip } from '../TripContext';
import { Calendar, MapPin, Plus, X, Search, Clock } from 'lucide-react';
import { format } from 'date-fns';

const DestinationsStep = () => {
    const {
        startDate, setStartDate,
        fromLocation, setFromLocation,
        destinations, setDestinations,
        completeStep, goToStep
    } = useTrip();

    const [locationInput, setLocationInput] = useState('');
    const [durationInput, setDurationInput] = useState('3');
    const [isAdding, setIsAdding] = useState(false);

    const handleAddDestination = () => {
        if (!locationInput) return;
        setDestinations(prev => [...prev, {
            id: Date.now(),
            city: locationInput,
            duration: durationInput
        }]);
        setLocationInput('');
        setDurationInput('3');
        setIsAdding(false);
    };

    const removeDestination = (id) => {
        setDestinations(prev => prev.filter(d => d.id !== id));
    };

    const handleContinue = () => {
        if (destinations.length > 0 && startDate && fromLocation) {
            completeStep(1);
            goToStep(2);
        }
    };

    const isValid = destinations.length > 0 && startDate && fromLocation;

    return (
        <div className="space-y-8">
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
                        <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
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
                        <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="e.g. Mumbai, India"
                            value={fromLocation}
                            onChange={(e) => setFromLocation(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-primary/50 transition-all outline-none"
                        />
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
                                onClick={() => removeDestination(dest.id)}
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
                                <Search className="absolute left-3 top-3.5 text-brand-primary/40" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search for a city..."
                                    value={locationInput}
                                    onChange={(e) => setLocationInput(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border-none bg-white/80 focus:ring-2 focus:ring-brand-primary/20 text-sm"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddDestination()}
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

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleContinue}
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

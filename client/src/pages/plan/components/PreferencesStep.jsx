import React from 'react';
import { useTrip } from '../TripContext';
import { Users, Palmtree, Briefcase, Mountain, BookOpen, Coffee, User } from 'lucide-react';
import clsx from 'clsx';

const PreferencesStep = () => {
    const {
        travelers, setTravelers,
        travelType, setTravelType,
        completeStep, goToStep
    } = useTrip();

    const travelTypes = [
        { id: 'Leisure', label: 'Leisure', description: 'Relaxing vacation, sightseeing, entertainment', icon: Palmtree, color: 'text-pink-500', bg: 'bg-pink-50', border: 'border-pink-200' },
        { id: 'Business', label: 'Business', description: 'Work meetings, conferences, professional', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
        { id: 'Adventure', label: 'Adventure', description: 'Outdoor activities, hiking, extreme sports', icon: Mountain, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
        { id: 'Cultural', label: 'Cultural', description: 'Museums, historical sites, local experiences', icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
        { id: 'Solo', label: 'Solo Travel', description: 'Independent exploration, self-discovery', icon: User, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200' },
        { id: 'Family', label: 'Family', description: 'Kid-friendly activities, family bonding', icon: Users, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
    ];

    const handleContinue = () => {
        completeStep(2);
        goToStep(3);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 mb-2">
                <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                    <Users size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Travel Preferences</h2>
                    <p className="text-slate-500">Tell us about your travel style and group size</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <Users size={20} className="text-brand-primary" />
                    Number of Travelers
                </h3>
                <p className="text-slate-500 mb-6">How many people are traveling?</p>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setTravelers(Math.max(1, travelers - 1))}
                        className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 flex items-center justify-center text-xl font-bold transition-colors"
                    >
                        -
                    </button>
                    <div className="w-32 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xl">
                        {travelers}
                    </div>
                    <button
                        onClick={() => setTravelers(travelers + 1)}
                        className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 flex items-center justify-center text-xl font-bold transition-colors"
                    >
                        +
                    </button>
                    <span className="text-sm text-slate-500 ml-2">
                        {travelers === 1 ? 'Solo traveler' : `${travelers} people`}
                    </span>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <Palmtree size={20} className="text-brand-primary" />
                    Travel Type
                </h3>
                <p className="text-slate-500 mb-6">What kind of experience are you looking for?</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {travelTypes.map((type) => {
                        const isSelected = travelType === type.id;
                        const Icon = type.icon;

                        return (
                            <button
                                key={type.id}
                                onClick={() => setTravelType(type.id)}
                                className={clsx(
                                    "relative p-4 rounded-xl text-left border-2 transition-all duration-200 flex flex-col gap-3 group h-full",
                                    isSelected
                                        ? "border-brand-primary bg-brand-primary/5 shadow-md"
                                        : "border-slate-100 dark:border-slate-700 hover:border-brand-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                )}
                            >
                                <div className={clsx(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                    isSelected ? "bg-brand-primary text-white" : `${type.bg} ${type.color}`
                                )}>
                                    <Icon size={20} />
                                </div>
                                <div>
                                    <h4 className={clsx("font-bold mb-1", isSelected ? "text-brand-primary" : "text-slate-800 dark:text-slate-200")}>
                                        {type.label}
                                    </h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        {type.description}
                                    </p>
                                </div>
                                {isSelected && (
                                    <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-brand-primary" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <button
                    onClick={() => goToStep(1)}
                    className="text-slate-500 hover:text-slate-700 font-medium px-4 py-2 transition-colors"
                >
                    ← Back to Destinations
                </button>
                <button
                    onClick={handleContinue}
                    className="bg-gradient-to-r from-brand-primary to-brand-accent text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-primary/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                >
                    Continue to Budget
                    <span className="text-white/60">→</span>
                </button>
            </div>
        </div>
    );
};

export default PreferencesStep;

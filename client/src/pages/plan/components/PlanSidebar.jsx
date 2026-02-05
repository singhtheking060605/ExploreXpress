import React, { useMemo } from 'react';
import { useTrip } from '../TripContext';
import clsx from 'clsx';
import { MapPin, Settings, DollarSign, Sparkles, CheckCircle2, Circle } from 'lucide-react';
import { format } from 'date-fns';

const PlanSidebar = () => {
    const {
        currentStep,
        completedSteps,
        goToStep,
        destinations,
        startDate,
        travelers,
        travelType,
        maxBudget,
        isCapped,
        allocation
    } = useTrip();

    const steps = [
        { id: 1, label: 'Destinations', sub: 'Select your destinations', icon: MapPin },
        { id: 2, label: 'Preferences', sub: 'Travel style and group size', icon: Settings },
        { id: 3, label: 'Budget', sub: 'Set your budget', icon: DollarSign },
        { id: 4, label: 'Results', sub: 'Choose your trip', icon: Sparkles },
    ];

    const isStepClickable = (stepId) => {
        return stepId < currentStep || completedSteps.includes(stepId - 1) || stepId === 1;
    };

    const totalDuration = useMemo(() => {
        return destinations.reduce((acc, dest) => acc + parseInt(dest.duration || 0), 0);
    }, [destinations]);

    const formattedDate = useMemo(() => {
        if (!startDate) return '';
        return format(new Date(startDate), 'MMM dd, yyyy');
    }, [startDate]);

    const endDate = useMemo(() => {
        if (!startDate || totalDuration === 0) return '';
        const end = new Date(startDate);
        end.setDate(end.getDate() + totalDuration);
        return format(end, 'MMM dd, yyyy');
    }, [startDate, totalDuration]);

    return (
        <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl h-screen flex flex-col fixed left-0 top-0 z-20 overflow-y-auto">
            <div className="p-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent mb-1">
                    Plan Your Trip
                </h2>
                <p className="text-xs text-slate-500 mb-8">
                    Follow these steps to create your perfect itinerary
                </p>

                <div className="space-y-4 relative">
                    {/* Vertical Line Connector (Visual only, behind items) */}
                    <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-100 dark:bg-slate-800 -z-10" />

                    {steps.map((step) => {
                        const isActive = currentStep === step.id;
                        const isCompleted = completedSteps.includes(step.id);
                        const isClickable = isStepClickable(step.id);
                        const Icon = step.icon;

                        return (
                            <button
                                key={step.id}
                                onClick={() => isClickable && goToStep(step.id)}
                                disabled={!isClickable}
                                className={clsx(
                                    "w-full flex items-center p-3 rounded-xl border-2 transition-all duration-200 text-left bg-white dark:bg-slate-900",
                                    isActive
                                        ? "border-brand-primary/50 shadow-lg shadow-brand-primary/10"
                                        : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50",
                                    !isClickable && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                <div className={clsx(
                                    "w-10 h-10 rounded-full flex items-center justify-center mr-3 shrink-0 transition-colors",
                                    isActive ? "bg-brand-primary/10 text-brand-primary" :
                                        isCompleted ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                                )}>
                                    {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                                </div>
                                <div>
                                    <h3 className={clsx("font-semibold text-sm", isActive ? "text-brand-primary" : "text-slate-700 dark:text-slate-200")}>
                                        {step.label}
                                    </h3>
                                    <p className="text-xs text-slate-500">{step.sub}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
                    <div className="flex items-center gap-2 mb-3 text-brand-primary font-semibold text-sm">
                        <Sparkles size={16} />
                        Trip Summary
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-start">
                            <span className="text-slate-500 text-xs flex items-center gap-1.5">
                                <MapPin size={12} /> Destinations:
                            </span>
                            <span className="font-medium text-slate-700 dark:text-slate-300 text-right">
                                {destinations.length > 0 ? `${destinations.length} cities` : '-'}
                            </span>
                        </div>

                        {destinations.length > 0 && (
                            <div className="pl-4 border-l-2 border-brand-primary/20 text-xs text-brand-secondary/80 py-1">
                                {destinations.map(d => d.city.split(',')[0]).join(' → ')}
                            </div>
                        )}

                        <div className="h-px bg-slate-200 dark:bg-slate-800/50 my-2" />

                        <div className="grid grid-cols-2 gap-y-2 text-xs">
                            <span className="text-slate-500">Start Date:</span>
                            <span className="text-right font-medium text-slate-700">{formattedDate || '-'}</span>

                            <span className="text-slate-500">Duration:</span>
                            <span className="text-right font-medium text-slate-700">{totalDuration > 0 ? `${totalDuration} days` : '-'}</span>

                            <span className="text-slate-500">End Date:</span>
                            <span className="text-right font-medium text-slate-700">{endDate || '-'}</span>

                            <span className="text-slate-500">Travelers:</span>
                            <span className="text-right font-medium text-slate-700">{travelers} people</span>

                            <span className="text-slate-500">Travel Style:</span>
                            <span className="text-right font-medium text-slate-700">{travelType}</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default PlanSidebar;


import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowRight, Star, Clock, Flame } from 'lucide-react';

const ExploreCard = ({ trip, onOpenModal }) => {
    // Get top 3 events
    const topEvents = trip.events ? trip.events.slice(0, 3) : [];

    // Countdown Logic for the FIRST event
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (topEvents.length === 0) return;

        const firstEventDateStr = topEvents[0].date;
        // Parse "Feb 23, 2026" or similar. Robust parsing needed.
        // We'll simplisticly assume it has a valid year or fallback to current year
        let targetDate = new Date();
        const currentYear = new Date().getFullYear();

        // Handling specific formats
        if (firstEventDateStr.includes('Daily') || firstEventDateStr.includes('Every')) {
            setTimeLeft('Happening Daily');
            return;
        }

        try {
            // Try appending year if missing? 
            // Ideally the date string like "Feb 25, 2026" is parseable
            const dateToParse = firstEventDateStr.match(/\d{4}/) ? firstEventDateStr : `${firstEventDateStr} ${currentYear} `;
            targetDate = new Date(dateToParse);
            if (isNaN(targetDate.getTime())) throw new Error("Invalid Date");
        } catch (e) {
            setTimeLeft(''); // Fail silently
            return;
        }

        const calculateTimeLeft = () => {
            const now = new Date();
            const diff = targetDate - now;

            if (diff < 0) {
                // Event passed or happening today/now (if we ignore time)
                if (diff > -86400000) return "Happening Now!";
                return "Completed";
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            if (days === 0) return "Starts Tomorrow!";
            return `${days} Days to go`;
        };

        setTimeLeft(calculateTimeLeft());
    }, [topEvents]);

    return (
        <div className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full">

            {/* Image Section */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={trip.imageUrl || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"}
                    alt={trip.destination}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop";
                    }}
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

                {/* Top Tags */}
                <div className="absolute top-4 right-4 flex gap-2">
                    <span className="bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-sm flex items-center gap-1">
                        {trip.category}
                    </span>
                    {timeLeft && timeLeft !== 'Completed' && (
                        <span className={`px - 3 py - 1 rounded - full text - xs font - bold uppercase tracking - wider shadow - sm flex items - center gap - 1 border ${timeLeft === 'Happening Now!' || timeLeft === 'Happening Daily'
                            ? 'bg-red-500 text-white border-red-400 animate-pulse'
                            : 'bg-slate-900/60 backdrop-blur-md text-white border-white/20'
                            } `}>
                            {timeLeft === 'Happening Now!' ? <Flame size={10} /> : <Clock size={10} />}
                            {timeLeft}
                        </span>
                    )}
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90">
                        {trip.destination}
                    </h3>
                    <div className="flex items-center text-slate-300 text-sm mt-1 space-x-2">
                        <MapPin size={14} className="text-brand-primary" />
                        <span>{trip.location || trip.region}</span>
                        <span className="text-slate-500">•</span>
                        <span>{trip.weather?.temp || '25°C'}</span>
                    </div>
                </div>
            </div>


            {/* Content Section */}
            <div className="p-6 flex-1 flex flex-col">

                {/* Famous For Tags */}
                <div className="mb-6">
                    <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Famous For</div>
                    <div className="flex flex-wrap gap-2">
                        {trip.famous_for.split('+').map((item, i) => (
                            <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors hover:bg-brand-primary/10 hover:text-brand-primary border-transparent">
                                {item.trim()}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="mb-6 flex-1">
                    <div className="flex items-center gap-2 mb-3">
                        <Calendar size={16} className="text-brand-primary" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Upcoming Events</span>
                    </div>

                    <div className="space-y-3">
                        {topEvents.length > 0 ? (
                            topEvents.map((event, idx) => {
                                const dateParts = event.date ? event.date.split(' ') : [''];
                                const isDate = dateParts.length > 1;
                                const top = isDate ? dateParts[0].substring(0, 3) : 'EVT';
                                const bottom = isDate ? dateParts[1].replace(',', '') : (dateParts[0] ? dateParts[0].substring(0, 4) : '???');

                                return (
                                    <div key={idx} className="flex items-center gap-3 group/event cursor-default p-2 -mx-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div className="flex-shrink-0 w-12 text-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700 shadow-sm">
                                            <div className="text-[10px] font-bold text-red-500 uppercase leading-tight">{top}</div>
                                            <div className={`font - bold text - slate - 800 dark: text - slate - 200 leading - tight ${bottom.length > 3 ? 'text-[10px]' : 'text-sm'} `}>{bottom}</div>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate group-hover/event:text-brand-primary transition-colors">
                                                {event.name}
                                            </div>
                                            <div className="text-xs text-slate-400 truncate flex items-center gap-1">
                                                <span>{event.type}</span>
                                                <span className="w-0.5 h-0.5 rounded-full bg-slate-400" />
                                                <span>{event.source}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-sm text-slate-400 italic py-2">No specific events listed.</div>
                        )}
                    </div>
                </div>

                {/* Action Button */}
                {/* Action Button */}
                <button
                    onClick={() => {
                        // Navigate to plan with destination
                        // Use location if available, else destination name
                        const target = trip.location || trip.destination;
                        window.location.href = `/plan?destination=${encodeURIComponent(target)}`;
                    }}
                    className="w-full mt-auto flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm shadow-xl shadow-slate-200 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group-hover:bg-brand-primary group-hover:text-white"
                >
                    Plan Trip
                    <ArrowRight size={18} />
                </button>
            </div>
        </div >
    );
};

export default ExploreCard;

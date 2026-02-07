import React from 'react';
import { X, Calendar, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TimelineModal = ({ trip, onClose }) => {
    const navigate = useNavigate();

    if (!trip) return null;

    const handlePlanTrip = () => {
        navigate(`/plan?destination=${encodeURIComponent(trip.destination)}`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="relative h-48 sm:h-64">
                    <img
                        src={trip.imageUrl || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"}
                        alt={trip.destination}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
                        <h2 className="text-3xl font-bold text-white mb-1">{trip.destination}</h2>
                        <span className="text-white/90 text-sm font-medium bg-brand-primary/80 px-3 py-1 rounded-full w-fit backdrop-blur-md">
                            {trip.region} • {trip.category}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">

                    {/* Insights */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                            <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Top Trending Reason</h4>
                            <p className="text-slate-800 dark:text-slate-200 font-medium">{trip.trending_reason}</p>
                        </div>
                        <div className="bg-brand-primary/5 dark:bg-brand-primary/10 p-4 rounded-xl border border-brand-primary/10">
                            <h4 className="text-sm font-semibold text-brand-primary mb-1 uppercase tracking-wider">Famous For</h4>
                            <p className="text-slate-800 dark:text-slate-200 font-medium">{trip.famous_for}</p>
                        </div>
                    </div>

                    {/* Timeline */}
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <Calendar className="text-brand-primary" size={24} />
                        Upcoming Events
                    </h3>

                    <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-8 pb-4">
                        {trip.events && trip.events.length > 0 ? (
                            trip.events.map((event, index) => (
                                <div key={index} className="relative pl-8 group">
                                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-4 border-brand-primary transition-transform group-hover:scale-125" />

                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                        <div>
                                            <span className="text-xs font-bold text-brand-primary uppercase tracking-wide bg-brand-primary/10 px-2 py-0.5 rounded">
                                                {event.date}
                                            </span>
                                            <h4 className="text-lg font-bold text-slate-800 dark:text-white mt-1 group-hover:text-brand-primary transition-colors">
                                                {event.name}
                                            </h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{event.type}</p>
                                        </div>

                                        {event.bookingLink && (
                                            <a
                                                href={event.bookingLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline shrink-0"
                                            >
                                                Book Now <ExternalLink size={14} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 pl-8">No specific upcoming events found explicitly, but the destination is open for exploration!</p>
                        )}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
                    <button
                        onClick={handlePlanTrip}
                        className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-brand-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        Plan Trip to {trip.destination}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimelineModal;

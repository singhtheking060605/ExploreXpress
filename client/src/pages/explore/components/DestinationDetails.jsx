import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Clock, ExternalLink, Navigation, Info, Cloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DestinationDetails = ({ destination, onClose }) => {
    const navigate = useNavigate();

    if (!destination) return null;

    const handlePlanTrip = () => {
        onClose();
        navigate(`/plan?destination=${encodeURIComponent(destination.destination)}`);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col md:flex-row"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-black/20 text-white hover:bg-black/40 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {/* Image Section */}
                    <div className="md:w-2/5 h-64 md:h-auto relative">
                        <img
                            src={destination.imageUrl}
                            alt={destination.destination}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black/80 to-transparent w-full">
                            <h2 className="text-3xl font-bold text-white mb-2">{destination.destination}</h2>
                            <div className="flex items-center gap-2 text-white/80">
                                <MapPin size={16} />
                                <span>{destination.region}</span>
                            </div>
                            {destination.weather && (
                                <div className="flex items-center gap-2 text-white/80 mt-2">
                                    <Cloud size={16} />
                                    <span>{destination.weather.temp} • {destination.weather.condition}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-8 overflow-y-auto">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Calendar className="text-brand-primary" />
                            Upcoming Events & Check-ins
                        </h3>

                        <div className="space-y-8 relative pl-4 border-l-2 border-slate-100 dark:border-slate-800 ml-2">
                            {destination.events?.length > 0 ? (
                                destination.events.map((event, index) => (
                                    <div key={index} className="relative pl-8 group">
                                        {/* Timeline Dot */}
                                        <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 bg-brand-primary group-hover:scale-125 transition-transform shadow-sm" />

                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-brand-primary/30 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-slate-800 dark:text-white text-lg">{event.name}</h4>
                                                <span className="px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wider">
                                                    {event.type || 'Event'}
                                                </span>
                                            </div>
                                            <p className="text-slate-500 text-sm mb-4 flex items-center gap-2">
                                                <Calendar size={14} />
                                                {event.date}
                                            </p>

                                            {event.bookingLink && (
                                                <a
                                                    href={event.bookingLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary hover:text-brand-accent transition-colors"
                                                >
                                                    Book Tickets <ExternalLink size={14} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 italic pl-8">No major upcoming events found.</p>
                            )}
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={handlePlanTrip}
                                className="w-full py-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 transition-all transform active:scale-[0.98]"
                            >
                                Plan a Trip to {destination.destination}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default DestinationDetails;

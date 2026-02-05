import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Plus as PlusIcon } from 'lucide-react'; // Fix PlusIcon import
import clsx from 'clsx';
import { Link } from 'react-router-dom';

const MY_TRIPS = [
    { id: 1, destination: "Tokyo, Japan", dates: "Oct 24 - Oct 29", status: "Upcoming", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop" },
    { id: 2, destination: "Manali, India", dates: "Dec 10 - Dec 15", status: "Planned", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1000&auto=format&fit=crop" },
    { id: 3, destination: "Bali, Indonesia", dates: "Aug 12 - Aug 18", status: "Completed", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop" },
];

const MyTripsSection = () => {
    const [tripTab, setTripTab] = useState('Upcoming');

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-brand-primary rounded-full" />
                    My Trips
                </h2>
                <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
                    {['Upcoming', 'Planned', 'Completed'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setTripTab(tab)}
                            className={clsx(
                                "px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                                tripTab === tab
                                    ? "bg-white dark:bg-slate-700 text-brand-primary shadow-sm"
                                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MY_TRIPS.filter(t => t.status === tripTab || tripTab === 'All').map((trip) => (
                    <motion.div
                        key={trip.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 group hover:shadow-xl transition-all"
                    >
                        <div className="h-48 overflow-hidden relative">
                            <img src={trip.image} alt={trip.destination} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-primary">
                                {trip.status}
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold dark:text-white mb-2">{trip.destination}</h3>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-6">
                                <Calendar size={16} />
                                {trip.dates}
                            </div>
                            <button className="w-full py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                View Itinerary
                            </button>
                        </div>
                    </motion.div>
                ))}
                {/* Add New Trip Card */}
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all min-h-[300px]">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4 group-hover:text-brand-primary transition-colors">
                        <PlusIcon size={32} />
                    </div>
                    <h3 className="text-lg font-bold dark:text-white">Plan New Trip</h3>
                    <p className="text-slate-400 text-sm">Start a new adventure</p>
                </div>
            </div>
        </section>
    );
};

export default MyTripsSection;

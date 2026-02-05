
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, DollarSign, Clock, Plane } from 'lucide-react';
import clsx from 'clsx';

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('itinerary');

    const itinerary = [
        {
            day: "Day 1",
            title: "Arrival in Tokyo",
            events: [
                { time: "09:00 AM", title: "Land at Narita Airport", icon: Plane },
                { time: "11:00 AM", title: "Check-in at Hotel Gracery", icon: MapPin },
                { time: "02:00 PM", title: "Explore Shinjuku", icon: MapPin },
            ]
        },
        {
            day: "Day 2",
            title: "Historical Vibes",
            events: [
                { time: "09:00 AM", title: "Senso-ji Temple", icon: MapPin },
                { time: "01:00 PM", title: "Lunch at Asakusa", icon: DollarSign },
                { time: "04:00 PM", title: "Tokyo Skytree", icon: MapPin },
            ]
        }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold dark:text-white">Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400">Welcome back, Aryan. Ready for your next adventure?</p>
                </div>
                <button
                    onClick={() => navigate('/plan')}
                    className="px-6 py-2.5 bg-brand-primary text-white rounded-xl shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 transition-colors font-medium"
                >
                    + New Trip
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* Left Column: Input & Summary */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Input Card */}
                    <div className="glass dark:glass-dark p-6 rounded-2xl">
                        <h2 className="text-lg font-bold dark:text-white mb-4">Quick Plan</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Origin</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input type="text" defaultValue="New Delhi, India" className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl py-3 pl-10 pr-4 text-sm dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary/50 outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Destination</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-primary" size={16} />
                                    <input type="text" defaultValue="Tokyo, Japan" className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl py-3 pl-10 pr-4 text-sm dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary/50 outline-none" />
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/plan')}
                                className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity"
                            >
                                Generate Itinerary
                            </button>
                        </div>
                    </div>

                    {/* Trip Summary Card */}
                    <div className="glass dark:glass-dark overflow-hidden rounded-2xl relative group cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/80 to-brand-secondary/80 mix-blend-multiply opacity-0 group-hover:opacity-10 transition-opacity" />
                        <div className="h-32 bg-[url('https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center" />
                        <div className="p-6 relative">
                            <div className="absolute -top-10 right-6 w-20 h-20 rounded-xl bg-white dark:bg-slate-800 shadow-xl flex flex-col items-center justify-center border-4 border-slate-50 dark:border-slate-900">
                                <span className="text-xs font-bold text-slate-400 uppercase">Oct</span>
                                <span className="text-2xl font-black text-brand-primary">24</span>
                            </div>

                            <h2 className="text-2xl font-bold dark:text-white mb-1">Tokyo, Japan</h2>
                            <p className="text-sm text-slate-500 mb-6">5 Days • 4 Nights</p>

                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                <div>
                                    <p className="text-xs text-slate-400 font-medium">Total Budget</p>
                                    <p className="text-lg font-bold text-green-500">$2,450</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                    <DollarSign size={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Itinerary Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-1">
                        <button
                            onClick={() => setActiveTab('itinerary')}
                            className={clsx("pb-3 text-sm font-semibold transition-colors relative", activeTab === 'itinerary' ? "text-brand-primary" : "text-slate-500 hover:text-slate-700")}
                        >
                            Itinerary
                            {activeTab === 'itinerary' && <motion.div layoutId="line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('map')}
                            className={clsx("pb-3 text-sm font-semibold transition-colors relative", activeTab === 'map' ? "text-brand-primary" : "text-slate-500 hover:text-slate-700")}
                        >
                            Map View
                            {activeTab === 'map' && <motion.div layoutId="line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />}
                        </button>
                    </div>

                    <div className="space-y-8 pl-4">
                        {itinerary.map((day, idx) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={idx}
                                className="relative pl-8 border-l-2 border-slate-200 dark:border-slate-800"
                            >
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-primary border-4 border-white dark:border-slate-900" />

                                <h3 className="text-lg font-bold dark:text-white mb-4">{day.day} <span className="text-slate-400 font-normal text-sm ml-2">{day.title}</span></h3>

                                <div className="space-y-4">
                                    {day.events.map((event, eIdx) => (
                                        <div key={eIdx} className="glass dark:glass-dark p-4 rounded-xl flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-brand-secondary/50">
                                            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                                <event.icon size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold dark:text-slate-200">{event.title}</p>
                                                <p className="text-xs text-brand-primary font-medium flex items-center gap-1">
                                                    <Clock size={12} /> {event.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;



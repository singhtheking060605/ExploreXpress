import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, DollarSign, Clock, Plane, Smartphone, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import api from '../services/api';
import ItineraryView from './plan/components/ItineraryView';

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('itinerary');
    const [savedTrips, setSavedTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedTrips = async () => {
            try {
                const response = await api.get('/users/saved-trips');
                setSavedTrips(response.data);
                if (response.data.length > 0) {
                    setSelectedTrip(response.data[0]);
                }
            } catch (error) {
                console.error("Failed to fetch saved trips:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedTrips();
    }, []);

    // If a trip is selected, use its data for the itinerary view
    const itinerary = selectedTrip?.tripData?.itinerary || [];
    const destinations = selectedTrip?.tripData?.destinations ||
        (selectedTrip ? [{ city: selectedTrip.destination, duration: selectedTrip.duration }] : []);

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

                {/* Left Column: Saved Trips List & Input */}
                <div className="lg:col-span-1 space-y-8">

                    {/* Saved Trips List */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold dark:text-white flex items-center justify-between">
                            Your Saved Trips
                            <span className="text-xs bg-brand-primary/10 text-brand-primary px-2 py-1 rounded-full">{savedTrips.length}</span>
                        </h2>

                        {loading ? (
                            <div className="text-center py-8 text-slate-400">Loading trips...</div>
                        ) : savedTrips.length === 0 ? (
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 text-center border border-dashed border-slate-300 dark:border-slate-700">
                                <p className="text-slate-500 mb-4">No saved trips yet.</p>
                                <button onClick={() => navigate('/plan')} className="text-brand-primary font-bold text-sm hover:underline">Plan your first trip</button>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {savedTrips.map((trip) => (
                                    <div
                                        key={trip._id}
                                        onClick={() => setSelectedTrip(trip)}
                                        className={clsx(
                                            "group cursor-pointer rounded-2xl p-4 border transition-all duration-200 relative overflow-hidden",
                                            selectedTrip?._id === trip._id
                                                ? "bg-white dark:bg-slate-800 border-brand-primary shadow-md ring-1 ring-brand-primary"
                                                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-brand-primary/50"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-brand-primary transition-colors">
                                                {trip.tripData?.trip_name || trip.destination}
                                            </h3>
                                            <span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500">
                                                {trip.duration} Days
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <MapPin size={12} /> {trip.origin}
                                            </span>
                                            <span className="flex items-center gap-1 text-emerald-600 font-medium">
                                                <DollarSign size={12} /> {Number(trip.budget).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                        {selectedTrip?._id === trip._id && (
                                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-brand-primary" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Plan Input Card (Moved below list) */}
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
                </div>

                {/* Right Column: Itinerary Display */}
                <div className="lg:col-span-2 space-y-6">
                    {selectedTrip ? (
                        <>
                            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    {selectedTrip.tripData?.trip_name || `Trip to ${selectedTrip.destination}`}
                                </h2>
                                <p className="text-slate-500 mb-6 flex flex-wrap gap-4 text-sm">
                                    <span className="flex items-center gap-1"><MapPin size={14} /> {selectedTrip.destination}</span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full hidden md:block" />
                                    <span className="flex items-center gap-1"><Clock size={14} /> {selectedTrip.duration} Days</span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full hidden md:block" />
                                    <span className="flex items-center gap-1"><DollarSign size={14} /> ₹{Number(selectedTrip.budget).toLocaleString('en-IN')}</span>
                                </p>

                                <ItineraryView itinerary={itinerary} destinations={destinations} />
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                            <MapPin size={48} className="mb-4 opacity-20" />
                            <p className="text-lg font-medium">Select a trip to view details</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Dashboard;



import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DynamicCarousel from './explore/components/DynamicCarousel';
import ExploreCard from './explore/components/ExploreCard';
import TimelineModal from './explore/components/TimelineModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader, Filter, Zap } from 'lucide-react';

const Explore = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRegion, setSelectedRegion] = useState('India'); // 'India' or 'World'
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedTrip, setSelectedTrip] = useState(null);

    const categories = ['All', 'Mountains', 'Beach', 'Adventure', 'Spiritual', 'Culture'];

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const response = await api.get('/explore/trending');
                setDestinations(response.data);
            } catch (error) {
                console.error("Failed to fetch trending:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrending();
    }, []);

    const scrollToTrending = () => {
        const element = document.getElementById('trending-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Filtering Logic
    const filteredDestinations = destinations.filter(dest => {
        const matchRegion = dest.region === selectedRegion;
        const matchCategory = selectedCategory === 'All' || dest.category === selectedCategory;
        return matchRegion && matchCategory;
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4 sm:px-6 lg:px-8">

                {/* Hero Section */}
                <DynamicCarousel onExploreClick={scrollToTrending} />

                {/* Main Content Area */}
                <div id="trending-section" className="space-y-8">

                    {/* Controls: Tabs & Filters */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">

                        {/* Region Tabs */}
                        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
                            {['India', 'World'].map((region) => (
                                <button
                                    key={region}
                                    onClick={() => setSelectedRegion(region)}
                                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${selectedRegion === region
                                        ? 'bg-white dark:bg-slate-700 text-brand-primary shadow-sm'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                        }`}
                                >
                                    Trend in {region}
                                </button>
                            ))}
                        </div>

                        {/* Category Filters */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                            <Filter size={18} className="text-slate-400 shrink-0" />
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${selectedCategory === cat
                                        ? 'bg-brand-primary/10 border-brand-primary text-brand-primary'
                                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand-primary/50'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Grid */}
                    {loading ? (
                        <div className="flex justify-center py-32">
                            <Loader className="animate-spin text-brand-primary" size={48} />
                        </div>
                    ) : filteredDestinations.length > 0 ? (
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            <AnimatePresence>
                                {filteredDestinations.map((trip, idx) => (
                                    <motion.div
                                        key={trip._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                                        layout
                                    >
                                        <ExploreCard
                                            trip={trip}
                                            onOpenModal={setSelectedTrip}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700"
                        >
                            <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">No destinations found.</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                                We couldn't find any {selectedCategory} trips in {selectedRegion} right now.
                                Our AI is constantly scouting, check back soon!
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {selectedTrip && (
                <TimelineModal
                    trip={selectedTrip}
                    onClose={() => setSelectedTrip(null)}
                />
            )}
        </div>
    );
};

export default Explore;

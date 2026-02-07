import React, { useState } from 'react';
import { Cloud, ArrowRight, MapPin, Calendar } from 'lucide-react';
import DestinationDetails from './DestinationDetails';

const TrendingSection = ({ destinations }) => {
    const [activeTab, setActiveTab] = useState('India');
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedDestination, setSelectedDestination] = useState(null);

    const categories = ['All', 'Mountains', 'Beach', 'Adventure', 'Spiritual', 'Culture'];

    const filteredDestinations = destinations.filter(d => {
        const matchesRegion = (activeTab === 'India' && d.region === 'India') ||
            (activeTab === 'World' && d.region !== 'India');
        const matchesCategory = activeCategory === 'All' || d.category === activeCategory;
        return matchesRegion && matchesCategory;
    });

    return (
        <div>
            {/* Region Tabs */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex gap-6 border-b border-slate-200 dark:border-slate-800">
                    {['India', 'World'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 px-2 text-lg font-bold transition-all relative ${activeTab === tab
                                ? 'text-brand-primary'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                                }`}
                        >
                            Trending in {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-primary rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Category Filters */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${activeCategory === cat
                                ? 'bg-brand-primary text-white border-brand-primary'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-primary/50'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDestinations.length > 0 ? (
                    filteredDestinations.map((dest) => (
                        <div
                            key={dest._id || dest.destination}
                            onClick={() => setSelectedDestination(dest)}
                            className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group border border-slate-100 dark:border-slate-800"
                        >
                            {/* Image */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={dest.imageUrl}
                                    alt={dest.destination}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
                                    <Cloud size={14} className="text-brand-primary" />
                                    <span>{dest.weather?.temp || '25°C'}</span>
                                </div>
                                {dest.category && (
                                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
                                        {dest.category}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="w-full">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-brand-primary transition-colors">
                                                {dest.destination}
                                            </h3>
                                        </div>
                                        <p className="text-slate-500 text-sm flex items-center gap-1 mb-3">
                                            <MapPin size={14} /> {dest.region}
                                        </p>

                                        {/* Famous For */}
                                        {dest.famous_for && (
                                            <div className="mb-3 text-xs font-medium text-slate-500 dark:text-slate-400 italic">
                                                ✨ Known for: <span className="text-slate-700 dark:text-slate-300 not-italic">{dest.famous_for}</span>
                                            </div>
                                        )}

                                        {/* Trending Reason Chip */}
                                        {dest.trending_reason && (
                                            <div className="inline-block px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-wide rounded-md border border-red-100 dark:border-red-900/50 mb-4">
                                                🔥 {dest.trending_reason.length > 60 ? dest.trending_reason.substring(0, 60) + '...' : dest.trending_reason}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Teaser Event */}
                                {dest.events && dest.events.length > 0 && (
                                    <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Upcoming</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex flex-col items-center justify-center text-xs font-bold leading-none shrink-0">
                                                <span>{new Date(dest.events[0].date).getDate() || '12'}</span>
                                                <span className="text-[10px] opacity-80 uppercase">{new Date(dest.events[0].date).toLocaleString('default', { month: 'short' })}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{dest.events[0].name}</p>
                                                <p className="text-xs text-slate-500 truncate">{dest.events[0].type.type || dest.events[0].type}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4 flex items-center text-brand-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                    View Full Timeline <ArrowRight size={16} className="ml-2" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center text-slate-500">
                        <p className="text-lg">No destinations found for this category.</p>
                        <button onClick={() => setActiveCategory('All')} className="text-brand-primary font-bold mt-2 hover:underline">View All</button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedDestination && (
                <DestinationDetails
                    destination={selectedDestination}
                    onClose={() => setSelectedDestination(null)}
                />
            )}
        </div>
    );
};

export default TrendingSection;

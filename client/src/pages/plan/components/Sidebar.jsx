import React from 'react';
import { LayoutDashboard, Map, Calendar, Plane, Hotel, Info } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
        { id: 'itinerary', label: 'Itinerary', icon: <Calendar size={20} /> },
        { id: 'map', label: 'Map View', icon: <Map size={20} /> },
        { id: 'hotels', label: 'Hotels', icon: <Hotel size={20} /> },
        { id: 'travel', label: 'Travel', icon: <Plane size={20} /> },
    ];

    return (
        <div className="w-full lg:w-64 bg-white dark:bg-slate-800 lg:h-[calc(100vh-100px)] lg:sticky lg:top-24 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 flex flex-col gap-2 overflow-x-auto lg:overflow-visible">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-2 hidden lg:block">Trip Menu</h3>
            <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm
                            ${activeTab === tab.id
                                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-[1.02]'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
                            }
                        `}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                        {activeTab === tab.id && (
                            <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full hidden lg:block" />
                        )}
                    </button>
                ))}
            </div>

            <div className="mt-auto hidden lg:block p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <p className="text-xs text-slate-500 text-center">
                    Planning for <br />
                    <span className="font-bold text-slate-800 dark:text-slate-200">Paris, France</span>
                </p>
            </div>
        </div>
    );
};

export default Sidebar;

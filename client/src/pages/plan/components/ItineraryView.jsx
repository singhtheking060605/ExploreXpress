import React from 'react';
import { Clock } from 'lucide-react';

const ItineraryView = ({ itinerary, destinations }) => {
    // Helper to filter out placeholder strings
    const firstValidImage = (url, fallback) => {
        if (!url || url === 'LEAVE_EMPTY' || url.includes('LEAVE_EMPTY')) return fallback;
        return url;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {itinerary.map((dayPlan, dayIndex) => (
                <div key={dayIndex} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Day {dayPlan.day}: {dayPlan.theme}</h4>
                        <span className="text-xs font-mono bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500">
                            {dayPlan.activities?.length || 0} Stops
                        </span>
                    </div>
                    <div className="p-0">
                        {dayPlan.activities?.map((activity, actIndex) => (
                            <div key={actIndex} className="p-6 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Image */}
                                    <div className="w-full md:w-32 h-32 rounded-xl bg-slate-200 overflow-hidden shadow-sm flex-shrink-0">
                                        <img
                                            src={firstValidImage(activity.image_url, `https://source.unsplash.com/200x200/?${activity.activity},${destinations[0]?.city || 'travel'}`)}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            alt={activity.activity}
                                            onError={(e) => e.target.src = `https://source.unsplash.com/200x200/?travel`}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h5 className="font-bold text-slate-800 dark:text-white text-lg">{activity.activity}</h5>
                                            <span className="flex items-center gap-1 text-xs font-medium bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">
                                                <Clock size={12} /> {activity.time}
                                            </span>
                                        </div>

                                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                                            {activity.description}
                                        </p>

                                        {/* Details Badges */}
                                        {activity.details && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {activity.details.famous_for && (
                                                    <span className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded border border-purple-100 dark:border-purple-800/30">
                                                        ✨ {activity.details.famous_for}
                                                    </span>
                                                )}
                                                {activity.details.best_time_to_visit && (
                                                    <span className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-2 py-1 rounded border border-amber-100 dark:border-amber-800/30">
                                                        ☀️ Best: {activity.details.best_time_to_visit}
                                                    </span>
                                                )}
                                                {activity.details.opening_hours && (
                                                    <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded border border-blue-100 dark:border-blue-800/30">
                                                        🕒 {activity.details.opening_hours}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        <div className="mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                            <div className="font-bold">₹</div> Est. Cost: {activity.cost_estimate}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ItineraryView;

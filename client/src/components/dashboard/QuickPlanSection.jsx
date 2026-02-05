import React from 'react';
import { MapPin, Calendar, ArrowRight, Plane } from 'lucide-react';

const QuickPlanSection = () => {
    return (
        <section className="h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-brand-primary rounded-full" />
                    Make My Trip
                </h2>
            </div>
            <div className="glass dark:glass-dark p-8 rounded-3xl relative overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 flex flex-col justify-center h-full">
                    <h3 className="text-2xl font-bold dark:text-white mb-2">Where to next?</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">Let AI craft your perfect itinerary in seconds.</p>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">From</label>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={20} />
                                <input
                                    type="text"
                                    defaultValue="New Delhi, India"
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl py-4 pl-12 pr-4 font-medium dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary/50 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">To</label>
                            <div className="relative group">
                                <Plane className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-secondary group-focus-within:text-brand-secondary transition-colors" size={20} />
                                <input
                                    type="text"
                                    defaultValue="Tokyo, Japan"
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl py-4 pl-12 pr-4 font-medium dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-secondary/50 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input type="date" className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl py-4 pl-12 pr-4 font-medium dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary/50 outline-none" />
                        </div>
                        <button className="px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-brand-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
                            Plan it <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default QuickPlanSection;

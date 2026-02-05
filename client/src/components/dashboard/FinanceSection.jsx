import React from 'react';
import { Wallet, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FinanceSection = () => {
    return (
        <section className="h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-brand-primary rounded-full" />
                    Splitwise
                </h2>
                <Link to="/expenses" className="text-sm font-medium text-brand-primary hover:text-brand-accent transition-colors flex items-center gap-1">
                    View All <ArrowRight size={16} />
                </Link>
            </div>
            <div className="glass dark:glass-dark p-6 rounded-3xl border border-slate-100 dark:border-slate-800 h-full flex flex-col justify-between">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Trip Budget</p>
                        <h4 className="text-2xl font-black dark:text-white">$2,450</h4>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-xs font-bold text-brand-primary">S</div>
                            <span className="font-medium dark:text-slate-200">Sarah</span>
                        </div>
                        <span className="text-red-500 font-bold text-sm">owes you $45</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center text-xs font-bold text-brand-accent">M</div>
                            <span className="font-medium dark:text-slate-200">Mike</span>
                        </div>
                        <span className="text-green-500 font-bold text-sm">you owe $120</span>
                    </div>
                </div>

                <Link to="/expenses" className="mt-6 w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Settle Up
                </Link>
            </div>
        </section>
    );
};

export default FinanceSection;

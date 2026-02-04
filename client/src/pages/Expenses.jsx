import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Receipt, TrendingUp, Users } from 'lucide-react';
import clsx from 'clsx';

const Expenses = () => {
    const transactions = [
        { id: 1, user: "Aryan", action: "paid for", item: "Sushi Dinner", amount: "¥12,000", date: "2 mins ago" },
        { id: 2, user: "Sarah", action: "paid for", item: "Taxi to Shinjuku", amount: "¥3,500", date: "1 hour ago" },
        { id: 3, user: "Mike", action: "paid for", item: "Museum Tickets", amount: "¥4,000", date: "Yesterday" },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 relative min-h-[80vh]">

            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-brand-secondary/10 rounded-xl text-brand-secondary">
                        <Receipt size={28} />
                    </div>
                    Shared Expenses
                </h1>
                <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Settle Up</button>
                    <button className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-medium hover:bg-brand-primary/90 transition-colors">+ Add Expense</button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">

                {/* Left: Overview & Chart */}
                <div className="space-y-6">
                    <div className="glass dark:glass-dark p-6 rounded-2xl">
                        <h3 className="text-lg font-bold dark:text-white mb-6">Who Owes Who</h3>

                        {/* Simple Chart Visualization */}
                        <div className="flex items-center justify-center p-8">
                            <div className="relative w-48 h-48 rounded-full border-8 border-slate-100 dark:border-slate-800 flex items-center justify-center">
                                <div className="absolute inset-0 border-8 border-brand-primary rounded-full border-t-transparent border-l-transparent rotate-45" />
                                <div className="text-center">
                                    <p className="text-xs text-slate-500">Total Spent</p>
                                    <p className="text-2xl font-bold dark:text-white">¥19.5k</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mt-6">
                            {[
                                { name: "Aryan", owes: false, amount: "¥2,000", color: "text-green-500" },
                                { name: "Sarah", owes: true, amount: "¥1,500", color: "text-red-500" },
                                { name: "Mike", owes: true, amount: "¥500", color: "text-red-500" },
                            ].map((person, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-xs font-bold text-brand-primary">
                                            {person.name[0]}
                                        </div>
                                        <span className="font-medium dark:text-slate-200">{person.name}</span>
                                    </div>
                                    <span className={clsx("font-bold", person.color)}>
                                        {person.owes ? `owes ${person.amount}` : `gets ${person.amount}`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Recent Activity */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wilder px-2">Recent Activity</h3>
                    {transactions.map((tx, idx) => (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={tx.id}
                            className="glass dark:glass-dark p-4 rounded-xl flex items-center gap-4 group hover:bg-white dark:hover:bg-slate-800 transition-colors"
                        >
                            <div className="p-3 bg-brand-accent/10 text-brand-accent rounded-full">
                                <Users size={18} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm dark:text-slate-200">
                                    <span className="font-bold">{tx.user}</span> {tx.action} <span className="font-bold">{tx.item}</span>
                                </p>
                                <p className="text-xs text-slate-400">{tx.date}</p>
                            </div>
                            <p className="font-bold dark:text-white">{tx.amount}</p>
                        </motion.div>
                    ))}
                </div>

            </div>

            {/* Floating Voice Button */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative w-16 h-16 rounded-full bg-gradient-to-r from-brand-secondary to-brand-accent shadow-xl shadow-brand-secondary/40 flex items-center justify-center text-white"
                >
                    <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-brand-secondary rounded-full -z-10"
                    />
                    <Mic size={28} />
                </motion.button>
                <p className="text-center mt-3 text-sm font-medium text-slate-500 bg-white/80 dark:bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                    "Add expense: Lunch 500 yen"
                </p>
            </div>

        </div>
    );
};

export default Expenses;

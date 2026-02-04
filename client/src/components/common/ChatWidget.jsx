import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-96 h-[500px] glass dark:glass-dark rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/20 dark:border-slate-700 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl"
                    >
                        {/* Chat Header */}
                        <div className="p-4 bg-brand-primary/10 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white">
                                <Sparkles size={16} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm dark:text-white">Travel Assistant</h3>
                                <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
                                </p>
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center">
                                    <Sparkles size={14} className="text-brand-primary" />
                                </div>
                                <div className="p-3 rounded-2xl rounded-tl-none bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300">
                                    Hello Aryan! How can I help you plan your Tokyo trip today?
                                </div>
                            </div>

                            <div className="flex gap-3 flex-row-reverse">
                                <div className="p-3 rounded-2xl rounded-tr-none bg-brand-primary text-sm text-white shadow-lg shadow-brand-primary/20">
                                    Can you find a cheaper hotel near Shinjuku?
                                </div>
                            </div>
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Ask anything..."
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-full py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none dark:text-white"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors">
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={clsx(
                    "w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-colors",
                    isOpen ? "bg-slate-800 text-white dark:bg-white dark:text-slate-900" : "bg-gradient-to-r from-brand-primary to-brand-secondary text-white"
                )}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>

        </div>
    );
};

export default ChatWidget;

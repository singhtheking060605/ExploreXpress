import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Sparkles } from 'lucide-react';

const CAROUSEL_THEMES = [
    {
        id: 'seasonal',
        title: "Winter Wonderlands ❄️",
        subtitle: "Experience the magic of snow-covered peaks and cozy chalets.",
        theme: "from-blue-600 to-indigo-800",
        image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=1000&auto=format&fit=crop",
        tag: "Seasonal Special"
    },
    {
        id: 'trending',
        title: "Trending Now 🔥",
        subtitle: "The most sought-after destinations by travelers this week.",
        theme: "from-orange-500 to-red-600",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop",
        tag: "Hot Right Now"
    },
    {
        id: 'hidden',
        title: "Hidden Gems 💎",
        subtitle: "Undiscovered paradises waiting for your footprints.",
        theme: "from-emerald-500 to-teal-700",
        image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1000&auto=format&fit=crop",
        tag: "Editor's Pick"
    }
];

import axios from 'axios';

const DynamicCarousel = ({ onExploreClick }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [carouselItems, setCarouselItems] = useState(CAROUSEL_THEMES);

    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/events/holidays');
                const holidays = response.data;

                if (holidays && holidays.length > 0) {
                    // Find the immediately next holiday
                    const nextHoliday = holidays[0];
                    const holidayDate = new Date(nextHoliday.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

                    const holidaySlide = {
                        id: 'holiday-api',
                        title: `${nextHoliday.name} 🎉`,
                        subtitle: `Upcoming Holiday on ${holidayDate}. Perfect time for a quick getaway!`,
                        theme: "from-pink-500 to-rose-600",
                        image: "https://images.unsplash.com/photo-1514222709107-a180c68d72b4?q=80&w=1000&auto=format&fit=crop", // Festive image
                        tag: "Upcoming Holiday"
                    };

                    // Add to carousel (second position)
                    setCarouselItems(prev => {
                        const newItems = [...prev];
                        newItems.splice(1, 0, holidaySlide);
                        return newItems;
                    });
                }
            } catch (err) {
                console.error("Failed to fetch holidays for carousel:", err);
            }
        };

        fetchHolidays();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [carouselItems]);

    const config = carouselItems[currentIndex];

    return (
        <div className="relative h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl mb-12 group">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={config ? config.id : 'loading'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    <img
                        src={config ? config.image : CAROUSEL_THEMES[0].image}
                        alt={config ? config.title : ''}
                        className="w-full h-full object-cover transition-transform duration-[10s] ease-linear scale-100 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r ${config ? config.theme : 'from-gray-800 to-black'} opacity-70 mix-blend-multiply`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-3xl text-white z-10">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={config ? config.id : 'loading-text'}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold mb-4 uppercase tracking-wider shadow-lg">
                            <Sparkles size={14} className="text-yellow-300" />
                            <span>{config ? config.tag : 'Loading...'}</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight tracking-tight drop-shadow-xl">{config ? config.title : 'Loading...'}</h2>
                        <p className="text-xl text-slate-100 mb-8 font-medium max-w-xl leading-relaxed drop-shadow-md">{config ? config.subtitle : ''}</p>

                        <button
                            onClick={onExploreClick}
                            className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-100 hover:scale-105 transition-all flex items-center gap-3 shadow-xl active:scale-95"
                        >
                            Start Exploring <ArrowRight size={20} />
                        </button>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Progress Dots */}
            <div className="absolute bottom-8 right-8 flex gap-3 z-20">
                {carouselItems.map((theme, idx) => (
                    <button
                        key={theme.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default DynamicCarousel;

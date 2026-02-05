import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TOP_DESTINATIONS = [
    { id: 1, name: "Kyoto, Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop", rating: 4.8, type: "World" },
    { id: 2, name: "Jaipur, India", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1000&auto=format&fit=crop", rating: 4.6, type: "India" },
    { id: 3, name: "Santorini, Greece", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1000&auto=format&fit=crop", rating: 4.9, type: "World" },
    { id: 4, name: "Kerala, India", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop", rating: 4.7, type: "India" },
    { id: 5, name: "Paris, France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop", rating: 4.7, type: "World" },
    { id: 6, name: "Goa, India", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop", rating: 4.5, type: "India" },
];

const SectionHeader = ({ title, linkText, linkTo }) => (
    <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
            <span className="w-1.5 h-6 bg-brand-primary rounded-full" />
            {title}
        </h2>
        {linkText && (
            <Link to={linkTo} className="text-sm font-medium text-brand-primary hover:text-brand-accent transition-colors flex items-center gap-1">
                {linkText} <ArrowRight size={16} />
            </Link>
        )}
    </div>
);

const DestinationCard = ({ dest }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="min-w-[200px] w-[200px] h-[280px] rounded-2xl overflow-hidden relative group cursor-pointer shadow-md"
    >
        <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
        <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-white text-xs font-bold">
            <Star size={12} className="fill-yellow-400 text-yellow-400" /> {dest.rating}
        </div>
        <div className="absolute bottom-4 left-4 text-white">
            <p className="text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">{dest.type}</p>
            <h3 className="font-bold text-lg leading-tight">{dest.name}</h3>
        </div>
    </motion.div>
);

const ExploreSection = () => {
    return (
        <section>
            <SectionHeader title="Explore the World" />
            <div className="relative">
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    <div className="shrink-0 w-2" />
                    {TOP_DESTINATIONS.map((dest) => (
                        <DestinationCard key={dest.id} dest={dest} />
                    ))}
                    <div className="shrink-0 w-8" />
                </div>
            </div>
        </section>
    );
};

export default ExploreSection;

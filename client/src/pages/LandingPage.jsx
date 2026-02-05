import React, { useState, useEffect, useContext } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, Globe, ShieldCheck, Zap, Moon, Sun, Menu, X,
    MapPin, Calendar, CreditCard, Star, Instagram, Twitter, Linkedin, Facebook
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import newYorkImg from '../assets/newyork.jpg';
import dubaiImg from '../assets/dubai.jpg';

// --- Assets / Data ---
const DESTINATIONS = [
    { name: "Santorini", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1000&auto=format&fit=crop" },
    { name: "Kyoto", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop" },
    { name: "Paris", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop" },
    { name: "Bali", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop" },
    { name: "New York", img: newYorkImg },
    { name: "Dubai", img: dubaiImg },
];

const FEATURES = [
    { icon: Globe, title: "Global Intelligence", desc: "Real-time insights for 500+ destinations worldwide." },
    { icon: Zap, title: "Instant Itineraries", desc: "AI-generated plans tailored to your unique travel style." },
    { icon: CreditCard, title: "Smart Budgeting", desc: " effortless expense tracking and Splitwise integration." },
    { icon: ShieldCheck, title: "Secure & Reliable", desc: "Your data and bookings are always protected." }
];

// --- Components ---

const Marquee = () => {
    return (
        <div className="relative flex overflow-hidden py-10 bg-slate-50 dark:bg-slate-900/50">
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-50 dark:from-brand-dark to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-50 dark:from-brand-dark to-transparent z-10" />

            <motion.div
                className="flex gap-8 px-4"
                animate={{ x: "-50%" }}
                transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
            >
                {[...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS].map((dest, i) => (
                    <div key={i} className="relative w-64 h-80 rounded-2xl overflow-hidden shrink-0 group cursor-pointer">
                        <img src={dest.img} alt={dest.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                            <h3 className="text-white text-xl font-bold">{dest.name}</h3>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.6 }}
        className="p-8 rounded-3xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:shadow-xl dark:hover:shadow-brand-primary/10 transition-all duration-300 group"
    >
        <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 dark:bg-brand-primary/20 flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition-transform">
            <Icon size={28} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand-primary transition-colors">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
    </motion.div>
);

const UserReviews = () => {
    const reviews = [
        {
            name: "Sarah Jenkins",
            role: "Solo Traveler",
            img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
            text: "ExploreXpress changed the way I travel. The AI itinerary was spot on!",
            location: "Bali, Indonesia"
        },
        {
            name: "Michael Chen",
            role: "Digital Nomad",
            img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
            text: "The budgeting tool is a lifesaver. Finally, I can track my expenses without a headache.",
            location: "Kyoto, Japan"
        },
        {
            name: "Emily & James",
            role: "Couple",
            img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
            text: "We planned our honeymoon in minutes. Highly recommended for stress-free planning.",
            location: "Santorini, Greece"
        },
        {
            name: "David Smith",
            role: "Adventure Seeker",
            img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
            text: "Found hidden gems I would have never looked for. The local insights are amazing.",
            location: "Patagonia, Chile"
        }
    ];

    return (
        <section className="py-16 px-6 bg-slate-50 dark:bg-brand-dark relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl opacity-30 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-accent/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Loved by Travelers Worldwide
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        See what our community has to say about their journeys.
                    </p>
                </div>

                <div className="relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-50 dark:from-brand-dark to-transparent z-10" />
                    <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-50 dark:from-brand-dark to-transparent z-10" />

                    <motion.div
                        className="flex gap-6"
                        animate={{ x: "-50%" }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
                    >
                        {[...reviews, ...reviews, ...reviews].map((review, i) => (
                            <div
                                key={i}
                                className="w-80 shrink-0 bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-primary/20" />
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{review.name}</h4>
                                        <span className="text-xs text-brand-primary font-medium">{review.role}</span>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-3">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} size={14} className="fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm italic mb-4">"{review.text}"</p>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-500">
                                    <MapPin size={12} />
                                    {review.location}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
const Footer = () => (
    <footer className="bg-slate-900 text-slate-300 py-16 px-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 relative z-10">
            <div className="col-span-1 md:col-span-1">
                <div className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-6">
                    ExploreXpress
                </div>
                <p className="mb-6 text-slate-400">
                    Crafting unforgettable journeys with the power of Artificial Intelligence.
                </p>
                <div className="flex gap-4">
                    {[Instagram, Twitter, Linkedin, Facebook].map((Icon, i) => (
                        <a key={i} href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-white transition-colors">
                            <Icon size={18} />
                        </a>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-white font-bold mb-6">Product</h4>
                <ul className="space-y-4">
                    <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                </ul>
            </div>

            <div>
                <h4 className="text-white font-bold mb-6">Company</h4>
                <ul className="space-y-4">
                    <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
            </div>

            <div>
                <h4 className="text-white font-bold mb-6">Stay Updated</h4>
                <div className="flex gap-2">
                    <input type="email" placeholder="Enter your email" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-primary/50" />
                    <button className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors">
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>© 2026 ExploreXpress Inc. All rights reserved.</p>
            <div className="flex gap-8">
                <a href="#" className="hover:text-white">Privacy Policy</a>
                <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
        </div>
    </footer>
);

// --- Main Page ---

const LandingPage = () => {
    const navigate = useNavigate();
    const { user, login, signup, googleLoginHandler } = useContext(AuthContext);
    const { scrollY } = useScroll();
    const headersOpacity = useTransform(scrollY, [0, 100], [0, 1]);
    const headersY = useTransform(scrollY, [0, 100], [-20, 0]);

    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [authMode, setAuthMode] = useState('login');

    // Auth Form State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (document.documentElement.classList.contains('dark')) setIsDarkMode(true);
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    const handleStartPlanning = () => {
        if (user) {
            navigate('/dashboard');
        } else {
            setAuthMode('login');
            setShowLogin(true);
        }
    };

    const handleAuthSubmit = async () => {
        setError("");
        let result;
        if (authMode === 'login') {
            result = await login(email, password);
        } else {
            result = await signup(name, email, password);
        }

        if (result.success) {
            setShowLogin(false);
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-brand-dark transition-colors duration-300 font-sans selection:bg-brand-primary/30">

            {/* Navbar */}
            <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl border-b border-white/10 bg-white/70 dark:bg-slate-900/70">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="text-2xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent cursor-pointer" onClick={() => navigate('/')}>
                        ExploreXpress
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        {['Features', 'Destinations', 'Pricing'].map(link => (
                            <a key={link} href="#" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-primary transition-colors">{link}</a>
                        ))}
                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600 dark:text-slate-400" />}
                        </button>
                        {user ? (
                            <button onClick={() => navigate('/dashboard')} className="px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                Dashboard
                            </button>
                        ) : (
                            <div className="flex gap-4">
                                <button onClick={() => { setAuthMode('login'); setShowLogin(true); }} className="text-slate-900 dark:text-white font-bold hover:text-brand-primary transition-colors">Log In</button>
                                <button onClick={() => { setAuthMode('signup'); setShowLogin(true); }} className="px-6 py-2.5 rounded-full bg-brand-primary text-white font-bold hover:shadow-lg hover:bg-brand-primary/90 transition-all">Sign Up</button>
                            </div>
                        )}
                    </div>
                    {/* Mobile Toggle */}
                    <div className="md:hidden flex gap-4">
                        <button onClick={toggleTheme}><Sun size={20} /></button>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X /> : <Menu />}</button>
                    </div>
                </div>
            </nav>
            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden fixed top-20 inset-x-0 bg-white dark:bg-slate-900 border-b border-white/10 z-40 overflow-hidden"
                    >
                        <div className="p-6 flex flex-col gap-4">
                            {user ? (
                                <button onClick={() => navigate('/dashboard')} className="w-full py-3 bg-brand-primary text-white rounded-xl font-bold">Dashboard</button>
                            ) : (
                                <>
                                    <button onClick={() => { setAuthMode('login'); setShowLogin(true); setIsMenuOpen(false); }} className="w-full py-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold">Log In</button>
                                    <button onClick={() => { setAuthMode('signup'); setShowLogin(true); setIsMenuOpen(false); }} className="w-full py-3 bg-brand-primary text-white rounded-xl font-bold">Sign Up</button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
                {/* Aurora Background */}
                <div className="absolute inset-0 bg-brand-dark overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-primary/40 via-brand-dark to-brand-dark animate-slow-spin opacity-80 blur-3xl" />
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-accent/30 rounded-full blur-[120px] mix-blend-screen animate-float" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-secondary/30 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow" />
                </div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 text-brand-primary text-sm font-bold mb-8 backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
                            </span>
                            AI-Powered Travel Agent 2.0
                        </div>

                        <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.1]">
                            Dream it. <br />
                            <span className="bg-gradient-to-r from-brand-primary via-purple-500 to-brand-accent bg-clip-text text-transparent">
                                Plan it. Live it.
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                            Experience the "Sober & Dreaming" way to travel. Orchestrate your perfect journey with intelligent automation, seamless budgeting, and curated global insights.
                        </p>

                        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleStartPlanning}
                                className="px-8 py-4 rounded-full bg-white dark:bg-white text-slate-900 font-bold text-lg shadow-2xl shadow-brand-primary/20 flex items-center gap-2 group"
                            >
                                Start Your Journey
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                            {/* <button className="px-8 py-4 rounded-full border border-slate-300 dark:border-white/20 text-slate-600 dark:text-white font-medium hover:bg-slate-50 dark:hover:bg-white/10 transition-colors">
                                Watch Demo
                            </button> */}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Carousel / Marquee Section */}
            <section className="py-0 relative z-10 -mt-20 md:-mt-32 mb-20">
                <Marquee />
            </section>

            {/* User Reviews Section */}
            <UserReviews />

            {/* Middle Section: Features */}
            <section className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                            Everything needed to <br className="hidden md:block" /> go from <span className="text-brand-primary">Idea</span> to <span className="text-brand-accent">Itinerary</span>
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Stop wrestling with spreadsheets. Let our AI handle the logistics so you can focus on the memories.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURES.map((feat, i) => (
                            <FeatureCard key={i} {...feat} delay={i * 0.1} />
                        ))}
                    </div>
                </div>
            </section>



            {/* Footer */}
            <Footer />

            {/* Auth Modal Overlay */}
            <AnimatePresence>
                {showLogin && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden border border-white/10"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary to-brand-accent" />

                            <button
                                onClick={() => setShowLogin(false)}
                                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="text-center mb-8 mt-2">
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                    {authMode === 'login' ? 'Welcome Back' : 'Join the Adventure'}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">
                                    {authMode === 'login' ? 'Sign in to access your trip plans' : 'Create an account to start planning'}
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center border border-red-100 dark:border-red-900/50">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                {authMode === 'signup' && (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none dark:text-white transition-all"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none dark:text-white transition-all"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none dark:text-white transition-all"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                    />
                                </div>

                                <button onClick={handleAuthSubmit} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-accent text-white font-bold hover:shadow-lg hover:opacity-90 transition-all transform active:scale-95">
                                    {authMode === 'login' ? 'Sign In' : 'Create Account'}
                                </button>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700"></div></div>
                                    <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="px-3 bg-white dark:bg-slate-900 text-slate-400">Or continue with</span></div>
                                </div>

                                <div className="flex justify-center">
                                    <GoogleLogin
                                        onSuccess={async (credentialResponse) => {
                                            const result = await googleLoginHandler(credentialResponse);
                                            if (result.success) {
                                                setShowLogin(false);
                                                navigate("/dashboard");
                                            } else {
                                                setError(result.message);
                                            }
                                        }}
                                        onError={() => setError("Google Login Failed")}
                                        useOneTap
                                        shape="pill"
                                        theme={isDarkMode ? "filled_black" : "outline"}
                                        width="100%"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 text-center text-sm text-slate-500">
                                {authMode === 'login' ? (
                                    <>Don't have an account? <button onClick={() => { setAuthMode('signup'); setError(""); }} className="text-brand-primary font-bold hover:underline">Sign up</button></>
                                ) : (
                                    <>Already have an account? <button onClick={() => { setAuthMode('login'); setError(""); }} className="text-brand-primary font-bold hover:underline">Log in</button></>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LandingPage;

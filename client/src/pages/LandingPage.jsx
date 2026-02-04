import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, ShieldCheck, Zap, Moon, Sun, Menu, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user, login, signup, googleLoginHandler } = useContext(AuthContext);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");


    useEffect(() => {
        // Check system preference or localStorage
        if (document.documentElement.classList.contains('dark')) {
            setIsDarkMode(true);
        }
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
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50 dark:bg-brand-dark transition-colors duration-300">

            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-brand-primary/20 rounded-full blur-[100px] -z-10 animate-float" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-accent/20 rounded-full blur-[100px] -z-10" />

            {/* Navigation Bar */}
            <nav className="flex items-center justify-between px-6 py-4 backdrop-blur-md bg-white/50 dark:bg-slate-900/50 border-b border-white/20 dark:border-white/5 z-50 sticky top-0">
                <div className="text-2xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent cursor-pointer" onClick={() => navigate('/')}>
                    TravelExpress
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                    >
                        {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
                    </button>
                    <div className="h-6 w-px bg-slate-300 dark:bg-slate-700" />
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-slate-600 dark:text-slate-300 font-medium">Hi, {user.username}</span>
                            <button onClick={() => navigate('/dashboard')} className="px-5 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition-opacity">
                                Dashboard
                            </button>
                        </div>
                    ) : (
                        <>
                            <button onClick={() => { setAuthMode('login'); setShowLogin(true); setError(""); }} className="text-slate-600 dark:text-slate-300 font-medium hover:text-brand-primary transition-colors">
                                Log In
                            </button>
                            <button onClick={() => { setAuthMode('signup'); setShowLogin(true); setError(""); }} className="px-5 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition-opacity">
                                Sign Up
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                    >
                        {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
                    </button>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 dark:text-slate-300">
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-4 z-40 shadow-xl"
                >
                    {user ? (
                        <button onClick={() => navigate('/dashboard')} className="w-full py-3 rounded-xl bg-brand-primary text-white font-bold">
                            Dashboard
                        </button>
                    ) : (
                        <>
                            <button onClick={() => { setAuthMode('login'); setShowLogin(true); setError(""); }} className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white font-medium">
                                Log In
                            </button>
                            <button onClick={() => { setAuthMode('signup'); setShowLogin(true); setError(""); }} className="w-full py-3 rounded-xl bg-brand-primary text-white font-bold">
                                Sign Up
                            </button>
                        </>
                    )}
                </motion.div>
            )}

            <div className="flex-1 flex flex-col justify-center">
                {/* Main Hero Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-4xl mx-auto px-6 py-12"
                >
                    <div className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-semibold mb-6 border border-brand-primary/20">
                        🚀 The Future of Travel Planning
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">
                        Orchestrate Your <br />
                        <span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent">
                            Perfect Journey
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        TravelExpress is your AI-powered companion. From smart itinerary generation to seamless expense tracking, we handle the chaos so you can enjoy the adventure.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleStartPlanning}
                            className="px-8 py-4 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent text-white font-bold shadow-lg shadow-brand-primary/30 flex items-center gap-2 text-lg"
                        >
                            Start Planning <ArrowRight size={20} />
                        </motion.button>

                        <button className="px-8 py-4 rounded-full glass text-slate-700 dark:text-white font-medium hover:bg-white/40 dark:hover:bg-white/10 transition-colors">
                            Learn More
                        </button>
                    </div>
                </motion.div>

                {/* Feature Grids */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="grid md:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto mt-16"
                >
                    {[
                        { icon: Globe, title: "Global Intelligence", desc: "Real-time insights for destinations worldwide." },
                        { icon: Zap, title: "Instant Itineraries", desc: "AI-generated plans tailored to your style in seconds." },
                        { icon: ShieldCheck, title: "Secure & Reliable", desc: "Your data and bookings are always protected." }
                    ].map((feature, idx) => (
                        <div key={idx} className="glass dark:glass-dark p-8 rounded-2xl border-t border-white/50 dark:border-white/10 card-hover">
                            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-4">
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold dark:text-white mb-2">{feature.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
            {/* Login/Signup Modal Overlay (Mock) */}
            {showLogin && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-md w-full relative"
                    >
                        <button
                            onClick={() => setShowLogin(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
                            {authMode === 'login' ? 'Welcome Back' : 'Create an Account'}
                        </h2>

                        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

                        <div className="space-y-4">
                            {authMode === 'signup' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary outline-none dark:text-white transition-all"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary outline-none dark:text-white transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary outline-none dark:text-white transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button onClick={handleAuthSubmit} className="w-full py-3 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/30">
                                {authMode === 'login' ? 'Log In' : 'Sign Up'}
                            </button>

                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700"></div></div>
                                <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-slate-900 text-slate-500">Or continue with</span></div>
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
                                    onError={() => {
                                        setError("Google Login Failed");
                                    }}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default LandingPage;

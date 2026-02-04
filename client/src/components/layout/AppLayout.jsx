import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import {
    Home,
    Map,
    Wallet,
    Building2,
    Settings,
    Search,
    Menu,
    X,
    Moon,
    Sun,
    LogOut,
    User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const SidebarItem = ({ icon: Icon, label, path, isOpen, isActive }) => {
    return (
        <Link
            to={path}
            className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                isActive
                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-primary dark:hover:text-brand-primary"
            )}
        >
            <Icon size={20} className={clsx(!isOpen && "mx-auto")} />
            {isOpen && (
                <span className="font-medium whitespace-nowrap">{label}</span>
            )}
            {!isOpen && isActive && (
                <div className="absolute inset-0 bg-brand-primary/20" />
            )}
        </Link>
    );
};

const AppLayout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isDarkMode, setDarkMode] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const toggleTheme = () => {
        setDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    const navItems = [
        { icon: Home, label: 'Dashboard', path: '/' },
        { icon: Map, label: 'My Trips', path: '/trips' },
        { icon: Wallet, label: 'Splitwise', path: '/expenses' },
        { icon: Building2, label: 'Hotel Portal', path: '/hotels' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-brand-dark overflow-hidden font-sans transition-colors duration-300">

            {/* Sidebar - Desktop */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 260 : 80 }}
                className="hidden md:flex flex-col h-full border-r border-slate-200 dark:border-slate-800 z-20 relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl"
            >
                <div className="p-6 flex items-center justify-between">
                    {isSidebarOpen ? (
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-2xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent"
                        >
                            TravelExpress
                        </motion.h1>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent mx-auto" />
                    )}
                    <button onClick={toggleSidebar} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
                        {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>

                <nav className="flex-1 px-3 space-y-2 mt-4">
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            {...item}
                            isOpen={isSidebarOpen}
                            isActive={location.pathname === item.path}
                        />
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <div className={clsx("flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50", !isSidebarOpen && "justify-center")}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-secondary to-brand-primary flex items-center justify-center text-white font-bold text-sm">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        {isSidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate dark:text-slate-200">{user?.name || 'User'}</p>
                                <p className="text-xs text-slate-500 truncate">{user?.email || 'Traveler'}</p>
                            </div>
                        )}
                        <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors" title="Logout">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Top Header */}
                <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10 transition-colors duration-300">
                    <div className="flex items-center gap-4 w-1/3">
                        <div className="md:hidden">
                            <button onClick={toggleSidebar}><Menu size={24} className="text-slate-600 dark:text-slate-300" /></button>
                        </div>
                        <div className="relative w-full max-w-sm hidden md:block group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search destinations, hotels..."
                                className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-brand-primary/50 text-sm transition-all dark:text-slate-200"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                            title="Toggle Theme"
                        >
                            {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-black/20 p-6 scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AppLayout;

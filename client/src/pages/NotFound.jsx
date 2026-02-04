import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-9xl font-black text-slate-200 dark:text-slate-800">404</h1>
            <h2 className="text-2xl font-bold dark:text-white mt-4">Page Not Found</h2>
            <p className="text-slate-500 mb-8">The destination you are looking for doesn't exist.</p>
            <Link to="/" className="px-6 py-3 bg-brand-primary text-white rounded-xl font-medium hover:bg-brand-primary/90 transition-colors">
                Go Home
            </Link>
        </div>
    );
};

export default NotFound;

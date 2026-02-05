import React from 'react';
import { Building2 } from 'lucide-react';

const HotelPortal = () => {
    return (
        <div className="flex flex-col items-center justify-center p-20 text-center">
            <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-6">
                <Building2 size={48} />
            </div>
            <h1 className="text-3xl font-bold dark:text-white mb-2">Hotel Portal</h1>
            <p className="text-slate-500 dark:text-slate-400">Search and book hotels for your trips. Coming soon!</p>
        </div>
    );
};

export default HotelPortal;

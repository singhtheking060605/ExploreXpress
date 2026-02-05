import React from 'react';
import MyTripsSection from '../components/dashboard/MyTripsSection';

const Dashboard = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold dark:text-white">My Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your planned, upcoming, and completed trips.</p>
            </div>
            <MyTripsSection />
        </div>
    );
};

export default Dashboard;

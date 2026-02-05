import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <SettingsIcon size={24} className="text-slate-600 dark:text-slate-300" />
                </div>
                <h1 className="text-2xl font-bold dark:text-white">Settings</h1>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                <div className="p-6">
                    <h3 className="font-bold dark:text-white mb-1">Profile Information</h3>
                    <p className="text-sm text-slate-500">Update your account details and profile picture.</p>
                </div>
                <div className="p-6">
                    <h3 className="font-bold dark:text-white mb-1">Preferences</h3>
                    <p className="text-sm text-slate-500">Manage theme, currency, and language settings.</p>
                </div>
                <div className="p-6">
                    <h3 className="font-bold dark:text-white mb-1">Notifications</h3>
                    <p className="text-sm text-slate-500">Configure how you receive updates and alerts.</p>
                </div>
            </div>
        </div>
    );
};

export default Settings;

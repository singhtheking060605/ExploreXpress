import React from 'react';
import { useTrip } from './TripContext';
import PlanSidebar from './components/PlanSidebar';
import MapComponent from './components/MapComponent';
import DestinationsStep from './components/DestinationsStep';
import PreferencesStep from './components/PreferencesStep';
import BudgetStep from './components/BudgetStep';
import ResultsStep from './components/ResultsStep';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const StepContainer = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-5xl mx-auto"
    >
        {children}
    </motion.div>
);

const PlanTrip = () => {
    const { currentStep } = useTrip();

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <DestinationsStep />;
            case 2: return <PreferencesStep />;
            case 3: return <BudgetStep />;
            case 4: return <ResultsStep />;
            default: return <DestinationsStep />;
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-brand-dark font-sans text-slate-900 dark:text-slate-100">
            <PlanSidebar />

            <main className="flex-1 ml-80 h-screen overflow-hidden flex">
                {/* Form Section */}
                <div className="flex-1 h-full overflow-y-auto p-8 relative scrollbar-hide">
                    {/* Header Actions */}
                    <div className="absolute top-6 right-6 flex gap-4">
                        <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
                            Saved (0)
                        </button>
                        <div className="w-8 h-8 rounded-full bg-slate-200" /> {/* Placeholder User Avatar */}
                    </div>

                    <div className="mt-12 pb-20">
                        <AnimatePresence mode="wait">
                            <StepContainer key={currentStep}>
                                {renderStep()}
                            </StepContainer>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Map Section */}
                <div className="w-[40%] h-full p-4 hidden lg:block sticky top-0">
                    <MapComponent />
                </div>
            </main>
        </div>
    );
};

export default PlanTrip;

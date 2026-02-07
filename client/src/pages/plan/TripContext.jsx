import React, { createContext, useContext, useState, useMemo } from 'react';
import api from '../../services/api';

const TripContext = createContext();

export const useTrip = () => {
    const context = useContext(TripContext);
    if (!context) {
        throw new Error('useTrip must be used within a TripProvider');
    }
    return context;
};

export const TripProvider = ({ children }) => {
    // Steps: 1: Destinations, 2: Preferences, 3: Budget, 4: Results
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState([]);

    // Step 1: Destinations
    const [startDate, setStartDate] = useState(null);
    const [fromLocation, setFromLocation] = useState('');
    const [destinations, setDestinations] = useState([]); // Array of { id, city, duration }

    // Step 2: Preferences
    const [travelers, setTravelers] = useState(1);
    const [travelType, setTravelType] = useState('Leisure');

    // Step 3: Budget
    const [isCapped, setIsCapped] = useState(false);
    const [maxBudget, setMaxBudget] = useState(5000);
    // Budget allocation percentages
    const [allocation, setAllocation] = useState({
        travel: 25,
        accommodation: 25,
        food: 25,
        activities: 25
    });

    // Map Markers
    const [markers, setMarkers] = useState([]);

    const addMarker = (marker) => {
        setMarkers(prev => {
            // Avoid duplicates based on coordinates
            const exists = prev.find(m => m.lng === marker.lng && m.lat === marker.lat);
            if (exists) return prev;
            return [...prev, marker];
        });
    };

    const clearMarkers = () => setMarkers([]);
    const removeMarker = (id) => setMarkers(prev => prev.filter(m => m.id !== id));

    // Helper to update steps
    const completeStep = (step) => {
        if (!completedSteps.includes(step)) {
            setCompletedSteps((prev) => [...prev, step]);
        }
    };

    const goToStep = (step) => {
        // Only allow going to next step if current is complete, or any previous step
        if (step < currentStep || completedSteps.includes(step - 1) || step === 1) {
            setCurrentStep(step);
        }
    };

    // Generate Trip Plan
    const [generatedTrip, setGeneratedTrip] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState(null);

    const generateTripPlan = async (forceRefresh = false) => {
        setIsGenerating(true);
        setGenerationError(null);
        try {
            // Prepare payload
            const payload = {
                destination: destinations[0]?.city || "Paris", // Default fallback
                days: destinations[0]?.duration || 3,
                budget: maxBudget,
                travel_style: travelType,
                forceRefresh
            };

            const response = await api.post('/trips', payload);
            setGeneratedTrip(response.data);
            return response.data;
        } catch (error) {
            console.error("Trip Generation Error:", error);
            setGenerationError(error.response?.data?.error || "Failed to generate trip");
        } finally {
            setIsGenerating(false);
        }
    };

    const value = useMemo(() => ({
        currentStep,
        setCurrentStep,
        completedSteps,
        completeStep,
        goToStep,

        // Data
        startDate, setStartDate,
        fromLocation, setFromLocation,
        destinations, setDestinations,

        travelers, setTravelers,
        travelType, setTravelType,

        isCapped, setIsCapped,
        maxBudget, setMaxBudget,
        allocation, setAllocation,
        markers, setMarkers,
        addMarker, clearMarkers, removeMarker,

        // AI Generation
        generatedTrip,
        isGenerating,
        generationError,
        generateTripPlan
    }), [
        currentStep, completedSteps,
        startDate, fromLocation, destinations,
        travelers, travelType,
        isCapped, maxBudget, allocation,
        generatedTrip, isGenerating, generationError
    ]);

    return (
        <TripContext.Provider value={value}>
            {children}
        </TripContext.Provider>
    );
};

export default TripContext;

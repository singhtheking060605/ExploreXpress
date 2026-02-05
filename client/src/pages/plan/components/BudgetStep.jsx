import React, { useEffect } from 'react';
import { useTrip } from '../TripContext';
import { DollarSign, PieChart, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

const BudgetStep = () => {
    const {
        maxBudget, setMaxBudget,
        isCapped, setIsCapped,
        allocation, setAllocation,
        completeStep, goToStep
    } = useTrip();

    const handleAllocationChange = (category, newValue) => {
        if (!isCapped) {
            // If not capped, just update the value individually (logic for flexible)
            // But requirement says auto-balance for Capped. 
            // For now, let's strictly follow the screenshot logic: "Total must equal 100%"
            // If we move one, we must adjust others.

            // Wait, UI says "Capped Budget Mode: Set max... then allocate percentages... system will auto-adjust".
            // So this logic only applies when Capped is ACTIVE.

            // Actually, let's implement the auto-balance regardless if we want 100% total.
            // Simplified Auto-Balance: Distribute the delta among other categories proportionally.

            const oldValue = allocation[category];
            const delta = newValue - oldValue;

            // Find other categories that can absorb the change
            const otherCategories = Object.keys(allocation).filter(k => k !== category);

            // Calculate total of others
            const totalOthers = otherCategories.reduce((sum, k) => sum + allocation[k], 0);

            let remainingDelta = delta;
            const newAllocation = { ...allocation, [category]: newValue };

            // Distribute -delta
            // We need to subtract delta from others.
            // factor = (current / totalOthers)

            if (totalOthers === 0) {
                // Edge case: others are 0, force one to take the hit or equal distribute
                // If we are increasing, we can't. Limit the increase.
            } else {
                otherCategories.forEach((key, index) => {
                    // Last one takes rounding error
                    if (index === otherCategories.length - 1) {
                        newAllocation[key] = Math.max(0, 100 - (newValue + otherCategories.slice(0, -1).reduce((s, k) => s + newAllocation[k], 0)));
                    } else {
                        const share = (allocation[key] / totalOthers);
                        const adjustment = Math.round(delta * share);
                        newAllocation[key] = Math.max(0, allocation[key] - adjustment);
                    }
                });
            }

            // Safety check for total 100
            const total = Object.values(newAllocation).reduce((a, b) => a + b, 0);
            if (total !== 100) {
                // minor fix on the last one
                const lastKey = otherCategories[otherCategories.length - 1];
                newAllocation[lastKey] += (100 - total);
            }

            setAllocation(newAllocation);

        } else {
            // Manual mode or Flexible?
            // The prompt says: "If 'Capped Budget' is active, moving one slider must inversely adjust the others"
            // So my logic above should be inside `if (isCapped)` ???
            // Screenshot says "Capped Budget Mode" explain text.
            // Let's assume the percentage sliders are ALWAYS linked to equal 100% for the purpose of "Allocating the budget".

            // Re-reading: "Auto-Balance Logic: If 'Capped Budget' is active..."
            // Okay, I will use the logic I wrote above.

            // Wait, strict interpretation:
            // IF Capped -> Auto Balance.
            // IF NOT Capped -> maybe free form? Or maybe it just doesn't enforce 100%?
            // "Total must equal 100%" is written in the screenshot.
            // So it likely always enforced.

            // I'll stick to the Auto-Balance logic always for the percentages, as it's better UX.
            const oldValue = allocation[category];
            const delta = newValue - oldValue;
            const otherCategories = Object.keys(allocation).filter(k => k !== category);
            const totalOthers = otherCategories.reduce((sum, k) => sum + allocation[k], 0);

            const newAllocation = { ...allocation, [category]: newValue };

            // Simple substraction from others based on weight
            if (totalOthers > 0) {
                let distributed = 0;
                otherCategories.forEach((k, i) => {
                    if (i === otherCategories.length - 1) {
                        newAllocation[k] = 100 - newValue - distributed;
                    } else {
                        const ratio = allocation[k] / totalOthers;
                        const cut = Math.round(delta * ratio); // using round might drift, but okay for int sliders
                        // actually it's better to just recalculate everything based on remaining pool

                        // Better approach:
                        // We have (100 - newValue) to distribute among others.
                        // Distribute it based on their original relative weights.

                        // original ratio = allocation[k] / totalOthers
                        // new value = (100 - newValue) * ratio

                        const newVal = Math.round((100 - newValue) * (allocation[k] / totalOthers));
                        newAllocation[k] = newVal;
                        distributed += newVal;
                    }
                });
            } else {
                // others were 0, distribute evenly?
                const split = Math.floor((100 - newValue) / otherCategories.length);
                otherCategories.forEach((k, i) => {
                    newAllocation[k] = (i === otherCategories.length - 1) ? (100 - newValue - split * (otherCategories.length - 1)) : split;
                });
            }

            setAllocation(newAllocation);
        }
    };

    const resetBalanced = () => {
        setAllocation({
            travel: 25,
            accommodation: 25,
            food: 25,
            activities: 25
        });
    };

    const handleContinue = () => {
        completeStep(3);
        goToStep(4);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Set Your Budget</h2>
                        <p className="text-slate-500">Choose your budget planning approach</p>
                    </div>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                        onClick={() => setIsCapped(true)}
                        className={clsx(
                            "px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                            isCapped ? "bg-white dark:bg-slate-700 shadow-sm text-brand-primary" : "text-slate-500"
                        )}
                    >
                        Capped Budget
                    </button>
                    <button
                        onClick={() => setIsCapped(false)}
                        className={clsx(
                            "px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                            !isCapped ? "bg-white dark:bg-slate-700 shadow-sm text-brand-primary" : "text-slate-500"
                        )}
                    >
                        Flexible Budget
                    </button>
                </div>
            </div>

            {isCapped && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-xl text-sm text-blue-700 dark:text-blue-300">
                    <span className="font-bold">Capped Budget Mode:</span> Set a maximum budget limit, then allocate percentages across categories. The system will auto-adjust other categories when you change one to keep the total at 100%.
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Maximum Budget</h3>
                    <span className="text-3xl font-bold text-emerald-500">${maxBudget.toLocaleString()}</span>
                </div>

                <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="500"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
                    <span>$1,000</span>
                    <span className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">Set your maximum budget limit</span>
                    <span>$100,000</span>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Budget Categories</h3>
                    <button
                        onClick={resetBalanced}
                        className="text-brand-primary text-sm font-medium hover:underline flex items-center gap-1"
                    >
                        <RefreshCw size={14} /> Reset to Balanced
                    </button>
                </div>

                <p className="text-sm text-slate-500">Allocate your budget across different spending categories. Total must equal 100%.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Travel */}
                    <div className="bg-blue-50 dark:bg-slate-800 p-5 rounded-2xl border border-blue-100 dark:border-slate-700">
                        <div className="flex justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">✈️</div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-white">Travel</h4>
                                    <p className="text-xs text-slate-500">Flights, transportation</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">{allocation.travel}%</div>
                                <div className="text-xs text-slate-500">${Math.round(maxBudget * (allocation.travel / 100)).toLocaleString()}</div>
                            </div>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={allocation.travel}
                            onChange={(e) => handleAllocationChange('travel', parseInt(e.target.value))}
                            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>

                    {/* Accommodation */}
                    <div className="bg-green-50 dark:bg-slate-800 p-5 rounded-2xl border border-green-100 dark:border-slate-700">
                        <div className="flex justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg">🏠</div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-white">Accommodation</h4>
                                    <p className="text-xs text-slate-500">Hotels, hostels, rentals</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-green-600">{allocation.accommodation}%</div>
                                <div className="text-xs text-slate-500">${Math.round(maxBudget * (allocation.accommodation / 100)).toLocaleString()}</div>
                            </div>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={allocation.accommodation}
                            onChange={(e) => handleAllocationChange('accommodation', parseInt(e.target.value))}
                            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                        />
                    </div>

                    {/* Food */}
                    <div className="bg-orange-50 dark:bg-slate-800 p-5 rounded-2xl border border-orange-100 dark:border-slate-700">
                        <div className="flex justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">🍔</div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-white">Food & Dining</h4>
                                    <p className="text-xs text-slate-500">Restaurants, groceries</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-orange-600">{allocation.food}%</div>
                                <div className="text-xs text-slate-500">${Math.round(maxBudget * (allocation.food / 100)).toLocaleString()}</div>
                            </div>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={allocation.food}
                            onChange={(e) => handleAllocationChange('food', parseInt(e.target.value))}
                            className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                        />
                    </div>

                    {/* Activities */}
                    <div className="bg-purple-50 dark:bg-slate-800 p-5 rounded-2xl border border-purple-100 dark:border-slate-700">
                        <div className="flex justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">🎫</div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-white">Events & Activities</h4>
                                    <p className="text-xs text-slate-500">Tours, tickets, shows</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-purple-600">{allocation.activities}%</div>
                                <div className="text-xs text-slate-500">${Math.round(maxBudget * (allocation.activities / 100)).toLocaleString()}</div>
                            </div>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={allocation.activities}
                            onChange={(e) => handleAllocationChange('activities', parseInt(e.target.value))}
                            className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                    </div>
                </div>

                {/* Summary Strip */}
                <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-xl p-6 flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">Budget Allocation Summary</h4>
                        <div className="flex gap-8 text-sm mt-3">
                            <div className="text-center">
                                <div className="font-bold text-blue-600 text-lg">${Math.round(maxBudget * (allocation.travel / 100)).toLocaleString()}</div>
                                <div className="text-xs text-slate-500">Travel</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-green-600 text-lg">${Math.round(maxBudget * (allocation.accommodation / 100)).toLocaleString()}</div>
                                <div className="text-xs text-slate-500">Accommodation</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-orange-600 text-lg">${Math.round(maxBudget * (allocation.food / 100)).toLocaleString()}</div>
                                <div className="text-xs text-slate-500">Food & Dining</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-purple-600 text-lg">${Math.round(maxBudget * (allocation.activities / 100)).toLocaleString()}</div>
                                <div className="text-xs text-slate-500">Events & Activities</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm border border-emerald-100 dark:border-emerald-800/30">
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Total</span>
                        <div className="text-xl font-bold text-slate-900 dark:text-white">100%</div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <button
                    onClick={() => goToStep(2)}
                    className="text-slate-500 hover:text-slate-700 font-medium px-4 py-2 transition-colors border-2 border-transparent hover:border-slate-200 rounded-xl"
                >
                    ← Back to Preferences
                </button>
                <button
                    onClick={handleContinue}
                    className="bg-gradient-to-r from-brand-primary to-brand-accent text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-primary/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                >
                    Show Results
                    <span className="text-white/60">→</span>
                </button>
            </div>
        </div>
    );
};

export default BudgetStep;

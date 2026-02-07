import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import Explore from './pages/Explore';

import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import PlanTrip from './pages/plan/PlanTrip';
import { TripProvider } from './pages/plan/TripContext';
import HotelPortal from './pages/HotelPortal';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import ChatWidget from './components/common/ChatWidget';
import ProtectedRoute from './components/layout/ProtectedRoute';

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

        {/* Plan Trip Route (Custom Layout) */}
        <Route path="/plan" element={
          <ProtectedRoute>
            <TripProvider>
              <PlanTrip />
            </TripProvider>
          </ProtectedRoute>
        } />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Default After Login Redirect to Explore or Dashboard? User said Explore is the page when user logs in */}
          <Route path="/explore" element={<AppLayout><Explore /></AppLayout>} />

          {/* Dashboard is now the user's trips page */}
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />

          <Route path="/expenses" element={<AppLayout><Expenses /></AppLayout>} />
          <Route path="/hotels" element={<AppLayout><HotelPortal /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
        </Route>

        <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
      </Routes>
      <ChatWidget />
    </>
  );
}

export default App;

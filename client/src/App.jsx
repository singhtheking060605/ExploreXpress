import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import NotFound from './pages/NotFound';
import ChatWidget from './components/common/ChatWidget';

function App() {
  const location = useLocation();
  const isLanding = location.pathname === '/landing'; // Example if we wanted a separate landing route, but I'll make root Dashboard for now or Landing?
  // User asked for Landing Page and Dashboard. Let's make '/' Landing and '/dashboard' Dashboard.

  // Actually, typically in these apps, Landing is outside loop or '/' unchecked.
  // Let's make '/' LandingPage, and '/dashboard' Dashboard.

  // However, AppLayout has Sidebar. Sidebar usually appears for logged in state.
  // I will wrap specific routes in AppLayout.
  // Or I can conditionally render AppLayout.

  // Let's wrap non-landing routes in AppLayout.

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/dashboard" element={
          <AppLayout>
            <Dashboard />
          </AppLayout>
        } />

        <Route path="/expenses" element={
          <AppLayout>
            <Expenses />
          </AppLayout>
        } />

        {/* Placeholders for other links */}
        <Route path="/trips" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/hotels" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/settings" element={<AppLayout><Dashboard /></AppLayout>} />

        <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
      </Routes>

      {/* Chat Widget always visible? Or only on app pages? Let's keep it everywhere for cool factor */}
      <ChatWidget />
    </>
  );
}

export default App;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import NotFound from './pages/NotFound';
import ChatWidget from './components/common/ChatWidget';
import ProtectedRoute from './components/layout/ProtectedRoute';

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
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

          <Route path="/trips" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/hotels" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><Dashboard /></AppLayout>} />
        </Route>

        <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
      </Routes>
      <ChatWidget />
    </>
  );
}

export default App;

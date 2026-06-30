import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// Context
import { AuthProvider } from './context/AuthContext';

// Components & Layout
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CategoryCRUD from './pages/CategoryCRUD';
import ServiceCRUD from './pages/ServiceCRUD';
import BridalCRUD from './pages/BridalCRUD';
import AcademyCRUD from './pages/AcademyCRUD';
import GalleryCategoryCRUD from './pages/GalleryCategoryCRUD';
import GalleryCRUD from './pages/GalleryCRUD';
import BookingsCRUD from './pages/BookingsCRUD';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

// React Query Client setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Access Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Workspace Layout wrapper */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              {/* Redirect root to dashboard */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="categories" element={<CategoryCRUD />} />
              <Route path="services" element={<ServiceCRUD />} />
              <Route path="bridal-packages" element={<BridalCRUD />} />
              <Route path="academy" element={<AcademyCRUD />} />
              <Route path="gallery-categories" element={<GalleryCategoryCRUD />} />
              <Route path="gallery" element={<GalleryCRUD />} />
              <Route path="bookings" element={<BookingsCRUD />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Fallback unknown paths redirection */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        
        {/* Global Toast Alert Layer */}
        <Toaster 
          position="top-right" 
          theme="dark" 
          toastOptions={{
            style: {
              background: '#111111',
              border: '1px solid rgba(255,255,255,0.05)',
              color: '#ffffff',
              fontFamily: 'Poppins, sans-serif',
            },
          }} 
        />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

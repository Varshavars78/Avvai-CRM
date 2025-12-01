
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthPage } from './pages/Auth';
import { DashboardHome } from './pages/DashboardHome';
import { CRMData } from './modules/crm/CRMData';
import { BookingCalendar } from './modules/bookings/BookingCalendar';
import { BotDashboard, ChatWidget } from './modules/bot/BotWidget';
import { SettingsPage } from './pages/Settings';
import { AddonsMarketplace } from './pages/AddonsMarketplace';
import { MeetingsModule, TasksModule, NotesModule, FilesModule } from './modules/shared/ProductivityModules';
import { useStore } from './store';
import { UserRole } from './types';

// Admin imports
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { AdminArtists } from './admin/pages/AdminArtists';
import { AdminArtistDetails } from './admin/pages/AdminArtistDetails';
import { AdminAnalytics } from './admin/pages/AdminAnalytics';
import { AdminSettings } from './admin/pages/AdminSettings';
import { AdminBilling } from './admin/pages/AdminBilling';
import { AdminSupport } from './admin/pages/AdminSupport';
import { AdminAddUser } from './admin/pages/AdminAddUser';

// Wrapper for protected routes (User/Artist/Individual)
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: UserRole[] }> = ({ children, allowedRoles }) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const user = useStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // If user is admin but tries to access user pages, redirect to admin dashboard
  if (user?.role === 'admin' && (!allowedRoles || !allowedRoles.includes('admin'))) {
      return <Navigate to="/admin/dashboard" replace />;
  }

  // Role check: If role is restricted and user doesn't match, redirect
  // Note: 'user' role from older code maps to 'artist' or 'individual' now.
  // We treat 'artist' and 'individual' as valid for general dashboard unless specified.
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
     // If an individual tries to access CRM/Bot (Artist only features)
     if (user.role === 'individual' && (allowedRoles.includes('artist'))) {
         return <Navigate to="/dashboard" replace />;
     }
  }

  return <Layout>{children}</Layout>;
};

// Wrapper for Admin protected routes
const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const user = useStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

const App: React.FC = () => {
  const features = useStore((state) => state.features);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const user = useStore((state) => state.user);
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Router>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/auth/login" element={<AuthPage />} />
        
        {/* Redirect root based on role */}
        <Route 
          path="/" 
          element={
            !isAuthenticated 
              ? <Navigate to="/auth/login" replace />
              : user?.role === 'admin' 
                ? <Navigate to="/admin/dashboard" replace /> 
                : <Navigate to="/dashboard" replace />
          } 
        />

        {/* --- SHARED ROUTES (Artist & Individual) --- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['artist', 'individual']}>
              <DashboardHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meetings"
          element={
            <ProtectedRoute allowedRoles={['artist', 'individual']}>
              <MeetingsModule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute allowedRoles={['artist', 'individual']}>
              <TasksModule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute allowedRoles={['artist', 'individual']}>
              <NotesModule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/files"
          element={
            <ProtectedRoute allowedRoles={['artist', 'individual']}>
              <FilesModule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={['artist', 'individual']}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* --- ARTIST ONLY ROUTES --- */}
        <Route
          path="/crm"
          element={
            <ProtectedRoute allowedRoles={['artist']}>
              {features.crm_enabled ? <CRMData /> : <Navigate to="/dashboard" />}
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute allowedRoles={['artist']}>
              {features.booking_enabled ? <BookingCalendar /> : <Navigate to="/dashboard" />}
            </ProtectedRoute>
          }
        />

        <Route
          path="/bot"
          element={
            <ProtectedRoute allowedRoles={['artist']}>
              {features.bot_enabled ? <BotDashboard /> : <Navigate to="/dashboard" />}
            </ProtectedRoute>
          }
        />

        <Route
          path="/addons"
          element={
            <ProtectedRoute allowedRoles={['artist']}>
              <AddonsMarketplace />
            </ProtectedRoute>
          }
        />

        {/* --- Admin Routes --- */}
        <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="/admin/artists" element={<AdminProtectedRoute><AdminArtists /></AdminProtectedRoute>} />
        <Route path="/admin/users/add" element={<AdminProtectedRoute><AdminAddUser /></AdminProtectedRoute>} />
        <Route path="/admin/artists/:id" element={<AdminProtectedRoute><AdminArtistDetails /></AdminProtectedRoute>} />
        <Route path="/admin/analytics" element={<AdminProtectedRoute><AdminAnalytics /></AdminProtectedRoute>} />
        <Route path="/admin/billing" element={<AdminProtectedRoute><AdminBilling /></AdminProtectedRoute>} />
        <Route path="/admin/support" element={<AdminProtectedRoute><AdminSupport /></AdminProtectedRoute>} />
        <Route path="/admin/settings" element={<AdminProtectedRoute><AdminSettings /></AdminProtectedRoute>} />

      </Routes>

      {/* Global Widget - Visible only when logged in as ARTIST and enabled */}
      {isAuthenticated && (user?.role === 'artist') && features.bot_enabled && <ChatWidget />}
    </Router>
  );
};

export default App;

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Suspense, lazy, useState, useEffect } from 'react';
import './styles/App.css'
import LoadingScreen from './components/LoadingScreen';
import Layout from './components/Layout';
import CookieConsent from './components/CookieConsent';
import ErrorBoundary from './components/ErrorBoundary';
import { getCookie, removeCookie } from './utils/cookieUtils';

// Lazy load components
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Patients = lazy(() => import('./pages/Patients'));
const PatientProfile = lazy(() => import('./pages/PatientProfile'));
const Appointments = lazy(() => import('./pages/Appointments'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const MammoList = lazy(() => import('./pages/MammoList'));
const Notifications = lazy(() => import('./pages/Notifications'));
const MammoProfile = lazy(() => import('./pages/MammoProfile'));

const Home = lazy(() => import('./pages/Home'));
const Partner = lazy(() => import('./pages/Partner'));


// App component with routes
function AppRoutes() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  
  // Check if user is authenticated on app load and whenever the location changes
  useEffect(() => {
    const checkAuth = () => {
      const accessToken = getCookie('AccessToken');
      const refreshToken = getCookie('RefreshToken');
      
      // If tokens exist, consider the user authenticated
      if (accessToken && refreshToken) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      console.log('Checking authentication...', { accessToken, refreshToken }, { isAuthenticated });
    };
    
    
    checkAuth();
  }, [location]); // Re-check auth when location changes
  
  // Show loading screen on initial app load and route changes
  useEffect(() => {
    // Set loading to true immediately on location change
    setIsLoading(true);
    
    // Simulate minimum loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Minimum 800ms loading time
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Determine if route is an auth route
  const isAuthRoute = (pathname) => {
    return pathname === '/login' || pathname === '/register' || pathname === '/';
  };

  return (
    <>
      <LoadingScreen show={isLoading} message="Loading..." />
      <Suspense fallback={<LoadingScreen show={true} message="Loading page..." />}>
        <Routes>
          {/* Public routes with automatic redirection if authenticated */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/Home" replace /> : <Home />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
          
          {/* Protected routes wrapped in Layout */}
          <Route path="/dashboard" element={
            !isAuthenticated ? <Navigate to="/login" replace /> : (
              <Layout>
                <Dashboard />
              </Layout>
            )
          } />
          <Route path="/patients" element={
            !isAuthenticated ? <Navigate to="/login" replace /> : (
              <Layout>
                <Patients />
              </Layout>
            )
          } />
          <Route path="/patients/:id" element={
            !isAuthenticated ? <Navigate to="/login" replace /> : (
              <Layout>
                <ErrorBoundary>
                  <PatientProfile />
                </ErrorBoundary>
              </Layout>
            )
          } />
          <Route path="/appointments" element={
            !isAuthenticated ? <Navigate to="/login" replace /> : (
              <Layout>
                <Appointments />
              </Layout>
            )
          } />
          <Route path="/reports" element={
            <Layout>
              <Reports />
            </Layout>
          } />
          <Route path="/settings" element={
            <Layout>
              <Settings />
            </Layout>
          } />
          <Route path="/profile" element={
            <Layout>
              <Profile />
            </Layout>
          } />
          <Route path="/mammo-list" element={
            <Layout>
              <MammoList />
            </Layout>
          } />
          <Route path="/notifications" element={
            <Layout>
              <Notifications />
            </Layout>
          } />
          <Route path="/mammo-profile/:id" element={
            <Layout>
              <MammoProfile />
            </Layout>
          } />
          
          <Route path="/partner" element={<Partner />} />
          <Route path="/Home" element={<Home />} />
          {/* Redirect to login if not authenticated */}
          
          {/* Redirect all other routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
      <CookieConsent />
    </>
  );
}

// Wrap App with BrowserRouter
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

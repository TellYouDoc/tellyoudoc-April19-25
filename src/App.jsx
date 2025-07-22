import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Suspense, lazy, useState, useEffect } from "react";
import "./styles/App.css";
import "./styles/Doctor/Dashboard.css";
import "./styles/Doctor/Patients.css";
import "./styles/Doctor/PatientProfile.css";
import "./styles/Doctor/Appointments.css";
import "./styles/Doctor/Reports.css";
import "./styles/Doctor/Settings.css";
import "./styles/Doctor/Profile.css";
import "./styles/Doctor/MammoList.css";
import "./styles/Doctor/Notifications.css";
import "./styles/Doctor/MammoProfile.css";
import "./styles/Doctor/patient-fix.css";
import "./styles/Administrator/AdminLogin.css";
import "./styles/Administrator/AdminLayout.css";
import "./styles/Administrator/AdminDashboard.css";
import "./styles/Administrator/Appointments.css";
import "./styles/Administrator/BetaPartners.css";
import "./styles/Administrator/Content.css";
import "./styles/Administrator/ContentEditor.css";
import "./styles/Administrator/ContentViewer.css";
import "./styles/Administrator/DoctorProfile.css";
import "./styles/Administrator/Notifications.css";
import "./styles/Administrator/Organizations.css";
import "./styles/Administrator/Patients.css";
import "./styles/Administrator/Reports.css";
import "./styles/Administrator/Settings.css";
import "./styles/Administrator/Subscribers.css";
import "./styles/Administrator/pin-code-filter.css";
import LoadingScreen from "./components/LoadingScreen";
import Layout from "./components/Layout";
import CookieConsent from "./components/CookieConsent";
import ErrorBoundary from "./components/ErrorBoundary";
import { getCookie, removeCookie } from "./utils/cookieUtils";
import { Analytics } from "@vercel/analytics/react";

// Lazy load components

// Privacy Policy Page & Terms & Conditions Page
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));

// Routes List Page
const RoutesList = lazy(() => import("./pages/RoutesList"));

// Doctor Dashboard Pages
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Doctor/Dashboard"));
const Patients = lazy(() => import("./pages/Doctor/Patients"));
const PatientProfile = lazy(() => import("./pages/Doctor/PatientProfile"));
const Appointments = lazy(() => import("./pages/Doctor/Appointments"));
const Reports = lazy(() => import("./pages/Doctor/Reports"));
const Settings = lazy(() => import("./pages/Doctor/Settings"));
const Profile = lazy(() => import("./pages/Doctor/Profile"));
const MammoList = lazy(() => import("./pages/Doctor/MammoList"));
const Notifications = lazy(() => import("./pages/Doctor/Notifications"));
const MammoProfile = lazy(() => import("./pages/Doctor/MammoProfile"));
const DoctorDeleteAccount = lazy(() => import("./pages/DoctorDeleteAccount"));
const PatientDeleteAccount = lazy(() => import("./pages/PatientDeleteAccount"));

// Admin Login Pages
const AdminLogin = lazy(() => import("./pages/Administrator/AdminLogin"));
const AdminDashboard = lazy(() =>
  import("./pages/Administrator/AdminDashboard")
);
const Administrators = lazy(() =>
  import("./pages/Administrator/Administrators")
);
const Doctors = lazy(() => import("./pages/Administrator/Doctors"));
const DoctorProfile = lazy(() => import("./pages/Administrator/DoctorProfile"));
const AdminPatients = lazy(() => import("./pages/Administrator/Patients"));
const AdminAppointments = lazy(() =>
  import("./pages/Administrator/Appointments")
);
const AdminReports = lazy(() => import("./pages/Administrator/Reports"));
const AdminNotifications = lazy(() =>
  import("./pages/Administrator/Notifications")
);
const AdminContent = lazy(() => import("./pages/Administrator/Content"));
const AdminTermsConditions = lazy(() =>
  import("./pages/Administrator/AdminTnC")
);
const AdminFAQs = lazy(() => import("./pages/Administrator/AdminFAQ"));
const AdminPrivacyPolicy = lazy(() =>
  import("./pages/Administrator/AdminPrivacyPolicy")
);
const AdminBetaPartners = lazy(() =>
  import("./pages/Administrator/BetaPartners")
);
const AdminActivityLogs = lazy(() =>
  import("./pages/Administrator/ActivityLogs")
);
const AdminSettings = lazy(() => import("./pages/Administrator/Settings"));
const AdminSubscription = lazy(() =>
  import("./pages/Administrator/Subscribers")
);
const AdminOrganizations = lazy(() =>
  import("./pages/Administrator/Organizations")
);

// Organization Login Pages
const OrganizationLogin = lazy(() => import("./pages/Organization/Login"));
const OrganizationDashboard = lazy(() =>
  import("./pages/Organization/Dashboard")
);
const OrganizationAdministrators = lazy(() =>
  import("./pages/Organization/Administrators")
);
const OrganizationDoctors = lazy(() => import("./pages/Organization/Doctors"));
const OrganizationPatients = lazy(() =>
  import("./pages/Organization/Patients")
);
const OrganizationScreenings = lazy(() =>
  import("./pages/Organization/Screenings")
);

const Home = lazy(() => import("./pages/Home"));
const Partner = lazy(() => import("./pages/Partner"));
const Deeplink = lazy(() => import("./pages/Deeplink"));

// App component with routes
function AppRoutes() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const location = useLocation();

  // Check if user is authenticated on app load and whenever the location changes
  useEffect(() => {
    const checkAuth = () => {
      const accessToken = getCookie("AccessToken");
      const refreshToken = getCookie("RefreshToken");

      // If tokens exist, consider the user authenticated
      if (accessToken && refreshToken) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [location]); // Re-check auth when location changes

  // Check if the admin is Logged in or not
  useEffect(() => {
    const checkAdminAuth = () => {
      // logStorageAndCookies();

      // Check if adminAuth is set in localStorage
      if (localStorage.getItem("adminAuth")) {
        // console.log("adminAuth is set:", localStorage.getItem("adminAuth"));
        setIsAdminAuthenticated(true);
      } else {
        // console.log("adminAuth is not set");
        setIsAdminAuthenticated(false);
      }
    };

    checkAdminAuth();
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

  return (
    <>
      <LoadingScreen show={isLoading} message="Loading..." />
      <Suspense
        fallback={<LoadingScreen show={true} message="Loading page..." />}
      >
        <Routes>
          {/* Public routes with automatic redirection if authenticated */}
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/Home" replace /> : <Home />
            }
          />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/routes" element={<RoutesList />} />
          <Route path="/connect" element={<Deeplink />} />
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            }
          />

          {/* Protected routes wrapped in Layout */}
          <Route
            path="/dashboard"
            element={
              !isAuthenticated ? (
                <Navigate to="/login" replace />
              ) : (
                <Layout>
                  <Dashboard />
                </Layout>
              )
            }
          />
          <Route
            path="/patients"
            element={
              !isAuthenticated ? (
                <Navigate to="/login" replace />
              ) : (
                <Layout>
                  <Patients />
                </Layout>
              )
            }
          />
          <Route
            path="/patients/:id"
            element={
              !isAuthenticated ? (
                <Navigate to="/login" replace />
              ) : (
                <Layout>
                  <ErrorBoundary>
                    <PatientProfile />
                  </ErrorBoundary>
                </Layout>
              )
            }
          />
          <Route
            path="/appointments"
            element={
              !isAuthenticated ? (
                <Navigate to="/login" replace />
              ) : (
                <Layout>
                  <Appointments />
                </Layout>
              )
            }
          />
          <Route
            path="/reports"
            element={
              <Layout>
                <Reports />
              </Layout>
            }
          />
          <Route
            path="/settings"
            element={
              <Layout>
                <Settings />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
          <Route
            path="/mammo-list"
            element={
              <Layout>
                <MammoList />
              </Layout>
            }
          />
          <Route
            path="/notifications"
            element={
              <Layout>
                <Notifications />
              </Layout>
            }
          />
          <Route
            path="/mammo-profile/:id"
            element={
              <Layout>
                <MammoProfile />
              </Layout>
            }
          />

          <Route path="/partner" element={<Partner />} />
          <Route path="/Home" element={<Home />} />
          <Route
            path="/doctor/delete-account"
            element={<DoctorDeleteAccount />}
          />
          <Route
            path="/patient/delete-account"
            element={<PatientDeleteAccount />}
          />
          {/* Redirect to login if not authenticated */}

          {/* Routes for the Admin Panel */}
          <Route
            path="/admin"
            element={
              isAdminAuthenticated ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <AdminLogin />
              )
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              !isAdminAuthenticated ? (
                <Navigate to="/admin" replace />
              ) : (
                <AdminDashboard />
              )
            }
          />
          <Route
            path="/admin/administrators"
            element={
              !isAdminAuthenticated ? (
                <Navigate to="/admin" replace />
              ) : (
                <Administrators />
              )
            }
          />
          <Route
            path="/admin/doctors"
            element={
              !isAdminAuthenticated ? (
                <Navigate to="/admin" replace />
              ) : (
                <Doctors />
              )
            }
          />
          <Route
            path="/admin/doctors/:id"
            element={
              !isAdminAuthenticated ? (
                <Navigate to="/admin" replace />
              ) : (
                <ErrorBoundary>
                  <DoctorProfile />
                </ErrorBoundary>
              )
            }
          />
          <Route
            path="/admin/patients"
            element={
              !isAdminAuthenticated ? (
                <Navigate to="/admin" replace />
              ) : (
                <AdminPatients />
              )
            }
          />
          <Route
            path="/admin/appointments"
            element={
              !isAdminAuthenticated ? (
                <Navigate to="/admin" replace />
              ) : (
                <AdminAppointments />
              )
            }
          />
          <Route
            path="/admin/reports"
            element={
              !isAdminAuthenticated ? (
                <Navigate to="/admin" replace />
              ) : (
                <AdminReports />
              )
            }
          />
          <Route
            path="/admin/notifications"
            element={
              !isAdminAuthenticated ? (
                <Navigate to="/admin" replace />
              ) : (
                <AdminNotifications />
              )
            }
          />
          <Route
            path="/admin/content"
            element={
              !isAdminAuthenticated ? (
                <Navigate to="/admin" replace />
              ) : (
                <AdminContent />
              )
            }
          />
          <Route
            path="/admin/terms-conditions"
            element={
              !isAdminAuthenticated ? (
                <Navigate to="/admin" replace />
              ) : (
                <AdminTermsConditions />
              )
            }
          />
          <Route
            path="/admin/faqs"
            element={
              !isAdminAuthenticated ? (
                <Navigate to="/admin" replace />
              ) : (
                <AdminFAQs />
              )
            }
          />
          <Route
            path="/admin/privacy-policy"
            element={
              !isAdminAuthenticated ? (
                <Navigate to="/admin" replace />
              ) : (
                <AdminPrivacyPolicy />
              )
            }
          />
          <Route
            path="/admin/subscription"
            element={
              !isAdminAuthenticated ? (
                <Navigate to="/admin" replace />
              ) : (
                <AdminBetaPartners />
              )
            }
          />
          <Route
            path="/admin/activity-logs"
            element={
              !isAdminAuthenticated ? (
                <Navigate to="/admin" replace />
              ) : (
                <AdminActivityLogs />
              )
            }
          />
          <Route
            path="/admin/settings"
            element={
              !isAdminAuthenticated ? (
                <Navigate to="/admin" replace />
              ) : (
                <AdminSettings />
              )
            }
          />
          <Route
            path="/admin/subscribers"
            element={
              !isAdminAuthenticated ? (
                <Navigate to="/admin" replace />
              ) : (
                <AdminSubscription />
              )
            }
          />
          <Route
            path="/admin/organizations"
            element={
              !isAdminAuthenticated ? (
                <Navigate to="/admin" replace />
              ) : (
                <AdminOrganizations />
              )
            }
          />

          {/* Routes for Organization */}
          <Route
            path="/organization"
            element={
              isAdminAuthenticated ? (
                <Navigate to="/organization/dashboard" replace />
              ) : (
                <OrganizationLogin />
              )
            }
          />
          {/* <Route
            path="/organization/dashboard"
            element={
              !isAdminAuthenticated ? (
                <Navigate to="/organization" replace />
              ) : (
                <OrganizationDashboard />
              )
            }
          /> */}
          <Route
            path="/organization/dashboard"
            element={<OrganizationDashboard />}
          />
          <Route
            path="/organization/administrators"
            element={<OrganizationAdministrators />}
          />
          <Route
            path="/organization/doctors"
            element={<OrganizationDoctors />}
          />
          <Route
            path="/organization/patients"
            element={<OrganizationPatients />}
          />
          <Route
            path="/organization/screening"
            element={<OrganizationScreenings />}
          />

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
      <Analytics />
    </BrowserRouter>
  );
}

export default App;

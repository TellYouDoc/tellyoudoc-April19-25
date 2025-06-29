import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaColumns,
  FaUsers,
  FaCalendarAlt,
  FaHeartbeat,
  FaChartBar,
  FaBookMedical,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSearch,
  FaChevronLeft,
  FaCheck,
  FaEnvelope,
  FaBell,
  FaListAlt,
} from 'react-icons/fa';
import { MdNotificationsActive, MdNotificationsNone } from 'react-icons/md';
import { removeCookie, setCookie, areCookiesAccepted } from '../utils/cookieUtils';
import { clearAuthData } from '../utils/authUtils';
import { apiService } from '../services/api';
import CookieConsent from './CookieConsent';
import tellyouDocLogo from '../assets/tellyoudoc.png';
import '../styles/Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  // Percentage of profile completion
  const [profileCompletion, setProfileCompletion] = useState(0);

  const notificationsRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  // On component mount, check if we should restore a specific page
  useEffect(() => {
    // Store the current path in localStorage for potential restoration after login or refresh
    if (location.pathname !== '/login') {
      localStorage.setItem('lastViewedPage', location.pathname);
      console.log('Layout updated lastViewedPage:', location.pathname);
    }
  }, [location.pathname]);

  useEffect(() => {
    // Try to get user data from localStorage
    const storedUserData = localStorage.getItem('UserData');
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    const fetchUserData = async () => {
      try {
        const response = await apiService.doctorService.getProfile();
        const apiData = response.data.data;

        if (response.data && response.status === 200) {
          setUserData(apiData);
          console.log(apiData);
          // Store user data in localStorage for later use
          localStorage.setItem('UserData', JSON.stringify(apiData));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();

  }, []);

  // Close mobile sidebar when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  // Toggle notifications panel
  const toggleNotifications = (e) => {
    if (e) e.stopPropagation();
    setNotificationsOpen(!notificationsOpen);

    // Clear any existing close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotificationCount(0);
  };

  // Close notification panel when clicking outside
  const handleClickOutside = (e) => {
    if (notificationsRef.current && !notificationsRef.current.contains(e.target) && notificationsOpen) {
      closeTimeoutRef.current = setTimeout(() => {
        setNotificationsOpen(false);
      }, 100);
    }
  };

  // Add event listener to close notification panel when clicking outside
  useEffect(() => {
    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Clear any pending timeouts when component unmounts
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [notificationsOpen]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = (e) => {
    e.preventDefault();

    // Store current page path before logout
    localStorage.setItem('lastViewedPage', location.pathname);
    console.log('Saving path before logout:', location.pathname);

    // Use the centralized auth clearance function
    clearAuthData();

    // Navigate to login page - using window.location for a full page reload
    window.location.replace('/login');
  };

  return (
    <div className="app-container">
      {/* Top Navigation Bar */}
      <header className="top-navbar">
        <div className="navbar-left">
          <button className="menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle navigation menu">
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <Link to="/dashboard" className="logo-container">
            <img src={tellyouDocLogo} alt="tellyouDoc" className="logo-icon" />
          </Link>

          <div className="global-search">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search patients, appointments..." aria-label="Search" />
          </div>
        </div>
        <div className="navbar-right">
          <div className="notification-icon" ref={notificationsRef}>
            <div onClick={(e) => toggleNotifications(e)} className="notification-icon-button" title={`${notificationCount} unread notifications`}>
              {notificationCount > 0 ? <MdNotificationsActive size={24} color="#0e9f6e" /> : <MdNotificationsNone size={24} />}
              {notificationCount > 0 && <span className="notification-badge">{notificationCount}</span>}
            </div>

            {/* Floating Notification Panel */}
            {notificationsOpen && (
              <div className="notifications-panel">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  {notificationCount > 0 && (
                    <button onClick={markAllAsRead} className="mark-read-button">
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="notifications-content">
                  {notificationCount > 0 ? (
                    <>
                      <div className="notification-item unread">
                        <div className="notification-icon-container medical">
                          <FaCalendarAlt />
                        </div>
                        <div className="notification-details">
                          <p className="notification-text">Your appointment with Dr. Smith has been confirmed.</p>
                          <span className="notification-time">2 hours ago</span>
                        </div>
                      </div>

                      <div className="notification-item unread">
                        <div className="notification-icon-container message">
                          <FaEnvelope />
                        </div>
                        <div className="notification-details">
                          <p className="notification-text">You have a new message from Dr. Johnson regarding your test results.</p>
                          <span className="notification-time">Yesterday</span>
                        </div>
                      </div>

                      <div className="notification-item unread">
                        <div className="notification-icon-container reminder">
                          <FaBell />
                        </div>
                        <div className="notification-details">
                          <p className="notification-text">Reminder: Your follow-up appointment is scheduled for tomorrow.</p>
                          <span className="notification-time">2 days ago</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="no-notifications">
                      <FaCheck size={32} />
                      <p>You're all caught up!</p>
                      <span>No new notifications</span>
                    </div>
                  )}
                </div>

                <div className="notifications-footer">
                  <Link to="/notifications">
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link to="/profile" className="user-profile">
            <div className="avatar">
              {userData?.profileImage ? (
                <img src={userData.profileImage} alt={userData.firstName} />
              ) : (
                <span>{userData?.firstName?.charAt(0)}{userData?.lastName?.charAt(0) || ''}</span>
              )}
            </div>
            <div className="user-info">
              <span className="user-name">Dr. {userData?.firstName || ''} {userData?.lastName || ''}</span>
              <span className="user-role">{userData?.professionalDetails?.specialization?.[0]
                ? userData.professionalDetails.specialization[0].charAt(0).toUpperCase() +
                userData.professionalDetails.specialization[0].slice(1).toLowerCase()
                : 'Doctor' || 'Doctor'}</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Side Navigation */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <span className="logo-text">Welcome to  <span style={{ color: "#FF7007", fontWeight: 800 }}>tellyou</span>
              <span style={{ color: "#05AFA4", fontWeight: 800 }}>
                doc
              </span></span>
          </div>
          <button
            className="collapse-btn"
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <FaChevronLeft />
          </button>
        </div>

        <nav className="sidebar-menu">
          <ul>
            <li className={location.pathname === '/dashboard' ? 'active' : ''}>
              <Link to="/dashboard" title="Dashboard">
                <FaColumns className="menu-icon" />
                <span className="menu-text">Dashboard</span>
              </Link>
            </li>
            <li className={location.pathname.includes('/patients') ? 'active' : ''}>
              <Link to="/patients" title="Patients">
                <FaUsers className="menu-icon" />
                <span className="menu-text">Patients</span>
              </Link>
            </li>
            <li className={location.pathname === '/appointments' ? 'active' : ''}>
              <Link to="/appointments" title="Appointments">
                <FaCalendarAlt className="menu-icon" />
                <span className="menu-text">Appointments</span>
              </Link>
            </li>
            {/* <li className={location.pathname === '/treatments' ? 'active' : ''}>
              <Link
                // to="/treatments"
                title="Treatment Plans">
                <FaHeartbeat className="menu-icon" />
                <span className="menu-text">Treatment Plans</span>
              </Link>
            </li> */}
            <li className={location.pathname === '/mammo-list' ? 'active' : ''}>
              <Link to="/mammo-list" title="Mammo List">
                <FaListAlt className="menu-icon" />
                <span className="menu-text">Mammo List</span>
              </Link>
            </li>
            <li className={location.pathname === '/reports' ? 'active' : ''}>
              <Link to="/reports" title="Statistics">
                <FaChartBar className="menu-icon" />
                <span className="menu-text">Statistics</span>
              </Link>
            </li>
            {/* <li className={location.pathname === '/resources' ? 'active' : ''}>
              <Link
                // to="/resources"
                title="Resources">
                <FaBookMedical className="menu-icon" />
                <span className="menu-text">Resources</span>
              </Link>
            </li> */}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <ul>
            <li className={location.pathname === '/profile' ? 'active' : ''}>
              <Link to="/profile" title="Profile">
                <FaUser className="menu-icon" />
                <span className="menu-text">Profile</span>
              </Link>
            </li>
            <li className={location.pathname === '/settings' ? 'active' : ''}>
              <Link to="/settings" title="Settings">
                <FaCog className="menu-icon" />
                <span className="menu-text">Settings</span>
              </Link>
            </li>
            <li>
              <Link to="/" onClick={handleLogout} title="Logout">
                <FaSignOutAlt className="menu-icon" />
                <span className="menu-text">Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        {children}
      </main>
      <CookieConsent />
    </div>
  );
};

export default Layout;
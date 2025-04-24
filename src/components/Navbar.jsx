import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import { MdNotificationsActive, MdNotificationsNone } from 'react-icons/md';
import { FaBars, FaTimes, FaCheck, FaEnvelope, FaBell, FaCalendarAlt, FaUser } from 'react-icons/fa';
import tellyouDocLogo from '../assets/tellyoudoc.png';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  // Check if user is on any protected/authenticated page
  const isLoggedIn = location.pathname.includes('/dashboard') ||
    location.pathname.includes('/patients') ||
    location.pathname.includes('/appointments') ||
    location.pathname.includes('/treatments') ||
    location.pathname.includes('/reports') ||
    location.pathname.includes('/resources') ||
    location.pathname.includes('/profile') ||
    location.pathname.includes('/settings');

  // If user is logged in, the Layout component handles the navigation
  // so we don't need to show the Navbar
  if (isLoggedIn) {
    return null;
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target) && dropdownOpen) {
      // Use timeout to delay closing the dropdown
      closeTimeoutRef.current = setTimeout(() => {
        setDropdownOpen(false);
      }, 100); // Small delay to prevent accidental closing
    }

    // Also check for clicks outside the notifications panel
    if (notificationsRef.current && !notificationsRef.current.contains(e.target) && notificationsOpen) {
      closeTimeoutRef.current = setTimeout(() => {
        setNotificationsOpen(false);
      }, 100);
    }
  };

  // Navigate without full page reload
  const handleNavigation = (e, path) => {
    e.preventDefault();

    // Only navigate if we're actually changing paths
    if (path !== location.pathname) {
      navigate(path);
    }

    // Close mobile menu if open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }

    // Close notifications if open
    if (notificationsOpen) {
      setNotificationsOpen(false);
    }

    // Don't close dropdown if clicking items inside it
    if (dropdownOpen && path !== location.pathname) {
      // Slight delay before closing the dropdown when navigating
      setTimeout(() => {
        setDropdownOpen(false);
      }, 50);
    }
  };

  // Add event listener to close dropdown when clicking outside
  useEffect(() => {
    // Only add the event listener if the dropdown or notifications are open
    if (dropdownOpen || notificationsOpen) {
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
  }, [dropdownOpen, notificationsOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="#" onClick={(e) => {
            e.preventDefault();
            const isAuthenticated = localStorage.getItem('token') || sessionStorage.getItem('token');
            handleNavigation(e, isAuthenticated ? '/dashboard' : '/login');
          }}>
            <img src={tellyouDocLogo} alt="tellyouDoc" className="logo-icon" />
          </Link>
        </div>

        <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/"
            className={location.pathname === '/' ? 'active' : ''}
            onClick={(e) => handleNavigation(e, '/')}>
            Home
          </Link>
          <Link to="/about"
            className={location.pathname === '/about' ? 'active' : ''}
            onClick={(e) => handleNavigation(e, '/about')}>
            About
          </Link>
          <Link to="/features"
            className={location.pathname === '/features' ? 'active' : ''}
            onClick={(e) => handleNavigation(e, '/features')}>
            Features
          </Link>
          <Link to="/resources"
            className={location.pathname === '/resources' ? 'active' : ''}
            onClick={(e) => handleNavigation(e, '/resources')}>
            Resources
          </Link>          <Link to="/contact"
            className={location.pathname === '/contact' ? 'active' : ''}
            onClick={(e) => handleNavigation(e, '/contact')}>
            Contact
          </Link>
        </div>
        <div className="navbar-actions">
          {/* Only show notifications for logged in users */}
          {isLoggedIn && (
            <div className="notification-icon" ref={notificationsRef}>
              <div onClick={(e) => toggleNotifications(e)} className="notification-icon-button">
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
                    <Link to="/notifications" onClick={(e) => handleNavigation(e, '/notifications')}>
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          <Link to="/login" className="nav-link" onClick={(e) => handleNavigation(e, '/login')}>
            Login
          </Link>
          {/* <Link to="/register" className="nav-button" onClick={(e) => handleNavigation(e, '/register')}>
            Get Started
          </Link> */}
        </div>

        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          <span>{mobileMenuOpen ? <FaTimes /> : <FaBars />}</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
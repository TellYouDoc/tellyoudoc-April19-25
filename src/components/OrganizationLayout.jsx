// filepath: c:\Users\Ankan Chakraborty\OneDrive\Desktop\IIIT Guwahati\Website\live\tellyoudoc-April19-25\src\components\OrganizationLayout.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUserMd,
  FaCheckSquare,
  FaTimesCircle,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSearch,
  FaBell,
  FaChevronLeft,
  FaChevronRight,
  FaUserShield,
  FaUsers,
  FaCalendarAlt,
  FaChartBar,
  FaFileAlt,
  FaHandshake,
  FaHistory,
  FaSyringe,
  FaClinicMedical,
  FaHospital
} from 'react-icons/fa';
import tellyouDocLogo from '../assets/tellyoudoc.png';
import '../styles/Organization/OrganizationLayout.css';

const OrganizationLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Doctor Registration",
      message: "Dr. Sarah Johnson has registered",
      time: "2 minutes ago",
      read: false
    },
    {
      id: 2,
      title: "Patient Request",
      message: "3 new patient registrations",
      time: "1 hour ago",
      read: false
    },
    {
      id: 3,
      title: "System Update",
      message: "Platform maintenance scheduled",
      time: "3 hours ago",
      read: false
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [expandedMenus, setExpandedMenus] = useState({
    userManagement: false,
    screening: false,
    analytics: false
  });
  
  // Mock organization data (this would be fetched from the API in a real scenario)
  const [organizationData, setOrganizationData] = useState({
    name: "Sample Hospital",
    id: "org123"
  });

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const toggleMenuExpand = (menuKey) => {
    setExpandedMenus({
      ...expandedMenus,
      [menuKey]: !expandedMenus[menuKey]
    });
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleGlobalSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const searchableItems = [
      { type: 'Doctors', items: [
        { title: 'Doctor Management', path: '/organization/doctors' },
      ]},
      { type: 'Patients', items: [
        { title: 'Patient Management', path: '/organization/patients' }
      ]},
      { type: 'Screening', items: [
        { title: 'Screening Management', path: '/organization/screening' }
      ]},
      { type: 'Settings', items: [
        { title: 'Organization Settings', path: '/organization/settings' }
      ]},
      { type: 'Activity', items: [
        { title: 'Activity Logs', path: '/organization/activity-logs' }
      ]}
    ];

    const results = [];
    searchableItems.forEach(category => {
      const matches = category.items.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      if (matches.length > 0) {
        results.push({
          type: category.type,
          items: matches
        });
      }
    });

    setSearchResults(results);
  };

  // Close mobile sidebar when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    // Clear organization authentication
    localStorage.removeItem('orgAuth');
    localStorage.removeItem('organizationData');
    // Redirect to organization login page
    navigate('/organization');
  };

  // Load organization data from localStorage if available
  useEffect(() => {
    const storedOrgData = localStorage.getItem('organizationData');
    if (storedOrgData) {
      try {
        setOrganizationData(JSON.parse(storedOrgData));
      } catch (e) {
        console.error("Error parsing organization data from localStorage", e);
      }
    }
  }, []);

  return (
    <div className="org-app-container">
      {/* Top Navigation Bar */}
      <header className="org-top-navbar">
        <div className="org-navbar-left">
          <button 
            className="org-menu-toggle" 
            onClick={toggleMobileMenu} 
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <Link to="/organization/dashboard" className="org-logo-container">
            <img src={tellyouDocLogo} alt="tellyouDoc" className="org-logo-icon" />
            <span className="org-logo-text">Organization Portal</span>
          </Link>

          {/* Organization name with profile link */}
          <div className="org-profile">
            <span className="org-profile-name">{organizationData.name}</span>
            <span className="view-profile-link disabled" title="Coming soon">View Profile</span>
          </div>

          <div className="org-global-search">
            <FaSearch className="org-search-icon" />
            <input 
              type="text" 
              placeholder="Search within organization..." 
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => handleGlobalSearch(e.target.value)}
            />
            {searchResults.length > 0 && searchQuery && (
              <div className="search-results-dropdown">
                {searchResults.map((category, idx) => (
                  <div key={idx} className="search-category">
                    <div className="category-title">{category.type}</div>
                    {category.items.map((item, itemIdx) => (
                      <div 
                        key={itemIdx} 
                        className="search-result-item"
                        onClick={() => {
                          navigate(item.path);
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                      >
                        {item.title}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="org-navbar-right">
          {/* Notification icon */}
          <div className="org-notification-icon">
            <div onClick={(e) => {
              e.stopPropagation();
              setShowNotifications(!showNotifications);
            }} className="org-notification-icon-button">
              <FaBell size={18} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="org-notification-badge">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </div>
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  {notifications.some(n => !n.read) && (
                    <button 
                      className="mark-all-read"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNotifications(notifications.map(n => ({ ...n, read: true })));
                      }}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="notifications-list">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${notification.read ? '' : 'unread'}`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="notification-title">{notification.title}</div>
                        <div className="notification-message">{notification.message}</div>
                        <div className="notification-time">{notification.time}</div>
                      </div>
                    ))
                  ) : (
                    <div className="no-notifications">
                      <p>No new notifications</p>
                    </div>
                  )}
                </div>
                <div className="notifications-footer">
                  <Link to="/organization/notifications" onClick={() => setShowNotifications(false)}>
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          <button className="org-logout-button-nav" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`org-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="org-sidebar-header">
          <div className="org-sidebar-title">
            <span className="org-sidebar-text">Welcome <span className="tellyoudoc-org-text">Organization</span></span>
          </div>
          <button className="org-collapse-btn" onClick={toggleSidebar}>
            {sidebarCollapsed ? 
              <span className="icon-rotate-180"><FaChevronLeft size={18} /></span> : 
              <FaChevronLeft size={18} />
            }
          </button>
        </div>

        <nav className="org-sidebar-menu">
          <ul>            <li className={location.pathname === '/organization/dashboard' ? 'active' : ''}>
              <Link to="/organization/dashboard" data-title="Dashboard">
                <span className="org-menu-icon"><FaTachometerAlt /></span>
                <span className="org-menu-text">Dashboard</span>
              </Link>
            </li>{/* User Management Group */}
            <li className={`menu-group ${expandedMenus.userManagement ? 'expanded' : ''} ${
              ['/organization/administrators', '/organization/doctors', '/organization/patients'].includes(location.pathname) ? 'active-group' : ''
            }`}>              <div 
                className="menu-group-header" 
                onClick={() => toggleMenuExpand('userManagement')}
                data-title="User Management"
              >
                <div className="menu-group-title">
                  <span className="org-menu-icon"><FaUsers /></span>
                  <span className="org-menu-text">User Management</span>
                </div>
                <div className="menu-expand-icon">
                  <FaChevronRight size={14} />
                </div>
              </div>
              <ul className="submenu">                <li className={location.pathname === '/organization/administrators' ? 'active' : ''}>
                  <Link to="/organization/administrators" data-title="Administrator Management">
                    <span className="org-menu-icon"><FaUserShield /></span>
                    <span className="org-menu-text">Administrator Management</span>
                  </Link>
                </li>                <li className={location.pathname === '/organization/doctors' ? 'active' : ''}>
                  <Link to="/organization/doctors" data-title="Doctor Management">
                    <span className="org-menu-icon"><FaUserMd /></span>
                    <span className="org-menu-text">Doctor Management</span>
                  </Link>
                </li>                <li className={location.pathname === '/organization/patients' ? 'active' : ''}>
                  <Link to="/organization/patients" data-title="Patient Management">
                    <span className="org-menu-icon"><FaUsers /></span>
                    <span className="org-menu-text">Patient Management</span>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Screening Management Group */}
            <li className={`menu-group ${expandedMenus.screening ? 'expanded' : ''} ${
              ['/organization/screening'].includes(location.pathname) ? 'active-group' : ''
            }`}>              <div 
                className="menu-group-header" 
                onClick={() => toggleMenuExpand('screening')}
                data-title="Clinical"
              >
                <div className="menu-group-title">
                  <span className="org-menu-icon"><FaClinicMedical /></span>
                  <span className="org-menu-text">Clinical</span>
                </div>
                <div className="menu-expand-icon">
                  <FaChevronRight size={14} />
                </div>
              </div>
              <ul className="submenu">                <li className={location.pathname === '/organization/screening' ? 'active' : ''}>
                  <Link to="/organization/screening" data-title="Screening Management">
                    <span className="org-menu-icon"><FaSyringe /></span>
                    <span className="org-menu-text">Screening Management</span>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Analytics & Reports Group */}
            <li className={`menu-group ${expandedMenus.analytics ? 'expanded' : ''} ${
              ['/organization/statistics', '/organization/activity-logs'].includes(location.pathname) ? 'active-group' : ''
            }`}>              <div 
                className="menu-group-header" 
                onClick={() => toggleMenuExpand('analytics')}
                data-title="Analytics & Logs"
              >
                <div className="menu-group-title">
                  <span className="org-menu-icon"><FaChartBar /></span>
                  <span className="org-menu-text">Analytics & Logs</span>
                </div>
                <div className="menu-expand-icon">
                  <FaChevronRight size={14} />
                </div>
              </div>
              <ul className="submenu">                <li className={location.pathname === '/organization/statistics' ? 'active' : ''}>
                  <Link to="/organization/statistics" data-title="Statistics">
                    <span className="org-menu-icon"><FaChartBar /></span>
                    <span className="org-menu-text">Statistics</span>
                  </Link>
                </li>                <li className={location.pathname === '/organization/activity-logs' ? 'active' : ''}>
                  <Link to="/organization/activity-logs" data-title="Activity Logs">
                    <span className="org-menu-icon"><FaHistory /></span>
                    <span className="org-menu-text">Activity Logs</span>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Settings */}            <li className={location.pathname === '/organization/settings' ? 'active' : ''}>
              <Link to="/organization/settings" data-title="Settings">
                <span className="org-menu-icon"><FaCog /></span>
                <span className="org-menu-text">Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`org-main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default OrganizationLayout;
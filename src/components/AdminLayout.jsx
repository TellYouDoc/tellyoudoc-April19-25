import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserMd,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSearch,
  FaBell,
  FaChevronLeft,
  FaUserShield,
  FaUsers,
  FaCalendarAlt,
  FaChartBar,
  FaFileAlt,
  FaHistory,
  FaUserCheck,
  FaMobile,
} from "react-icons/fa";
import tellyouDocLogo from "../assets/tellyoudoc.png";
import "../styles/Administrator/AdminLayout.css";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [expandedMenus, setExpandedMenus] = useState({
    userManagement: false,
    contentManagement: false,
    analytics: false,
    appointmentManagement: false,
    kycManagement: false,
    appManagement: false,
    systemManagement: false,
  });

  const toggleMenuExpand = (menuKey) => {
    setExpandedMenus({
      ...expandedMenus,
      [menuKey]: !expandedMenus[menuKey],
    });
  };

  const markNotificationAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleGlobalSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const searchableItems = [
      {
        type: "Doctors",
        items: [
          { title: "Doctor Management", path: "/admin/doctors" },
          { title: "Dr. Sarah Johnson", path: "/admin/doctors" },
          { title: "Dr. Rajesh Kumar", path: "/admin/doctors" },
        ],
      },
      {
        type: "Patients",
        items: [{ title: "Patient Management", path: "/admin/patients" }],
      },
      {
        type: "Reports",
        items: [{ title: "Reports and Feedbacks", path: "/admin/reports" }],
      },
      {
        type: "Settings",
        items: [{ title: "Admin Settings", path: "/admin/settings" }],
      },
      {
        type: "Activity",
        items: [{ title: "Activity Logs", path: "/admin/activity-logs" }],
      },
    ];

    const results = [];
    searchableItems.forEach((category) => {
      const matches = category.items.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      if (matches.length > 0) {
        results.push({
          type: category.type,
          items: matches,
        });
      }
    });

    setSearchResults(results);
  };

  // Close mobile sidebar when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Auto-expand menu groups based on current route
  useEffect(() => {
    const path = location.pathname;

    // Check which menu group should be expanded based on current path
    const userManagementPaths = ['/admin/administrators', '/admin/patients', '/admin/doctors'];
    const analyticsPaths = ['/admin/reports', '/admin/activity-logs'];
    const contentManagementPaths = ['/admin/content', '/admin/notifications'];
    const appointmentManagementPaths = ['/admin/appointments', '/admin/appointment-analytics'];
    const kycManagementPaths = ['/admin/kyc'];
    const appManagementPaths = ['/admin/doctor-app-content', '/admin/specializations'];

    setExpandedMenus({
      userManagement: userManagementPaths.includes(path),
      analytics: analyticsPaths.includes(path),
      contentManagement: contentManagementPaths.includes(path),
      appointmentManagement: appointmentManagementPaths.includes(path),
      kycManagement: kycManagementPaths.includes(path),
      appManagement: appManagementPaths.includes(path),
    });
  }, [location.pathname]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    // Clear admin authentication
    localStorage.removeItem("adminAuth");
    // Redirect to admin login page
    navigate("/admin");
  };

  return (
    <div className="admin-app-container">
      {/* Top Navigation Bar */}
      <header className="admin-top-navbar">
        <div className="admin-navbar-left">
          <button
            className="admin-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <Link to="/admin/dashboard" className="admin-logo-container">
            <img
              src={tellyouDocLogo}
              alt="tellyouDoc"
              className="admin-logo-icon"
            />
            <span className="admin-logo-text">Admin Panel</span>
          </Link>

          <div className="admin-global-search">
            <FaSearch className="admin-search-icon" />
            <input
              type="text"
              placeholder="Search anything in admin panel..."
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
                          setSearchQuery("");
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

        <div className="admin-navbar-right">
          {/* Notification icon */}
          <div className="admin-notification-icon">
            <div
              onClick={(e) => {
                e.stopPropagation();
                setShowNotifications(!showNotifications);
              }}
              className="admin-notification-icon-button"
            >
              <FaBell size={18} />
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="admin-notification-badge">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </div>
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  {notifications.some((n) => !n.read) && (
                    <button
                      className="mark-all-read"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNotifications(
                          notifications.map((n) => ({ ...n, read: true }))
                        );
                      }}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="notifications-list">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${notification.read ? "" : "unread"
                          }`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="notification-title">
                          {notification.title}
                        </div>
                        <div className="notification-message">
                          {notification.message}
                        </div>
                        <div className="notification-time">
                          {notification.time}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-notifications">
                      <p>No new notifications</p>
                    </div>
                  )}
                </div>
                <div className="notifications-footer">
                  <Link
                    to="/admin/notifications#push-history"
                    onClick={() => setShowNotifications(false)}
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          <button className="admin-logout-button-nav" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${sidebarCollapsed ? "collapsed" : ""} ${mobileMenuOpen ? "mobile-open" : ""
          }`}
      >
        {/* Header */}
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-title">
            <span className="admin-sidebar-text">
              Welcome <span className="tellyoudoc-text">Admin</span>
            </span>
          </div>
          <button className="admin-collapse-btn" onClick={toggleSidebar}>
            {sidebarCollapsed ? (
              <span className="icon-rotate-180">
                <FaChevronLeft size={18} />
              </span>
            ) : (
              <FaChevronLeft size={18} />
            )}
          </button>
        </div>

        {/* Menu */}
        <nav className="admin-sidebar-menu">
          <ul>
            <li
              className={
                location.pathname === "/admin/dashboard" ? "active" : ""
              }
            >
              <Link to="/admin/dashboard">
                <span className="admin-menu-icon">
                  <FaTachometerAlt />
                </span>
                <span className="admin-menu-text">Dashboard</span>
              </Link>
            </li>

            {/* User Management Group */}
            <li
              className={`menu-group ${expandedMenus.userManagement ? "expanded" : ""
                } ${[
                  "/admin/administrators",
                  "/admin/patients",
                  "/admin/doctors",
                ].includes(location.pathname)
                  ? "active-group"
                  : ""
                }`}
            >
              <div
                className="menu-group-header"
                onClick={() => toggleMenuExpand("userManagement")}
              >
                <div className="menu-group-title">
                  <span className="admin-menu-icon">
                    <FaUsers />
                  </span>
                  <span className="admin-menu-text">User Management</span>
                </div>
                <div className="menu-expand-icon">
                  {expandedMenus.userManagement ? "−" : "+"}
                </div>
              </div>
              <ul className="submenu">
                <li
                  className={
                    location.pathname === "/admin/administrators"
                      ? "active"
                      : ""
                  }
                >
                  <Link to="/admin/administrators">
                    <span className="admin-menu-icon">
                      <FaUserShield />
                    </span>
                    <span className="admin-menu-text">Administrators</span>
                  </Link>
                </li>
                <li
                  className={
                    location.pathname === "/admin/doctors" ? "active" : ""
                  }
                >
                  <Link to="/admin/doctors">
                    <span className="admin-menu-icon">
                      <FaUserMd />
                    </span>
                    <span className="admin-menu-text">Doctors</span>
                  </Link>
                </li>
                <li
                  className={
                    location.pathname === "/admin/patients" ? "active" : ""
                  }
                >
                  <Link to="/admin/patients">
                    <span className="admin-menu-icon">
                      <FaUsers />
                    </span>
                    <span className="admin-menu-text">Patients</span>
                  </Link>
                </li>
                {/* Future additions can be added here:
                <li className={location.pathname === '/admin/organizations' ? 'active' : ''}>
                  <Link to="/admin/organizations">
                    <span className="admin-menu-icon"><FaHandshake /></span>
                    <span className="admin-menu-text">Organizations</span>
                  </Link>
                </li>
                <li className={location.pathname === '/admin/subscribers' ? 'active' : ''}>
                  <Link to="/admin/subscribers">
                    <span className="admin-menu-icon"><FaHandshake /></span>
                    <span className="admin-menu-text">Subscribers</span>
                  </Link>
                </li> */}
              </ul>
            </li>

            {/* Appointment Management Group */}
            <li
              className={`menu-group ${expandedMenus.appointmentManagement ? "expanded" : ""
                } ${["/admin/appointments", "/admin/appointment-analytics"].includes(
                  location.pathname
                )
                  ? "active-group"
                  : ""
                }`}
            >
              <div
                className="menu-group-header"
                onClick={() => toggleMenuExpand("appointmentManagement")}
              >
                <div className="menu-group-title">
                  <span className="admin-menu-icon">
                    <FaCalendarAlt />
                  </span>
                  <span className="admin-menu-text">Manage Appointments</span>
                </div>
                <div className="menu-expand-icon">
                  {expandedMenus.appointmentManagement ? "−" : "+"}
                </div>
              </div>
              <ul className="submenu">
                <li
                  className={
                    location.pathname === "/admin/appointments" ? "active" : ""
                  }
                >
                  <Link to="/admin/appointments">
                    <span className="admin-menu-icon">
                      <FaCalendarAlt />
                    </span>
                    <span className="admin-menu-text">Appointments</span>
                  </Link>
                </li>
                <li
                  className={
                    location.pathname === "/admin/appointment-analytics" ? "active" : ""
                  }
                >
                  <Link to="/admin/appointment-analytics">
                    <span className="admin-menu-icon">
                      <FaChartBar />
                    </span>
                    <span className="admin-menu-text">Analytics</span>
                  </Link>
                </li>
              </ul>
            </li>

            {/* KYC Management Group */}
            <li
              className={`menu-group ${expandedMenus.kycManagement ? "expanded" : ""
                } ${["/admin/kyc"].includes(
                  location.pathname
                )
                  ? "active-group"
                  : ""
                }`}
            >
              <div
                className="menu-group-header"
                onClick={() => toggleMenuExpand("kycManagement")}
              >
                <div className="menu-group-title">
                  <span className="admin-menu-icon">
                    <FaUserCheck />
                  </span>
                  <span className="admin-menu-text">KYC Management</span>
                </div>
                <div className="menu-expand-icon">
                  {expandedMenus.kycManagement ? "−" : "+"}
                </div>
              </div>
              <ul className="submenu">
                <li
                  className={
                    location.pathname === "/admin/kyc" ? "active" : ""
                  }
                >
                  <Link to="/admin/kyc">
                    <span className="admin-menu-icon">
                      <FaUserMd />
                    </span>
                    <span className="admin-menu-text">Doctors</span>
                  </Link>
                </li>
                {/* Future KYC items can be added here:
                <li className={location.pathname === '/admin/kyc/patients' ? 'active' : ''}>
                  <Link to="/admin/kyc/patients">
                    <span className="admin-menu-icon"><FaUsers /></span>
                    <span className="admin-menu-text">Patients</span>
                  </Link>
                </li>
                <li className={location.pathname === '/admin/kyc/organizations' ? 'active' : ''}>
                  <Link to="/admin/kyc/organizations">
                    <span className="admin-menu-icon"><FaHandshake /></span>
                    <span className="admin-menu-text">Organizations</span>
                  </Link>
                </li> */}
              </ul>
            </li>

            {/* Analytics & Reports Group */}
            <li
              className={`menu-group ${expandedMenus.analytics ? "expanded" : ""
                } ${["/admin/reports", "/admin/activity-logs"].includes(
                  location.pathname
                )
                  ? "active-group"
                  : ""
                }`}
            >
              <div
                className="menu-group-header"
                onClick={() => toggleMenuExpand("analytics")}
              >
                <div className="menu-group-title">
                  <span className="admin-menu-icon">
                    <FaChartBar />
                  </span>
                  <span className="admin-menu-text">Analytics & Reports</span>
                </div>
                <div className="menu-expand-icon">
                  {expandedMenus.analytics ? "−" : "+"}
                </div>
              </div>
              <ul className="submenu">
                <li
                  className={
                    location.pathname === "/admin/reports" ? "active" : ""
                  }
                >
                  <Link to="/admin/reports">
                    <span className="admin-menu-icon">
                      <FaChartBar />
                    </span>
                    <span className="admin-menu-text">Reports & Feedbacks</span>
                  </Link>
                </li>
                <li
                  className={
                    location.pathname === "/admin/activity-logs" ? "active" : ""
                  }
                >
                  <Link to="/admin/activity-logs">
                    <span className="admin-menu-icon">
                      <FaHistory />
                    </span>
                    <span className="admin-menu-text">Activity Logs</span>
                  </Link>
                </li>
              </ul>
            </li>

            {/* App Management Group */}
            <li
              className={`menu-group ${expandedMenus.appManagement ? "expanded" : ""
                } ${["/admin/doctor-app-content"].includes(
                  location.pathname
                )
                  ? "active-group"
                  : ""
                }`}
            >
              <div
                className="menu-group-header"
                onClick={() => toggleMenuExpand("appManagement")}
              >
                <div className="menu-group-title">
                  <span className="admin-menu-icon">
                    <FaMobile />
                  </span>
                  <span className="admin-menu-text">App Management</span>
                </div>
                <div className="menu-expand-icon">
                  {expandedMenus.appManagement ? "−" : "+"}
                </div>
              </div>
              <ul className="submenu">
                <li
                  className={
                    location.pathname === "/admin/doctor-app-content" ? "active" : ""
                  }
                >
                  <Link to="/admin/doctor-app-content">
                    <span className="admin-menu-icon">
                      <FaUserMd />
                    </span>
                    <span className="admin-menu-text">Doctor App</span>
                  </Link>
                </li>
                {/* Future App Management items can be added here:
                <li className={location.pathname === '/admin/app-management/patients' ? 'active' : ''}>
                  <Link to="/admin/app-management/patients">
                    <span className="admin-menu-icon"><FaUsers /></span>
                    <span className="admin-menu-text">Patients</span>
                  </Link>
                </li> */}
              </ul>
            </li>

            {/* Content Management Group */}
            <li
              className={`menu-group ${expandedMenus.contentManagement ? "expanded" : ""
                } ${["/admin/content", "/admin/notifications"].includes(
                  location.pathname
                )
                  ? "active-group"
                  : ""
                }`}
            >
              <div
                className="menu-group-header"
                onClick={() => toggleMenuExpand("contentManagement")}
              >
                <div className="menu-group-title">
                  <span className="admin-menu-icon">
                    <FaFileAlt />
                  </span>
                  <span className="admin-menu-text">Website Management</span>
                </div>
                <div className="menu-expand-icon">
                  {expandedMenus.contentManagement ? "−" : "+"}
                </div>
              </div>
              <ul className="submenu">
                <li
                  className={
                    location.pathname === "/admin/content" ? "active" : ""
                  }
                >
                  <Link to="/admin/content">
                    <span className="admin-menu-icon">
                      <FaFileAlt />
                    </span>
                    <span className="admin-menu-text">Content</span>
                  </Link>
                </li>
              </ul>
            </li>
            {/* System Management Group */}
            <li
              className={`menu-group ${expandedMenus.systemManagement ? "expanded" : ""
                } ${["/admin/websocket"].includes(
                  location.pathname
                )
                  ? "active-group"
                  : ""
                }`}
            >
              <div
                className="menu-group-header"
                onClick={() => toggleMenuExpand("systemManagement")}
              >
                <div className="menu-group-title">
                  <span className="admin-menu-icon">
                    <FaFileAlt />
                  </span>
                  <span className="admin-menu-text">System Management</span>
                </div>
                <div className="menu-expand-icon">
                  {expandedMenus.systemManagement ? "−" : "+"}
                </div>
              </div>
              <ul className="submenu">
                <li
                  className={
                    location.pathname === "/admin/websocket" ? "active" : ""
                  }
                >
                  <Link to="/admin/websocket">
                    <span className="admin-menu-icon">
                      <FaFileAlt />
                    </span>
                    <span className="admin-menu-text">webSocket</span>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Settings */}
            <li
              className={
                location.pathname === "/admin/settings" ? "active" : ""
              }
            >
              <Link to="/admin/settings">
                <span className="admin-menu-icon">
                  <FaCog />
                </span>
                <span className="admin-menu-text">Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`admin-main-content ${sidebarCollapsed ? "expanded" : ""}`}
      >
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

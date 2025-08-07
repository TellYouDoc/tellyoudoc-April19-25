import { useState, useEffect, useRef } from "react";
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
  FaTerminal,
  FaDatabase,
  FaServer,
  FaChartLine,
} from "react-icons/fa";
import tellyouDocLogo from "../assets/tellyoudoc.png";
import { apiService } from "../services/api.jsx";
import "../styles/Administrator/AdminLayout.css";

// Menu configuration data structure
const menuConfig = [
  {
    type: "single",
    path: "/admin/dashboard",
    icon: FaTachometerAlt,
    text: "Dashboard"
  },
  {
    type: "group",
    key: "userManagement",
    title: "User Management",
    icon: FaUsers,
    paths: ["/admin/administrators", "/admin/patients", "/admin/doctors"],
    items: [
      {
        path: "/admin/administrators",
        icon: FaUserShield,
        text: "Administrators"
      },
      {
        path: "/admin/doctors",
        icon: FaUserMd,
        text: "Doctors"
      },
      {
        path: "/admin/patients",
        icon: FaUsers,
        text: "Patients"
      }
    ]
  },
  {
    type: "group",
    key: "appointmentManagement",
    title: "Manage Appointments",
    icon: FaCalendarAlt,
    paths: ["/admin/appointments", "/admin/appointment-analytics"],
    items: [
      {
        path: "/admin/appointments",
        icon: FaCalendarAlt,
        text: "Appointments"
      },
      {
        path: "/admin/appointment-analytics",
        icon: FaChartBar,
        text: "Analytics"
      }
    ]
  },
  {
    type: "group",
    key: "kycManagement",
    title: "KYC Management",
    icon: FaUserCheck,
    paths: ["/admin/kyc"],
    items: [
      {
        path: "/admin/kyc",
        icon: FaUserMd,
        text: "Doctors"
      }
    ]
  },
  {
    type: "group",
    key: "feedbackManagement",
    title: "Feedback Management",
    icon: FaChartBar,
    paths: ["/admin/doctor-feedbacks", "/admin/patient-feedbacks"],
    items: [
      {
        path: "/admin/doctor-feedbacks",
        icon: FaUserMd,
        text: "Doctor Feedbacks"
      },
      {
        path: "/admin/patient-feedbacks",
        icon: FaUsers,
        text: "Patient Feedbacks"
      }
    ]
  },
  {
    type: "group",
    key: "appManagement",
    title: "App Management",
    icon: FaMobile,
    paths: ["/admin/doctor-app-content", "/admin/notifications"],
    items: [
      {
        path: "/admin/doctor-app-content",
        icon: FaUserMd,
        text: "Doctor App"
      },
      {
        path: "/admin/notifications",
        icon: FaBell,
        text: "Notifications"
      }
    ]
  },
  {
    type: "group",
    key: "contentManagement",
    title: "Website Management",
    icon: FaFileAlt,
    paths: ["/admin/content"],
    items: [
      {
        path: "/admin/content",
        icon: FaFileAlt,
        text: "Content"
      }
    ]
  },
  {
    type: "group",
    key: "systemManagement",
    title: "System Management",
    icon: FaFileAlt,
    paths: ["/admin/websocket", "/admin/activity-logs"],
    items: [
      {
        path: "/admin/websocket",
        icon: FaFileAlt,
        text: "WebSocket"
      },
      {
        path: "/admin/activity-logs",
        icon: FaHistory,
        text: "Activity Logs"
      },
      {
        path: "http://13.203.147.24:8001/",
        icon: FaDatabase,
        text: "Redis Cache Dashboard",
        external: true
      },
      {
        path: "http://13.203.147.24:3001",
        icon: FaServer,
        text: "Queue Dashboard",
        external: true
      },
      {
        path: "http://13.203.147.24:3002",
        icon: FaChartLine,
        text: "Grafana Dashboard",
        external: true
      }
    ]
  },
  {
    type: "single",
    path: "/admin/settings",
    icon: FaCog,
    text: "Settings"
  }
];

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({
    userManagement: false,
    contentManagement: false,
    feedbackManagement: false,
    appointmentManagement: false,
    kycManagement: false,
    appManagement: false,
    systemManagement: false,
  });
  const [showTerminal, setShowTerminal] = useState(false); // Add state for terminal modal
  const [terminalPosition, setTerminalPosition] = useState({ x: 0, y: 0 });
  const [terminalSize, setTerminalSize] = useState({ width: 900, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);
  const [terminalState, setTerminalState] = useState({
    commandHistory: [],
    output: "",
    error: ""
  });
  const [terminalCommandTab, setTerminalCommandTab] = useState(null); // null | 'windows' | 'linux' | 'git'

  // Function to reset terminal state
  const resetTerminalState = () => {
    setTerminalState({
      commandHistory: [],
      output: "",
      error: ""
    });
    setTerminalCommandTab(null);
    // Reset terminal position and size to defaults
    setTerminalPosition({ x: 0, y: 0 });
    setTerminalSize({ width: 900, height: 600 });
    // Reset terminal minimized state
    setIsTerminalMinimized(false);
  };

  // Add event listener for terminal close
  useEffect(() => {
    const handleCloseTerminal = () => {
      // Reset everything when closing via exit command
      resetTerminalState();
      setShowTerminal(false);
    };

    window.addEventListener('closeTerminal', handleCloseTerminal);
    return () => {
      window.removeEventListener('closeTerminal', handleCloseTerminal);
    };
  }, []);

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('adminRecentSearches');
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches));
      } catch (error) {
        console.error('Error parsing recent searches:', error);
        setRecentSearches([]);
      }
    }
  }, []);

  // Auto-expand menu groups based on current location
  useEffect(() => {
    const currentPath = location.pathname;

    // Auto-expand System Management when WebSocket or Activity Logs page is active
    if (currentPath === "/admin/websocket" || currentPath === "/admin/activity-logs") {
      setExpandedMenus(prev => ({
        ...prev,
        systemManagement: true
      }));
    }

    // Auto-expand Feedback Management when feedback pages are active
    if (currentPath === "/admin/doctor-feedbacks" || currentPath === "/admin/patient-feedbacks") {
      setExpandedMenus(prev => ({
        ...prev,
        feedbackManagement: true
      }));
    }
  }, [location.pathname]);

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

  // Function to save search to recent searches
  const saveSearchToHistory = (query) => {
    if (query.trim()) {
      const newSearch = query.trim();
      setRecentSearches(prevSearches => {
        const filteredSearches = prevSearches.filter(search => search !== newSearch);
        const updatedSearches = [newSearch, ...filteredSearches].slice(0, 5); // Keep only 5 most recent
        localStorage.setItem('adminRecentSearches', JSON.stringify(updatedSearches));
        return updatedSearches;
      });
    }
  };

  const handleGlobalSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setShowRecentSearches(false);
      return;
    }

    const searchableItems = [
      {
        type: "Dashboard",
        items: [
          { title: "Admin Dashboard", path: "/admin/dashboard" },
        ],
      },
      {
        type: "User Management",
        items: [
          { title: "Administrators", path: "/admin/administrators" },
          { title: "Doctors", path: "/admin/doctors" },
          { title: "Patients", path: "/admin/patients" },
        ],
      },
      {
        type: "Appointments & Reports",
        items: [
          { title: "Appointments", path: "/admin/appointments" },
          { title: "Analytics", path: "/admin/appointment-analytics" },
          { title: "Reports", path: "/admin/reports" },
        ],
      },
      {
        type: "Feedback Management",
        items: [
          { title: "Doctor Feedbacks", path: "/admin/doctor-feedbacks" },
          { title: "Patient Feedbacks", path: "/admin/patient-feedbacks" }
        ],
      },
      {
        type: "Content Management",
        items: [
          { title: "Content", path: "/admin/content" },
          { title: "Terms & Conditions", path: "/admin/terms-conditions" },
          { title: "FAQs", path: "/admin/faqs" },
          { title: "Privacy Policy", path: "/admin/privacy-policy" },
          { title: "Doctor App Content", path: "/admin/doctor-app-content" },
        ],
      },
      {
        type: "System Management",
        items: [
          { title: "Settings", path: "/admin/settings" },
          { title: "Activity Logs", path: "/admin/activity-logs" },
          { title: "WebSocket", path: "/admin/websocket" },
        ],
      },
      {
        type: "Verification & Subscriptions",
        items: [
          { title: "KYC Management", path: "/admin/kyc" },
          { title: "Specializations", path: "/admin/specializations" },
        ],
      },
      {
        type: "Notifications",
        items: [
          { title: "Notifications", path: "/admin/notifications" },
        ],
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
    const feedbackManagementPaths = ['/admin/doctor-feedbacks', '/admin/patient-feedbacks'];
    const contentManagementPaths = ['/admin/content', '/admin/notifications'];
    const appointmentManagementPaths = ['/admin/appointments', '/admin/appointment-analytics'];
    const kycManagementPaths = ['/admin/kyc'];
    const appManagementPaths = ['/admin/doctor-app-content', '/admin/notifications'];

    setExpandedMenus({
      userManagement: userManagementPaths.includes(path),
      feedbackManagement: feedbackManagementPaths.includes(path),
      contentManagement: contentManagementPaths.includes(path),
      appointmentManagement: appointmentManagementPaths.includes(path),
      kycManagement: kycManagementPaths.includes(path),
      appManagement: appManagementPaths.includes(path),
      systemManagement: path === "/admin/websocket" || path === "/admin/activity-logs" || path === "/admin/redis-cache" || path === "/admin/queue-dashboard" || path === "/admin/grafana-dashboard", // Auto-expand System Management when any system management page is active
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
    // Clear other admin-related data
    localStorage.removeItem("adminData");
    localStorage.removeItem("AccessToken");
    localStorage.removeItem("RefreshToken");

    // Clear cookies
    document.cookie = "AccessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict";
    document.cookie = "RefreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict";

    // Force a page reload to update the authentication state
    window.location.href = "/admin";
  };

  const centerTerminal = () => {
    const x = (window.innerWidth - terminalSize.width) / 2;
    const y = (window.innerHeight - terminalSize.height) / 2;
    setTerminalPosition({ x, y });
  };

  const toggleTerminalMinimize = () => {
    if (isTerminalMinimized) {
      // Restore terminal
      setIsTerminalMinimized(false);
      setShowTerminal(true);
    } else {
      // Minimize terminal - hide it completely
      setIsTerminalMinimized(true);
      setShowTerminal(false);
    }
  };

  // Terminal drag and resize functions
  const handleMouseDown = (e, type) => {
    e.preventDefault();
    if (type === 'drag') {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - terminalPosition.x,
        y: e.clientY - terminalPosition.y
      });
    } else if (type === 'resize') {
      setIsResizing(true);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: terminalSize.width,
        height: terminalSize.height
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Keep modal within viewport bounds
      const maxX = window.innerWidth - terminalSize.width;
      const maxY = window.innerHeight - terminalSize.height;

      setTerminalPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;

      const newWidth = Math.max(400, Math.min(90 * window.innerWidth / 100, resizeStart.width + deltaX));
      const newHeight = Math.max(300, Math.min(90 * window.innerHeight / 100, resizeStart.height + deltaY));

      setTerminalSize({
        width: newWidth,
        height: newHeight
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  // Add event listeners for mouse move and up
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, terminalPosition, terminalSize]);

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
              placeholder="Search any pages in admin panel"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => handleGlobalSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  saveSearchToHistory(searchQuery);
                }
              }}
              onFocus={() => {
                if (!searchQuery.trim() && recentSearches.length > 0) {
                  setShowRecentSearches(true);
                }
              }}
              onBlur={() => {
                // Save search when user finishes typing and leaves the input
                if (searchQuery.trim()) {
                  saveSearchToHistory(searchQuery);
                }
                // Delay hiding recent searches to allow clicking on them
                setTimeout(() => setShowRecentSearches(false), 200);
              }}
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
                          saveSearchToHistory(searchQuery);
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
            {showRecentSearches && !searchQuery && recentSearches.length > 0 && (
              <div className="search-results-dropdown recent-searches">
                <div className="search-category">
                  <div className="category-title">Recent Searches</div>
                  {recentSearches.map((search, idx) => (
                    <div
                      key={idx}
                      className="search-result-item recent-search-item"
                      onClick={() => {
                        setSearchQuery(search);
                        handleGlobalSearch(search);
                        setShowRecentSearches(false);
                      }}
                    >
                      <FaHistory className="recent-search-icon" />
                      {search}
                    </div>
                  ))}
                  <div
                    className="search-result-item clear-recent"
                    onClick={() => {
                      setRecentSearches([]);
                      localStorage.removeItem('adminRecentSearches');
                      setShowRecentSearches(false);
                    }}
                  >
                    Clear Recent Searches
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="admin-navbar-right">
          {/* Notification icon */}
          {/* <div className="admin-notification-icon">
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
          </div> */}

          {/* Terminal icon */}
          <div className="admin-terminal-icon">
            <div
              onClick={() => {
                if (isTerminalMinimized) {
                  // Restore minimized terminal
                  setIsTerminalMinimized(false);
                  setShowTerminal(true);
                } else {
                  // Open new terminal
                  centerTerminal();
                  setShowTerminal(true);
                }
              }}
              className="admin-terminal-icon-button"
              title="Open Terminal"
            >
              <FaTerminal size={18} />
            </div>
          </div>

          <button className="admin-logout-button-nav" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Terminal Modal */}
      {showTerminal && (
        <div
          className={`admin-terminal-modal ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''} ${isTerminalMinimized ? 'minimized' : ''}`}
          style={{
            left: terminalPosition.x,
            top: terminalPosition.y,
            width: terminalSize.width,
            height: isTerminalMinimized ? 50 : terminalSize.height
          }}
        >
          <div
            className="admin-terminal-header"
            onMouseDown={(e) => handleMouseDown(e, 'drag')}
          >
            <div className="admin-terminal-title">
              <FaTerminal size={16} />
              <span>Admin Terminal</span>
            </div>
            <div className="admin-terminal-toggles">
              <button
                className={`admin-terminal-toggle-btn${terminalCommandTab === 'windows' ? ' active' : ''}`}
                onClick={() => setTerminalCommandTab(terminalCommandTab === 'windows' ? null : 'windows')}
                title="Windows Commands"
              >
                <i className="fab fa-windows"></i>
              </button>
              <button
                className={`admin-terminal-toggle-btn${terminalCommandTab === 'linux' ? ' active' : ''}`}
                onClick={() => setTerminalCommandTab(terminalCommandTab === 'linux' ? null : 'linux')}
                title="Linux Commands"
              >
                <i className="fab fa-linux"></i>
              </button>
              <button
                className={`admin-terminal-toggle-btn${terminalCommandTab === 'git' ? ' active' : ''}`}
                onClick={() => setTerminalCommandTab(terminalCommandTab === 'git' ? null : 'git')}
                title="Git Commands"
              >
                <i className="fab fa-git-alt"></i>
              </button>
            </div>
            <div className="admin-terminal-controls">
              <button
                className="admin-terminal-minimize"
                onClick={toggleTerminalMinimize}
                aria-label="Minimize terminal"
              >
                {isTerminalMinimized ? '□' : '−'}
              </button>
              <button
                className="admin-terminal-close"
                onClick={() => {
                  // Reset everything in the Terminal Modal before closing
                  resetTerminalState();
                  setShowTerminal(false);
                }}
                aria-label="Close terminal"
              >
                ×
              </button>
            </div>
          </div>

          {!isTerminalMinimized && (
            <>
              {/* Only keep the bottom right (se) resize handle */}
              <div
                className="admin-terminal-resize-handle se"
                onMouseDown={(e) => handleMouseDown(e, 'resize')}
              />
              <TerminalContent
                initialState={terminalState}
                onStateChange={(newState) => setTerminalState(newState)}
                commandTab={terminalCommandTab}
                onReset={resetTerminalState}
              />
            </>
          )}
        </div>
      )}

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
            {menuConfig.map((item) => {
              if (item.type === "single") {
                return (
                  <li
                    key={item.path}
                    className={location.pathname === item.path ? "active" : ""}
                  >
                    <Link to={item.path}>
                      <span className="admin-menu-icon">
                        <item.icon />
                      </span>
                      <span className="admin-menu-text">{item.text}</span>
                    </Link>
                  </li>
                );
              } else if (item.type === "group") {
                return (
                  <li
                    key={item.key}
                    className={`menu-group ${expandedMenus[item.key] ? "expanded" : ""
                      } ${item.paths.some(path => location.pathname.startsWith(path))
                        ? "active-group"
                        : ""
                      }`}
                  >
                    <div
                      className="menu-group-header"
                      onClick={() => toggleMenuExpand(item.key)}
                    >
                      <div className="menu-group-title">
                        <span className="admin-menu-icon">
                          <item.icon />
                        </span>
                        <span className="admin-menu-text">{item.title}</span>
                      </div>
                      <div className="menu-expand-icon">
                        {expandedMenus[item.key] ? "−" : "+"}
                      </div>
                    </div>
                    <ul className="submenu">
                      {item.items.map((subItem) => (
                        <li
                          key={subItem.path}
                          className={location.pathname === subItem.path ? "active" : ""}
                        >
                          {subItem.external ? (
                            <a href={subItem.path} target="_blank" rel="noopener noreferrer">
                              <span className="admin-menu-icon">
                                <subItem.icon />
                              </span>
                              <span className="admin-menu-text">{subItem.text}</span>
                            </a>
                          ) : (
                            <Link to={subItem.path}>
                              <span className="admin-menu-icon">
                                <subItem.icon />
                              </span>
                              <span className="admin-menu-text">{subItem.text}</span>
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }
              return null;
            })}
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

function TerminalContent({ onStateChange, initialState, commandTab, onReset }) {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState(initialState?.output || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialState?.error || "");
  const [commandHistory, setCommandHistory] = useState(initialState?.commandHistory || []);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [osAlert, setOsAlert] = useState(null);
  const inputRef = useRef(null);

  // Detect operating system
  const detectOS = () => {
    const platform = navigator.platform.toLowerCase();
    if (platform.includes('win')) return 'windows';
    if (platform.includes('mac')) return 'macos';
    if (platform.includes('linux')) return 'linux';
    return 'unknown';
  };

  const currentOS = detectOS();

  // Update parent state when terminal state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange({
        commandHistory,
        output,
        error
      });
    }
  }, [commandHistory, output, error, onStateChange]);

  // Maintain focus on input field
  useEffect(() => {
    if (inputRef.current && !loading) {
      inputRef.current.focus();
    }
  }, [loading]);

  // Validate command compatibility with current OS
  const validateCommandOS = (cmd) => {
    const lowerCmd = cmd.toLowerCase().trim();

    // Windows-specific commands
    const windowsCommands = [
      'dir', 'cls', 'ipconfig', 'tasklist', 'taskkill', 'systeminfo', 'ver', 'hostname',
      'whoami', 'netstat', 'ping', 'tracert', 'nslookup', 'copy', 'move', 'del', 'rmdir',
      'mkdir', 'type', 'findstr', 'tree', 'chkdsk', 'sfc', 'dism', 'shutdown', 'reg',
      'sc', 'net', 'gpupdate', 'gpresult', 'wmic', 'cd'
    ];

    // Linux/macOS-specific commands
    const linuxCommands = [
      'ls', 'clear', 'pwd', 'cd', 'mkdir', 'rmdir', 'rm', 'cp', 'mv', 'touch', 'cat',
      'head', 'tail', 'less', 'more', 'nano', 'vim', 'grep', 'find', 'which', 'whereis',
      'df', 'du', 'free', 'top', 'htop', 'ps', 'kill', 'pkill', 'killall', 'uname',
      'lscpu', 'lshw', 'lsblk', 'fdisk', 'mount', 'ifconfig', 'ip', 'ss', 'traceroute',
      'dig', 'wget', 'curl', 'scp', 'rsync', 'tar', 'zip', 'unzip', 'chmod', 'chown',
      'sudo', 'su', 'who', 'id', 'groups', 'passwd', 'systemctl', 'journalctl', 'dmesg',
      'uptime', 'date', 'cal', 'history', 'alias', 'export', 'env', 'source', 'crontab',
      'at', 'reboot', 'poweroff'
    ];



    // Check if command is Windows-specific
    if (windowsCommands.some(winCmd => lowerCmd.startsWith(winCmd))) {
      if (currentOS !== 'windows') {
        return {
          valid: false,
          message: `⚠️ This is a Windows command. You're running on ${currentOS}. This command may not work as expected.`,
          type: 'warning'
        };
      }
    }

    // Check if command is Linux/macOS-specific
    if (linuxCommands.some(linuxCmd => lowerCmd.startsWith(linuxCmd))) {
      if (currentOS === 'windows') {
        return {
          valid: false,
          message: `⚠️ This is a Linux/macOS command. You're running on Windows. This command may not work as expected.`,
          type: 'warning'
        };
      }
    }

    return { valid: true };
  };

  // Handle local commands that don't need server execution
  const handleLocalCommand = (cmd) => {
    const lowerCmd = cmd.toLowerCase().trim();

    switch (lowerCmd) {
      case 'cls':
      case 'clear':
        setOutput("");
        setError("");
        setCommandHistory([]);
        setCommand("");
        return true;
      case 'exit':
        // Reset everything and close the terminal modal
        if (onReset) {
          onReset();
        }
        setCommand("");
        window.dispatchEvent(new CustomEvent('closeTerminal'));
        return true;
      default:
        return false;
    }
  };

  const executeCommand = async (cmd) => {
    setLoading(true);
    setError("");
    setOutput("");
    setOsAlert(null);

    // Validate command OS compatibility
    const validation = validateCommandOS(cmd);
    if (!validation.valid) {
      setOsAlert({
        message: validation.message,
        type: validation.type
      });
      // Still execute the command but show warning
    }

    // Add command to history
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);

    // Check if it's a local command first
    if (handleLocalCommand(cmd)) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.AdministratorService.executeCommand(cmd, 30000);
      setOutput(response.data.output || "Command executed successfully.");
    } catch (error) {
      setError(error.response?.data?.error || error.message || "Failed to execute command.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (command.trim()) {
      executeCommand(command);
      setCommand("");
      // Maintain focus on the input field after command execution
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand("");
      }
    }
  };

  // Command lists for each tab
  const windowsCommands = [
    { cmd: 'dir', desc: 'List directory contents' },
    { cmd: 'dir /w', desc: 'List directory contents in wide format' },
    { cmd: 'dir /s', desc: 'List directory contents including subdirectories' },
    { cmd: 'dir /a', desc: 'List all files including hidden ones' },
    { cmd: 'cls', desc: 'Clear the terminal screen' },
    { cmd: 'ipconfig', desc: 'Show IP configuration' },
    { cmd: 'ipconfig /all', desc: 'Show detailed IP configuration' },
    { cmd: 'ipconfig /release', desc: 'Release IP address' },
    { cmd: 'ipconfig /renew', desc: 'Renew IP address' },
    { cmd: 'tasklist', desc: 'List running processes' },
    { cmd: 'tasklist /v', desc: 'List processes with verbose information' },
    { cmd: 'tasklist /fi "imagename eq chrome.exe"', desc: 'List specific process' },
    { cmd: 'taskkill /im chrome.exe', desc: 'Kill process by name' },
    { cmd: 'taskkill /pid 1234', desc: 'Kill process by PID' },
    { cmd: 'systeminfo', desc: 'Show system information' },
    { cmd: 'ver', desc: 'Show Windows version' },
    { cmd: 'hostname', desc: 'Show computer name' },
    { cmd: 'whoami', desc: 'Show current user' },
    { cmd: 'netstat -an', desc: 'Show network connections' },
    { cmd: 'netstat -an | findstr :80', desc: 'Show connections on port 80' },
    { cmd: 'ping google.com', desc: 'Ping a host' },
    { cmd: 'tracert google.com', desc: 'Trace route to host' },
    { cmd: 'nslookup google.com', desc: 'DNS lookup' },
    { cmd: 'cd', desc: 'Change directory' },
    { cmd: 'cd ..', desc: 'Go to parent directory' },
    { cmd: 'cd /d C:\\', desc: 'Change drive and directory' },
    { cmd: 'copy file1.txt file2.txt', desc: 'Copy file' },
    { cmd: 'move file1.txt folder\\', desc: 'Move file' },
    { cmd: 'del file.txt', desc: 'Delete file' },
    { cmd: 'rmdir folder', desc: 'Remove directory' },
    { cmd: 'mkdir folder', desc: 'Create directory' },
    { cmd: 'type file.txt', desc: 'Display file contents' },
    { cmd: 'findstr "text" file.txt', desc: 'Search text in file' },
    { cmd: 'tree', desc: 'Show directory tree' },
    { cmd: 'tree /f', desc: 'Show directory tree with files' },
    { cmd: 'chkdsk', desc: 'Check disk for errors' },
    { cmd: 'sfc /scannow', desc: 'System file checker' },
    { cmd: 'dism /online /cleanup-image /restorehealth', desc: 'DISM repair' },
    { cmd: 'wmic cpu get name', desc: 'Get CPU information' },
    { cmd: 'wmic memorychip get capacity', desc: 'Get RAM information' },
    { cmd: 'wmic diskdrive get size', desc: 'Get disk size information' },
    { cmd: 'shutdown /s /t 0', desc: 'Shutdown computer' },
    { cmd: 'shutdown /r /t 0', desc: 'Restart computer' },
    { cmd: 'shutdown /a', desc: 'Abort shutdown' },
    { cmd: 'reg query "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion"', desc: 'Query registry' },
    { cmd: 'sc query', desc: 'List Windows services' },
    { cmd: 'sc start servicename', desc: 'Start a service' },
    { cmd: 'sc stop servicename', desc: 'Stop a service' },
    { cmd: 'net user', desc: 'List users' },
    { cmd: 'net localgroup administrators', desc: 'List administrators' },
    { cmd: 'gpupdate /force', desc: 'Force group policy update' },
    { cmd: 'gpresult /r', desc: 'Show group policy results' },
  ];
  const linuxCommands = [
    { cmd: 'ls -la', desc: 'List directory contents (detailed)' },
    { cmd: 'ls -lh', desc: 'List with human-readable file sizes' },
    { cmd: 'ls -R', desc: 'List recursively (include subdirectories)' },
    { cmd: 'ls -t', desc: 'List sorted by modification time' },
    { cmd: 'ls -S', desc: 'List sorted by file size' },
    { cmd: 'clear', desc: 'Clear the terminal screen' },
    { cmd: 'pwd', desc: 'Print working directory' },
    { cmd: 'cd', desc: 'Change directory' },
    { cmd: 'cd ..', desc: 'Go to parent directory' },
    { cmd: 'cd ~', desc: 'Go to home directory' },
    { cmd: 'cd /', desc: 'Go to root directory' },
    { cmd: 'mkdir folder', desc: 'Create directory' },
    { cmd: 'rmdir folder', desc: 'Remove empty directory' },
    { cmd: 'rm -rf folder', desc: 'Remove directory and contents' },
    { cmd: 'cp file1.txt file2.txt', desc: 'Copy file' },
    { cmd: 'cp -r folder1 folder2', desc: 'Copy directory recursively' },
    { cmd: 'mv file1.txt file2.txt', desc: 'Move/rename file' },
    { cmd: 'rm file.txt', desc: 'Remove file' },
    { cmd: 'touch file.txt', desc: 'Create empty file' },
    { cmd: 'cat file.txt', desc: 'Display file contents' },
    { cmd: 'head -10 file.txt', desc: 'Show first 10 lines' },
    { cmd: 'tail -10 file.txt', desc: 'Show last 10 lines' },
    { cmd: 'tail -f file.txt', desc: 'Follow file in real-time' },
    { cmd: 'less file.txt', desc: 'View file with pagination' },
    { cmd: 'more file.txt', desc: 'View file with pagination' },
    { cmd: 'nano file.txt', desc: 'Edit file with nano' },
    { cmd: 'vim file.txt', desc: 'Edit file with vim' },
    { cmd: 'grep "text" file.txt', desc: 'Search text in file' },
    { cmd: 'grep -r "text" .', desc: 'Search text recursively' },
    { cmd: 'find . -name "*.txt"', desc: 'Find files by name' },
    { cmd: 'find . -type f -mtime -7', desc: 'Find files modified in last 7 days' },
    { cmd: 'which command', desc: 'Show path of command' },
    { cmd: 'whereis command', desc: 'Show location of command' },
    { cmd: 'df -h', desc: 'Show disk space usage' },
    { cmd: 'du -h folder', desc: 'Show directory size' },
    { cmd: 'du -sh *', desc: 'Show sizes of all items in current directory' },
    { cmd: 'free -m', desc: 'Show memory usage' },
    { cmd: 'free -h', desc: 'Show memory usage in human-readable format' },
    { cmd: 'top', desc: 'Show system processes (interactive)' },
    { cmd: 'htop', desc: 'Enhanced system monitor' },
    { cmd: 'ps aux', desc: 'List running processes' },
    { cmd: 'ps aux | grep process', desc: 'Find specific process' },
    { cmd: 'kill -9 1234', desc: 'Kill process by PID' },
    { cmd: 'pkill processname', desc: 'Kill process by name' },
    { cmd: 'killall processname', desc: 'Kill all processes by name' },
    { cmd: 'uname -a', desc: 'Show system information' },
    { cmd: 'uname -r', desc: 'Show kernel version' },
    { cmd: 'cat /etc/os-release', desc: 'Show OS information' },
    { cmd: 'lscpu', desc: 'Show CPU information' },
    { cmd: 'lshw', desc: 'Show hardware information' },
    { cmd: 'lsblk', desc: 'Show block devices' },
    { cmd: 'fdisk -l', desc: 'Show disk partitions' },
    { cmd: 'mount', desc: 'Show mounted filesystems' },
    { cmd: 'ifconfig', desc: 'Show network interfaces' },
    { cmd: 'ip addr', desc: 'Show IP addresses' },
    { cmd: 'ip route', desc: 'Show routing table' },
    { cmd: 'netstat -tuln', desc: 'Show listening ports' },
    { cmd: 'ss -tuln', desc: 'Show listening ports (modern)' },
    { cmd: 'ping google.com', desc: 'Ping a host' },
    { cmd: 'traceroute google.com', desc: 'Trace route to host' },
    { cmd: 'nslookup google.com', desc: 'DNS lookup' },
    { cmd: 'dig google.com', desc: 'DNS lookup (detailed)' },
    { cmd: 'wget url', desc: 'Download file from URL' },
    { cmd: 'curl url', desc: 'Download file or make HTTP request' },
    { cmd: 'scp file.txt user@host:/path', desc: 'Copy file over SSH' },
    { cmd: 'rsync -av folder1/ folder2/', desc: 'Sync directories' },
    { cmd: 'tar -czf archive.tar.gz folder', desc: 'Create tar archive' },
    { cmd: 'tar -xzf archive.tar.gz', desc: 'Extract tar archive' },
    { cmd: 'zip -r archive.zip folder', desc: 'Create zip archive' },
    { cmd: 'unzip archive.zip', desc: 'Extract zip archive' },
    { cmd: 'chmod 755 file.txt', desc: 'Change file permissions' },
    { cmd: 'chown user:group file.txt', desc: 'Change file ownership' },
    { cmd: 'sudo command', desc: 'Run command as superuser' },
    { cmd: 'su -', desc: 'Switch to root user' },
    { cmd: 'who', desc: 'Show logged in users' },
    { cmd: 'whoami', desc: 'Show current user' },
    { cmd: 'id', desc: 'Show user and group IDs' },
    { cmd: 'groups', desc: 'Show user groups' },
    { cmd: 'passwd', desc: 'Change password' },
    { cmd: 'systemctl status servicename', desc: 'Show service status' },
    { cmd: 'systemctl start servicename', desc: 'Start service' },
    { cmd: 'systemctl stop servicename', desc: 'Stop service' },
    { cmd: 'systemctl restart servicename', desc: 'Restart service' },
    { cmd: 'systemctl enable servicename', desc: 'Enable service at boot' },
    { cmd: 'journalctl -u servicename', desc: 'Show service logs' },
    { cmd: 'journalctl -f', desc: 'Follow system logs' },
    { cmd: 'dmesg', desc: 'Show kernel messages' },
    { cmd: 'uptime', desc: 'Show system uptime' },
    { cmd: 'date', desc: 'Show current date and time' },
    { cmd: 'cal', desc: 'Show calendar' },
    { cmd: 'history', desc: 'Show command history' },
    { cmd: 'history | grep command', desc: 'Search command history' },
    { cmd: 'alias', desc: 'Show command aliases' },
    { cmd: 'alias ll="ls -la"', desc: 'Create command alias' },
    { cmd: 'export VAR=value', desc: 'Set environment variable' },
    { cmd: 'echo $VAR', desc: 'Show environment variable' },
    { cmd: 'env', desc: 'Show all environment variables' },
    { cmd: 'source ~/.bashrc', desc: 'Reload shell configuration' },
    { cmd: 'crontab -l', desc: 'Show cron jobs' },
    { cmd: 'crontab -e', desc: 'Edit cron jobs' },
    { cmd: 'at 14:30', desc: 'Schedule one-time job' },
    { cmd: 'atq', desc: 'Show scheduled jobs' },
    { cmd: 'shutdown -h now', desc: 'Shutdown system' },
    { cmd: 'reboot', desc: 'Reboot system' },
    { cmd: 'poweroff', desc: 'Power off system' },
  ];
  const gitCommands = [
    { cmd: 'git status', desc: 'Show working tree status' },
    { cmd: 'git status -s', desc: 'Show status in short format' },
    { cmd: 'git status --porcelain', desc: 'Show status in machine-readable format' },
    { cmd: 'git log', desc: 'Show commit logs' },
    { cmd: 'git log --oneline', desc: 'Show commit logs in one line' },
    { cmd: 'git log --graph --oneline --all', desc: 'Show commit graph' },
    { cmd: 'git log -p', desc: 'Show commit logs with patches' },
    { cmd: 'git log --since="2023-01-01"', desc: 'Show commits since date' },
    { cmd: 'git log --author="name"', desc: 'Show commits by author' },
    { cmd: 'git log --grep="keyword"', desc: 'Search commits by message' },
    { cmd: 'git show commit-hash', desc: 'Show specific commit details' },
    { cmd: 'git diff', desc: 'Show unstaged changes' },
    { cmd: 'git diff --staged', desc: 'Show staged changes' },
    { cmd: 'git diff HEAD~1', desc: 'Show changes in last commit' },
    { cmd: 'git diff branch1..branch2', desc: 'Show differences between branches' },
    { cmd: 'git add file.txt', desc: 'Stage specific file' },
    { cmd: 'git add .', desc: 'Stage all changes' },
    { cmd: 'git add -p', desc: 'Stage changes interactively' },
    { cmd: 'git reset file.txt', desc: 'Unstage specific file' },
    { cmd: 'git reset HEAD~1', desc: 'Undo last commit (keep changes)' },
    { cmd: 'git reset --hard HEAD~1', desc: 'Undo last commit (discard changes)' },
    { cmd: 'git commit -m "message"', desc: 'Commit staged changes' },
    { cmd: 'git commit -am "message"', desc: 'Stage and commit all tracked files' },
    { cmd: 'git commit --amend', desc: 'Amend last commit' },
    { cmd: 'git commit --amend --no-edit', desc: 'Amend last commit without changing message' },
    { cmd: 'git pull', desc: 'Fetch and merge from remote' },
    { cmd: 'git pull origin main', desc: 'Pull from specific remote and branch' },
    { cmd: 'git pull --rebase', desc: 'Pull with rebase instead of merge' },
    { cmd: 'git push', desc: 'Push local commits to remote' },
    { cmd: 'git push origin main', desc: 'Push to specific remote and branch' },
    { cmd: 'git push --force', desc: 'Force push (use with caution)' },
    { cmd: 'git push --force-with-lease', desc: 'Force push with safety check' },
    { cmd: 'git fetch', desc: 'Download objects from remote' },
    { cmd: 'git fetch --all', desc: 'Fetch from all remotes' },
    { cmd: 'git fetch origin', desc: 'Fetch from specific remote' },
    { cmd: 'git merge branch-name', desc: 'Merge branch into current branch' },
    { cmd: 'git merge --no-ff branch-name', desc: 'Merge with no fast-forward' },
    { cmd: 'git rebase branch-name', desc: 'Rebase current branch onto another' },
    { cmd: 'git rebase -i HEAD~3', desc: 'Interactive rebase of last 3 commits' },
    { cmd: 'git branch', desc: 'List branches' },
    { cmd: 'git branch -a', desc: 'List all branches (local and remote)' },
    { cmd: 'git branch -r', desc: 'List remote branches' },
    { cmd: 'git branch branch-name', desc: 'Create new branch' },
    { cmd: 'git branch -d branch-name', desc: 'Delete branch' },
    { cmd: 'git branch -D branch-name', desc: 'Force delete branch' },
    { cmd: 'git branch -m old-name new-name', desc: 'Rename branch' },
    { cmd: 'git checkout branch-name', desc: 'Switch to branch' },
    { cmd: 'git checkout -b branch-name', desc: 'Create and switch to new branch' },
    { cmd: 'git checkout -- file.txt', desc: 'Discard changes in file' },
    { cmd: 'git checkout HEAD~1 -- file.txt', desc: 'Restore file from previous commit' },
    { cmd: 'git switch branch-name', desc: 'Switch to branch (Git 2.23+)' },
    { cmd: 'git switch -c branch-name', desc: 'Create and switch to new branch (Git 2.23+)' },
    { cmd: 'git restore file.txt', desc: 'Restore file (Git 2.23+)' },
    { cmd: 'git restore --staged file.txt', desc: 'Unstage file (Git 2.23+)' },
    { cmd: 'git remote -v', desc: 'Show remote repositories' },
    { cmd: 'git remote add origin url', desc: 'Add remote repository' },
    { cmd: 'git remote remove origin', desc: 'Remove remote repository' },
    { cmd: 'git remote rename old new', desc: 'Rename remote' },
    { cmd: 'git remote set-url origin new-url', desc: 'Change remote URL' },
    { cmd: 'git clone url', desc: 'Clone repository' },
    { cmd: 'git clone -b branch-name url', desc: 'Clone specific branch' },
    { cmd: 'git clone --depth 1 url', desc: 'Shallow clone (latest commit only)' },
    { cmd: 'git init', desc: 'Initialize new repository' },
    { cmd: 'git config --global user.name "Name"', desc: 'Set global username' },
    { cmd: 'git config --global user.email "email"', desc: 'Set global email' },
    { cmd: 'git config --list', desc: 'Show all configuration' },
    { cmd: 'git config user.name', desc: 'Show local username' },
    { cmd: 'git tag', desc: 'List tags' },
    { cmd: 'git tag v1.0.0', desc: 'Create lightweight tag' },
    { cmd: 'git tag -a v1.0.0 -m "message"', desc: 'Create annotated tag' },
    { cmd: 'git tag -d v1.0.0', desc: 'Delete tag' },
    { cmd: 'git push origin --tags', desc: 'Push all tags' },
    { cmd: 'git stash', desc: 'Stash changes' },
    { cmd: 'git stash push -m "message"', desc: 'Stash with message' },
    { cmd: 'git stash list', desc: 'List stashes' },
    { cmd: 'git stash pop', desc: 'Apply and remove latest stash' },
    { cmd: 'git stash apply', desc: 'Apply latest stash (keep it)' },
    { cmd: 'git stash drop', desc: 'Remove latest stash' },
    { cmd: 'git stash clear', desc: 'Remove all stashes' },
    { cmd: 'git cherry-pick commit-hash', desc: 'Apply specific commit to current branch' },
    { cmd: 'git cherry-pick -x commit-hash', desc: 'Cherry-pick with reference to original commit' },
    { cmd: 'git revert commit-hash', desc: 'Create new commit that undoes changes' },
    { cmd: 'git bisect start', desc: 'Start binary search for bad commit' },
    { cmd: 'git bisect bad', desc: 'Mark current commit as bad' },
    { cmd: 'git bisect good commit-hash', desc: 'Mark commit as good' },
    { cmd: 'git bisect reset', desc: 'Exit bisect mode' },
    { cmd: 'git submodule add url path', desc: 'Add submodule' },
    { cmd: 'git submodule update --init --recursive', desc: 'Initialize and update submodules' },
    { cmd: 'git worktree add path branch', desc: 'Add worktree' },
    { cmd: 'git worktree list', desc: 'List worktrees' },
    { cmd: 'git blame file.txt', desc: 'Show who changed each line' },
    { cmd: 'git grep "text"', desc: 'Search text in repository' },
    { cmd: 'git log --follow file.txt', desc: 'Show history of file including renames' },
    { cmd: 'git reflog', desc: 'Show reference log' },
    { cmd: 'git gc', desc: 'Garbage collect repository' },
    { cmd: 'git fsck', desc: 'Check repository integrity' },
    { cmd: 'git archive --format=zip HEAD', desc: 'Create archive of repository' },
    { cmd: 'git describe --tags', desc: 'Describe current commit relative to tags' },
    { cmd: 'git shortlog', desc: 'Summarize git log output' },
    { cmd: 'git count-objects -v', desc: 'Count objects and show disk usage' },
    { cmd: 'git help command', desc: 'Show help for specific command' },
    { cmd: 'git --version', desc: 'Show Git version' },
  ];
  let commandList = [];
  if (commandTab === 'windows') commandList = windowsCommands;
  if (commandTab === 'linux') commandList = linuxCommands;
  if (commandTab === 'git') commandList = gitCommands;

  return (
    <div className="admin-terminal-content">
      {/* Command List Section - Only show when a tab is selected */}
      {commandTab && (
        <div className="admin-terminal-command-list">
          {commandList.map((item, idx) => (
            <div
              key={idx}
              className="admin-terminal-command-list-item"
              onClick={() => {
                setCommand(item.cmd);
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
              title={`Click to use: ${item.cmd}`}
            >
              <span className="admin-terminal-command-list-cmd">{item.cmd}</span>
              <span className="admin-terminal-command-list-desc">{item.desc}</span>
            </div>
          ))}
        </div>
      )}
      <div className="admin-terminal-output-area">
        {commandHistory.map((cmd, index) => (
          <div key={index} className="admin-terminal-command-entry">
            <div className="admin-terminal-prompt">
              <span className="admin-terminal-user">admin</span>
              <span className="admin-terminal-at">@</span>
              <span className="admin-terminal-host">tellyoudoc</span>
              <span className="admin-terminal-colon">:</span>
              <span className="admin-terminal-path">~</span>
              <span className="admin-terminal-dollar">$</span>
            </div>
            <span className="admin-terminal-command">{cmd}</span>
          </div>
        ))}
        {loading && (
          <div className="admin-terminal-command-entry">
            <div className="admin-terminal-prompt">
              <span className="admin-terminal-user">admin</span>
              <span className="admin-terminal-at">@</span>
              <span className="admin-terminal-host">tellyoudoc</span>
              <span className="admin-terminal-colon">:</span>
              <span className="admin-terminal-path">~</span>
              <span className="admin-terminal-dollar">$</span>
            </div>
            <span className="admin-terminal-command">{command}</span>
            <span className="admin-terminal-loading">Running...</span>
          </div>
        )}
        {error && (
          <div className="admin-terminal-error">
            <span className="admin-terminal-error-text">{error}</span>
          </div>
        )}
        {osAlert && (
          <div className={`admin-terminal-alert admin-terminal-alert-${osAlert.type}`}>
            <span className="admin-terminal-alert-text">{osAlert.message}</span>
          </div>
        )}
        {output && !loading && (
          <div className="admin-terminal-result">
            <pre className="admin-terminal-output-text">{output}</pre>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="admin-terminal-input-form">
        <div className="admin-terminal-input-line">
          <div className="admin-terminal-prompt">
            <span className="admin-terminal-user">admin</span>
            <span className="admin-terminal-at">@</span>
            <span className="admin-terminal-host">tellyoudoc</span>
            <span className="admin-terminal-colon">:</span>
            <span className="admin-terminal-path">~</span>
            <span className="admin-terminal-dollar">$</span>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={e => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter command..."
            className="admin-terminal-input"
            disabled={loading}
            autoFocus
          />
        </div>
      </form>

      <div className="admin-terminal-help">
        <div className="admin-terminal-help-title">Quick Commands:</div>
        <div className="admin-terminal-help-commands">
          <button onClick={() => setCommand("ls -la")} disabled={loading}>ls -la</button>
          <button onClick={() => setCommand("df -h")} disabled={loading}>df -h</button>
          <button onClick={() => setCommand("free -m")} disabled={loading}>free -m</button>
          <button onClick={() => setCommand("ps aux | grep node")} disabled={loading}>ps aux | grep node</button>
          <button onClick={() => setCommand("top")} disabled={loading}>top</button>
          <button onClick={() => setCommand("netstat -tuln")} disabled={loading}>netstat -tuln</button>
          <button onClick={() => setCommand("ping google.com")} disabled={loading}>ping google.com</button>
          <button onClick={() => setCommand("git status")} disabled={loading}>git status</button>
          <button onClick={() => setCommand("git log --oneline")} disabled={loading}>git log --oneline</button>
          <button onClick={() => setCommand("systemctl status")} disabled={loading}>systemctl status</button>
          <button onClick={() => setCommand("journalctl -f")} disabled={loading}>journalctl -f</button>
          <button onClick={() => setCommand("uptime")} disabled={loading}>uptime</button>
        </div>
      </div>
    </div>
  );
}

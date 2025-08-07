import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import "../../styles/Administrator/AdminDashboard.css";
import { apiService } from "../../services/api";
import {
  FaUserMd,
  FaUserShield,
  FaUsers,
  FaCalendarAlt,
  FaChartBar,
  FaBell,
  FaFileAlt,
  FaHandshake,
  FaIdCard,
  FaChartLine,
  FaServer,
  FaDatabase,
  FaFire,
  FaEnvelope,
  FaSms,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaWifi,
  FaCog,
} from "react-icons/fa";
import { ClockCircleOutlined } from "@ant-design/icons";

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [serverHealth, setServerHealth] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError, setHealthError] = useState(null);
  const navigate = useNavigate();

  // Update current date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch server health data
  useEffect(() => {
    const fetchServerHealth = async () => {
      try {
        setHealthLoading(true);
        setHealthError(null);
        const response = await apiService.healthService.getServerHealth();
        setServerHealth(response.data);
      } catch (error) {
        console.error("Error fetching server health:", error);
        setHealthError("Failed to fetch server health data");
      } finally {
        setHealthLoading(false);
      }
    };

    fetchServerHealth();
    
    // Refresh health data every 30 seconds
    const healthInterval = setInterval(fetchServerHealth, 30000);
    
    return () => clearInterval(healthInterval);
  }, []);

  // Format date and time for display
  const formatDateTime = (date) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Format uptime
  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Get status icon and color
  const getStatusIcon = (healthy) => {
    if (healthy) {
      return { icon: <FaCheckCircle />, color: "#10B981", text: "Healthy" };
    } else {
      return { icon: <FaTimesCircle />, color: "#EF4444", text: "Unhealthy" };
    }
  };

  // Get feature flag status
  const getFeatureFlagStatus = (enabled) => {
    if (enabled) {
      return { icon: <FaCheckCircle />, color: "#10B981", text: "Enabled" };
    } else {
      return { icon: <FaTimesCircle />, color: "#6B7280", text: "Disabled" };
    }
  };

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    if (!adminAuth) {
      navigate("/admin");
      return;
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-message">
          Loading administrator dashboard...
        </div>
      </div>
    );
  }

  const dashboardCards = [
    {
      title: "Administrators",
      description: "Manage admin accounts and permissions",
      icon: <FaUserShield size={36} />,
      color: "#FF6B6B",
      path: "/admin/administrators"
    },
    {
      title: "Doctors",
      description: "Manage doctor accounts and approvals",
      icon: <FaUserMd size={36} />,
      color: "#4ECDC4",
      path: "/admin/doctors"
    },
    {
      title: "Patients",
      description: "View and manage patient accounts",
      icon: <FaUsers size={36} />,
      color: "#45B7D1",
      path: "/admin/patients"
    },
    {
      title: "Appointments",
      description: "Manage all appointments and schedules",
      icon: <FaCalendarAlt size={36} />,
      color: "#96CEB4",
      path: "/admin/appointments"
    },
    // {
    //   title: "Organizations",
    //   description: "Manage partner organizations",
    //   icon: <FaHandshake size={36} />,
    //   color: "#6C8EBF",
    //   path: "/admin/organizations"
    // },
    {
      title: "Reports & Feedback",
      description: "View comprehensive reports and analytics",
      icon: <FaChartBar size={36} />,
      color: "#20C997",
      path: "/admin/reports"
    },
    // {
    //   title: "Notifications",
    //   description: "Manage system notifications",
    //   icon: <FaBell size={36} />,
    //   color: "#A367DC",
    //   path: "/admin/notifications"
    // },
    // {
    //   title: "Content Management",
    //   description: "Manage platform content and resources",
    //   icon: <FaFileAlt size={36} />,
    //   color: "#6C757D",
    //   path: "/admin/content"
    // },
    // {
    //   title: "Beta Partners",
    //   description: "Manage Beta Partner program",
    //   icon: <FaHandshake size={36} />,
    //   color: "#9C72EF",
    //   path: "/admin/subscription"
    // },
    // {
    //   title: "Subscribers",
    //   description: "Manage newsletter subscribers",
    //   icon: <FaUsers size={36} />,
    //   color: "#FF6B6B",
    //   path: "/admin/subscribers"
    // },
    {
      title: "Activity Logs",
      description: "Track user activities and system events",
      icon: <ClockCircleOutlined style={{ fontSize: "36px" }} />,
      color: "#4ECDC4",
      path: "/admin/activity-logs"
    },
    {
      title: "Doctor KYC Management",
      description: "Manage Doctor Know Your Customer verifications",
      icon: <FaIdCard size={36} />,
      color: "#7066E0",
      path: "/admin/kyc"
    }
  ];

  return (
    <AdminLayout>
      <div className="admin-dashboard-content">
        <div className="admin-dashboard-header">
          <h3>Welcome to Admin Dashboard</h3>
          <div className="dashboard-datetime">
            <ClockCircleOutlined style={{ marginRight: '8px' }} />
            {formatDateTime(currentDateTime)}
          </div>
        </div>

        <div className="dashboard-cards">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="admin-dashboard-card"
              onClick={() => window.open(card.path, '_blank')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.open(card.path, '_blank');
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Navigate to ${card.title}: ${card.description}`}
              style={{ '--card-color': card.color }}
            >
              <div className="dashboard-card-icon" style={{ color: card.color }}>
                {card.icon}
              </div>
              <div className="dashboard-card-content">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Server Health Section */}
        <div className="server-health-section">
          <div className="server-health-header">
            <h3>
              <FaServer style={{ marginRight: '8px' }} />
              Server Health & System Status
            </h3>
            {healthLoading && <span className="health-loading">Refreshing...</span>}
          </div>

          {healthError ? (
            <div className="health-error">
              <FaExclamationTriangle style={{ marginRight: '8px' }} />
              {healthError}
            </div>
          ) : serverHealth ? (
            <div className="health-content">
              {/* Overall Status */}
              <div className="health-overview">
                <div className="health-status-card">
                  <div className="status-header">
                    <FaServer size={20} />
                    <span>Overall Status</span>
                  </div>
                  <div className="status-content">
                    <div className="status-indicator">
                      {getStatusIcon(serverHealth.status === "healthy").icon}
                      <span style={{ color: getStatusIcon(serverHealth.status === "healthy").color }}>
                        {serverHealth.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                    <div className="status-details">
                      <div className="detail-item">
                        <span className="label">Environment:</span>
                        <span className="value">{serverHealth.environment || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Uptime:</span>
                        <span className="value">{serverHealth.uptime ? formatUptime(serverHealth.uptime) : 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Last Check:</span>
                        <span className="value">
                          {serverHealth.timestamp ? new Date(serverHealth.timestamp).toLocaleString() : 'N/A'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Version:</span>
                        <span className="value">{serverHealth.version || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services Status */}
              {serverHealth.services && Object.keys(serverHealth.services).length > 0 ? (
                <div className="services-grid">
                  <h4>Services Status</h4>
                  <div className="services-cards">
                    {Object.entries(serverHealth.services).map(([serviceName, service]) => (
                      <div key={serviceName} className="service-card">
                        <div className="service-header">
                          {serviceName === 'database' && <FaDatabase size={20} />}
                          {serviceName === 'firebaseAdmin' && <FaFire size={20} />}
                          {serviceName === 'redis' && <FaServer size={20} />}
                          {serviceName === 'cache' && <FaServer size={20} />}
                          {serviceName === 'email' && <FaEnvelope size={20} />}
                          {serviceName === 'msg91' && <FaSms size={20} />}
                          {serviceName === 'kycQueue' && <FaIdCard size={20} />}
                          {serviceName === 'notificationQueue' && <FaBell size={20} />}
                          {serviceName === 'cron' && <FaClock size={20} />}
                          {serviceName === 'webSocket' && <FaWifi size={20} />}
                          {serviceName === 'server' && <FaCog size={20} />}
                          <span className="service-name">{serviceName}</span>
                        </div>
                        <div className="service-status">
                          {getStatusIcon(service.healthy).icon}
                          <span style={{ color: getStatusIcon(service.healthy).color }}>
                            {service.status}
                          </span>
                        </div>
                        {service.featureEnabled !== undefined && (
                          <div className="feature-status">
                            {getFeatureFlagStatus(service.featureEnabled).icon}
                            <span style={{ color: getFeatureFlagStatus(service.featureEnabled).color }}>
                              {service.featureEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                        )}
                        {service.connectedUsers !== undefined && (
                          <div className="connected-users">
                            <span className="label">Connected Users:</span>
                            <span className="value">{service.connectedUsers}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <FaServer size={32} style={{ color: '#94a3b8', marginBottom: '12px' }} />
                  <p>No services data available</p>
                </div>
              )}

              {/* Feature Flags */}
              {serverHealth.featureFlags && (
                <div className="feature-flags-section">
                <h4>Feature Flags</h4>
                <div className="feature-flags-summary">
                  <div className="flag-stat">
                    <span className="stat-number">{serverHealth.featureFlags.enabledCount || 0}</span>
                    <span className="stat-label">Enabled</span>
                  </div>
                  <div className="flag-stat">
                    <span className="stat-number">{serverHealth.featureFlags.disabledCount || 0}</span>
                    <span className="stat-label">Disabled</span>
                  </div>
                  <div className="flag-stat">
                    <span className="stat-number">{serverHealth.featureFlags.total || 0}</span>
                    <span className="stat-label">Total</span>
                  </div>
                </div>
                <div className="feature-flags-list">
                  <div className="enabled-flags">
                    <h5>Enabled Features</h5>
                    <div className="flags-grid">
                      {serverHealth.featureFlags.enabled?.length > 0 ? (
                        serverHealth.featureFlags.enabled.map((flag, index) => (
                          <div key={index} className="flag-item enabled">
                            <FaCheckCircle />
                            <span>{flag}</span>
                          </div>
                        ))
                      ) : (
                        <div className="empty-state">
                          <p>No enabled features</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="disabled-flags">
                    <h5>Disabled Features</h5>
                    <div className="flags-grid">
                      {serverHealth.featureFlags.disabled?.length > 0 ? (
                        serverHealth.featureFlags.disabled.map((flag, index) => (
                          <div key={index} className="flag-item disabled">
                            <FaTimesCircle />
                            <span>{flag}</span>
                          </div>
                        ))
                      ) : (
                        <div className="empty-state">
                          <p>No disabled features</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              )}

              {/* Cron Jobs */}
              {serverHealth.services?.cron?.jobs && serverHealth.services.cron.jobs.length > 0 && (
                <div className="cron-jobs-section">
                  <h4>Cron Jobs</h4>
                  <div className="cron-jobs-list">
                    {serverHealth.services.cron.jobs.map((job, index) => (
                      <div key={index} className="cron-job-item">
                        <div className="job-header">
                          <span className="job-name">{job.name}</span>
                          <div className="job-status">
                            {getStatusIcon(job.enabled).icon}
                            <span style={{ color: getStatusIcon(job.enabled).color }}>
                              {job.enabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                        </div>
                        <div className="job-details">
                          <p className="job-description">{job.description}</p>
                          <div className="job-schedule">
                            <span className="label">Schedule:</span>
                            <span className="value">{job.schedule}</span>
                          </div>
                          <div className="job-running">
                            <span className="label">Running:</span>
                            <span className="value">{job.running ? 'Yes' : 'No'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="health-content">
              <div className="empty-state">
                <FaServer size={48} style={{ color: '#cbd5e0', marginBottom: '16px' }} />
                <h4 style={{ margin: '0 0 8px 0', color: '#475569' }}>No Server Health Data</h4>
                <p style={{ margin: 0 }}>
                  {healthLoading ? 'Loading server health data...' : 'Server health information is currently unavailable.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;

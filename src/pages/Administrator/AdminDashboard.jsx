import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import "../../styles/Administrator/AdminDashboard.css";
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
} from "react-icons/fa";
import { ClockCircleOutlined } from "@ant-design/icons";

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const navigate = useNavigate();

  // Update current date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
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
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import "../../styles/Administrator/AdminDashboard.css";
import {
    FaStethoscope,
} from "react-icons/fa";
import { ClockCircleOutlined } from "@ant-design/icons";

function DoctorAppContent() {
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
                    Loading Doctor App Content Dashboard...
                </div>
            </div>
        );
    }

    const dashboardCards = [
        {
            title: "Doctor Specialization",
            description: "Manage doctor specializations and categories",
            icon: <FaStethoscope size={36} />,
            color: "#4ECDC4",
            path: "/admin/specializations"
        }
        // Additional cards can be added here in the future
    ];

    return (
        <AdminLayout>
            <div className="admin-dashboard-content">
                <div className="admin-dashboard-header">
                    <h3>Welcome to the Doctor App Content Dashboard</h3>
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
                            onClick={() => navigate(card.path)}
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

export default DoctorAppContent;

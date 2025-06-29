// filepath: c:\Users\Ankan Chakraborty\OneDrive\Desktop\IIIT Guwahati\Website\live\tellyoudoc-April19-25\src\pages\Organization\Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrganizationLayout from "../../components/OrganizationLayout";
import "../../styles/Organization/OrganizationDashboard.css";
import {
  FaUserShield,
  FaUserMd,
  FaUsers,
  FaChartBar,
  FaCog,
  FaHistory,
  FaSyringe,
  FaHospital,
  FaBuilding,
  FaCreditCard,
  FaCalendarAlt,
  FaClipboardList,
  FaArrowUp,
  FaArrowDown,
  FaBell,
  FaExclamationCircle
} from "react-icons/fa";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const OrganizationDashboard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
    // Mock organization data
  const [organizationData, setOrganizationData] = useState({
    name: "Sample Hospital",
    type: "Hospital",
    ownershipType: "Private",
    subscriptionType: "Premium",
    doctorsCount: 32,
    patientsCount: 1458,
    screeningsCount: 895,
    administratorsCount: 8,
    id: "org123",
    address: "123 Healthcare Avenue, Medical District",
    city: "Mumbai",
    state: "Maharashtra",
    phone: "022-12345678",
    email: "contact@samplehospital.com"
  });

  // Mock statistics data for charts
  const [statistics, setStatistics] = useState({
    patientTrends: [
      { month: 'Jan', count: 650 },
      { month: 'Feb', count: 730 },
      { month: 'Mar', count: 810 },
      { month: 'Apr', count: 920 },
      { month: 'May', count: 1050 },
      { month: 'Jun', count: 1180 },
      { month: 'Jul', count: 1250 },
      { month: 'Aug', count: 1320 },
      { month: 'Sep', count: 1380 },
      { month: 'Oct', count: 1430 },
      { month: 'Nov', count: 1440 },
      { month: 'Dec', count: 1458 }
    ],
    screeningsByType: [
      { name: 'Mammogram', value: 485 },
      { name: 'Blood Test', value: 210 },
      { name: 'Ultrasound', value: 130 },
      { name: 'CT Scan', value: 70 }
    ],
    doctorPerformance: [
      { name: 'Dr. A', screenings: 120, patients: 230 },
      { name: 'Dr. B', screenings: 98, patients: 185 },
      { name: 'Dr. C', screenings: 86, patients: 165 },
      { name: 'Dr. D', screenings: 79, patients: 140 },
      { name: 'Dr. E', screenings: 65, patients: 120 }
    ],
    recentActivity: [
      { id: 1, type: 'patient', message: 'New patient registered', time: '10 minutes ago' },
      { id: 2, type: 'screening', message: 'Mammogram screening completed', time: '25 minutes ago' },
      { id: 3, type: 'doctor', message: 'Dr. Sharma updated patient records', time: '1 hour ago' },
      { id: 4, type: 'admin', message: 'System maintenance scheduled', time: '2 hours ago' },
      { id: 5, type: 'patient', message: 'Patient feedback submitted', time: '3 hours ago' }
    ],
    upcomingAppointments: [
      { id: 1, patientName: 'Priya Verma', doctorName: 'Dr. Sharma', time: '09:30 AM', date: 'Today' },
      { id: 2, patientName: 'Rahul Gupta', doctorName: 'Dr. Khan', time: '11:00 AM', date: 'Today' },
      { id: 3, patientName: 'Anita Singh', doctorName: 'Dr. Patel', time: '02:15 PM', date: 'Tomorrow' }
    ],
    alerts: [
      { id: 1, message: 'Inventory low on Disposable Gloves', priority: 'high' },
      { id: 2, message: 'System update required', priority: 'medium' },
      { id: 3, message: 'Staff meeting scheduled for tomorrow', priority: 'low' }
    ]
  });

  // KPI data with trends
  const [kpiData, setKpiData] = useState({
    patientsToday: {
      count: 48,
      trend: '+12%',
      isPositive: true
    },
    screeningsToday: {
      count: 32,
      trend: '+8%',
      isPositive: true
    },
    revenueThisMonth: {
      count: '₹4.2L',
      trend: '+15%',
      isPositive: true
    },
    doctorAttendance: {
      count: '94%',
      trend: '-2%',
      isPositive: false
    }
  });
  
  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    // Check if user is authenticated as an organization
    const orgAuth = localStorage.getItem("orgAuth");

    if (!orgAuth) {
      // Redirect to organization login if not authenticated
      navigate("/organization");
      return;
    }

    // In a real application, you would fetch this data from an API
    // For now, we'll use mock data and simulate loading
    const timer = setTimeout(() => {
      // Get organization data from local storage if available
      const storedOrgData = localStorage.getItem('organizationData');
      if (storedOrgData) {
        try {
          const parsedData = JSON.parse(storedOrgData);
          // Merge with our mock data for this example
          setOrganizationData(prev => ({
            ...prev,
            name: parsedData.name || prev.name,
            email: parsedData.email || prev.email,
            id: parsedData.id || prev.id
          }));
        } catch (e) {
          console.error("Error parsing organization data from localStorage", e);
        }
      }
      
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  // Navigate to specific pages
  const navigateTo = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <OrganizationLayout>
        <div className="org-loading">
          <div className="org-loading-spinner"></div>
          <p>Loading organization dashboard...</p>
        </div>
      </OrganizationLayout>
    );
  }
  
  return (
    <OrganizationLayout>
      <div className="org-dashboard-container">        {/* Welcome Banner */}
        <div className="org-welcome-banner">
          <div className="org-welcome-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ 
                backgroundColor: '#EBF3FF', 
                width: '40px', 
                height: '40px', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#0061f2'
              }}>
                <FaHospital />
              </div>
              <h1>Welcome, {organizationData.name}</h1>
            </div>
            <p>Healthcare dashboard • {new Date().toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</p>
          </div>
          <div className="org-welcome-actions">
            <button className="org-report-btn" onClick={() => navigateTo("/organization/reports/new")}>
              <FaClipboardList style={{ marginRight: '8px' }} /> Generate Report
            </button>
          </div>
        </div>        {/* KPI Cards */}
        <div className="org-kpi-grid">
          <div className="org-kpi-card">
            <div className="org-kpi-icon patients">
              <FaUsers />
            </div>
            <div className="org-kpi-details">
              <div className="org-kpi-title">Patient Visits Today</div>
              <div className="org-kpi-value">{kpiData.patientsToday.count}</div>
              <div className={`org-kpi-trend ${kpiData.patientsToday.isPositive ? 'positive' : 'negative'}`}>
                {kpiData.patientsToday.isPositive ? <FaArrowUp /> : <FaArrowDown />}
                {kpiData.patientsToday.trend}
              </div>
            </div>
          </div>
          
          <div className="org-kpi-card">
            <div className="org-kpi-icon screenings">
              <FaSyringe />
            </div>
            <div className="org-kpi-details">
              <div className="org-kpi-title">Breast Cancer Screenings Today</div>
              <div className="org-kpi-value">{kpiData.screeningsToday.count}</div>
              <div className={`org-kpi-trend ${kpiData.screeningsToday.isPositive ? 'positive' : 'negative'}`}>
                {kpiData.screeningsToday.isPositive ? <FaArrowUp /> : <FaArrowDown />}
                {kpiData.screeningsToday.trend}
              </div>
            </div>
          </div>
        </div>
        
        {/* Organization Totals */}
        <div className="org-totals-section">
          <h3>Organization Overview</h3>
          <div className="org-totals-grid">
            <div className="org-total-item">
              <div className="org-total-icon admin">
                <FaUserShield />
              </div>              <div className="org-total-details">
                <div className="org-total-label">Total Administrators</div>
                <div className="org-total-value">{organizationData.administratorsCount}</div>
              </div>
            </div>
            
            <div className="org-total-item">
              <div className="org-total-icon doctors">
                <FaUserMd />
              </div>
              <div className="org-total-details">
                <div className="org-total-label">Total Doctors</div>
                <div className="org-total-value">{organizationData.doctorsCount}</div>
              </div>
            </div>
            
            <div className="org-total-item">
              <div className="org-total-icon patients">
                <FaUsers />
              </div>
              <div className="org-total-details">
                <div className="org-total-label">Total Patients</div>
                <div className="org-total-value">{organizationData.patientsCount}</div>
              </div>
            </div>
            
            <div className="org-total-item">
              <div className="org-total-icon screenings">
                <FaSyringe />
              </div>
              <div className="org-total-details">
                <div className="org-total-label">Total Screenings</div>
                <div className="org-total-value">{organizationData.screeningsCount}</div>
              </div>
            </div>
          </div>
        </div>
          {/* Main Dashboard Grid */}
        <div className="org-dashboard-grid">
          {/* Main Dashboard Top Row */}
          <div className="org-dashboard-top-row">
            {/* Patient Growth Chart */}
            <div className="org-dashboard-card patient-growth">
              <div className="org-card-header">
                <h3>Patient Growth</h3>
                <div className="org-card-actions">
                  <select className="org-time-filter">
                    <option>Last 12 Months</option>
                    <option>Last 6 Months</option>
                    <option>Last 30 Days</option>
                  </select>
                </div>
              </div>
              <div className="org-chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={statistics.patientTrends}>
                    <defs>
                      <linearGradient id="patientGrowth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#0088FE" fillOpacity={1} fill="url(#patientGrowth)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Doctor Leaderboard */}
            <div className="org-dashboard-card doctor-leaderboard">
              <div className="org-card-header">
                <h3>Top Doctors</h3>
                <div className="org-card-actions">
                  <button className="org-view-all-btn" onClick={() => navigateTo("/organization/doctors")}>
                    View All
                  </button>
                </div>
              </div>
              <div className="doctor-leaderboard-container">
                <div className="doctor-leaderboard-header">
                  <span className="doctor-rank">Rank</span>
                  <span className="doctor-name">Name</span>
                  <span className="doctor-screenings">Screenings</span>
                  <span className="doctor-patients">Patients</span>
                </div>
                <div className="doctor-leaderboard-list">
                  {statistics.doctorPerformance.map((doctor, index) => (
                    <div key={doctor.name} className="doctor-leaderboard-item">
                      <span className={`doctor-rank rank-${index + 1}`}>{index + 1}</span>
                      <span className="doctor-name">{doctor.name}</span>
                      <span className="doctor-screenings">{doctor.screenings}</span>
                      <span className="doctor-patients">{doctor.patients}</span>
                      {index === 0 && <span className="doctor-crown">👑</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="org-quick-actions">
          <h3>Quick Actions</h3>
          <div className="org-action-buttons">
            <button className="org-action-btn" onClick={() => navigateTo("/organization/doctors/add")}>
              <FaUserMd /> Add Doctor
            </button>
            <button className="org-action-btn" onClick={() => navigateTo("/organization/patients/add")}>
              <FaUsers /> Register Patient
            </button>
            <button className="org-action-btn" onClick={() => navigateTo("/organization/screening/schedule")}>
              <FaSyringe /> Schedule Screening
            </button>
            <button className="org-action-btn" onClick={() => navigateTo("/organization/reports")}>
              <FaClipboardList /> Generate Reports
            </button>
          </div>
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationDashboard;
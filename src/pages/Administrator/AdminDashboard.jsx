import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import "../../styles/Administrator/AdminDashboard.css";
import {
  FaUserMd,
  FaArrowLeft,
  FaUserShield,
  FaUsers,
  FaCalendarAlt,
  FaChartBar,
  FaBell,
  FaFileAlt,
  FaHandshake,
} from "react-icons/fa";
import { ClockCircleOutlined } from "@ant-design/icons";

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [approvedDoctors, setApprovedDoctors] = useState([]);
  const [rejectedDoctors, setRejectedDoctors] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");

  // Active view state - always starts with dashboard
  const [activeView, setActiveView] = useState("dashboard");

  const navigate = useNavigate();
  const location = useLocation();

  // Mock data for doctors list
  const mockDoctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      mobile: "9876543210",
      email: "sarah.johnson@example.com",
      city: "Mumbai",
      state: "Maharashtra",
      specialization: "Oncology",
      qualification: "MBBS, MD",
      hospitalName: "City Cancer Hospital",
      experience: "12",
      reasonToJoin:
        "Interested in working with advanced cancer diagnosis technologies",
    },
    {
      id: 2,
      name: "Dr. Rajesh Kumar",
      mobile: "8765432109",
      email: "rajesh.kumar@example.com",
      city: "Delhi",
      state: "Delhi",
      specialization: "Radiology",
      qualification: "MBBS, DNB (Radiology)",
      hospitalName: "Metro Imaging Center",
      experience: "8",
      reasonToJoin:
        "Want to contribute to early breast cancer detection efforts",
    },
    {
      id: 3,
      name: "Dr. Priya Sharma",
      mobile: "7654321098",
      email: "priya.sharma@example.com",
      city: "Bangalore",
      state: "Karnataka",
      specialization: "Surgical Oncology",
      qualification: "MBBS, MS, MCh",
      hospitalName: "Wellness Cancer Center",
      experience: "15",
      reasonToJoin:
        "Looking to help more patients through improved diagnostic systems",
    },
    {
      id: 4,
      name: "Dr. Amit Patel",
      mobile: "6543210987",
      email: "amit.patel@example.com",
      city: "Ahmedabad",
      state: "Gujarat",
      specialization: "Medical Oncology",
      qualification: "MBBS, MD, DM",
      hospitalName: "Life Care Hospital",
      experience: "10",
      reasonToJoin:
        "Interested in the AI integration for mammogram interpretations",
    },
    {
      id: 5,
      name: "Dr. Meera Reddy",
      mobile: "7890123456",
      email: "meera.reddy@example.com",
      city: "Chennai",
      state: "Tamil Nadu",
      specialization: "Radiation Oncology",
      qualification: "MBBS, MD",
      hospitalName: "South City Cancer Institute",
      experience: "7",
      reasonToJoin: "Want to provide better care for breast cancer patients",
    },
  ];

  // Mock data for approved doctors
  const mockApprovedDoctors = [
    {
      id: 101,
      name: "Dr. Aarav Singh",
      mobile: "9988776655",
      email: "aarav.singh@example.com",
      city: "Pune",
      state: "Maharashtra",
      specialization: "Medical Oncology",
      qualification: "MBBS, MD, DM",
      hospitalName: "Pune Cancer Institute",
      experience: "9",
      approvedDate: "2023-10-15",
      status: "Active",
    },
    {
      id: 102,
      name: "Dr. Neha Gupta",
      mobile: "8877665544",
      email: "neha.gupta@example.com",
      city: "Kolkata",
      state: "West Bengal",
      specialization: "Radiation Oncology",
      qualification: "MBBS, MD",
      hospitalName: "East City Medical Center",
      experience: "14",
      approvedDate: "2023-09-22",
      status: "Active",
    },
    {
      id: 103,
      name: "Dr. Vikram Desai",
      mobile: "7766554433",
      email: "vikram.desai@example.com",
      city: "Hyderabad",
      state: "Telangana",
      specialization: "Surgical Oncology",
      qualification: "MBBS, MS, MCh",
      hospitalName: "Hyderabad Cancer Center",
      experience: "11",
      approvedDate: "2023-11-05",
      status: "Active",
    },
  ];

  // Mock data for rejected doctors
  const mockRejectedDoctors = [
    {
      id: 201,
      name: "Dr. Karan Malhotra",
      mobile: "6655443322",
      email: "karan.malhotra@example.com",
      city: "Jaipur",
      state: "Rajasthan",
      specialization: "General Surgery",
      qualification: "MBBS, MS",
      hospitalName: "City General Hospital",
      experience: "5",
      rejectedDate: "2023-10-18",
      rejectionReason: "Insufficient experience in oncology",
    },
    {
      id: 202,
      name: "Dr. Ananya Verma",
      mobile: "5544332211",
      email: "ananya.verma@example.com",
      city: "Lucknow",
      state: "Uttar Pradesh",
      specialization: "Internal Medicine",
      qualification: "MBBS, MD",
      hospitalName: "Lucknow Medical Center",
      experience: "4",
      rejectedDate: "2023-09-30",
      rejectionReason: "Specialization not relevant to the platform",
    },
  ];

  // Filter function for all doctor lists
  const filterDoctors = (doctorsList) => {
    return doctorsList.filter((doctor) => {
      // Search by name, email, mobile, city, state, or hospital name
      const searchMatches =
        searchTerm === "" ||
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.mobile.includes(searchTerm) ||
        doctor.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.hospitalName.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by specialization
      const specializationMatches =
        specializationFilter === "" ||
        doctor.specialization === specializationFilter;

      return searchMatches && specializationMatches;
    });
  };

  // Get all unique specializations for the filter dropdown
  const getAllSpecializations = () => {
    const allDoctors = [...doctors, ...approvedDoctors, ...rejectedDoctors];
    const specializations = new Set(
      allDoctors.map((doctor) => doctor.specialization)
    );
    return [...specializations];
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle specialization filter change
  const handleSpecializationChange = (e) => {
    setSpecializationFilter(e.target.value);
  };

  // Navigation function - replaces direct navigation with view changes
  const navigateTo = (view) => {
    if (view.startsWith("/")) {
      navigate(view);
    } else {
      setActiveView(view);
      // Clear search and filter when switching views
      setSearchTerm("");
      setSpecializationFilter("");
    }
  };

  // Back to dashboard function
  const backToDashboard = () => {
    setActiveView("dashboard");
  };

  useEffect(() => {
    // Redirect to dashboard view when URL changes
    const path = location.pathname;
    if (path === "/admin/doctors") {
      setActiveView("doctors");
    } else if (path === "/admin/approved") {
      setActiveView("approved");
    } else if (path === "/admin/rejected") {
      setActiveView("rejected");
    } else if (path === "/admin/settings") {
      setActiveView("settings");
    } else if (path === "/admin/activity-logs") {
      setActiveView("activity-logs");
    } else {
      setActiveView("dashboard");
    }
  }, [location.pathname]);

  useEffect(() => {
    // Check if user is authenticated as admin
    const adminAuth = localStorage.getItem("adminAuth");

    if (!adminAuth) {
      // Redirect to admin login if not authenticated
      navigate("/admin");
      return;
    }

    // In a real application, you would fetch this data from an API
    // For now, we'll use mock data
    const timer = setTimeout(() => {
      setDoctors(mockDoctors);
      setApprovedDoctors(mockApprovedDoctors);
      setRejectedDoctors(mockRejectedDoctors);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleAccept = (id) => {
    // In a real application, you would call an API to update the doctor's status
    // For this demo, we'll just update the local state to remove the doctor from the list
    const doctorToApprove = doctors.find((doctor) => doctor.id === id);

    if (doctorToApprove) {
      // Add to approved doctors with new fields
      const approvedDoctor = {
        ...doctorToApprove,
        approvedDate: new Date().toISOString().split("T")[0],
        status: "Active",
      };

      setApprovedDoctors([...approvedDoctors, approvedDoctor]);
      // Remove from pending doctors
      setDoctors(doctors.filter((doctor) => doctor.id !== id));
    }

    alert(`Doctor with ID ${id} has been accepted`);
  };

  const handleReject = (id) => {
    // In a real application, you would call an API to update the doctor's status
    const doctorToReject = doctors.find((doctor) => doctor.id === id);

    if (doctorToReject) {
      // Add to rejected doctors with new fields
      const rejectedDoctor = {
        ...doctorToReject,
        rejectedDate: new Date().toISOString().split("T")[0],
        rejectionReason: "Application rejected by administrator",
      };

      setRejectedDoctors([...rejectedDoctors, rejectedDoctor]);
      // Remove from pending doctors
      setDoctors(doctors.filter((doctor) => doctor.id !== id));
    }

    alert(`Doctor with ID ${id} has been rejected`);
  };

  const handleEmailUpdate = () => {
    if (!newEmail) {
      alert("Please enter a new email address");
      return;
    }

    // In a real app, this would make an API call to send OTP to the new email
    console.log(`Sending OTP to ${newEmail}`);
    setOtpSent(true);
    setShowOtpModal(true);
  };

  const verifyOtp = () => {
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }

    // In a real app, this would verify the OTP with the server
    if (otp === "123456") {
      // Simulating a successful verification
      // Update the email
      console.log(`Email updated to ${newEmail}`);
      alert("Email updated successfully");
      setShowOtpModal(false);
      setNewEmail("");
      setOtp("");
      setOtpSent(false);
    } else {
      alert("Invalid OTP, please try again");
    }
  };

  const resendOtp = () => {
    // In a real app, this would make an API call to resend the OTP
    console.log(`Resending OTP to ${newEmail}`);
    alert(`OTP resent to ${newEmail}`);
  };

  const closeModal = () => {
    setShowOtpModal(false);
    setOtp("");
    setOtpSent(false);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-message">
          Loading administrator dashboard...
        </div>
      </div>
    );
  }

  // Render the dashboard view with navigation cards
  const renderDashboard = () => {
    return (
      <div className="admin-dashboard-content">
        <h2>Dashboard Overview</h2>
        <p className="dashboard-welcome">
          Welcome to the admin dashboard. Select an option below to manage the
          platform.
        </p>

        <div className="dashboard-cards">
          <div
            className="dashboard-card"
            onClick={() => navigateTo("/admin/administrators")}
          >
            <div className="dashboard-card-icon" style={{ color: "#FF6B6B" }}>
              <FaUserShield size={36} />
            </div>
            <div className="dashboard-card-content">
              <h3>Admin Management</h3>
              <p>Review and manage administrators</p>
              <span className="dashboard-card-count">{doctors.length}</span>
            </div>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigateTo("/admin/doctors")}
          >
            <div className="dashboard-card-icon" style={{ color: "#4ECDC4" }}>
              <FaUserMd size={36} />
            </div>
            <div className="dashboard-card-content">
              <h3>Doctor Management</h3>
              <p>View and manage all doctors</p>
              <span className="dashboard-card-count">
                {approvedDoctors.length}
              </span>
            </div>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigateTo("/admin/patients")}
          >
            <div className="dashboard-card-icon" style={{ color: "#45B7D1" }}>
              <FaUsers size={36} />
            </div>
            <div className="dashboard-card-content">
              <h3>Patient Management</h3>
              <p>View and manage all patients</p>
              <span className="dashboard-card-count">
                {rejectedDoctors.length}
              </span>
            </div>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigateTo("/admin/appointments")}
          >
            <div className="dashboard-card-icon" style={{ color: "#96CEB4" }}>
              <FaCalendarAlt size={36} />
            </div>
            <div className="dashboard-card-content">
              <h3>Appointment Management</h3>
              <p>Manage all appointments</p>
            </div>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigateTo("/admin/organizations")}
          >
            <div className="dashboard-card-icon" style={{ color: "#6C8EBF" }}>
              <FaHandshake size={36} />
            </div>
            <div className="dashboard-card-content">
              <h3>Organization Management</h3>
              <p>Manage all organizations</p>
            </div>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigateTo("/admin/reports")}
          >
            <div className="dashboard-card-icon" style={{ color: "#7066E0" }}>
              <FaChartBar size={36} />
            </div>
            <div className="dashboard-card-content">
              <h3>Reports and Feedbacks</h3>
              <p>View reports and feedbacks</p>
            </div>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigateTo("/admin/notifications")}
          >
            <div className="dashboard-card-icon" style={{ color: "#FFB347" }}>
              <FaBell size={36} />
            </div>
            <div className="dashboard-card-content">
              <h3>Notification Management</h3>
              <p>Manage system notifications</p>
            </div>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigateTo("/admin/content")}
          >
            <div className="dashboard-card-icon" style={{ color: "#6C757D" }}>
              <FaFileAlt size={36} />
            </div>
            <div className="dashboard-card-content">
              <h3>Content Management</h3>
              <p>Manage platform content</p>
            </div>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigateTo("/admin/subscription")}
          >
            <div className="dashboard-card-icon" style={{ color: "#20C997" }}>
              <FaHandshake size={36} />
            </div>
            <div className="dashboard-card-content">
              <h3>Beta Partner Management</h3>
              <p>Manage Beta Partners</p>
            </div>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigateTo("/admin/subscribers")}
          >
            <div className="dashboard-card-icon" style={{ color: "#A367DC" }}>
              <FaUsers size={36} />
            </div>
            <div className="dashboard-card-content">
              <h3>Subscriber Management</h3>
              <p>Manage Subscribers</p>
            </div>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigateTo("/admin/activity-logs")}
          >
            <div className="dashboard-card-icon" style={{ color: "#9C72EF" }}>
              <ClockCircleOutlined style={{ fontSize: "36px" }} />
            </div>
            <div className="dashboard-card-content">
              <h3>Activity Logs</h3>
              <p>Track user activities and system events</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render doctor approval requests view
  const renderDoctorRequests = () => {
    const filteredDoctors = filterDoctors(doctors);

    return (
      <div className="admin-dashboard-content">
        <div className="view-header">
          <button className="back-button" onClick={backToDashboard}>
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h2>Doctor Approval Requests</h2>
        </div>

        <div className="admin-filters">
          <input
            type="text"
            placeholder="Search doctors..."
            className="admin-search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <select
            className="admin-filter"
            value={specializationFilter}
            onChange={handleSpecializationChange}
          >
            <option value="">All Specializations</option>
            {getAllSpecializations().map((specialization) => (
              <option key={specialization} value={specialization}>
                {specialization}
              </option>
            ))}
          </select>
        </div>

        <div className="doctors-list">
          {filteredDoctors.length === 0 ? (
            <div className="no-doctors">
              <p>No pending doctor approval requests match your filters.</p>
            </div>
          ) : (
            filteredDoctors.map((doctor) => (
              <div className="doctor-card" key={doctor.id}>
                <div className="doctor-header">
                  <h3>{doctor.name}</h3>
                  <div className="doctor-actions">
                    <button
                      className="action-button accept-button"
                      onClick={() => handleAccept(doctor.id)}
                    >
                      Accept
                    </button>
                    <button
                      className="action-button reject-button"
                      onClick={() => handleReject(doctor.id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>

                <div className="doctor-details">
                  <div className="detail-group">
                    <div className="detail-item">
                      <span className="detail-label">Mobile:</span>
                      <span className="detail-value">{doctor.mobile}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{doctor.email}</span>
                    </div>
                  </div>

                  <div className="detail-group">
                    <div className="detail-item">
                      <span className="detail-label">City:</span>
                      <span className="detail-value">{doctor.city}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">State:</span>
                      <span className="detail-value">{doctor.state}</span>
                    </div>
                  </div>

                  <div className="detail-group">
                    <div className="detail-item">
                      <span className="detail-label">Specialization:</span>
                      <span className="detail-value">
                        {doctor.specialization}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Qualification:</span>
                      <span className="detail-value">
                        {doctor.qualification}
                      </span>
                    </div>
                  </div>

                  <div className="detail-group">
                    <div className="detail-item">
                      <span className="detail-label">Hospital/Clinic:</span>
                      <span className="detail-value">
                        {doctor.hospitalName}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Experience:</span>
                      <span className="detail-value">
                        {doctor.experience} years
                      </span>
                    </div>
                  </div>

                  <div className="detail-item reason-item">
                    <span className="detail-label">Reason to Join:</span>
                    <span className="detail-value reason-value">
                      {doctor.reasonToJoin}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Render approved doctors view
  const renderApprovedDoctors = () => {
    const filteredApprovedDoctors = filterDoctors(approvedDoctors);

    return (
      <div className="admin-dashboard-content">
        <div className="view-header">
          <button className="back-button" onClick={backToDashboard}>
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h2>Approved Doctors</h2>
        </div>

        <div className="admin-filters">
          <input
            type="text"
            placeholder="Search approved doctors..."
            className="admin-search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <select
            className="admin-filter"
            value={specializationFilter}
            onChange={handleSpecializationChange}
          >
            <option value="">All Specializations</option>
            {getAllSpecializations().map((specialization) => (
              <option key={specialization} value={specialization}>
                {specialization}
              </option>
            ))}
          </select>
        </div>

        <div className="doctors-list">
          {filteredApprovedDoctors.length === 0 ? (
            <div className="no-doctors">
              <p>No approved doctors match your filters.</p>
            </div>
          ) : (
            filteredApprovedDoctors.map((doctor) => (
              <div className="doctor-card" key={doctor.id}>
                <div className="doctor-header">
                  <h3>{doctor.name}</h3>
                  <div className="doctor-status approved">
                    <span className="status-dot"></span>
                    {doctor.status}
                  </div>
                </div>

                <div className="doctor-details">
                  <div className="detail-group">
                    <div className="detail-item">
                      <span className="detail-label">Mobile:</span>
                      <span className="detail-value">{doctor.mobile}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{doctor.email}</span>
                    </div>
                  </div>

                  <div className="detail-group">
                    <div className="detail-item">
                      <span className="detail-label">City:</span>
                      <span className="detail-value">{doctor.city}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">State:</span>
                      <span className="detail-value">{doctor.state}</span>
                    </div>
                  </div>

                  <div className="detail-group">
                    <div className="detail-item">
                      <span className="detail-label">Specialization:</span>
                      <span className="detail-value">
                        {doctor.specialization}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Qualification:</span>
                      <span className="detail-value">
                        {doctor.qualification}
                      </span>
                    </div>
                  </div>

                  <div className="detail-group">
                    <div className="detail-item">
                      <span className="detail-label">Hospital/Clinic:</span>
                      <span className="detail-value">
                        {doctor.hospitalName}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Experience:</span>
                      <span className="detail-value">
                        {doctor.experience} years
                      </span>
                    </div>
                  </div>

                  <div className="detail-group">
                    <div className="detail-item">
                      <span className="detail-label">Approved On:</span>
                      <span className="detail-value">
                        {doctor.approvedDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Render rejected doctors view
  const renderRejectedDoctors = () => {
    const filteredRejectedDoctors = filterDoctors(rejectedDoctors);

    return (
      <div className="admin-dashboard-content">
        <div className="view-header">
          <button className="back-button" onClick={backToDashboard}>
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h2>Rejected Doctors</h2>
        </div>

        <div className="admin-filters">
          <input
            type="text"
            placeholder="Search rejected doctors..."
            className="admin-search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <select
            className="admin-filter"
            value={specializationFilter}
            onChange={handleSpecializationChange}
          >
            <option value="">All Specializations</option>
            {getAllSpecializations().map((specialization) => (
              <option key={specialization} value={specialization}>
                {specialization}
              </option>
            ))}
          </select>
        </div>

        <div className="doctors-list">
          {filteredRejectedDoctors.length === 0 ? (
            <div className="no-doctors">
              <p>No rejected doctors match your filters.</p>
            </div>
          ) : (
            filteredRejectedDoctors.map((doctor) => (
              <div className="doctor-card" key={doctor.id}>
                <div className="doctor-header">
                  <h3>{doctor.name}</h3>
                  <div className="doctor-status rejected">Rejected</div>
                </div>

                <div className="doctor-details">
                  <div className="detail-group">
                    <div className="detail-item">
                      <span className="detail-label">Mobile:</span>
                      <span className="detail-value">{doctor.mobile}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{doctor.email}</span>
                    </div>
                  </div>

                  <div className="detail-group">
                    <div className="detail-item">
                      <span className="detail-label">City:</span>
                      <span className="detail-value">{doctor.city}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">State:</span>
                      <span className="detail-value">{doctor.state}</span>
                    </div>
                  </div>

                  <div className="detail-group">
                    <div className="detail-item">
                      <span className="detail-label">Specialization:</span>
                      <span className="detail-value">
                        {doctor.specialization}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Qualification:</span>
                      <span className="detail-value">
                        {doctor.qualification}
                      </span>
                    </div>
                  </div>

                  <div className="detail-group">
                    <div className="detail-item">
                      <span className="detail-label">Hospital/Clinic:</span>
                      <span className="detail-value">
                        {doctor.hospitalName}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Experience:</span>
                      <span className="detail-value">
                        {doctor.experience} years
                      </span>
                    </div>
                  </div>

                  <div className="detail-group">
                    <div className="detail-item">
                      <span className="detail-label">Rejected On:</span>
                      <span className="detail-value">
                        {doctor.rejectedDate}
                      </span>
                    </div>
                  </div>

                  <div className="detail-item reason-item">
                    <span className="detail-label">Rejection Reason:</span>
                    <span className="detail-value reason-value">
                      {doctor.rejectionReason}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Render settings view
  const renderSettings = () => {
    return (
      <div className="admin-dashboard-content">
        <div className="view-header">
          <button className="back-button" onClick={backToDashboard}>
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h2>Admin Settings</h2>
        </div>

        {showOtpModal && (
          <div className="modal-overlay">
            <div className="otp-modal">
              <div className="modal-header">
                <h3>Email Verification</h3>
                <button className="close-modal" onClick={closeModal}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <p>
                  An OTP has been sent to <strong>{newEmail}</strong>
                </p>
                <p>
                  Please enter the 6-digit code to verify your new email
                  address.
                </p>
                <div className="otp-input-container">
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="otp-input"
                  />
                </div>
                <div className="otp-actions">
                  <button className="admin-action-button" onClick={verifyOtp}>
                    Verify OTP
                  </button>
                  <button className="resend-otp" onClick={resendOtp}>
                    Resend OTP
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="settings-container">
          <div className="settings-card">
            <h3>Account Settings</h3>
            <div className="settings-form">
              <div className="settings-group">
                <label>Change Email</label>
                <div className="input-with-button">
                  <input
                    type="email"
                    placeholder="Enter new email address"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                  <button
                    className="admin-action-button"
                    onClick={handleEmailUpdate}
                  >
                    Update Email
                  </button>
                </div>
              </div>
              <div className="settings-group">
                <label>Change Password</label>
                <div className="password-fields">
                  <input
                    type="password"
                    placeholder="Current password"
                    className="password-input"
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    className="password-input"
                  />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="password-input"
                  />
                  <button className="admin-action-button">
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the appropriate view based on activeView state
  const renderContent = () => {
    switch (activeView) {
      case "doctors":
        return renderDoctorRequests();
      case "approved":
        return renderApprovedDoctors();
      case "rejected":
        return renderRejectedDoctors();
      case "settings":
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return <AdminLayout>{renderContent()}</AdminLayout>;
}

export default AdminDashboard;

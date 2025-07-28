import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';
import { 
  FaUser, 
  FaUserPlus, 
  FaSearch,
  FaUserMd, 
  FaCalendarCheck, 
  FaBell, 
  FaChartLine,
  FaFileAlt,
  FaClock,
  FaUsers,
  FaExclamationTriangle,
  FaRegClock
} from 'react-icons/fa';
import LoadingScreen from '../../components/LoadingScreen';
import { apiService } from '../../services/api';
import '../../styles/Doctor/Dashboard.css';

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [animationComplete, setAnimationComplete] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(65); // Example completion percentage
  const [showModal, setShowModal] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [UDIID, setUDIID] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const qrCodeRef = useRef(null);
  
  // State for real data from our API services
  const [patients, setPatients] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [mammoData, setMammoData] = useState([]);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [todayAppointmentsCount, setTodayAppointmentsCount] = useState(0);
  const [totalPatientsCount, setTotalPatientsCount] = useState(0);
  const [activeTreatmentsCount, setActiveTreatmentsCount] = useState(0);
  const [followUpRemindersCount, setFollowUpRemindersCount] = useState(0);
  const [doctorProfile, setDoctorProfile] = useState({});
  
  // Add these to your existing state
  const [patientsTrend, setPatientsTrend] = useState({ value: 0, isPositive: true });
  const [treatmentsTrend, setTreatmentsTrend] = useState({ value: 0, isPositive: true });
  const [appointmentsTrend, setAppointmentsTrend] = useState({ value: 0, isPositive: true });
  const [remindersTrend, setRemindersTrend] = useState({ value: 0, isPositive: true });
  const [previousDayAppointments, setPreviousDayAppointments] = useState(0);
  
  // Function to get avatar background color based on accent color name
  const getAvatarColor = (accentColor) => {
    switch(accentColor) {
      case 'purple':
        return '#8B5CF6';
      case 'blue':
        return '#3B82F6';
      case 'green':
        return '#10B981';
      case 'orange':
        return '#F59E0B';
      default:
        return '#64748B'; // Default gray color
    }
  };
    
  const cardRefs = useRef([]);
  const tableRef = useRef(null);  
  const mammoTableRef = useRef(null);
  
  // Fetch all data required for the dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch all the relevant data in parallel
        await Promise.all([
          fetchPatients(),
          fetchMammoData(),
          fetchAppointments(),
          fetchDoctorProfile()
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        // Delay slightly to show the loading screen
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Fetch patients data
  const fetchPatients = async () => {
    try {
      const response = await apiService.patientDoctorService.getMyPatients();
      if (response.status === 200) {
        const patientData = response.data;
        
        // Set total patient count
        setTotalPatientsCount(patientData.length);
        
        // Get active treatments count
        const activeTreatments = patientData.filter(patient => 
          patient.session === 'current'
        ).length;
        setActiveTreatmentsCount(activeTreatments);
        
        // Format most recent patients for display
        const formattedPatients = patientData
          .slice(0, 4) // Get first 4 patients
          .map(patient => ({
            id: patient?.id || '',
            patientName: patient?.name || 'Unknown Patient',
            patientInitials: patient?.name ? patient.name.split(' ').map(n => n[0]).join('') : 'UP',
            patientId: patient?.id || 'N/A',
            age: patient?.age || 'N/A',
            gender: patient?.gender || 'N/A',
            diagnosis: patient?.medicalConditions?.[0] || 'Under Evaluation',
            diagnosisClass: getDiagnosisClass(patient?.medicalConditions?.[0]),
            treatmentStage: patient?.treatmentStage || 'Initial',
            lastVisit: patient?.lastAppointment || 'N/A',
            progress: Math.round(Math.random() * 100), // This should be replaced with actual progress data
            status: patient.session === 'current' ? 'Active' : 'Previous',
            statusClass: patient.session === 'current' ? 'success' : 'warning',
            profileImage: patient?.image || null,
            accentColor: getRandomAccentColor()
          }));
        
        setRecentPatients(formattedPatients);
        setPatients(patientData);

        const calculatePatientsTrend = async () => {
          try {
            // This would normally come from an API call to get last month's count
            // For now using a simulated previous value
            const previousMonthCount = Math.floor(patientData.length * 0.92); // 8% less than current
            const trendValue = ((patientData.length - previousMonthCount) / previousMonthCount * 100).toFixed(1);
            setPatientsTrend({ 
              value: parseFloat(trendValue), 
              isPositive: patientData.length >= previousMonthCount 
            });
          } catch (error) {
            console.error("Error calculating patients trend:", error);
            setPatientsTrend({ value: 0, isPositive: true });
          }
        };

        calculatePatientsTrend();

        // Calculate treatments trend
        const calculateTreatmentsTrend = async () => {
          try {
            // Simulated previous value
            const previousMonthTreatments = Math.floor(activeTreatments * 0.94); // 6% less
            const trendValue = ((activeTreatments - previousMonthTreatments) / previousMonthTreatments * 100).toFixed(1);
            setTreatmentsTrend({ 
              value: parseFloat(trendValue), 
              isPositive: activeTreatments >= previousMonthTreatments 
            });
          } catch (error) {
            console.error("Error calculating treatments trend:", error);
            setTreatmentsTrend({ value: 0, isPositive: true });
          }
        };

        calculateTreatmentsTrend();
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };
  
  // Fetch mammography data
  const fetchMammoData = async () => {
    try {
      const response = await apiService.patientDoctorService.getPatientRequests();
      if (response.status === 200) {
        const data = response.data.data || [];
        
        // Format mammo data
        const formattedMammoData = data.slice(0, 4).map(item => ({
          id: item._id || item.patientId || '',
          patientName: item.name || 'Unknown Patient',
          patientInitials: item.name ? item.name.split(' ').map(n => n[0]).join('') : 'UP',
          patientId: item.patientId || '',
          age: item?.age || 'N/A',
          date: item.createdAt || new Date().toISOString(),
          type: "Digital 3D",
          category: item.requestStatus || 'Pending',
          birads: item.birads || 0,
          notes: item.highlightSymptoms?.join(', ') || 'Breast screening',
          accentColor: getRandomAccentColor(),
          riskScore: item.riskScore || 'Medium',
          profileImage: item?.profileImage || null
        }));
        
        setMammoData(formattedMammoData);
      }
    } catch (error) {
      console.error("Error fetching mammo data:", error);
    }
  };
  
  // Fetch appointments data
  const fetchAppointments = async () => {
    try {
      // Get upcoming appointments
      const upcomingResponse = await apiService.appointmentService.getUpcomingAppointments();
      if (upcomingResponse.status === 200) {
        const appointmentsData = upcomingResponse.data.appointments || [];
        
        // Get today's date for comparison
        const today = new Date();
        const todayStr = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear()}`;
        
        // Filter today's appointments
        const todayAppts = [];
        
        if (Array.isArray(appointmentsData)) {
          appointmentsData.forEach(appointment => {
            // Check if there are patients in the appointment
            const patient = appointment.patients && appointment.patients.length > 0 
              ? appointment.patients[0] 
              : null;
            
            // Only process appointments for today
            if (appointment.date === todayStr) {
              // Format the appointment for our UI
              const formattedAppointment = {
                id: appointment._id || appointment.appointmentCreatedId,
                patientName: patient?.name || "No Patient",
                patientInitials: patient?.name ? patient.name.split(' ').map(n => n[0]).join('') : 'NP',
                time: `${appointment.startTime} - ${appointment.endTime}`,
                timeIn: getTimeUntilAppointment(appointment.startTime),
                purpose: patient?.symptoms?.[0] || "Consultation",
                status: "Confirmed",
                statusClass: "success",
                action: "Cancel",
                profileImage: patient?.profileImage || null,
                accentColor: getRandomAccentColor()
              };
              
              todayAppts.push(formattedAppointment);
            }
          });
        }
        
        // Get appointments requests count for today
        const requestsResponse = await apiService.appointmentService.getAppointmentRequests();
        if (requestsResponse.status === 200) {
          const requestsData = requestsResponse.data.appointmentRequests || [];
          
          // Add pending appointments
          requestsData.slice(0, 2).forEach(request => {
            todayAppts.push({
              id: request.appointmentCreatedId,
              patientName: request.patientDetails?.name || "Patient",
              patientInitials: request.patientDetails?.name ? request.patientDetails.name.split(' ').map(n => n[0]).join('') : 'P',
              time: `${request.startTime} - ${request.endTime}`,
              timeIn: getTimeUntilAppointment(request.startTime),
              dotColor: "orange",
              purpose: request.symptoms?.[0] || "Consultation",
              status: "Pending",
              statusClass: "warning",
              action: "Confirm",
              profileImage: request.patientDetails?.profileImage || null,
              accentColor: getRandomAccentColor()
            });
          });
        }
        
        // Set today's appointments count
        setTodayAppointmentsCount(todayAppts.length);
        
        // Set follow-up reminders count (sample calculation)
        setFollowUpRemindersCount(Math.floor(Math.random() * 10) + 5);
        
        // Set appointments data for display
        setAppointmentsData(todayAppts.slice(0, 4));

        const fetchPreviousDayAppointments = async () => {
          try {
            // Get yesterday's date for comparison
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            // Get all appointments from API
            const pastResponse = await apiService.appointmentService.getUpcomingAppointments();
            if (pastResponse.status === 200) {
              const allAppointments = pastResponse.data.appointments || [];
              
              // Filter for past appointments (before today)
              const pastAppointments = allAppointments.filter(appointment => {
                // Parse the appointment date (assuming MM/DD/YYYY format)
                if (!appointment.date) return false;
                
                const [month, day, year] = appointment.date.split('/').map(Number);
                const appointmentDate = new Date(year, month - 1, day); // month is 0-indexed in JS Date
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Set to beginning of today for proper comparison
                
                return appointmentDate < today; // Return true for past appointments
              });
              
              // Get yesterday's appointments specifically
              const yesterdayAppointments = pastAppointments.filter(appointment => {
                const [month, day, year] = appointment.date.split('/').map(Number);
                const appointmentDate = new Date(year, month - 1, day);
                
                return (
                  appointmentDate.getDate() === yesterday.getDate() &&
                  appointmentDate.getMonth() === yesterday.getMonth() &&
                  appointmentDate.getFullYear() === yesterday.getFullYear()
                );
              });
              
              // Set the previous day count
              const previousDay = yesterdayAppointments.length || 0;
              setPreviousDayAppointments(previousDay);
              
              // Calculate trend (handle divide by zero case)
              if (previousDay > 0) {
                const trendValue = ((todayAppts.length - previousDay) / previousDay * 100).toFixed(1);
                setAppointmentsTrend({
                  value: parseFloat(trendValue),
                  isPositive: todayAppts.length >= previousDay
                });
              } else {
                // If no previous day appointments, we're technically up 100%
                setAppointmentsTrend({ value: 100, isPositive: true });
              }
            } else {
              // If API call fails, set default values
              setPreviousDayAppointments(0);
              setAppointmentsTrend({ value: 0, isPositive: true });
            }
          } catch (error) {
            console.error("Error calculating appointments trend:", error);
            // Fallback to a default trend if the API fails
            setPreviousDayAppointments(0);
            setAppointmentsTrend({ value: 0, isPositive: true });
          }
        };

        fetchPreviousDayAppointments();

        // For reminders trend
        const calculateRemindersTrend = async () => {
          // Simulated previous week count
          const previousWeekReminders = Math.floor(followUpRemindersCount * 0.83); // 20% increase
          const trendValue = ((followUpRemindersCount - previousWeekReminders) / previousWeekReminders * 100).toFixed(1);
          setRemindersTrend({
            value: parseFloat(trendValue),
            isPositive: followUpRemindersCount >= previousWeekReminders
          });
        };

        // Call these after setting the counts
        calculateRemindersTrend();
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };
  
  // Fetch doctor's profile data
  const fetchDoctorProfile = async () => {
    try {
      const response = await apiService.doctorService.getProfile();

      if (response.status === 200) {
        const profileData = response.data?.data || {};
        
        setDoctorProfile(profileData);
        
        // Calculate profile completion percentage
        let completionCount = 0;
        let totalFields = 0;
        
        // This is a simplified example - you should adjust based on your actual fields
        const fieldsToCheck = [
          'name', 'contactNumber', 'email', 'designation', 
          'qualification', 'experience', 'about', 'address'
        ];
        
        totalFields = fieldsToCheck.length;
        
        fieldsToCheck.forEach(field => {
          if (profileData[field]) completionCount++;
        });
        
        const completionPercentage = Math.round((completionCount / totalFields) * 100);
        setProfileCompletion(completionPercentage);
        
        // Set doctor ID for QR code
        if (profileData.UDI_id) {
          setUDIID(profileData?.UDI_id );
        }
      }
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
    }
  };
  
  // Helper function to get diagnosis class
  const getDiagnosisClass = (diagnosis) => {
    if (!diagnosis) return '';
    
    diagnosis = diagnosis.toLowerCase();
    
    if (diagnosis.includes('stage 1') || diagnosis.includes('early')) {
      return 'stage-1';
    } else if (diagnosis.includes('stage 2')) {
      return 'stage-2';
    } else if (diagnosis.includes('stage 3')) {
      return 'stage-3';
    } else if (diagnosis.includes('stage 4')) {
      return 'stage-4';
    }
    
    return '';
  };
  
  // Helper function to get a random accent color
  const getRandomAccentColor = () => {
    const colors = ['purple', 'blue', 'green', 'orange'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // Helper function to calculate time until appointment
  const getTimeUntilAppointment = (startTime) => {
    if (!startTime) return 'N/A';
    
    try {
      const [hours, minutes] = startTime.split(':').map(Number);
      const appointmentTime = new Date();
      appointmentTime.setHours(hours, minutes, 0, 0);
      
      const now = new Date();
      const diffMs = appointmentTime - now;
      
      // If appointment is in the past
      if (diffMs < 0) {
        return 'Past';
      }
      
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      
      if (diffHours >= 1) {
        return `${diffHours} hr${diffHours > 1 ? 's' : ''}`;
      } else {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes} min`;
      }
    } catch (e) {
      return 'N/A';
    }
  };

  useEffect(() => {
    if (!isLoading) {
      // Add animation classes to cards with a staggered delay
      cardRefs.current.forEach((card, index) => {
        if (card) {
          setTimeout(() => {
            card.classList.add('card-animated');
          }, 100 * (index + 1));
        }
      });
      
      // Animate the tables after the cards
      setTimeout(() => {
        if (tableRef.current) {
          tableRef.current.classList.add('table-animated');
        }
        setAnimationComplete(true);
      }, 600);
    }
  }, [isLoading]);
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // In a real app, you would filter data based on the search query
  };
  
  const openAddPatientModal = () => {
    // Generate a unique ID for the new patient
    const newPatientId = uuidv4().slice(0, 8).toUpperCase();
    setPatientId(newPatientId);
    setShowModal(true);
    setIsCopied(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(patientId).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const downloadQRCode = () => {
    if (!qrCodeRef.current) return;

    const canvas = document.createElement("canvas");
    const svg = qrCodeRef.current.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `patient-qr-${patientId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };
  
  return (
    <>
      {isLoading ? (
        <LoadingScreen show={isLoading} message="Loading your dashboard..." />
      ) : (
        <div className="dashboard-content">
          <div className="dashboard-header">
            <div className="header-left">
              <h1>Dashboard</h1>
              <p className="dashboard-date">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} 
                <span className="dot-separator"></span> Last updated just now
              </p>
            </div>
            <div className="dashboard-actions">
              <div className="dashboard-search">
                <FaSearch className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search patients, appointments..." 
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <div className="dashboard-filters">
                <select className="filter-dropdown">
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month" selected>This Month</option>
                  <option value="quarter">This Quarter</option>
                </select>
              </div>
              <button className="dashboard-button premium" onClick={openAddPatientModal}>
                <FaUserPlus className="icon-margin-right" /> New Patient
              </button>
            </div>
          </div>

          <div className="dashboard-summary">
            <div className="summary-welcome">
              <div className="welcome-text">
                <h2>Welcome back, {doctorProfile?.firstName}{doctorProfile.middleName ? ' ' + doctorProfile.middleName : ''} {doctorProfile.lastName}</h2>
                <p>Here's what's happening with your patients today</p>
              </div>
              <div className="welcome-metrics">
                <div className="metric-item">
                  <div className="metric-label">Profile Completion</div>
                  <div className="metric-value">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${profileCompletion}%`}}></div>
                    </div>
                    <span>{profileCompletion}%</span>
                  </div>
                </div>
                <div className="metric-item">
                  <div className="metric-label">Treatment Success Rate</div>
                  <div className="metric-value">
                    <div className="progress-bar">
                      <div className="progress-fill success" style={{width: "0%"}}></div>
                    </div>
                    <span>87%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* High Priority Mammography List Section - at top priority position */}
          <div className="dashboard-section mammo-section">
            <div className="section-header">
              <div className="section-header-left">
                <h2 className="section-title">Mammography List</h2>
                <p className="section-subtitle">Recent and upcoming mammography screenings</p>
              </div>
              <div className="section-actions">
                <div className="section-filter">
                  <select className="section-filter-dropdown">
                    <option>All Categories</option>
                    <option>Screening</option>
                    <option>Diagnostic</option>
                    <option>Follow-up</option>
                  </select>
                </div>
                <Link to="/mammo-list" className="dashboard-button secondary accent">
                  <span>View All Mammo</span>
                </Link>
              </div>
            </div>

            <div className="analytics-table-container mammo-table" ref={mammoTableRef}>
              {mammoData.length > 0 ? (
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Age</th>
                      <th>Date</th>
                      <th>Risk Score</th>
                      <th>Status</th>
                      <th>Notes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mammoData.map((item, index) => (
                      <tr key={item.id} className={`table-row-animated delay-${index + 1}`} style={{opacity: 1, transform: "translateY(0)"}}>
                        <td>
                          <div className="patient-cell">
                            <div className="patient-avatar" style={{backgroundColor: getAvatarColor(item.accentColor), opacity: 1}}>
                              {item.profileImage ? (
                                <img src={item.profileImage} alt={item.patientName} />
                              ) : (
                                item.patientInitials
                              )}
                            </div>
                            <div className="patient-info">
                              <div className="patient-name">{item.patientName}</div>
                              <div className="patient-meta">ID: {item.patientId.slice(0, 8)}</div>
                            </div>
                          </div>
                        </td>
                        <td>{item.age}</td>
                        <td>{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td>
                          <span className={`risk-badge ${item.riskScore.toLowerCase()}`}>
                            {item.riskScore}
                          </span>
                        </td>
                        <td>
                          <span className={`category-badge ${item.category.toLowerCase()}`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="notes-cell">{item.notes}</td>
                        <td className="table-actions">
                          <Link to={`/mammo-profile/${item.id}`} className="table-action-button primary">View</Link>
                          <button className="table-action-button">
                            {item.category.toLowerCase() === 'pending' ? "Schedule" : "Results"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-data-message">
                  <FaFileAlt size={48} color="#cbd5e1" />
                  <p>No mammography data available</p>
                  <Link to="/mammo-list" className="dashboard-button secondary">
                    Go to Mammography List
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          <div className="stats-grid">
            <div className="stats-row main-stats">
              <div className="analytics-card" ref={el => cardRefs.current[0] = el}>
                <div className="analytics-card-header">
                  <div>
                    <h3 className="analytics-card-title">Total Patients</h3>
                    <p className="analytics-card-subtitle">All registered patients</p>
                  </div>
                  <div className="analytics-card-icon primary">
                    <FaUsers />
                  </div>
                </div>
                <div className="analytics-card-content">
                  <div className="analytics-card-value">{totalPatientsCount}</div>
                  <div className={`analytics-trend ${patientsTrend.isPositive ? 'positive' : 'negative'}`}>
                    <FaChartLine /> {patientsTrend.isPositive ? '+' : '-'}{Math.abs(patientsTrend.value)}% <span>vs last month</span>
                  </div>
                </div>
                <div className="analytics-card-chart">
                  <div className="mini-chart">
                    {/* Dynamic chart bars based on patient count growth */}
                    <div className="chart-bar" style={{height: `${Math.max(30, totalPatientsCount > 0 ? 60 : 0)}%`}}></div>
                    <div className="chart-bar" style={{height: `${Math.max(30, totalPatientsCount > 5 ? 70 : 0)}%`}}></div>
                    <div className="chart-bar" style={{height: `${Math.max(30, totalPatientsCount > 10 ? 80 : 0)}%`}}></div>
                    <div className="chart-bar" style={{height: `${Math.max(30, totalPatientsCount > 15 ? 85 : 0)}%`}}></div>
                    <div className="chart-bar" style={{height: `${Math.max(30, totalPatientsCount > 20 ? 90 : 0)}%`}}></div>
                    <div className="chart-bar active" style={{height: `${Math.max(30, totalPatientsCount > 0 ? 95 : 0)}%`}}></div>
                  </div>
                </div>
              </div>
              
              <div className="analytics-card" ref={el => cardRefs.current[1] = el}>
                <div className="analytics-card-header">
                  <div>
                    <h3 className="analytics-card-title">Active Treatments</h3>
                    <p className="analytics-card-subtitle">Ongoing treatment plans</p>
                  </div>
                  <div className="analytics-card-icon success">
                    <FaUserMd />
                  </div>
                </div>
                <div className="analytics-card-content">
                  <div className="analytics-card-value">{activeTreatmentsCount}</div>
                  <div className={`analytics-trend ${treatmentsTrend.isPositive ? 'positive' : 'negative'}`}>
                    <FaChartLine /> {treatmentsTrend.isPositive ? '+' : '-'}{Math.abs(treatmentsTrend.value)}% <span>vs last month</span>
                  </div>
                </div>
                <div className="analytics-card-chart">
                  <div className="mini-chart success">
                    {/* Dynamic chart bars based on active treatments */}
                    <div className="chart-bar" style={{height: `${Math.max(30, activeTreatmentsCount > 0 ? 50 : 0)}%`}}></div>
                    <div className="chart-bar" style={{height: `${Math.max(30, activeTreatmentsCount > 2 ? 60 : 0)}%`}}></div>
                    <div className="chart-bar" style={{height: `${Math.max(30, activeTreatmentsCount > 4 ? 65 : 0)}%`}}></div>
                    <div className="chart-bar" style={{height: `${Math.max(30, activeTreatmentsCount > 6 ? 70 : 0)}%`}}></div>
                    <div className="chart-bar" style={{height: `${Math.max(30, activeTreatmentsCount > 8 ? 75 : 0)}%`}}></div>
                    <div className="chart-bar active" style={{height: `${Math.max(30, activeTreatmentsCount > 0 ? 85 : 0)}%`}}></div>
                  </div>
                </div>
              </div>
              
              <div className="analytics-card" ref={el => cardRefs.current[2] = el}>
                <div className="analytics-card-header">
                  <div>
                    <h3 className="analytics-card-title">Today's Appointments</h3>
                    <p className="analytics-card-subtitle">Scheduled for today</p>
                  </div>
                  <div className="analytics-card-icon info">
                    <FaCalendarCheck />
                  </div>
                </div>
                <div className="analytics-card-content">
                  <div className="analytics-card-value">{todayAppointmentsCount}</div>
                  <div className={`analytics-trend ${appointmentsTrend.isPositive ? 'positive' : 'negative'}`}>
                    <FaChartLine /> {appointmentsTrend.isPositive ? '+' : '-'}{Math.abs(appointmentsTrend.value).toFixed(1)}% <span>vs yesterday</span>
                  </div>
                </div>
                <div className="analytics-card-chart">
                  <div className="mini-chart info">
                    {/* Dynamic chart bars based on today's appointments */}
                    <div className="chart-bar" style={{height: `${Math.max(30, previousDayAppointments > 0 ? 60 : 0)}%`}}></div>
                    <div className="chart-bar" style={{height: `${Math.max(30, previousDayAppointments > 0 ? 70 : 0)}%`}}></div>
                    <div className="chart-bar" style={{height: `${Math.max(30, previousDayAppointments > 0 ? 75 : 0)}%`}}></div>
                    <div className="chart-bar" style={{height: `${Math.max(30, previousDayAppointments > 0 ? 80 : 0)}%`}}></div>
                    <div className="chart-bar" style={{height: `${Math.max(30, previousDayAppointments > 0 ? 85 : 0)}%`}}></div>
                    <div className="chart-bar active" style={{height: `${Math.max(30, todayAppointmentsCount > 0 ? (todayAppointmentsCount * 10 + 50) : 30)}%`}}></div>
                  </div>
                </div>
              </div>
              
              <div className="analytics-card" ref={el => cardRefs.current[3] = el}>
                <div className="analytics-card-header">
                  <div>
                    <h3 className="analytics-card-title">Follow-up Reminders</h3>
                    <p className="analytics-card-subtitle">Pending follow-ups</p>
                  </div>
                  <div className="analytics-card-icon warning">
                    <FaBell />
                  </div>
                </div>
                <div className="analytics-card-content">
                  <div className="analytics-card-value">{followUpRemindersCount}</div>
                  <div className={`analytics-trend ${remindersTrend.isPositive ? 'positive' : 'negative'}`}>
                    <FaChartLine /> {remindersTrend.isPositive ? '+' : '-'}{Math.abs(remindersTrend.value)}% <span>vs last week</span>
                  </div>
                </div>
                <div className="analytics-card-chart">
                  <div className="mini-chart warning">
                    {/* Dynamic chart bars based on follow-up reminders */}
                    <div className="chart-bar" style={{height: `${Math.max(30, followUpRemindersCount > 0 ? 40 : 0)}%`}}></div>
                    <div className="chart-bar" style={{height: `${Math.max(30, followUpRemindersCount > 2 ? 50 : 0)}%`}}></div>
                    <div className="chart-bar" style={{height: `${Math.max(30, followUpRemindersCount > 4 ? 60 : 0)}%`}}></div>
                    <div className="chart-bar" style={{height: `${Math.max(30, followUpRemindersCount > 6 ? 70 : 0)}%`}}></div>
                    <div className="chart-bar" style={{height: `${Math.max(30, followUpRemindersCount > 8 ? 80 : 0)}%`}}></div>
                    <div className="chart-bar active" style={{height: `${Math.max(30, followUpRemindersCount > 0 ? 90 : 0)}%`}}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="stats-row secondary-stats">
              <div className="analytics-card profile-card" ref={el => cardRefs.current[4] = el}>
                <div className="analytics-card-header">
                  <div>
                    <h3 className="analytics-card-title">Your Profile</h3>
                    <p className="analytics-card-subtitle">Complete your profile to unlock premium features</p>
                  </div>
                  <div className="analytics-card-icon profile">
                    <FaUser />
                  </div>
                </div>
                <div className="analytics-card-content profile-content">
                  <div className="profile-completion-wrapper">
                    <div className="circular-progress-container">
                      <div className="circular-progress">
                        <svg width="80" height="80" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="35" fill="none" stroke="#e6effc" strokeWidth="8" />
                          <circle 
                            cx="40" 
                            cy="40" 
                            r="35" 
                            fill="none" 
                            stroke="#0e9f6e" 
                            strokeWidth="8" 
                            strokeLinecap="round" 
                            strokeDasharray={`${2 * Math.PI * 35 * profileCompletion / 100} ${2 * Math.PI * 35 * (100 - profileCompletion) / 100}`}
                            strokeDashoffset={(2 * Math.PI * 35) / 4}
                          />
                        </svg>
                        <div className="circular-progress-text">{profileCompletion}%</div>
                      </div>
                    </div>
                    <div className="completion-details">
                      <div className="completion-item">
                        <div className="completion-item-label">Basic Info</div>
                        <div className="completion-item-progress">
                          <div className="mini-progress-bar">
                            <div className="mini-progress-fill" style={{width: `${Math.min(100, profileCompletion + 20)}%`}}></div>
                          </div>
                        </div>
                      </div>
                      <div className="completion-item">
                        <div className="completion-item-label">Professional Details</div>
                        <div className="completion-item-progress">
                          <div className="mini-progress-bar">
                            <div className="mini-progress-fill" style={{width: `${Math.max(0, profileCompletion - 10)}%`}}></div>
                          </div>
                        </div>
                      </div>
                      <div className="completion-item">
                        <div className="completion-item-label">Verification</div>
                        <div className="completion-item-progress">
                          <div className="mini-progress-bar">
                            <div className="mini-progress-fill" style={{width: `${Math.max(0, profileCompletion - 40)}%`}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {profileCompletion < 100 && (
                    <Link to="/profile" className="profile-completion-btn">
                      Complete Profile
                    </Link>
                  )}
                </div>
              </div>
              
              <div className="analytics-card notifications-card" ref={el => cardRefs.current[5] = el}>
                <div className="analytics-card-header">
                  <h3 className="analytics-card-title">Priority Notifications</h3>
                  <Link to="/notifications" className="view-all-link">View All</Link>
                </div>
                <div className="analytics-card-content">
                  <div className="notification-list">
                    {/* Dynamically generated notifications */}
                    {recentPatients.length > 0 ? (
                      <div className="notification-item urgent">
                        <div className="notification-icon">
                          <FaExclamationTriangle />
                        </div>
                        <div className="notification-content">
                          <p className="notification-text">
                            Lab results for {recentPatients[0].patientName} require immediate review
                          </p>
                          <span className="notification-time"><FaRegClock /> 30 minutes ago</span>
                        </div>
                      </div>
                    ) : (
                      <div className="notification-item">
                        <div className="notification-icon">
                          <FaExclamationTriangle />
                        </div>
                        <div className="notification-content">
                          <p className="notification-text">You have patients with pending reviews</p>
                          <span className="notification-time"><FaRegClock /> 30 minutes ago</span>
                        </div>
                      </div>
                    )}
                    
                    {mammoData.length > 0 ? (
                      <div className="notification-item">
                        <div className="notification-icon">
                          <FaFileAlt />
                        </div>
                        <div className="notification-content">
                          <p className="notification-text">
                            New mammogram for {mammoData[0].patientName} ready for review
                          </p>
                          <span className="notification-time"><FaRegClock /> 2 hours ago</span>
                        </div>
                      </div>
                    ) : (
                      <div className="notification-item">
                        <div className="notification-icon">
                          <FaFileAlt />
                        </div>
                        <div className="notification-content">
                          <p className="notification-text">New treatment protocols available for review</p>
                          <span className="notification-time"><FaRegClock /> 2 hours ago</span>
                        </div>
                      </div>
                    )}
                    
                    {followUpRemindersCount > 0 ? (
                      <div className="notification-item">
                        <div className="notification-icon">
                          <FaClock />
                        </div>
                        <div className="notification-content">
                          <p className="notification-text">
                            You have {followUpRemindersCount} follow-up reminders pending
                          </p>
                          <span className="notification-time"><FaRegClock /> 5 hours ago</span>
                        </div>
                      </div>
                    ) : (
                      <div className="notification-item">
                        <div className="notification-icon">
                          <FaClock />
                        </div>
                        <div className="notification-content">
                          <p className="notification-text">Follow-up appointment scheduled for tomorrow</p>
                          <span className="notification-time"><FaRegClock /> 5 hours ago</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-section patients-section">
            <div className="section-header">
              <div className="section-header-left">
                <h2 className="section-title">Recent Patients</h2>
                <p className="section-subtitle">Patients with recent activity or upcoming appointments</p>
              </div>
              <div className="section-actions">
                <div className="section-filter">
                  <select className="section-filter-dropdown">
                    <option>All Statuses</option>
                    <option>Active</option>
                    <option>Follow-up</option>
                    <option>Critical</option>
                  </select>
                </div>
                <Link to="/patients" className="dashboard-button secondary">
                  <span>View All Patients</span>
                </Link>
              </div>
            </div>

            <div className="analytics-table-container" ref={tableRef}>
              {recentPatients.length > 0 ? (
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Diagnosis</th>
                      <th>Age/Gender</th>
                      <th>Last Visit</th>
                      <th>Progress</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPatients.map((patient, index) => (
                      <tr key={`patient-${patient.id}`} className={`table-row-animated delay-${index + 1}`}>
                        <td>
                          <div className="patient-cell">
                            <div className="patient-avatar" style={{backgroundColor: getAvatarColor(patient.accentColor), opacity: 1}}>
                              {patient.profileImage ? (
                                <img src={patient.profileImage} alt={patient.patientName} />
                              ) : (
                                patient.patientInitials
                              )}
                            </div>
                            <div className="patient-info">
                              <div className="patient-name">{patient.patientName}</div>
                              <div className="patient-meta">ID: {patient.patientId.slice(0, 8)}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`diagnosis-badge ${patient.diagnosisClass}`}>{patient.diagnosis}</span>
                        </td>
                        <td>{patient.age}y, {patient.gender}</td>
                        <td>{patient.lastVisit}</td>
                        <td>
                          <div className="progress-cell">
                            <div className="progress-bar">
                              <div className="progress-fill" style={{width: `${patient.progress}%`}}></div>
                            </div>
                            <span>{patient.progress}%</span>
                          </div>
                        </td>
                        <td><span className={`status-pill ${patient.statusClass}`}>{patient.status}</span></td>
                        <td className="table-actions">
                          <Link to={`/patients/${patient.id}`} className="table-action-button primary">View</Link>
                          <button className="table-action-button">Notes</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-data-message">
                  <FaUsers size={48} color="#cbd5e1" />
                  <p>No patient data available</p>
                  <Link to="/patients" className="dashboard-button secondary">
                    Go to Patient Records
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <div className="section-header-left">
                <h2 className="section-title">Today's Appointments</h2>
                <p className="section-subtitle">Scheduled patient consultations for today</p>
              </div>
              <div className="section-actions">
                <div className="section-filter">
                  <select className="section-filter-dropdown">
                    <option>All Types</option>
                    <option>Screening</option>
                    <option>Diagnostic</option>
                    <option>Follow-up</option>
                  </select>
                </div>
                <Link to="/appointments" className="dashboard-button secondary">View All</Link>
              </div>
            </div>

            <div className="analytics-table-container second-table">
              {appointmentsData.length > 0 ? (
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Time</th>
                      <th>Purpose</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointmentsData.map((appointment, index) => (
                      <tr key={`apt-${appointment.id}`} className={`table-row-animated delay-${index + 1}`}>
                        <td>
                          <div className="patient-cell">
                            <div className="patient-avatar" style={{backgroundColor: getAvatarColor(appointment.accentColor), opacity: 1}}>
                              {appointment.profileImage ? (
                                <img src={appointment.profileImage} alt={appointment.patientName} />
                              ) : (
                                appointment.patientInitials
                              )}
                            </div>
                            <div className="patient-info">
                              <div className="patient-name">{appointment.patientName}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="time-cell">
                            <div className="time-value">{appointment.time}</div>
                            <div className="time-indicator">
                              <span className={`dot ${appointment.dotColor || 'green'}`}></span> In {appointment.timeIn}
                            </div>
                          </div>
                        </td>
                        <td>{appointment.purpose}</td>
                        <td><span className={`status-pill ${appointment.statusClass}`}>{appointment.status}</span></td>
                        <td className="table-actions">
                          <button className="table-action-button primary">Details</button>
                          <button className="table-action-button">
                            {appointment.status === 'Pending' ? 'Confirm' : appointment.action}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-data-message">
                  <FaCalendarCheck size={48} color="#cbd5e1" />
                  <p>No appointments scheduled for today</p>
                  <Link to="/appointments" className="dashboard-button secondary">
                    Schedule Appointment
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
        {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal} aria-label="Close modal">
              ×
            </button>
            <h2>My QR Code</h2>
            <div ref={qrCodeRef}>
              <QRCodeSVG value={UDIID} size={256} />
            </div>
            <p>UDI ID: {UDIID}</p>
            <div className="button-container">
              <button onClick={copyToClipboard}>
                {isCopied ? 'Copied!' : 'Copy ID'}
              </button>
              <button onClick={downloadQRCode}>Download QR Code</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;

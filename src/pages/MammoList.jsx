import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaFilter, 
  FaFileAlt, 
  FaCalendarPlus,
  FaChartBar,
  FaDownload,
  FaUserCog,
  FaEllipsisV,
  FaSortAmountDown,
  FaSortAmountUp,
  FaClock,
  FaCalendarCheck,
  FaCheckCircle,
  FaQuestionCircle,
  FaPlusCircle
} from 'react-icons/fa';
import LoadingScreen from '../components/LoadingScreen';
import '../styles/MammoList.css';
import apiService from '../services/api';

function MammoList() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSortField, setActiveSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [patients, setPatients] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  
  const tableRef = useRef(null);
  const filterPanelRef = useRef(null);
    // Function to fetch patients data
  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      setRefreshing(true);
      
      try {
        const response = await apiService.patientDoctorService.getPatientRequests();
        if (response.status === 200) {
          const data = response.data.data;
          
         
          
          setPatients(
            data.map(item => ({
              ...item,
              id: item._id || item.patientId || '',
              requestStatus: item.requestStatus || 'pending',
              highlightSymptoms: Array.isArray(item.highlightSymptoms) 
                ? item.highlightSymptoms.slice(0, 3) 
                : ['Breast screening'],
              imageUrl: item?.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
              patientName: item
                ? `${item.name}` : 'Unknown Patient',
              age: item?.age || item.age || 'NA',
              date: item.createdAt || item.date || new Date().toISOString(),
              riskScore: item.riskScore || 'Medium',
              requestId: item.requestId || ''
            }))
          );
          
        } else {
          // Fallback to mock data if API doesn't return success
          console.warn('API did not return 200 status, using mock data instead');
        }
      } catch (apiError) {
        console.error('API error, using mock data instead:', apiError);
        // Fallback to mock data if API call fails
      }
      
    } catch (error) {
      console.error('Error fetching mammo patients:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };
    useEffect(() => {
    // Fetch patients when component mounts
    fetchPatients();
  }, []);
  
  useEffect(() => {
    if (!isLoading) {
      // Animate table after loading
      setTimeout(() => {
        if (tableRef.current) {
          tableRef.current.classList.add('table-animated');
        }
      }, 300);
    }
  }, [isLoading]);
    // Close filter panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterPanelRef.current && !filterPanelRef.current.contains(e.target) &&
          !e.target.closest('.filter-toggle-button')) {
        setShowFilterPanel(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Function to determine risk badge color based on risk level
  const getRiskColor = (riskScore) => {
    switch(riskScore.toLowerCase()) {
      case 'high':
        return '#FF6B6B'; // Red for high risk
      case 'medium':
        return '#FFAB4C'; // Orange for medium risk
      case 'low':
        return '#4CBB17'; // Green for low risk
      default:
        return '#64748B'; // Default slate color
    }
  };
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };
  
  const getFilteredPatients = () => {
    // Filter the data
    let filteredData = [...patients];
    
    if (activeFilter !== 'all') {
      filteredData = filteredData.filter(item => item.requestStatus.toLowerCase() === activeFilter.toLowerCase());
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredData = filteredData.filter(item => 
        item.patientName.toLowerCase().includes(query) || 
        item.patientId.toLowerCase().includes(query)
      );
    }
    
    // Sort the data
    filteredData.sort((a, b) => {
      let valueA, valueB;
      
      switch (activeSortField) {
        case 'name':
          valueA = a.patientName;
          valueB = b.patientName;
          break;
        case 'age':
          valueA = a.age;
          valueB = b.age;
          break;
        case 'date':
          valueA = new Date(a.date);
          valueB = new Date(b.date);
          break;
        case 'risk':
          const riskOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          valueA = riskOrder[a.riskScore] || 0;
          valueB = riskOrder[b.riskScore] || 0;
          break;
        default:
          valueA = new Date(a.date);
          valueB = new Date(b.date);
      }
      
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    return filteredData;
  };
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#FFD700';
      case 'scheduled': return '#4A90E2';
      case 'completed': return '#50C878';
      default: return '#888888';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return <FaClock />;
      case 'scheduled': return <FaCalendarCheck />;
      case 'completed': return <FaCheckCircle />;
      default: return <FaQuestionCircle />;
    }
  };    return (
    <>
      {isLoading ? (
        <LoadingScreen show={isLoading} message="Loading mammography data..." />
      ) : (
        <div className="mammo-list-container">
          <div className="mammo-list-header">
            <div className="header-content">
              <div className="header-left">
                <h1>Mammography List</h1>
                <p className="header-description">
                  Manage and track patient mammography screenings and diagnostics
                </p>
              </div>
              <div className="header-actions">
                <div className="search-container">
                  <FaSearch className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search by patient name or ID..." 
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-input"
                  />
                </div>                <div className="filter-container">
                  <button 
                    className="filter-toggle-button"
                    onClick={() => setShowFilterPanel(!showFilterPanel)}
                  >
                    <FaFilter /> Filter
                  </button>
                  
                  {showFilterPanel && (
                    <div className="filter-panel" ref={filterPanelRef}>
                      <h3>Filter Results</h3>
                      <div className="filter-options">
                        <button 
                          className={activeFilter === 'all' ? 'active' : ''}
                          onClick={() => handleFilterChange('all')}
                        >
                          All Patients
                        </button>
                        <button 
                          className={activeFilter === 'pending' ? 'active' : ''}
                          onClick={() => handleFilterChange('pending')}
                        >
                          Pending
                        </button>
                        <button 
                          className={activeFilter === 'scheduled' ? 'active' : ''}
                          onClick={() => handleFilterChange('scheduled')}
                        >
                          Scheduled
                        </button>
                        <button 
                          className={activeFilter === 'completed' ? 'active' : ''}
                          onClick={() => handleFilterChange('completed')}
                        >
                          Completed
                        </button>
                      </div>
                      
                      <h3>Risk Score</h3>
                      <div className="filter-options">
                        <button>All Risk Levels</button>
                        <button>High Risk</button>
                        <button>Medium Risk</button>
                        <button>Low Risk</button>
                      </div>
                      
                      <h3>Time Period</h3>
                      <div className="filter-options">
                        <button>Last 7 Days</button>
                        <button>Last 30 Days</button>
                        <button>Last 90 Days</button>
                        <button>Custom...</button>
                      </div>
                      
                      <div className="filter-actions">
                        <button className="apply-filters">Apply Filters</button>
                        <button className="reset-filters">Reset</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Stats Overview - from mobile app */}
            <div className="mammo-stats">
              <div className="stat-card">
                <div className="stat-value">{patients.length}</div>
                <div className="stat-label">Total Patients</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">
                  {patients.filter(p => p.riskScore.toLowerCase() === 'high').length}
                </div>
                <div className="stat-label">High Risk</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">
                  {patients.filter(p => p.requestStatus.toLowerCase() === 'pending').length}
                </div>
                <div className="stat-label">Pending</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">
                  {patients.filter(p => p.requestStatus.toLowerCase() === 'scheduled').length}
                </div>
                <div className="stat-label">Scheduled</div>
              </div>
            </div>
            
            {/* Category Filters - Like mobile app's filter buttons */}
            <div className="category-filters">
              <button 
                className={activeFilter === 'all' ? 'active' : ''}
                onClick={() => handleFilterChange('all')}
              >
                All Patients
                <span className="filter-count">{patients.length}</span>
              </button>
              <button 
                className={activeFilter === 'pending' ? 'active' : ''}
                onClick={() => handleFilterChange('pending')}
              >
                Pending
                <span className="filter-count">
                  {patients.filter(p => p.requestStatus.toLowerCase() === 'pending').length}
                </span>
              </button>
              <button 
                className={activeFilter === 'scheduled' ? 'active' : ''}
                onClick={() => handleFilterChange('scheduled')}
              >
                Scheduled
                <span className="filter-count">
                  {patients.filter(p => p.requestStatus.toLowerCase() === 'scheduled').length}
                </span>
              </button>
              <button 
                className={activeFilter === 'completed' ? 'active' : ''}
                onClick={() => handleFilterChange('completed')}
              >
                Completed
                <span className="filter-count">
                  {patients.filter(p => p.requestStatus.toLowerCase() === 'completed').length}
                </span>
              </button>
              
              <div className="sort-controls">
                <div className="sort-label">
                  Sort by:
                </div>
                <select 
                  className="sort-dropdown"
                  value={activeSortField}
                  onChange={(e) => {
                    setActiveSortField(e.target.value);
                    setSortDirection('desc');
                  }}
                >
                  <option value="date">Date (newest first)</option>
                  <option value="name">Patient Name</option>
                  <option value="risk">Risk Score</option>
                  <option value="age">Age</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Patient Cards Grid - Mobile app style */}
          <div className="patient-cards-grid">
            {getFilteredPatients().map((patient) => (
              <div key={patient.id} className="patient-card">                <div className="patient-card-header">
                  <div className="patient-image-container">
                    <img 
                      src={patient.imageUrl} 
                      alt={patient.patientName}
                      className="patient-image" 
                    />
                    <div 
                      className="risk-badge" 
                      style={{ backgroundColor: getRiskColor(patient.riskScore) }}
                    >
                      {patient.riskScore}
                    </div>
                  </div>
                  
                  <div className="patient-info">
                    <h3 className="patient-name">{patient.patientName}</h3>
                    <p className="patient-details">
                      {patient.age} years • {formatDate(patient.date)}
                    </p>
                    
                    <div className="symptoms-list">
                      {patient.highlightSymptoms.slice(0, 2).map((symptom, idx) => (
                        <span key={idx} className="symptom-badge">
                          {symptom}
                        </span>
                      ))}
                      {patient.highlightSymptoms.length > 2 && (
                        <span className="symptom-badge more-badge">
                          +{patient.highlightSymptoms.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="patient-card-actions">                  <div 
                    className="status-badge" 
                    style={{ 
                      backgroundColor: `${getStatusColor(patient.requestStatus)}20`,
                      color: getStatusColor(patient.requestStatus)
                    }}
                  >
                    <span className="status-icon">{getStatusIcon(patient.requestStatus)}</span>
                    <span className="status-text">
                      {patient.requestStatus.charAt(0).toUpperCase() + patient.requestStatus.slice(1)}
                    </span>
                    <div className="tooltip">
                      <span className="tooltip-title">
                        {patient.requestStatus.charAt(0).toUpperCase() + patient.requestStatus.slice(1)} Status
                      </span>
                      <div className="tooltip-info">
                        <div className="tooltip-info-item">
                          <span className="tooltip-label">Last Updated:</span>
                          <span>{formatDate(patient.date)}</span>
                        </div>
                        <div className="tooltip-info-item">
                          <span className="tooltip-label">Request ID:</span>
                          <span>#{patient.id.slice(0, 6)}</span>
                        </div>
                        {patient.requestStatus === 'pending' && (
                          <div className="tooltip-info-item">
                            <span className="tooltip-label">Est. Completion:</span>
                            <span>24-48 hours</span>
                          </div>
                        )}
                        {patient.requestStatus === 'completed' && (
                          <div className="tooltip-info-item">
                            <span className="tooltip-label">Completed On:</span>
                            <span>{formatDate(patient.date)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Link to={`/mammo-profile/${patient.id}?requestId=${patient.requestId}`} className="view-button">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
            
            {getFilteredPatients().length === 0 && (
              <div className="no-results">
                <div className="no-results-icon">
                  <FaFileAlt />
                </div>
                <h3 className="no-results-title">No patients found</h3>
                <p className="no-results-message">
                  There are no patients in this category yet
                </p>
              </div>
            )}
          </div>
          
          {/* Floating Add Button - like mobile FAB */}
          <div className="floating-add-button">
            <Link to="/add-patient" className="fab-button">
              <FaPlusCircle />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default MammoList;

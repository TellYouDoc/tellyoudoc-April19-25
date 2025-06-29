import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
  FaPlusCircle,
} from "react-icons/fa";
import LoadingScreen from "../components/LoadingScreen";
import "../styles/MammoList.css";
import apiService from "../services/api";

function MammoList() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeSortField, setActiveSortField] = useState("date-desc");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [patients, setPatients] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [riskFilter, setRiskFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  // Add temporary state variables to store filter selections before applying
  const [tempStatusFilter, setTempStatusFilter] = useState("all");
  const [tempRiskFilter, setTempRiskFilter] = useState("all");
  const [tempTimeFilter, setTempTimeFilter] = useState("all");

  const tableRef = useRef(null);
  const filterPanelRef = useRef(null);
  // Function to fetch patients data
  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      setRefreshing(true);

      try {
        const response =
          await apiService.patientDoctorService.getPatientRequests();
        if (response.status === 200) {
          const data = response.data.data;

          setPatients(
            data.map((item) => ({
              ...item,
              id: item._id || item.patientId || "",
              requestStatus: item.requestStatus || "pending",
              highlightSymptoms: Array.isArray(item.highlightSymptoms)
                ? item.highlightSymptoms.slice(0, 3)
                : ["Breast screening"],
              imageUrl:
                item?.profileImage ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
              patientName: item ? `${item.name}` : "Unknown Patient",
              age: item?.age || item.age || "NA",
              date: item.createdAt || item.date || new Date().toISOString(),
              riskScore: item.riskScore || "Medium",
              requestId: item.requestId || "",
            }))
          );
        } else {
          // Fallback to mock data if API doesn't return success
          console.warn(
            "API did not return 200 status, using mock data instead"
          );
        }
      } catch (apiError) {
        console.error("API error, using mock data instead:", apiError);
        // Fallback to mock data if API call fails
      }
    } catch (error) {
      console.error("Error fetching mammo patients:", error);
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
          tableRef.current.classList.add("table-animated");
        }
      }, 300);
    }
  }, [isLoading]);
  // Close filter panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        filterPanelRef.current &&
        !filterPanelRef.current.contains(e.target) &&
        !e.target.closest(".filter-toggle-button")
      ) {
        setShowFilterPanel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update the filter panel open function to initialize temp filters
  useEffect(() => {
    if (showFilterPanel) {
      setTempStatusFilter(activeFilter);
      setTempRiskFilter(riskFilter);
      setTempTimeFilter(timeFilter);
    }
  }, [showFilterPanel]);

  // Function to determine risk badge color based on risk level
  const getRiskColor = (riskScore) => {
    switch (riskScore.toLowerCase()) {
      case "high":
        return "#FF6B6B"; // Red for high risk
      case "medium":
        return "#FFAB4C"; // Orange for medium risk
      case "low":
        return "#4CBB17"; // Green for low risk
      default:
        return "#64748B"; // Default slate color
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filter) => {
    // Only update the temp status filter
    setTempStatusFilter(filter);
  };

  const handleRiskFilterChange = (filter) => {
    // Only update the temp risk filter
    setTempRiskFilter(filter);
  };

  const handleTimeFilterChange = (filter) => {
    // Only update the temp time filter
    setTempTimeFilter(filter);
  };

  const applyFilters = () => {
    // Apply the temp filters to the actual filters
    setActiveFilter(tempStatusFilter);
    setRiskFilter(tempRiskFilter);
    setTimeFilter(tempTimeFilter);
    setShowFilterPanel(false);
  };

  const resetFilters = () => {
    // Reset both temp and actual filters
    setTempStatusFilter("all");
    setTempRiskFilter("all");
    setTempTimeFilter("all");

    setActiveFilter("all");
    setRiskFilter("all");
    setTimeFilter("all");
    setShowFilterPanel(false);
  };

  const getFilteredPatients = () => {
    // Filter the data
    let filteredData = [...patients];

    // Status filter
    if (activeFilter !== "all") {
      filteredData = filteredData.filter(
        (item) =>
          item.requestStatus.toLowerCase() === activeFilter.toLowerCase()
      );
    }

    // Risk filter
    if (riskFilter !== "all") {
      filteredData = filteredData.filter(
        (item) => item.riskScore.toLowerCase() === riskFilter.toLowerCase()
      );
    }

    // Time filter
    if (timeFilter !== "all") {
      const now = new Date();
      const cutoffDate = new Date();

      switch (timeFilter) {
        case "7days":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "30days":
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case "90days":
          cutoffDate.setDate(now.getDate() - 90);
          break;
        default:
          break;
      }

      if (timeFilter !== "all") {
        filteredData = filteredData.filter(
          (item) => new Date(item.date) >= cutoffDate
        );
      }
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim().replace(/\s+/g, " ");
      filteredData = filteredData.filter(
        (item) =>
          item.patientName
            .toLowerCase()
            .trim()
            .replace(/\s+/g, " ")
            .includes(query) ||
          (item.patientId && item.patientId.toLowerCase().includes(query)) ||
          item.age.toString().includes(query) ||
          item.riskScore.toLowerCase().includes(query) ||
          item.requestStatus.toLowerCase().includes(query) ||
          formatDate(item.date).toLowerCase().includes(query)
      );
    }

    // Sort the data
    filteredData.sort((a, b) => {
      let valueA, valueB;
      let sortOrder = 1;

      switch (activeSortField) {
        case "name-asc":
          return a.patientName.toLowerCase() > b.patientName.toLowerCase()
            ? 1
            : -1;
        case "name-desc":
          return a.patientName.toLowerCase() < b.patientName.toLowerCase()
            ? 1
            : -1;
        case "age-asc":
          return parseInt(a.age || 0) - parseInt(b.age || 0);
        case "age-desc":
          return parseInt(b.age || 0) - parseInt(a.age || 0);
        case "date-desc":
          return new Date(b.date) - new Date(a.date);
        case "date-asc":
          return new Date(a.date) - new Date(b.date);
        case "risk-asc": {
          const riskOrder = { low: 1, medium: 2, high: 3 };
          return (
            (riskOrder[a.riskScore.toLowerCase()] || 0) -
            (riskOrder[b.riskScore.toLowerCase()] || 0)
          );
        }
        case "risk-desc": {
          const riskOrder = { low: 1, medium: 2, high: 3 };
          return (
            (riskOrder[b.riskScore.toLowerCase()] || 0) -
            (riskOrder[a.riskScore.toLowerCase()] || 0)
          );
        }
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    return filteredData;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#FFD700";
      case "scheduled":
        return "#4A90E2";
      case "completed":
        return "#50C878";
      default:
        return "#888888";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <FaClock />;
      case "scheduled":
        return <FaCalendarCheck />;
      case "completed":
        return <FaCheckCircle />;
      default:
        return <FaQuestionCircle />;
    }
  };
  return (
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
                  Manage and track patient mammography screenings and
                  diagnostics
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
                </div>{" "}
                <div className="filter-container">
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
                          className={tempStatusFilter === "all" ? "active" : ""}
                          onClick={() => handleFilterChange("all")}
                        >
                          All Patients
                        </button>
                        <button
                          className={
                            tempStatusFilter === "pending" ? "active" : ""
                          }
                          onClick={() => handleFilterChange("pending")}
                        >
                          Pending
                        </button>
                        <button
                          className={
                            tempStatusFilter === "scheduled" ? "active" : ""
                          }
                          onClick={() => handleFilterChange("scheduled")}
                        >
                          Scheduled
                        </button>
                        <button
                          className={
                            tempStatusFilter === "completed" ? "active" : ""
                          }
                          onClick={() => handleFilterChange("completed")}
                        >
                          Completed
                        </button>
                      </div>

                      <h3>Risk Score</h3>
                      <div className="filter-options">
                        <button
                          className={tempRiskFilter === "all" ? "active" : ""}
                          onClick={() => handleRiskFilterChange("all")}
                        >
                          All Risk Levels
                        </button>
                        <button
                          className={tempRiskFilter === "high" ? "active" : ""}
                          onClick={() => handleRiskFilterChange("high")}
                        >
                          High Risk
                        </button>
                        <button
                          className={
                            tempRiskFilter === "medium" ? "active" : ""
                          }
                          onClick={() => handleRiskFilterChange("medium")}
                        >
                          Medium Risk
                        </button>
                        <button
                          className={tempRiskFilter === "low" ? "active" : ""}
                          onClick={() => handleRiskFilterChange("low")}
                        >
                          Low Risk
                        </button>
                      </div>

                      <h3>Time Period</h3>
                      <div className="filter-options">
                        <button
                          className={tempTimeFilter === "all" ? "active" : ""}
                          onClick={() => handleTimeFilterChange("all")}
                        >
                          All Time
                        </button>
                        <button
                          className={tempTimeFilter === "7days" ? "active" : ""}
                          onClick={() => handleTimeFilterChange("7days")}
                        >
                          Last 7 Days
                        </button>
                        <button
                          className={
                            tempTimeFilter === "30days" ? "active" : ""
                          }
                          onClick={() => handleTimeFilterChange("30days")}
                        >
                          Last 30 Days
                        </button>
                        <button
                          className={
                            tempTimeFilter === "90days" ? "active" : ""
                          }
                          onClick={() => handleTimeFilterChange("90days")}
                        >
                          Last 90 Days
                        </button>
                      </div>

                      <div className="filter-actions">
                        <button
                          className="apply-filters"
                          onClick={applyFilters}
                        >
                          Apply Filters
                        </button>
                        <button
                          className="reset-filters"
                          onClick={resetFilters}
                        >
                          Reset
                        </button>
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
                  {
                    patients.filter((p) => p.riskScore.toLowerCase() === "high")
                      .length
                  }
                </div>
                <div className="stat-label">High Risk</div>
              </div>

              <div className="stat-card">
                <div className="stat-value">
                  {
                    patients.filter(
                      (p) => p.requestStatus.toLowerCase() === "pending"
                    ).length
                  }
                </div>
                <div className="stat-label">Pending</div>
              </div>

              <div className="stat-card">
                <div className="stat-value">
                  {
                    patients.filter(
                      (p) => p.requestStatus.toLowerCase() === "scheduled"
                    ).length
                  }
                </div>
                <div className="stat-label">Scheduled</div>
              </div>
            </div>

            {/* Category Filters - Like mobile app's filter buttons */}
            <div className="category-filters">
              <button
                className={activeFilter === "all" ? "active" : ""}
                onClick={() => handleFilterChange("all")}
              >
                All Patients
                <span className="filter-count">{patients.length}</span>
              </button>
              <button
                className={activeFilter === "pending" ? "active" : ""}
                onClick={() => handleFilterChange("pending")}
              >
                Pending
                <span className="filter-count">
                  {
                    patients.filter(
                      (p) => p.requestStatus.toLowerCase() === "pending"
                    ).length
                  }
                </span>
              </button>
              <button
                className={activeFilter === "scheduled" ? "active" : ""}
                onClick={() => handleFilterChange("scheduled")}
              >
                Scheduled
                <span className="filter-count">
                  {
                    patients.filter(
                      (p) => p.requestStatus.toLowerCase() === "scheduled"
                    ).length
                  }
                </span>
              </button>
              <button
                className={activeFilter === "completed" ? "active" : ""}
                onClick={() => handleFilterChange("completed")}
              >
                Completed
                <span className="filter-count">
                  {
                    patients.filter(
                      (p) => p.requestStatus.toLowerCase() === "completed"
                    ).length
                  }
                </span>
              </button>

              <div className="sort-controls">
                <div className="sort-label">Sort by:</div>
                <select
                  className="sort-dropdown"
                  value={activeSortField}
                  onChange={(e) => {
                    setActiveSortField(e.target.value);
                  }}
                >
                  <option value="date-desc">Date (newest first)</option>
                  <option value="date-asc">Date (oldest first)</option>
                  <option value="name-asc">Patient Name (Ascending)</option>
                  <option value="name-desc">Patient Name (Descending)</option>
                  <option value="risk-asc">Risk Score (low to high)</option>
                  <option value="risk-desc">Risk Score (high to low)</option>
                  <option value="age-asc">Age (low to high)</option>
                  <option value="age-desc">Age (high to low)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Patient Cards Grid - Mobile app style */}
          <div className="patient-cards-grid">
            {getFilteredPatients().map((patient) => (
              <div key={patient.id} className="patient-card">
                {" "}
                <div className="patient-card-header">
                  <div className="patient-image-container">
                    <img
                      src={patient.imageUrl}
                      alt={patient.patientName}
                      className="patient-image"
                    />
                    <div
                      className="risk-badge"
                      style={{
                        backgroundColor: getRiskColor(patient.riskScore),
                      }}
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
                      {patient.highlightSymptoms
                        .slice(0, 2)
                        .map((symptom, idx) => (
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
                <div className="patient-card-actions">
                  {" "}
                  <div
                    className="status-badge"
                    style={{
                      backgroundColor: `${getStatusColor(
                        patient.requestStatus
                      )}20`,
                      color: getStatusColor(patient.requestStatus),
                    }}
                  >
                    <span className="status-icon">
                      {getStatusIcon(patient.requestStatus)}
                    </span>
                    <span className="status-text">
                      {patient.requestStatus.charAt(0).toUpperCase() +
                        patient.requestStatus.slice(1)}
                    </span>
                    <div className="tooltip">
                      <span className="tooltip-title">
                        {patient.requestStatus.charAt(0).toUpperCase() +
                          patient.requestStatus.slice(1)}{" "}
                        Status
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
                        {patient.requestStatus === "pending" && (
                          <div className="tooltip-info-item">
                            <span className="tooltip-label">
                              Est. Completion:
                            </span>
                            <span>24-48 hours</span>
                          </div>
                        )}
                        {patient.requestStatus === "completed" && (
                          <div className="tooltip-info-item">
                            <span className="tooltip-label">Completed On:</span>
                            <span>{formatDate(patient.date)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/mammo-profile/${patient.id}?requestId=${patient.requestId}&status=${patient.requestStatus}`}
                    className="view-button"
                  >
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
        </div>
      )}
    </>
  );
}

export default MammoList;

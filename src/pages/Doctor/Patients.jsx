import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import LoadingScreen from "../../components/LoadingScreen";
import { apiService } from "../../services/api";
import "../../styles/Doctor/Patients.css";

function Patients() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });
  const [totalPatients, setTotalPatients] = useState(143);
  const [allPatients, setAllPatients] = useState([]);

  const headerRef = useRef(null);
  const tableRef = useRef(null);
  const qrCodeRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    // Set loading state
    setIsLoading(true);

    // Fetch patient data from API
    const fetchPatients = async () => {
      try {
        const response = await apiService.patientDoctorService.getMyPatients();

        console.log("Patient Page starts ---- ");

        // console.log("response", response);

        const patientData = response.data;
        // Format the patient data exactly as in the mobile app - only using these specific fields
        const formattedPatients = patientData.map((patient) => ({
          id: patient?.id || "",
          name: patient?.name,
          lastAppointment: "N/A",
          location: patient?.address?.city || "N/A",
          image: patient?.image || "",
          session: patient.session,
          patient: patient,
          requestId: patient.requestId,
          age: patient.age || "N/A",
          gender: patient?.gender || "N/A",
          medicalConditions: patient?.medicalConditions || [],

          // Additional fields needed for web display
          profileImage: patient?.image || "",
          status: patient.session === "current" ? "Active" : "Previous",
          date: patient?.date || "N/A",
        }));

        setAllPatients(formattedPatients);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setIsLoading(false);
      }
    };
    const fetchProfile = async () => {
      try {
        const response = await apiService.doctorService.getProfile();
        console.log("Fetched profile:", response.data);
        setPatientId(response.data?.data?.UDI_id || "No ID");
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();

    fetchPatients();
  }, []);

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return null;

    try {
      const date = new Date(dateString);
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${
        months[date.getMonth()]
      } ${date.getDate()}, ${date.getFullYear()}`;
    } catch (e) {
      return dateString; // Return as is if already formatted
    }
  };

  useEffect(() => {
    if (!isLoading) {
      // Animate header
      if (headerRef.current) {
        headerRef.current.classList.add("header-animated");
      }

      // Animate table with slight delay
      setTimeout(() => {
        if (tableRef.current) {
          tableRef.current.classList.add("table-animated");
          setAnimationComplete(true);
        }
      }, 300);
    }
  }, [isLoading]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
    // Filter patients based on search query
    // This will be automatically reflected in the UI
  };

  const handleViewProfile = (patientId) => {
    navigate(`/patients/${patientId}`);
  };

  const handleEntriesPerPageChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing entries per page
  };

  const openAddPatientModal = () => {
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

  // Function to handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Get filtered and sorted patients
  const getFilteredAndSortedPatients = () => {
    let filteredPatients = [...allPatients];

    // Filter by active tab
    if (activeTab !== "all") {
      filteredPatients = filteredPatients.filter((patient) => {
        if (activeTab === "active") {
          return patient.status.toLowerCase() === "active";
        } else if (activeTab === "new") {
          return patient.status.toLowerCase() === "new";
        }
        return true;
      });
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filteredPatients = filteredPatients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(query) ||
          patient.age.toString().includes(query) ||
          patient.gender.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filteredPatients.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredPatients;
  };

  // Get the filtered and sorted patients list
  const filteredAndSortedPatients = getFilteredAndSortedPatients();

  // Update total patients count with useEffect to avoid render loop
  useEffect(() => {
    setTotalPatients(filteredAndSortedPatients.length);
  }, [filteredAndSortedPatients.length, searchQuery, activeTab]);

  // Get the paginated patients for display
  const indexOfLastRecord = currentPage * entriesPerPage;
  const indexOfFirstRecord = indexOfLastRecord - entriesPerPage;
  const displayedPatients = filteredAndSortedPatients.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  // Status styling
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "status-active";
      case "new":
        return "status-new";
      case "critical":
        return "status-critical";
      case "stable":
        return "status-stable";
      default:
        return "";
    }
  };

  // Function to extract initials from patient name
  const getPatientInitials = (name) => {
    if (!name) return "";

    const nameParts = name.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();

    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  // Function to generate a colored background based on name
  const getInitialsAvatar = (name) => {
    // This is a fallback if you still want to use an image
    // But it's better to use the CSS approach with the div
    const colors = [
      "#1abc9c",
      "#2ecc71",
      "#3498db",
      "#9b59b6",
      "#34495e",
      "#16a085",
      "#27ae60",
      "#2980b9",
      "#8e44ad",
      "#2c3e50",
      "#f1c40f",
      "#e67e22",
      "#e74c3c",
      "#ecf0f1",
      "#95a5a6",
    ];

    // Generate a consistent color based on name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const color = colors[Math.abs(hash) % colors.length];

    // For advanced implementation, you could generate a data URL with a canvas
    // but for simplicity, we'll return empty (the div approach is better)
    return "";
  };

  return (
    <div className="patients-container">
      <LoadingScreen show={isLoading} message="Loading patient records..." />

      <main className="patients-main">
        <div className="patients-header" ref={headerRef}>
          <h1 className="patients-title">Patient Records</h1>
          <div className="patients-actions">
            <div className="patients-search">
              <input
                type="text"
                placeholder="Search patients by name, diagnosis, ID..."
                value={searchQuery}
                onChange={handleSearch}
              />
              <span className="search-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
              </span>
            </div>
            <button
              className="patients-button pulse-animation"
              onClick={openAddPatientModal}
            >
              <span>+ Add Patient</span>
            </button>
          </div>
        </div>

        <div className="patients-stats">
          <div className="stat-item slide-in-item">
            <div className="stat-value">{allPatients?.length}</div>
            <div className="stat-label">Total Patients</div>
          </div>
          <div className="stat-item slide-in-item delay-1">
            <div className="stat-value">
              {allPatients?.filter(
                (patient) => patient.session?.toLowerCase() === "current"
              ).length || 0}
            </div>
            <div className="stat-label">In Treatment</div>
          </div>
          <div className="stat-item slide-in-item delay-2">
            <div className="stat-value">
              {" "}
              {(() => {
                // Get current date and month
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();

                // Filter patients from current month
                return allPatients.filter((patient) => {
                  if (!patient.date) return false;
                  const patientDate = new Date(patient.date);
                  return (
                    patientDate.getMonth() === currentMonth &&
                    patientDate.getFullYear() === currentYear
                  );
                }).length;
              })()}
            </div>
            <div className="stat-label">New This Month</div>
          </div>
          <div className="stat-item slide-in-item delay-3">
            <div className="stat-value">
              {allPatients?.filter(
                (patient) => patient.session?.toLowerCase() === "current"
              ).length || 0}
            </div>
            <div className="stat-label">Critical</div>
          </div>
        </div>

        <div className="patients-tabs">
          <button
            className={`tab-button ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Patients
          </button>
          <button
            className={`tab-button ${activeTab === "active" ? "active" : ""}`}
            onClick={() => setActiveTab("active")}
          >
            Active Treatment
          </button>
          <button
            className={`tab-button ${activeTab === "new" ? "active" : ""}`}
            onClick={() => setActiveTab("new")}
          >
            New Patients
          </button>
        </div>

        <div className="patients-table-container" ref={tableRef}>
          {displayedPatients.length === 0 ? (
            <div className="no-patients-section">
              <div className="no-patients-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                </svg>
              </div>
              <h3>No Patients Found</h3>
              <p>There are no patients in your records at the moment.</p>
              <button
                className="add-patient-button"
                onClick={openAddPatientModal}
              >
                <span>+ Add Your First Patient</span>
              </button>
            </div>
          ) : (
            <table className="patients-table">
              <thead>
                <tr>
                  <th
                    onClick={() => requestSort("name")}
                    style={{ textAlign: "left", paddingLeft: "20px" }}
                  >
                    Patient
                    {sortConfig.key === "name" && (
                      <span className={`sort-arrow ${sortConfig.direction}`} />
                    )}
                  </th>
                  <th
                    onClick={() => requestSort("age")}
                    style={{ textAlign: "center", minWidth: "80px" }}
                  >
                    Age
                    {sortConfig.key === "age" && (
                      <span className={`sort-arrow ${sortConfig.direction}`} />
                    )}
                  </th>
                  <th
                    onClick={() => requestSort("medicalConditions")}
                    style={{ textAlign: "center" }}
                  >
                    Medical Conditions
                    {sortConfig.key === "medicalConditions" && (
                      <span className={`sort-arrow ${sortConfig.direction}`} />
                    )}
                  </th>
                  {/* <th
                    onClick={() => requestSort("location")}
                    style={{ textAlign: "center" }}
                  >
                    Location
                    {sortConfig.key === "location" && (
                      <span className={`sort-arrow ${sortConfig.direction}`} />
                    )}
                  </th> */}
                  {/* <th
                    onClick={() => requestSort("lastAppointment")}
                    style={{ textAlign: "center" }}
                  >
                    Last Visit
                    {sortConfig.key === "lastAppointment" && (
                      <span className={`sort-arrow ${sortConfig.direction}`} />
                    )}
                  </th> */}
                  <th
                    onClick={() => requestSort("status")}
                    style={{ textAlign: "center" }}
                  >
                    Status
                    {sortConfig.key === "status" && (
                      <span className={`sort-arrow ${sortConfig.direction}`} />
                    )}
                  </th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedPatients.map((patient, index) => (
                  <tr
                    key={patient.id}
                    className={`table-row-animated delay-${index % 5}`}
                  >
                    <td>
                      <div className="patient-profile">
                        {patient.image || patient.profileImage ? (
                          <img
                            src={patient.image || patient.profileImage}
                            alt={`${patient.name}'s profile`}
                            className="patient-avatar"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = getInitialsAvatar(patient.name);
                            }}
                          />
                        ) : (
                          <div className="patient-avatar initials-avatar">
                            {getPatientInitials(patient.name)}
                          </div>
                        )}
                        <div className="patient-details">
                          <span className="patient-name">{patient.name}</span>
                          <span className="patient-gender">
                            {patient.gender}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="patient-age">{patient.age} years</span>
                    </td>
                    <td className="text-center">
                      {patient.medicalConditions &&
                      patient.medicalConditions.length > 0 ? (
                        <div className="conditions-container">
                          {patient.medicalConditions
                            .slice(0, 2)
                            .map((condition, idx) => (
                              <span key={idx} className="condition-badge">
                                {condition}
                              </span>
                            ))}
                          {patient.medicalConditions.length > 2 && (
                            <span className="conditions-more">
                              +{patient.medicalConditions.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="no-conditions">No conditions</span>
                      )}
                    </td>
                    {/* <td className="text-center">
                      <div className="location-container">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                          className="location-icon"
                        >
                          <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                        </svg>
                        <span className="location-text">
                          {patient.location || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="appointment-text">
                        {patient.lastAppointment}
                      </span>
                    </td> */}
                    <td className="text-center">
                      <span
                        className={`status-pill ${getStatusClass(
                          patient.status
                        )}`}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="view-profile-button"
                        onClick={() => handleViewProfile(patient.id)}
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {displayedPatients.length > 0 && (
            <div className="pagination-container">
              <div className="pagination-controls">
                <div className="entries-dropdown">
                  <label htmlFor="entries-select">Show entries: </label>
                  <select
                    id="entries-select"
                    value={entriesPerPage}
                    onChange={handleEntriesPerPageChange}
                    className="entries-select"
                  >
                    <option value="6">6</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
                <div className="pagination-info">
                  Showing{" "}
                  {displayedPatients.length === 0
                    ? 0
                    : Math.min(
                        (currentPage - 1) * entriesPerPage + 1,
                        totalPatients
                      )}
                  -{Math.min(currentPage * entriesPerPage, totalPatients)} of{" "}
                  {totalPatients} patients
                </div>
              </div>
              <div className="pagination">
                <button
                  className="pagination-button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  Previous
                </button>
                {(() => {
                  const totalPages = Math.ceil(totalPatients / entriesPerPage);
                  let pageNumbers = [];

                  // Always show first page
                  pageNumbers.push(1);

                  // Current page and surrounding pages
                  for (
                    let i = Math.max(2, currentPage - 1);
                    i <= Math.min(totalPages - 1, currentPage + 1);
                    i++
                  ) {
                    if (pageNumbers.indexOf(i) === -1) {
                      pageNumbers.push(i);
                    }
                  }

                  // Always show last page if there are more than 1 page
                  if (totalPages > 1) {
                    pageNumbers.push(totalPages);
                  }

                  // Sort page numbers
                  pageNumbers.sort((a, b) => a - b);

                  // Add ellipses
                  const result = [];
                  let prev = 0;

                  for (const num of pageNumbers) {
                    if (num - prev > 1) {
                      result.push("...");
                    }
                    result.push(num);
                    prev = num;
                  }

                  return result.map((item, index) =>
                    typeof item === "number" ? (
                      <button
                        key={index}
                        className={`pagination-button ${
                          currentPage === item ? "active" : ""
                        }`}
                        onClick={() => setCurrentPage(item)}
                      >
                        {item}
                      </button>
                    ) : (
                      <span key={index} className="pagination-ellipsis">
                        {item}
                      </span>
                    )
                  );
                })()}
                <button
                  className="pagination-button"
                  disabled={
                    currentPage === Math.ceil(totalPatients / entriesPerPage) ||
                    totalPatients === 0
                  }
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        Math.ceil(totalPatients / entriesPerPage)
                      )
                    )
                  }
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>My QR Code</h2>
            <div ref={qrCodeRef}>
              <QRCodeSVG value={patientId} size={256} />
            </div>
            <p>UDI ID: {patientId}</p>
            <div className="button-container">
              <button onClick={copyToClipboard}>
                {isCopied ? "Copied!" : "Copy ID"}
              </button>
              <button onClick={downloadQRCode}>Download QR Code</button>
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Patients;

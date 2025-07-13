import { useState, useEffect } from "react";
import {
  useParams,
  Link,
  useNavigate,
  Route,
  useLocation,
} from "react-router-dom";
import {
  FaUser,
  FaArrowLeft,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaHeartbeat,
  FaUserFriends,
  FaBriefcaseMedical,
  FaChevronUp,
  FaChevronDown,
  FaFileMedicalAlt,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import LoadingScreen from "../../components/LoadingScreen";
import "../../styles/Doctor/MammoProfile.css";
import apiService from "../../services/api";

function MammoProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const requestId = queryParams.get("requestId");
  const status = queryParams.get("status");
  const [isLoading, setIsLoading] = useState(true);
  const [patient, setPatient] = useState(null);

  // State to track expanded sections
  const [expandedSections, setExpandedSections] = useState({
    patientInfo: true,
    breastHealth: true,
    familyCancerHistory: true,
    medicalHistory: true,
    treatmentDecision: true,
    menstrualHistory: false,
    reproductiveHistory: false,
  });

  // Toggle section expansion
  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  // Function to fetch patient data from API
  const fetchPatientData = async () => {
    try {
      setIsLoading(true);
      // Get patient details from the API
      const response =
        await apiService.patientDoctorService.getPatientRequestById(id);

      if (response.status === 200) {
        console.log("Patient data fetched successfully:", response.data.data);
        setPatient(response.data.data);
        setIsLoading(false);
      } else {
        console.error("Failed to fetch patient data:", response);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [id]);

  // Components for displaying sections

  // Collapsible Section Component
  const CollapsibleSection = ({
    title,
    icon,
    sectionKey,
    children,
    isEmpty = false,
    summary = null,
  }) => {
    const isExpanded = expandedSections[sectionKey];

    return (
      <div className={`collapsible-section ${isEmpty ? "empty-section" : ""}`}>
        <div
          className="section-header"
          onClick={() => toggleSection(sectionKey)}
        >
          <div className="section-title-wrapper">
            {icon}
            <h3 className="section-title">{title}</h3>

            {isEmpty && <span className="empty-badge">No Data</span>}

            {summary && !isEmpty && (
              <span className="summary-badge">{summary}</span>
            )}
          </div>

          {isExpanded ? (
            <FaChevronUp className="toggle-icon" />
          ) : (
            <FaChevronDown className="toggle-icon" />
          )}
        </div>

        {isExpanded && (
          <div className="section-content">
            {isEmpty ? (
              <p className="empty-content">
                No data available for this section
              </p>
            ) : (
              children
            )}
          </div>
        )}
      </div>
    );
  };

  // Sub-section component for collapsible sub-categories
  const SubSection = ({ title, sectionKey, children }) => {
    const isExpanded = expandedSections[sectionKey];

    return (
      <div className="sub-section">
        <div
          className="sub-section-header"
          onClick={() => toggleSection(sectionKey)}
        >
          <h4 className="sub-section-title">{title}</h4>
          {isExpanded ? (
            <FaChevronUp className="toggle-icon-small" />
          ) : (
            <FaChevronDown className="toggle-icon-small" />
          )}
        </div>

        {isExpanded && <div className="sub-section-content">{children}</div>}
      </div>
    );
  };

  const InfoItem = ({ icon, label, value }) => (
    <div className="info-item">
      {icon}
      <span className="info-label">{label}:</span>
      <span className="info-value">{value || "Not provided"}</span>
    </div>
  );

  const YesNoCard = ({ title, value }) => {
    const isPositive = value === "Yes";
    return (
      <div className={`yes-no-card ${isPositive ? "positive" : "negative"}`}>
        <div className="yes-no-title">{title}</div>
        <div className={`yes-no-badge ${isPositive ? "positive" : "negative"}`}>
          {value}
        </div>
      </div>
    );
  };

  // Card for displaying cancer family history
  const CompactRecordCard = ({ record, type = "regular" }) => (
    <div className="compact-record-card">
      {type === "other" ? (
        <>
          <div className="compact-record-title">
            {record.cancerType}
            {record.cancerTypeOther ? ` (${record.cancerTypeOther})` : ""}
          </div>
          <div className="compact-record-detail">
            {record.relation}
            {record.relationSide ? ` (${record.relationSide})` : ""}
          </div>
        </>
      ) : (
        <>
          <div className="compact-record-title">
            {record.relation}
            {record.relationSide ? ` (${record.relationSide})` : ""}
          </div>
          <div className="compact-record-details">
            <span className="compact-record-detail">
              {record.familySide || "Not specified"}
            </span>
            {record.ageOfDiagnosis && (
              <span className="compact-record-detail-age">
                Age: {record.ageOfDiagnosis}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );

  const ImagePreview = ({ images, title }) => {
    if (!images || images.length === 0) return null;

    return (
      <div className="image-preview-container">
        <h4 className="image-preview-title">{title}</h4>
        <div className="image-scroll">
          {images.map((image, index) => (
            <div key={index} className="image-item">
              <img
                src={image.uri}
                alt={image.label || `Image ${index + 1}`}
                className="preview-image"
              />
              {image.label && (
                <div className="image-label">
                  {image.label || `Image ${index + 1}`}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Calculate summary counts for each section
  const getBreastHealthSummary = () => {
    if (!patient || !patient.medicalData.breastHealth) return null;

    let positiveCount = 0;

    if (patient.medicalData?.breastHealth.haveLumps === "Yes") positiveCount++;
    if (patient.medicalData?.breastHealth.havePain === "Yes") positiveCount++;
    if (patient.medicalData?.breastHealth.changeInNipple === "Yes")
      positiveCount++;
    if (patient.medicalData?.breastHealth.haveRashes === "Yes") positiveCount++;
    if (patient.medicalData?.breastHealth.haveSwelling === "Yes")
      positiveCount++;
    if (patient.medicalData?.breastHealth.haveItching === "Yes")
      positiveCount++;

    return `${positiveCount}/6 positive`;
  };

  const getFamilyCancerSummary = () => {
    // First, check if both patient and medicalData exist
    if (
      !patient ||
      !patient.medicalData ||
      !patient.medicalData.familyCancerHistory
    ) {
      return null;
    }

    let affectedCount = 0;
    let totalTypes = 0;

    const { familyCancerHistory } = patient.medicalData;

    // Add null checks for each property access
    if (familyCancerHistory.breastCancer === "Yes") {
      affectedCount += familyCancerHistory.breastCancerRecords?.length || 0;
      totalTypes++;
    }

    if (familyCancerHistory.ovarianCancer === "Yes") {
      affectedCount += familyCancerHistory.ovarianCancerRecords?.length || 0;
      totalTypes++;
    }

    if (familyCancerHistory.cervicalCancer === "Yes") {
      affectedCount += familyCancerHistory.cervicalCancerRecords?.length || 0;
      totalTypes++;
    }

    if (familyCancerHistory.otherCancer === "Yes") {
      affectedCount += familyCancerHistory.otherCancerRecords?.length || 0;
      totalTypes++;
    }

    return `${totalTypes} types, ${affectedCount} relatives`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const getBiradsLabel = (birads) => {
    if (birads === 0) return "Pending";
    return `BIRADS ${birads}`;
  };

  const confirmTreatmentDecision = async (needsTreatment) => {
    const message = needsTreatment
      ? "Are you sure you want to recommend further treatment for this patient?"
      : "Are you sure this patient does not need further treatment?";

    if (window.confirm(message)) {
      try {
        // Call the API to update the patient's treatment status
        const response = needsTreatment
          ? await apiService.patientDoctorService.acceptPatientRequest(
              requestId
            )
          : await apiService.patientDoctorService.rejectPatientRequest(
              requestId
            );

        console.log("Treatment decision response:", response);

        if (response.status === 200) {
          const successMessage = needsTreatment
            ? "The patient has been marked for further treatment."
            : "The patient has been marked as not needing further treatment.";

          alert(successMessage);
          // navigate goback
          navigate(-1);
        } else {
          alert("Failed to record decision. Please try again.");
        }
      } catch (error) {
        console.error("Error recording treatment decision:", error);
        alert("Failed to record decision. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <LoadingScreen show={isLoading} message="Loading patient details..." />
    );
  }

  if (!patient) {
    return (
      <div className="error-container">
        <h2>Patient Not Found</h2>
        <p>We couldn't find the patient information you're looking for.</p>
        <Link to="/mammo-list" className="back-button">
          <FaArrowLeft /> Back to Mammography List
        </Link>
      </div>
    );
  }

  return (
    <div className="mammo-profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="header-content">
          <Link to="/mammo-list" className="back-button">
            <FaArrowLeft /> Back to List
          </Link>
          <h1 className="header-title">Patient Mammography Details</h1>
          <div className="patient-id-badge">ID: {patient.patientId}</div>
        </div>
      </div>

      <div className="profile-content">
        {/* Patient Basic Info Card */}
        <div className="patient-info-card">
          <div className="patient-info-header">
            <div className="patient-avatar">
              {patient.profileImage ? (
                <img
                  src={patient.profileImage}
                  alt={`${patient.name}'s profile`}
                  onError={(e) => {
                    e.target.onerror = null;
                    // If image fails to load, display initials instead
                    e.target.style.display = "none";
                    e.target.parentNode.classList.add("avatar-text");
                    e.target.parentNode.innerHTML = patient.name
                      .split(" ")
                      .map((name) => name[0])
                      .join("")
                      .toUpperCase()
                      .substring(0, 2);
                  }}
                />
              ) : (
                <span className="avatar-text">
                  {patient.name
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .toUpperCase()
                    .substring(0, 2)}
                </span>
              )}
            </div>
            <div className="patient-header-info">
              <h2 className="patient-name">{patient.name}</h2>
              <div className="patient-meta-info">
                <div className="meta-info-badge">
                  <FaUser className="meta-icon" />
                  <span>{patient.age} years</span>
                </div>
                <div className="meta-info-badge">
                  <span>{patient.gender}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="patient-details-section">
            <div className="detail-row">
              <div className="detail-item">
                <div className="detail-label">Date of Birth</div>
                <div className="detail-value">{formatDate(patient.dob)}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Report Date</div>
                <div className="detail-value">
                  {formatDate(patient.reportDate)}
                </div>
              </div>
            </div>
          </div>

          {patient.mammogramData ? (
            <div className="mammogram-overview">
              <div className="overview-title">Current Mammogram</div>
              <div className="overview-stats">
                <div className="overview-stat-item">
                  <div className="stat-label">Date</div>
                  <div className="stat-value">
                    {formatDate(patient.mammogramData.date)}
                  </div>
                </div>
                <div className="overview-stat-item">
                  <div className="stat-label">Type</div>
                  <div className="stat-value">
                    {patient.mammogramData.type || "Standard"}
                  </div>
                </div>
                <div className="overview-stat-item">
                  <div className="stat-label">Category</div>
                  <div className="stat-value category-badge">
                    {patient.mammogramData.category || "Screening"}
                  </div>
                </div>
                <div className="overview-stat-item">
                  <div className="stat-label">BIRADS</div>
                  <div
                    className={`stat-value birads-badge birads-${
                      patient.mammogramData.birads || 0
                    }`}
                  >
                    {getBiradsLabel(patient.mammogramData.birads || 0)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-mammogram-info">
              <div className="no-data-message">No mammogram data available</div>
            </div>
          )}

          <div className="contact-info-container">
            <InfoItem
              icon={<FaPhone className="info-icon" />}
              label="Phone"
              value={patient.contact}
            />
            <InfoItem
              icon={<FaEnvelope className="info-icon" />}
              label="Email"
              value={patient.email}
            />
            <InfoItem
              icon={<FaMapMarkerAlt className="info-icon" />}
              label="Address"
              value={patient.address}
            />
          </div>
        </div>

        {/* Breast Health Section */}
        <div className="details-card">
          <CollapsibleSection
            title="Breast Health Assessment"
            icon={<FaHeartbeat className="section-icon" />}
            sectionKey="breastHealth"
            isEmpty={!patient.medicalData?.breastHealth}
            summary={getBreastHealthSummary()}
          >
            <div className="breast-health-grid">
              <div className="yes-no-row">
                <YesNoCard
                  title="Has Lumps"
                  value={patient.medicalData?.breastHealth?.haveLumps || "No"}
                />
                <YesNoCard
                  title="Has Pain"
                  value={patient.medicalData?.breastHealth?.havePain || "No"}
                />
                <YesNoCard
                  title="Nipple Changes"
                  value={
                    patient.medicalData?.breastHealth?.changeInNipple || "No"
                  }
                />
              </div>
              <div className="yes-no-row">
                <YesNoCard
                  title="Has Rashes"
                  value={patient.medicalData?.breastHealth?.haveRashes || "No"}
                />
                <YesNoCard
                  title="Has Swelling"
                  value={
                    patient.medicalData?.breastHealth?.haveSwelling || "No"
                  }
                />
                <YesNoCard
                  title="Has Itching"
                  value={patient.medicalData?.breastHealth?.haveItching || "No"}
                />
              </div>
            </div>

            {patient.medicalData?.breastHealth?.havePain === "Yes" && (
              <div className="pain-container">
                <div className="pain-header">
                  <h4 className="pain-title">Pain Assessment</h4>
                  <div className="pain-level-badge">
                    Level: {patient.medicalData?.breastHealth.painLevel}/5
                  </div>
                </div>
                <div className="pain-scale-bar">
                  <div
                    className="pain-scale-fill"
                    style={{
                      width: `${
                        (patient.medicalData?.breastHealth.painLevel / 5) * 100
                      }%`,
                    }}
                  ></div>
                </div>

                {/* Pain breast side information */}
                {patient.medicalData?.breastHealth.painBreastSide?.length >
                  0 && (
                  <div className="pain-side-section">
                    <div className="pain-side-label">Affected Side:</div>
                    <div className="pain-side-badges">
                      {patient.medicalData?.breastHealth.painBreastSide.map(
                        (side, index) => (
                          <div key={index} className="pain-side-badge">
                            {side}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Pain locations section */}
                <div className="pain-location-section">
                  <h4 className="location-section-title">Pain Locations:</h4>

                  <div className="locations-row">
                    {patient.medicalData?.breastHealth.leftBreastLocations
                      ?.length > 0 && (
                      <div className="breast-location-card">
                        <h5 className="breast-side-title">Left Breast</h5>
                        <div className="location-badges">
                          {patient.medicalData?.breastHealth.leftBreastLocations.map(
                            (loc, idx) => (
                              <div key={idx} className="location-badge">
                                {loc.replace("Left", "")}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {patient.medicalData?.breastHealth.rightBreastLocations
                      ?.length > 0 && (
                      <div className="breast-location-card">
                        <h5 className="breast-side-title">Right Breast</h5>
                        <div className="location-badges">
                          {patient.medicalData?.breastHealth.rightBreastLocations.map(
                            (loc, idx) => (
                              <div key={idx} className="location-badge">
                                {loc.replace("Right", "")}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Images Section */}
            <div className="images-section">
              <h4 className="images-section-title">Diagnostic Images</h4>
              <div className="image-galleries">
                {/* Mammogram Images */}
                <ImagePreview
                  images={patient.images?.mammograms}
                  title="Mammogram Images"
                />

                {/* Lump Images */}
                <ImagePreview
                  images={patient.images?.lumpImages}
                  title="Ultrasound Images"
                />

                {/* Swelling Images */}
                <div className="swelling-images-row">
                  {patient.images?.swellingImages?.left?.length > 0 && (
                    <ImagePreview
                      images={patient.images.swellingImages.left}
                      title="Left Breast Swelling"
                    />
                  )}

                  {patient.images?.swellingImages?.right?.length > 0 && (
                    <ImagePreview
                      images={patient.images.swellingImages.right}
                      title="Right Breast Swelling"
                    />
                  )}
                </div>
              </div>
            </div>
          </CollapsibleSection>
        </div>

        {/* Family Cancer History */}
        <div className="details-card">
          <CollapsibleSection
            title="Family Cancer History"
            icon={<FaUserFriends className="section-icon" />}
            sectionKey="familyCancerHistory"
            isEmpty={!patient.medicalData?.familyCancerHistory}
            summary={getFamilyCancerSummary()}
          >
            <div className="cancer-history-row">
              <YesNoCard
                title="Breast Cancer"
                value={
                  patient.medicalData?.familyCancerHistory?.breastCancer || "No"
                }
              />
              <YesNoCard
                title="Ovarian Cancer"
                value={
                  patient.medicalData?.familyCancerHistory?.ovarianCancer ||
                  "No"
                }
              />
              <YesNoCard
                title="Cervical Cancer"
                value={
                  patient.medicalData?.familyCancerHistory?.cervicalCancer ||
                  "No"
                }
              />
              <YesNoCard
                title="Other Cancers"
                value={
                  patient.medicalData?.familyCancerHistory?.otherCancer || "No"
                }
              />
            </div>

            {/* Show cancer records */}
            {patient.medicalData?.familyCancerHistory?.breastCancer === "Yes" &&
              patient.medicalData?.familyCancerHistory?.breastCancerRecords
                ?.length > 0 && (
                <div className="cancer-records-container">
                  <h4 className="records-title">
                    Breast Cancer Family History:
                  </h4>
                  <div className="compact-records-grid">
                    {patient.medicalData?.familyCancerHistory.breastCancerRecords.map(
                      (record, index) => (
                        <CompactRecordCard key={index} record={record} />
                      )
                    )}
                  </div>
                </div>
              )}

            {patient.medicalData?.familyCancerHistory?.otherCancer === "Yes" &&
              patient.medicalData?.familyCancerHistory?.otherCancerRecords
                ?.length > 0 && (
                <div className="cancer-records-container">
                  <h4 className="records-title">Other Cancer Types:</h4>
                  <div className="compact-records-grid">
                    {patient.medicalData?.familyCancerHistory.otherCancerRecords.map(
                      (record, index) => (
                        <CompactRecordCard
                          key={index}
                          record={record}
                          type="other"
                        />
                      )
                    )}
                  </div>
                </div>
              )}
          </CollapsibleSection>
        </div>

        {/* Medical History */}
        <div className="details-card">
          <CollapsibleSection
            title="Medical History"
            icon={<FaBriefcaseMedical className="section-icon" />}
            sectionKey="medicalHistory"
            isEmpty={!patient.medicalData?.medicalHistory}
          >
            {/* Menstrual History */}
            {patient.medicalData?.medicalHistory?.MenstrualHistory && (
              <SubSection
                title="Menstrual History"
                sectionKey="menstrualHistory"
              >
                <div className="medical-compact-grid">
                  <div className="medical-compact-row">
                    <div className="medical-compact-col">
                      <div className="medical-label">Menstruation Started:</div>
                      <div className="medical-value">
                        {patient.medicalData?.medicalHistory.MenstrualHistory
                          .menstruationStarted || "No"}
                        {patient.medicalData?.medicalHistory.MenstrualHistory
                          .menstruationStarted === "Yes" &&
                          patient.medicalData?.medicalHistory.MenstrualHistory
                            .menstruationStartedAge &&
                          ` (Age: ${patient.medicalData?.medicalHistory.MenstrualHistory.menstruationStartedAge})`}
                      </div>
                    </div>
                    <div className="medical-compact-col">
                      <div className="medical-label">Regular Cycle:</div>
                      <div className="medical-value">
                        {patient.medicalData?.medicalHistory.MenstrualHistory
                          .menstrualcycle || "No"}
                      </div>
                    </div>
                  </div>

                  {patient.medicalData?.medicalHistory.MenstrualHistory
                    .menopause === "Yes" && (
                    <div className="medical-compact-row">
                      <div className="medical-compact-col">
                        <div className="medical-label">Menopause:</div>
                        <div className="medical-value">
                          Yes
                          {patient.medicalData?.medicalHistory.MenstrualHistory
                            .ageofmenopause &&
                            ` (Age: ${patient.medicalData?.medicalHistory.MenstrualHistory.ageofmenopause})`}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </SubSection>
            )}

            {/* Reproductive History */}
            {patient.medicalData?.medicalHistory?.ReproductiveHistory && (
              <SubSection
                title="Reproductive History"
                sectionKey="reproductiveHistory"
              >
                <div className="medical-compact-grid">
                  <div className="medical-compact-row">
                    <div className="medical-compact-col">
                      <div className="medical-label">Pregnancy:</div>
                      <div className="medical-value">
                        {patient.medicalData?.medicalHistory.ReproductiveHistory
                          .pregnancy || "No"}
                        {patient.medicalData?.medicalHistory.ReproductiveHistory
                          .pregnancy === "Yes" &&
                          patient.medicalData?.medicalHistory
                            .ReproductiveHistory.numofpregnancy &&
                          ` (${patient.medicalData?.medicalHistory.ReproductiveHistory.numofpregnancy})`}
                      </div>
                    </div>
                    <div className="medical-compact-col">
                      <div className="medical-label">
                        First Pregnancy Before 30:
                      </div>
                      <div className="medical-value">
                        {patient.medicalData?.medicalHistory.ReproductiveHistory
                          .firstpregbef30 || "No"}
                      </div>
                    </div>
                  </div>

                  <div className="medical-compact-row">
                    <div className="medical-compact-col">
                      <div className="medical-label">Breastfeeding:</div>
                      <div className="medical-value">
                        {patient.medicalData?.medicalHistory.ReproductiveHistory
                          .breastfed || "No"}
                        {patient.medicalData?.medicalHistory.ReproductiveHistory
                          .breastfed === "Yes" &&
                          patient.medicalData?.medicalHistory
                            .ReproductiveHistory.duration &&
                          ` (${patient.medicalData?.medicalHistory.ReproductiveHistory.duration})`}
                      </div>
                    </div>
                    <div className="medical-compact-col">
                      <div className="medical-label">Children:</div>
                      <div className="medical-value">
                        {patient.medicalData?.medicalHistory.ReproductiveHistory
                          .numofkids || "0"}
                      </div>
                    </div>
                  </div>
                </div>
              </SubSection>
            )}

            {/* Notes */}
            {patient.medicalData?.medicalHistory?.feedback && (
              <div className="feedback-container">
                <h4 className="feedback-title">Clinical Notes</h4>
                <div className="feedback-text">
                  {patient.medicalData?.medicalHistory.feedback}
                </div>
              </div>
            )}
          </CollapsibleSection>
        </div>

        {/* Treatment Decision */}
        <div className="details-card">
          <CollapsibleSection
            title="Treatment Decision"
            icon={<FaFileMedicalAlt className="section-icon" />}
            sectionKey="treatmentDecision"
            isEmpty={false}
          >
            <h3 className="treatment-heading">Medical Assessment</h3>

            {status === "pending" ? (
              <>
                <p className="treatment-description">
                  Based on the patient's mammography results and health
                  assessment, select the appropriate treatment recommendation:
                </p>

                <div className="treatment-options">
                  <button
                    className="treatment-option-button non-treatment-button"
                    onClick={() => confirmTreatmentDecision(false)}
                  >
                    <div className="option-content">
                      <FaCheckCircle className="option-icon no-treatment" />
                      <div className="option-text-container">
                        <div className="option-title">No Further Treatment</div>
                        <div className="option-description">
                          Patient does not require additional treatment
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    className="treatment-option-button treatment-button"
                    onClick={() => confirmTreatmentDecision(true)}
                  >
                    <div className="option-content">
                      <FaExclamationCircle className="option-icon treatment" />
                      <div className="option-text-container">
                        <div className="option-title treatment">
                          Recommend Treatment
                        </div>
                        <div className="option-description">
                          Patient requires additional medical intervention
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <div className="current-treatment-status">
                <div
                  className={`status-display ${
                    status ? "accepted" : "rejected"
                  }`}
                >
                  <div className="status-icon-large">
                    {status === "accepted" ? (
                      <FaExclamationCircle className="large-icon" />
                    ) : (
                      <FaCheckCircle className="large-icon" />
                    )}
                  </div>
                  <div className="status-text">
                    <h4>
                      {status === "accepted"
                        ? "Treatment Recommended"
                        : "No Further Treatment Required"}
                    </h4>
                  </div>
                </div>
              </div>
            )}

            {/* <div className="next-steps-section">
              <h4 className="next-steps-title">Follow-up Information</h4>
              <div className="next-steps-info">
                <div className="next-step-item">
                  <div className="next-step-label">Next Follow-up:</div>
                  <div className="next-step-value">
                    {patient.mammogramData && patient.mammogramData.nextFollowUp
                      ? formatDate(patient.mammogramData.nextFollowUp)
                      : 'Not scheduled yet'}
                  </div>
                </div>

                <div className="next-step-item">
                  <div className="next-step-label">Recommendations:</div>
                  <div className="next-step-value">
                    {patient.mammogramData && patient.mammogramData.recommendation
                      ? patient.mammogramData.recommendation
                      : 'Schedule follow-up mammogram in 6 months'}
                  </div>
                </div>
              </div>
            </div> */}
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
}

export default MammoProfile;
